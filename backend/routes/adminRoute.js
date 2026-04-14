import express from 'express'
import { addDoctor, getAllDoctors, loginAdmin, appointmentsAdmin, appointmentCancelAdmin, adminAnalytics } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.get('/all-doctors', authAdmin, getAllDoctors)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancelAdmin)
adminRouter.get('/analytics', authAdmin, adminAnalytics)

export default adminRouter
