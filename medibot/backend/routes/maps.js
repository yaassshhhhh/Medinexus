import express from 'express';
import { getNearbyDoctors } from '../controllers/mapsController.js';

const router = express.Router();
router.post('/nearby-doctors', getNearbyDoctors);
export default router;
