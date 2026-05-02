import express from 'express';
import { analyzeSymptoms, saveFeedback } from '../controllers/chatbotController.js';

const chatbotRouter = express.Router();

chatbotRouter.post('/analyze', analyzeSymptoms);
chatbotRouter.post('/feedback', saveFeedback);

export default chatbotRouter;
