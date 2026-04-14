import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import chatbotRouter from './routes/chatbotRoute.js';
import mapsRouter from './routes/mapsRoute.js';
import videoConsultRouter from './routes/videoConsultRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import newsletterRouter from './routes/newsletterRoute.js';
import prescriptionRouter from './routes/prescriptionRoute.js';
import medicalRecordRouter from './routes/medicalRecordRoute.js';
import nodemailer from 'nodemailer';
import appointmentModel from './models/appointmentModel.js';

//  app config //
const app = express()
const port = process.env.PORT || 4000
const httpServer = createServer(app)

// CORS configuration for production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://medinexus-ai.vercel.app',
    'https://medinexus-ai-5mer.vercel.app',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean)

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(null, true); // Allow for now, change to false for strict security
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'https://medinexus-ai.vercel.app', 'https://medinexus-ai-5mer.vercel.app'],
        methods: ["GET", "POST"],
        credentials: true
    }
})

connectDB()
connectCloudinary()

// middlewares //
app.use(express.json())
app.use(cors(corsOptions))

// api endpoints //
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/chatbot', chatbotRouter)
app.use('/api/maps', mapsRouter)
app.use('/api/video-consult', videoConsultRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/newsletter', newsletterRouter)
app.use('/api/prescription', prescriptionRouter)
app.use('/api/medical-record', medicalRecordRouter)

import callModel from './models/callModel.js'

// ── Email reminder cron (runs every hour) ──────────────────────────────────
const getTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_PASSWORD },
    tls: { rejectUnauthorized: false }
});

const sendReminderEmails = async () => {
    try {
        const now = Date.now();
        const in24h = now + 24 * 60 * 60 * 1000;
        const appointments = await appointmentModel.find({ cancelled: false, isCompleted: false, reminderSent: { $ne: true } });

        for (const appt of appointments) {
            try {
                const [d, m, y] = appt.slotDate.split('_').map(Number);
                const [time, period] = appt.slotTime.split(' ');
                let [h, min] = time.split(':').map(Number);
                if (period === 'PM' && h !== 12) h += 12;
                if (period === 'AM' && h === 12) h = 0;
                const apptTime = new Date(y, m - 1, d, h, min).getTime();

                if (apptTime > now && apptTime <= in24h) {
                    const email = appt.userData?.email;
                    if (!email) continue;
                    await getTransporter().sendMail({
                        from: process.env.ADMIN_EMAIL,
                        to: email,
                        subject: `Reminder: Appointment with Dr. ${appt.docData?.name} tomorrow`,
                        text: `Hi ${appt.userData?.name},\n\nThis is a reminder that you have an appointment with Dr. ${appt.docData?.name} (${appt.docData?.speciality}) on ${appt.slotDate.split('_').join('/')} at ${appt.slotTime}.\n\n${appt.isVideoConsult ? `Join your video call here: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/video-consult?roomId=${appt.roomId}` : `Location: ${appt.docData?.address?.line1 || ''}`}\n\nThanks,\nMedinexus Team`
                    });
                    await appointmentModel.findByIdAndUpdate(appt._id, { reminderSent: true });
                    console.log(`Reminder sent to ${email}`);
                }
            } catch (e) { console.error('Reminder email error:', e.message); }
        }
    } catch (e) { console.error('Cron error:', e.message); }
};

// Run reminder check every hour
setInterval(sendReminderEmails, 60 * 60 * 1000);

// Track socket → room mapping for disconnect cleanup
const socketRoomMap = {}

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join-room', async ({ roomId, userId, role }) => {
        socket.join(roomId)
        socketRoomMap[socket.id] = { roomId, userId, role }
        console.log(`[${role || 'user'}] ${socket.id} joined room: ${roomId}`)

        // Track session in DB
        try {
            const existingCall = await callModel.findOne({ roomId })
            if (!existingCall) {
                await callModel.create({
                    roomId,
                    callerId: userId,
                    receiverId: 'pending',
                    participants: [userId],
                    status: 'ongoing'
                })
            } else if (!existingCall.participants.includes(userId)) {
                existingCall.participants.push(userId)
                if (existingCall.participants.length >= 2) existingCall.status = 'ongoing'
                await existingCall.save()
            }
        } catch (err) {
            console.error('DB call tracking error:', err.message)
        }

        // Notify others in room that someone joined
        socket.to(roomId).emit('user-joined', { socketId: socket.id, role })

        // Tell the joining user how many are already in the room
        const roomSockets = await io.in(roomId).fetchSockets()
        socket.emit('room-info', { count: roomSockets.length })
    })

    socket.on('signal', (data) => {
        const target = data.to
            ? io.to(data.to)
            : socket.to(data.roomId)
        target.emit('signal', { from: socket.id, signalData: data.signalData })
    })

    // In-call chat
    socket.on('chat-message', ({ roomId, message, senderName, role }) => {
        socket.to(roomId).emit('chat-message', {
            message, senderName, role,
            timestamp: new Date().toISOString()
        })
    })

    // End call — notify the other peer
    socket.on('end-call', ({ roomId }) => {
        socket.to(roomId).emit('call-ended')
        callModel.findOneAndUpdate({ roomId }, { status: 'ended', endTime: new Date() }).catch(() => { })
    })

    socket.on('disconnect', async () => {
        const info = socketRoomMap[socket.id]
        if (info) {
            socket.to(info.roomId).emit('peer-disconnected', { role: info.role })
            delete socketRoomMap[socket.id]
        }
        console.log('User disconnected:', socket.id)
    })
})

app.get('/', (req, res) => {
    res.send('API WORKING')
})

httpServer.listen(port, () => console.log("Server Started", port))