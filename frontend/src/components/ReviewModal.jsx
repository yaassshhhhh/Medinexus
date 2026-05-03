import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, CheckCircle, Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

const ReviewModal = ({ appointment, onClose, onSubmitted }) => {
    const { backendUrl, token } = useContext(AppContext)
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const handleSubmit = async () => {
        if (!rating) return toast.error('Please select a rating')
        setLoading(true)
        try {
            const { data } = await axios.post(
                backendUrl + '/api/reviews/submit',
                { appointmentId: appointment._id, rating, comment },
                { headers: { token } }
            )
            if (data.success) {
                setDone(true)
                setTimeout(() => {
                    onSubmitted?.()
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
                    className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                    style={{ background: '#0f1629', border: '1px solid #1e2d4a' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #1e2d4a' }}>
                        <h3 className="text-base font-bold text-white">Rate Your Experience</h3>
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
                                    className="flex flex-col items-center py-8 gap-3"
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
                                    <p className="text-white font-bold text-lg">Thank You!</p>
                                    <p className="text-gray-400 text-sm text-center">Your review has been submitted successfully.</p>
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {/* Doctor info */}
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
                                            <p className="text-xs text-cyan-400">{appointment.docData?.speciality}</p>
                                        </div>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex justify-center gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <motion.button
                                                key={star}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                            >
                                                <Star
                                                    size={38}
                                                    className={`transition-colors duration-150 ${
                                                        (hover || rating) >= star
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-600'
                                                    }`}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>

                                    {/* Label */}
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={hover || rating}
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center text-sm font-semibold mb-4 h-5"
                                            style={{ color: rating || hover ? '#facc15' : '#6b7280' }}
                                        >
                                            {LABELS[hover || rating] || 'Select a rating'}
                                        </motion.p>
                                    </AnimatePresence>

                                    {/* Comment */}
                                    <textarea
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        maxLength={300}
                                        placeholder="Share your experience (optional)..."
                                        rows={3}
                                        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 resize-none transition-all mb-1"
                                        style={{ background: '#0d1b3e', border: '1px solid #1e2d4a', color: '#e5e7eb' }}
                                    />
                                    <p className="text-right text-xs text-gray-500 mb-4">{comment.length}/300</p>

                                    {/* Submit */}
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleSubmit}
                                        disabled={loading || !rating}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                                        style={{
                                            background: rating ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'rgba(255,255,255,0.06)',
                                            color: rating ? 'white' : '#6b7280',
                                            boxShadow: rating ? '0 4px 20px rgba(14,165,233,0.3)' : 'none',
                                        }}
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Star size={15} />}
                                        {loading ? 'Submitting...' : 'Submit Review'}
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

export default ReviewModal
