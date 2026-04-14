import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { MessageCircle, X, Send, Loader2, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

// ── Typing indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
    <div className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            M
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
            <div className="flex gap-1 items-center">
                {[0, 150, 300].map(delay => (
                    <span key={delay} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }} />
                ))}
            </div>
        </div>
    </div>
);

// ── Doctor card ───────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor }) => (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-3 min-w-[220px] max-w-[240px] flex-shrink-0">
        <div className="flex justify-between items-start gap-1 mb-1">
            <p className="font-semibold text-gray-800 text-xs leading-tight">{doctor.name}</p>
            {doctor.distance && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 flex-shrink-0">
                    {doctor.distance}
                </span>
            )}
        </div>
        <p className="text-[11px] text-gray-500 mb-1 line-clamp-2">{doctor.address}</p>
        {doctor.specialty && (
            <p className="text-[11px] text-indigo-500 font-medium mb-1 capitalize">{doctor.specialty}</p>
        )}
        {doctor.phone && (
            <p className="text-[11px] text-gray-500 mb-1.5">📞 {doctor.phone}</p>
        )}
        <a href={doctor.mapsUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold py-1.5 rounded-lg transition-colors mt-1">
            <MapPin size={11} /> View on Map <ExternalLink size={10} />
        </a>
    </div>
);

// ── Doctor skeleton ───────────────────────────────────────────────────────────
const DoctorSkeleton = () => (
    <div className="flex gap-2 overflow-x-auto pb-1 mt-2">
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-3 min-w-[220px] animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-2.5 bg-gray-100 rounded w-full mb-1" />
                <div className="h-2.5 bg-gray-100 rounded w-2/3 mb-3" />
                <div className="h-6 bg-gray-200 rounded-lg w-full" />
            </div>
        ))}
    </div>
);

// ── Quick replies ─────────────────────────────────────────────────────────────
const QuickReplies = ({ replies, onSelect, disabled }) => {
    if (!replies?.length) return null;
    return (
        <div className="flex flex-wrap gap-1.5 mt-2 px-1">
            {replies.map((r, i) => (
                <button key={i} onClick={() => !disabled && onSelect(r)} disabled={disabled}
                    className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors font-medium disabled:opacity-50">
                    {r}
                </button>
            ))}
        </div>
    );
};

// ── Message bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, doctors }) => {
    const isUser = msg.role === 'user';
    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {!isUser && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1">
                    M
                </div>
            )}
            <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isUser
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                }`}>
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                        <div className="prose prose-sm prose-indigo max-w-none
                            [&_p]:mb-1.5 [&_p:last-child]:mb-0
                            [&_ul]:pl-4 [&_ul]:mb-1.5 [&_li]:mb-0.5
                            [&_ol]:pl-4 [&_ol]:mb-1.5
                            [&_strong]:font-semibold [&_strong]:text-indigo-900
                            [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-indigo-700 [&_h3]:mb-1">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* Doctor cards */}
                {msg.showDoctors && doctors?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 mt-2 max-w-[320px]">
                        {doctors.map((doc, i) => <DoctorCard key={i} doctor={doc} />)}
                    </div>
                )}

                {/* Doctor loading skeleton */}
                {msg.loadingDoctors && <DoctorSkeleton />}

                <span className="text-[10px] text-gray-400 mt-0.5 px-1">{time}</span>
            </div>
        </div>
    );
};

// ── Main Chatbot component ────────────────────────────────────────────────────
const INITIAL_MSG = {
    id: 1,
    role: 'bot',
    content: 'Namaste! 🏥 I\'m **MediNexus AI**.\n\nDescribe your symptoms in **Hindi, English, or Marathi** — I\'ll help you!',
    quickReplies: ['Fever / बुखार', 'Headache / सिरदर्द', 'Stomach Pain / पेट दर्द', 'Book Appointment'],
    timestamp: new Date()
};

const Chatbot = () => {
    const { backendUrl } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([INITIAL_MSG]);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // Load conversation history from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem('medinexus_chat_history');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                if (parsed.length > 1) { // More than just initial message
                    setMessages(parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
                }
            } catch (e) {
                console.error('Failed to load chat history:', e);
            }
        }
    }, []);

    // Save conversation history to localStorage
    useEffect(() => {
        if (messages.length > 1) { // Don't save if only initial message
            localStorage.setItem('medinexus_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, isOpen]);

    const addMessage = (role, content, extras = {}) => {
        const msg = { id: Date.now() + Math.random(), role, content, timestamp: new Date(), ...extras };
        setMessages(prev => [...prev, msg]);
        return msg;
    };

    const fetchNearbyDoctors = useCallback(async (specialty, city) => {
        // Add a skeleton placeholder message
        const skeletonId = Date.now();
        setMessages(prev => [...prev, {
            id: skeletonId, role: 'bot',
            content: `Finding **${specialty}** doctors in ${city}... 🔍`,
            loadingDoctors: true, timestamp: new Date()
        }]);

        try {
            const { data } = await axios.post(`${backendUrl}/api/maps/nearby-doctors`, { specialty, city });
            // Remove skeleton, add real result
            setMessages(prev => prev.filter(m => m.id !== skeletonId));
            if (data.success && data.doctors?.length > 0) {
                setDoctors(data.doctors);
                addMessage('bot', `Found **${data.doctors.length}** doctors near ${city} 📍`, { showDoctors: true });
            } else if (data.fallbackUrl) {
                addMessage('bot', `No doctors found in our database for ${city}, but you can [search on OpenStreetMap](${data.fallbackUrl}) 🗺️`);
            } else {
                addMessage('bot', `Sorry, no doctors found in ${city}. Try another city name. 🙏`);
            }
        } catch {
            setMessages(prev => prev.filter(m => m.id !== skeletonId));
            addMessage('bot', 'Could not fetch nearby doctors. Please try again. 🙏');
        }
    }, [backendUrl]);

    const sendMessage = useCallback(async (text) => {
        const userText = text || input;
        if (!userText.trim() || loading) return;

        setInput('');
        addMessage('user', userText);
        setLoading(true);

        // Build conversation history (skip initial greeting)
        const history = messages
            .filter(m => m.id !== 1)
            .map(m => ({ role: m.role, content: m.content }));
        history.push({ role: 'user', content: userText });

        try {
            const { data } = await axios.post(`${backendUrl}/api/chatbot/analyze`, { messages: history });

            if (data.success) {
                addMessage('bot', data.reply, { quickReplies: data.quickReplies || [] });
                if (data.doctorSearch) {
                    setTimeout(() => fetchNearbyDoctors(data.doctorSearch.specialty, data.doctorSearch.city), 400);
                }
            } else {
                addMessage('bot', data.message || 'Kuch galat ho gaya. Please try again. 🙏');
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.message || 'Network error';
            addMessage('bot', `Sorry, I encountered an error: ${errorMsg}. Please try again. 🙏`);
            toast.error('Failed to reach AI service. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [input, messages, loading, backendUrl, fetchNearbyDoctors]);

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    // Last bot message quick replies
    const lastBot = [...messages].reverse().find(m => m.role === 'bot');
    const quickReplies = !loading && lastBot?.quickReplies?.length ? lastBot.quickReplies : [];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 20 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl w-[92vw] sm:w-[420px] mb-4 overflow-hidden border border-white/20 flex flex-col h-[560px] sm:h-[620px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 flex justify-between items-center text-white shadow-md relative overflow-hidden flex-shrink-0">
                            <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Sparkles size={18} className="text-yellow-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base leading-tight">MediNexus AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <p className="text-[11px] text-indigo-100">Hindi • English • Marathi</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 relative z-10">
                                <button
                                    onClick={() => {
                                        if (window.confirm('Clear chat history?')) {
                                            setMessages([INITIAL_MSG]);
                                            setDoctors([]);
                                            localStorage.removeItem('medinexus_chat_history');
                                        }
                                    }}
                                    className="hover:bg-white/20 p-1.5 rounded-full transition-colors text-xs"
                                    title="Clear history"
                                >
                                    🗑️
                                </button>
                                <button onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Chat area */}
                        <div className="flex-1 overflow-y-auto bg-slate-50 px-3 pt-4 pb-2 space-y-3
                            [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded">
                            {messages.map(msg => (
                                <MessageBubble key={msg.id} msg={msg} doctors={msg.showDoctors ? doctors : []} />
                            ))}
                            {loading && <TypingIndicator />}
                            <div ref={bottomRef} />
                        </div>

                        {/* Quick replies */}
                        {quickReplies.length > 0 && (
                            <div className="bg-slate-50 px-3 pt-1 pb-0.5 border-t border-slate-100 flex-shrink-0">
                                <QuickReplies replies={quickReplies} onSelect={sendMessage} disabled={loading} />
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="px-4 py-1 bg-indigo-50/60 border-t border-indigo-100 text-center flex-shrink-0">
                            <p className="text-[10px] text-indigo-400 font-medium">⚠️ AI suggestions only — always consult a real doctor.</p>
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-slate-100 flex-shrink-0">
                            <div className="flex gap-2 items-end">
                                <textarea
                                    ref={inputRef}
                                    rows={1}
                                    value={input}
                                    onChange={e => {
                                        setInput(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                                    }}
                                    onKeyDown={handleKey}
                                    placeholder="Type symptoms... / लक्षण लिखें..."
                                    disabled={loading}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 max-h-24 shadow-inner placeholder-slate-400 transition-all"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => sendMessage()}
                                    disabled={loading || !input.trim()}
                                    className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-colors flex-shrink-0"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -180 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="group relative flex items-center justify-center rounded-full shadow-2xl"
                    >
                        <span className="absolute inset-0 rounded-full bg-indigo-600 opacity-75 animate-ping" />
                        <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-4 rounded-full relative overflow-hidden ring-4 ring-white">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                            <MessageCircle size={30} className="relative z-10" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
