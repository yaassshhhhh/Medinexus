import React, { useContext, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { specialityData, assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import FloatingParticles from './FloatingParticles'
import doc1 from '../assets/doc1.png'
import doc2 from '../assets/doc2.png'
import doc3 from '../assets/doc3.png'

// Floating stat badge
const StatBadge = ({ icon, value, label, className }) => (
  <motion.div
    whileHover={{ scale: 1.06, y: -3 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${className}`}
  >
    <div className='w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-300 text-xl'>
      {icon}
    </div>
    <div>
      <p className='text-white font-bold text-lg leading-none'>{value}</p>
      <p className='text-slate-400 text-xs mt-0.5'>{label}</p>
    </div>
  </motion.div>
)

// Three Real Doctors Hero
const DoctorCard = ({ img, name, specialty, delay, position }) => {
  const isCenter = position === 'center'
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={`relative flex flex-col items-center ${isCenter ? 'z-20' : 'z-10'}`}
    >
      {/* Glow ring behind center doctor */}
      {isCenter && (
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute inset-0 rounded-full pointer-events-none'
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, rgba(99,102,241,0.15) 55%, transparent 75%)',
            top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
          }}
        />
      )}

      {/* Doctor image container */}
      <motion.div
        animate={{ y: [0, isCenter ? -10 : -6, 0] }}
        transition={{ duration: isCenter ? 3.5 : 4.2, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
        className={`relative overflow-hidden ${
          isCenter
            ? 'w-44 h-52 rounded-3xl border-2 border-teal-400/50 shadow-2xl shadow-teal-500/30'
            : 'w-32 h-40 rounded-2xl border border-teal-500/25 shadow-xl shadow-teal-500/15'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(13,31,60,0.3) 0%, rgba(13,31,60,0.8) 100%)',
        }}
      >
        <img
          src={img}
          alt={name}
          className='w-full h-full object-cover object-top'
          style={{ filter: isCenter ? 'none' : 'brightness(0.85)' }}
        />
        {/* Bottom gradient overlay */}
        <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a1628] to-transparent' />

        {/* Verified badge for center */}
        {isCenter && (
          <div className='absolute top-2 right-2 bg-teal-500/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1'>
            <span className='text-[9px] text-white font-bold'>✓ Verified</span>
          </div>
        )}
      </motion.div>

      {/* Name & specialty label */}
      <div className={`mt-2 text-center ${isCenter ? '' : 'opacity-80'}`}>
        <p className={`font-semibold text-white leading-tight ${isCenter ? 'text-sm' : 'text-xs'}`}>{name}</p>
        <p className={`text-teal-400 ${isCenter ? 'text-xs' : 'text-[10px]'} mt-0.5`}>{specialty}</p>
      </div>
    </motion.div>
  )
}

const DoctorHero = () => (
  <div className='relative flex items-end justify-center w-full h-full min-h-[360px] pb-4'>

  {/* Background glow */}
    <motion.div
      animate={{ scale: [1, 1.12, 1], opacity: [0.08, 0.16, 0.08] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className='absolute inset-0 pointer-events-none'
      style={{ background: 'radial-gradient(ellipse at center bottom, rgba(20,184,166,0.2) 0%, transparent 70%)' }}
    />

    {/* Rotating dashed ring (decorative) */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      className='absolute w-[320px] h-[320px] rounded-full pointer-events-none'
      style={{ border: '1px dashed rgba(20,184,166,0.18)', bottom: '5%', left: '50%', transform: 'translateX(-50%)' }}
    />

    {/* Three doctors layout */}
    <div className='relative flex items-end justify-end gap-3 w-full px-2'>

      {/* Left doctor */}
      <DoctorCard
        img={doc1}
        name='Dr. Sarah Lee'
        specialty='Cardiologist'
        delay={0.3}
        position='left'
      />

      {/* Center doctor — taller, highlighted */}
      <DoctorCard
        img={doc2}
        name='Dr. Arjun Mehta'
        specialty='General Physician'
        delay={0.1}
        position='center'
      />

      {/* Right doctor */}
      <DoctorCard
        img={doc3}
        name='Dr. Priya Nair'
        specialty='Neurologist'
        delay={0.5}
        position='right'
      />
    </div>

    {/* Heartbeat card (top-left) */}
    <motion.div
      animate={{ y: [0, -8, 0], opacity: [0.9, 1, 0.9] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className='absolute top-4 left-0 z-30 px-3 py-2 rounded-xl flex items-center gap-2'
      style={{ background: 'rgba(10,22,40,0.92)', border: '1px solid rgba(239,68,68,0.45)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(239,68,68,0.15)' }}
    >
      <svg viewBox='0 0 44 22' className='w-11 h-5'>
        <motion.polyline
          points='0,11 7,11 10,3 13,19 16,3 19,11 30,11 33,5 36,17 39,5 44,11'
          fill='none' stroke='#ef4444' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, repeat: Infinity, repeatType: 'loop', repeatDelay: 0.6, ease: 'easeInOut' }}
        />
      </svg>
      <span className='text-xs font-bold text-red-400'>72 BPM</span>
    </motion.div>

    {/* AI chip badge (top-right) */}
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      className='absolute top-2 right-0 z-30 px-3 py-2 rounded-xl flex items-center gap-1.5'
      style={{ background: 'rgba(10,22,40,0.92)', border: '1px solid rgba(99,102,241,0.5)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(99,102,241,0.2)' }}
    >
      <span className='text-base'>🤖</span>
      <div>
        <p className='text-[9px] text-slate-400 leading-none'>AI Powered</p>
        <p className='text-xs font-bold text-indigo-400 leading-none'>MediNexus</p>
      </div>
    </motion.div>

    {/* ECG bottom line */}
    <svg className='absolute bottom-0 left-0 right-0 w-full opacity-20' viewBox='0 0 300 24' xmlns='http://www.w3.org/2000/svg'>
      <motion.polyline
        points='0,12 28,12 38,3 46,21 54,3 62,12 100,12 110,12 130,12 150,12 170,12 190,12 200,5 208,19 216,5 224,12 300,12'
        fill='none' stroke='#14b8a6' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 0.6 }}
      />
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
    <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628] min-h-[420px] sm:min-h-[480px] mt-4 sm:mt-8'>

      {/* Floating particles */}
      <FloatingParticles count={35} color='#00d4ff' opacity={0.25} speed={0.3} />

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

      {/* Animated glow blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className='absolute top-0 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none'
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className='absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none'
      />

      {/* Scan line */}
      <div className='scan-line' />

      <div className='relative z-10 flex flex-col md:flex-row items-center px-4 sm:px-6 md:px-12 lg:px-16 py-6 sm:py-8 md:py-10 gap-6 sm:gap-8'>

        {/* ── LEFT CONTENT ── */}
        <div className='flex-1 max-w-xl'>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white'
          >
            Your Health,<br />
            <span className='gradient-text-animated'>
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
            ].map(({ icon, text }, i) => (
              <motion.span
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.1, duration: 0.4 }}
                className='flex items-center gap-1.5 text-slate-300 text-xs font-medium'
              >
                <span>{icon}</span> {text}
              </motion.span>
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
              <motion.button
                onClick={handleBook}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className='ripple-btn w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-400/40 transition-all duration-200 whitespace-nowrap glow-pulse'
              >
                Book Now →
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Doctor + Stats ── */}
        <div className='hidden md:flex md:w-[42%] lg:w-[40%] relative flex-col items-end translate-x-4 lg:translate-x-10'>
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
            className='w-full flex justify-end items-end pt-4 pr-2 float'
          >
            <DoctorHero />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Header
