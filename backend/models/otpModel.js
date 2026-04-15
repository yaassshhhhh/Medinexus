import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    userId: { type: String },
    email: { type: String },
    otp: { type: String, required: true },
    type: { type: String, default: 'booking' }, // 'booking' or 'password-reset'
    docId: { type: String },
    slotDate: { type: String },
    slotTime: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 600 } // Expires in 10 minutes
});

const otpModel = mongoose.models.otp || mongoose.model('otp', otpSchema);
export default otpModel;
