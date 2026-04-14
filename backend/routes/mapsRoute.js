import express from 'express';
import { getNearbyDoctors } from '../controllers/mapsController.js';

const mapsRouter = express.Router();
mapsRouter.post('/nearby-doctors', getNearbyDoctors);
export default mapsRouter;
