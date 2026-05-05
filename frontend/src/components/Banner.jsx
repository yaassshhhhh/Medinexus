import React, { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import FloatingParticles from './FloatingParticles'

const perks = ['Free cancellation', 'Verified doctors', 'Instant confirmation']

/* ── Mini appointment card ── */
const AppointmentCard = () => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    className='rounded-2xl p-4 w-56'
    style={{ background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(20,184,166,0.3)', boxShadow: '0 8px 32px rgba(20,184,166,0.15)' }}
  >
    <div className='flex items-center gap-2 mb-3'>
      <div className='w-8 h-8 rounded-full flex items-center justify-center text-sm' style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>👨‍⚕️</div>
      <div>
        <p className='text-white text-xs font-bold leading-none'>Dr. Rahul Sharma</p>
        <p className='text-teal-400 text-[10px] mt-0.5'>General Physician</p>
      </div>
      <span className='ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
    </div>
    <div className='flex items-center gap-2 p-2 rounded-xl mb-2' style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)' }}>
      <span className='text-sm'>📅</span>
      <div>
        <p className='text-white text-[10px] font-semibold'>Today, 3:00 PM</p>
        <p className='text-slate-400 text-[9px]'>Video Consultation</p>
      </div>
    </div>
    <div className='flex gap-1.5'>
      <div className='flex-1 py-1.5 rounded-lg text-center text-[10px] font-semibold text-red-400' style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>Cancel</div>
      <div className='flex-1 py-1.5 rounded-lg text-center text-[10px] font-semibold text-teal-300' style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)' }}>Join →</div>
    </div>
  </motion.div>
)

/* ── Health stats card ── */
const StatsCard = () => (
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
    className='rounded-2xl p-4 w-48'
    style={{ background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 8px 32px rgba(99,102,241,0.12)' }}
  >
    <p className='text-slate-400 text-[10px] font-medium mb-3 uppercase tracking-wider'>Health Overview</p>
    {[
      { label: 'Heart Rate', value: '72 BPM', color: '#ef4444', pct: 72 },
      { label: 'Blood O₂',  value: '98%',    color: '#14b8a6', pct: 98 },
      { label: 'Glucose',   value: 'Normal', color: '#6366f1', pct: 65 },
    ].map(({ label, value, color, pct }) => (
      <div key={label} className='mb-2.5'>
        <div className='flex justify-between mb-1'>
          <span className='text-slate-400 text-[9px]'>{label}</span>
          <span className='text-white text-[9px] font-bold'>{value}</span>
        </div>
        <div className='h-1 rounded-full' style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className='h-full rounded-full'
            style={{ background: color, boxShadow: `0 0 6px ${color}88` }}
          />
        </div>
      </div>
    ))}
  </motion.div>
)

/* ── AI diagnosis card ── */
const AiCard = () => (
  <motion.div
    animate={{ y: [0, -7, 0] }}
    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
    className='rounded-2xl p-3.5 w-52'
    style={{ background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(99,102,241,0.35)', boxShadow: '0 8px 32px rgba(99,102,241,0.15)' }}
  >
    <div className='flex items-center gap-2 mb-3'>
      <div className='w-7 h-7 rounded-lg flex items-center justify-center text-sm' style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>🤖</div>
      <div>
        <p className='text-white text-[10px] font-bold'>AI Diagnosis</p>
        <p className='text-indigo-400 text-[9px]'>MediNexus AI</p>
      </div>
    </div>
    <div className='space-y-1.5'>
      {['Analyzing symptoms...', 'Checking records...', 'Generating report...'].map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.6, duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }}
          className='flex items-center gap-2 px-2 py-1.5 rounded-lg'
          style={{ background: 'rgba(99,102,241,0.08)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.4 }}
            className='w-1.5 h-1.5 rounded-full'
            style={{ background: i === 2 ? '#10b981' : '#6366f1' }}
          />
          <span className='text-slate-300 text-[9px]'>{step}</span>
          {i === 2 && <span className='ml-auto text-emerald-400 text-[9px] font-bold'>✓</span>}
        </motion.div>
      ))}
    </div>
    <div className='mt-3 p-2 rounded-xl text-center' style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(79,70,229,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
      <p className='text-indigo-300 text-[9px] font-semibold'>98.4% Accuracy Rate</p>
    </div>
  </motion.div>
)

/* ── Notification toast ── */
const NotifToast = () => (
  <motion.div
    animate={{ y: [0, -5, 0], opacity: [0.9, 1, 0.9] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    className='flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl w-56'
    style={{ background: 'rgba(13,31,60,0.95)', border: '1px solid rgba(16,185,129,0.35)', boxShadow: '0 4px 20px rgba(16,185,129,0.15)' }}
  >
    <div className='w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0' style={{ background: 'rgba(16,185,129,0.15)' }}>✅</div>
    <div>
      <p className='text-white text-[10px] font-bold leading-none'>Appointment Confirmed</p>
      <p className='text-slate-400 text-[9px] mt-0.5'>Dr. Priya • Tomorrow 10 AM</p>
    </div>
  </motion.div>
)

const Banner = () => {
  const navigate = useNavigate()
  const bannerRef = useRef(null)
  const { scrollY } = useScroll()
  const bannerY = useTransform(scrollY, [200, 800], ['0%', '-6%'])

  return (
    <motion.div
      ref={bannerRef}
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className='relative overflow-hidden rounded-2xl my-12 bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#071220]'
    >
      {/* Grid bg */}
      <div className='absolute inset-0 pointer-events-none opacity-[0.05]'>
        <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='bgrid' width='50' height='50' patternUnits='userSpaceOnUse'>
              <path d='M 50 0 L 0 0 0 50' fill='none' stroke='#38bdf8' strokeWidth='0.8' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#bgrid)' />
        </svg>
      </div>

      <FloatingParticles count={20} color='#14b8a6' opacity={0.18} speed={0.25} />

      {/* Glow blobs */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className='absolute -top-16 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none' />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className='absolute -bottom-10 right-10 w-56 h-56 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none' />

      <motion.div style={{ y: bannerY }} className='relative z-10 flex flex-col md:flex-row items-center px-5 sm:px-8 md:px-16 py-8 sm:py-10 md:py-12 gap-8 md:gap-10'>

        {/* ── LEFT: Text ── */}
        <div className='flex-1 min-w-0'>
          <p className='inline-flex items-center gap-2 bg-teal-500/15 border border-teal-500/25 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5'>
            <span className='w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse' />
            100+ Trusted Specialists
          </p>
          <h2 className='text-xl sm:text-2xl lg:text-4xl font-bold text-white leading-snug'>
            Book Appointment<br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300'>
              With Trusted Doctors
            </span>
          </h2>
          <ul className='mt-5 space-y-2'>
            {perks.map((p, i) => (
              <motion.li key={p} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className='flex items-center gap-2 text-slate-300 text-sm font-medium'>
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  className='text-teal-400'>✓</motion.span> {p}
              </motion.li>
            ))}
          </ul>
          <motion.button
            onClick={() => { navigate('/login'); scrollTo(0, 0) }}
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className='mt-8 w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold px-7 py-3 rounded-xl text-sm shadow-lg shadow-teal-500/25 transition-all duration-200'
          >
            Create Free Account
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>→</motion.span>
          </motion.button>
        </div>

        {/* ── RIGHT: Animated UI cards ── */}
        <div className='hidden md:flex md:w-[420px] lg:w-[480px] relative h-64 items-center justify-center flex-shrink-0'>

          {/* Background glow */}
          <div className='absolute inset-0 rounded-2xl pointer-events-none' style={{ background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />

          {/* Appointment card — top left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className='absolute top-0 left-0'
          >
            <AppointmentCard />
          </motion.div>

          {/* Stats card — bottom left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className='absolute bottom-0 left-8'
          >
            <StatsCard />
          </motion.div>

          {/* AI card — top right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className='absolute top-2 right-0'
          >
            <AiCard />
          </motion.div>

          {/* Notification toast — bottom right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className='absolute bottom-2 right-0'
          >
            <NotifToast />
          </motion.div>

          {/* Center connecting lines SVG */}
          <svg className='absolute inset-0 w-full h-full pointer-events-none opacity-20' xmlns='http://www.w3.org/2000/svg'>
            <line x1='56' y1='80' x2='210' y2='130' stroke='#14b8a6' strokeWidth='1' strokeDasharray='4 4' />
            <line x1='210' y1='130' x2='370' y2='80' stroke='#6366f1' strokeWidth='1' strokeDasharray='4 4' />
            <line x1='56' y1='200' x2='210' y2='130' stroke='#14b8a6' strokeWidth='1' strokeDasharray='4 4' />
            <line x1='210' y1='130' x2='370' y2='210' stroke='#6366f1' strokeWidth='1' strokeDasharray='4 4' />
            <circle cx='210' cy='130' r='4' fill='#14b8a6' opacity='0.6' />
          </svg>

        </div>
      </motion.div>
    </motion.div>
  )
}

export default Banner
