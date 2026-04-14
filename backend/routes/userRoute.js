import express from "express";
import { registerUser, loginUser, getProfile, updateProfile, sendBookingOTP, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, forgotPassword, verifyResetOTP, resetPassword } from "../controllers/userController.js";
import { rescheduleAppointment } from "../controllers/rescheduleController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-reset-otp", verifyResetOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single("image"), authUser, updateProfile);
userRouter.post("/send-booking-otp", authUser, sendBookingOTP);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.post("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/reschedule-appointment", authUser, rescheduleAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verify-razorpay", authUser, verifyRazorpay);

export default userRouter;
