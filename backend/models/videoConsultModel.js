import mongoose from "mongoose";

const videoConsultSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    docName: { type: String, required: true },
    docImage: { type: String, required: true },
    docSpeciality: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    meetingLink: { type: String, default: '' },
    roomId: { type: String, default: '' }
})

const videoConsultModel = mongoose.models.videoConsult || mongoose.model('videoConsult', videoConsultSchema)

export default videoConsultModel
