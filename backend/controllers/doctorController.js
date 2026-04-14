import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })
        if (!doctor) return res.json({ success: false, message: 'Doctor not found' })

        const isMatch = await bcrypt.compare(password, doctor.password)
        if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' })

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
        res.json({ success: true, token, docId: doctor._id, name: doctor.name })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get all appointments for a doctor
const getDoctorAppointments = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Mark appointment as completed
const completeAppointment = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) return res.json({ success: false, message: "Appointment not found" });
        if (appointment.docId !== docId) return res.json({ success: false, message: "Unauthorized" });
        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
        res.json({ success: true, message: "Appointment marked as completed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get doctor earnings summary
const getDoctorEarnings = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId, payment: true, cancelled: false });
        const total = appointments.reduce((sum, a) => sum + (a.amount || 0), 0);
        const completed = appointments.filter(a => a.isCompleted).length;
        res.json({ success: true, totalEarnings: total, paidAppointments: appointments.length, completedAppointments: completed });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { changeAvailablity, doctorList, loginDoctor, getDoctorAppointments, completeAppointment, getDoctorEarnings }
