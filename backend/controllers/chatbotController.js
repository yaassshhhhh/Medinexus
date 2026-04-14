// Model fallback chain — tries each in order if rate-limited or unavailable
// Each entry: [modelName, apiVersion]
const MODELS = [
    ['gemini-2.5-flash-lite', 'v1beta'],
    ['gemini-2.0-flash-lite', 'v1'],
    ['gemini-2.0-flash', 'v1'],
    ['gemini-2.5-flash', 'v1beta'],
    ['gemini-flash-lite-latest', 'v1beta'],
    ['gemini-flash-latest', 'v1beta'],
];

const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

const SYSTEM_PROMPT = `You are Rogveda AI, a multilingual medical assistant chatbot for India.

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
- Keep responses concise and conversational
- Use emojis naturally 🏥💊
- For symptoms: Possible condition → Specialty needed → OTC suggestion
- ALWAYS end medical advice with disclaimer in the user's language:
  - Hindi: "⚠️ यह सिर्फ सुझाव है, कृपया डॉक्टर से ज़रूर मिलें।"
  - English: "⚠️ This is only a suggestion, please consult a doctor."
  - Marathi: "⚠️ हे फक्त सुचवणे आहे, कृपया डॉक्टरांना भेटा."

APPOINTMENT BOOKING FLOW:
When user wants to book, collect one by one: Full name → Age → Phone number → Preferred date → Preferred time. Then show confirmation summary.

QUICK REPLY SUGGESTIONS:
After your response, if relevant, add a line starting with "QUICK_REPLIES:" followed by comma-separated suggestions in the user's language.
Example: QUICK_REPLIES:Fever,Headache,Stomach Pain,Book Appointment

DOCTOR SEARCH:
When symptoms are identified and user wants nearby doctors, ask for city name and respond with exactly: FIND_DOCTORS:[specialty]:[city]
Example: FIND_DOCTORS:General Physician:Mumbai`;

const callGemini = async (model, version, contents, apiKey) => {
    const res = await fetch(
        `${GEMINI_BASE}/${version}/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        }
    );
    return res;
};

export const analyzeSymptoms = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.json({ success: false, message: 'Invalid messages format' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, message: 'Gemini API key missing.' });
        }

        const contents = [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Understood! I am Rogveda AI, ready to help in Hindi, English, or Marathi. 🏥' }] },
            ...messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
        ];

        let lastError = '';

        // Try each model in order until one succeeds
        for (const [model, version] of MODELS) {
            try {
                console.log(`Trying model: ${model} (${version})`);
                const response = await callGemini(model, version, contents, apiKey);

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const status = errData?.error?.status || response.status;
                    lastError = errData?.error?.message || `HTTP ${response.status}`;
                    console.warn(`Model ${model} failed: ${status} — ${lastError.slice(0, 100)}`);

                    // Only retry on rate limit (429) or not found (404) — fail fast on auth errors
                    if (response.status === 400 || response.status === 401 || response.status === 403) {
                        break;
                    }
                    continue;
                }

                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!text) {
                    lastError = 'Empty response from model';
                    continue;
                }

                // Parse quick replies and doctor search triggers
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

                console.log(`✅ Responded using: ${model} (${version})`);
                return res.json({ success: true, reply: replyText, quickReplies, doctorSearch });

            } catch (err) {
                lastError = err.message;
                console.warn(`Model ${model} threw: ${err.message}`);
                continue;
            }
        }

        // All models failed
        console.error('All Gemini models failed. Last error:', lastError);
        return res.json({
            success: false,
            message: 'AI is temporarily busy. Please wait a moment and try again. 🙏'
        });

    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again. 🙏' });
    }
};
