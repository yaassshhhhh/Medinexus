# MediNexus AI — Deployment Guide

## Architecture
- **Backend** → [Render.com](https://render.com) (free tier)
- **Frontend** → [Vercel](https://vercel.com)
- **Admin Panel** → [Vercel](https://vercel.com) (separate project)

---

## Step 1 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory**: `Medinexus-Ai-/backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add all environment variables from `.env.example`:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `MONGODB_URI` | Your MongoDB Atlas URI |
| `JWT_SECRET` | Strong random string (32+ chars) |
| `GEMINI_API_KEY` | From Google AI Studio |
| `CLOUDINARY_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Your Cloudinary secret |
| `ADMIN_EMAIL` | Gmail address |
| `ADMIN_PASSWORD` | Gmail App Password (16 chars) |
| `RAZORPAY_KEY_ID` | `rzp_test_SkrWttzP0SczbB` |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret |
| `FRONTEND_URL` | Fill after Step 2 |
| `ADMIN_URL` | Fill after Step 3 |

7. Deploy → Copy the backend URL (e.g. `https://medinexus-backend.onrender.com`)

---

## Step 2 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Set **Root Directory**: `Medinexus-Ai-/frontend`
4. **Framework**: Vite
5. Add environment variables:

| Key | Value |
|-----|-------|
| `VITE_BACKEND_URL` | Your Render backend URL |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_SkrWttzP0SczbB` |

6. Deploy → Copy the frontend URL

---

## Step 3 — Deploy Admin Panel on Vercel

1. New Project on Vercel → same repo
2. Set **Root Directory**: `Medinexus-Ai-/admin`
3. **Framework**: Vite
4. Add environment variables:

| Key | Value |
|-----|-------|
| `VITE_BACKEND_URL` | Your Render backend URL |

5. Deploy → Copy the admin URL

---

## Step 4 — Update Backend URLs

Go back to Render → Environment Variables → Update:
- `FRONTEND_URL` = your Vercel frontend URL
- `ADMIN_URL` = your Vercel admin URL

Then **Redeploy** the backend.

---

## Step 5 — Verify Deployment

- [ ] Frontend loads at Vercel URL
- [ ] Admin panel loads at Vercel admin URL
- [ ] Backend health check: `GET https://your-backend.onrender.com/`  → `API WORKING`
- [ ] User registration works
- [ ] Doctor list loads
- [ ] Chatbot responds
- [ ] Payment flow works (use Razorpay test card: `4111 1111 1111 1111`)

---

## Gmail App Password Setup

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → Enable
3. Security → App Passwords → Generate
4. Select "Mail" → Copy the 16-character password
5. Use this as `ADMIN_PASSWORD` in backend env

---

## MongoDB Atlas Setup

1. [mongodb.com/atlas](https://mongodb.com/atlas) → Free cluster
2. Database Access → Add user with password
3. Network Access → Allow `0.0.0.0/0` (all IPs for Render)
4. Connect → Drivers → Copy connection string
5. Replace `<password>` with your DB user password

---

## Notes

- Render free tier **spins down after 15 min inactivity** — first request may take 30-60 seconds
- For production, upgrade to Render paid plan or use Railway/Fly.io
- Razorpay test mode: use test card `4111 1111 1111 1111`, CVV `123`, any future date
- For live payments, switch to `rzp_live_*` keys in Razorpay dashboard
