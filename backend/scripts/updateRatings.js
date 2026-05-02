import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import doctorModel from '../models/doctorModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Unique ratings between 2.5 and 4.9 for each doctor
const ratings = [4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.1, 3.9, 3.7, 3.5, 3.2, 2.9, 2.7, 2.5];
const reviewCounts = [312, 287, 265, 244, 198, 173, 156, 134, 112, 98, 87, 76, 65, 54, 43];

const updateRatings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const doctors = await doctorModel.find({}).sort({ name: 1 });
        console.log(`📋 Found ${doctors.length} doctors`);

        for (let i = 0; i < doctors.length; i++) {
            const rating = ratings[i] ?? 3.5;
            const reviewCount = reviewCounts[i] ?? 50;
            await doctorModel.findByIdAndUpdate(doctors[i]._id, { rating, reviewCount });
            console.log(`✅ ${doctors[i].name} → Rating: ${rating} (${reviewCount} reviews)`);
        }

        console.log('\n🌟 All doctor ratings updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Update failed:', error);
        process.exit(1);
    }
};

updateRatings();
