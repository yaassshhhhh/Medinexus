import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import doctorModel from '../models/doctorModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Realistic Indian doctor consultation fees (₹200 - ₹800)
const feesMap = {
    'Dr. Rahul Sharma':   300,
    'Dr. Priya Kapoor':   500,
    'Dr. Neha Verma':     400,
    'Dr. Amit Patel':     350,
    'Dr. Anjali Mehta':   700,
    'Dr. Vikram Singh':   650,
    'Dr. Sanjay Gupta':   300,
    'Dr. Rajeev Kumar':   500,
    'Dr. Kavita Rao':     400,
    'Dr. Manoj Desai':    350,
    'Dr. Sneha Joshi':    600,
    'Dr. Suresh Reddy':   750,
    'Dr. Meera Nair':     300,
    'Dr. Naveen Iyer':    550,
    'Dr. Aarti Chawla':   400,
};

const updateFees = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        for (const [name, fees] of Object.entries(feesMap)) {
            const result = await doctorModel.findOneAndUpdate({ name }, { fees });
            if (result) {
                console.log(`✅ ${name} → ₹${fees}`);
            } else {
                console.log(`⚠️  Not found: ${name}`);
            }
        }

        console.log('\n💰 All doctor fees updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Update failed:', error);
        process.exit(1);
    }
};

updateFees();
