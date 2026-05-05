import messageModel from "../models/messageModel.js";
import appointmentModel from "../models/appointmentModel.js";

// Get messages for an appointment (user or doctor)
const getMessages = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        if (!appointmentId) return res.json({ success: false, message: "appointmentId required" });

        const messages = await messageModel.find({ appointmentId }).sort({ createdAt: 1 });
        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Send a message (user side)
const sendMessageUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const { appointmentId, message } = req.body;

        if (!appointmentId || !message?.trim()) {
            return res.json({ success: false, message: "appointmentId and message required" });
        }

        // Verify appointment belongs to user
        const appt = await appointmentModel.findById(appointmentId);
        if (!appt) return res.json({ success: false, message: "Appointment not found" });
        if (appt.userId !== userId) return res.json({ success: false, message: "Unauthorized" });

        const newMsg = await messageModel.create({
            appointmentId,
            senderId: userId,
            senderRole: 'user',
            senderName: appt.userData?.name || 'Patient',
            message: message.trim()
        });

        res.json({ success: true, message: "Message sent", data: newMsg });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Send a message (doctor side)
const sendMessageDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        const { appointmentId, message } = req.body;

        if (!appointmentId || !message?.trim()) {
            return res.json({ success: false, message: "appointmentId and message required" });
        }

        const appt = await appointmentModel.findById(appointmentId);
        if (!appt) return res.json({ success: false, message: "Appointment not found" });
        if (appt.docId !== docId) return res.json({ success: false, message: "Unauthorized" });

        const newMsg = await messageModel.create({
            appointmentId,
            senderId: docId,
            senderRole: 'doctor',
            senderName: `Dr. ${appt.docData?.name || 'Doctor'}`,
            message: message.trim()
        });

        res.json({ success: true, message: "Message sent", data: newMsg });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Mark messages as read
const markRead = async (req, res) => {
    try {
        const { appointmentId, readerRole } = req.body;
        // Mark all messages NOT from this role as read
        await messageModel.updateMany(
            { appointmentId, senderRole: { $ne: readerRole }, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get unread count for user
const getUnreadCountUser = async (req, res) => {
    try {
        const { userId } = req.body;
        // Get all appointments for this user
        const appts = await appointmentModel.find({ userId, cancelled: false });
        const apptIds = appts.map(a => a._id.toString());

        const count = await messageModel.countDocuments({
            appointmentId: { $in: apptIds },
            senderRole: 'doctor',
            read: false
        });
        res.json({ success: true, count });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get unread count for doctor
const getUnreadCountDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        const appts = await appointmentModel.find({ docId, cancelled: false });
        const apptIds = appts.map(a => a._id.toString());

        const count = await messageModel.countDocuments({
            appointmentId: { $in: apptIds },
            senderRole: 'user',
            read: false
        });
        res.json({ success: true, count });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { getMessages, sendMessageUser, sendMessageDoctor, markRead, getUnreadCountUser, getUnreadCountDoctor };
