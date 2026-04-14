import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    bloodGroup: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    allergies: [{ type: String }],
    chronicDiseases: [{ type: String }],
    currentMedications: [{
        name: { type: String },
        dosage: { type: String },
        frequency: { type: String }
    }],
    surgeries: [{
        name: { type: String },
        date: { type: String },
        hospital: { type: String }
    }],
    familyHistory: [{ type: String }],
    emergencyContact: {
        name: { type: String },
        relation: { type: String },
        phone: { type: String }
    },
    insuranceInfo: {
        provider: { type: String },
        policyNumber: { type: String },
        validUntil: { type: String }
    },
    documents: [{
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }],
    updatedAt: { type: Date, default: Date.now }
});

const medicalRecordModel = mongoose.models.medicalRecord || mongoose.model('medicalRecord', medicalRecordSchema);
export default medicalRecordModel;
