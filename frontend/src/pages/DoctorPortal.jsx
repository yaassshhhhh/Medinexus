import React, { useState, useContext, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video, Clock, User, LogIn, Calendar, ChevronRight, RefreshCw,
  CheckCircle, IndianRupee, X, Phone, Mail, MapPin, Activity,
  TrendingUp, Users, Stethoscope, ChevronDown, ChevronUp,
  MessageCircle, Send, ArrowLeft, CheckCheck, Loader2
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { CallRoom } from './VideoConsult'
import { io } from 'socket.io-client'

/* ── colour tokens ── */
const card     = 'bg-[#0f1629] border border-[#1e2d4a]'
const tPri     = 'text-gray-100'
const tSec     = 'text-gray-400'
const inputCls = `w-full border border-[#1e2d4a] rounded-xl px-4 py-2.5 text-sm focus:outline-none
  focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 bg-[#0d1b3e] text-gray-100
  placeholder-gray-500 transition-all`

/* ── helpers ── */
const fmtDate = (slotDate) => {
  if (!slotDate) return '—'
  const [d, m, y] = slotDate.split('_')
  return `${d}/${m}/${y}`
}

const calcAge = (dob) => {
  if (!dob || dob === 'Not Selected') return null
  const birth = new Date(dob)
  if (isNaN(birth)) return null
  const diff = Date.now() - birth.getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

/* ── Patient Detail Drawer ── */
const PatientDrawer = ({ appt, onClose }) => {
  const u = appt.userData || {}
  const age = calcAge(u.dob)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      className="mt-3 rounded-2xl bg-[#0d1b3e] border border-cyan-500/20 p-4 space-y-3"
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Patient Details</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
          <ChevronUp size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {u.email && (
          <div className="flex items-center gap-2 text-gray-300">
            <Mail size={13} className="text-cyan-400 flex-shrink-0" />
            <span className="truncate">{u.email}</span>
          </div>
        )}
        {u.phone && u.phone !== '000000000' && (
          <div className="flex items-center gap-2 text-gray-300">
            <Phone size={13} className="text-green-400 flex-shrink-0" />
            <span>{u.phone}</span>
          </div>
        )}
        {u.gender && u.gender !== 'Not Selected' && (
          <div className="flex items-center gap-2 text-gray-300">
            <User size={13} className="text-violet-400 flex-shrink-0" />
            <span>{u.gender}</span>
          </div>
        )}
        {age && (
          <div className="flex items-center gap-2 text-gray-300">
            <Activity size={13} className="text-amber-400 flex-shrink-0" />
            <span>Age: {age} yrs</span>
          </div>
        )}
        {u.dob && u.dob !== 'Not Selected' && (
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={13} className="text-pink-400 flex-shrink-0" />
            <span>DOB: {u.dob}</span>
          </div>
        )}
        {u.address?.line1 && (
          <div className="flex items-start gap-2 text-gray-300 sm:col-span-2">
            <MapPin size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span>{u.address.line1}{u.address.line2 ? `, ${u.address.line2}` : ''}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-[#1e2d4a] grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-[#0f1629] rounded-xl p-2 text-center">
          <p className="text-gray-400">Type</p>
          <p className={`font-bold mt-0.5 ${appt.isVideoConsult ? 'text-blue-400' : 'text-green-400'}`}>
            {appt.isVideoConsult ? '📹 Video' : '🏥 In-Person'}
          </p>
        </div>
        <div className="bg-[#0f1629] rounded-xl p-2 text-center">
          <p className="text-gray-400">Payment</p>
          <p className={`font-bold mt-0.5 ${appt.payment ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {appt.payment ? `✓ ₹${appt.amount}` : 'Pending'}
          </p>
        </div>
        <div className="bg-[#0f1629] rounded-xl p-2 text-center">
          <p className="text-gray-400">Slot</p>
          <p className="font-bold mt-0.5 text-gray-200">{appt.slotTime}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Appointment Card ── */
const AppointmentCard = ({ appt, index, activeTab, todaySlot, onMarkComplete, onJoinCall, onChat }) => {
  const [expanded, setExpanded] = useState(false)
  const isToday = appt.slotDate === todaySlot

  return (
    <motion.div
      key={appt._id || index}
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-blue-900/20 ${
        isToday ? 'bg-cyan-500/5 border-cyan-500/20' : card
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4">
        {/* Avatar */}
        <img
          src={appt.userData?.image || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#1e2d4a] flex-shrink-0"
          alt=""
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${tPri}`}>{appt.userData?.name || 'Patient'}</p>
          <p className={`text-sm ${tSec}`}>
            {fmtDate(appt.slotDate)} at {appt.slotTime}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {isToday && (
              <span className="text-xs bg-green-500/10 text-green-400 font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                Today
              </span>
            )}
            {appt.isVideoConsult ? (
              <span className="text-xs bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                📹 Video
              </span>
            ) : (
              <span className="text-xs bg-green-500/10 text-green-400 font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                🏥 In-Person
              </span>
            )}
            {appt.payment && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                ✓ Paid ₹{appt.amount}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
          {activeTab === 'upcoming' && (
            <>
              {appt.isVideoConsult && appt.roomId && (
                <button onClick={() => onJoinCall(appt)}
                  className="flex items-center gap-1.5 bg-cyan-500 text-black text-xs px-3 py-2 rounded-xl hover:bg-cyan-400 transition-all font-semibold">
                  <Video size={13} /> Join <ChevronRight size={12} />
                </button>
              )}
              <button onClick={() => onMarkComplete(appt._id)}
                className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-3 py-2 rounded-xl hover:bg-green-500 hover:text-black transition-all font-semibold">
                <CheckCircle size={13} /> Complete
              </button>
              <button onClick={() => onChat(appt)}
                className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-3 py-2 rounded-xl hover:bg-indigo-500 hover:text-white transition-all font-semibold">
                <MessageCircle size={13} /> Message
              </button>
            </>
          )}
          {activeTab === 'completed' && (
            <div className='flex flex-col gap-2'>
              <span className="text-xs bg-green-500/10 text-green-400 font-bold px-3 py-2 rounded-xl border border-green-500/20">
                ✓ Done
              </span>
              <button onClick={() => onChat(appt)}
                className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-3 py-2 rounded-xl hover:bg-indigo-500 hover:text-white transition-all font-semibold">
                <MessageCircle size={13} /> Message
              </button>
            </div>
          )}
          {activeTab === 'cancelled' && (
            <span className="text-xs bg-red-500/10 text-red-400 font-bold px-3 py-2 rounded-xl border border-red-500/20 flex items-center gap-1">
              <X size={11} /> Cancelled
            </span>
          )}
          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(v => !v)}
            className={`flex items-center gap-1 text-xs px-3 py-2 rounded-xl border transition-all font-semibold ${
              expanded
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                : 'bg-[#0d1b3e] text-gray-400 border-[#1e2d4a] hover:text-cyan-400'
            }`}
          >
            <User size={12} />
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Patient drawer */}
      <AnimatePresence>
        {expanded && (
          <div className="px-4 pb-4">
            <PatientDrawer appt={appt} onClose={() => setExpanded(false)} />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Doctor Chat View ── */
const DoctorChatView = ({ appt, doctor, backendUrl, onBack }) => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const pendingRef = useRef({}) // tempId → true, for replacing optimistic bubbles
  const appointmentId = appt._id

  // ── Load history ──────────────────────────────────────────────────────
  useEffect(() => {
    axios.post(backendUrl + '/api/messages/get', { appointmentId }, { headers: { dtoken: doctor.token } })
      .then(({ data }) => {
        if (data.success) setMessages(data.messages)
        axios.post(backendUrl + '/api/messages/mark-read', { appointmentId, readerRole: 'doctor' }).catch(() => {})
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [appointmentId])

  // ── Socket ────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(backendUrl, { transports: ['websocket'], reconnection: true })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('join-dm', { appointmentId })
    })
    socket.on('disconnect', () => setConnected(false))

    socket.on('dm-message', (msg) => {
      setMessages(prev => {
        // Replace optimistic bubble with real message
        if (msg.tempId && pendingRef.current[msg.tempId]) {
          delete pendingRef.current[msg.tempId]
          return prev.map(m => m._id === msg.tempId ? { ...msg, optimistic: false } : m)
        }
        // Avoid duplicates by real _id
        if (prev.some(m => m._id === msg._id)) return prev
        return [...prev, msg]
      })
    })

    return () => socket.disconnect()
  }, [appointmentId, backendUrl])

  // ── Auto scroll ───────────────────────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // ── Send ──────────────────────────────────────────────────────────────
  const sendMessage = () => {
    if (!text.trim() || sending) return
    const msgText = text.trim()
    setText('')
    setSending(true)

    const tempId = `temp_${Date.now()}_${Math.random()}`
    pendingRef.current[tempId] = true

    // Optimistic bubble
    setMessages(prev => [...prev, {
      _id: tempId, appointmentId,
      senderId: doctor._id, senderRole: 'doctor',
      senderName: `Dr. ${doctor.name}`,
      message: msgText, createdAt: new Date().toISOString(), optimistic: true
    }])

    socketRef.current?.emit('dm-message', {
      appointmentId, senderId: doctor._id, senderRole: 'doctor',
      senderName: `Dr. ${doctor.name}`, message: msgText,
      tempId  // echoed back by server so we can replace the optimistic bubble
    })

    setSending(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const fmt = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const fmtDate = (d) => {
    const date = new Date(d)
    const today = new Date()
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const grouped = messages.reduce((acc, msg) => {
    const key = fmtDate(msg.createdAt)
    if (!acc[key]) acc[key] = []
    acc[key].push(msg)
    return acc
  }, {})

  return (
    <div className='flex flex-col bg-[#0a0f1e] rounded-2xl overflow-hidden border border-[#1e2d4a]'
      style={{ height: 'calc(100vh - 120px)' }}>

      {/* Header */}
      <div className='flex items-center gap-3 px-4 py-3 bg-[#0f1629] border-b border-[#1e2d4a] flex-shrink-0'>
        <button onClick={onBack}
          className='p-2 rounded-xl hover:bg-[#1e2d4a] text-gray-400 hover:text-white transition-all flex-shrink-0'>
          <ArrowLeft size={18} />
        </button>
        <div className='relative flex-shrink-0'>
          <img src={appt.userData?.image || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'}
            className='w-10 h-10 rounded-full object-cover border-2 border-cyan-500/30' alt='' />
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f1629] ${connected ? 'bg-green-400' : 'bg-gray-500'}`} />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='font-bold text-gray-100 text-sm truncate'>{appt.userData?.name || 'Patient'}</p>
          <p className='text-xs text-gray-400'>{appt.slotDate?.split('_').join('/')} · {appt.slotTime}</p>
        </div>
        {appt.isVideoConsult && appt.roomId && (
          <button
            onClick={() => window.open(`/video-consult?roomId=${appt.roomId}&doctorView=true`, '_blank')}
            className='flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black transition-all flex-shrink-0'>
            <Video size={13} /> Join Call
          </button>
        )}
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-0.5'>
        {loading && (
          <div className='flex justify-center pt-8'>
            <Loader2 className='animate-spin text-cyan-400' size={24} />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full gap-3 text-center'>
            <MessageCircle size={32} className='text-gray-600' />
            <p className='text-gray-500 text-sm font-medium'>No messages yet</p>
            <p className='text-gray-600 text-xs'>Start the conversation with your patient</p>
          </div>
        )}

        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className='flex items-center gap-3 my-4'>
              <div className='flex-1 h-px bg-[#1e2d4a]' />
              <span className='text-[11px] text-gray-500 px-2.5 py-0.5 rounded-full bg-[#0f1629] border border-[#1e2d4a] whitespace-nowrap'>
                {date}
              </span>
              <div className='flex-1 h-px bg-[#1e2d4a]' />
            </div>

            {msgs.map((msg, i) => {
              const isMe = msg.senderRole === 'doctor'
              const prevMsg = msgs[i - 1]
              const showAvatar = !isMe && (i === 0 || prevMsg?.senderRole !== 'user')

              return (
                <motion.div key={msg._id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-end gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>

                  {/* Patient avatar */}
                  {!isMe && (
                    <div className='w-7 h-7 flex-shrink-0 mb-0.5'>
                      {showAvatar ? (
                        <img src={appt.userData?.image || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'}
                          alt='' className='w-7 h-7 rounded-full object-cover border border-[#1e2d4a]' />
                      ) : <div className='w-7 h-7' />}
                    </div>
                  )}

                  <div className={`max-w-[72%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {showAvatar && !isMe && (
                      <span className='text-[10px] text-indigo-400 mb-0.5 px-1 font-medium'>
                        {msg.senderName}
                      </span>
                    )}
                    <div className={`px-3.5 py-2 text-sm leading-relaxed break-words ${
                      isMe
                        ? 'bg-cyan-600 text-white rounded-2xl rounded-br-sm'
                        : 'bg-[#0f1629] border border-[#1e2d4a] text-gray-100 rounded-2xl rounded-bl-sm'
                    } ${msg.optimistic ? 'opacity-70' : 'opacity-100'}`}>
                      {msg.message}
                    </div>
                    <div className={`flex items-center gap-1 mt-0.5 px-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className='text-[10px] text-gray-600'>{fmt(msg.createdAt)}</span>
                      {isMe && (
                        msg.optimistic
                          ? <Clock size={9} className='text-gray-600' />
                          : <CheckCheck size={9} className='text-cyan-400' />
                      )}
                    </div>
                  </div>

                  {isMe && <div className='w-7 flex-shrink-0' />}
                </motion.div>
              )
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='px-4 py-3 bg-[#0f1629] border-t border-[#1e2d4a] flex-shrink-0'>
        <div className='flex items-end gap-2'>
          <textarea ref={inputRef} value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder='Type a message to patient...' rows={1}
            className='flex-1 bg-[#0d1b3e] border border-[#1e2d4a] text-gray-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 placeholder-gray-600 resize-none transition-all'
            style={{ maxHeight: '100px', overflowY: 'auto' }} />
          <button onClick={sendMessage} disabled={!text.trim() || sending}
            className='p-2.5 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-40 transition-all flex-shrink-0 shadow-lg shadow-cyan-900/30'>
            {sending ? <Loader2 size={18} className='animate-spin' /> : <Send size={18} />}
          </button>
        </div>
        <div className='flex items-center justify-between mt-1.5 px-0.5'>
          <p className='text-[10px] text-gray-600'>Enter to send · Shift+Enter for new line</p>
          <div className={`flex items-center gap-1 text-[10px] ${connected ? 'text-green-500' : 'text-gray-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-gray-500'}`} />
            {connected ? 'Live' : 'Connecting...'}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Main DoctorPortal Component
══════════════════════════════════════════ */
const DoctorPortal = () => {
  const { backendUrl } = useContext(AppContext)
  const [step, setStep]               = useState('login')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [doctor, setDoctor]           = useState(null)
  const [appointments, setAppointments] = useState([])
  const [earnings, setEarnings]       = useState(null)
  const [loading, setLoading]         = useState(false)
  const [callState, setCallState]     = useState(null)
  const [activeTab, setActiveTab]     = useState('upcoming')
  const [chatAppt, setChatAppt]       = useState(null)

  /* ── API calls ── */
  const loadAppointments = async (token) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/appointments`, {},
        { headers: { dtoken: token } }
      )
      if (data.success) setAppointments(data.appointments)
    } catch { toast.error('Failed to load appointments') }
  }

  const loadEarnings = async (token) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/earnings`, {},
        { headers: { dtoken: token } }
      )
      if (data.success) setEarnings(data)
    } catch { }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
      if (data.success) {
        const doc = { _id: data.docId, name: data.name, token: data.token }
        setDoctor(doc)
        await Promise.all([loadAppointments(data.token), loadEarnings(data.token)])
        setStep('dashboard')
        toast.success(`Welcome, Dr. ${data.name}!`)
      } else {
        toast.error(data.message || 'Login failed.')
      }
    } catch {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const markComplete = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { dtoken: doctor.token } }
      )
      if (data.success) {
        toast.success('Marked as completed')
        await Promise.all([loadAppointments(doctor.token), loadEarnings(doctor.token)])
      } else { toast.error(data.message) }
    } catch { toast.error('Failed to update') }
  }

  const joinCall = (appt) => {
    setCallState({
      roomId: appt.roomId,
      peerName: appt.userData?.name || 'Patient',
      peerImage: appt.userData?.image || null
    })
    setStep('call')
  }

  /* ── Call screen ── */
  if (step === 'call' && callState) {
    return (
      <CallRoom
        roomId={callState.roomId}
        role="doctor"
        peerName={callState.peerName}
        peerImage={callState.peerImage}
        backendUrl={backendUrl}
        onEndCall={() => { setCallState(null); setStep('dashboard') }}
      />
    )
  }

  /* ── Chat screen ── */
  if (chatAppt && doctor) {
    return (
      <DoctorChatView
        appt={chatAppt}
        doctor={doctor}
        backendUrl={backendUrl}
        onBack={() => setChatAppt(null)}
      />
    )
  }

  /* ── Login screen ── */
  if (step === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 sm:p-8 w-full max-w-md ${card}`}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Stethoscope size={28} className="text-cyan-400" />
            </div>
            <h2 className={`text-2xl font-bold ${tPri}`}>Doctor Portal</h2>
            <p className={`text-sm mt-1 ${tSec}`}>Sign in to manage your consultations</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-blue-300">
            ℹ️ Use your registered email and the password provided by admin.
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`text-sm font-medium block mb-1 ${tSec}`}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="your@email.com" className={inputCls} />
            </div>
            <div>
              <label className={`text-sm font-medium block mb-1 ${tSec}`}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" className={inputCls} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-cyan-500/20">
              {loading ? 'Signing in…' : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  /* ── Dashboard ── */
  const today     = new Date()
  const todaySlot = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`

  const upcoming  = appointments.filter(a => !a.cancelled && !a.isCompleted)
  const completed = appointments.filter(a => a.isCompleted)
  const cancelled = appointments.filter(a => a.cancelled)
  const videoAppts = appointments.filter(a => a.isVideoConsult && !a.cancelled)
  const inPerson  = appointments.filter(a => !a.isVideoConsult && !a.cancelled)

  const tabData = { upcoming, completed, cancelled, video: videoAppts }
  const displayed = tabData[activeTab] || []

  const tabs = [
    { key: 'upcoming',  label: 'Upcoming',   count: upcoming.length  },
    { key: 'video',     label: '📹 Video',    count: videoAppts.length },
    { key: 'completed', label: 'Completed',  count: completed.length },
    { key: 'cancelled', label: 'Cancelled',  count: cancelled.length },
  ]

  return (
    <div className="pt-10 min-h-screen pb-16">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className={`text-2xl font-bold ${tPri}`}>Welcome, Dr. {doctor?.name} 👋</h1>
            <p className={`text-sm mt-0.5 ${tSec}`}>Manage your appointments and consultations</p>
          </div>
          <button
            onClick={() => Promise.all([loadAppointments(doctor.token), loadEarnings(doctor.token)])}
            className="flex items-center gap-2 text-sm text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-full hover:bg-cyan-500/10 transition-all"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats row 1 — main */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            {
              label: 'Total Appts',
              value: appointments.length,
              icon: Calendar,
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/10 border-indigo-500/20'
            },
            {
              label: "Today's",
              value: appointments.filter(a => a.slotDate === todaySlot).length,
              icon: Clock,
              color: 'text-green-400',
              bg: 'bg-green-500/10 border-green-500/20'
            },
            {
              label: 'Patients',
              value: new Set(appointments.map(a => a.userId)).size,
              icon: Users,
              color: 'text-violet-400',
              bg: 'bg-violet-500/10 border-violet-500/20'
            },
            {
              label: 'Earnings',
              value: `₹${earnings?.totalEarnings || 0}`,
              icon: IndianRupee,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20'
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-2xl p-4 text-center border ${bg}`}>
              <Icon size={20} className={`${color} mx-auto mb-1`} />
              <p className={`text-xl font-bold ${tPri}`}>{value}</p>
              <p className={`text-xs font-medium ${tSec}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Stats row 2 — breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Video Consults',
              value: videoAppts.length,
              icon: Video,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/20'
            },
            {
              label: 'In-Person',
              value: inPerson.length,
              icon: Stethoscope,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10 border-teal-500/20'
            },
            {
              label: 'Completed',
              value: completed.length,
              icon: CheckCircle,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20'
            },
            {
              label: 'Cancelled',
              value: cancelled.length,
              icon: X,
              color: 'text-red-400',
              bg: 'bg-red-500/10 border-red-500/20'
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-2xl p-3 text-center border ${bg}`}>
              <Icon size={16} className={`${color} mx-auto mb-1`} />
              <p className={`text-lg font-bold ${tPri}`}>{value}</p>
              <p className={`text-xs font-medium ${tSec}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 border-b border-[#1e2d4a] pb-1 overflow-x-auto">
          {tabs.map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-t-xl text-sm font-semibold capitalize transition-all whitespace-nowrap ${
                activeTab === key
                  ? 'bg-cyan-500 text-black'
                  : `${tSec} hover:text-cyan-400`
              }`}>
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {displayed.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`text-center py-16 ${tSec}`}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            </motion.div>
            <p className="font-medium">No {activeTab} appointments.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {displayed.map((appt, i) => (
              <AppointmentCard
                key={appt._id || i}
                appt={appt}
                index={i}
                activeTab={activeTab === 'video' ? 'upcoming' : activeTab}
                todaySlot={todaySlot}
                onMarkComplete={markComplete}
                onJoinCall={joinCall}
                onChat={(appt) => setChatAppt(appt)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DoctorPortal
