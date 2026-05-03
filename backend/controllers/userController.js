import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import otpModel from "../models/otpModel.js";

// Utility for Nodemailer transport with better error handling
const getTransporter = () => {
    try {
        if (process.env.ADMIN_EMAIL === 'your_email@gmail.com' || !process.env.ADMIN_EMAIL) {
            console.log('⚠️  Using mock email transporter in userController');
            return {
                sendMail: async (mailOptions) => {
                    console.log('\n=============================================');
                    console.log('📧 MOCK EMAIL SENT (Development Mode)');
                    console.log(`To: ${mailOptions.to}`);
                    console.log(`Subject: ${mailOptions.subject}`);
                    console.log('=============================================\n');
                    return { messageId: 'mock-id-' + Date.now() };
                }
            };
        }

        // Check if using SendGrid
        if (process.env.SENDGRID_API_KEY) {
            return nodemailer.createTransport({
                host: 'smtp.sendgrid.net',
                port: 587,
                secure: false,
                auth: {
                    user: 'apikey',
                    pass: process.env.SENDGRID_API_KEY
                }
            });
        }

        // Default Gmail configuration
        return nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD
            },
            tls: {
                rejectUnauthorized: false // Allow self-signed certificates
            }
        });
    } catch (error) {
        console.error('Transporter creation error:', error);
        throw error;
    }
};

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" });
        }
        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "enter a valid email" });
        }

        // validating password
        if (password.length < 8) {
            return res.json({ success: false, message: "enter a strong password" });
        }

        const exact_user = await userModel.findOne({ email });
        if (exact_user) {
            return res.json({ success: false, message: "User already exists" });
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });
    } catch (error) {
        console.log("getProfile Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender, removeImage } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        let parsedAddress = {};
        if (address) {
            try {
                parsedAddress = JSON.parse(address);
            } catch {
                return res.json({ success: false, message: "Invalid address format" });
            }
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: parsedAddress,
            dob,
            gender
        });

        if (removeImage === 'true') {
            await userModel.findByIdAndUpdate(userId, { image: "" });
        } else if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageUrl = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Send OTP to user's email
const sendBookingOTP = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP in database
        await otpModel.create({
            userId,
            otp,
            docId,
            slotDate,
            slotTime
        });

        // Send Email
        const transporter = getTransporter();
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: userData.email,
            subject: 'Medinexus AI - Appointment Booking OTP',
            text: `Your OTP for booking an appointment with Medinexus AI is ${otp}. It is valid for 10 minutes.`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("✅ Email sent successfully:", info.messageId);
            res.json({ success: true, message: "OTP sent to your email." });
        } catch (emailError) {
            console.error("❌ Email send failed:", emailError.message);
            // OTP is saved in DB; inform user to retry or contact support
            res.json({ success: false, message: "Failed to send OTP email. Please try again later." });
        }

    } catch (error) {
        console.error("sendBookingOTP Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime, otp, isVideoConsult } = req.body;

        const otpRecord = await otpModel.findOne({ userId, docId, slotDate, slotTime }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return res.json({ success: false, message: "OTP not found or expired. Please re-send OTP." });
        }

        // Check OTP expiry (10 minutes)
        const otpAge = Date.now() - new Date(otpRecord.createdAt).getTime();
        if (otpAge > 10 * 60 * 1000) {
            await otpModel.findByIdAndDelete(otpRecord._id);
            return res.json({ success: false, message: "OTP has expired. Please request a new OTP." });
        }

        if (otpRecord.otp !== otp) {
            return res.json({ success: false, message: "Invalid OTP." });
        }

        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available for booking" });
        }

        let slots_booked = docData.slots_booked || {};
        // check if slot is available
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot is already booked." });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');
        delete docData.slots_booked; // removing before saving in appointment doc

        let roomId = "";
        if (isVideoConsult) {
            roomId = "room_" + Math.random().toString(36).substring(2, 9);
        }

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            isVideoConsult: isVideoConsult || false,
            roomId
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        await otpModel.findByIdAndDelete(otpRecord._id); // Burn OTP

        // Trigger Doctor Notification for Video Consult
        if (isVideoConsult) {
            try {
                const transporter = getTransporter();
                const mailOptions = {
                    from: process.env.ADMIN_EMAIL,
                    to: process.env.ADMIN_EMAIL, // Acting as Doctor Email for development
                    subject: `Medinexus AI - Video Consult Scheduled with ${userData.name}`,
                    text: `Hello Dr. ${docData.name},\n\nYou have a scheduled Video Consultation with ${userData.name} on ${slotDate.split('_').join('/')} at ${slotTime}.\n\nPlease click the link below to join the meeting at the scheduled time:\nhttps://doctor-appointment-system-s54z.vercel.app/video-consult?roomId=${roomId}&doctorView=true\n\nThanks,\nMedinexus AI Team`
                };
                transporter.sendMail(mailOptions, (err) => {
                    if (err) console.error("Doctor Email Notice Failed: ", err);
                });
            } catch (err) {
                console.error(err);
            }
        }

        res.json({ success: true, message: "Appointment Booked" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// API to get user appointments
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log("listAppointment Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // Verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        if (doctorData) {
            let slots_booked = doctorData.slots_booked || {};
            if (slots_booked[slotDate]) {
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            }
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Gateway Initialization
let razorpayInstance;

const getRazorpayInstance = () => {
    if (!razorpayInstance) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('❌ Razorpay keys missing in environment variables');
            return null;
        }
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpayInstance;
};

// API to make payment of appointment using Razorpay
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('❌ Razorpay keys missing in environment variables');
            return res.json({ success: false, message: 'Payment gateway not configured. Please contact support.' });
        }

        // Validate amount
        const amount = Number(appointmentData.amount);
        if (isNaN(amount) || amount <= 0) {
            console.error('❌ Invalid appointment amount:', appointmentData.amount);
            return res.json({ success: false, message: 'Invalid appointment amount' });
        }

        const options = {
            amount: Math.round(amount * 100), // Ensure it's an integer
            currency: 'INR',
            receipt: appointmentId.toString()
        };

        console.log('Creating Razorpay order for appointment:', appointmentId, 'Amount:', options.amount);
        
        const rzp = getRazorpayInstance();
        if (!rzp) {
            return res.json({ success: false, message: 'Payment gateway not configured correctly.' });
        }

        try {
            const order = await rzp.orders.create(options);
            console.log('✅ Razorpay order created:', order.id);
            res.json({ success: true, order });
        } catch (razorpayError) {
            console.error('❌ Razorpay SDK Error Full Object:', JSON.stringify(razorpayError, null, 2));
            const errorMsg = razorpayError.error?.description || razorpayError.description || razorpayError.message || 'Order creation failed';
            res.json({ 
                success: false, 
                message: 'Razorpay Error: ' + errorMsg
            });
        }

    } catch (error) {
        console.error('❌ Payment Controller Error:', error);
        res.json({ success: false, message: 'Payment failed: ' + (error.message || 'Internal Server Error') });
    }
}

// API to verify payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

        if (!razorpay_order_id) {
            return res.json({ success: false, message: 'Missing order ID' });
        }

        const rzp = getRazorpayInstance();
        if (!rzp) return res.json({ success: false, message: 'Payment gateway error.' });

        // ── Primary path: HMAC signature verification (most secure) ──
        if (razorpay_payment_id && razorpay_signature) {
            const crypto = await import('crypto');
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto.default
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                console.error('❌ Razorpay signature mismatch');
                return res.json({ success: false, message: 'Payment verification failed: Invalid signature' });
            }

            // Signature valid — fetch order to get receipt (appointmentId)
            const orderInfo = await rzp.orders.fetch(razorpay_order_id);
            const apptId = orderInfo.receipt || appointmentId;
            await appointmentModel.findByIdAndUpdate(apptId, { payment: true });
            console.log('✅ Payment verified via signature for appointment:', apptId);
            return res.json({ success: true, message: 'Payment Successful' });
        }

        // ── Fallback: poll order status (used if signature not provided) ──
        const orderInfo = await rzp.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            const apptId = orderInfo.receipt || appointmentId;
            await appointmentModel.findByIdAndUpdate(apptId, { payment: true });
            console.log('✅ Payment verified via order status for appointment:', apptId);
            return res.json({ success: true, message: 'Payment Successful' });
        }

        return res.json({ success: false, message: 'Payment not completed' });

    } catch (error) {
        console.error('❌ Razorpay verification error:', error.message);
        res.json({ success: false, message: error.message });
    }
}

// API to send forgot password OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database
        await otpModel.create({ email, otp, type: 'password-reset' });

        // Send OTP email
        const transporter = getTransporter();
        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: 'Password Reset OTP - Medinexus AI',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #5f57ff;">Password Reset Request</h2>
                    <p>You requested to reset your password. Use the OTP below:</p>
                    <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>This OTP is valid for 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        });

        res.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to verify reset OTP
const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await otpModel.findOne({ email, otp, type: 'password-reset' }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        // Check if OTP is expired (10 minutes)
        const otpAge = Date.now() - otpRecord.createdAt.getTime();
        if (otpAge > 10 * 60 * 1000) {
            return res.json({ success: false, message: "OTP expired" });
        }

        res.json({ success: true, message: "OTP verified" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Verify OTP again
        const otpRecord = await otpModel.findOne({ email, otp, type: 'password-reset' }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        const otpAge = Date.now() - otpRecord.createdAt.getTime();
        if (otpAge > 10 * 60 * 1000) {
            return res.json({ success: false, message: "OTP expired" });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        await userModel.findOneAndUpdate({ email }, { password: hashedPassword });

        // Delete used OTP
        await otpModel.deleteOne({ _id: otpRecord._id });

        res.json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, getProfile, updateProfile, sendBookingOTP, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, forgotPassword, verifyResetOTP, resetPassword };
