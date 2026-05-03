# MediNexus AI — Deployment Guide

## Architecture
- **Backend** → [Render.com](https://render.com) (free tier)
- **Frontend** → [Vercel](https://vercel.com) — includes User App + Admin Panel + Doctor Portal

> ℹ️ The `/admin` folder in the repo is a legacy standalone app — **do NOT deploy it**.
> Admin panel is already embedded in the frontend at `/admin/*` routes.

---

## What gets deployed where

```
your-frontend.vercel.app/              → User facing app
your-frontend.vercel.app/admin         → Admin panel (same Vercel deployment)
your-frontend.vercel.app/doctor-portal → Doctor portal (same Vercel deployment)
```

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

> This single deployment covers the **User App + Admin Panel + Doctor Portal**

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Set **Root Directory**: `Medinexus-Ai-/frontend`
4. **Framework**: Vite (auto-detected)
5. Add environment variables:

| Key | Value |
|-----|-------|
| `VITE_BACKEND_URL` | `https://medinexus-backend-k427.onrender.com` |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_SkrWttzP0SczbB` |

6. Deploy → Copy the frontend URL

After deploy, your URLs will be:
- `https://your-app.vercel.app/` — User app
- `https://your-app.vercel.app/admin` — Admin panel
- `https://your-app.vercel.app/doctor-portal` — Doctor portal

---

## Step 3 — Update Backend with Frontend URL

Go back to Render → Environment Variables → Update:
- `FRONTEND_URL` = `https://medinexus-eight.vercel.app`
- `ADMIN_URL` = `https://medinexus-eight.vercel.app`

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
