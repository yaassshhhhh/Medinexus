import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, X, Send, Loader2, Sparkles, MapPin, ExternalLink,
  Trash2, Bot, Calendar, User, Phone, Clock, CheckCircle, ArrowRight,
  Stethoscope, Mic, MicOff, Volume2, VolumeX, ThumbsUp, ThumbsDown,
  Download, Search, Maximize2, Minimize2, AlertTriangle, Pill,
  Heart, Activity, ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';


// ── Symptom quick-chips ───────────────────────────────────────────────────────
const SYMPTOM_CHIPS = [
  { emoji: '🤒', label: 'Fever', query: 'I have fever' },
  { emoji: '🤕', label: 'Headache', query: 'I have headache' },
  { emoji: '🤢', label: 'Nausea', query: 'I feel nauseous and want to vomit' },
  { emoji: '😮‍💨', label: 'Cough', query: 'I have cough and cold' },
  { emoji: '💔', label: 'Chest Pain', query: 'I have chest pain' },
  { emoji: '🦴', label: 'Joint Pain', query: 'I have joint pain' },
  { emoji: '😰', label: 'Anxiety', query: 'I am feeling anxious and stressed' },
  { emoji: '🩸', label: 'Skin Rash', query: 'I have skin rash and itching' },
  { emoji: '👁️', label: 'Eye Pain', query: 'I have eye pain and blurred vision' },
  { emoji: '🦷', label: 'Toothache', query: 'I have severe toothache' },
];

// ── Emergency banner ──────────────────────────────────────────────────────────
const EmergencyBanner = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className='mx-1 mb-2 rounded-xl overflow-hidden border border-red-500/50'
    style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.08))' }}
  >
    <div className='flex items-center gap-2 px-3 py-2 border-b border-red-500/30'
      style={{ background: 'rgba(239,68,68,0.2)' }}>
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
        <AlertTriangle size={16} className='text-red-400' />
      </motion.div>
      <p className='text-xs font-bold text-red-300 uppercase tracking-wider'>Emergency Detected</p>
    </div>
    <div className='px-3 py-2.5 flex flex-col gap-2'>
      <p className='text-xs text-red-200'>Call emergency services immediately:</p>
      <div className='flex gap-2'>
        <a href='tel:108' className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors'>
          📞 108 — Ambulance
        </a>
        <a href='tel:112' className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white bg-red-700 hover:bg-red-600 transition-colors'>
          🚨 112 — Emergency
        </a>
      </div>
    </div>
  </motion.div>
);

// ── Typing indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className='flex items-end gap-2'>
    <div className='w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0'>
      <Bot size={14} />
    </div>
    <div className='bg-[#0d1b3e] border border-[#1e2d4a] rounded-2xl rounded-bl-none px-4 py-3'>
      <div className='flex gap-1 items-center'>
        {[0, 150, 300].map(delay => (
          <span key={delay} className='w-2 h-2 bg-teal-400 rounded-full animate-bounce'
            style={{ animationDelay: `${delay}ms` }} />
        ))}
      </div>
    </div>
  </div>
);

// ── Nearby doctor card ────────────────────────────────────────────────────────
const NearbyDoctorCard = ({ doctor }) => (
  <div className='bg-[#0d1b3e] border border-[#1e2d4a] rounded-xl p-3 min-w-[220px] max-w-[240px] flex-shrink-0 hover:border-teal-500/40 transition-colors'>
    <div className='flex justify-between items-start gap-1 mb-1'>
      <p className='font-semibold text-gray-100 text-xs leading-tight'>{doctor.name}</p>
      {doctor.distance && (
        <span className='text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 flex-shrink-0'>
          {doctor.distance}
        </span>
      )}
    </div>
    <p className='text-[11px] text-gray-400 mb-1 line-clamp-2'>{doctor.address}</p>
    {doctor.specialty && <p className='text-[11px] text-teal-400 font-medium mb-1 capitalize'>{doctor.specialty}</p>}
    {doctor.phone && <p className='text-[11px] text-gray-400 mb-1.5'>📞 {doctor.phone}</p>}
    <a href={doctor.mapsUrl} target='_blank' rel='noopener noreferrer'
      className='flex items-center justify-center gap-1 w-full bg-teal-500/10 hover:bg-teal-500 border border-teal-500/30 hover:border-teal-500 text-teal-400 hover:text-white text-[11px] font-semibold py-1.5 rounded-lg transition-all mt-1'>
      <MapPin size={11} /> View on Map <ExternalLink size={10} />
    </a>
  </div>
);

// ── Booking summary card ──────────────────────────────────────────────────────
const BookingSummaryCard = ({ summary, onConfirm, onCancel }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className='mt-2 rounded-xl border border-teal-500/30 overflow-hidden'
    style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(6,182,212,0.05))' }}>
    <div className='px-3 py-2 flex items-center gap-2 border-b border-teal-500/20' style={{ background: 'rgba(20,184,166,0.1)' }}>
      <CheckCircle size={14} className='text-teal-400' />
      <p className='text-xs font-bold text-teal-300'>Appointment Summary</p>
    </div>
    <div className='px-3 py-2.5 space-y-1.5'>
      {[
        { icon: <User size={11} />, label: 'Name', value: summary.name },
        { icon: <Calendar size={11} />, label: 'Age', value: summary.age },
        { icon: <Phone size={11} />, label: 'Phone', value: summary.phone },
        { icon: <Stethoscope size={11} />, label: 'Specialty', value: summary.specialty },
        { icon: <Calendar size={11} />, label: 'Date', value: summary.date },
        { icon: <Clock size={11} />, label: 'Time', value: summary.time },
      ].map(({ icon, label, value }) => (
        <div key={label} className='flex items-center gap-2'>
          <span className='text-teal-400 flex-shrink-0'>{icon}</span>
          <span className='text-[11px] text-gray-400 w-14 flex-shrink-0'>{label}:</span>
          <span className='text-[11px] text-gray-200 font-medium'>{value}</span>
        </div>
      ))}
    </div>
    <div className='px-3 pb-3 flex gap-2'>
      <button onClick={onConfirm}
        className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white transition-all hover:-translate-y-0.5'
        style={{ background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', boxShadow: '0 4px 12px rgba(20,184,166,0.3)' }}>
        <ArrowRight size={13} /> Book Now
      </button>
      <button onClick={onCancel}
        className='px-3 py-2 rounded-lg text-xs font-medium text-gray-400 border border-[#1e2d4a] hover:border-red-500/40 hover:text-red-400 transition-all'>
        Cancel
      </button>
    </div>
  </motion.div>
);

// ── Doctor skeleton ───────────────────────────────────────────────────────────
const DoctorSkeleton = () => (
  <div className='flex gap-2 overflow-x-auto pb-1 mt-2'>
    {[1, 2, 3].map(i => (
      <div key={i} className='bg-[#0d1b3e] border border-[#1e2d4a] rounded-xl p-3 min-w-[220px] animate-pulse'>
        <div className='h-3 bg-[#1e2d4a] rounded w-3/4 mb-2' />
        <div className='h-2.5 bg-[#1e2d4a] rounded w-full mb-1' />
        <div className='h-2.5 bg-[#1e2d4a] rounded w-2/3 mb-3' />
        <div className='h-6 bg-[#1e2d4a] rounded-lg w-full' />
      </div>
    ))}
  </div>
);

// ── Quick replies ─────────────────────────────────────────────────────────────
const QuickReplies = ({ replies, onSelect, disabled }) => {
  if (!replies?.length) return null;
  return (
    <div className='flex flex-wrap gap-1.5 mt-2 px-1'>
      {replies.map((r, i) => (
        <button key={i} onClick={() => !disabled && onSelect(r)} disabled={disabled}
          className='bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs px-3 py-1.5 rounded-full hover:bg-teal-500 hover:text-white hover:border-teal-500 transition-all font-medium disabled:opacity-40'>
          {r}
        </button>
      ))}
    </div>
  );
};

// ── Message bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ msg, nearbyDoctors, onConfirmBooking, onCancelBooking, onFeedback, onSpeak, isSpeaking }) => {
  const isUser = msg.role === 'user';
  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [feedbackGiven, setFeedbackGiven] = useState(msg.feedback || null);

  const handleFeedback = (type) => {
    setFeedbackGiven(type);
    onFeedback?.(msg.id, type);
  };

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className='w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white flex-shrink-0 mb-1'>
          <Bot size={14} />
        </div>
      )}
      <div className={`flex flex-col max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-br-none shadow-lg shadow-teal-500/20'
            : 'bg-[#0d1b3e] text-gray-200 border border-[#1e2d4a] rounded-bl-none'
        }`}>
          {isUser ? (
            <p className='whitespace-pre-wrap'>{msg.content}</p>
          ) : (
            <div className='prose prose-sm max-w-none
              [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_p]:text-gray-200
              [&_ul]:pl-4 [&_ul]:mb-1.5 [&_li]:mb-0.5 [&_li]:text-gray-300
              [&_ol]:pl-4 [&_ol]:mb-1.5
              [&_strong]:font-semibold [&_strong]:text-teal-300
              [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-teal-400 [&_h3]:mb-1
              [&_a]:text-teal-400 [&_a]:underline [&_a]:underline-offset-2'>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Nearby doctor cards */}
        {msg.showDoctors && nearbyDoctors?.length > 0 && (
          <div className='flex gap-2 overflow-x-auto pb-1 mt-2 max-w-[320px] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-[#1e2d4a] [&::-webkit-scrollbar-thumb]:rounded'>
            {nearbyDoctors.map((doc, i) => <NearbyDoctorCard key={i} doctor={doc} />)}
          </div>
        )}

        {msg.loadingDoctors && <DoctorSkeleton />}

        {/* Booking summary */}
        {msg.bookingSummary && (
          <BookingSummaryCard
            summary={msg.bookingSummary}
            onConfirm={() => onConfirmBooking(msg.bookingSummary)}
            onCancel={onCancelBooking}
          />
        )}

        {/* Bot message actions */}
        {!isUser && msg.id !== 1 && (
          <div className='flex items-center gap-1 mt-1 px-1'>
            <span className='text-[10px] text-gray-500'>{time}</span>
            <span className='text-gray-600 mx-0.5'>·</span>
            {/* TTS */}
            <button onClick={() => onSpeak(msg.content)}
              className={`p-1 rounded transition-colors ${isSpeaking ? 'text-teal-400' : 'text-gray-600 hover:text-teal-400'}`}
              title='Read aloud'>
              {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
            </button>
            {/* Feedback */}
            {feedbackGiven === null ? (
              <>
                <button onClick={() => handleFeedback('up')}
                  className='p-1 rounded text-gray-600 hover:text-green-400 transition-colors' title='Helpful'>
                  <ThumbsUp size={11} />
                </button>
                <button onClick={() => handleFeedback('down')}
                  className='p-1 rounded text-gray-600 hover:text-red-400 transition-colors' title='Not helpful'>
                  <ThumbsDown size={11} />
                </button>
              </>
            ) : (
              <span className={`text-[10px] font-medium ${feedbackGiven === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {feedbackGiven === 'up' ? '👍 Thanks!' : '👎 Noted'}
              </span>
            )}
          </div>
        )}

        {isUser && (
          <span className='text-[10px] text-gray-500 mt-0.5 px-1'>{time}</span>
        )}
      </div>
    </div>
  );
};


// ── Initial message ───────────────────────────────────────────────────────────
const INITIAL_MSG = {
  id: 1,
  role: 'bot',
  content: 'Namaste! 🏥 I\'m **MediNexus AI** — your personal health assistant.\n\nI can help you with:\n- 🩺 **Symptom analysis**\n- 💊 **Medicine guidance**\n- 📅 **Book appointments**\n- 🗺️ **Find nearby doctors**\n\nDescribe your symptoms in **Hindi, English, or Marathi**!',
  quickReplies: ['Fever / बुखार', 'Headache / सिरदर्द', 'Book Appointment', 'Find Nearby Doctors'],
  timestamp: new Date()
};

// ── Main Chatbot ──────────────────────────────────────────────────────────────
const Chatbot = () => {
  const { backendUrl, token, doctors: allDoctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [isOpen, setIsOpen]           = useState(false);
  const [isExpanded, setIsExpanded]   = useState(false);
  const [input, setInput]             = useState('');
  const [messages, setMessages]       = useState([INITIAL_MSG]);
  const [loading, setLoading]         = useState(false);
  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [showSymptoms, setShowSymptoms]   = useState(false);
  const [searchMode, setSearchMode]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [isListening, setIsListening]     = useState(false);
  const [speakingId, setSpeakingId]       = useState(null);
  const [hasEmergency, setHasEmergency]   = useState(false);
  const [ttsEnabled, setTtsEnabled]       = useState(true);

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const searchRef   = useRef(null);
  const recognitionRef = useRef(null);

  // ── Load / save history ──────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('medinexus_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 1) setMessages(parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) localStorage.setItem('medinexus_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    if (searchMode) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchMode]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const addMessage = (role, content, extras = {}) => {
    const msg = { id: Date.now() + Math.random(), role, content, timestamp: new Date(), ...extras };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  // ── Text-to-speech ───────────────────────────────────────────────────────
  const speak = useCallback((text, msgId) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();

    // Strip markdown and emojis for clean speech
    const clean = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
      .replace(/[⚠️✅🔐📍🗺️🚨👍👎🏥💊❤️📅🔒🩺😊]/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ', ')
      .trim();

    // ── Detect if text is primarily Hindi (Devanagari) ──────────────────
    const devanagariChars = (clean.match(/[\u0900-\u097F]/g) || []).length;
    const totalChars = clean.replace(/\s/g, '').length || 1;
    const isHindi = devanagariChars / totalChars > 0.25; // >25% Devanagari = Hindi

    const utt = new SpeechSynthesisUtterance(clean);

    const applyVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      let chosen = null;

      if (isHindi) {
        // ── Hindi voice priority ──────────────────────────────────────
        const HINDI_VOICES = [
          'Lekha',            // macOS hi-IN — best Hindi voice on Mac
          'Google हिन्दी',    // Chrome Hindi
          'Google Hindi',
          'Microsoft Swara Online (Natural) - Hindi (India)',
          'Microsoft Hemant - Hindi (India)',
          'Microsoft Kalpana - Hindi (India)',
        ];
        for (const name of HINDI_VOICES) {
          chosen = voices.find(v => v.name === name);
          if (chosen) break;
        }
        // Fallback: any hi-IN local voice
        if (!chosen) chosen = voices.find(v => v.lang === 'hi-IN' && v.localService);
        if (!chosen) chosen = voices.find(v => v.lang === 'hi-IN');
        if (!chosen) chosen = voices.find(v => v.lang.startsWith('hi'));

        utt.rate  = 1.1;    // Hindi TTS sounds better slightly slower
        utt.pitch = 1.05;
      } else {
        // ── English / Hinglish voice priority (Siri-like) ────────────
        const ENGLISH_VOICES = [
          'Samantha',                              // macOS — closest to Siri
          'Karen',                                 // macOS Australian
          'Moira',                                 // macOS Irish
          'Tessa',                                 // macOS South African
          'Aarav',                                 // macOS en-IN
          'Rishi',                                 // macOS en-IN
          'Google UK English Female',
          'Google US English',
          'Microsoft Aria Online (Natural)',
          'Microsoft Jenny Online (Natural)',
        ];
        for (const name of ENGLISH_VOICES) {
          chosen = voices.find(v => v.name === name);
          if (chosen) break;
        }
        if (!chosen) chosen = voices.find(v => v.lang === 'en-IN' && v.localService);
        if (!chosen) chosen = voices.find(v => v.lang === 'en-IN');
        if (!chosen) chosen = voices.find(v => v.lang.startsWith('en') && v.localService);
        if (!chosen) chosen = voices.find(v => v.lang.startsWith('en'));

        utt.rate  = 1.18;   // Siri-like — smooth, not rushed
        utt.pitch = 1.08;
      }

      if (chosen) utt.voice = chosen;
      utt.lang   = chosen?.lang || (isHindi ? 'hi-IN' : 'en-IN');
      utt.volume = 1;

      utt.onend   = () => setSpeakingId(null);
      utt.onerror = () => setSpeakingId(null);
      setSpeakingId(msgId);
      window.speechSynthesis.speak(utt);
    };

    // Chrome loads voices async — wait if list is empty
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      applyVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        applyVoiceAndSpeak();
      };
    }
  }, [ttsEnabled, speakingId]);

  // ── Voice input ──────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error('Voice input not supported in this browser'); return; }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = () => { setIsListening(false); toast.error('Voice recognition failed'); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }, [isListening]);

  // ── Export chat ──────────────────────────────────────────────────────────
  const exportChat = useCallback(() => {
    const lines = messages.map(m => {
      const time = new Date(m.timestamp).toLocaleTimeString();
      const role = m.role === 'user' ? 'You' : 'MediNexus AI';
      return `[${time}] ${role}:\n${m.content}\n`;
    });
    const blob = new Blob([lines.join('\n---\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medinexus-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported!');
  }, [messages]);

  // ── Feedback ─────────────────────────────────────────────────────────────
  const handleFeedback = useCallback(async (msgId, type) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedback: type } : m));
    try {
      await axios.post(`${backendUrl}/api/chatbot/feedback`, {
        messageId: msgId, rating: type === 'up' ? 5 : 1,
      });
    } catch { /* silent */ }
  }, [backendUrl]);

  // ── Booking confirm ──────────────────────────────────────────────────────
  const handleConfirmBooking = useCallback((summary) => {
    if (!token) {
      addMessage('bot', '🔐 Please **login first** to book an appointment. Redirecting...', { quickReplies: [] });
      setTimeout(() => { setIsOpen(false); navigate('/login'); }, 1500);
      return;
    }
    const specialty = summary.specialty?.trim() || '';
    const matched = allDoctors.find(d =>
      d.speciality?.toLowerCase().includes(specialty.toLowerCase()) ||
      specialty.toLowerCase().includes(d.speciality?.toLowerCase())
    )?.speciality;

    addMessage('bot', `✅ Taking you to **${matched || specialty}** doctors. Pick your slot!`, { quickReplies: [] });
    setTimeout(() => {
      setIsOpen(false);
      navigate(matched ? `/doctors/${encodeURIComponent(matched)}` : '/doctors');
      window.scrollTo(0, 0);
    }, 1200);
  }, [token, navigate, allDoctors]);

  const handleCancelBooking = useCallback(() => {
    addMessage('bot', 'Booking cancelled. Kuch aur help chahiye? 😊',
      { quickReplies: ['Fever / बुखार', 'Find Nearby Doctors', 'Book Appointment'] });
  }, []);

  // ── Nearby doctors ───────────────────────────────────────────────────────
  const fetchNearbyDoctors = useCallback(async (specialty, city) => {
    const skeletonId = Date.now();
    setMessages(prev => [...prev, {
      id: skeletonId, role: 'bot',
      content: `Finding **${specialty}** doctors in ${city}... 🔍`,
      loadingDoctors: true, timestamp: new Date()
    }]);
    try {
      const { data } = await axios.post(`${backendUrl}/api/maps/nearby-doctors`, { specialty, city });
      setMessages(prev => prev.filter(m => m.id !== skeletonId));
      if (data.success && data.doctors?.length > 0) {
        setNearbyDoctors(data.doctors);
        addMessage('bot', `Found **${data.doctors.length}** doctors near ${city} 📍`, { showDoctors: true });
      } else if (data.fallbackUrl) {
        addMessage('bot', `No doctors found for ${city}. [Search on OpenStreetMap](${data.fallbackUrl}) 🗺️`);
      } else {
        addMessage('bot', `Sorry, no doctors found in ${city}. Try another city. 🙏`);
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== skeletonId));
      addMessage('bot', 'Could not fetch nearby doctors. Please try again. 🙏');
    }
  }, [backendUrl]);

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');
    setShowSymptoms(false);
    if (inputRef.current) { inputRef.current.style.height = 'auto'; }
    addMessage('user', userText);
    setLoading(true);

    const history = messages.filter(m => m.id !== 1).map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: userText });

    try {
      const { data } = await axios.post(`${backendUrl}/api/chatbot/analyze`, { messages: history });
      if (data.success) {
        if (data.isEmergency) setHasEmergency(true);
        const newMsg = addMessage('bot', data.reply, {
          quickReplies: data.bookingSummary ? [] : (data.quickReplies || []),
          bookingSummary: data.bookingSummary || null,
          isEmergency: data.isEmergency || false,
        });
        // Auto-speak bot reply if TTS enabled
        if (ttsEnabled && data.reply && !data.isEmergency) {
          setTimeout(() => speak(data.reply, newMsg.id), 300);
        }
        if (data.doctorSearch) {
          setTimeout(() => fetchNearbyDoctors(data.doctorSearch.specialty, data.doctorSearch.city), 400);
        }
      } else {
        addMessage('bot', data.message || 'Kuch galat ho gaya. Please try again. 🙏');
      }
    } catch (err) {
      addMessage('bot', `Sorry, error: ${err.response?.data?.message || err.message}. Please try again. 🙏`);
      toast.error('Failed to reach AI service.');
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, backendUrl, fetchNearbyDoctors, ttsEnabled, speak]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    if (window.confirm('Clear chat history?')) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
      setHasEmergency(false);
      setMessages([INITIAL_MSG]);
      setNearbyDoctors([]);
      localStorage.removeItem('medinexus_chat_history');
    }
  };

  // ── Filtered messages for search ─────────────────────────────────────────
  const displayMessages = searchMode && searchQuery
    ? messages.filter(m => m.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const lastBot = [...messages].reverse().find(m => m.role === 'bot');
  const quickReplies = !loading && lastBot?.quickReplies?.length ? lastBot.quickReplies : [];
  const unreadCount = !isOpen ? messages.filter(m => m.role === 'bot' && m.id !== 1).length : 0;

  // ── Dimensions ───────────────────────────────────────────────────────────
  const chatW = isExpanded ? 'w-[95vw] sm:w-[680px]' : 'w-[92vw] sm:w-[420px]';
  const chatH = isExpanded ? 'h-[90vh] sm:h-[780px]' : 'h-[580px] sm:h-[640px]';

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans'>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className={`mb-4 overflow-hidden flex flex-col ${chatW} ${chatH} rounded-2xl border border-[#1e2d4a] shadow-2xl shadow-black/50 transition-all duration-300`}
            style={{ background: '#0a1628' }}
          >
            {/* ── Header ── */}
            <div className='relative flex-shrink-0 px-4 py-3 flex justify-between items-center overflow-hidden'
              style={{ background: 'linear-gradient(135deg, #0d1f3c 0%, #0a1628 100%)', borderBottom: '1px solid #1e2d4a' }}>
              <div className='absolute -top-6 -left-6 w-24 h-24 rounded-full pointer-events-none'
                style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)' }} />

              <div className='flex items-center gap-3 relative z-10'>
                <div className='relative'>
                  <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30'>
                    <Sparkles size={18} className='text-white' />
                  </div>
                  <span className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a1628] animate-pulse' />
                </div>
                <div>
                  <h3 className='font-bold text-base text-white leading-tight'>MediNexus AI</h3>
                  <p className='text-[11px] text-teal-400'>Hindi • English • Marathi</p>
                </div>
              </div>

              <div className='flex items-center gap-0.5 relative z-10'>
                {/* TTS toggle */}
                <button onClick={() => { setTtsEnabled(p => !p); window.speechSynthesis?.cancel(); setSpeakingId(null); }}
                  className={`p-2 rounded-lg transition-all ${ttsEnabled ? 'text-teal-400 bg-teal-500/10' : 'text-gray-500 hover:text-gray-300'}`}
                  title={ttsEnabled ? 'Mute AI voice' : 'Enable AI voice'}>
                  {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
                {/* Search */}
                <button onClick={() => setSearchMode(p => !p)}
                  className={`p-2 rounded-lg transition-all ${searchMode ? 'text-teal-400 bg-teal-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                  title='Search messages'>
                  <Search size={14} />
                </button>
                {/* Export */}
                <button onClick={exportChat}
                  className='p-2 rounded-lg text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all'
                  title='Export chat'>
                  <Download size={14} />
                </button>
                {/* Expand */}
                <button onClick={() => setIsExpanded(p => !p)}
                  className='p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all'
                  title={isExpanded ? 'Minimize' : 'Expand'}>
                  {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                {/* Clear */}
                <button onClick={clearChat}
                  className='p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all'
                  title='Clear history'>
                  <Trash2 size={14} />
                </button>
                {/* Close */}
                <button onClick={() => setIsOpen(false)}
                  className='p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all'>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Search bar ── */}
            <AnimatePresence>
              {searchMode && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className='flex-shrink-0 overflow-hidden' style={{ borderBottom: '1px solid #1e2d4a' }}>
                  <div className='px-3 py-2 flex items-center gap-2' style={{ background: '#0d1b3e' }}>
                    <Search size={14} className='text-teal-400 flex-shrink-0' />
                    <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder='Search in conversation...'
                      className='flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 focus:outline-none' />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className='text-gray-500 hover:text-gray-300'>
                        <X size={13} />
                      </button>
                    )}
                    <span className='text-[10px] text-gray-500'>
                      {searchQuery ? `${displayMessages.length} result${displayMessages.length !== 1 ? 's' : ''}` : ''}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Emergency banner ── */}
            <AnimatePresence>
              {hasEmergency && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className='flex-shrink-0 overflow-hidden px-2 pt-2'>
                  <EmergencyBanner />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Chat area ── */}
            <div className='flex-1 overflow-y-auto px-3 pt-4 pb-2 space-y-3
              [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-[#1e2d4a] [&::-webkit-scrollbar-thumb]:rounded-full'
              style={{ background: '#0a1628' }}>

              {/* Search empty state */}
              {searchMode && searchQuery && displayMessages.length === 0 && (
                <div className='flex flex-col items-center justify-center py-12 gap-2'>
                  <Search size={28} className='text-gray-600' />
                  <p className='text-sm text-gray-500'>No messages found for "{searchQuery}"</p>
                </div>
              )}

              {displayMessages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  nearbyDoctors={msg.showDoctors ? nearbyDoctors : []}
                  onConfirmBooking={handleConfirmBooking}
                  onCancelBooking={handleCancelBooking}
                  onFeedback={handleFeedback}
                  onSpeak={(text) => speak(text, msg.id)}
                  isSpeaking={speakingId === msg.id}
                />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* ── Symptom chips panel ── */}
            <AnimatePresence>
              {showSymptoms && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className='flex-shrink-0 overflow-hidden' style={{ borderTop: '1px solid #1e2d4a' }}>
                  <div className='px-3 py-2.5' style={{ background: '#0d1b3e' }}>
                    <p className='text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold'>Quick Symptoms</p>
                    <div className='flex flex-wrap gap-1.5'>
                      {SYMPTOM_CHIPS.map(({ emoji, label, query }) => (
                        <button key={label}
                          onClick={() => { sendMessage(query); setShowSymptoms(false); }}
                          className='flex items-center gap-1 bg-[#0a1628] border border-[#1e2d4a] hover:border-teal-500/40 hover:bg-teal-500/10 text-gray-300 hover:text-teal-300 text-xs px-2.5 py-1.5 rounded-full transition-all'>
                          <span>{emoji}</span> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Quick replies ── */}
            {quickReplies.length > 0 && !showSymptoms && (
              <div className='px-3 pt-2 pb-1 flex-shrink-0' style={{ borderTop: '1px solid #1e2d4a', background: '#0a1628' }}>
                <QuickReplies replies={quickReplies} onSelect={sendMessage} disabled={loading} />
              </div>
            )}

            {/* ── Disclaimer ── */}
            <div className='px-4 py-1.5 flex-shrink-0 text-center' style={{ borderTop: '1px solid #1e2d4a', background: '#0d1b3e' }}>
              <p className='text-[10px] text-gray-500'>⚠️ AI suggestions only — always consult a real doctor.</p>
            </div>

            {/* ── Input area ── */}
            <div className='p-3 flex-shrink-0' style={{ borderTop: '1px solid #1e2d4a', background: '#0d1b3e' }}>
              <div className='flex gap-2 items-end'>
                {/* Symptom chips toggle */}
                <button onClick={() => setShowSymptoms(p => !p)}
                  className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${showSymptoms ? 'bg-teal-500/20 text-teal-400' : 'text-gray-500 hover:text-teal-400 hover:bg-teal-500/10'}`}
                  title='Symptom shortcuts'
                  style={{ border: '1px solid', borderColor: showSymptoms ? 'rgba(20,184,166,0.4)' : '#1e2d4a' }}>
                  <Activity size={18} />
                </button>

                {/* Text input */}
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
                  placeholder={isListening ? '🎙️ Listening...' : 'Type symptoms... / लक्षण लिखें...'}
                  disabled={loading}
                  className='flex-1 rounded-xl px-3 py-2.5 text-sm text-gray-200 resize-none focus:outline-none max-h-24 placeholder-gray-500 transition-all'
                  style={{ background: '#0a1628', border: `1px solid ${isListening ? 'rgba(239,68,68,0.5)' : '#1e2d4a'}` }}
                  onFocus={e => { if (!isListening) e.target.style.borderColor = 'rgba(20,184,166,0.5)'; }}
                  onBlur={e => { if (!isListening) e.target.style.borderColor = '#1e2d4a'; }}
                />

                {/* Voice input */}
                <button onClick={toggleVoice}
                  className={`flex-shrink-0 p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-teal-400 hover:bg-teal-500/10'}`}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                  style={{ border: '1px solid', borderColor: isListening ? '#ef4444' : '#1e2d4a' }}>
                  {isListening
                    ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}><MicOff size={18} /></motion.div>
                    : <Mic size={18} />
                  }
                </button>

                {/* Send */}
                <motion.button
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className='flex-shrink-0 p-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed'
                  style={{
                    background: input.trim() && !loading ? 'linear-gradient(135deg, #14b8a6, #06b6d4)' : '#1e2d4a',
                    boxShadow: input.trim() && !loading ? '0 4px 15px rgba(20,184,166,0.3)' : 'none'
                  }}>
                  {loading
                    ? <Loader2 className='animate-spin text-teal-400' size={20} />
                    : <Send size={20} className={input.trim() ? 'text-white' : 'text-gray-500'} />
                  }
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ── */}
      <AnimatePresence mode='wait'>
        {!isOpen && (
          <motion.button
            key='fab'
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className='relative flex items-center justify-center'
          >
            <span className='absolute inset-0 rounded-full animate-ping opacity-30'
              style={{ background: 'radial-gradient(circle, #14b8a6, #06b6d4)' }} />
            <div className='relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/30'
              style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)', border: '2px solid rgba(20,184,166,0.4)' }}>
              <MessageCircle size={26} className='text-white' />
            </div>
            {unreadCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0a1628]'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
