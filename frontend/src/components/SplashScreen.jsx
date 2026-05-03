import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Animated ECG/heartbeat path ── */
const ECGPath = () => (
  <svg
    viewBox='0 0 400 80'
    className='w-full max-w-sm'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <motion.path
      d='M0,40 L60,40 L75,40 L85,10 L95,70 L105,5 L115,75 L125,40 L145,40 L160,40 L175,25 L185,55 L195,40 L400,40'
      stroke='url(#ecgGrad)'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.4 }}
    />
    {/* Glow duplicate */}
    <motion.path
      d='M0,40 L60,40 L75,40 L85,10 L95,70 L105,5 L115,75 L125,40 L145,40 L160,40 L175,25 L185,55 L195,40 L400,40'
      stroke='url(#ecgGlowGrad)'
      strokeWidth='6'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
      opacity='0.25'
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.25 }}
      transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.4 }}
    />
    <defs>
      <linearGradient id='ecgGrad' x1='0' y1='0' x2='400' y2='0' gradientUnits='userSpaceOnUse'>
        <stop offset='0%' stopColor='#00d4ff' stopOpacity='0' />
        <stop offset='30%' stopColor='#00d4ff' />
        <stop offset='70%' stopColor='#6366f1' />
        <stop offset='100%' stopColor='#6366f1' stopOpacity='0' />
      </linearGradient>
      <linearGradient id='ecgGlowGrad' x1='0' y1='0' x2='400' y2='0' gradientUnits='userSpaceOnUse'>
        <stop offset='0%' stopColor='#00d4ff' stopOpacity='0' />
        <stop offset='50%' stopColor='#00d4ff' />
        <stop offset='100%' stopColor='#6366f1' stopOpacity='0' />
      </linearGradient>
    </defs>
  </svg>
)

/* ── Pulsing cross / plus icon ── */
const MedCross = () => (
  <motion.div
    className='relative flex items-center justify-center'
    animate={{ scale: [1, 1.08, 1] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
  >
    {/* Outer glow ring */}
    <motion.div
      className='absolute w-28 h-28 rounded-full'
      style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)' }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Cross shape */}
    <div className='relative w-20 h-20 flex items-center justify-center'>
      {/* Vertical bar */}
      <motion.div
        className='absolute w-5 h-16 rounded-full'
        style={{ background: 'linear-gradient(180deg, #00d4ff, #6366f1)' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'backOut' }}
      />
      {/* Horizontal bar */}
      <motion.div
        className='absolute h-5 w-16 rounded-full'
        style={{ background: 'linear-gradient(90deg, #00d4ff, #6366f1)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.4, ease: 'backOut' }}
      />
    </div>
  </motion.div>
)

/* ── Floating particles ── */
const Particle = ({ x, y, delay, size }) => (
  <motion.div
    className='absolute rounded-full'
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: 'radial-gradient(circle, #00d4ff, #6366f1)',
      opacity: 0,
    }}
    animate={{
      y: [0, -30, 0],
      opacity: [0, 0.6, 0],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  />
)

const particles = [
  { x: 10, y: 20, delay: 0,    size: 6  },
  { x: 85, y: 15, delay: 0.5,  size: 4  },
  { x: 20, y: 75, delay: 1,    size: 8  },
  { x: 75, y: 70, delay: 1.5,  size: 5  },
  { x: 50, y: 10, delay: 0.8,  size: 4  },
  { x: 90, y: 50, delay: 0.3,  size: 6  },
  { x: 5,  y: 50, delay: 1.2,  size: 5  },
  { x: 60, y: 85, delay: 0.6,  size: 7  },
  { x: 35, y: 90, delay: 1.8,  size: 4  },
  { x: 70, y: 30, delay: 2.1,  size: 5  },
]

/* ── Progress bar ── */
const ProgressBar = ({ progress }) => (
  <div className='w-64 h-1 rounded-full overflow-hidden' style={{ background: 'rgba(255,255,255,0.08)' }}>
    <motion.div
      className='h-full rounded-full'
      style={{ background: 'linear-gradient(90deg, #00d4ff, #6366f1)' }}
      initial={{ width: '0%' }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    />
  </div>
)

/* ── Main SplashScreen ── */
const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Initializing...')

  const steps = [
    { at: 15,  text: 'Loading doctors...' },
    { at: 35,  text: 'Securing connection...' },
    { at: 55,  text: 'Fetching appointments...' },
    { at: 75,  text: 'Preparing your dashboard...' },
    { at: 90,  text: 'Almost ready...' },
    { at: 100, text: 'Welcome to MediNexus AI!' },
  ]

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.random() * 18 + 6
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => onComplete(), 600)
      }
      setProgress(Math.min(current, 100))
      const step = steps.findLast(s => s.at <= current)
      if (step) setStatusText(step.text)
    }, 280)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className='fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden'
      style={{ background: '#0a0f1e' }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Background grid */}
      <div
        className='absolute inset-0 opacity-[0.04]'
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow blobs */}
      <div className='absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />

      {/* Floating particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Main content */}
      <div className='relative flex flex-col items-center gap-8 px-8'>

        {/* Medical cross icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
        >
          <MedCross />
        </motion.div>

        {/* Brand name */}
        <motion.div
          className='text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h1 className='text-4xl font-extrabold tracking-tight text-white'>
            Medi<span style={{
              background: 'linear-gradient(135deg, #00d4ff 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Nexus AI</span>
          </h1>
          <motion.p
            className='text-sm text-gray-400 mt-1 tracking-widest uppercase'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Your Health, Our Priority
          </motion.p>
        </motion.div>

        {/* ECG line */}
        <motion.div
          className='w-full'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ECGPath />
        </motion.div>

        {/* Progress */}
        <motion.div
          className='flex flex-col items-center gap-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <ProgressBar progress={progress} />
          <motion.p
            key={statusText}
            className='text-xs text-gray-400 tracking-wide'
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {statusText}
          </motion.p>
        </motion.div>

        {/* Floating pills / badges */}
        <div className='flex gap-3 flex-wrap justify-center'>
          {['🩺 Doctors', '💊 Pharmacy', '🧬 AI Diagnosis', '📋 Records'].map((tag, i) => (
            <motion.span
              key={tag}
              className='text-xs px-3 py-1 rounded-full border text-gray-300'
              style={{ borderColor: 'rgba(0,212,255,0.2)', background: 'rgba(0,212,255,0.05)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.12, duration: 0.35, ease: 'backOut' }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Bottom scan line */}
      <motion.div
        className='absolute left-0 right-0 h-px'
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

export default SplashScreen
