import fetch from 'node-fetch';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

const SYSTEM_PROMPT = `You are MediBot, a multilingual medical assistant chatbot for India.

LANGUAGE RULE: Detect the language of the user's message and ALWAYS reply in the EXACT same language.
- If user writes in Hindi → reply in Hindi
- If user writes in English → reply in English  
- If user writes in Marathi → reply in Marathi
- If mixed → use the dominant language

YOUR CAPABILITIES:
1. Symptom Analysis: When user describes symptoms, identify possible condition, suggest which doctor specialty to visit, and suggest basic OTC medicines (Crocin, ORS, Dolo 650, Gelusil, etc.)
2. Appointment Booking: Collect patient Name, Age, Phone number, Preferred Date & Time step by step
3. Nearby Doctors: When user asks for nearby doctors or after symptom analysis, ask for their city/location

RESPONSE FORMAT:
- Keep responses concise and conversational (like WhatsApp)
- Use emojis naturally 🏥💊
- For symptoms, structure: Possible condition → Specialty needed → OTC suggestion
- ALWAYS end medical advice with disclaimer in the user's language:
  - Hindi: "⚠️ यह सिर्फ सुझाव है, कृपया डॉक्टर से ज़रूर मिलें।"
  - English: "⚠️ This is only a suggestion, please consult a doctor."
  - Marathi: "⚠️ हे फक्त सुचवणे आहे, कृपया डॉक्टरांना भेटा."

APPOINTMENT BOOKING FLOW:
When user wants to book, collect one by one:
1. Full name
2. Age
3. Phone number
4. Preferred date
5. Preferred time
Then show a confirmation summary.

QUICK REPLY SUGGESTIONS:
After your response, if relevant, add a line starting with "QUICK_REPLIES:" followed by comma-separated suggestions in the user's language.
Example: QUICK_REPLIES:Fever,Headache,Stomach Pain,Book Appointment

DOCTOR SEARCH:
When symptoms are identified, ask if they want to find nearby doctors. If yes, ask for city name and respond with exactly: FIND_DOCTORS:[specialty]:[city]
Example: FIND_DOCTORS:General Physician:Mumbai`;

export const analyzeChat = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.json({ success: false, message: 'Invalid messages format' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: 'Gemini API key missing' });
        }

        // Build conversation history for Gemini
        const contents = [
            // Inject system prompt as first user turn (Gemini doesn't have system role)
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }]
            },
            {
                role: 'model',
                parts: [{ text: 'Understood! I am MediBot, ready to help in Hindi, English, or Marathi. How can I assist you today? 🏥' }]
            },
            // Actual conversation
            ...messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
        ];

        const response = await fetch(
            `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                })
            }
        );

        if (!response.ok) {
            const err = await response.text();
            console.error('Gemini error:', err);
            return res.json({
                success: false,
                message: 'AI service unavailable. Kripya thodi der baad try karein. 🙏'
            });
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.json({ success: false, message: 'No response from AI.' });
        }

        // Parse quick replies if present
        let replyText = text;
        let quickReplies = [];
        let doctorSearch = null;

        const quickMatch = text.match(/QUICK_REPLIES:(.+)/);
        if (quickMatch) {
            quickReplies = quickMatch[1].split(',').map(r => r.trim());
            replyText = replyText.replace(/QUICK_REPLIES:.+/, '').trim();
        }

        const doctorMatch = text.match(/FIND_DOCTORS:([^:]+):(.+)/);
        if (doctorMatch) {
            doctorSearch = { specialty: doctorMatch[1].trim(), city: doctorMatch[2].trim() };
            replyText = replyText.replace(/FIND_DOCTORS:.+/, '').trim();
        }

        return res.json({
            success: true,
            reply: replyText,
            quickReplies,
            doctorSearch
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Kuch galat ho gaya. Please try again. 🙏'
        });
    }
};
