import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary"
import doctorModel from './../models/doctorModel.js';
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

// API for adding doctor — default password is always 12345678
const addDoctor = async (req, res) => {
    try {
        const { name, email, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        if (!name || !email || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        const DEFAULT_PASSWORD = '12345678'
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })

        const doctorData = {
            name, email,
            image: imageUpload.secure_url,
            password: hashedPassword,
            speciality, degree, experience, about,
            available: true,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        await new doctorModel(doctorData).save()
        res.json({ success: true, message: "Doctor Added. Default password: 12345678" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors (with email for admin)
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API For login admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointments
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin to cancel appointment
const appointmentCancelAdmin = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, getAllDoctors, loginAdmin, appointmentsAdmin, appointmentCancelAdmin }

// API for admin analytics
export const adminAnalytics = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        const doctors = await doctorModel.find({}).select('-password');

        const totalRevenue = appointments.filter(a => a.payment && !a.cancelled)
            .reduce((s, a) => s + (a.amount || 0), 0);

        // Appointments per day (last 30 days)
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentAppts = appointments.filter(a => a.date >= thirtyDaysAgo);
        const byDay = {};
        recentAppts.forEach(a => {
            const d = new Date(a.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            byDay[d] = (byDay[d] || 0) + 1;
        });
        const appointmentTrend = Object.entries(byDay).map(([date, count]) => ({ date, count }));

        // By specialty
        const bySpecialty = {};
        appointments.forEach(a => {
            const s = a.docData?.speciality || 'Other';
            bySpecialty[s] = (bySpecialty[s] || 0) + 1;
        });
        const specialtyBreakdown = Object.entries(bySpecialty).map(([name, value]) => ({ name, value }));

        res.json({
            success: true,
            stats: {
                totalAppointments: appointments.length,
                totalDoctors: doctors.length,
                totalRevenue,
                completedAppointments: appointments.filter(a => a.isCompleted).length,
                cancelledAppointments: appointments.filter(a => a.cancelled).length,
                videoConsults: appointments.filter(a => a.isVideoConsult).length,
            },
            appointmentTrend,
            specialtyBreakdown,
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
