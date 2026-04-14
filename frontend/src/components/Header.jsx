import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Star, Clock } from 'lucide-react'
import { assets } from '../assets/assets'

const Doctor3D = () => (
  <svg viewBox="0 0 380 420" xmlns="http://www.w3.org/2000/svg" className="w-full max-h-[400px] drop-shadow-2xl" aria-label="Doctor appointment illustration">
    <defs>
      <filter id="s1" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#312e81" floodOpacity="0.25"/>
      </filter>
      <filter id="s2" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#312e81" floodOpacity="0.2"/>
      </filter>
      <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#e0e7ff"/>
      </linearGradient>
      <linearGradient id="coatGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f8faff"/>
        <stop offset="100%" stopColor="#dde4ff"/>
      </linearGradient>
      <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fcd9b6"/>
        <stop offset="100%" stopColor="#f5b98a"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#f0f4ff"/>
      </linearGradient>
      <linearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>

    {/* Floor shadow */}
    <ellipse cx="190" cy="408" rx="120" ry="12" fill="rgba(0,0,0,0.15)"/>

    {/* ── Floating appointment card (top-right) ── */}
    <g filter="url(#s2)" transform="translate(240,55) rotate(6)">
      <rect width="120" height="90" rx="16" fill="url(#cardGrad)"/>
      <rect width="120" height="26" rx="16" fill="#6366f1"/>
      <rect y="16" width="120" height="10" fill="#6366f1"/>
      <text x="60" y="17" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="sans-serif">APPOINTMENT</text>
      <circle cx="18" cy="50" r="10" fill="#e0e7ff"/>
      <text x="18" y="54" textAnchor="middle" fill="#6366f1" fontSize="10" fontWeight="bold" fontFamily="sans-serif">📅</text>
      <rect x="34" y="44" width="72" height="5" rx="2.5" fill="#c7d2fe"/>
      <rect x="34" y="54" width="50" height="5" rx="2.5" fill="#e0e7ff"/>
      <rect x="14" y="68" width="92" height="14" rx="7" fill="url(#btnGrad)"/>
      <text x="60" y="78" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">Confirm Booking</text>
    </g>

    {/* ── Floating stats pill (left) ── */}
    <g filter="url(#s2)" transform="translate(10,160)">
      <rect width="100" height="44" rx="22" fill="white"/>
      <circle cx="22" cy="22" r="14" fill="#dcfce7"/>
      <text x="22" y="27" textAnchor="middle" fontSize="14" fontFamily="sans-serif">✅</text>
      <text x="44" y="18" fill="#374151" fontSize="9" fontWeight="700" fontFamily="sans-serif">Verified</text>
      <text x="44" y="30" fill="#6b7280" fontSize="8" fontFamily="sans-serif">Doctor</text>
    </g>

    {/* ── Floating rating pill (right) ── */}
    <g filter="url(#s2)" transform="translate(255,200)">
      <rect width="90" height="38" rx="19" fill="white"/>
      <text x="14" y="24" fontSize="16" fontFamily="sans-serif">⭐</text>
      <text x="36" y="18" fill="#374151" fontSize="10" fontWeight="700" fontFamily="sans-serif">4.9</text>
      <text x="36" y="30" fill="#6b7280" fontSize="8" fontFamily="sans-serif">Rating</text>
    </g>

    {/* ── Doctor body ── */}
    {/* Lab coat / torso */}
    <g filter="url(#s1)">
      {/* Coat body */}
      <path d="M110,230 Q90,240 80,320 Q78,380 80,405 L300,405 Q302,380 300,320 Q290,240 270,230 L240,220 Q215,260 190,260 Q165,260 140,220 Z"
        fill="url(#coatGrad)" stroke="#c7d2fe" strokeWidth="1.5"/>
      {/* Coat lapels */}
      <path d="M190,260 L165,230 L155,270 Z" fill="#e0e7ff"/>
      <path d="M190,260 L215,230 L225,270 Z" fill="#e0e7ff"/>
      {/* Shirt / scrubs underneath */}
      <path d="M165,230 L155,270 L190,280 L225,270 L215,230 Q200,250 190,250 Q180,250 165,230 Z" fill="#a5b4fc"/>
      {/* Stethoscope */}
      <path d="M155,270 Q145,300 150,320 Q155,340 170,340 Q185,340 185,325" fill="none" stroke="#374151" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="185" cy="322" r="8" fill="#374151"/>
      <circle cx="185" cy="322" r="5" fill="#6366f1"/>
      {/* Pocket */}
      <rect x="200" y="280" width="35" height="28" rx="4" fill="white" opacity="0.6" stroke="#c7d2fe" strokeWidth="1"/>
      <rect x="208" y="275" width="4" height="12" rx="2" fill="#ef4444"/>
      <rect x="215" y="273" width="4" height="14" rx="2" fill="#3b82f6"/>
      <rect x="222" y="276" width="4" height="11" rx="2" fill="#10b981"/>
    </g>

    {/* Neck */}
    <rect x="175" y="185" width="30" height="40" rx="12" fill="url(#skinGrad)"/>

    {/* Head */}
    <g filter="url(#s1)">
      <ellipse cx="190" cy="155" rx="52" ry="58" fill="url(#skinGrad)"/>
      {/* Hair */}
      <path d="M138,145 Q140,90 190,88 Q240,90 242,145 Q230,110 190,108 Q150,110 138,145 Z" fill="#3b2314"/>
      {/* Ears */}
      <ellipse cx="138" cy="158" rx="8" ry="11" fill="#f5b98a"/>
      <ellipse cx="242" cy="158" rx="8" ry="11" fill="#f5b98a"/>
      {/* Eyes */}
      <ellipse cx="172" cy="155" rx="9" ry="10" fill="white"/>
      <ellipse cx="208" cy="155" rx="9" ry="10" fill="white"/>
      <circle cx="174" cy="157" r="5" fill="#3b2314"/>
      <circle cx="210" cy="157" r="5" fill="#3b2314"/>
      <circle cx="176" cy="155" r="2" fill="white"/>
      <circle cx="212" cy="155" r="2" fill="white"/>
      {/* Eyebrows */}
      <path d="M163,143 Q172,138 181,143" fill="none" stroke="#3b2314" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M199,143 Q208,138 217,143" fill="none" stroke="#3b2314" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Smile */}
      <path d="M176,172 Q190,184 204,172" fill="none" stroke="#c0714a" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Nose */}
      <path d="M187,160 Q185,170 190,172 Q195,170 193,160" fill="none" stroke="#c0714a" strokeWidth="1.5" strokeLinecap="round"/>
    </g>

    {/* Arms */}
    {/* Left arm */}
    <path d="M110,240 Q75,270 70,320 Q68,340 80,345 L95,345 Q100,320 108,295 Z" fill="url(#coatGrad)" stroke="#c7d2fe" strokeWidth="1.5"/>
    <ellipse cx="75" cy="348" rx="16" ry="10" fill="url(#skinGrad)"/>
    {/* Right arm - holding clipboard */}
    <path d="M270,240 Q305,270 310,310 Q312,330 300,335 L285,335 Q280,310 272,285 Z" fill="url(#coatGrad)" stroke="#c7d2fe" strokeWidth="1.5"/>
    {/* Clipboard */}
    <g filter="url(#s2)" transform="translate(285,290)">
      <rect width="60" height="78" rx="6" fill="#f8faff" stroke="#c7d2fe" strokeWidth="1.5"/>
      <rect x="20" y="-6" width="20" height="12" rx="4" fill="#6366f1"/>
      <rect x="8" y="14" width="44" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="8" y="24" width="36" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="8" y="34" width="40" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="8" y="44" width="28" height="4" rx="2" fill="#e0e7ff"/>
      <rect x="8" y="58" width="44" height="12" rx="6" fill="url(#btnGrad)"/>
      <text x="30" y="67" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="sans-serif">Book Now</text>
    </g>
    <ellipse cx="308" cy="338" rx="14" ry="9" fill="url(#skinGrad)"/>

    {/* Legs / lower coat */}
    <path d="M140,390 L145,405 L175,405 L178,390 Z" fill="#dde4ff"/>
    <path d="M240,390 L235,405 L205,405 L202,390 Z" fill="#dde4ff"/>
  </svg>
)

const stats = [
  { icon: <Shield size={16} />, label: '500+ Doctors', color: 'text-indigo-500' },
  { icon: <Star size={16} />, label: '4.9 Rating', color: 'text-amber-500' },
  { icon: <Clock size={16} />, label: '24/7 Support', color: 'text-emerald-500' },
]

const Header = () => {
  return (
    <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4F6EF7] via-[#5B6CF5] to-[#7C3AED] px-6 md:px-12 lg:px-16 min-h-[420px] flex items-center'>

      {/* Background decorations */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl' />
        <div className='absolute -bottom-10 -left-10 w-60 h-60 bg-violet-400/20 rounded-full blur-2xl' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl' />
        {/* Grid pattern */}
        <svg className='absolute inset-0 w-full h-full opacity-[0.04]' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
              <path d='M 40 0 L 0 0 0 40' fill='none' stroke='white' strokeWidth='1'/>
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)' />
        </svg>
      </div>

      {/* Left content */}
      <div className='relative z-10 flex-1 py-12 md:py-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6'
        >
          <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
          Trusted by 50,000+ patients
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className='text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight max-w-lg'
        >
          Book Appointments<br />
          <span className='text-indigo-200'>With Trusted Doctors</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className='text-indigo-100 text-sm md:text-base mt-4 max-w-md leading-relaxed'
        >
          Browse our network of verified specialists, pick a time that works for you, and get care — in-person or via video.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className='flex items-center gap-5 mt-6 flex-wrap'
        >
          {stats.map(({ icon, label, color }) => (
            <div key={label} className='flex items-center gap-1.5 text-white/90 text-sm font-medium'>
              <span className={color}>{icon}</span>
              {label}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, type: 'spring', stiffness: 200 }}
          className='flex items-center gap-3 mt-8 flex-wrap'
        >
          <a
            href='#speciality'
            className='flex items-center gap-2 bg-white text-primary px-7 py-3 rounded-xl text-sm font-bold shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
          >
            Book Appointment
            <img className='w-3' src={assets.arrow_icon} alt='' />
          </a>
          <a
            href='/video-consult'
            className='flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/25 transition-all duration-200'
          >
            Video Consult
          </a>
        </motion.div>
      </div>

      {/* Right 3D Illustration */}
      <div className='hidden md:block md:w-[42%] lg:w-[38%] relative self-end'>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='w-full flex justify-center items-end'
        >
          <Doctor3D />
        </motion.div>
      </div>
    </div>
  )
}

export default Header
