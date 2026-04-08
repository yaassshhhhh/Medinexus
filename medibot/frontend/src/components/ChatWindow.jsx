import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import QuickReplies from './QuickReplies.jsx';
import DoctorSkeleton from './DoctorSkeleton.jsx';
import { useChat } from '../hooks/useChat.js';

const ChatWindow = () => {
  const { messages, loading, doctors, loadingDoctors, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, loadingDoctors]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get last bot message's quick replies
  const lastBotMsg = [...messages].reverse().find(m => m.role === 'bot');
  const quickReplies = (!loading && lastBotMsg?.quickReplies?.length > 0)
    ? lastBotMsg.quickReplies
    : [];

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-[#ECE5DD] shadow-2xl">

      {/* ── Header ── */}
      <div className="bg-primaryDark text-white px-4 py-3 flex items-center gap-3 shadow-md z-10">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primaryDark font-bold text-lg">
          🏥
        </div>
        <div className="flex-1">
          <p className="font-semibold text-base leading-tight">MediBot</p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-200">Online • Hindi / English / Marathi</span>
          </div>
        </div>
        <span className="text-2xl">💊</span>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 overflow-y-auto chat-scroll px-3 pt-4 pb-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            doctors={msg.showDoctors ? doctors : []}
          />
        ))}

        {/* Typing indicator */}
        {loading && <TypingIndicator />}

        {/* Doctor loading skeleton */}
        {loadingDoctors && (
          <div className="flex items-end gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primaryDark flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              M
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1 ml-1">Nearby doctors dhundh raha hoon... 🔍</p>
              <DoctorSkeleton />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Quick Replies ── */}
      {quickReplies.length > 0 && (
        <div className="bg-[#ECE5DD] px-2 pt-1">
          <QuickReplies
            replies={quickReplies}
            onSelect={(r) => { sendMessage(r); }}
          />
        </div>
      )}

      {/* ── Input Bar ── */}
      <div className="bg-[#F0F0F0] px-3 py-2 flex items-end gap-2 border-t border-gray-200">
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
          }}
          onKeyDown={handleKey}
          placeholder="Type symptoms... / लक्षण लिखें..."
          className="flex-1 bg-white rounded-2xl px-4 py-2.5 text-sm resize-none focus:outline-none shadow-sm max-h-24 leading-relaxed"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:bg-primaryDark transition-colors disabled:opacity-50 flex-shrink-0"
          aria-label="Send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-gray-400 bg-[#F0F0F0] pb-2 px-4">
        ⚠️ MediBot sirf suggestion deta hai. Serious symptoms mein doctor se milein.
      </p>
    </div>
  );
};

export default ChatWindow;
