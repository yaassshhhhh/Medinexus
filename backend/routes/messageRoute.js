import express from "express";
import { getMessages, sendMessageUser, sendMessageDoctor, markRead, getUnreadCountUser, getUnreadCountDoctor } from "../controllers/messageController.js";
import authUser from "../middlewares/authUser.js";
import authDoctor from "../middlewares/authDoctor.js";

const messageRouter = express.Router();

// Get messages — accepts both user token and doctor token
// We use a flexible middleware that tries both
messageRouter.post("/get", async (req, res, next) => {
    const { token } = req.headers;
    const { dtoken } = req.headers;
    if (!token && !dtoken) {
        return res.json({ success: false, message: "Not Authorized" });
    }
    next();
}, getMessages);

// User routes
messageRouter.post("/send-user", authUser, sendMessageUser);
messageRouter.post("/unread-user", authUser, getUnreadCountUser);

// Doctor routes
messageRouter.post("/send-doctor", authDoctor, sendMessageDoctor);
messageRouter.post("/unread-doctor", authDoctor, getUnreadCountDoctor);

// Shared — mark read (called by both sides)
messageRouter.post("/mark-read", markRead);

export default messageRouter;
