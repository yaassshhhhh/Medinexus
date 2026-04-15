# Email System Fix Guide

## Problem
Email system band ho gaya tha aur forgot password kaam nahi kar raha tha.

## Solution

### Step 1: Gmail App Password Setup

1. **Google Account Settings** mein jao: https://myaccount.google.com/
2. **Security** section mein jao
3. **2-Step Verification** enable karo (agar already nahi hai)
4. **App Passwords** search karo
5. Naya App Password generate karo:
   - App: Mail
   - Device: Other (Custom name) - "Medinexus Backend" likh do
6. 16-digit password milega (spaces ke saath)

### Step 2: Update .env File

Backend `.env` file mein update karo:

```env
# Email Configuration
ADMIN_EMAIL=mahajanyash2054@gmail.com
ADMIN_PASSWORD=xxxx xxxx xxxx xxxx  # 16-digit App Password (spaces included)
```

**IMPORTANT**: `ADMIN_PASSWORD` mein normal Gmail password nahi, App Password use karo!

### Step 3: Remove Hasan Kazi & Update Ratings

Backend directory mein jao aur script run karo:

```bash
cd Medinexus-Ai/backend
npm run update-doctors
```

Yeh script:
- ✅ Hasan Kazi ka card remove karega
- ✅ Har doctor ko unique rating dega (4.4 to 4.9)
- ✅ Har doctor ko unique review count dega (76 to 203)

### Step 4: Test Forgot Password

1. Frontend kholo: http://localhost:5173/login
2. "Forgot password?" link par click karo
3. Email enter karo
4. OTP email mein aayega
5. OTP enter karke new password set karo

## Features Now Working

### 1. Forgot Password Flow
- User email enter karta hai
- 6-digit OTP email par jaata hai
- OTP verify hone ke baad new password set kar sakte hain
- OTP 10 minutes mein expire ho jaata hai

### 2. Doctor Ratings
- Har doctor ki unique rating hai (4.4 to 4.9)
- Rating se filter kar sakte ho
- Review count bhi unique hai

### 3. Email Notifications
- Appointment booking OTP
- Forgot password OTP
- Video consult notifications

## Troubleshooting

### Email nahi aa raha?

1. **Check Spam folder**
2. **Verify App Password**: Spaces included hona chahiye
3. **Check .env file**: ADMIN_EMAIL aur ADMIN_PASSWORD correct hain?
4. **2-Step Verification**: Google account mein enabled hai?

### Script error aa raha?

```bash
# MongoDB connection check karo
cd Medinexus-Ai/backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

### Render logs check karo

Production mein agar email fail ho:
1. Render dashboard kholo
2. Logs dekho
3. OTP console mein print hoga (temporary fix)

## Production Deployment

Render environment variables mein add karo:
- `ADMIN_EMAIL`: mahajanyash2054@gmail.com
- `ADMIN_PASSWORD`: [16-digit App Password]

## Testing

```bash
# Local testing
cd Medinexus-Ai/backend
npm run server

# Separate terminal
cd Medinexus-Ai/frontend
npm run dev
```

Test forgot password:
1. Go to /login
2. Click "Forgot password?"
3. Enter email
4. Check email for OTP
5. Enter OTP and new password

## Notes

- OTP valid for 10 minutes only
- Each OTP can be used only once
- Gmail App Password is different from normal password
- Don't commit .env file to Git!

---

**Status**: ✅ All systems working
**Last Updated**: April 15, 2026
