import React, { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Video, Mic, MicOff, VideoOff, PhoneOff,
    MessageSquare, X, Send, Monitor, MonitorOff,
    Loader2, ChevronRight, Shield, Clock, Star,
    CheckCircle, Users, Zap, Lock, ArrowRight,
    Play, Calendar, IndianRupee, ChevronLeft
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ]
}

// ─── Call Timer ──────────────────────────────────────────────────────────────
const CallTimer = ({ active }) => {
    const [secs, setSecs] = useState(0)
    useEffect(() => {
        if (!active) { setSecs(0); return }
        const t = setInterval(() => setSecs(s => s + 1), 1000)
        return () => clearInterval(t)
    }, [active])
    const pad = n => String(n).padStart(2, '0')
    return (
        <span className="font-mono text-sm text-white">
            {pad(Math.floor(secs / 3600))}:{pad(Math.floor((secs % 3600) / 60))}:{pad(secs % 60)}
        </span>
    )
}

// ─── Chat Panel ──────────────────────────────────────────────────────────────
const ChatPanel = ({ messages, onSend, onClose }) => {
    const [text, setText] = useState('')
    const bottomRef = useRef(null)
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    const send = () => {
        if (!text.trim()) return
        onSend(text.trim())
        setText('')
    }

    return (
        <>
            {/* ── Desktop: side panel (md+) ── */}
            <motion.div
                initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden md:flex absolute right-0 top-0 h-full w-72 bg-gray-900/98 backdrop-blur-md border-l border-gray-700 flex-col z-30"
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0">
                    <span className="text-white font-semibold text-sm">In-call Chat</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {messages.length === 0 && <p className="text-gray-500 text-xs text-center mt-8">No messages yet</p>}
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.self ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-gray-500 mb-0.5">{m.senderName}</span>
                            <div className={`px-3 py-1.5 rounded-xl text-sm max-w-[90%] ${m.self ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                                {m.message}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
                <div className="p-3 border-t border-gray-700 flex gap-2 flex-shrink-0">
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-500"
                    />
                    <button onClick={send} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 flex-shrink-0">
                        <Send size={16} />
                    </button>
                </div>
            </motion.div>

            {/* ── Mobile: bottom drawer (< md) ── */}
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="md:hidden absolute bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-md border-t border-gray-700 flex flex-col z-30 rounded-t-2xl"
                style={{ maxHeight: '55%' }}
            >
                {/* Drag handle */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700 flex-shrink-0">
                    <div className="w-8 h-1 bg-gray-600 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                    <span className="text-white font-semibold text-sm">In-call Chat</span>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1"><X size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                    {messages.length === 0 && <p className="text-gray-500 text-xs text-center mt-4">No messages yet</p>}
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.self ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-gray-500 mb-0.5">{m.senderName}</span>
                            <div className={`px-3 py-1.5 rounded-xl text-sm max-w-[85%] ${m.self ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                                {m.message}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
                <div className="p-3 border-t border-gray-700 flex gap-2 flex-shrink-0">
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Type a message..."
                        autoFocus
                        className="flex-1 bg-gray-800 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-500"
                    />
                    <button onClick={send} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 flex-shrink-0">
                        <Send size={16} />
                    </button>
                </div>
            </motion.div>
        </>
    )
}

// ─── Main Call Room ───────────────────────────────────────────────────────────
// role: 'patient' | 'doctor'
// Layout: remote peer always on the big screen, local always in PIP
export const CallRoom = ({ roomId, role, peerName, peerImage, onEndCall, backendUrl }) => {
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [callStatus, setCallStatus] = useState('Waiting for other participant...')
    const [isConnected, setIsConnected] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [chatMessages, setChatMessages] = useState([])
    const [unread, setUnread] = useState(0)
    const [hasRemote, setHasRemote] = useState(false)

    const socketRef = useRef(null)
    const peerRef = useRef(null)
    const localStreamRef = useRef(null)
    const screenStreamRef = useRef(null)
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)

    const myName = role === 'doctor' ? `Dr. ${peerName}` : 'You (Patient)'

    // Create RTCPeerConnection and wire up tracks + events
    const createPeer = useCallback((targetSocketId, stream, isOfferer) => {
        if (peerRef.current) {
            peerRef.current.close()
            peerRef.current = null
        }

        const pc = new RTCPeerConnection(ICE_SERVERS)
        peerRef.current = pc

        // Add ALL tracks (video + audio) from local stream
        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream)
        })

        pc.onicecandidate = ({ candidate }) => {
            if (candidate && socketRef.current) {
                socketRef.current.emit('signal', {
                    roomId,
                    to: targetSocketId,
                    signalData: { type: 'candidate', candidate }
                })
            }
        }

        pc.ontrack = (event) => {
            // Attach remote stream to the big video element
            const remoteStream = event.streams[0]
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream
                // Ensure audio plays — must not be muted
                remoteVideoRef.current.muted = false
                remoteVideoRef.current.volume = 1.0
            }
            setHasRemote(true)
            setIsConnected(true)
            setCallStatus('Connected')
        }

        pc.onconnectionstatechange = () => {
            const state = pc.connectionState
            if (state === 'connected') {
                setIsConnected(true)
                setCallStatus('Connected')
            } else if (state === 'disconnected' || state === 'failed') {
                setIsConnected(false)
                setCallStatus('Connection lost...')
            }
        }

        if (isOfferer) {
            pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            }).then(offer => {
                pc.setLocalDescription(offer)
                socketRef.current?.emit('signal', {
                    roomId,
                    to: targetSocketId,
                    signalData: offer
                })
            }).catch(err => console.error('Offer error:', err))
        }

        return pc
    }, [roomId])

    const handleSignal = useCallback(async ({ from, signalData }) => {
        try {
            if (signalData.type === 'offer') {
                const stream = localStreamRef.current
                if (!stream) return
                const pc = createPeer(from, stream, false)
                await pc.setRemoteDescription(new RTCSessionDescription(signalData))
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                socketRef.current?.emit('signal', { roomId, to: from, signalData: answer })

            } else if (signalData.type === 'answer') {
                if (peerRef.current?.signalingState === 'have-local-offer') {
                    await peerRef.current.setRemoteDescription(new RTCSessionDescription(signalData))
                }
            } else if (signalData.type === 'candidate') {
                if (peerRef.current?.remoteDescription) {
                    await peerRef.current.addIceCandidate(new RTCIceCandidate(signalData.candidate))
                }
            }
        } catch (err) {
            console.error('Signal handling error:', err)
        }
    }, [createPeer, roomId])

    useEffect(() => {
        let stream

        const init = async () => {
            // 1. Get camera + mic — audio: true is critical
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                    }
                })
            } catch (err) {
                console.error('Media error:', err)
                toast.error('Could not access camera/microphone. Please allow permissions and reload.')
                return
            }

            localStreamRef.current = stream

            // Show local preview (muted so no echo)
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
                localVideoRef.current.muted = true
            }

            // 2. Connect socket
            const socket = io(backendUrl, {
                transports: ['websocket'],
                reconnection: true
            })
            socketRef.current = socket

            socket.on('connect', () => {
                socket.emit('join-room', { roomId, userId: socket.id, role })
            })

            socket.on('room-info', ({ count }) => {
                if (count > 1) setCallStatus('Connecting...')
            })

            // When the other peer joins — we become the offerer
            socket.on('user-joined', ({ socketId }) => {
                setCallStatus('Connecting...')
                createPeer(socketId, stream, true)
            })

            socket.on('signal', handleSignal)

            socket.on('chat-message', (msg) => {
                setChatMessages(prev => [...prev, { ...msg, self: false }])
                setUnread(u => u + 1)
            })

            socket.on('call-ended', () => {
                toast.info('The other participant ended the call.')
                onEndCall()
            })

            socket.on('peer-disconnected', () => {
                setIsConnected(false)
                setHasRemote(false)
                setCallStatus('Participant disconnected. Waiting...')
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
            })
        }

        init()

        return () => {
            // Cleanup
            stream?.getTracks().forEach(t => t.stop())
            screenStreamRef.current?.getTracks().forEach(t => t.stop())
            socketRef.current?.emit('end-call', { roomId })
            socketRef.current?.disconnect()
            peerRef.current?.close()
        }
    }, []) // eslint-disable-line

    const toggleMute = () => {
        const track = localStreamRef.current?.getAudioTracks()[0]
        if (track) {
            track.enabled = !track.enabled
            setIsMuted(!isMuted)
        }
    }

    const toggleVideo = () => {
        const track = localStreamRef.current?.getVideoTracks()[0]
        if (track) {
            track.enabled = !track.enabled
            setIsVideoOff(!isVideoOff)
        }
    }

    const toggleScreenShare = async () => {
        if (!isSharing) {
            try {
                const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                screenStreamRef.current = screen
                const screenTrack = screen.getVideoTracks()[0]
                const sender = peerRef.current?.getSenders().find(s => s.track?.kind === 'video')
                if (sender) await sender.replaceTrack(screenTrack)
                if (localVideoRef.current) localVideoRef.current.srcObject = screen
                setIsSharing(true)
                screenTrack.onended = stopScreenShare
            } catch { toast.error('Screen share cancelled.') }
        } else {
            stopScreenShare()
        }
    }

    const stopScreenShare = async () => {
        screenStreamRef.current?.getTracks().forEach(t => t.stop())
        const camTrack = localStreamRef.current?.getVideoTracks()[0]
        const sender = peerRef.current?.getSenders().find(s => s.track?.kind === 'video')
        if (camTrack && sender) await sender.replaceTrack(camTrack)
        if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current
        setIsSharing(false)
    }

    const sendChat = (text) => {
        socketRef.current?.emit('chat-message', { roomId, message: text, senderName: myName, role })
        setChatMessages(prev => [...prev, { message: text, senderName: 'You', self: true }])
    }

    const handleEndCall = () => {
        socketRef.current?.emit('end-call', { roomId })
        onEndCall()
    }

    const label = role === 'doctor' ? 'Patient' : 'Doctor'

    return (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
            <div className="flex-1 relative overflow-hidden">

                {/* ── Remote video — MAIN BIG SCREEN ── */}
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    {/* Hidden audio element to ensure audio plays even if video is hidden */}
                    <video ref={remoteVideoRef} autoPlay playsInline
                        className={`w-full h-full object-cover ${hasRemote ? 'block' : 'hidden'}`}
                        style={{ background: '#111' }}
                    />
                    {!hasRemote && (
                        <div className="flex flex-col items-center gap-5">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full border-4 border-indigo-500/40 p-1 animate-pulse">
                                    <img
                                        src={peerImage || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'}
                                        className="w-full h-full rounded-full object-cover"
                                        alt=""
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1.5">
                                    <Loader2 className="animate-spin text-white" size={16} />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-white text-xl font-semibold">{callStatus}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {role === 'doctor' ? 'Waiting for patient to join...' : 'Waiting for doctor to join...'}
                                </p>
                                <p className="text-gray-600 text-xs mt-2 font-mono">Room: {roomId}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Local PIP — draggable ── */}
                <motion.div
                    drag
                    dragConstraints={{ left: -900, right: 0, top: 0, bottom: 500 }}
                    className="absolute top-4 left-4 sm:top-4 sm:right-4 sm:left-auto w-24 h-16 sm:w-44 sm:h-28 md:w-52 md:h-36 rounded-xl overflow-hidden border-2 border-gray-600 shadow-2xl cursor-move z-20 bg-gray-800"
                >
                    <video
                        ref={localVideoRef}
                        autoPlay muted playsInline
                        className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
                    />
                    {isVideoOff && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <VideoOff size={24} className="text-gray-500" />
                        </div>
                    )}
                    <div className="absolute bottom-1 left-2 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded">
                        {role === 'doctor' ? 'Doctor (You)' : 'You'}
                    </div>
                </motion.div>

                {/* ── Top bar ── */}
                <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
                    <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                        <CallTimer active={isConnected} />
                    </div>
                    {isConnected && (
                        <div className="bg-indigo-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-indigo-400/30">
                            <p className="text-xs text-white font-medium">{label}: {peerName}</p>
                        </div>
                    )}
                </div>

                {/* ── Chat panel ── */}
                <AnimatePresence>
                    {showChat && (
                        <ChatPanel
                            messages={chatMessages}
                            onSend={sendChat}
                            onClose={() => { setShowChat(false); setUnread(0) }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* ── Controls bar ── */}
            <div className="bg-gray-900 border-t border-gray-800 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2 sm:gap-4 flex-shrink-0">
                <button onClick={toggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                    className={`p-3 sm:p-3.5 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button onClick={toggleVideo}
                    title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                    className={`p-3 sm:p-3.5 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>

                {/* Screen share — hidden on mobile */}
                <button onClick={toggleScreenShare}
                    title={isSharing ? 'Stop sharing' : 'Share screen'}
                    className={`hidden sm:block p-3.5 rounded-full transition-all ${isSharing ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    {isSharing ? <MonitorOff size={22} /> : <Monitor size={22} />}
                </button>

                <button onClick={handleEndCall}
                    title="End call"
                    className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95">
                    <PhoneOff size={22} />
                </button>

                <button
                    onClick={() => { setShowChat(s => !s); setUnread(0) }}
                    title="Chat"
                    className={`relative p-3 sm:p-3.5 rounded-full transition-all ${showChat ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    <MessageSquare size={20} />
                    {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {unread}
                        </span>
                    )}
                </button>
            </div>
        </div>
    )
}

// ─── Feature Badge ────────────────────────────────────────────────────────────
const FeatureBadge = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
        <Icon size={12} />
        {label}
    </div>
)

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, value, label, color }) => (
    <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
            style={{ background: `${color}18` }}>
            <Icon size={18} style={{ color }} />
        </div>
        <span className="text-xl font-bold text-white">{value}</span>
        <span className="text-xs text-gray-400">{label}</span>
    </div>
)

// ─── How It Works Step ────────────────────────────────────────────────────────
const HowItWorksStep = ({ num, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="flex flex-col items-center text-center gap-3"
    >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white relative"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
            {num}
        </div>
        <div>
            <p className="font-semibold text-white text-sm">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
)

// ─── Schedule Modal ───────────────────────────────────────────────────────────
const ScheduleModal = ({ doc, onClose, backendUrl, token, navigate }) => {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [booking, setBooking] = useState(false)

    // Generate available slots (same logic as Appointment.jsx)
    useEffect(() => {
        const today = new Date()
        const allSlots = []
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)
            const endTime = new Date(currentDate)
            endTime.setHours(21, 0, 0, 0)
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }
            const timeSlots = []
            while (currentDate < endTime) {
                const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`
                const available = !(doc?.slots_booked?.[slotDate]?.includes(formattedTime))
                if (available) timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }
            if (timeSlots.length > 0) allSlots.push(timeSlots)
        }
        setDocSlots(allSlots)
    }, [doc])

    const handleBook = async () => {
        if (!token) { toast.warn('Please login to book a consultation'); onClose(); navigate('/login'); return }
        if (!slotTime) { toast.warn('Please select a time slot'); return }
        setBooking(true)
        try {
            const date = docSlots[slotIndex][0].datetime
            const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

            const { data } = await axios.post(`${backendUrl}/api/video-consult/book`, {
                docId: doc._id,
                docName: doc.name,
                docImage: doc.image,
                docSpeciality: doc.speciality,
                slotDate,
                slotTime
            }, { headers: { token } })

            if (data.success) {
                toast.success('Video consultation scheduled! Join from My Appointments.')
                onClose()
                navigate('/my-appointments')
            } else {
                toast.error(data.message || 'Booking failed')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Booking failed')
        } finally {
            setBooking(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="w-full max-w-lg rounded-3xl overflow-hidden"
                style={{ background: '#0d1b3e', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(99,102,241,0.2)' }}>
                            <Calendar size={18} style={{ color: '#a5b4fc' }} />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Schedule Video Consultation</p>
                            <p className="text-gray-400 text-xs">with {doc.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Doctor info strip */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <img src={doc.image} alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover object-top" />
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{doc.name}</p>
                            <p className="text-xs" style={{ color: '#a5b4fc' }}>{doc.speciality}</p>
                            <p className="text-xs text-gray-500">{doc.experience} experience</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-white font-bold text-sm">₹{doc.fees || 400}</p>
                            <p className="text-xs text-gray-500">per session</p>
                        </div>
                    </div>

                    {/* Day selector */}
                    <div>
                        <p className="text-gray-300 text-xs font-semibold mb-3 uppercase tracking-wider">Select Date</p>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {docSlots.map((daySlots, idx) => {
                                const d = daySlots[0].datetime
                                const isToday = idx === 0
                                return (
                                    <button key={idx}
                                        onClick={() => { setSlotIndex(idx); setSlotTime('') }}
                                        className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all text-xs font-semibold"
                                        style={slotIndex === idx
                                            ? { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }
                                            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }
                                        }
                                    >
                                        <span className="text-[10px] opacity-70">{daysOfWeek[d.getDay()]}</span>
                                        <span className="text-base font-bold">{d.getDate()}</span>
                                        {isToday && <span className="text-[9px] opacity-80">Today</span>}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Time slots */}
                    <div>
                        <p className="text-gray-300 text-xs font-semibold mb-3 uppercase tracking-wider">Select Time</p>
                        {docSlots[slotIndex]?.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                                {docSlots[slotIndex].map((slot, i) => (
                                    <button key={i}
                                        onClick={() => setSlotTime(slot.time)}
                                        className="py-2 px-1 rounded-xl text-xs font-semibold transition-all"
                                        style={slotTime === slot.time
                                            ? { background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.6)', color: '#a5b4fc' }
                                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }
                                        }
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">No slots available for this day</p>
                        )}
                    </div>

                    {/* Selected summary */}
                    {slotTime && docSlots[slotIndex] && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <CheckCircle size={14} style={{ color: '#22c55e' }} />
                            <p className="text-green-400 text-xs font-semibold">
                                Scheduled for {daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]}, {docSlots[slotIndex][0].datetime.getDate()} at {slotTime}
                            </p>
                        </div>
                    )}

                    {/* Book button */}
                    <button
                        onClick={handleBook}
                        disabled={booking || !slotTime}
                        className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: slotTime ? '0 4px 20px rgba(99,102,241,0.4)' : 'none' }}
                    >
                        {booking
                            ? <><Loader2 className="animate-spin" size={16} /> Scheduling...</>
                            : <><Video size={16} /> Confirm & Schedule</>
                        }
                    </button>
                    <p className="text-center text-gray-500 text-xs">
                        You can join the call from <span className="text-indigo-400 font-semibold">My Appointments</span> at the scheduled time
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

// ─── Patient: Doctor Selection Page ──────────────────────────────────────────
const VideoConsult = () => {
    const { doctors, backendUrl, token } = useContext(AppContext)
    const [searchParams] = useSearchParams()
    const [callState, setCallState] = useState(null)
    const [scheduleDoc, setScheduleDoc] = useState(null)
    const navigate = useNavigate()

    // Join via direct link (from MyAppointments "Join Video Consult" button)
    useEffect(() => {
        const roomId = searchParams.get('roomId')
        const doctorView = searchParams.get('doctorView') === 'true'
        if (roomId) {
            setCallState({
                roomId,
                role: doctorView ? 'doctor' : 'patient',
                peerName: doctorView ? 'Patient' : 'Doctor',
                peerImage: null
            })
        }
    }, [searchParams])

    if (callState) {
        return (
            <CallRoom
                roomId={callState.roomId}
                role={callState.role}
                peerName={callState.peerName}
                peerImage={callState.peerImage}
                backendUrl={backendUrl}
                onEndCall={() => setCallState(null)}
            />
        )
    }

    return (
        <div className="min-h-screen" style={{ background: '#0a0f1e' }}>

            {/* ── Schedule Modal ── */}
            <AnimatePresence>
                {scheduleDoc && (
                    <ScheduleModal
                        doc={scheduleDoc}
                        onClose={() => setScheduleDoc(null)}
                        backendUrl={backendUrl}
                        token={token}
                        navigate={navigate}
                    />
                )}
            </AnimatePresence>

            {/* ── Hero Section ── */}
            <div className="relative overflow-hidden">
                {/* Background glow blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Text content */}
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                VIDEO CONSULTATION
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                                Consult a Doctor<br />
                                From <span style={{ background: 'linear-gradient(135deg, #6366f1, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Anywhere</span>
                            </h1>
                            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
                                Connect with experienced doctors through secure video consultation from the comfort of your home.
                            </p>

                            {/* Feature pills */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                <FeatureBadge icon={Lock} label="Secure & Private" />
                                <FeatureBadge icon={Shield} label="Verified Doctors" />
                                <FeatureBadge icon={Video} label="HD Video Call" />
                                <FeatureBadge icon={Calendar} label="Easy Booking" />
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
                                >
                                    <Video size={16} />
                                    Book Video Consultation
                                    <ArrowRight size={14} />
                                </button>
                                <button
                                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                                >
                                    <Play size={14} />
                                    How It Works
                                </button>
                            </div>
                        </motion.div>

                        {/* Right: Mock video call card */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative rounded-3xl overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #1a1f35, #0f1628)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
                                {/* Fake video area */}
                                <div className="relative h-72 overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #1e2340 0%, #141929 100%)' }}>
                                    {/* Doctor silhouette placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-32 h-32 rounded-full flex items-center justify-center"
                                            style={{ background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.3)' }}>
                                            <Users size={48} style={{ color: 'rgba(99,102,241,0.6)' }} />
                                        </div>
                                    </div>
                                    {/* Glow overlay */}
                                    <div className="absolute inset-0"
                                        style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
                                    {/* PIP local video */}
                                    <div className="absolute top-3 right-3 w-20 h-14 rounded-xl overflow-hidden"
                                        style={{ background: '#1a2035', border: '1.5px solid rgba(255,255,255,0.15)' }}>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Video size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                                        </div>
                                    </div>
                                    {/* Status bar */}
                                    <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full"
                                        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-white text-xs font-mono">00:04:32</span>
                                    </div>
                                </div>
                                {/* Controls bar */}
                                <div className="flex items-center justify-center gap-3 px-6 py-4"
                                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    {[
                                        { icon: Mic, active: true, color: '#6b7280' },
                                        { icon: Video, active: true, color: '#6b7280' },
                                        { icon: MessageSquare, active: false, color: '#6b7280' },
                                        { icon: PhoneOff, active: false, color: '#ef4444', bg: '#ef4444' },
                                    ].map(({ icon: Icon, color, bg }, i) => (
                                        <div key={i}
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ background: bg ? `${bg}22` : 'rgba(255,255,255,0.08)', border: `1px solid ${bg ? bg + '44' : 'rgba(255,255,255,0.1)'}` }}>
                                            <Icon size={16} style={{ color: bg || color }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-2xl flex items-center gap-2"
                                style={{ background: '#0d1b2e', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(34,197,94,0.15)' }}>
                                    <CheckCircle size={16} style={{ color: '#22c55e' }} />
                                </div>
                                <div>
                                    <p className="text-white text-xs font-semibold">Doctor Connected</p>
                                    <p className="text-gray-400 text-[10px]">Secure end-to-end encrypted</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                >
                    <StatCard icon={Users} value="500+" label="Verified Doctors" color="#6366f1" />
                    <StatCard icon={Clock} value="15-20" label="Mins per Session" color="#00d4ff" />
                    <StatCard icon={IndianRupee} value="₹400" label="Consultation Fee" color="#22c55e" />
                    <StatCard icon={Star} value="4.9★" label="Patient Rating" color="#f59e0b" />
                </motion.div>
            </div>

            {/* ── How It Works ── */}
            <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="rounded-3xl p-8"
                    style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
                >
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #6366f1, #00d4ff)' }} />
                        <h2 className="text-lg font-bold text-white">How It Works</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-start">
                        {[
                            { title: 'Choose Doctor', desc: 'Browse verified specialists' },
                            { title: 'Pick a Slot', desc: 'Select date & time' },
                            { title: 'Confirm Booking', desc: 'Schedule your session' },
                            { title: 'Join at Time', desc: 'From My Appointments' },
                            { title: 'Consultation', desc: 'Get expert advice' },
                        ].map((step, i) => (
                            <React.Fragment key={i}>
                                <HowItWorksStep num={i + 1} title={step.title} desc={step.desc} delay={0.4 + i * 0.07} />
                                {i < 4 && (
                                    <div className="hidden sm:flex items-center justify-center mt-6">
                                        <ChevronRight size={16} style={{ color: 'rgba(99,102,241,0.4)' }} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── What You Get ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-8">
                <div className="grid sm:grid-cols-3 gap-4">
                    {[
                        { icon: Clock, title: 'Flexible Scheduling', desc: 'Book your slot for today or the next 7 days at a time that suits you.', cta: 'View Slots', color: '#6366f1' },
                        { icon: IndianRupee, title: 'Consultation Fee', desc: '₹400 for 15–20 mins with a specialist doctor.', cta: null, color: '#00d4ff' },
                        { icon: Shield, title: 'You Will Get', desc: 'Prescription, advice, report sharing & follow-up support.', cta: null, color: '#22c55e' },
                    ].map(({ icon: Icon, title, desc, cta, color }, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.08 }}
                            className="rounded-2xl p-5 flex items-start gap-4"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${color}18` }}>
                                <Icon size={22} style={{ color }} />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm mb-1">{title}</p>
                                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                                {cta && (
                                    <button
                                        onClick={() => document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="mt-2 flex items-center gap-1 text-xs font-semibold transition-all hover:gap-2"
                                        style={{ color }}
                                    >
                                        {cta} <ArrowRight size={12} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── Doctors Grid ── */}
            <div id="doctors-section" className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #6366f1, #00d4ff)' }} />
                        <h2 className="text-lg font-bold text-white">Available Doctors</h2>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                            {doctors.length} Online
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Zap size={12} style={{ color: '#f59e0b' }} />
                        Instant connection
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {doctors.map((doc, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.04 }}
                            className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.35)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(99,102,241,0.15)' }}
                            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)' }}
                        >
                            {/* Doctor image */}
                            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1f35, #0f1628)', aspectRatio: '4/3' }}>
                                <img
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    src={doc.image} alt={doc.name}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.7) 0%, transparent 50%)' }} />
                                {/* Available badge */}
                                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                    style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', backdropFilter: 'blur(8px)' }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Available
                                </div>
                                {/* Fee badge */}
                                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
                                    style={{ background: 'rgba(0,0,0,0.6)', color: '#a5b4fc', backdropFilter: 'blur(8px)' }}>
                                    ₹{doc.fees || 400}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <p className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{doc.name}</p>
                                <p className="text-xs mt-0.5 mb-0.5" style={{ color: '#a5b4fc' }}>{doc.speciality}</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs text-gray-500">{doc.experience} exp.</span>
                                    <span className="flex items-center gap-0.5 text-xs" style={{ color: '#f59e0b' }}>
                                        <Star size={10} fill="#f59e0b" /> 4.8
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!token) { toast.warn('Please login to book a consultation'); navigate('/login'); return }
                                        setScheduleDoc(doc)
                                    }}
                                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm text-white transition-all hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
                                >
                                    <Calendar size={15} /> Schedule Consult
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── Need Help Banner ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(14,165,233,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(99,102,241,0.2)' }}>
                            <MessageSquare size={22} style={{ color: '#a5b4fc' }} />
                        </div>
                        <div>
                            <p className="font-bold text-white">Need Help?</p>
                            <p className="text-gray-400 text-sm">Our support team is always here to help you.</p>
                        </div>
                    </div>
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 whitespace-nowrap"
                        style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)' }}
                    >
                        Contact Support <ArrowRight size={14} />
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default VideoConsult
