/**
 * fixDoctorImages.js
 * 
 * Uploads doctor images from admin/public/ to Cloudinary
 * and updates MongoDB with the new Cloudinary URLs.
 * 
 * Run: node scripts/fixDoctorImages.js
 */

import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

// Connect MongoDB
await mongoose.connect(process.env.MONGODB_URI)
console.log('✅ MongoDB connected')

// Import doctor model
const doctorSchema = new mongoose.Schema({
    name: String,
    image: String,
}, { strict: false })
const Doctor = mongoose.models.doctor || mongoose.model('doctor', doctorSchema)

// Images folder — admin/public/
const imagesDir = path.join(__dirname, '../../admin/public')

// Get all doctors
const doctors = await Doctor.find({})
console.log(`📋 Found ${doctors.length} doctors`)

let updated = 0
let skipped = 0

for (const doctor of doctors) {
    const imageUrl = doctor.image || ''

    // Skip if already a Cloudinary URL
    if (imageUrl.includes('cloudinary.com') || imageUrl.includes('res.cloudinary')) {
        console.log(`⏭️  Skipping ${doctor.name} — already on Cloudinary`)
        skipped++
        continue
    }

    // Extract filename from URL like http://localhost:5173/doc1.png
    const filename = imageUrl.split('/').pop() // e.g. "doc1.png"
    const localPath = path.join(imagesDir, filename)

    if (!filename || !fs.existsSync(localPath)) {
        console.log(`⚠️  Image not found locally for ${doctor.name}: ${filename}`)
        continue
    }

    try {
        console.log(`⬆️  Uploading ${filename} for ${doctor.name}...`)
        const result = await cloudinary.uploader.upload(localPath, {
            resource_type: 'image',
            folder: 'medinexus/doctors',
            public_id: `doctor_${doctor._id}`
        })

        await Doctor.findByIdAndUpdate(doctor._id, { image: result.secure_url })
        console.log(`✅ Updated ${doctor.name} → ${result.secure_url}`)
        updated++
    } catch (err) {
        console.error(`❌ Failed for ${doctor.name}:`, err.message)
    }
}

console.log(`\n🎉 Done! Updated: ${updated}, Skipped: ${skipped}`)
await mongoose.disconnect()
process.exit(0)
