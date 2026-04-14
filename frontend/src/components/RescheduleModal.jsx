import React, { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock } from 'lucide-react'
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
                toast.success('Appointment rescheduled!')
                onRescheduled?.()
                onClose()
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Reschedule Appointment</h3>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mb-5 p-3 bg-indigo-50 rounded-xl">
                        <img src={appointment.docData?.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                        <div>
                            <p className="font-semibold text-sm text-gray-900">{appointment.docData?.name}</p>
                            <p className="text-xs text-gray-500">Current: {appointment.slotDate?.split('_').join('/')} at {appointment.slotTime}</p>
                        </div>
                    </div>

                    {/* Date picker */}
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                            <Calendar size={14} /> Select New Date
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {dates.map(d => {
                                const slot = toSlotDate(d)
                                const isSelected = selectedDate === slot
                                return (
                                    <button
                                        key={slot}
                                        onClick={() => { setSelectedDate(slot); setSelectedTime('') }}
                                        className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                            isSelected ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-700 hover:border-primary/40'
                                        }`}
                                    >
                                        <span className="text-xs opacity-70">{d.toLocaleDateString('en', { weekday: 'short' })}</span>
                                        <span className="font-bold">{d.getDate()}</span>
                                        <span className="text-xs opacity-70">{d.toLocaleDateString('en', { month: 'short' })}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Time picker */}
                    {selectedDate && (
                        <div className="mb-5">
                            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                <Clock size={14} /> Select Time
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                {TIME_SLOTS.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setSelectedTime(t)}
                                        className={`py-2 px-1 rounded-xl border text-xs font-medium transition-all ${
                                            selectedTime === t ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-700 hover:border-primary/40'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleReschedule}
                        disabled={loading || !selectedDate || !selectedTime}
                        className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default RescheduleModal
