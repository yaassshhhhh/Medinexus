import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Info, Clock, Calendar, X, Video, MapPin, Star, BadgeCheck } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, darkMode } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [isVideoConsult, setIsVideoConsult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const info = doctors.find(doc => doc._id === docId)
    setDocInfo(info)
  }, [doctors, docId])

  useEffect(() => {
    if (!docInfo) return
    setDocSlots([])
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
        currentDate.setHours(10); currentDate.setMinutes(0)
      }
      const timeSlots = []
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`
        const available = !(docInfo?.slots_booked?.[slotDate]?.includes(formattedTime))
        if (available) timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      if (timeSlots.length > 0) allSlots.push(timeSlots)
    }
    setDocSlots(allSlots)
  }, [docInfo])

  const initiateBooking = async () => {
    if (!token) { toast.warn('Login to book appointment'); return navigate('/login') }
    if (!slotTime) { toast.warn('Please select a time slot first'); return }
    if (isLoading) return
    setIsLoading(true)
    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
      const { data } = await axios.post(backendUrl + '/api/user/send-booking-otp', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) { toast.success(data.message); setShowOtpModal(true) }
      else toast.error(data.message || 'Failed to send OTP')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally { setIsLoading(false) }
  }

  const confirmBooking = async () => {
    if (!otp || otp.length < 6) { toast.warn('Please enter the 6-digit OTP'); return }
    if (isLoading) return
    setIsLoading(true)
    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime, otp, isVideoConsult }, { headers: { token } })
      if (data.success) { toast.success(data.message); setShowOtpModal(false); setOtp(''); getDoctorsData(); navigate('/my-appointments') }
      else toast.error(data.message || 'Booking failed')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally { setIsLoading(false) }
  }

  if (!docInfo) return null

  return (
    <div className='pb-20'>
      {/* Doctor profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='flex flex-col sm:flex-row gap-6'>
        {/* Photo */}
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }} className='w-full sm:w-72 flex-shrink-0'>
          <div className={`rounded-2xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-b from-indigo-100 to-indigo-50'}`}>
            <img className='w-full aspect-[3/4] object-cover object-center' src={docInfo.image} alt={docInfo.name} />
          </div>
        </motion.div>

        {/* Info panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className={`flex-1 rounded-2xl border p-6 sm:p-8 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          {/* Name & verify */}
          <div className='flex items-start justify-between gap-4 flex-wrap'>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{docInfo.name}</h1>
                <BadgeCheck size={22} className='text-primary flex-shrink-0' />
              </div>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{docInfo.degree} · {docInfo.speciality}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${darkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
              <Clock size={12} /> {docInfo.experience}
            </div>
          </div>

          {/* Stats row */}
          <div className={`grid grid-cols-3 gap-3 mt-5 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            {[
              { icon: <Star size={16} className='text-amber-500' />, label: 'Rating', value: '4.9' },
              { icon: <Calendar size={16} className='text-primary' />, label: 'Experience', value: docInfo.experience },
              { icon: <MapPin size={16} className='text-green-500' />, label: 'Consult Fee', value: `${currencySymbol}${docInfo.fees}` },
            ].map(({ icon, label, value }) => (
              <div key={label} className='text-center'>
                <div className='flex justify-center mb-1'>{icon}</div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                <p className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <div className='mt-5'>
            <p className={`flex items-center gap-1.5 text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <Info size={15} className='text-primary' /> About
            </p>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{docInfo.about}</p>
          </div>

          {/* Address */}
          <div className={`mt-4 flex items-start gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <MapPin size={15} className='text-primary mt-0.5 flex-shrink-0' />
            <span>{docInfo.address?.line1}, {docInfo.address?.line2}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Booking section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`mt-8 rounded-2xl border p-6 sm:p-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
        <h2 className={`flex items-center gap-2 text-lg font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          <Calendar size={20} className='text-primary' /> Book an Appointment
        </h2>

        {docSlots.length > 0 ? (
          <>
            {/* Day selector */}
            <div className='flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide'>
              {docSlots.map((item, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSlotIndex(index); setSlotTime('') }}
                  className={`flex-shrink-0 flex flex-col items-center px-4 py-3.5 rounded-xl border transition-all min-w-[64px] ${
                    slotIndex === index
                      ? 'bg-primary text-white border-primary shadow-lg shadow-indigo-200/50'
                      : darkMode ? 'border-gray-600 text-gray-300 hover:border-primary/50 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:border-primary/40 hover:bg-indigo-50/50'
                  }`}
                >
                  <span className='text-[10px] font-bold uppercase tracking-wider'>{daysOfWeek[item[0].datetime.getDay()]}</span>
                  <span className='text-xl font-bold mt-0.5'>{item[0].datetime.getDate()}</span>
                </motion.button>
              ))}
            </div>

            {/* Time slots */}
            <div className='mt-5'>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available Times</p>
              <div className='flex flex-wrap gap-2'>
                <AnimatePresence mode='wait'>
                  {docSlots[slotIndex]?.map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.015 }}
                      onClick={() => setSlotTime(item.time)}
                      className={`text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
                        item.time === slotTime
                          ? 'bg-primary text-white border-primary shadow-md'
                          : darkMode ? 'text-gray-300 border-gray-600 hover:border-primary/60 hover:bg-gray-700' : 'text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-indigo-50/50'
                      }`}
                    >
                      {item.time.toLowerCase()}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Selected slot confirmation */}
            <AnimatePresence>
              {slotTime && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'}`}
                >
                  <Check size={16} />
                  {docSlots[slotIndex][0].datetime.toDateString()} at {slotTime}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA row */}
            <div className='mt-6 flex flex-wrap items-center gap-3'>
              <button
                onClick={initiateBooking}
                disabled={isLoading}
                className={`flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-300/40 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-indigo-400/50 transition-all text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Clock size={16} />
                {isLoading ? 'Sending OTP...' : 'Book Appointment'}
              </button>

              <label className={`flex items-center gap-2.5 cursor-pointer px-4 py-3.5 rounded-xl border transition-all text-sm font-semibold ${
                isVideoConsult
                  ? 'bg-indigo-50 border-primary text-primary'
                  : darkMode ? 'border-gray-600 text-gray-300 hover:border-primary/50' : 'border-gray-200 text-gray-600 hover:border-primary/40'
              }`}>
                <input type='checkbox' checked={isVideoConsult} onChange={() => setIsVideoConsult(!isVideoConsult)} className='accent-primary w-4 h-4' />
                <Video size={15} /> Video Consult
              </label>
            </div>
          </>
        ) : (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Calendar size={36} className='mx-auto mb-3 opacity-30' />
            <p>No available slots at the moment</p>
          </div>
        )}
      </motion.div>

      {/* Related doctors */}
      <div className='mt-16'>
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-2xl p-7 w-full max-w-sm relative shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <button onClick={() => setShowOtpModal(false)} className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <X size={18} />
              </button>
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4'>
                <BadgeCheck size={24} className='text-primary' />
              </div>
              <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Verify Booking</h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                A 6-digit OTP was sent to your registered email. Enter it below to confirm.
              </p>
              <input
                type='text'
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder='• • • • • •'
                maxLength={6}
                className={`w-full border-2 rounded-xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none transition-all mb-4 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-primary' : 'bg-indigo-50/50 border-indigo-100 text-gray-800 focus:border-primary focus:bg-white'
                }`}
              />
              <button
                onClick={confirmBooking}
                disabled={isLoading}
                className={`w-full bg-primary hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-300/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              >
                {isLoading ? 'Verifying...' : 'Confirm Appointment'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Appointment
