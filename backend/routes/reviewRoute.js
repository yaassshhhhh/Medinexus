import express from 'express';
import { submitReview, getDoctorReviews, checkReviewed } from '../controllers/reviewController.js';
import authUser from '../middlewares/authUser.js';

const reviewRouter = express.Router();

reviewRouter.post('/submit', authUser, submitReview);
reviewRouter.get('/doctor/:docId', getDoctorReviews);
reviewRouter.get('/check/:appointmentId', checkReviewed);

export default reviewRouter;
