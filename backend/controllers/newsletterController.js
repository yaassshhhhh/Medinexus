import emailService from '../utils/emailService.js';

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

        console.log('📧 Newsletter subscription request for:', email);

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

        // Send newsletter email using centralized service
        const result = await emailService.sendNewsletter(email, randomTips);

        if (result.success) {
            res.json({
                success: true,
                message: 'Successfully subscribed! Check your email for health tips.'
            });
        } else {
            res.json({
                success: false,
                message: result.error || 'Failed to send email. Please try again.'
            });
        }

    } catch (error) {
        console.error('❌ Newsletter subscription error:', error.message);
        console.error('Stack:', error.stack);

        res.json({
            success: false,
            message: 'An error occurred. Please try again later.'
        });
    }
};

export { subscribeNewsletter };
