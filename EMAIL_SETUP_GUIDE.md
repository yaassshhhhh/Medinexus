# 📧 Email Setup Guide for Medinexus AI

## 🔧 Gmail Configuration for Nodemailer

### ⚠️ Current Issue:
Gmail blocks "less secure apps" by default. You need to enable **App Passwords** for Nodemailer to work.

---

## ✅ Solution: Enable Gmail App Password

### **Step 1: Enable 2-Factor Authentication**

1. Go to **Google Account Settings**: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Scroll to **"How you sign in to Google"**
4. Click **"2-Step Verification"**
5. Follow the steps to enable 2FA (use phone number)

### **Step 2: Generate App Password**

1. After enabling 2FA, go back to **Security** page
2. Scroll to **"How you sign in to Google"**
3. Click **"App passwords"** (you'll see this option only after enabling 2FA)
4. Select:
   - **App:** Mail
   - **Device:** Other (Custom name) → Type "Medinexus Backend"
5. Click **"Generate"**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### **Step 3: Update Backend .env File**

Replace the current password with the App Password:

```env
ADMIN_EMAIL=aaryazambre75@gmail.com
ADMIN_PASSWORD=abcdefghijklmnop  # Replace with your 16-char app password (no spaces)
```

### **Step 4: Update Render Environment Variables**

1. Go to **Render.com** dashboard
2. Open your **medinexus-ai** backend service
3. Go to **Environment** tab
4. Update **ADMIN_PASSWORD** with the new App Password
5. Click **"Save Changes"**
6. Service will auto-redeploy

---

## 🧪 Testing Email Functionality

### **Test 1: OTP Email**
1. Go to frontend: https://medinexus-ai.vercel.app
2. Try to book an appointment
3. Click "Send OTP"
4. Check email inbox (and spam folder)

### **Test 2: Newsletter Email**
1. Go to frontend footer
2. Enter email in newsletter subscription
3. Click "Subscribe"
4. Check email inbox

### **Test 3: Backend Logs**
Check Render logs for email status:
```
✅ Email sent successfully: <message-id>
OR
❌ Email send failed: EAUTH
```

---

## 🔍 Common Errors & Solutions

### **Error: EAUTH - Authentication Failed**
**Solution:** App Password is wrong or not set
- Generate new App Password
- Update .env and Render environment variables
- Redeploy backend

### **Error: ECONNECTION - Connection Failed**
**Solution:** Network/firewall issue
- Check internet connection
- Verify Gmail SMTP is not blocked
- Try again after few minutes

### **Error: ETIMEDOUT - Timeout**
**Solution:** Gmail server slow or blocked
- Wait and retry
- Check if Gmail is down: https://www.google.com/appsstatus

---

## 📝 Alternative: Use SendGrid (Recommended for Production)

For production, consider using **SendGrid** instead of Gmail:

### **Why SendGrid?**
- ✅ More reliable
- ✅ Higher sending limits
- ✅ Better deliverability
- ✅ Free tier: 100 emails/day

### **Quick Setup:**
1. Sign up: https://sendgrid.com/
2. Get API Key
3. Update backend code:

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});
```

4. Add to .env:
```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

---

## ✅ Current Configuration

**Email Service:** Gmail SMTP  
**Host:** smtp.gmail.com  
**Port:** 587  
**Security:** TLS  
**From:** aaryazambre75@gmail.com  

**Features:**
- ✅ OTP for appointment booking
- ✅ Newsletter subscription
- ✅ Appointment reminders (24h before)
- ✅ Password reset emails

---

## 🚀 Next Steps

1. **Enable 2FA** on Gmail account
2. **Generate App Password**
3. **Update .env** file locally
4. **Update Render** environment variables
5. **Test** email functionality
6. **Monitor** Render logs for errors

---

## 📞 Support

If emails still don't work after following this guide:
1. Check Render logs for specific error codes
2. Verify App Password is correct (no spaces)
3. Try generating a new App Password
4. Consider switching to SendGrid

---

**Last Updated:** April 2026  
**Status:** Email configuration updated with better error handling
