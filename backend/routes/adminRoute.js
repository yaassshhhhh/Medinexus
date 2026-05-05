import express from 'express'
import { addDoctor, getAllDoctors, loginAdmin, appointmentsAdmin, appointmentCancelAdmin, adminAnalytics, deleteDoctor, toggleDoctorAvailability } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.get('/all-doctors', authAdmin, getAllDoctors)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancelAdmin)
adminRouter.get('/analytics', authAdmin, adminAnalytics)
adminRouter.post('/delete-doctor', authAdmin, deleteDoctor)
adminRouter.post('/toggle-availability', authAdmin, toggleDoctorAvailability)

export default adminRouter
