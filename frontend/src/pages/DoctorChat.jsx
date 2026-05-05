import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Send, Video, Calendar, Clock,
  CheckCheck, Loader2, MessageCircle, Wifi, WifiOff
} from 'lucide-react'

const DoctorChat = () => {
  const { appointmentId } = useParams()
  const { backendUrl, token, userData } = useContext(AppContext)
  const navigate = useNavigate()

  const [appointment, setAppointment] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)

  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  // Track temp IDs we sent so we can replace them with real ones
  const pendingRef = useRef({}) // tempId → true

  // ── Load appointment ──────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate('/login'); return }
    axios.post(backendUrl + '/api/user/appointments', {}, { headers: { token } })
      .then(({ data }) => {
        if (data.success) {
          const appt = data.appointments.find(a => a._id === appointmentId)
          if (!appt) { toast.error('Appointment not found'); navigate('/my-appointment'); return }
          setAppointment(appt)
        }
      })
      .catch(e => toast.error(e.message))
  }, [token, appointmentId])

  // ── Load message history ──────────────────────────────────────────────
  useEffect(() => {
    if (!token || !appointmentId) return
    axios.post(backendUrl + '/api/messages/get', { appointmentId }, { headers: { token } })
      .then(({ data }) => {
        if (data.success) setMessages(data.messages)
        // Mark doctor's messages as read
        axios.post(backendUrl + '/api/messages/mark-read', { appointmentId, readerRole: 'user' }).catch(() => {})
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [token, appointmentId])

  // ── Socket ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!appointmentId) return
    const socket = io(backendUrl, { transports: ['websocket'], reconnection: true })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('join-dm', { appointmentId })
    })
    socket.on('disconnect', () => setConnected(false))

    socket.on('dm-message', (msg) => {
      setMessages(prev => {
        // If this is a confirmation of our own optimistic message, replace it
        if (pendingRef.current[msg.tempId]) {
          delete pendingRef.current[msg.tempId]
          return prev.map(m => m._id === msg.tempId ? { ...msg, optimistic: false } : m)
        }
        // Avoid true duplicates by real _id
        if (prev.some(m => m._id === msg._id)) return prev
        return [...prev, msg]
      })
    })

    return () => { socket.disconnect() }
  }, [appointmentId, backendUrl])

  // ── Auto scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Send ──────────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    if (!text.trim() || sending) return
    const msgText = text.trim()
    setText('')
    setSending(true)

    const tempId = `temp_${Date.now()}_${Math.random()}`
    pendingRef.current[tempId] = true

    // Optimistic bubble
    setMessages(prev => [...prev, {
      _id: tempId,
      appointmentId,
      senderId: userData?._id,
      senderRole: 'user',
      senderName: userData?.name || 'You',
      message: msgText,
      createdAt: new Date().toISOString(),
      optimistic: true
    }])

    socketRef.current?.emit('dm-message', {
      appointmentId,
      senderId: userData?._id,
      senderRole: 'user',
      senderName: userData?.name || 'Patient',
      message: msgText,
      tempId   // server echoes this back so we can replace the optimistic bubble
    })

    setSending(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [text, sending, appointmentId, userData])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  const fmt = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const fmtDate = (d) => {
    const date = new Date(d)
    const today = new Date()
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Group by date
  const grouped = messages.reduce((acc, msg) => {
    const key = fmtDate(msg.createdAt)
    if (!acc[key]) acc[key] = []
    acc[key].push(msg)
    return acc
  }, {})

  // ── Render ────────────────────────────────────────────────────────────
  if (loading) return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <Loader2 className='animate-spin text-cyan-400' size={32} />
    </div>
  )

  return (
    <div className='flex flex-col bg-[#0a0f1e] rounded-2xl overflow-hidden border border-[#1e2d4a]'
      style={{ height: 'calc(100vh - 90px)' }}>

      {/* ── Header ── */}
      <div className='flex items-center gap-3 px-4 py-3 bg-[#0f1629] border-b border-[#1e2d4a] flex-shrink-0'>
        <button onClick={() => navigate('/my-appointment')}
          className='p-2 rounded-xl hover:bg-[#1e2d4a] text-gray-400 hover:text-white transition-all flex-shrink-0'>
          <ArrowLeft size={18} />
        </button>

        {appointment ? (
          <>
            <div className='relative flex-shrink-0'>
              <img src={appointment.docData?.image} alt={appointment.docData?.name}
                className='w-10 h-10 rounded-full object-cover border-2 border-cyan-500/30' />
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f1629] ${connected ? 'bg-green-400' : 'bg-gray-500'}`} />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='font-bold text-gray-100 text-sm truncate'>{appointment.docData?.name}</p>
              <p className='text-xs text-cyan-400 truncate'>{appointment.docData?.speciality}</p>
            </div>
            <div className='flex items-center gap-2 flex-shrink-0'>
              <div className='text-right hidden sm:block'>
                <p className='text-[11px] text-gray-500 flex items-center justify-end gap-1'>
                  <Calendar size={9} /> {appointment.slotDate?.split('_').join('/')}
                </p>
                <p className='text-[11px] text-gray-500 flex items-center justify-end gap-1'>
                  <Clock size={9} /> {appointment.slotTime}
                </p>
              </div>
              {appointment.isVideoConsult && appointment.roomId && (
                <button onClick={() => navigate(`/video-consult?roomId=${appointment.roomId}`)}
                  className='flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white transition-all'>
                  <Video size={13} /> Join
                </button>
              )}
            </div>
          </>
        ) : (
          <div className='flex-1 h-4 bg-[#1e2d4a] rounded animate-pulse' />
        )}
      </div>

      {/* ── Messages ── */}
      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-0.5'>
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className='flex flex-col items-center justify-center h-full gap-3 text-center'>
            <div className='w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center'>
              <MessageCircle size={28} className='text-indigo-400' />
            </div>
            <p className='text-gray-400 text-sm font-medium'>No messages yet</p>
            <p className='text-gray-600 text-xs'>Start the conversation with your doctor</p>
          </motion.div>
        )}

        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            {/* Date divider */}
            <div className='flex items-center gap-3 my-4'>
              <div className='flex-1 h-px bg-[#1e2d4a]' />
              <span className='text-[11px] text-gray-500 px-2.5 py-0.5 rounded-full bg-[#0f1629] border border-[#1e2d4a] whitespace-nowrap'>
                {date}
              </span>
              <div className='flex-1 h-px bg-[#1e2d4a]' />
            </div>

            {msgs.map((msg, i) => {
              const isMe = msg.senderRole === 'user'
              const prevMsg = msgs[i - 1]
              const showAvatar = !isMe && (i === 0 || prevMsg?.senderRole !== 'doctor')

              return (
                <motion.div key={msg._id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-end gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>

                  {/* Doctor avatar */}
                  {!isMe && (
                    <div className='w-7 h-7 flex-shrink-0 mb-0.5'>
                      {showAvatar && appointment?.docData?.image ? (
                        <img src={appointment.docData.image} alt=''
                          className='w-7 h-7 rounded-full object-cover border border-[#1e2d4a]' />
                      ) : <div className='w-7 h-7' />}
                    </div>
                  )}

                  <div className={`max-w-[72%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {/* Sender name (doctor only, first in group) */}
                    {showAvatar && !isMe && (
                      <span className='text-[10px] text-cyan-400 mb-0.5 px-1 font-medium'>
                        {msg.senderName}
                      </span>
                    )}

                    {/* Bubble */}
                    <div className={`px-3.5 py-2 text-sm leading-relaxed break-words ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                        : 'bg-[#0f1629] border border-[#1e2d4a] text-gray-100 rounded-2xl rounded-bl-sm'
                    } ${msg.optimistic ? 'opacity-70' : 'opacity-100'}`}>
                      {msg.message}
                    </div>

                    {/* Time + status */}
                    <div className={`flex items-center gap-1 mt-0.5 px-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className='text-[10px] text-gray-600'>{fmt(msg.createdAt)}</span>
                      {isMe && (
                        msg.optimistic
                          ? <Clock size={9} className='text-gray-600' />
                          : <CheckCheck size={9} className='text-indigo-400' />
                      )}
                    </div>
                  </div>

                  {/* User avatar placeholder for alignment */}
                  {isMe && <div className='w-7 flex-shrink-0' />}
                </motion.div>
              )
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className='px-4 py-3 bg-[#0f1629] border-t border-[#1e2d4a] flex-shrink-0'>
        <div className='flex items-end gap-2'>
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder='Type a message...'
            rows={1}
            className='flex-1 bg-[#0d1b3e] border border-[#1e2d4a] text-gray-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 placeholder-gray-600 resize-none transition-all'
            style={{ maxHeight: '100px', overflowY: 'auto' }}
          />
          <button onClick={sendMessage} disabled={!text.trim() || sending}
            className='p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-lg shadow-indigo-900/30'>
            {sending ? <Loader2 size={18} className='animate-spin' /> : <Send size={18} />}
          </button>
        </div>
        <div className='flex items-center justify-between mt-1.5 px-0.5'>
          <p className='text-[10px] text-gray-600'>Enter to send · Shift+Enter for new line</p>
          <div className={`flex items-center gap-1 text-[10px] ${connected ? 'text-green-500' : 'text-gray-600'}`}>
            {connected ? <Wifi size={10} /> : <WifiOff size={10} />}
            {connected ? 'Connected' : 'Connecting...'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorChat
