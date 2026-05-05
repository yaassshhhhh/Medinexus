import mongoose from 'mongoose';
import doctorModel from '../models/doctorModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Female name indicators (common Indian + general female names/prefixes)
const FEMALE_NAMES = [
  'aarti', 'anjali', 'kavita', 'meera', 'neha', 'priya', 'sunita', 'pooja',
  'anita', 'rekha', 'suman', 'geeta', 'nisha', 'ritu', 'seema', 'shweta',
  'divya', 'deepa', 'radha', 'lata', 'usha', 'mala', 'asha', 'kiran',
  'swati', 'archana', 'vandana', 'meenakshi', 'lakshmi', 'sarita', 'poonam',
  'manisha', 'rashmi', 'jyoti', 'mamta', 'reena', 'sonia', 'monika', 'preeti',
  'nidhi', 'shruti', 'garima', 'renu', 'sudha', 'veena', 'kamla', 'saroj',
  'pushpa', 'savita', 'shanti', 'maya', 'leela', 'hema', 'vimla', 'indira',
  'padma', 'nalini', 'shobha', 'madhuri', 'smita', 'amita', 'sunanda',
  'chandra', 'vani', 'yamini', 'lavanya', 'bhavna', 'komal', 'payal',
  'riya', 'tanya', 'simran', 'harpreet', 'gurpreet', 'manpreet', 'jaspreet',
  'sneha', 'tanvi', 'aditi', 'ankita', 'aparna', 'aruna', 'bharati', 'chhaya',
  'disha', 'ekta', 'falak', 'gauri', 'heena', 'ishita', 'juhi', 'kajal',
  'khushi', 'laxmi', 'manju', 'namrata', 'nandita', 'natasha', 'nikita',
  'pallavi', 'parvati', 'pinki', 'pratibha', 'puja', 'ragini', 'ranjana',
  'roshni', 'ruhi', 'rupali', 'sakshi', 'sangeeta', 'sapna', 'shikha',
  'shipra', 'shirin', 'shobhna', 'shreya', 'simi', 'sonal', 'sonam',
  'suchitra', 'supriya', 'surbhi', 'taruna', 'trisha', 'tulsi', 'urvashi',
  'varsha', 'vidya', 'vineeta', 'vrinda', 'yashoda', 'zoya',
  'aisha', 'fatima', 'zara', 'sara', 'sarah', 'mary', 'elizabeth', 'jennifer',
  'jessica', 'emily', 'sophia', 'olivia', 'emma', 'isabella', 'mia', 'ava',
  'nair', // Dr. Meera Nair — last name check handled by first name
  'rao',  // Dr. Kavita Rao — last name check handled by first name
  'chawla', // Dr. Aarti Chawla — last name check handled by first name
  'mehta',  // Dr. Anjali Mehta — last name check handled by first name
  'verma',  // Dr. Neha Verma — last name check handled by first name
  'kapoor', // Dr. Priya Kapoor — last name check handled by first name
];

// Determine gender from doctor name
const inferGender = (fullName) => {
  if (!fullName) return 'Male';
  
  // Remove "Dr." prefix and split into parts
  const cleaned = fullName.replace(/^dr\.?\s*/i, '').toLowerCase().trim();
  const parts = cleaned.split(/\s+/);
  
  // Check first name (most reliable indicator)
  const firstName = parts[0] || '';
  
  if (FEMALE_NAMES.includes(firstName)) return 'Female';
  
  // Also check if any part of the name is a known female name
  for (const part of parts) {
    if (FEMALE_NAMES.includes(part)) return 'Female';
  }
  
  return 'Male';
};

const updateGender = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const doctors = await doctorModel.find({});
    console.log(`📋 Found ${doctors.length} doctors\n`);

    let updated = 0;
    let skipped = 0;

    for (const doc of doctors) {
      const inferredGender = inferGender(doc.name);
      
      // Always re-infer and update based on name
      await doctorModel.findByIdAndUpdate(doc._id, { gender: inferredGender });
      console.log(`✅ ${doc.name} → ${inferredGender} (was: ${doc.gender || 'not set'})`);
      updated++;
    }

    console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateGender();
