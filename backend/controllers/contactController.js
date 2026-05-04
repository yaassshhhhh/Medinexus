import sendBrevoEmail from '../utils/brevoEmail.js';

const sendContactMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message)
            return res.json({ success: false, message: 'Name, email, and message are required.' });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.json({ success: false, message: 'Invalid email format.' });

        // Email to admin
        await sendBrevoEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `Contact Form: ${subject || 'New Message'} from ${name}`,
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <div style="background:linear-gradient(135deg,#0d9488,#06b6d4);padding:24px;border-radius:12px 12px 0 0;text-align:center">
                    <h2 style="color:white;margin:0">🏥 MediNexus AI — Contact Form</h2>
                </div>
                <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                    ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
                    <div style="background:white;border-left:4px solid #0d9488;padding:16px;border-radius:8px;margin-top:12px">
                        <p style="margin:0;color:#374151">${message.replace(/\n/g, '<br/>')}</p>
                    </div>
                </div>
            </div>`
        });

        // Auto-reply to user
        await sendBrevoEmail({
            to: email,
            subject: 'We received your message – MediNexus AI',
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <div style="background:linear-gradient(135deg,#0d9488,#06b6d4);padding:24px;border-radius:12px 12px 0 0;text-align:center">
                    <h2 style="color:white;margin:0">🏥 MediNexus AI</h2>
                    <p style="color:rgba(255,255,255,0.85);margin:6px 0 0">We received your message!</p>
                </div>
                <div style="background:#f9fafb;padding:24px;border-radius:0 0 12px 12px">
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>Thank you for reaching out. Our support team will get back to you within <strong>24 hours</strong>.</p>
                    <p>For urgent medical concerns, use our 24/7 AI chatbot on the website.</p>
                    <p style="margin-top:20px">Warm regards,<br/><strong>The MediNexus AI Team</strong></p>
                    <p style="color:#9ca3af;font-size:12px;margin-top:20px;text-align:center">© 2025 MediNexus AI. All rights reserved.</p>
                </div>
            </div>`
        });

        res.json({ success: true, message: "Message sent successfully! We'll get back to you within 24 hours." });

    } catch (error) {
        console.error('Contact form error:', error.message);
        res.json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
};

export { sendContactMessage };

const sendContactMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.json({ success: false, message: 'Name, email, and message are required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ success: false, message: 'Invalid email format.' });
        }

        // Email to admin
        const adminHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f5f5f5; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .field { margin-bottom: 16px; }
                    .label { font-weight: bold; color: #0ea5e9; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                    .value { margin-top: 4px; font-size: 15px; color: #333; }
                    .message-box { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; border-radius: 4px; margin-top: 8px; }
                    .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin:0;">🏥 MediNexus AI</h1>
                        <p style="margin:8px 0 0;">New Contact Form Submission</p>
                    </div>
                    <div class="content">
                        <div class="field"><div class="label">Name</div><div class="value">${name}</div></div>
                        <div class="field"><div class="label">Email</div><div class="value">${email}</div></div>
                        ${phone ? `<div class="field"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ''}
                        ${subject ? `<div class="field"><div class="label">Subject</div><div class="value">${subject}</div></div>` : ''}
                        <div class="field"><div class="label">Message</div><div class="message-box">${message.replace(/\n/g, '<br/>')}</div></div>
                    </div>
                    <div class="footer"><p>© 2025 MediNexus AI. All rights reserved.</p></div>
                </div>
            </body>
            </html>
        `;

        // Auto-reply to user
        const userHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f5f5f5; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin:0;">🏥 MediNexus AI</h1>
                        <p style="margin:8px 0 0;">We received your message!</p>
                    </div>
                    <div class="content">
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>Thank you for reaching out to us. We've received your message and our support team will get back to you within <strong>24 hours</strong>.</p>
                        <p>If you have an urgent medical concern, please call us directly at <strong>+91 98765 43210</strong> or use our 24/7 chat support.</p>
                        <p style="margin-top:24px;">Warm regards,<br/><strong>The MediNexus AI Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 MediNexus AI. All rights reserved.</p>
                        <p>📧 support@medinexus.ai | 📞 +91 98765 43210</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send to admin
        await emailService.sendEmail({
            from: `"MediNexus AI" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            replyTo: email,
            subject: `Contact Form: ${subject || 'New Message'} from ${name}`,
            html: adminHtml
        });

        // Send auto-reply to user
        await emailService.sendEmail({
            from: `"MediNexus AI" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: 'We received your message – MediNexus AI',
            html: userHtml
        });

        res.json({ success: true, message: 'Message sent successfully! We\'ll get back to you within 24 hours.' });

    } catch (error) {
        console.error('Contact form error:', error.message);
        res.json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
};

export { sendContactMessage };
