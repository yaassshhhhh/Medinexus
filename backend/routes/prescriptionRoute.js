import express from 'express';
import { createPrescription, getPrescription, getPatientPrescriptions } from '../controllers/prescriptionController.js';
import authDoctor from '../middlewares/authDoctor.js';
import authUser from '../middlewares/authUser.js';

const prescriptionRouter = express.Router();

prescriptionRouter.post('/create', authDoctor, createPrescription);
prescriptionRouter.get('/:appointmentId', getPrescription);
prescriptionRouter.post('/patient', authUser, getPatientPrescriptions);

export default prescriptionRouter;
