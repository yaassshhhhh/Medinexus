import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const steps = [
  {
    num: '1',
    icon: '⊞',
    title: 'Choose Department',
    desc: 'Select the department you want to consult',
  },
  {
    num: '2',
    icon: '👤',
    title: 'Choose Doctor',
    desc: 'Pick a doctor based on your needs',
  },
  {
    num: '3',
    icon: '📅',
    title: 'Book Appointment',
    desc: 'Select date & time and book',
  },
  {
    num: '4',
    icon: '🎥',
    title: 'Visit & Get Consultation',
    desc: 'Visit hospital or join online consultation',
  },
]

const trustStats = [
  { value: '10,000+', label: 'Patients' },
  { value: '50+',     label: 'Doctors' },
  { value: '20+',     label: 'Departments' },
  { value: '15+',     label: 'Years of Trust' },
]

const StatsSection = () => {
  const { darkMode } = useContext(AppContext)

  const card = darkMode
    ? 'bg-[#0d1f3c] border border-white/10'
    : 'bg-white border border-gray-100 shadow-sm'

  const subText = darkMode ? 'text-slate-400' : 'text-slate-500'
  const headText = darkMode ? 'text-gray-100' : 'text-gray-900'

  return (
    <div className='my-10 grid grid-cols-1 md:grid-cols-2 gap-5'>

      {/* ── Healthcare Trust Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='relative overflow-hidden rounded-2xl p-7 bg-[#0f1629] border border-[#1e2d4a]
          transition-all duration-300
          hover:-translate-y-1
          hover:border-cyan-500/30
          hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]
          group'
      >
        {/* Glow */}
        <div className='absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/20 transition-colors duration-500' />

        <div className='relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6'>
          <div className='flex-1'>
            <h3 className='text-xl font-bold leading-snug text-gray-100'>
              Healthcare That{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400'>
                You Can Trust
              </span>
            </h3>
            <p className='text-sm mt-2 max-w-xs text-slate-400'>
              We ensure the best treatment with top doctors and advanced technology.
            </p>

            {/* Mini stats */}
            <div className='grid grid-cols-2 gap-3 mt-6'>
              {trustStats.map(({ value, label }) => (
                <div key={label} className='rounded-xl p-3 bg-white/5 border border-white/[0.08] hover:border-cyan-500/20 transition-colors'>
                  <p className='text-lg font-bold text-cyan-400'>{value}</p>
                  <p className='text-xs text-slate-400'>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shield icon */}
          <div className='hidden md:flex w-28 h-28 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-600/20 border border-teal-500/20 text-5xl group-hover:scale-105 transition-transform duration-300'>
            🛡️
          </div>
        </div>
      </motion.div>

      {/* ── How It Works Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className='rounded-2xl p-7 bg-[#0f1629] border border-[#1e2d4a]
          transition-all duration-300
          hover:-translate-y-1
          hover:border-cyan-500/30
          hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]
          group'
      >
        <h3 className='text-xl font-bold mb-6 text-gray-100'>How It Works</h3>

        <div className='grid grid-cols-2 gap-4'>
          {steps.map((step, i) => (
            <div key={i} className='flex flex-col gap-2 group/step'>
              {/* Step number + icon */}
              <div className='flex items-center gap-2'>
                <span className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-teal-500 to-cyan-500'>
                  {step.num}
                </span>
                <span className='text-xl group-hover:scale-110 transition-transform duration-200'>{step.icon}</span>
              </div>
              <p className='text-sm font-semibold text-gray-100'>{step.title}</p>
              <p className='text-xs leading-snug text-slate-400'>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Step arrows row */}
        <div className='hidden md:flex items-center justify-between mt-4 px-2'>
          {steps.map((_, i) => i < steps.length - 1 && (
            <span key={i} className='text-cyan-500 text-lg'>→</span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default StatsSection
