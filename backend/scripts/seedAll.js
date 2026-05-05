import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import doctorModel from '../models/doctorModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const aboutText = 'Dr. {name} is a highly experienced specialist committed to delivering comprehensive, patient-centered care. With a focus on preventive medicine, early diagnosis, and evidence-based treatment strategies, they bring both expertise and compassion to every consultation. Patients consistently praise their thoroughness and ability to explain complex conditions in simple terms.';

const doctors = [
    // ── General Physicians ──
    { name: 'Dr. Rahul Sharma',     speciality: 'General physician',   degree: 'MBBS',        experience: '4 Years',  fees: 500,  address: { line1: 'Shop No. 12, Connaught Place', line2: 'New Delhi, Delhi - 110001' } },
    { name: 'Dr. Sanjay Gupta',     speciality: 'General physician',   degree: 'MBBS, MD',    experience: '7 Years',  fees: 700,  address: { line1: '89, Anna Salai, Thousand Lights', line2: 'Chennai, Tamil Nadu - 600006' } },
    { name: 'Dr. Meera Nair',       speciality: 'General physician',   degree: 'MBBS',        experience: '4 Years',  fees: 500,  address: { line1: '15, Marine Drive, Nariman Point', line2: 'Mumbai, Maharashtra - 400020' } },
    { name: 'Dr. Arjun Bose',       speciality: 'General physician',   degree: 'MBBS, DNB',   experience: '6 Years',  fees: 600,  address: { line1: '22, Salt Lake Sector V', line2: 'Kolkata, West Bengal - 700091' } },
    { name: 'Dr. Sunita Pillai',    speciality: 'General physician',   degree: 'MBBS',        experience: '3 Years',  fees: 450,  address: { line1: '7, MG Road, Ernakulam', line2: 'Kochi, Kerala - 682035' } },
    { name: 'Dr. Kiran Malhotra',   speciality: 'General physician',   degree: 'MBBS, MD',    experience: '9 Years',  fees: 800,  address: { line1: '34, Sector 22, Chandigarh', line2: 'Chandigarh - 160022' } },
    { name: 'Dr. Deepak Tiwari',    speciality: 'General physician',   degree: 'MBBS',        experience: '2 Years',  fees: 400,  address: { line1: '56, Hazratganj', line2: 'Lucknow, Uttar Pradesh - 226001' } },
    { name: 'Dr. Pooja Agarwal',    speciality: 'General physician',   degree: 'MBBS, MD',    experience: '5 Years',  fees: 550,  address: { line1: '11, Ashram Road', line2: 'Ahmedabad, Gujarat - 380009' } },

    // ── Gynecologists ──
    { name: 'Dr. Priya Kapoor',     speciality: 'Gynecologist',        degree: 'MBBS, MS',    experience: '3 Years',  fees: 600,  address: { line1: '45, Linking Road, Bandra West', line2: 'Mumbai, Maharashtra - 400050' } },
    { name: 'Dr. Rajeev Kumar',     speciality: 'Gynecologist',        degree: 'MBBS, MD',    experience: '3 Years',  fees: 600,  address: { line1: '12, FC Road, Deccan Gymkhana', line2: 'Pune, Maharashtra - 411004' } },
    { name: 'Dr. Naveen Iyer',      speciality: 'Gynecologist',        degree: 'MBBS, DGO',   experience: '3 Years',  fees: 600,  address: { line1: '52, T Nagar, Pondy Bazaar', line2: 'Chennai, Tamil Nadu - 600017' } },
    { name: 'Dr. Ananya Krishnan',  speciality: 'Gynecologist',        degree: 'MBBS, MS',    experience: '8 Years',  fees: 900,  address: { line1: '18, Jayanagar 4th Block', line2: 'Bangalore, Karnataka - 560011' } },
    { name: 'Dr. Rekha Menon',      speciality: 'Gynecologist',        degree: 'MBBS, MD',    experience: '12 Years', fees: 1200, address: { line1: '3, Pattom Palace Road', line2: 'Thiruvananthapuram, Kerala - 695004' } },
    { name: 'Dr. Shweta Bansal',    speciality: 'Gynecologist',        degree: 'MBBS, DGO',   experience: '5 Years',  fees: 700,  address: { line1: '67, Rajouri Garden', line2: 'New Delhi, Delhi - 110027' } },
    { name: 'Dr. Lalitha Rao',      speciality: 'Gynecologist',        degree: 'MBBS, MS',    experience: '10 Years', fees: 1000, address: { line1: '90, Jubilee Hills Road No. 45', line2: 'Hyderabad, Telangana - 500033' } },

    // ── Dermatologists ──
    { name: 'Dr. Neha Verma',       speciality: 'Dermatologist',       degree: 'MBBS, MD',    experience: '1 Years',  fees: 300,  address: { line1: '23, MG Road, Koramangala', line2: 'Bangalore, Karnataka - 560034' } },
    { name: 'Dr. Kavita Rao',       speciality: 'Dermatologist',       degree: 'MBBS, DVD',   experience: '1 Years',  fees: 300,  address: { line1: '67, Residency Road, Shantinagar', line2: 'Bangalore, Karnataka - 560025' } },
    { name: 'Dr. Aarti Chawla',     speciality: 'Dermatologist',       degree: 'MBBS, MD',    experience: '1 Years',  fees: 300,  address: { line1: '29, Sector 18, Noida', line2: 'Noida, Uttar Pradesh - 201301' } },
    { name: 'Dr. Rohit Saxena',     speciality: 'Dermatologist',       degree: 'MBBS, DVD',   experience: '6 Years',  fees: 700,  address: { line1: '14, Park Street', line2: 'Kolkata, West Bengal - 700016' } },
    { name: 'Dr. Nisha Patel',      speciality: 'Dermatologist',       degree: 'MBBS, MD',    experience: '4 Years',  fees: 500,  address: { line1: '88, CG Road, Navrangpura', line2: 'Ahmedabad, Gujarat - 380009' } },
    { name: 'Dr. Aditya Jain',      speciality: 'Dermatologist',       degree: 'MBBS, DVD',   experience: '3 Years',  fees: 450,  address: { line1: '5, Connaught Circus', line2: 'New Delhi, Delhi - 110001' } },
    { name: 'Dr. Preethi Suresh',   speciality: 'Dermatologist',       degree: 'MBBS, MD',    experience: '7 Years',  fees: 750,  address: { line1: '33, Anna Nagar East', line2: 'Chennai, Tamil Nadu - 600102' } },

    // ── Pediatricians ──
    { name: 'Dr. Amit Patel',       speciality: 'Pediatricians',       degree: 'MBBS, DCH',   experience: '2 Years',  fees: 400,  address: { line1: '78, CG Road, Navrangpura', line2: 'Ahmedabad, Gujarat - 380009' } },
    { name: 'Dr. Manoj Desai',      speciality: 'Pediatricians',       degree: 'MBBS, MD',    experience: '2 Years',  fees: 400,  address: { line1: '21, Sector 17, Vashi', line2: 'Navi Mumbai, Maharashtra - 400703' } },
    { name: 'Dr. Ritu Sharma',      speciality: 'Pediatricians',       degree: 'MBBS, DCH',   experience: '5 Years',  fees: 550,  address: { line1: '44, Rajinder Nagar', line2: 'New Delhi, Delhi - 110060' } },
    { name: 'Dr. Vivek Nambiar',    speciality: 'Pediatricians',       degree: 'MBBS, MD',    experience: '8 Years',  fees: 800,  address: { line1: '9, Indiranagar 100 Feet Road', line2: 'Bangalore, Karnataka - 560038' } },
    { name: 'Dr. Geeta Krishnan',   speciality: 'Pediatricians',       degree: 'MBBS, DCH',   experience: '10 Years', fees: 900,  address: { line1: '27, Nungambakkam High Road', line2: 'Chennai, Tamil Nadu - 600034' } },
    { name: 'Dr. Harish Mehta',     speciality: 'Pediatricians',       degree: 'MBBS, MD',    experience: '6 Years',  fees: 650,  address: { line1: '55, Banjara Hills Road No. 1', line2: 'Hyderabad, Telangana - 500034' } },
    { name: 'Dr. Smita Kulkarni',   speciality: 'Pediatricians',       degree: 'MBBS, DCH',   experience: '4 Years',  fees: 500,  address: { line1: '16, Deccan Gymkhana', line2: 'Pune, Maharashtra - 411004' } },

    // ── Neurologists ──
    { name: 'Dr. Anjali Mehta',     speciality: 'Neurologist',         degree: 'MBBS, DM',    experience: '4 Years',  fees: 500,  address: { line1: '34, Park Street, Park Circus', line2: 'Kolkata, West Bengal - 700016' } },
    { name: 'Dr. Vikram Singh',     speciality: 'Neurologist',         degree: 'MBBS, MD',    experience: '4 Years',  fees: 500,  address: { line1: '56, Banjara Hills Road No. 3', line2: 'Hyderabad, Telangana - 500034' } },
    { name: 'Dr. Suresh Reddy',     speciality: 'Neurologist',         degree: 'MBBS, DM',    experience: '4 Years',  fees: 500,  address: { line1: '88, Jubilee Hills, Road No. 36', line2: 'Hyderabad, Telangana - 500033' } },
    { name: 'Dr. Pradeep Nair',     speciality: 'Neurologist',         degree: 'MBBS, MD, DM',experience: '10+ Years',fees: 1500, address: { line1: '2, Pattom Junction', line2: 'Thiruvananthapuram, Kerala - 695004' } },
    { name: 'Dr. Kavya Menon',      speciality: 'Neurologist',         degree: 'MBBS, DM',    experience: '6 Years',  fees: 800,  address: { line1: '41, Koramangala 5th Block', line2: 'Bangalore, Karnataka - 560095' } },
    { name: 'Dr. Rajesh Iyer',      speciality: 'Neurologist',         degree: 'MBBS, MD',    experience: '8 Years',  fees: 1000, address: { line1: '19, Adyar Bridge Road', line2: 'Chennai, Tamil Nadu - 600020' } },
    { name: 'Dr. Tanvi Bhatt',      speciality: 'Neurologist',         degree: 'MBBS, DM',    experience: '5 Years',  fees: 700,  address: { line1: '72, Satellite Road', line2: 'Ahmedabad, Gujarat - 380015' } },

    // ── Gastroenterologists ──
    { name: 'Dr. Sneha Joshi',      speciality: 'Gastroenterologist',  degree: 'MBBS, MD',    experience: '4 Years',  fees: 500,  address: { line1: '43, Saket District Centre', line2: 'New Delhi, Delhi - 110017' } },
    { name: 'Dr. Arun Pillai',      speciality: 'Gastroenterologist',  degree: 'MBBS, DM',    experience: '9 Years',  fees: 1100, address: { line1: '6, Palarivattom Junction', line2: 'Kochi, Kerala - 682025' } },
    { name: 'Dr. Manish Agarwal',   speciality: 'Gastroenterologist',  degree: 'MBBS, MD',    experience: '7 Years',  fees: 900,  address: { line1: '38, Hazratganj', line2: 'Lucknow, Uttar Pradesh - 226001' } },
    { name: 'Dr. Divya Krishnan',   speciality: 'Gastroenterologist',  degree: 'MBBS, DM',    experience: '5 Years',  fees: 700,  address: { line1: '25, Nungambakkam', line2: 'Chennai, Tamil Nadu - 600034' } },
    { name: 'Dr. Saurabh Tiwari',   speciality: 'Gastroenterologist',  degree: 'MBBS, MD',    experience: '3 Years',  fees: 550,  address: { line1: '60, Gomti Nagar', line2: 'Lucknow, Uttar Pradesh - 226010' } },
    { name: 'Dr. Pallavi Desai',    speciality: 'Gastroenterologist',  degree: 'MBBS, DM',    experience: '6 Years',  fees: 800,  address: { line1: '14, Viman Nagar', line2: 'Pune, Maharashtra - 411014' } },
    { name: 'Dr. Nikhil Bose',      speciality: 'Gastroenterologist',  degree: 'MBBS, MD',    experience: '4 Years',  fees: 600,  address: { line1: '77, Ballygunge Circular Road', line2: 'Kolkata, West Bengal - 700019' } },

    // ── Extra variety ──
    { name: 'Dr. Ishaan Kapoor',    speciality: 'General physician',   degree: 'MBBS, MD',    experience: '10+ Years',fees: 1000, address: { line1: '3, Vasant Vihar', line2: 'New Delhi, Delhi - 110057' } },
    { name: 'Dr. Zara Sheikh',      speciality: 'Dermatologist',       degree: 'MBBS, MD',    experience: '5 Years',  fees: 600,  address: { line1: '11, Bandra Kurla Complex', line2: 'Mumbai, Maharashtra - 400051' } },
    { name: 'Dr. Rohan Verma',      speciality: 'Neurologist',         degree: 'MBBS, DM',    experience: '3 Years',  fees: 600,  address: { line1: '48, Sector 14, Gurgaon', line2: 'Haryana - 122001' } },
    { name: 'Dr. Nandita Roy',      speciality: 'Gynecologist',        degree: 'MBBS, MS',    experience: '6 Years',  fees: 750,  address: { line1: '30, Alipore Road', line2: 'Kolkata, West Bengal - 700027' } },
    { name: 'Dr. Sameer Khanna',    speciality: 'Gastroenterologist',  degree: 'MBBS, DM',    experience: '8 Years',  fees: 950,  address: { line1: '5, Panchsheel Park', line2: 'New Delhi, Delhi - 110017' } },
    { name: 'Dr. Tara Menon',       speciality: 'Pediatricians',       degree: 'MBBS, MD',    experience: '7 Years',  fees: 700,  address: { line1: '62, Indiranagar', line2: 'Bangalore, Karnataka - 560038' } },
    { name: 'Dr. Varun Sinha',      speciality: 'General physician',   degree: 'MBBS',        experience: '1 Years',  fees: 350,  address: { line1: '19, Boring Road', line2: 'Patna, Bihar - 800001' } },
    { name: 'Dr. Chitra Iyer',      speciality: 'Dermatologist',       degree: 'MBBS, DVD',   experience: '2 Years',  fees: 400,  address: { line1: '8, Mylapore', line2: 'Chennai, Tamil Nadu - 600004' } },
    { name: 'Dr. Abhishek Rao',     speciality: 'Neurologist',         degree: 'MBBS, MD',    experience: '10+ Years',fees: 1400, address: { line1: '50, Koregaon Park', line2: 'Pune, Maharashtra - 411001' } },
    { name: 'Dr. Mala Krishnan',    speciality: 'Gynecologist',        degree: 'MBBS, DGO',   experience: '4 Years',  fees: 650,  address: { line1: '17, Velachery Main Road', line2: 'Chennai, Tamil Nadu - 600042' } },
    { name: 'Dr. Gaurav Pandey',    speciality: 'Gastroenterologist',  degree: 'MBBS, MD',    experience: '5 Years',  fees: 700,  address: { line1: '28, Gomti Nagar Extension', line2: 'Lucknow, Uttar Pradesh - 226010' } },
    { name: 'Dr. Shruti Agarwal',   speciality: 'Pediatricians',       degree: 'MBBS, DCH',   experience: '3 Years',  fees: 450,  address: { line1: '40, Vaishali Nagar', line2: 'Jaipur, Rajasthan - 302021' } },
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
            const firstName = doc.name.split(' ')[1] || doc.name;
            doc.password = hashedPassword;
            doc.email = doc.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@medinexus.com';
            doc.available = Math.random() > 0.15; // ~85% available
            doc.date = Date.now();
            doc.rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
            doc.reviewCount = Math.floor(Math.random() * 200) + 30;
            doc.about = aboutText.replace('{name}', firstName);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            doc.image = `${frontendUrl}/doc${(doctors.indexOf(doc) % 15) + 1}.png`;
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
