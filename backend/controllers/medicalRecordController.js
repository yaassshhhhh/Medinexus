import medicalRecordModel from '../models/medicalRecordModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Get or create medical record
const getMedicalRecord = async (req, res) => {
    try {
        const { userId } = req.body;

        let record = await medicalRecordModel.findOne({ userId });

        if (!record) {
            record = new medicalRecordModel({ userId });
            await record.save();
        }

        res.json({ success: true, record });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update medical record
const updateMedicalRecord = async (req, res) => {
    try {
        const { userId, ...updateData } = req.body;

        const record = await medicalRecordModel.findOneAndUpdate(
            { userId },
            { ...updateData, updatedAt: Date.now() },
            { new: true, upsert: true }
        );

        res.json({ success: true, message: 'Medical record updated', record });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Upload medical document
const uploadDocument = async (req, res) => {
    try {
        const { userId } = req.body;
        const file = req.file;

        if (!file) {
            return res.json({ success: false, message: 'No file uploaded' });
        }

        // Validate allowed file types
        const ALLOWED_MIME_TYPES = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return res.json({ success: false, message: 'Invalid file type. Only images, PDF, and Word documents are allowed.' });
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            return res.json({ success: false, message: 'File too large. Maximum size is 10MB.' });
        }

        const imageUpload = await cloudinary.uploader.upload(file.path, { resource_type: 'auto' });

        const record = await medicalRecordModel.findOne({ userId });
        if (!record) {
            return res.json({ success: false, message: 'Medical record not found' });
        }

        record.documents.push({
            name: file.originalname,
            url: imageUpload.secure_url
        });

        await record.save();

        res.json({ success: true, message: 'Document uploaded', record });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { getMedicalRecord, updateMedicalRecord, uploadDocument };
