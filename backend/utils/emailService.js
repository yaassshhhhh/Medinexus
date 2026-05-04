import nodemailer from 'nodemailer';
import dns from 'dns';

// Centralized email service for all email operations
class EmailService {
    constructor() {
        this.transporter = null;
    }

    // Create and return transporter
    getTransporter() {
        if (!this.transporter) {
            try {
                if (process.env.ADMIN_EMAIL === 'your_email@gmail.com' || !process.env.ADMIN_EMAIL) {
                    console.log('⚠️  Using mock email transporter (No valid credentials provided in .env)');
                    this.transporter = {
                        sendMail: async (mailOptions) => {
                            console.log('\n=============================================');
                            console.log('📧 MOCK EMAIL SENT (Development Mode)');
                            console.log(`To: ${mailOptions.to}`);
                            console.log(`Subject: ${mailOptions.subject}`);
                            
                            // Try to extract OTP from HTML if present
                            const otpMatch = mailOptions.html && mailOptions.html.match(/<div class="otp-box">(\d+)<\/div>/);
                            if (otpMatch) {
                                console.log(`🔑 EXTRACTED OTP: ${otpMatch[1]}`);
                            }
                            console.log('=============================================\n');
                            return { messageId: 'mock-id-' + Date.now() };
                        }
                    };
                } else {
                    this.transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: process.env.ADMIN_EMAIL,
                            pass: process.env.ADMIN_PASSWORD
                        },
                        tls: { rejectUnauthorized: false },
                        dnsTimeout: 10000,
                        socketTimeout: 30000,
                        greetingTimeout: 30000,
                        lookup: (hostname, options, callback) => {
                            dns.lookup(hostname, { family: 4, ...options }, callback);
                        }
                    });
                }
                console.log('✅ Email transporter created successfully');
            } catch (error) {
                console.error('❌ Failed to create email transporter:', error);
                throw error;
            }
        }
        return this.transporter;
    }

    // Send email with retry logic
    async sendEmail(mailOptions, retries = 3) {
        const transporter = this.getTransporter();

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`📤 Sending email (Attempt ${attempt}/${retries})...`);
                console.log(`📧 To: ${mailOptions.to}`);
                console.log(`📝 Subject: ${mailOptions.subject}`);

                const info = await transporter.sendMail(mailOptions);

                console.log('✅ Email sent successfully!');
                console.log(`📧 Message ID: ${info.messageId}`);

                return { success: true, messageId: info.messageId };
            } catch (error) {
                console.error(`❌ Email send failed (Attempt ${attempt}/${retries}):`, error.message);
                console.error(`Error code: ${error.code}`);

                if (attempt === retries) {
                    // Last attempt failed
                    let errorMessage = 'Failed to send email. ';

                    if (error.code === 'EAUTH') {
                        errorMessage += 'Email authentication failed. Please contact support.';
                        console.error('⚠️  Check ADMIN_EMAIL and ADMIN_PASSWORD in environment variables');
                    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
                        errorMessage += 'Connection error. Please try again.';
                        console.error('⚠️  Check internet connection and SMTP settings');
                    } else {
                        errorMessage += 'Please try again later.';
                    }

                    return { success: false, error: errorMessage, code: error.code };
                }

                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    // Send OTP email
    async sendOTP(email, otp, type = 'booking') {
        let subject, html;

        if (type === 'booking') {
            subject = 'MediNexus Ai - Appointment Booking OTP';
            html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
                        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                        .content { padding: 40px 30px; text-align: center; }
                        .otp-box { background: #f0f0f0; padding: 20px; margin: 30px 0; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
                        .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">🏥 MediNexus Ai</h1>
                            <p style="margin: 10px 0 0 0;">Appointment Booking Verification</p>
                        </div>
                        <div class="content">
                            <h2 style="color: #333; margin-bottom: 20px;">Your OTP Code</h2>
                            <p>Use this code to confirm your appointment booking:</p>
                            <div class="otp-box">${otp}</div>
                            <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes.</p>
                            <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 MediNexus Ai. All rights reserved.</p>
                            <p>📧 support@medinexus.ai | 📞 +91-11-4567-8900</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
        } else if (type === 'password-reset') {
            subject = 'MediNexus Ai - Password Reset OTP';
            html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
                        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                        .content { padding: 40px 30px; text-align: center; }
                        .otp-box { background: #f0f0f0; padding: 20px; margin: 30px 0; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
                        .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #888; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">🔐 MediNexus Ai</h1>
                            <p style="margin: 10px 0 0 0;">Password Reset Request</p>
                        </div>
                        <div class="content">
                            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
                            <p>You requested to reset your password. Use the OTP below:</p>
                            <div class="otp-box">${otp}</div>
                            <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes.</p>
                            <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 MediNexus Ai. All rights reserved.</p>
                            <p>📧 support@medinexus.ai | 📞 +91-11-4567-8900</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
        }

        const mailOptions = {
            from: `"MediNexus Ai" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: subject,
            html: html
        };

        return await this.sendEmail(mailOptions);
    }

    // Send newsletter email
    async sendNewsletter(email, healthTips) {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .tip-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .tip-title { color: #667eea; font-weight: bold; font-size: 18px; margin-bottom: 10px; }
                    .tip-text { color: #555; font-size: 14px; }
                    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">🏥 MediNexus Ai</div>
                        <h2>Welcome to Your Health Journey!</h2>
                        <p>Thank you for subscribing to our health tips newsletter</p>
                    </div>
                    <div class="content">
                        <p>Hello!</p>
                        <p>We're excited to have you on board. Here are some valuable health tips to get you started:</p>
                        
                        ${healthTips.map(tip => `
                            <div class="tip-card">
                                <div class="tip-title">💡 ${tip.title}</div>
                                <div class="tip-text">${tip.tip}</div>
                            </div>
                        `).join('')}
                        
                        <p style="margin-top: 30px;">Stay tuned for more health tips, wellness advice, and updates from MediNexus Ai!</p>
                        <p>To your health,<br><strong>The MediNexus Ai Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>© 2025 MediNexus Ai. All rights reserved.</p>
                        <p>📧 support@medinexus.ai | 📞 +91-11-4567-8900</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `"MediNexus Ai" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: '🏥 Welcome to MediNexus Ai - Your Health Tips Inside!',
            html: html
        };

        return await this.sendEmail(mailOptions);
    }
}

// Export singleton instance
const emailService = new EmailService();
export default emailService;
