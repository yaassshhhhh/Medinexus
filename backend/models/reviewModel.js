import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    appointmentId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    userName: { type: String, required: true },
    userImage: { type: String, default: '' },
}, { timestamps: true });

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);
export default reviewModel;
