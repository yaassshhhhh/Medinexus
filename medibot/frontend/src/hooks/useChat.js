import { useState, useCallback } from 'react';
import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const INITIAL_MESSAGE = {
    id: 1,
    role: 'bot',
    content: 'Namaste! 🏥 Main MediBot hoon.\n\nMujhe apne symptoms batayein, main aapki madad karunga!\n\n*Hello! I\'m MediBot. Tell me your symptoms and I\'ll help you!*',
    quickReplies: ['Fever / बुखार', 'Headache / सिरदर्द', 'Stomach Pain / पेट दर्द', 'Book Appointment'],
    timestamp: new Date()
};

export const useChat = () => {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    // Appointment booking state
    const [bookingData, setBookingData] = useState(null);

    const addMessage = (role, content, extras = {}) => {
        const msg = {
            id: Date.now(),
            role,
            content,
            timestamp: new Date(),
            ...extras
        };
        setMessages(prev => [...prev, msg]);
        return msg;
    };

    const fetchNearbyDoctors = useCallback(async (specialty, city) => {
        setLoadingDoctors(true);
        setDoctors([]);
        try {
            const { data } = await axios.post(`${BACKEND}/api/maps/nearby-doctors`, { specialty, city });
            if (data.success && data.doctors.length > 0) {
                setDoctors(data.doctors);
                addMessage('bot', `${city} mein **${specialty}** doctors mile! 📍 Neeche dekhen:`, { showDoctors: true });
            } else {
                addMessage('bot', `Sorry, ${city} mein koi doctor nahi mila. Kisi aur city ka naam batayein. 🙏`);
            }
        } catch {
            addMessage('bot', 'Doctors fetch karne mein problem aayi. Please try again. 🙏');
        } finally {
            setLoadingDoctors(false);
        }
    }, []);

    const sendMessage = useCallback(async (userText) => {
        if (!userText.trim() || loading) return;

        addMessage('user', userText);
        setLoading(true);

        // Build history for API (exclude initial greeting, only real conversation)
        const history = messages
            .filter(m => m.id !== 1)
            .map(m => ({ role: m.role, content: m.content }));
        history.push({ role: 'user', content: userText });

        try {
            const { data } = await axios.post(`${BACKEND}/api/chat/analyze`, { messages: history });

            if (data.success) {
                addMessage('bot', data.reply, { quickReplies: data.quickReplies || [] });

                // Auto-trigger doctor search if Gemini detected it
                if (data.doctorSearch) {
                    setTimeout(() => {
                        fetchNearbyDoctors(data.doctorSearch.specialty, data.doctorSearch.city);
                    }, 500);
                }
            } else {
                addMessage('bot', data.message || 'Kuch galat ho gaya. Please try again. 🙏');
            }
        } catch {
            addMessage('bot', 'Network error. Kripya internet check karein. 🙏');
        } finally {
            setLoading(false);
        }
    }, [messages, loading, fetchNearbyDoctors]);

    const saveAppointment = useCallback((data) => {
        const appointments = JSON.parse(localStorage.getItem('medibot_appointments') || '[]');
        const newAppt = { ...data, id: Date.now(), bookedAt: new Date().toISOString() };
        appointments.push(newAppt);
        localStorage.setItem('medibot_appointments', JSON.stringify(appointments));
        setBookingData(newAppt);
        return newAppt;
    }, []);

    return {
        messages,
        loading,
        doctors,
        loadingDoctors,
        bookingData,
        sendMessage,
        fetchNearbyDoctors,
        saveAppointment
    };
};
