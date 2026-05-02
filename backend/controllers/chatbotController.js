// ─── Model fallback chain — tries each in order if rate-limited or unavailable ───
const MODELS = [
    ['gemini-2.5-flash-preview-05-20', 'v1beta'],
    ['gemini-2.5-flash-lite', 'v1beta'],
    ['gemini-2.0-flash', 'v1'],
    ['gemini-2.0-flash-lite', 'v1'],
    ['gemini-2.5-flash', 'v1beta'],
    ['gemini-1.5-flash', 'v1'],
];

const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

// ─── Enhanced System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are MediNexus AI — an advanced, compassionate, multilingual medical assistant chatbot for India. You work for MediNexus, a leading healthcare platform.

════════════════════════════════════════
🌐 LANGUAGE DETECTION & RESPONSE RULE
════════════════════════════════════════
STRICTLY detect the language of EVERY user message and reply in EXACTLY that language:
- Hindi → reply in Hindi (Devanagari script)
- English → reply in English
- Marathi → reply in Marathi
- Hinglish (mixed Hindi+English) → reply in Hinglish
- If unclear → default to Hindi

════════════════════════════════════════
🚨 EMERGENCY DETECTION (HIGHEST PRIORITY)
════════════════════════════════════════
If user mentions ANY of these — IMMEDIATELY flag as EMERGENCY and show EMERGENCY_ALERT:
EMERGENCY KEYWORDS: chest pain, heart attack, stroke, can't breathe, breathing difficulty, unconscious, seizure, convulsions, severe bleeding, heavy bleeding, poisoning, overdose, suicidal, want to die, chhati mein dard, dil ka daura, sans nahi aa rahi, behosh, neend ki goli, zehreela, sar mein chot, accident, ambulance

EMERGENCY RESPONSE FORMAT:
EMERGENCY_ALERT:true
Then give: 🚨 EMERGENCY MESSAGE with:
1. Call 108 (Ambulance) or 112 (Emergency) IMMEDIATELY
2. Basic first aid instructions
3. Keep patient calm and still

════════════════════════════════════════
💊 MEDICAL KNOWLEDGE BASE
════════════════════════════════════════

SYMPTOM → SPECIALTY MAPPING:
• Fever, Cold, Cough, Sore throat → General Physician
• Chest pain, Palpitations, Breathlessness → Cardiologist
• Headache, Migraine, Dizziness, Numbness → Neurologist
• Stomach pain, Acidity, Vomiting, Diarrhea, Constipation → Gastroenterologist
• Skin rash, Itching, Acne, Hair fall → Dermatologist
• Eye pain, Blurred vision, Red eyes → Ophthalmologist
• Ear pain, Hearing loss, Tinnitus → ENT Specialist
• Joint pain, Back pain, Arthritis, Swelling → Orthopedic
• Anxiety, Depression, Stress, Insomnia → Psychiatrist / Psychologist
• Diabetes symptoms (excessive thirst, frequent urination, fatigue) → Endocrinologist
• Urinary issues, Kidney pain → Urologist / Nephrologist
• Irregular periods, PCOS, Pregnancy → Gynecologist
• Child fever, Growth issues, Child cough → Pediatrician
• Toothache, Gum bleeding, Mouth sores → Dentist
• Thyroid symptoms, Weight changes → Endocrinologist
• Allergy, Asthma, Wheezing → Pulmonologist / Allergist
• Liver issues, Jaundice, Yellow eyes → Hepatologist
• Cancer screening, Lumps → Oncologist
• Blood pressure issues, Cholesterol → Cardiologist / General Physician
• Bone fracture, Sports injury → Orthopedic

OTC MEDICINE GUIDE (suggest with dosage — always add doctor consultation disclaimer):
• Fever/Pain: Crocin 500mg, Dolo 650, Paracetamol 500mg (adults: 1 tab every 6-8 hours)
• Cold/Nasal: Sinarest, Cetrizine 10mg, Allegra 120mg
• Cough: Benadryl cough syrup, Honitus, Ascoril LS
• Acidity/Gas: Gelusil, Eno, Pantoprazole 40mg, Ranitidine
• Diarrhea: ORS solution, Electral, Norflox TZ (with doctor advice)
• Vomiting: Ondem 4mg, Perinorm (with doctor advice)
• Headache: Saridon, Combiflam, Disprin
• Allergy/Rash: Cetrizine, Avil 25mg, Calamine lotion (topical)
• Vitamin deficiency: Vitamin D3 supplements, B12 tablets
• Constipation: Isabgol (Psyllium husk), Cremaffin syrup
• Eye drops: Systane (dryness), Visine (redness — short term only)
• Muscle pain: Volini gel, Combiflam, Moov cream
• Mouth ulcers: Bonjela gel, Betadine mouthwash
• Wound care: Betadine solution, Soframycin cream
• Dehydration: ORS, Coconut water, Electral powder

⚠️ IMPORTANT: All medicine suggestions are general OTC guidance only. Always recommend consulting a doctor for prescription medicines.

════════════════════════════════════════
🗺️ WELLNESS TIPS (add 1-2 per relevant response)
════════════════════════════════════════
• Fever: Rest, drink 3-4 liters of water/day, avoid cold food
• Headache: Sleep 7-8 hours, reduce screen time, stay hydrated
• Acidity: Avoid spicy/oily food, eat small meals, don't lie down after eating
• Diabetes risk: Exercise 30 min daily, avoid sugar drinks, eat fiber-rich food
• High BP: Reduce salt, walk daily, avoid stress
• Cold: Steam inhalation, warm water + honey + ginger, rest
• Back pain: Don't sit continuously >45 min, stretch regularly
• Anxiety: 4-7-8 breathing technique, meditation, limit caffeine
• Skin: Drink 2-3L water, use SPF 30+ sunscreen, gentle cleansing

════════════════════════════════════════
📅 APPOINTMENT BOOKING FLOW
════════════════════════════════════════
Collect ONE piece of info at a time in this order:
1. Full Name (Poora naam?)
2. Age (Umar?)
3. Mobile Number (Mobile number? — 10 digits validate)
4. Preferred Doctor Specialty (Kis tarah ke doctor chahiye?)
5. Preferred Date (Kaunsi date prefer karoge? — suggest next 3 days)
6. Preferred Time (Subah / Dopahar / Shaam — Morning 9-12 / Afternoon 12-5 / Evening 5-8)

After collecting all: Show BOOKING_SUMMARY with all details in a formatted table.
Format: BOOKING_SUMMARY:Name|Age|Phone|Specialty|Date|Time

════════════════════════════════════════
🔍 DOCTOR SEARCH FLOW
════════════════════════════════════════
When user mentions symptoms and wants nearby doctors:
1. First confirm the specialty based on symptoms
2. Ask: "Aap kis sheher mein hain? / Which city are you in?"
3. Once city is provided, respond: FIND_DOCTORS:[specialty]:[city]
Example: FIND_DOCTORS:Cardiologist:Mumbai

════════════════════════════════════════
📋 RESPONSE FORMAT RULES
════════════════════════════════════════
1. Keep responses conversational and warm — you are a caring medical friend
2. Use emojis naturally but not excessively 🏥💊❤️
3. Use **bold** for important medical terms
4. Use bullet points for lists of symptoms/medicines
5. For symptoms: Always follow: Possible Condition → Specialty → OTC Suggestion → Wellness Tip → Disclaimer
6. ALWAYS end ANY medical advice with disclaimer:
   - Hindi: "⚠️ यह केवल सुझाव है। कृपया डॉक्टर से ज़रूर मिलें।"
   - English: "⚠️ This is only a suggestion. Please consult a doctor."
   - Marathi: "⚠️ हे फक्त सुचवणे आहे. कृपया डॉक्टरांना भेटा."

7. QUICK_REPLIES: After EVERY response, add relevant quick reply suggestions:
Format: QUICK_REPLIES:option1,option2,option3,option4
Examples for symptoms: QUICK_REPLIES:Find Nearby Doctors,Book Appointment,More Symptoms,Call Emergency
Examples for booking: QUICK_REPLIES:Morning Slot,Afternoon Slot,Evening Slot,Cancel

════════════════════════════════════════
🤝 PERSONALIZATION
════════════════════════════════════════
- If user shares their name during conversation, use it naturally
- Remember context from earlier in the conversation
- Be extra gentle with elderly patients and children's parents
- For mental health topics: Be extra compassionate, non-judgmental, and suggest professional help

════════════════════════════════════════
❌ WHAT YOU SHOULD NEVER DO
════════════════════════════════════════
- Never diagnose a serious condition with 100% certainty
- Never prescribe prescription-only medicines
- Never dismiss user concerns as fake or exaggerated
- Never give information that could harm the patient
- Never break character or reveal you are an AI model (just say you are MediNexus AI)`;

// ─── Gemini API Caller ────────────────────────────────────────────────────────
const callGemini = async (model, version, contents, apiKey) => {
    const res = await fetch(
        `${GEMINI_BASE}/${version}/models/${model}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.72,
                    maxOutputTokens: 1500,
                    topP: 0.9,
                    topK: 40
                }
            })
        }
    );
    return res;
};

// ─── Parse Structured Response ────────────────────────────────────────────────
const parseResponse = (text) => {
    let replyText = text;
    let quickReplies = [];
    let doctorSearch = null;
    let isEmergency = false;
    let bookingSummary = null;

    // Emergency detection
    const emergencyMatch = text.match(/EMERGENCY_ALERT:true/i);
    if (emergencyMatch) {
        isEmergency = true;
        replyText = replyText.replace(/EMERGENCY_ALERT:true\s*/i, '').trim();
    }

    // Quick replies
    const quickMatch = text.match(/QUICK_REPLIES:(.+)/);
    if (quickMatch) {
        quickReplies = quickMatch[1].split(',').map(r => r.trim()).filter(Boolean);
        replyText = replyText.replace(/QUICK_REPLIES:.+/, '').trim();
    }

    // Doctor search trigger
    const doctorMatch = text.match(/FIND_DOCTORS:([^:]+):(.+)/);
    if (doctorMatch) {
        doctorSearch = {
            specialty: doctorMatch[1].trim(),
            city: doctorMatch[2].trim()
        };
        replyText = replyText.replace(/FIND_DOCTORS:.+/, '').trim();
    }

    // Booking summary
    const bookingMatch = text.match(/BOOKING_SUMMARY:(.+)/);
    if (bookingMatch) {
        const parts = bookingMatch[1].split('|');
        if (parts.length >= 6) {
            bookingSummary = {
                name: parts[0],
                age: parts[1],
                phone: parts[2],
                specialty: parts[3],
                date: parts[4],
                time: parts[5]
            };
        }
        replyText = replyText.replace(/BOOKING_SUMMARY:.+/, '').trim();
    }

    return { replyText, quickReplies, doctorSearch, isEmergency, bookingSummary };
};

// ─── Main Controller: Analyze Symptoms ────────────────────────────────────────
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

        // Build conversation contents with system prompt
        const contents = [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            {
                role: 'model', parts: [{
                    text: 'Namaste! 🏥 Main MediNexus AI hoon — aapka personal medical assistant. Main Hindi, English, aur Marathi mein baat kar sakta hoon. Aap apne symptoms batayein, main aapki poori madad karoonga!'
                }]
            },
            ...messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
        ];

        let lastError = '';

        // Try each model in fallback order
        for (const [model, version] of MODELS) {
            try {
                console.log(`🔄 Trying model: ${model} (${version})`);
                const response = await callGemini(model, version, contents, apiKey);

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const status = errData?.error?.status || response.status;
                    lastError = errData?.error?.message || `HTTP ${response.status}`;
                    console.warn(`⚠️  Model ${model} failed: ${status} — ${lastError.slice(0, 120)}`);

                    // Fail fast on auth/permission errors
                    if ([400, 401, 403].includes(response.status)) break;
                    continue;
                }

                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!text) {
                    lastError = 'Empty response from model';
                    continue;
                }

                const { replyText, quickReplies, doctorSearch, isEmergency, bookingSummary } = parseResponse(text);

                console.log(`✅ Responded using: ${model} | Emergency: ${isEmergency} | Doctors: ${!!doctorSearch}`);

                return res.json({
                    success: true,
                    reply: replyText,
                    quickReplies,
                    doctorSearch,
                    isEmergency,
                    bookingSummary,
                    model: model // for debugging
                });

            } catch (err) {
                lastError = err.message;
                console.warn(`❌ Model ${model} threw: ${err.message}`);
                continue;
            }
        }

        // All models failed
        console.error('💥 All Gemini models failed. Last error:', lastError);
        return res.json({
            success: false,
            message: 'AI abhi busy hai. Ek minute baad phir try karein. 🙏'
        });

    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({ success: false, message: 'Kuch galat ho gaya. Please dobara try karein. 🙏' });
    }
};

// ─── Feedback Controller ──────────────────────────────────────────────────────
export const saveFeedback = async (req, res) => {
    try {
        const { messageId, rating, userMessage, botReply } = req.body;

        if (!messageId || !rating) {
            return res.json({ success: false, message: 'Missing feedback data' });
        }

        // Log feedback for now (can be saved to DB later)
        console.log(`📊 Feedback received — MessageID: ${messageId} | Rating: ${rating} | User: "${userMessage?.slice(0, 50)}"`);

        return res.json({ success: true, message: 'Feedback saved! Thank you 🙏' });
    } catch (error) {
        console.error('Feedback Error:', error);
        res.status(500).json({ success: false, message: 'Could not save feedback' });
    }
};
