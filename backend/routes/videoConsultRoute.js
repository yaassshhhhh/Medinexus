import express from 'express'
import { bookVideoConsult, listVideoConsults, cancelVideoConsult, getDoctorVideoAppointments } from '../controllers/videoConsultController.js'
import authUser from '../middlewares/authUser.js'
import authDoctor from '../middlewares/authDoctor.js'

const videoConsultRouter = express.Router()

videoConsultRouter.post('/book',                authUser,   bookVideoConsult)
videoConsultRouter.post('/list',                authUser,   listVideoConsults)
videoConsultRouter.post('/cancel',              authUser,   cancelVideoConsult)
videoConsultRouter.post('/doctor-appointments', authDoctor, getDoctorVideoAppointments)

export default videoConsultRouter
