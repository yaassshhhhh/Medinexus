# 📚 MediNexus AI - API Documentation

## Base URL
```
Development: http://localhost:4000
Production: https://your-backend.onrender.com
```

## Authentication
Most endpoints require authentication via JWT token in headers:
```
token: <user_jwt_token>
dtoken: <doctor_jwt_token>
atoken: <admin_jwt_token>
```

---

## 👤 User Endpoints

### Register User
```http
POST /api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get User Profile
```http
POST /api/user/get-profile
Headers: { "token": "<jwt_token>" }
```

### Update User Profile
```http
POST /api/user/update-profile
Headers: { "token": "<jwt_token>" }
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "1234567890",
  "address": { "line1": "123 Street", "line2": "City" },
  "gender": "Male",
  "dob": "1990-01-01"
}
```

### Book Appointment
```http
POST /api/user/book-appointment
Headers: { "token": "<jwt_token>" }
Content-Type: application/json

{
  "docId": "doctor_id",
  "slotDate": "15_4_2026",
  "slotTime": "10:00 AM"
}
```

### Get User Appointments
```http
POST /api/user/appointments
Headers: { "token": "<jwt_token>" }
```

### Cancel Appointment
```http
POST /api/user/cancel-appointment
Headers: { "token": "<jwt_token>" }
Content-Type: application/json

{
  "appointmentId": "appointment_id"
}
```

### Payment (Razorpay)
```http
POST /api/user/payment-razorpay
Headers: { "token": "<jwt_token>" }
Content-Type: application/json

{
  "appointmentId": "appointment_id"
}
```

---

## 👨‍⚕️ Doctor Endpoints

### Doctor Login
```http
POST /api/doctor/login
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "password123"
}
```

### Get Doctor Appointments
```http
POST /api/doctor/appointments
Headers: { "dtoken": "<doctor_jwt_token>" }
```

### Mark Appointment Complete
```http
POST /api/doctor/complete-appointment
Headers: { "dtoken": "<doctor_jwt_token>" }
Content-Type: application/json

{
  "appointmentId": "appointment_id"
}
```

### Get Doctor Dashboard
```http
POST /api/doctor/dashboard
Headers: { "dtoken": "<doctor_jwt_token>" }
```

### Get Doctor Earnings
```http
POST /api/doctor/earnings
Headers: { "dtoken": "<doctor_jwt_token>" }
```

---

## 🏥 Admin Endpoints

### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

### Add Doctor
```http
POST /api/admin/add-doctor
Headers: { "atoken": "<admin_jwt_token>" }
Content-Type: multipart/form-data

{
  "name": "Dr. Smith",
  "email": "smith@example.com",
  "password": "password123",
  "speciality": "Cardiologist",
  "degree": "MBBS, MD",
  "experience": "10 Years",
  "about": "Experienced cardiologist",
  "fees": "500",
  "address": { "line1": "Hospital St", "line2": "City" },
  "image": <file>
}
```

### Get All Doctors
```http
POST /api/admin/all-doctors
Headers: { "atoken": "<admin_jwt_token>" }
```

### Get All Appointments
```http
POST /api/admin/appointments
Headers: { "atoken": "<admin_jwt_token>" }
```

### Cancel Appointment (Admin)
```http
POST /api/admin/cancel-appointment
Headers: { "atoken": "<admin_jwt_token>" }
Content-Type: application/json

{
  "appointmentId": "appointment_id"
}
```

### Get Admin Dashboard
```http
POST /api/admin/dashboard
Headers: { "atoken": "<admin_jwt_token>" }
```

---

## 🤖 Chatbot Endpoint

### Chat with AI
```http
POST /api/chatbot/chat
Content-Type: application/json

{
  "message": "I have a headache"
}
```

---

## 🗺️ Maps Endpoint

### Get Nearby Hospitals
```http
POST /api/maps/nearby-hospitals
Content-Type: application/json

{
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

---

## 🎥 Video Consult Endpoints

### Book Video Consultation
```http
POST /api/video-consult/book
Content-Type: application/json

{
  "userId": "user_id",
  "docId": "doctor_id",
  "docName": "Dr. Smith",
  "docImage": "image_url",
  "docSpeciality": "Cardiologist",
  "slotDate": "15_4_2026",
  "slotTime": "10:00 AM"
}
```

---

## ⭐ Review Endpoints

### Add Review
```http
POST /api/reviews/add
Headers: { "token": "<jwt_token>" }
Content-Type: application/json

{
  "appointmentId": "appointment_id",
  "docId": "doctor_id",
  "rating": 5,
  "comment": "Great doctor!"
}
```

### Get Doctor Reviews
```http
GET /api/reviews/doctor/:docId
```

### Check if Reviewed
```http
GET /api/reviews/check/:appointmentId
```

---

## 📰 Newsletter Endpoint

### Subscribe to Newsletter
```http
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## 💊 Prescription Endpoints (NEW)

### Create Prescription
```http
POST /api/prescription/create
Headers: { "dtoken": "<doctor_jwt_token>" }
Content-Type: application/json

{
  "appointmentId": "appointment_id",
  "docId": "doctor_id",
  "diagnosis": "Common Cold",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "duration": "5 days",
      "instructions": "Take after meals"
    }
  ],
  "labTests": ["Blood Test", "X-Ray"],
  "notes": "Rest and drink plenty of water",
  "followUpDate": "2026-04-20"
}
```

### Get Prescription
```http
GET /api/prescription/:appointmentId
```

### Get Patient Prescriptions
```http
POST /api/prescription/patient
Headers: { "token": "<jwt_token>" }
```

---

## 🏥 Medical Record Endpoints (NEW)

### Get Medical Record
```http
POST /api/medical-record/get
Headers: { "token": "<jwt_token>" }
```

### Update Medical Record
```http
POST /api/medical-record/update
Headers: { "token": "<jwt_token>" }
Content-Type: application/json

{
  "bloodGroup": "O+",
  "height": "175cm",
  "weight": "70kg",
  "allergies": ["Peanuts", "Penicillin"],
  "chronicDiseases": ["Diabetes"],
  "currentMedications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily"
    }
  ],
  "emergencyContact": {
    "name": "Jane Doe",
    "relation": "Spouse",
    "phone": "9876543210"
  },
  "insuranceInfo": {
    "provider": "Health Insurance Co",
    "policyNumber": "POL123456",
    "validUntil": "2027-12-31"
  }
}
```

### Upload Medical Document
```http
POST /api/medical-record/upload-document
Headers: { "token": "<jwt_token>" }
Content-Type: multipart/form-data

{
  "document": <file>
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔒 Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🚀 Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

---

## 📝 Notes

- All dates in format: `DD_MM_YYYY`
- All times in format: `HH:MM AM/PM`
- File uploads max size: 10MB
- Supported image formats: JPG, PNG, WEBP
- JWT tokens expire in 7 days

---

## 🔗 WebSocket Events (Video Consultation)

### Client → Server
- `join-room` - Join video room
- `signal` - WebRTC signaling
- `chat-message` - Send chat message
- `end-call` - End video call

### Server → Client
- `user-joined` - User joined room
- `room-info` - Room information
- `signal` - WebRTC signaling
- `chat-message` - Receive chat message
- `call-ended` - Call ended
- `peer-disconnected` - Peer disconnected

---

For more details, visit: [GitHub Repository](https://github.com/yaassshhhhh/doctor-appointment-system)
