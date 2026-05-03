import React, { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const TIME_SLOTS = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
]

const RescheduleModal = ({ appointment, onClose, onRescheduled }) => {
    const { backendUrl, token } = useContext(AppContext)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    // Build next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i + 1)
        return d
    })

    const toSlotDate = (date) =>
        `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

    const handleReschedule = async () => {
        if (!selectedDate || !selectedTime) return toast.error('Please select a date and time')
        setLoading(true)
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/reschedule-appointment',
                { appointmentId: appointment._id, newSlotDate: selectedDate, newSlotTime: selectedTime },
                { headers: { token } }
            )
            if (data.success) {
                setDone(true)
                setTimeout(() => {
                    onRescheduled?.()
                    onClose()
                }, 1400)
            } else {
                toast.error(data.message)
            }
        } catch (e) {
            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10" style={{ background: '#0f1629', borderBottom: '1px solid #1e2d4a' }}>
                        <h3 className="text-base font-bold text-white">Reschedule Appointment</h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {done ? (
                                /* ── Success state ── */
                                <motion.div
                                    key="done"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center py-10 gap-3"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                                        className="w-16 h-16 rounded-full flex items-center justify-center"
                                        style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
                                    >
                                        <CheckCircle size={32} className="text-green-400" />
                                    </motion.div>
                                    <p className="text-white font-bold text-lg">Rescheduled!</p>
                                    <p className="text-gray-400 text-sm text-center">
                                        Your appointment has been moved to {selectedDate?.split('_').join('/')} at {selectedTime}.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {/* Current appointment info */}
                                    <div
                                        className="flex items-center gap-3 mb-5 p-3 rounded-xl"
                                        style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
                                    >
                                        <img
                                            src={appointment.docData?.image}
                                            className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                                            alt=""
                                        />
                                        <div>
                                            <p className="font-semibold text-sm text-white">{appointment.docData?.name}</p>
                                            <p className="text-xs text-gray-400">
                                                Current: {appointment.slotDate?.split('_').join('/')} at {appointment.slotTime}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Date picker */}
                                    <div className="mb-5">
                                        <p className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
                                            <Calendar size={14} className="text-cyan-400" /> Select New Date
                                        </p>
                                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                            {dates.map(d => {
                                                const slot = toSlotDate(d)
                                                const isSelected = selectedDate === slot
                                                return (
                                                    <motion.button
                                                        key={slot}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => { setSelectedDate(slot); setSelectedTime('') }}
                                                        className="flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                                                        style={{
                                                            background: isSelected ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                                                            borderColor: isSelected ? '#00d4ff' : '#1e2d4a',
                                                            color: isSelected ? '#00d4ff' : '#9ca3af',
                                                            boxShadow: isSelected ? '0 0 12px rgba(0,212,255,0.2)' : 'none',
                                                        }}
                                                    >
                                                        <span className="text-xs opacity-70">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
                                                        <span className="font-bold text-base">{d.getDate()}</span>
                                                        <span className="text-xs opacity-70">{d.toLocaleDateString('en', { month: 'short' })}</span>
                                                    </motion.button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Time picker */}
                                    <AnimatePresence>
                                        {selectedDate && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mb-5 overflow-hidden"
                                            >
                                                <p className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-1.5">
                                                    <Clock size={14} className="text-cyan-400" /> Select Time
                                                </p>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {TIME_SLOTS.map(t => (
                                                        <motion.button
                                                            key={t}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => setSelectedTime(t)}
                                                            className="py-2 px-1 rounded-xl border text-xs font-medium transition-all"
                                                            style={{
                                                                background: selectedTime === t ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
                                                                borderColor: selectedTime === t ? '#00d4ff' : '#1e2d4a',
                                                                color: selectedTime === t ? '#00d4ff' : '#9ca3af',
                                                            }}
                                                        >
                                                            {t}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Confirm button */}
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleReschedule}
                                        disabled={loading || !selectedDate || !selectedTime}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                                        style={{
                                            background: selectedDate && selectedTime
                                                ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
                                                : 'rgba(255,255,255,0.06)',
                                            color: selectedDate && selectedTime ? 'white' : '#6b7280',
                                            boxShadow: selectedDate && selectedTime ? '0 4px 20px rgba(14,165,233,0.3)' : 'none',
                                        }}
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={15} />}
                                        {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default RescheduleModal
