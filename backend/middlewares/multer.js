import multer from 'multer'
import path from 'path'
import os from 'os'

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, os.tmpdir()) // use system temp dir — works on all platforms
    },
    filename: function (req, file, callback) {
        // Sanitize filename to prevent path traversal
        const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_')
        callback(null, Date.now() + '_' + safeName)
    }
})

const fileFilter = (req, file, callback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(new Error('Invalid file type. Only images and documents are allowed.'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
})

export default upload

