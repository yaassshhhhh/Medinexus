import nodemailer from 'nodemailer';

// Create transporter for sending emails with better configuration
const transporter = nodemailer.createTransport(
    process.env.SENDGRID_API_KEY ? {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
        }
    } : {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASSWORD
        },
        tls: {
            rejectUnauthorized: false // Allow self-signed certificates
        }
    }
);

// Health tips array
const healthTips = [
    {
        title: "Stay Hydrated",
        tip: "Drink at least 8 glasses of water daily to keep your body hydrated and maintain optimal health."
    },
    {
        title: "Regular Exercise",
        tip: "Aim for 30 minutes of moderate exercise daily to boost your immune system and improve overall health."
    },
    {
        title: "Balanced Diet",
        tip: "Include fruits, vegetables, whole grains, and lean proteins in your diet for essential nutrients."
    },
    {
        title: "Quality Sleep",
        tip: "Get 7-8 hours of quality sleep each night to help your body recover and maintain mental clarity."
    },
    {
        title: "Stress Management",
        tip: "Practice meditation, yoga, or deep breathing exercises to reduce stress and improve mental health."
    },
    {
        title: "Regular Check-ups",
        tip: "Schedule regular health check-ups to catch potential health issues early and maintain preventive care."
    },
    {
        title: "Hand Hygiene",
        tip: "Wash your hands frequently with soap and water for at least 20 seconds to prevent infections."
    },
    {
        title: "Limit Screen Time",
        tip: "Take regular breaks from screens to reduce eye strain and improve posture. Follow the 20-20-20 rule."
    }
];

// Subscribe to newsletter
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({ success: false, message: 'Invalid email format' });
        }

        // Get random health tips (3 tips)
        const randomTips = [];
        const usedIndices = new Set();

        while (randomTips.length < 3) {
            const randomIndex = Math.floor(Math.random() * healthTips.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                randomTips.push(healthTips[randomIndex]);
            }
        }

        // Create email HTML content
        const emailHTML = `
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
            <div class="logo">🏥 Rogveda</div>
            <h2>Welcome to Your Health Journey!</h2>
            <p>Thank you for subscribing to our health tips newsletter</p>
          </div>
          <div class="content">
            <p>Hello!</p>
            <p>We're excited to have you on board. Here are some valuable health tips to get you started:</p>
            
            ${randomTips.map(tip => `
              <div class="tip-card">
                <div class="tip-title">💡 ${tip.title}</div>
                <div class="tip-text">${tip.tip}</div>
              </div>
            `).join('')}
            
            <p style="margin-top: 30px;">Stay tuned for more health tips, wellness advice, and updates from Rogveda!</p>
            <p>To your health,<br><strong>The Rogveda Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Rogveda. All rights reserved.</p>
            <p>📧 support@rogveda.com | 📞 +91-11-4567-8900</p>
          </div>
        </div>
      </body>
      </html>
    `;

        // Send email
        const mailOptions = {
            from: `"Rogveda" <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: '🏥 Welcome to Rogveda - Your Health Tips Inside!',
            html: emailHTML
        };

        await transporter.sendMail(mailOptions);

        console.log('✅ Newsletter email sent successfully to:', email);

        res.json({
            success: true,
            message: 'Successfully subscribed! Check your email for health tips.'
        });

    } catch (error) {
        console.error('❌ Newsletter subscription error:', error.message);
        console.error('Error code:', error.code);

        let errorMessage = 'Failed to subscribe. ';
        if (error.code === 'EAUTH') {
            errorMessage += 'Email authentication failed.';
        } else if (error.code === 'ECONNECTION') {
            errorMessage += 'Connection error. Please try again.';
        } else {
            errorMessage += 'Please try again later.';
        }

        res.json({
            success: false,
            message: errorMessage
        });
    }
};

export { subscribeNewsletter };
