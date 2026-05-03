import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const contactRouter = express.Router();

// Simple in-memory rate limiter: max 5 requests per IP per hour
const rateLimitMap = new Map();
const rateLimit = (maxReq, windowMs) => (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, start: now };
    if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
    entry.count++;
    rateLimitMap.set(ip, entry);
    if (entry.count > maxReq) {
        return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    }
    next();
};

contactRouter.post('/send', rateLimit(5, 60 * 60 * 1000), sendContactMessage);

export default contactRouter;
