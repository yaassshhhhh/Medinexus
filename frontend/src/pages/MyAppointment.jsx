import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Video, CreditCard, X, Clock, MapPin, CheckCircle, ExternalLink, Star, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReviewModal from '../components/ReviewModal'
import RescheduleModal from '../components/RescheduleModal'

const StatusBadge = ({ item }) => {
  if (item.cancelled) return <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100'><X size={11} /> Cancelled</span>
  if (item.isCompleted) return <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100'><CheckCircle size={11} /> Completed</span>
  if (item.payment) return <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100'><CreditCard size={11} /> Paid</span>
  return <span className='inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100'><Clock size={11} /> Pending</span>
}

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData, darkMode } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewAppt, setReviewAppt] = useState(null)
  const [rescheduleAppt, setRescheduleAppt] = useState(null)
  const [reviewed, setReviewed] = useState({}) // appointmentId -> bool
  const navigate = useNavigate()

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/appointments', {}, { headers: { token } })
      if (data.success) {
        const appts = data.appointments.reverse()
        setAppointments(appts)
        // Check which completed ones are already reviewed
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

  const initPay = (order) => {
    if (order.id === 'order_mock_123') { verifyRazorpay(order.id, order.receipt); return }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_DUMMY_KEY',
      amount: order.amount, currency: order.currency,
      name: 'Rogveda Appointment', description: 'Payment for Appointment',
      order_id: order.id, receipt: order.receipt,
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [{ method: "upi" }]
            },
            card: {
              name: "Pay via Card",
              instruments: [{ method: "card" }]
            }
          },
          sequence: ["block.upi", "block.card"]
        }
      },
      handler: async (response) => verifyRazorpay(response.razorpay_order_id, order.receipt)
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => { const rzp = new window.Razorpay(options); rzp.open() }
    document.body.appendChild(script)
  }

  const verifyRazorpay = async (razorpay_order_id, appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/verify-razorpay', { razorpay_order_id, appointmentId }, { headers: { token } })
      if (data.success) { toast.success('Payment Successful!'); getUserAppointments() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      if (data.success) initPay(data.order)
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { if (token) getUserAppointments() }, [token])

  return (
    <div className='pb-16 pt-6'>
      {/* Header */}
      <div className='mb-8'>
        <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
          My Health
        </span>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>My Appointments</h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found</p>
      </div>

      {loading ? (
        <div className='space-y-4'>
          {[1, 2, 3].map(i => (
            <div key={i} className={`rounded-2xl border p-5 animate-pulse ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className='flex gap-4'>
                <div className={`w-24 h-24 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                <div className='flex-1 space-y-2.5'>
                  <div className={`h-4 rounded w-1/3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  <div className={`h-3 rounded w-1/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  <div className={`h-3 rounded w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
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
                className={`rounded-2xl border overflow-hidden transition-all hover:shadow-md ${
                  darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-indigo-50'
                }`}
              >
                <div className='flex flex-col sm:flex-row gap-0'>
                  {/* Doctor image */}
                  <div className={`sm:w-36 flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-b from-indigo-50 to-indigo-100/30'}`}>
                    <img className='w-full h-36 sm:h-full object-cover object-top' src={item.docData?.image} alt={item.docData?.name} />
                  </div>

                  {/* Details */}
                  <div className='flex-1 p-5 flex flex-col sm:flex-row gap-4'>
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-start justify-between gap-2 flex-wrap'>
                        <div>
                          <p className={`font-bold text-base ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{item.docData?.name}</p>
                          <p className='text-primary text-sm font-medium'>{item.docData?.speciality}</p>
                        </div>
                        <StatusBadge item={item} />
                      </div>

                      <div className={`flex flex-wrap gap-x-4 gap-y-1.5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className='flex items-center gap-1.5'>
                          <Calendar size={12} className='text-primary' />
                          {item?.slotDate?.split('_').join('/')} at {item?.slotTime}
                        </span>
                        {item?.isVideoConsult ? (
                          <span className='flex items-center gap-1.5 text-green-600 font-semibold'>
                            <Video size={12} /> Virtual Consult
                          </span>
                        ) : (
                          <span className='flex items-center gap-1.5'>
                            <MapPin size={12} className='text-primary' />
                            {item?.docData?.address?.line1}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='flex flex-row sm:flex-col gap-2 justify-start sm:justify-center sm:min-w-[160px]'>
                      {!item.cancelled && !item.isCompleted && (
                        <>
                          {item.payment ? (
                            <div className={`text-center text-xs font-bold py-2 px-4 rounded-xl ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                              ✓ Paid
                            </div>
                          ) : (
                            <button
                              onClick={() => appointmentRazorpay(item._id)}
                              className='flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-indigo-600 transition-all shadow-sm'
                            >
                              <CreditCard size={13} /> Pay Now
                            </button>
                          )}
                          {item.isVideoConsult && (
                            <button
                              onClick={() => window.open(`/video-consult?roomId=${item.roomId}`, '_blank')}
                              className='flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all shadow-sm'
                            >
                              <Video size={13} /> Join Call <ExternalLink size={11} />
                            </button>
                          )}
                          <button
                            onClick={() => setRescheduleAppt(item)}
                            className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-xl border transition-all hover:bg-indigo-500 hover:text-white hover:border-indigo-500 ${
                              darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
                            }`}
                          >
                            <RefreshCw size={13} /> Reschedule
                          </button>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-xl border transition-all hover:bg-red-500 hover:text-white hover:border-red-500 ${
                              darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'
                            }`}
                          >
                            <X size={13} /> Cancel
                          </button>
                        </>
                      )}
                      {item.cancelled && (
                        <div className='text-center text-xs font-bold py-2 px-4 rounded-xl bg-red-50 text-red-500 border border-red-100'>
                          Cancelled
                        </div>
                      )}
                      {item.isCompleted && (
                        <div className='flex flex-col gap-2'>
                          <div className='text-center text-xs font-bold py-2 px-4 rounded-xl bg-green-50 text-green-600 border border-green-100'>
                            ✓ Completed
                          </div>
                          {!reviewed[item._id] && (
                            <button
                              onClick={() => setReviewAppt(item)}
                              className='flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-400 hover:text-white transition-all'
                            >
                              <Star size={13} /> Rate
                            </button>
                          )}
                          {reviewed[item._id] && (
                            <div className='text-center text-xs font-bold py-2 px-4 rounded-xl bg-yellow-50 text-yellow-600 border border-yellow-100'>
                              ⭐ Reviewed
                            </div>
                          )}
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
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'}`}>
            📅
          </div>
          <div className='text-center'>
            <p className={`font-bold text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>No appointments yet</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Book your first consultation with a specialist</p>
          </div>
          <button
            onClick={() => navigate('/doctors')}
            className='flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-indigo-300/30 hover:bg-indigo-600 hover:-translate-y-0.5 transition-all text-sm'
          >
            <Calendar size={16} /> Find a Doctor
          </button>
        </motion.div>
      )}
      {reviewAppt && (
        <ReviewModal
          appointment={reviewAppt}
          onClose={() => setReviewAppt(null)}
          onSubmitted={() => { getUserAppointments() }}
        />
      )}
      {rescheduleAppt && (
        <RescheduleModal
          appointment={rescheduleAppt}
          onClose={() => setRescheduleAppt(null)}
          onRescheduled={() => { getUserAppointments(); getDoctorsData() }}
        />
      )}
    </div>
  )
}

export default MyAppointment
