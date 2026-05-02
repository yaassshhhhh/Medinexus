import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { specialityData } from '../assets/assets'
import { AppContext } from '../context/AppContext'

// Floating stat badge
const StatBadge = ({ icon, value, label, className }) => (
  <div className={`flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 ${className}`}>
    <div className='w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-300 text-xl'>
      {icon}
    </div>
    <div>
      <p className='text-white font-bold text-lg leading-none'>{value}</p>
      <p className='text-slate-400 text-xs mt-0.5'>{label}</p>
    </div>
  </div>
)

// Glowing ring doctor illustration
const DoctorHero = () => (
  <div className='relative flex items-center justify-center w-full h-full'>
    {/* Outer glow ring */}
    <div className='absolute w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-teal-400/30 animate-pulse' />
    <div className='absolute w-56 h-56 md:w-64 md:h-64 rounded-full border border-teal-400/20' />
    {/* Inner glowing circle */}
    <div className='absolute w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-b from-teal-400/20 to-blue-600/10 blur-xl' />
    {/* Doctor SVG */}
    <svg viewBox='0 0 300 360' xmlns='http://www.w3.org/2000/svg' className='relative z-10 w-56 md:w-64 drop-shadow-2xl' aria-label='Doctor illustration'>
      <defs>
        <linearGradient id='coat' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#e8f0fe' />
          <stop offset='100%' stopColor='#c7d2fe' />
        </linearGradient>
        <linearGradient id='skin' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#fcd9b6' />
          <stop offset='100%' stopColor='#f5b98a' />
        </linearGradient>
        <linearGradient id='scrub' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#14b8a6' />
          <stop offset='100%' stopColor='#0891b2' />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx='150' cy='352' rx='80' ry='8' fill='rgba(0,0,0,0.3)' />
      {/* Coat body */}
      <path d='M75,200 Q60,215 55,290 Q53,330 55,350 L245,350 Q247,330 245,290 Q240,215 225,200 L200,190 Q175,225 150,225 Q125,225 100,190 Z' fill='url(#coat)' />
      {/* Scrubs */}
      <path d='M100,190 L90,230 L150,245 L210,230 L200,190 Q180,210 150,210 Q120,210 100,190 Z' fill='url(#scrub)' />
      {/* Stethoscope */}
      <path d='M110,235 Q98,265 102,285 Q106,305 120,305 Q134,305 134,292' fill='none' stroke='#1e293b' strokeWidth='3.5' strokeLinecap='round' />
      <circle cx='134' cy='289' r='7' fill='#1e293b' />
      <circle cx='134' cy='289' r='4' fill='#14b8a6' />
      {/* Pocket */}
      <rect x='165' y='240' width='30' height='24' rx='4' fill='white' opacity='0.5' stroke='#a5b4fc' strokeWidth='1' />
      <rect x='172' y='236' width='3' height='10' rx='1.5' fill='#ef4444' />
      <rect x='178' y='234' width='3' height='12' rx='1.5' fill='#3b82f6' />
      <rect x='184' y='237' width='3' height='9' rx='1.5' fill='#10b981' />
      {/* Neck */}
      <rect x='138' y='158' width='24' height='34' rx='10' fill='url(#skin)' />
      {/* Head */}
      <ellipse cx='150' cy='128' rx='44' ry='48' fill='url(#skin)' />
      {/* Hair */}
      <path d='M106,118 Q108,76 150,74 Q192,76 194,118 Q182,88 150,86 Q118,88 106,118 Z' fill='#2d1a0e' />
      {/* Ears */}
      <ellipse cx='106' cy='130' rx='7' ry='9' fill='#f5b98a' />
      <ellipse cx='194' cy='130' rx='7' ry='9' fill='#f5b98a' />
      {/* Eyes */}
      <ellipse cx='136' cy='128' rx='8' ry='9' fill='white' />
      <ellipse cx='164' cy='128' rx='8' ry='9' fill='white' />
      <circle cx='138' cy='130' r='4.5' fill='#2d1a0e' />
      <circle cx='166' cy='130' r='4.5' fill='#2d1a0e' />
      <circle cx='139.5' cy='128.5' r='1.5' fill='white' />
      <circle cx='167.5' cy='128.5' r='1.5' fill='white' />
      {/* Eyebrows */}
      <path d='M128,116 Q136,111 144,116' fill='none' stroke='#2d1a0e' strokeWidth='2' strokeLinecap='round' />
      <path d='M156,116 Q164,111 172,116' fill='none' stroke='#2d1a0e' strokeWidth='2' strokeLinecap='round' />
      {/* Smile */}
      <path d='M138,144 Q150,154 162,144' fill='none' stroke='#c0714a' strokeWidth='2' strokeLinecap='round' />
      {/* Nose */}
      <path d='M147,133 Q145,141 150,143 Q155,141 153,133' fill='none' stroke='#c0714a' strokeWidth='1.5' strokeLinecap='round' />
      {/* Left arm */}
      <path d='M75,210 Q48,238 44,278 Q42,298 54,302 L68,302 Q72,278 80,255 Z' fill='url(#coat)' stroke='#c7d2fe' strokeWidth='1' />
      <ellipse cx='48' cy='305' rx='13' ry='8' fill='url(#skin)' />
      {/* Right arm */}
      <path d='M225,210 Q252,238 256,270 Q258,290 246,294 L232,294 Q228,270 220,248 Z' fill='url(#coat)' stroke='#c7d2fe' strokeWidth='1' />
      <ellipse cx='252' cy='297' rx='12' ry='8' fill='url(#skin)' />
    </svg>
    {/* ECG line decoration */}
    <svg className='absolute bottom-4 left-0 right-0 w-full opacity-30' viewBox='0 0 300 40' xmlns='http://www.w3.org/2000/svg'>
      <polyline points='0,20 40,20 55,5 65,35 75,5 85,20 120,20 135,20 150,20 165,20 180,20 220,20 235,8 245,32 255,8 265,20 300,20' fill='none' stroke='#14b8a6' strokeWidth='2' />
    </svg>
  </div>
)

const Header = () => {
  const navigate = useNavigate()
  const { darkMode } = useContext(AppContext)
  const [dept, setDept] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')

  const handleBook = () => {
    if (dept) {
      navigate(`/doctors/${dept}`)
      scrollTo(0, 0)
    } else {
      navigate('/doctors')
      scrollTo(0, 0)
    }
  }

  return (
    <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628] min-h-[480px]'>

      {/* Background grid */}
      <div className='absolute inset-0 pointer-events-none opacity-[0.06]'>
        <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='hgrid' width='50' height='50' patternUnits='userSpaceOnUse'>
              <path d='M 50 0 L 0 0 0 50' fill='none' stroke='#38bdf8' strokeWidth='0.8' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#hgrid)' />
        </svg>
      </div>

      {/* Glow blobs */}
      <div className='absolute top-0 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none' />

      <div className='relative z-10 flex flex-col md:flex-row items-center px-6 md:px-12 lg:px-16 py-10 gap-8'>

        {/* ── LEFT CONTENT ── */}
        <div className='flex-1 max-w-xl'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white'
          >
            Your Health,<br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300'>
              Our Priority
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className='text-slate-400 text-sm md:text-base mt-4 max-w-md leading-relaxed'
          >
            Book an appointment with experienced doctors and get the best healthcare for you and your family.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className='flex flex-wrap items-center gap-5 mt-6'
          >
            {[
              { icon: '🩺', text: 'Verified Doctors' },
              { icon: '📅', text: 'Easy Appointments' },
              { icon: '🔒', text: 'Secure & Private' },
            ].map(({ icon, text }) => (
              <span key={text} className='flex items-center gap-1.5 text-slate-300 text-xs font-medium'>
                <span>{icon}</span> {text}
              </span>
            ))}
          </motion.div>

          {/* ── Booking Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className='mt-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5'
          >
            <p className='text-teal-400 font-semibold text-sm mb-4'>Book an Appointment</p>
            <div className='flex flex-col sm:flex-row gap-3'>
              {/* Department */}
              <div className='flex-1 relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>⊞</span>
                <select
                  value={dept}
                  onChange={e => setDept(e.target.value)}
                  className='w-full bg-white/[0.08] border border-white/10 text-slate-300 text-xs rounded-xl pl-8 pr-3 py-3 appearance-none focus:outline-none focus:border-teal-500/50 cursor-pointer'
                >
                  <option value=''>Select Department</option>
                  {specialityData.map(s => (
                    <option key={s.speciality} value={s.speciality}>{s.speciality}</option>
                  ))}
                </select>
              </div>
              {/* Date */}
              <div className='flex-1 relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>📅</span>
                <input
                  type='date'
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className='w-full bg-white/[0.08] border border-white/10 text-slate-300 text-xs rounded-xl pl-8 pr-3 py-3 focus:outline-none focus:border-teal-500/50 cursor-pointer'
                />
              </div>
              {/* Book button */}
              <button
                onClick={handleBook}
                className='flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-400/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap'
              >
                Book Now →
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Doctor + Stats ── */}
        <div className='hidden md:flex md:w-[42%] lg:w-[40%] relative flex-col items-center'>
          {/* Stat badges */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className='absolute top-0 right-0 flex flex-col gap-3 z-20'
          >
            <StatBadge icon='👥' value='10,000+' label='Happy Patients' />
            <StatBadge icon='😊' value='50+' label='Specialized Doctors' />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='w-full flex justify-center items-end pt-4'
          >
            <DoctorHero />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Header
