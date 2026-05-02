import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load models
import doctorModel from '../models/doctorModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const doctors = [
    {
        name: 'Dr. Rahul Sharma',
        image: 'https://res.cloudinary.com/demo/image/upload/v1612345678/doc1_placeholder.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care...',
        fees: 50,
        address: { line1: 'Shop No. 12, Connaught Place', line2: 'New Delhi, Delhi - 110001' },
        date: Date.now()
    },
    {
        name: 'Dr. Priya Kapoor',
        image: 'https://res.cloudinary.com/demo/image/upload/v1612345678/doc2_placeholder.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care...',
        fees: 60,
        address: { line1: '45, Linking Road, Bandra West', line2: 'Mumbai, Maharashtra - 400050' },
        date: Date.now()
    },
    {
        name: 'Dr. Neha Verma',
        image: 'https://res.cloudinary.com/demo/image/upload/v1612345678/doc3_placeholder.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care...',
        fees: 30,
        address: { line1: '23, MG Road, Koramangala', line2: 'Bangalore, Karnataka - 560034' },
        date: Date.now()
    },
    {
        name: 'Dr. Amit Patel',
        image: 'https://res.cloudinary.com/demo/image/upload/v1612345678/doc4_placeholder.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care...',
        fees: 40,
        address: { line1: '78, CG Road, Navrangpura', line2: 'Ahmedabad, Gujarat - 380009' },
        date: Date.now()
    },
    {
        name: 'Dr. Anjali Mehta',
        image: 'https://res.cloudinary.com/demo/image/upload/v1612345678/doc5_placeholder.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care...',
        fees: 50,
        address: { line1: '34, Park Street, Park Circus', line2: 'Kolkata, West Bengal - 700016' },
        date: Date.now()
    },
    {
        name: 'Dr. Sneha Joshi',
        image: 'https://res.cloudinary.com/demo/image/upload/v1612345678/doc11_placeholder.png',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care...',
        fees: 50,
        address: { line1: '43, Saket District Centre', line2: 'New Delhi, Delhi - 110017' },
        date: Date.now()
    }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your_mongodb_connection_string_here')) {
            console.error('❌ MONGODB_URI is missing or invalid in .env file');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing doctors
        await doctorModel.deleteMany({});
        console.log('🗑️  Cleared existing doctors');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('12345678', salt);

        // Seed doctors
        for (let doc of doctors) {
            doc.password = hashedPassword;
            doc.email = doc.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@example.com';
            doc.available = true;
            await new doctorModel(doc).save();
        }

        console.log('🌱 Seeded database with doctors successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
