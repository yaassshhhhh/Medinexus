import sendBrevoEmail from '../utils/brevoEmail.js';

// Health tips array
const healthTips = [
    { title: "Stay Hydrated", tip: "Drink at least 8 glasses of water daily to keep your body hydrated and maintain optimal health." },
    { title: "Regular Exercise", tip: "Aim for 30 minutes of moderate exercise daily to boost your immune system and improve overall health." },
    { title: "Balanced Diet", tip: "Include fruits, vegetables, whole grains, and lean proteins in your diet for essential nutrients." },
    { title: "Quality Sleep", tip: "Get 7-8 hours of quality sleep each night to help your body recover and maintain mental clarity." },
    { title: "Stress Management", tip: "Practice meditation, yoga, or deep breathing exercises to reduce stress and improve mental health." },
    { title: "Regular Check-ups", tip: "Schedule regular health check-ups to catch potential health issues early and maintain preventive care." },
    { title: "Hand Hygiene", tip: "Wash your hands frequently with soap and water for at least 20 seconds to prevent infections." },
    { title: "Limit Screen Time", tip: "Take regular breaks from screens to reduce eye strain and improve posture. Follow the 20-20-20 rule." }
];

const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.json({ success: false, message: 'Email is required' });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.json({ success: false, message: 'Invalid email format' });

        // Pick 3 random health tips
        const shuffled = [...healthTips].sort(() => Math.random() - 0.5);
        const tips = shuffled.slice(0, 3);

        await sendBrevoEmail({
            to: email,
            subject: '🏥 Welcome to MediNexus AI — Your Health Tips Inside!',
            html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <div style="background:linear-gradient(135deg,#0d9488,#06b6d4);padding:30px;border-radius:12px 12px 0 0;text-align:center">
                    <h1 style="color:white;margin:0">🏥 MediNexus AI</h1>
                    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0">Your Personal Health Assistant</p>
                </div>
                <div style="background:#f9fafb;padding:30px;border-radius:0 0 12px 12px">
                    <p style="color:#374151">Welcome! Here are your personalized health tips:</p>
                    ${tips.map(t => `
                        <div style="background:white;border-left:4px solid #0d9488;border-radius:8px;padding:16px;margin:12px 0;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
                            <p style="color:#0d9488;font-weight:bold;margin:0 0 6px">💡 ${t.title}</p>
                            <p style="color:#6b7280;margin:0;font-size:14px">${t.tip}</p>
                        </div>`).join('')}
                    <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:24px">© 2025 MediNexus AI. All rights reserved.</p>
                </div>
            </div>`
        });

        res.json({ success: true, message: 'Successfully subscribed! Check your email for health tips.' });
    } catch (error) {
        console.error('Newsletter error:', error.message);
        res.json({ success: false, message: 'Failed to send email. Please try again.' });
    }
};

export { subscribeNewsletter };
