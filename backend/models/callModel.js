import mongoose from "mongoose";

const callSessionSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    participants: [{ type: String }], // Array of userIds or doctorIds
    status: { type: String, enum: ['initiated', 'ongoing', 'ended'], default: 'initiated' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    callerId: { type: String, required: true },
    receiverId: { type: String, required: true }
}, { timestamps: true });

// Index for performance
callSessionSchema.index({ roomId: 1 });
callSessionSchema.index({ status: 1 });

const callModel = mongoose.models.call || mongoose.model("call", callSessionSchema);

export default callModel;
