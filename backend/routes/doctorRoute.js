import express from 'express'
import { doctorList, loginDoctor, getDoctorAppointments, completeAppointment, getDoctorEarnings, changeAvailablity } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.post('/appointments',         authDoctor, getDoctorAppointments)
doctorRouter.post('/complete-appointment', authDoctor, completeAppointment)
doctorRouter.post('/earnings',             authDoctor, getDoctorEarnings)
doctorRouter.post('/change-availability',  authDoctor, changeAvailablity)

export default doctorRouter
