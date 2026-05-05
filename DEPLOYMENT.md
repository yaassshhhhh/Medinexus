# MediNexus AI — Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Render.com (Backend)                                   │
│  Node.js + Express + Socket.IO                          │
│  https://your-backend.onrender.com                      │
└─────────────────────────────────────────────────────────┘
         ↑ API calls + WebSocket
┌──────────────────────┐    ┌──────────────────────────┐
│  Vercel (Frontend)   │    │  Vercel (Admin)           │
│  User App            │    │  Admin Panel              │
│  Doctor Portal       │    │  https://your-admin.      │
│  Video Consult       │    │  vercel.app               │
│  Messaging           │    │                           │
└──────────────────────┘    └──────────────────────────┘
```

**3 separate deployments:**
1. `Medinexus-Ai-/backend` → Render.com
2. `Medinexus-Ai-/frontend` → Vercel (user app + doctor portal)
3. `Medinexus-Ai-/admin` → Vercel (admin panel, separate project)

---

## Step 1 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Root Directory**: `Medinexus-Ai-/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18+

4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `MONGODB_URI` | Your MongoDB Atlas URI |
| `JWT_SECRET` | Strong random string (32+ chars) |
| `GEMINI_API_KEY` | From [Google AI Studio](https://aistudio.google.com) |
| `CLOUDINARY_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Your Cloudinary secret |
| `ADMIN_EMAIL` | Gmail address for sending emails |
| `ADMIN_PASSWORD` | Gmail App Password (16 chars, see below) |
| `RAZORPAY_KEY_ID` | Your Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret |
| `FRONTEND_URL` | *(fill after Step 2)* |
| `ADMIN_URL` | *(fill after Step 3)* |

5. Deploy → Copy the backend URL (e.g. `https://medinexus-backend.onrender.com`)

---

## Step 2 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Settings:
   - **Root Directory**: `Medinexus-Ai-/frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_BACKEND_URL` | `https://your-backend.onrender.com` |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay key ID |
| `VITE_ADMIN_URL` | *(fill after Step 3 — your admin Vercel URL)* |

5. Deploy → Copy the frontend URL (e.g. `https://medinexus.vercel.app`)

> **Note:** Add a `vercel.json` in the frontend folder if you haven't already (for SPA routing):
> ```json
> { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
> ```

---

## Step 3 — Deploy Admin Panel on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** (separate project)
2. Import the same GitHub repo
3. Settings:
   - **Root Directory**: `Medinexus-Ai-/admin`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_BACKEND_URL` | `https://your-backend.onrender.com` |

5. Deploy → Copy the admin URL (e.g. `https://medinexus-admin.vercel.app`)

---

## Step 4 — Update Backend & Frontend with Final URLs

### On Render (Backend env vars):
- `FRONTEND_URL` = `https://medinexus.vercel.app`
- `ADMIN_URL` = `https://medinexus-admin.vercel.app`

Then click **Manual Deploy → Deploy latest commit** on Render.

### On Vercel (Frontend env vars):
- `VITE_ADMIN_URL` = `https://medinexus-admin.vercel.app`

Then redeploy the frontend on Vercel.

---

## Step 5 — Verify Everything Works

- [ ] `GET https://your-backend.onrender.com/` → returns `API WORKING`
- [ ] Frontend loads at Vercel URL
- [ ] User can register and login
- [ ] Doctor list loads
- [ ] Appointment booking works (OTP email received)
- [ ] Razorpay payment works (test card: `4111 1111 1111 1111`, CVV `123`, any future date)
- [ ] Video call works (open in two tabs — user + doctor portal)
- [ ] Doctor-Patient messaging works (send from user, check doctor portal)
- [ ] Admin panel loads and admin can login
- [ ] AI Chatbot responds

---

## Gmail App Password Setup

Required for OTP emails and appointment reminders.

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. **Security → 2-Step Verification** → Enable it
3. **Security → App Passwords** → Generate new
4. Select "Mail" → Copy the 16-character password
5. Use this as `ADMIN_PASSWORD` in backend env vars

---

## MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. **Database Access** → Add user with username + password
3. **Network Access** → Add IP `0.0.0.0/0` (allows Render to connect)
4. **Connect → Drivers** → Copy connection string
5. Replace `<password>` with your DB user password
6. Use as `MONGODB_URI`

---

## Razorpay Setup

1. Go to [razorpay.com](https://razorpay.com) → Create account
2. **Settings → API Keys** → Generate test keys
3. Use `rzp_test_*` keys for testing, `rzp_live_*` for production
4. Test card: `4111 1111 1111 1111`, CVV `123`, any future expiry

---

## Important Notes

### Socket.IO (Video Call + Messaging)
- Socket.IO requires a **persistent server** — this is why backend is on Render, not Vercel
- Vercel is serverless and **cannot** run Socket.IO
- Render free tier spins down after 15 min inactivity — first request takes 30-60 sec
- For production with heavy traffic, upgrade to Render paid plan or use Railway/Fly.io

### CORS
- Backend automatically allows your Vercel frontend URLs
- If you use a custom domain, add it to `allowedOrigins` in `server.js`

### Environment Variables
- Never commit `.env` files to git (already in `.gitignore`)
- Always set env vars through Render/Vercel dashboards

---

## Quick Reference — All URLs After Deploy

| Service | URL |
|---------|-----|
| Backend API | `https://your-backend.onrender.com` |
| User App | `https://your-frontend.vercel.app` |
| Doctor Portal | `https://your-frontend.vercel.app/doctor-portal` |
| Admin Panel | `https://your-admin.vercel.app` |
| Video Consult | `https://your-frontend.vercel.app/video-consult` |
