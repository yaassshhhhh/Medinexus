import express from 'express';
import { analyzeChat } from '../controllers/chatController.js';

const router = express.Router();
router.post('/analyze', analyzeChat);
export default router;
