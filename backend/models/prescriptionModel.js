import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    diagnosis: { type: String, required: true },
    medications: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String }
    }],
    labTests: [{ type: String }],
    notes: { type: String },
    followUpDate: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const prescriptionModel = mongoose.models.prescription || mongoose.model('prescription', prescriptionSchema);
export default prescriptionModel;
