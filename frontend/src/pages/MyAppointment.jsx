import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Video, CreditCard, X, Clock, MapPin, CheckCircle, ExternalLink, Star, RefreshCw, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReviewModal from '../components/ReviewModal'
import RescheduleModal from '../components/RescheduleModal'
import ConfirmDialog from '../components/ConfirmDialog'

/* ── colour tokens ── */
const bg      = 'bg-[#0f1629]'
const border  = 'border-[#1e2d4a]'
const textPri = 'text-gray-100'
const textSec = 'text-gray-400'

const StatusBadge = ({ item }) => {
  if (item.cancelled)   return <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20'><X size={11} /> Cancelled</span>
  if (item.isCompleted) return <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20'><CheckCircle size={11} /> Completed</span>
  if (item.payment)     return <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20'><CreditCard size={11} /> Paid</span>
  return <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20'><Clock size={11} /> Pending</span>
}

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData, userData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewAppt, setReviewAppt] = useState(null)
  const [rescheduleAppt, setRescheduleAppt] = useState(null)
  const [reviewed, setReviewed] = useState({})
  const [cancelTarget, setCancelTarget] = useState(null)
  const navigate = useNavigate()

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/appointments', {}, { headers: { token } })
      if (data.success) {
        const appts = data.appointments.reverse()
        setAppointments(appts)
        const reviewChecks = await Promise.all(
          appts.filter(a => a.isCompleted).map(a =>
            axios.get(backendUrl + `/api/reviews/check/${a._id}`)
              .then(r => ({ id: a._id, reviewed: r.data.reviewed }))
              .catch(() => ({ id: a._id, reviewed: false }))
          )
        )
        const reviewMap = {}
        reviewChecks.forEach(r => { reviewMap[r.id] = r.reviewed })
        setReviewed(reviewMap)
      }
    } catch (error) { toast.error(error.message) }
    finally { setLoading(false) }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) { toast.success(data.message); getUserAppointments(); getDoctorsData() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const initPay = async (order, appointmentId) => {
    if (!order || !order.id) { toast.error('Invalid order data received from server'); return }

    const loaded = await loadRazorpayScript()
    if (!loaded) { toast.error('Failed to load Razorpay. Check your internet connection.'); return }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'MediNexus AI',
      description: 'Doctor Appointment Payment',
      image: '/logo.svg',
      order_id: order.id,
      handler: async (response) => {
        // Send all three Razorpay response fields for proper HMAC verification
        await verifyRazorpay({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          appointmentId,
        })
      },
      prefill: {
        name: userData?.name || '',
        email: userData?.email || '',
        contact: userData?.phone || '',
      },
      theme: { color: '#06b6d4' },
      modal: {
        ondismiss: () => toast.info('Payment cancelled'),
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      toast.error(`Payment failed: ${response.error.description}`)
    })
    rzp.open()
  }

  const verifyRazorpay = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId }) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/verify-razorpay',
        { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId },
        { headers: { token } }
      )
      if (data.success) { toast.success('Payment Successful! 🎉'); getUserAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      if (data.success) initPay(data.order, appointmentId)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to initiate payment')
    }
  }

  useEffect(() => { if (token) getUserAppointments() }, [token])

  return (
    <div className='pb-16 pt-6'>
      {/* Header */}
      <div className='mb-8'>
        <span className='inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'>
          My Health
        </span>
        <h1 className={`text-3xl font-bold ${textPri}`}>My Appointments</h1>
        <p className={`text-sm mt-1 ${textSec}`}>{appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found</p>
      </div>

      {loading ? (
        <div className='space-y-4'>
          {[1, 2, 3].map(i => (
            <div key={i} className={`rounded-2xl border p-5 animate-pulse ${bg} ${border}`}>
              <div className='flex gap-4'>
                <div className='w-24 h-24 rounded-xl bg-[#1e2d4a]' />
                <div className='flex-1 space-y-2.5'>
                  <div className='h-4 rounded w-1/3 bg-[#1e2d4a]' />
                  <div className='h-3 rounded w-1/4 bg-[#1e2d4a]' />
                  <div className='h-3 rounded w-1/2 bg-[#1e2d4a]' />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : appointments.length > 0 ? (
        <div className='space-y-4'>
          <AnimatePresence>
            {appointments.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/20 hover:border-cyan-500/30 ${bg} ${border}`}
              >
                <div className='flex flex-col sm:flex-row gap-0'>
                  {/* Doctor image */}
                  <div className='sm:w-36 flex-shrink-0 bg-[#0d1b3e]'>
                    <img className='w-full h-36 sm:h-full object-cover object-center' src={item.docData?.image} alt={item.docData?.name} />
                  </div>

                  {/* Details */}
                  <div className='flex-1 p-5 flex flex-col sm:flex-row gap-4'>
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-start justify-between gap-2 flex-wrap'>
                        <div>
                          <p className={`font-bold text-base ${textPri}`}>{item.docData?.name}</p>
                          <p className='text-cyan-400 text-sm font-medium'>{item.docData?.speciality}</p>
                        </div>
                        <StatusBadge item={item} />
                      </div>

                      <div className={`flex flex-wrap gap-x-4 gap-y-1.5 text-xs ${textSec}`}>
                        <span className='flex items-center gap-1.5'>
                          <Calendar size={12} className='text-cyan-400' />
                          {item?.slotDate?.split('_').join('/')} at {item?.slotTime}
                        </span>
                        {item?.isVideoConsult ? (
                          <span className='flex items-center gap-1.5 text-green-400 font-semibold'>
                            <Video size={12} /> Virtual Consult
                          </span>
                        ) : (
                          <span className='flex items-center gap-1.5'>
                            <MapPin size={12} className='text-cyan-400' />
                            {item?.docData?.address?.line1}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='flex flex-row sm:flex-col gap-2 justify-start sm:justify-center sm:min-w-[160px] flex-wrap'>
                      {!item.cancelled && !item.isCompleted && (
                        <>
                          {item.payment ? (
                            <div className='text-center text-xs font-bold py-2 px-4 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20'>
                              ✓ Paid
                            </div>
                          ) : (
                            <button
                              onClick={() => appointmentRazorpay(item._id)}
                              className='flex items-center justify-center gap-1.5 text-xs font-bold py-3 sm:py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-indigo-600 transition-all shadow-sm'
                            >
                              <CreditCard size={13} /> Pay Now
                            </button>
                          )}
                          {item.isVideoConsult && item.roomId && (
                            <button
                              onClick={() => navigate(`/video-consult?roomId=${item.roomId}`)}
                              className='flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white transition-all'
                            >
                              <Video size={13} /> Join Now
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/chat/${item._id}`)}
                            className='flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all'
                          >
                            <MessageCircle size={13} /> Message
                          </button>
                          <button
                            onClick={() => setRescheduleAppt(item)}
                            className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-3 sm:py-2.5 px-4 rounded-xl border transition-all hover:bg-indigo-500 hover:text-white hover:border-indigo-500 border-[#1e2d4a] ${textSec}`}
                          >
                            <RefreshCw size={13} /> Reschedule
                          </button>
                          <button
                            onClick={() => setCancelTarget(item._id)}
                            className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-3 sm:py-2.5 px-4 rounded-xl border transition-all hover:bg-red-500 hover:text-white hover:border-red-500 border-[#1e2d4a] ${textSec}`}
                          >
                            <X size={13} /> Cancel
                          </button>
                        </>
                      )}

                      {item.isCompleted && (
                        <div className='flex flex-col gap-2'>
                          <div className='text-center text-xs font-bold py-2 px-4 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20'>
                            ✓ Completed
                          </div>
                          {!reviewed[item._id] && (
                            <button
                              onClick={() => setReviewAppt(item)}
                              className='flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-400 hover:text-black transition-all'
                            >
                              <Star size={13} /> Rate
                            </button>
                          )}
                          {reviewed[item._id] && (
                            <div className='text-center text-xs font-bold py-2 px-4 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'>
                              ⭐ Reviewed
                            </div>
                          )}
                          <button
                            onClick={() => navigate(`/chat/${item._id}`)}
                            className='flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all'
                          >
                            <MessageCircle size={13} /> Message
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col items-center justify-center py-24 gap-5'>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${bg} border ${border}`}>
            📅
          </div>
          <div className='text-center'>
            <p className={`font-bold text-lg ${textPri}`}>No appointments yet</p>
            <p className={`text-sm mt-1 ${textSec}`}>Book your first consultation with a specialist</p>
          </div>
          <button
            onClick={() => navigate('/doctors')}
            className='flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-indigo-900/30 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all text-sm'
          >
            <Calendar size={16} /> Find a Doctor
          </button>
        </motion.div>
      )}

      {reviewAppt && (
        <ReviewModal appointment={reviewAppt} onClose={() => setReviewAppt(null)} onSubmitted={() => { getUserAppointments() }} />
      )}
      {rescheduleAppt && (
        <RescheduleModal appointment={rescheduleAppt} onClose={() => setRescheduleAppt(null)} onRescheduled={() => { getUserAppointments(); getDoctorsData() }} />
      )}
      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Appointment?"
        message="This will cancel your appointment. This action cannot be undone."
        confirmLabel="Yes, Cancel"
        confirmColor="#ef4444"
        onCancel={() => setCancelTarget(null)}
        onConfirm={() => { cancelAppointment(cancelTarget); setCancelTarget(null) }}
      />
    </div>
  )
}

export default MyAppointment
