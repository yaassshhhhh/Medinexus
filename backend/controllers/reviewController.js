import reviewModel from "../models/reviewModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";

// Submit a review for a completed appointment
const submitReview = async (req, res) => {
    try {
        const { userId, appointmentId, rating, comment } = req.body;

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) return res.json({ success: false, message: "Appointment not found" });
        if (appointment.userId !== userId) return res.json({ success: false, message: "Unauthorized" });
        if (!appointment.isCompleted) return res.json({ success: false, message: "Can only review completed appointments" });

        const existing = await reviewModel.findOne({ appointmentId });
        if (existing) return res.json({ success: false, message: "Already reviewed this appointment" });

        const review = await reviewModel.create({
            appointmentId,
            userId,
            docId: appointment.docId,
            rating,
            comment,
            userName: appointment.userData?.name || 'Patient',
            userImage: appointment.userData?.image || '',
        });

        // Update doctor's average rating
        const allReviews = await reviewModel.find({ docId: appointment.docId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await doctorModel.findByIdAndUpdate(appointment.docId, {
            rating: parseFloat(avgRating.toFixed(1)),
            reviewCount: allReviews.length
        });

        res.json({ success: true, message: "Review submitted", review });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get reviews for a doctor
const getDoctorReviews = async (req, res) => {
    try {
        const { docId } = req.params;
        const reviews = await reviewModel.find({ docId }).sort({ createdAt: -1 });
        const avg = reviews.length
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : null;
        res.json({ success: true, reviews, averageRating: avg, totalReviews: reviews.length });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Check if user already reviewed an appointment
const checkReviewed = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const review = await reviewModel.findOne({ appointmentId });
        res.json({ success: true, reviewed: !!review, review });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { submitReview, getDoctorReviews, checkReviewed };
