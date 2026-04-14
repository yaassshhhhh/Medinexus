import express from 'express'
import { bookVideoConsult, listVideoConsults, cancelVideoConsult, getDoctorVideoAppointments } from '../controllers/videoConsultController.js'

const videoConsultRouter = express.Router()

videoConsultRouter.post('/book', bookVideoConsult)
videoConsultRouter.post('/list', listVideoConsults)
videoConsultRouter.post('/cancel', cancelVideoConsult)
videoConsultRouter.post('/doctor-appointments', getDoctorVideoAppointments)

export default videoConsultRouter
