import React, { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Video, Mic, MicOff, VideoOff, PhoneOff,
    MessageSquare, X, Send, Monitor, MonitorOff,
    Loader2, ChevronRight
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'
import { useSearchParams } from 'react-router-dom'
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
        <motion.div
            initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-72 bg-gray-900/95 backdrop-blur-md border-l border-gray-700 flex flex-col z-30"
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <span className="text-white font-semibold text-sm">In-call Chat</span>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
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
            <div className="p-3 border-t border-gray-700 flex gap-2">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-500"
                />
                <button onClick={send} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                    <Send size={16} />
                </button>
            </div>
        </motion.div>
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
                    className="absolute top-4 right-4 w-44 h-28 sm:w-52 sm:h-36 rounded-xl overflow-hidden border-2 border-gray-600 shadow-2xl cursor-move z-20 bg-gray-800"
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
            <div className="bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-center gap-4 flex-shrink-0">
                <button onClick={toggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                    className={`p-3.5 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                <button onClick={toggleVideo}
                    title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                    className={`p-3.5 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                </button>

                <button onClick={toggleScreenShare}
                    title={isSharing ? 'Stop sharing' : 'Share screen'}
                    className={`p-3.5 rounded-full transition-all ${isSharing ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    {isSharing ? <MonitorOff size={22} /> : <Monitor size={22} />}
                </button>

                <button onClick={handleEndCall}
                    title="End call"
                    className="px-8 py-3.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95">
                    <PhoneOff size={24} />
                </button>

                <button
                    onClick={() => { setShowChat(s => !s); setUnread(0) }}
                    title="Chat"
                    className={`relative p-3.5 rounded-full transition-all ${showChat ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                    <MessageSquare size={22} />
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

// ─── Patient: Doctor Selection Page ──────────────────────────────────────────
const VideoConsult = () => {
    const { doctors, backendUrl, token, userData } = useContext(AppContext)
    const [searchParams] = useSearchParams()
    const [callState, setCallState] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingDocId, setLoadingDocId] = useState(null)

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

    const handleStartCall = async (doc) => {
        if (!token) { toast.error('Please login to start a consultation.'); return }
        setLoading(true)
        setLoadingDocId(doc._id)
        try {
            const now = new Date()
            const slotDate = `${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}`
            const slotTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

            const { data } = await axios.post(`${backendUrl}/api/video-consult/book`, {
                userId: userData?._id || 'guest_' + Date.now(),
                docId: doc._id,
                docName: doc.name,
                docImage: doc.image,
                docSpeciality: doc.speciality,
                slotDate,
                slotTime
            })

            if (data.success) {
                toast.success('Consultation booked! Connecting...')
                setCallState({
                    roomId: data.roomId,
                    role: 'patient',
                    peerName: doc.name,
                    peerImage: doc.image
                })
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message || 'Failed to book consultation.')
        } finally {
            setLoading(false)
            setLoadingDocId(null)
        }
    }

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
        <div className="pt-10 min-h-screen">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-3">
                        Instant Video Consultation
                    </h1>
                    <p className="text-gray-500">Connect with top specialists from the comfort of your home.</p>
                    <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1.5"><Video size={14} className="text-primary" /> HD Video</span>
                        <span className="flex items-center gap-1.5"><Monitor size={14} className="text-primary" /> Screen Share</span>
                        <span className="flex items-center gap-1.5"><MessageSquare size={14} className="text-primary" /> In-call Chat</span>
                    </div>
                </div>

                {/* How it works */}
                <div className="bg-indigo-50 rounded-2xl p-5 mb-8 max-w-2xl mx-auto">
                    <p className="text-sm font-semibold text-indigo-800 mb-3">How it works</p>
                    <div className="flex items-center gap-2 text-sm text-indigo-700 flex-wrap">
                        {['Choose a doctor', 'Click Consult Now', 'Allow camera & mic', 'Doctor joins the room', 'Start your consultation'].map((step, i, arr) => (
                            <React.Fragment key={i}>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{i + 1}</span>
                                    {step}
                                </span>
                                {i < arr.length - 1 && <ChevronRight size={14} className="text-indigo-400" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3 sm:px-0">
                    {doctors.map((doc, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border border-indigo-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="relative bg-indigo-50 overflow-hidden aspect-[3/4]">
                                <img className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    src={doc.image} alt={doc.name} />
                                <div className="absolute bottom-3 right-3 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Available
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{doc.name}</p>
                                <p className="text-sm text-gray-500 mb-1">{doc.speciality}</p>
                                <p className="text-xs text-gray-400 mb-3">{doc.experience} experience</p>
                                <button
                                    onClick={() => handleStartCall(doc)}
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all font-semibold text-sm disabled:opacity-60"
                                >
                                    {loading && loadingDocId === doc._id
                                        ? <><Loader2 className="animate-spin" size={16} /> Connecting...</>
                                        : <><Video size={16} /> Consult Now</>
                                    }
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default VideoConsult
