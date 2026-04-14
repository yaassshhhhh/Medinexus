import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const ReviewModal = ({ appointment, onClose, onSubmitted }) => {
    const { backendUrl, token } = useContext(AppContext)
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

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
                toast.success('Review submitted!')
                onSubmitted?.()
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
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Rate your experience</h3>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                            <X size={18} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mb-5 p-3 bg-indigo-50 rounded-xl">
                        <img src={appointment.docData?.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                        <div>
                            <p className="font-semibold text-sm text-gray-900">{appointment.docData?.name}</p>
                            <p className="text-xs text-gray-500">{appointment.docData?.speciality}</p>
                        </div>
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center gap-2 mb-5">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={36}
                                    className={`transition-colors ${(hover || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-500 mb-4">
                        {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : rating === 5 ? 'Excellent' : 'Select a rating'}
                    </p>

                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Share your experience (optional)..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-4"
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !rating}
                        className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default ReviewModal
