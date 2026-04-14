import mongoose from "mongoose";
import videoConsultModel from "../models/videoConsultModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

// API to book a video consultation
const bookVideoConsult = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime, docName, docImage, docSpeciality } = req.body;

        let docData;
        if (mongoose.Types.ObjectId.isValid(docId)) {
            docData = await doctorModel.findById(docId).select('-password');
        }

        // If no DB doctor found (or ID was static), use the info sent from frontend
        if (!docData) {
            docData = {
                _id: docId,
                name: docName,
                image: docImage,
                speciality: docSpeciality,
                available: true,
                fees: 50, // Default fee for static doctors
                slots_booked: {}
            };
        }

        let slots_booked = docData.slots_booked || {};

        // Checking for slot availability 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        let userData;
        if (userId && userId.startsWith('guest_')) {
            userData = {
                name: 'Guest Patient',
                email: 'guest@example.com',
                image: 'https://via.placeholder.com/150', // Placeholder or default image
                _id: userId
            }
        } else {
            userData = await userModel.findById(userId).select('-password');
            if (!userData) {
                return res.json({ success: false, message: 'User not found' });
            }
        }

        // Don't delete docData.slots_booked here as we need to save the updated one back to the doctor.
        // Also it's good practice not to mutate the fetched object if we are using it for other things unless necessary.
        // We will construct appointment data manually.

        // Generate a unique room ID for the video call
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const meetingLink = `/video-call/${roomId}`;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: { ...docData.toObject(), slots_booked: undefined }, // safely exclude slots from stored doc data
            docName,
            docImage,
            docSpeciality,
            amount: docData.fees || 0,
            slotTime,
            slotDate,
            date: Date.now(),
            roomId,
            meetingLink
        }

        const newAppointment = new videoConsultModel(appointmentData);
        await newAppointment.save();

        // Save new slots data in docData only if it's a real DB doctor
        if (mongoose.Types.ObjectId.isValid(docId)) {
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: 'Video Consultation Booked Successfully', roomId, meetingLink })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get user's video consultations
const listVideoConsults = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await videoConsultModel.find({ userId });
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// API to cancel video consultation
const cancelVideoConsult = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await videoConsultModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        // Verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await videoConsultModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData;
        const docData = await doctorModel.findById(docId);

        if (docData) {
            let slots_booked = docData.slots_booked || {};

            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
                await doctorModel.findByIdAndUpdate(docId, { slots_booked });
            }
        }

        res.json({ success: true, message: 'Consultation Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor's video consultations (for doctor portal)
const getDoctorVideoAppointments = async (req, res) => {
    try {
        const { docId } = req.body
        if (!docId) return res.json({ success: false, message: 'docId required' })
        const appointments = await videoConsultModel.find({ docId, cancelled: false })
            .sort({ date: -1 })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { bookVideoConsult, listVideoConsults, cancelVideoConsult, getDoctorVideoAppointments }
