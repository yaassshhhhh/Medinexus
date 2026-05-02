import mongoose from 'mongoose';
import 'dotenv/config';
import appointmentModel from '../models/appointmentModel.js';

async function checkAppts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const appts = await appointmentModel.find({}).sort({ date: -1 }).limit(5);
        appts.forEach(a => {
            console.log(`ID: ${a._id}, Amount: ${a.amount}, Type: ${typeof a.amount}, Cancelled: ${a.cancelled}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkAppts();
