# 🔧 OTP Email Fix Guide

## 🚨 Current Issue:
OTP emails are not being sent due to Gmail authentication issues.

---

## ✅ SOLUTION 1: Update Gmail App Password (RECOMMENDED)

### **Step 1: Generate New Gmail App Password**

1. **Go to Google Account**: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Scroll to **"How you sign in to Google"**
4. Click **"2-Step Verification"**
   - If not enabled, enable it first (use phone number)
5. After 2FA is enabled, go back to **Security**
6. Click **"App passwords"**
7. Select:
   - **App:** Mail
   - **Device:** Other (Custom name) → Type "Rogveda Backend"
8. Click **"Generate"**
9. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
   - Remove spaces: `abcdefghijklmnop`

### **Step 2: Update Backend .env File**

Replace the current password:

```env
ADMIN_EMAIL=aaryazambre75@gmail.com
ADMIN_PASSWORD=your_new_16_char_app_password_here
```

### **Step 3: Update Render Environment Variables**

1. Go to **Render.com** dashboard
2. Open **medinexus-ai** (or rogveda-backend) service
3. Go to **Environment** tab
4. Update **ADMIN_PASSWORD** with new App Password
5. Click **"Save Changes"**
6. Service will auto-redeploy (5-10 minutes)

---

## ✅ SOLUTION 2: Use OTP from Console Logs (TEMPORARY)

### **For Testing/Development:**

I've updated the code to print OTP in console logs when email fails.

**How to use:**

1. **Try to send OTP** from frontend
2. **Check Render Logs**:
   - Go to Render dashboard
   - Open your backend service
   - Click **"Logs"** tab
   - Look for:
     ```
     ✅ OTP GENERATED: 123456
     🔑 USE THIS OTP FOR TESTING: 123456
     ```
3. **Copy the OTP** from logs
4. **Use it** in the frontend

---

## ✅ SOLUTION 3: Alternative Email Service (PRODUCTION)

### **Use SendGrid (Free 100 emails/day)**

**Step 1: Sign Up**
1. Go to: https://sendgrid.com/
2. Sign up for free account
3. Verify email

**Step 2: Get API Key**
1. Go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name: "Rogveda Backend"
4. Permissions: **Full Access**
5. Copy the API key

**Step 3: Update Backend Code**

Update `userController.js`:

```javascript
const getTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
        }
    });
};
```

**Step 4: Update .env**

```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

---

## 🧪 Testing OTP

### **Test 1: Check Render Logs**

```
1. Render dashboard → Backend service
2. Logs tab
3. Try sending OTP from frontend
4. Look for:
   ✅ OTP GENERATED: 123456
   📧 Sending OTP to: user@email.com
   ✅ Email sent successfully
   OR
   ❌ Email send failed: EAUTH
   🔑 USE THIS OTP FOR TESTING: 123456
```

### **Test 2: Check Email Inbox**

```
1. Send OTP from frontend
2. Check email inbox
3. Check spam folder
4. Wait 1-2 minutes
```

### **Test 3: Direct API Test**

```bash
# Using curl or Postman
POST https://medinexus-ai.onrender.com/api/user/send-booking-otp
Headers: { "token": "your_user_token" }
Body: {
  "userId": "user_id",
  "docId": "doctor_id",
  "slotDate": "15_4_2026",
  "slotTime": "10:00 AM"
}
```

---

## 🔍 Common Errors & Solutions

### **Error: EAUTH - Authentication Failed**

**Cause:** Gmail App Password is wrong or not set

**Solution:**
1. Generate new App Password (see Solution 1)
2. Update .env and Render
3. Redeploy backend

### **Error: ECONNECTION - Connection Failed**

**Cause:** Network/firewall issue or Gmail blocking

**Solution:**
1. Check internet connection
2. Try again after few minutes
3. Use SendGrid instead (Solution 3)

### **Error: ETIMEDOUT - Timeout**

**Cause:** Gmail server slow or blocked

**Solution:**
1. Wait and retry
2. Check Gmail status: https://www.google.com/appsstatus
3. Use alternative email service

---

## 📊 Current Configuration

**Email Service:** Gmail SMTP  
**Host:** smtp.gmail.com  
**Port:** 587  
**Security:** TLS  
**From:** aaryazambre75@gmail.com  
**Current Password:** dgiwhmtqvwcceypd (may be expired)

---

## 🚀 Quick Fix Steps

### **FASTEST FIX (5 minutes):**

1. **Generate Gmail App Password**
   - https://myaccount.google.com/security
   - Enable 2FA → App Passwords → Generate

2. **Update Render**
   - Dashboard → Backend service
   - Environment → ADMIN_PASSWORD
   - Paste new password (no spaces)
   - Save

3. **Wait 5-10 minutes** for redeploy

4. **Test OTP** from frontend

---

## 📝 Checklist

- [ ] 2FA enabled on Gmail
- [ ] App Password generated
- [ ] Backend .env updated (local)
- [ ] Render environment updated
- [ ] Backend redeployed
- [ ] OTP tested
- [ ] Email received
- [ ] Logs checked

---

## 💡 Pro Tips

1. **Always use App Passwords** for Gmail SMTP
2. **Never use regular Gmail password** (won't work)
3. **Check spam folder** for OTP emails
4. **Use SendGrid for production** (more reliable)
5. **Monitor Render logs** for errors
6. **Keep App Password secure** (don't share)

---

## 🆘 Still Not Working?

### **Option 1: Use Console Logs**
- Check Render logs for OTP
- Copy OTP from logs
- Use in frontend

### **Option 2: Switch to SendGrid**
- More reliable
- Better deliverability
- Free tier available

### **Option 3: Contact Support**
- Check if Gmail is blocking
- Verify account settings
- Try different email service

---

## 📞 Support

**If OTP still doesn't work:**
1. Share Render logs (screenshot)
2. Check Gmail security settings
3. Try SendGrid alternative
4. Use OTP from console logs (temporary)

---

**Last Updated:** April 2026  
**Status:** OTP logging enabled for debugging
