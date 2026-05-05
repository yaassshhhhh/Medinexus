import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import RelatedDoctors from '../components/RelatedDoctors'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Info, Clock, Calendar, X, Video, MapPin, Star, BadgeCheck, RefreshCw } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

/* ── colour tokens ── */
const card   = 'bg-[#0f1629] border border-[#1e2d4a]'
const inner  = 'bg-[#0d1b3e] border border-[#1e2d4a]'
const tPri   = 'text-gray-100'
const tSec   = 'text-gray-400'

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
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
  const [otpCountdown, setOtpCountdown] = useState(0)
  const countdownRef = useRef(null)

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

  const startCountdown = () => {
    setOtpCountdown(120)
    clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setOtpCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearInterval(countdownRef.current), [])

  const initiateBooking = async () => {
    if (!token) { toast.warn('Login to book appointment'); return navigate('/login') }
    if (!slotTime) { toast.warn('Please select a time slot first'); return }
    if (isLoading) return
    setIsLoading(true)
    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
      const { data } = await axios.post(backendUrl + '/api/user/send-booking-otp', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) { toast.success(data.message); setShowOtpModal(true); startCountdown() }
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

  if (!docInfo) return (
    <div className='pb-20 animate-pulse'>
      <div className='flex flex-col sm:flex-row gap-6'>
        <div className='w-full sm:w-72 flex-shrink-0 rounded-2xl h-80 bg-[#0f1629] border border-[#1e2d4a]' />
        <div className='flex-1 rounded-2xl p-8 bg-[#0f1629] border border-[#1e2d4a] space-y-4'>
          <div className='h-6 rounded-lg w-1/2 bg-[#1e2d4a]' />
          <div className='h-4 rounded-lg w-1/3 bg-[#1e2d4a]' />
          <div className='grid grid-cols-3 gap-3 mt-4'>
            {[1,2,3].map(i => <div key={i} className='h-16 rounded-xl bg-[#1e2d4a]' />)}
          </div>
          <div className='h-20 rounded-xl bg-[#1e2d4a]' />
        </div>
      </div>
    </div>
  )

  return (
    <div className='pb-20'>
      {/* Doctor profile card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='flex flex-col sm:flex-row gap-6'>
        {/* Photo */}
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }} className='w-full sm:w-72 flex-shrink-0'>
          <div className='rounded-2xl overflow-hidden shadow-lg bg-[#0d1b3e] border border-[#1e2d4a]'>
            <img className='w-full aspect-[3/4] object-cover object-center' src={docInfo.image} alt={docInfo.name} />
          </div>
        </motion.div>

        {/* Info panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className={`flex-1 rounded-2xl p-4 sm:p-6 lg:p-8 ${card}`}>
          <div className='flex items-start justify-between gap-4 flex-wrap'>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className={`text-2xl font-bold ${tPri}`}>{docInfo.name}</h1>
                <BadgeCheck size={22} className='text-cyan-400 flex-shrink-0' />
              </div>
              <p className={`text-sm mt-1 ${tSec}`}>{docInfo.degree} · {docInfo.speciality}</p>
            </div>
            <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'>
              <Clock size={12} /> {docInfo.experience}
            </div>
          </div>

          {/* Stats row */}
          <div className={`grid grid-cols-3 gap-3 mt-5 p-4 rounded-xl ${inner}`}>
            {[
              { icon: <Star size={16} className='text-amber-400' />, label: 'Rating', value: '4.9' },
              { icon: <Calendar size={16} className='text-cyan-400' />, label: 'Experience', value: docInfo.experience },
              { icon: <MapPin size={16} className='text-green-400' />, label: 'Consult Fee', value: `${currencySymbol}${docInfo.fees}` },
            ].map(({ icon, label, value }) => (
              <div key={label} className='text-center'>
                <div className='flex justify-center mb-1'>{icon}</div>
                <p className={`text-xs ${tSec}`}>{label}</p>
                <p className={`text-sm font-bold ${tPri}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <div className='mt-5'>
            <p className={`flex items-center gap-1.5 text-sm font-semibold mb-2 ${tPri}`}>
              <Info size={15} className='text-cyan-400' /> About
            </p>
            <p className={`text-sm leading-relaxed ${tSec}`}>{docInfo.about}</p>
          </div>

          {/* Address */}
          <div className={`mt-4 flex items-start gap-2 text-sm ${tSec}`}>
            <MapPin size={15} className='text-cyan-400 mt-0.5 flex-shrink-0' />
            <span>{docInfo.address?.line1}, {docInfo.address?.line2}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Booking section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`mt-8 rounded-2xl p-6 sm:p-8 ${card}`}>
        <h2 className={`flex items-center gap-2 text-lg font-bold mb-6 ${tPri}`}>
          <Calendar size={20} className='text-cyan-400' /> Book an Appointment
        </h2>

        {!docInfo.available ? (
          <div className='flex flex-col items-center justify-center py-12 gap-4 text-center'>
            <div className='w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/20'>
              <X size={28} className='text-red-400' />
            </div>
            <div>
              <p className='text-base font-bold text-red-400'>Doctor Not Available</p>
              <p className={`text-sm mt-1 ${tSec}`}>
                {docInfo.name} is currently unavailable for appointments.<br />Please check back later or choose another doctor.
              </p>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              className='mt-2 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition-all text-sm'
            >
              <Calendar size={15} /> Find Another Doctor
            </button>
          </div>
        ) : docSlots.length > 0 ? (
          <>
            {/* Day selector */}
            <div className='flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide'>
              {docSlots.map((item, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSlotIndex(index); setSlotTime('') }}
                  className={`flex-shrink-0 flex flex-col items-center px-4 py-3.5 rounded-xl border transition-all min-w-[56px] sm:min-w-[64px] ${
                    slotIndex === index
                      ? 'bg-cyan-500 text-black border-cyan-500 shadow-lg shadow-cyan-500/25'
                      : 'border-[#1e2d4a] text-gray-400 hover:border-cyan-500/40 hover:bg-[#0d1b3e]'
                  }`}
                >
                  <span className='text-[10px] font-bold uppercase tracking-wider'>{daysOfWeek[item[0].datetime.getDay()]}</span>
                  <span className='text-xl font-bold mt-0.5'>{item[0].datetime.getDate()}</span>
                </motion.button>
              ))}
            </div>

            {/* Time slots */}
            <div className='mt-5'>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${tSec}`}>Available Times</p>
              <div className='flex flex-wrap gap-2'>
                <AnimatePresence mode='wait'>
                  {docSlots[slotIndex]?.map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.015 }}
                      onClick={() => setSlotTime(item.time)}
                      className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
                        item.time === slotTime
                          ? 'bg-cyan-500 text-black border-cyan-500 shadow-md'
                          : 'text-gray-400 border-[#1e2d4a] hover:border-cyan-500/40 hover:bg-[#0d1b3e]'
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
                  className='mt-4 flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20'
                >
                  <Check size={16} />
                  {docSlots[slotIndex][0].datetime.toDateString()} at {slotTime}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA row */}
            <div className='mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3'>
              <button
                onClick={initiateBooking}
                disabled={isLoading}
                className={`w-full sm:w-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition-all text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Clock size={16} />
                {isLoading ? 'Sending OTP...' : 'Book Appointment'}
              </button>

              <label className={`flex items-center gap-2.5 cursor-pointer px-4 py-3.5 rounded-xl border transition-all text-sm font-semibold w-full sm:w-auto justify-center sm:justify-start ${
                isVideoConsult
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                  : 'border-[#1e2d4a] text-gray-400 hover:border-cyan-500/40'
              }`}>
                <input type='checkbox' checked={isVideoConsult} onChange={() => setIsVideoConsult(!isVideoConsult)} className='accent-cyan-500 w-4 h-4' />
                <Video size={15} /> Video Consult
              </label>
            </div>
          </>
        ) : (
          <div className={`text-center py-12 ${tSec}`}>
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
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className='rounded-2xl p-7 w-full max-w-sm relative shadow-2xl bg-[#0f1629] border border-[#1e2d4a]'
            >
              <button onClick={() => setShowOtpModal(false)} className='absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#1e2d4a] text-gray-400 transition-colors'>
                <X size={18} />
              </button>
              <div className='w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-4'>
                <BadgeCheck size={24} className='text-cyan-400' />
              </div>
              <h3 className={`text-xl font-bold mb-1 ${tPri}`}>Verify Booking</h3>
              <p className={`text-sm mb-6 ${tSec}`}>
                A 6-digit OTP was sent to your registered email. Enter it below to confirm.
              </p>
              <input
                type='text'
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder='• • • • • •'
                maxLength={6}
                className='w-full border-2 border-[#1e2d4a] focus:border-cyan-500 rounded-xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none transition-all mb-4 bg-[#0d1b3e] text-gray-100'
              />

              {/* Countdown + resend */}
              <div className='flex items-center justify-between mb-4 text-sm'>
                {otpCountdown > 0 ? (
                  <span className={tSec}>
                    OTP expires in{' '}
                    <span className={`font-bold ${otpCountdown <= 30 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {Math.floor(otpCountdown / 60)}:{String(otpCountdown % 60).padStart(2, '0')}
                    </span>
                  </span>
                ) : (
                  <span className='text-red-400 text-xs font-medium'>OTP expired</span>
                )}
                <button
                  type='button'
                  disabled={otpCountdown > 90 || isLoading}
                  onClick={async () => {
                    if (isLoading) return
                    setIsLoading(true)
                    try {
                      const date = docSlots[slotIndex][0].datetime
                      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
                      const { data } = await axios.post(backendUrl + '/api/user/send-booking-otp', { docId, slotDate, slotTime }, { headers: { token } })
                      if (data.success) { toast.success('OTP resent!'); startCountdown() }
                      else toast.error(data.message)
                    } catch (err) { toast.error(err.message) }
                    finally { setIsLoading(false) }
                  }}
                  className='flex items-center gap-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold'
                >
                  <RefreshCw size={12} /> Resend OTP
                </button>
              </div>
              <button
                onClick={confirmBooking}
                disabled={isLoading}
                className={`w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
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
