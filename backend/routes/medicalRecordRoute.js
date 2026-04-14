import express from 'express';
import { getMedicalRecord, updateMedicalRecord, uploadDocument } from '../controllers/medicalRecordController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const medicalRecordRouter = express.Router();

medicalRecordRouter.post('/get', authUser, getMedicalRecord);
medicalRecordRouter.post('/update', authUser, updateMedicalRecord);
medicalRecordRouter.post('/upload-document', authUser, upload.single('document'), uploadDocument);

export default medicalRecordRouter;
