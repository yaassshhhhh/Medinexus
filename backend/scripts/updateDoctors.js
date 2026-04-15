import mongoose from 'mongoose';
import doctorModel from '../models/doctorModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Update doctors: Remove Hasan Kazi and set unique ratings
const updateDoctors = async () => {
    try {
        await connectDB();

        // 1. Remove Hasan Kazi and test accounts
        const hasanResult = await doctorModel.deleteMany({
            $or: [
                { name: /hassan/i },
                { name: /hasan/i },
                { name: /kazi/i },
                { email: /hassan/i },
                { email: /hasan/i },
                { name: { $regex: /^yash\s*$/i } }
            ]
        });
        console.log(`🗑️  Removed ${hasanResult.deletedCount} doctor(s) matching "Hasan Kazi" or test accounts`);

        // 2. Get all remaining doctors
        const doctors = await doctorModel.find({});
        console.log(`📋 Found ${doctors.length} doctors to update`);

        // 3. Assign unique ratings between 4.0 and 5.0
        const ratings = [4.8, 4.9, 4.7, 4.6, 4.5, 4.9, 4.8, 4.7, 4.6, 4.5, 4.4, 4.8, 4.9, 4.7, 4.6];
        const reviewCounts = [127, 89, 156, 203, 78, 145, 92, 167, 134, 98, 112, 189, 76, 143, 201];

        for (let i = 0; i < doctors.length; i++) {
            const rating = ratings[i % ratings.length];
            const reviewCount = reviewCounts[i % reviewCounts.length];

            await doctorModel.findByIdAndUpdate(doctors[i]._id, {
                rating: rating,
                reviewCount: reviewCount
            });

            console.log(`✅ Updated ${doctors[i].name}: Rating ${rating}, Reviews ${reviewCount}`);
        }

        console.log('\n🎉 All doctors updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating doctors:', error);
        process.exit(1);
    }
};

updateDoctors();
