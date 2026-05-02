import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import doctorModel from '../models/doctorModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const doctors = [
    {
        name: 'Dr. Rahul Sharma',
        image: '/doc1.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: 'Shop No. 12, Connaught Place', line2: 'New Delhi, Delhi - 110001' }
    },
    {
        name: 'Dr. Priya Kapoor',
        image: '/doc2.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: { line1: '45, Linking Road, Bandra West', line2: 'Mumbai, Maharashtra - 400050' }
    },
    {
        name: 'Dr. Neha Verma',
        image: '/doc3.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: { line1: '23, MG Road, Koramangala', line2: 'Bangalore, Karnataka - 560034' }
    },
    {
        name: 'Dr. Amit Patel',
        image: '/doc4.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: { line1: '78, CG Road, Navrangpura', line2: 'Ahmedabad, Gujarat - 380009' }
    },
    {
        name: 'Dr. Anjali Mehta',
        image: '/doc5.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '34, Park Street, Park Circus', line2: 'Kolkata, West Bengal - 700016' }
    },
    {
        name: 'Dr. Vikram Singh',
        image: '/doc6.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '56, Banjara Hills Road No. 3', line2: 'Hyderabad, Telangana - 500034' }
    },
    {
        name: 'Dr. Sanjay Gupta',
        image: '/doc7.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '89, Anna Salai, Thousand Lights', line2: 'Chennai, Tamil Nadu - 600006' }
    },
    {
        name: 'Dr. Rajeev Kumar',
        image: '/doc8.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: { line1: '12, FC Road, Deccan Gymkhana', line2: 'Pune, Maharashtra - 411004' }
    },
    {
        name: 'Dr. Kavita Rao',
        image: '/doc9.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: { line1: '67, Residency Road, Shantinagar', line2: 'Bangalore, Karnataka - 560025' }
    },
    {
        name: 'Dr. Manoj Desai',
        image: '/doc10.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: { line1: '21, Sector 17, Vashi', line2: 'Navi Mumbai, Maharashtra - 400703' }
    },
    {
        name: 'Dr. Sneha Joshi',
        image: '/doc11.png',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '43, Saket District Centre', line2: 'New Delhi, Delhi - 110017' }
    },
    {
        name: 'Dr. Suresh Reddy',
        image: '/doc12.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '88, Jubilee Hills, Road No. 36', line2: 'Hyderabad, Telangana - 500033' }
    },
    {
        name: 'Dr. Meera Nair',
        image: '/doc13.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: { line1: '15, Marine Drive, Nariman Point', line2: 'Mumbai, Maharashtra - 400020' }
    },
    {
        name: 'Dr. Naveen Iyer',
        image: '/doc14.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: { line1: '52, T Nagar, Pondy Bazaar', line2: 'Chennai, Tamil Nadu - 600017' }
    },
    {
        name: 'Dr. Aarti Chawla',
        image: '/doc15.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: { line1: '29, Sector 18, Noida', line2: 'Noida, Uttar Pradesh - 201301' }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await doctorModel.deleteMany({});
        console.log('🗑️  Cleared existing doctors');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('12345678', salt);

        for (let doc of doctors) {
            doc.password = hashedPassword;
            doc.email = doc.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@example.com';
            doc.available = true;
            doc.date = Date.now();
            await new doctorModel(doc).save();
        }

        console.log(`🌱 Seeded database with ${doctors.length} doctors successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
