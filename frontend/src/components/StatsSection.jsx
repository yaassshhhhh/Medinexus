import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import AnimatedCounter from './AnimatedCounter'
import { Building2, UserCheck, CalendarCheck, Video, ArrowRight, ShieldCheck, Star, Zap } from 'lucide-react'
import doctorImg from '../assets/doc2.png'

const steps = [
  {
    num: '01',
    icon: Building2,
    title: 'Choose Department',
    desc: 'Select the specialty you need',
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.25)',
  },
  {
    num: '02',
    icon: UserCheck,
    title: 'Choose Doctor',
    desc: 'Pick the right doctor for you',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.25)',
  },
  {
    num: '03',
    icon: CalendarCheck,
    title: 'Book Appointment',
    desc: 'Select date & time and confirm',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.25)',
  },
  {
    num: '04',
    icon: Video,
    title: 'Get Consultation',
    desc: 'Visit in-person or join online',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.25)',
  },
]

const trustStats = [
  { value: '10,000+', label: 'Patients', icon: '👥' },
  { value: '50+',     label: 'Doctors',  icon: '🩺' },
  { value: '20+',     label: 'Departments', icon: '🏥' },
  { value: '15+',     label: 'Years of Trust', icon: '⭐' },
]

const StatsSection = () => {
  const { darkMode } = useContext(AppContext)

  return (
    <div className='my-12 grid grid-cols-1 md:grid-cols-2 gap-6'>

      {/* ── Healthcare Trust Card ── */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className='relative overflow-hidden rounded-3xl p-7 group'
        style={{
          background: 'linear-gradient(135deg, #0d1b35 0%, #0f2040 60%, #0a1628 100%)',
          border: '1px solid rgba(0,212,255,0.15)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,212,255,0.12), 0 0 0 1px rgba(255,255,255,0.06) inset'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.04) inset'
        }}
      >
        {/* Background decorations */}
        <div className='absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
        <div className='absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

        {/* Top badge */}
        <div className='relative z-10 flex items-center gap-2 mb-5'>
          <div className='flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold'
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
            <ShieldCheck size={11} />
            Verified & Trusted
          </div>
          <div className='flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold'
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
            <Zap size={10} />
            AI Powered
          </div>
        </div>

        <div className='relative z-10 flex flex-col md:flex-row items-start gap-6'>
          <div className='flex-1'>
            <h3 className='text-2xl font-extrabold leading-tight text-white'>
              Healthcare That{' '}
              <span className='relative'>
                <span className='text-transparent bg-clip-text'
                  style={{ backgroundImage: 'linear-gradient(90deg, #00d4ff, #818cf8)' }}>
                  You Can Trust
                </span>
                {/* Underline accent */}
                <span className='absolute -bottom-1 left-0 right-0 h-0.5 rounded-full'
                  style={{ background: 'linear-gradient(90deg, #00d4ff, #818cf8)', opacity: 0.5 }} />
              </span>
            </h3>
            <p className='text-sm mt-3 leading-relaxed' style={{ color: '#8ba3c7', maxWidth: '280px' }}>
              We ensure the best treatment with top doctors and advanced technology — all in one place.
            </p>

            {/* Mini stats grid */}
            <div className='grid grid-cols-2 gap-3 mt-6'>
              {trustStats.map(({ value, label, icon }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className='rounded-2xl p-3.5 cursor-default transition-all duration-200'
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.07)'
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div className='flex items-center gap-1.5 mb-1'>
                    <span className='text-base'>{icon}</span>
                    <p className='text-lg font-extrabold' style={{ color: '#00d4ff' }}>
                      <AnimatedCounter value={value} />
                    </p>
                  </div>
                  <p className='text-xs font-medium' style={{ color: '#8ba3c7' }}>{label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Doctor visual */}
          <motion.div
            whileHover={{ scale: 1.06, y: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className='hidden md:flex w-28 h-36 flex-shrink-0 items-end justify-center rounded-3xl overflow-hidden relative'
            style={{
              background: 'linear-gradient(180deg, rgba(0,212,255,0.15) 0%, rgba(13,27,53,0.9) 100%)',
              border: '1px solid rgba(0,212,255,0.25)',
              boxShadow: '0 8px 32px rgba(0,212,255,0.18)',
            }}
          >
            <img
              src={doctorImg}
              alt='Doctor'
              className='w-full h-full object-cover object-top'
            />
            {/* Verified badge */}
            <div className='absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full'
              style={{ background: 'rgba(0,212,255,0.85)', backdropFilter: 'blur(6px)' }}>
              <ShieldCheck size={8} className='text-white' />
              <span className='text-[8px] text-white font-bold'>MD</span>
            </div>
            {/* Bottom gradient */}
            <div className='absolute bottom-0 left-0 right-0 h-8'
              style={{ background: 'linear-gradient(to top, rgba(13,27,53,0.8), transparent)' }} />
          </motion.div>
        </div>

        {/* Bottom rating strip */}
        <div className='relative z-10 flex items-center gap-2 mt-6 pt-5'
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className='flex -space-x-1.5'>
            {['#00d4ff','#818cf8','#34d399','#f472b6'].map((c, i) => (
              <div key={i} className='w-6 h-6 rounded-full border-2 border-[#0d1b35] flex items-center justify-center text-xs'
                style={{ background: c, opacity: 0.85 }}>
                {['A','B','C','D'][i]}
              </div>
            ))}
          </div>
          <div className='flex items-center gap-1'>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={11} fill='#f59e0b' stroke='none' />
            ))}
          </div>
          <span className='text-xs font-semibold' style={{ color: '#8ba3c7' }}>
            Trusted by <span style={{ color: 'white' }}>10,000+</span> patients
          </span>
        </div>
      </motion.div>

      {/* ── How It Works Card ── */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className='relative overflow-hidden rounded-3xl p-7 group'
        style={{
          background: 'linear-gradient(135deg, #0d1b35 0%, #0f2040 60%, #0a1628 100%)',
          border: '1px solid rgba(129,140,248,0.15)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(129,140,248,0.1), 0 0 0 1px rgba(255,255,255,0.06) inset'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(129,140,248,0.15)'
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.04) inset'
        }}
      >
        {/* Background decoration */}
        <div className='absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 70%)' }} />
        <div className='absolute -bottom-10 -right-10 w-40 h-40 rounded-full pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />

        {/* Header */}
        <div className='relative z-10 flex items-center justify-between mb-7'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-1 h-5 rounded-full'
                style={{ background: 'linear-gradient(180deg, #818cf8, #00d4ff)' }} />
              <h3 className='text-xl font-extrabold text-white'>How It Works</h3>
            </div>
            <p className='text-xs ml-3' style={{ color: '#8ba3c7' }}>4 simple steps to your consultation</p>
          </div>
          <div className='px-3 py-1.5 rounded-full text-xs font-semibold'
            style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)', color: '#818cf8' }}>
            Quick & Easy
          </div>
        </div>

        {/* Steps */}
        <div className='relative z-10 grid grid-cols-2 gap-4'>
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.04, y: -3 }}
                className='relative rounded-2xl p-4 cursor-default transition-all duration-200 group/step'
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `rgba(${step.color === '#00d4ff' ? '0,212,255' : step.color === '#818cf8' ? '129,140,248' : step.color === '#34d399' ? '52,211,153' : '244,114,182'},0.07)`
                  e.currentTarget.style.borderColor = step.color + '40'
                  e.currentTarget.style.boxShadow = `0 4px 20px ${step.glow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Step number top-right */}
                <span className='absolute top-3 right-3 text-xs font-bold opacity-30' style={{ color: step.color }}>
                  {step.num}
                </span>

                {/* Icon circle */}
                <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover/step:scale-110'
                  style={{
                    background: `linear-gradient(135deg, ${step.color}22, ${step.color}11)`,
                    border: `1px solid ${step.color}33`,
                    boxShadow: `0 4px 12px ${step.glow}`,
                  }}>
                  <Icon size={18} style={{ color: step.color }} />
                </div>

                <p className='text-sm font-bold text-white leading-tight mb-1'>{step.title}</p>
                <p className='text-xs leading-snug' style={{ color: '#8ba3c7' }}>{step.desc}</p>

                {/* Arrow for non-last items */}
                {i < steps.length - 1 && (
                  <div className='absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex'>
                    {(i === 1) && (
                      <div className='w-4 h-4 rounded-full flex items-center justify-center'
                        style={{ background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)' }}>
                        <ArrowRight size={8} style={{ color: '#818cf8' }} />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className='relative z-10 flex items-center justify-between mt-6 pt-5'
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className='text-xs' style={{ color: '#8ba3c7' }}>
            Ready to get started?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className='flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all'
            style={{
              background: 'linear-gradient(135deg, #818cf8, #6366f1)',
              color: 'white',
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            Book Now <ArrowRight size={12} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default StatsSection
