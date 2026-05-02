import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Video, Clock, User, LogIn, Calendar, ChevronRight, RefreshCw, CheckCircle, IndianRupee, X } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { CallRoom } from './VideoConsult'

/* ── colour tokens ── */
const card   = 'bg-[#0f1629] border border-[#1e2d4a]'
const inner  = 'bg-[#0d1b3e] border border-[#1e2d4a]'
const tPri   = 'text-gray-100'
const tSec   = 'text-gray-400'
const inputCls = `w-full border border-[#1e2d4a] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500
  bg-[#0d1b3e] text-gray-100 placeholder-gray-500 transition-all`

const DoctorPortal = () => {
  const { backendUrl } = useContext(AppContext)
  const [step, setStep] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [doctor, setDoctor] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [callState, setCallState] = useState(null)
  const [activeTab, setActiveTab] = useState('upcoming')

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

  const loadAppointments = async (token) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/appointments`, {}, { headers: { dtoken: token } })
      if (data.success) setAppointments(data.appointments)
    } catch { toast.error('Failed to load appointments') }
  }

  const loadEarnings = async (token) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/earnings`, {}, { headers: { dtoken: token } })
      if (data.success) setEarnings(data)
    } catch { }
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
    setCallState({ roomId: appt.roomId, peerName: appt.userData?.name || 'Patient', peerImage: appt.userData?.image || null })
    setStep('call')
  }

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

  /* ── Login screen ── */
  if (step === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-8 w-full max-w-md ${card}`}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Video size={28} className="text-cyan-400" />
            </div>
            <h2 className={`text-2xl font-bold ${tPri}`}>Doctor Portal</h2>
            <p className={`text-sm mt-1 ${tSec}`}>Sign in to manage your consultations</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-amber-400">
            🔑 Default password: <span className="font-mono font-bold">12345678</span>
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
              {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  /* ── Dashboard ── */
  const today = new Date()
  const todaySlot = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`
  const upcoming  = appointments.filter(a => !a.cancelled && !a.isCompleted)
  const completed = appointments.filter(a => a.isCompleted)
  const cancelled = appointments.filter(a => a.cancelled)
  const tabData   = { upcoming, completed, cancelled }
  const displayed = tabData[activeTab] || []

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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',     value: appointments.length,                                          icon: Calendar,    color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
            { label: "Today's",  value: appointments.filter(a => a.slotDate === todaySlot).length,    icon: Clock,       color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20'   },
            { label: 'Patients',  value: new Set(appointments.map(a => a.userId)).size,               icon: User,        color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
            { label: 'Earnings',  value: `₹${earnings?.totalEarnings || 0}`,                          icon: IndianRupee, color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20'   },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`rounded-2xl p-4 text-center border ${bg}`}>
              <Icon size={20} className={`${color} mx-auto mb-1`} />
              <p className={`text-xl font-bold ${tPri}`}>{value}</p>
              <p className={`text-xs font-medium ${tSec}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 border-b border-[#1e2d4a] pb-1">
          {['upcoming', 'completed', 'cancelled'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500 text-black'
                  : `${tSec} hover:text-cyan-400`
              }`}>
              {tab} ({tabData[tab]?.length || 0})
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {displayed.length === 0 ? (
          <div className={`text-center py-16 ${tSec}`}>
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p>No {activeTab} appointments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((appt, i) => {
              const isToday = appt.slotDate === todaySlot
              return (
                <motion.div key={appt._id || i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-blue-900/20 ${
                    isToday ? 'bg-cyan-500/5 border-cyan-500/20' : `${card}`
                  }`}
                >
                  <img
                    src={appt.userData?.image || 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#1e2d4a] flex-shrink-0"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${tPri}`}>{appt.userData?.name || 'Patient'}</p>
                    <p className={`text-sm ${tSec}`}>
                      {appt.slotDate?.split('_').join('/')} at {appt.slotTime}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {isToday && <span className="text-xs bg-green-500/10 text-green-400 font-bold px-2 py-0.5 rounded-full border border-green-500/20">Today</span>}
                      {appt.isVideoConsult && <span className="text-xs bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/20">📹 Video</span>}
                      {appt.payment && <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">✓ Paid ₹{appt.amount}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {activeTab === 'upcoming' && (
                      <>
                        {appt.isVideoConsult && appt.roomId && (
                          <button onClick={() => joinCall(appt)}
                            className="flex items-center gap-1.5 bg-cyan-500 text-black text-xs px-3 py-2 rounded-xl hover:bg-cyan-400 transition-all font-semibold">
                            <Video size={13} /> Join <ChevronRight size={12} />
                          </button>
                        )}
                        <button onClick={() => markComplete(appt._id)}
                          className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-3 py-2 rounded-xl hover:bg-green-500 hover:text-black transition-all font-semibold">
                          <CheckCircle size={13} /> Complete
                        </button>
                      </>
                    )}
                    {activeTab === 'completed' && (
                      <span className="text-xs bg-green-500/10 text-green-400 font-bold px-3 py-2 rounded-xl border border-green-500/20">✓ Done</span>
                    )}
                    {activeTab === 'cancelled' && (
                      <span className="text-xs bg-red-500/10 text-red-400 font-bold px-3 py-2 rounded-xl border border-red-500/20 flex items-center gap-1"><X size={11} /> Cancelled</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DoctorPortal
