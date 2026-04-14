# 🏥 Medinexus-AI

A comprehensive healthcare platform with AI-powered medical assistance, online appointment booking, video consultations, prescription management, and integrated payment system.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0-blue.svg)

---

## 🌟 Features

### For Patients
- 👤 User registration and authentication
- 🔍 Browse and filter doctors by specialty
- 📅 Book appointments with available time slots
- 💳 Secure online payment via Razorpay
- 🎥 HD Video consultation with screen sharing
- 🤖 AI-powered medical chatbot (24/7)
- 📧 Email notifications and reminders
- ⭐ Doctor reviews and ratings system
- 📋 Digital prescription management
- 🏥 Medical records storage
- 📄 Upload and manage medical documents
- 💊 Track medications and allergies
- 📱 Fully responsive design
- 🌙 Dark mode support
- 📰 Health tips newsletter

### For Doctors
- 📊 Personal dashboard
- 📋 Appointment management
- 💰 Earnings tracking
- 👥 Patient management
- 🎥 Video consultation interface

### For Admins
- 🏥 Doctor management (add/edit/remove)
- 📊 Analytics dashboard
- 📅 Appointment overview
- 👥 User management
- 💼 Complete system control

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: Context API
- **HTTP Client**: Axios
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Real-time**: Socket.IO
- **Email**: Nodemailer
- **Payment**: Razorpay
- **AI**: Google Gemini API

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Version Control**: Git/GitHub

---

## 📁 Project Structure

```
Medinexus-Ai/
├── backend/              # Node.js API server
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Auth & upload middlewares
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
│
├── frontend/            # User interface
│   ├── src/
│   │   ├── assets/     # Images & icons
│   │   ├── components/ # Reusable components
│   │   ├── context/    # Context providers
│   │   ├── pages/      # Page components
│   │   └── App.jsx     # Main app component
│   └── package.json
│
├── admin/               # Admin panel
│   ├── src/
│   │   ├── components/ # Admin components
│   │   ├── context/    # Admin context
│   │   ├── pages/      # Admin pages
│   │   └── App.jsx     # Admin app
│   └── package.json
│
└── Deployment Guides/   # Comprehensive deployment docs
    ├── START_HERE.md
    ├── QUICK_DEPLOY.md
    ├── DEPLOYMENT_GUIDE.md
    ├── DEPLOYMENT_CHECKLIST.md
    └── DEPLOYMENT_ARCHITECTURE.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd Medinexus-Ai
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (see backend/.env.example)
# Add your credentials

npm start
# Backend runs on http://localhost:4000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file (see frontend/.env.example)
# Add backend URL

npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Admin Setup
```bash
cd admin
npm install

# Create .env file (see admin/.env.example)
# Add backend URL

npm run dev
# Admin runs on http://localhost:5174
```

---

## 🌐 Deployment

### 🎯 Quick Deployment (15 minutes)

**Want to deploy your app to production?**

👉 **Start here**: [START_HERE.md](./START_HERE.md)

We have comprehensive deployment guides:

1. **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** ⚡
   - Hindi step-by-step guide
   - Perfect for beginners
   - 3 simple steps

2. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** 📖
   - Complete technical documentation
   - Multiple deployment options
   - Troubleshooting included

3. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** ✅
   - Don't miss any step
   - Testing checklist
   - Production readiness

4. **[DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)** 🏗️
   - System architecture
   - Scaling strategy
   - Cost breakdown

### Deployment Platforms
- **Backend**: Render.com (Free tier available)
- **Frontend**: Vercel (Free tier available)
- **Admin**: Vercel (Free tier available)
- **Database**: MongoDB Atlas (Free tier available)

**Total Cost**: $0/month (Free tier) or $16/month (Production)

---

## 🔑 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
ADMIN_EMAIL=your_email@gmail.com
ADMIN_PASSWORD=your_app_password
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Admin (.env)
```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## 📚 API Documentation

### User Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `POST /api/user/book-appointment` - Book appointment
- `GET /api/user/appointments` - Get user appointments

### Doctor Endpoints
- `POST /api/doctor/login` - Doctor login
- `GET /api/doctor/appointments` - Get doctor appointments
- `POST /api/doctor/complete-appointment` - Mark appointment complete
- `GET /api/doctor/dashboard` - Doctor dashboard data

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/add-doctor` - Add new doctor
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/dashboard` - Admin dashboard data

### Other Endpoints
- `POST /api/chatbot/chat` - AI chatbot interaction
- `GET /api/maps/nearby-hospitals` - Find nearby hospitals
- `POST /api/video-consult/create-room` - Create video room
- `POST /api/reviews/add` - Add doctor review

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run lint
npm run build
```

### Manual Testing Checklist
- [ ] User registration/login
- [ ] Doctor listing and filtering
- [ ] Appointment booking
- [ ] Payment processing
- [ ] Video consultation
- [ ] AI chatbot
- [ ] Email notifications
- [ ] Admin panel access
- [ ] Responsive design

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Input validation
- ✅ XSS protection
- ✅ SQL injection prevention
- ✅ Secure file uploads
- ✅ Environment variable protection
- ✅ HTTPS enforcement (production)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: [Your Name]
- **Project Type**: Healthcare Platform
- **Year**: 2026

---

## 📞 Support

For deployment help or issues:
1. Check [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
2. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Use [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
4. Check deployment logs (Render/Vercel dashboard)

---

## 🎯 Roadmap

- [x] User authentication
- [x] Doctor management
- [x] Appointment booking
- [x] Payment integration
- [x] Video consultation
- [x] AI chatbot
- [x] Email notifications
- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Prescription management
- [ ] Medical records storage

---

## 🌟 Acknowledgments

- React team for the amazing framework
- MongoDB for the database
- Vercel & Render for hosting
- Cloudinary for image storage
- Razorpay for payment gateway
- Google for Gemini AI

---

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 50+
- **API Endpoints**: 30+
- **Database Models**: 7
- **Features**: 20+

---

## 🚀 Live Demo

**Coming Soon!**

After deployment, your URLs will be:
- Frontend: `https://your-app.vercel.app`
- Admin: `https://your-admin.vercel.app`
- Backend: `https://your-backend.onrender.com`

---

## 💡 Tips for Success

1. **Start with QUICK_DEPLOY.md** - Easiest way to deploy
2. **Use the checklist** - Don't miss any step
3. **Test locally first** - Ensure everything works
4. **Monitor logs** - Check for errors after deployment
5. **Keep credentials safe** - Never commit .env files

---

**Ready to deploy?** 👉 [START_HERE.md](./START_HERE.md)

**Need help?** 👉 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

Made with ❤️ for better healthcare access
