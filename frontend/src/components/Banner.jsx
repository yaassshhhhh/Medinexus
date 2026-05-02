import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const perks = ['Free cancellation', 'Verified doctors', 'Instant confirmation']

const Banner = () => {
  const navigate = useNavigate()
  const { darkMode } = useContext(AppContext)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
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

      {/* Glow blobs */}
      <div className='absolute -top-16 -right-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-10 left-1/3 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none' />

      <div className='relative z-10 flex flex-col md:flex-row items-center px-8 sm:px-12 md:px-16 py-12 gap-8'>
        {/* Left */}
        <div className='flex-1'>
          <p className='inline-flex items-center gap-2 bg-teal-500/15 border border-teal-500/25 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5'>
            <span className='w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse' />
            100+ Trusted Specialists
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug'>
            Book Appointment<br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300'>
              With Trusted Doctors
            </span>
          </h2>
          <ul className='mt-5 space-y-2'>
            {perks.map(p => (
              <li key={p} className='flex items-center gap-2 text-slate-300 text-sm font-medium'>
                <span className='text-teal-400'>✓</span> {p}
              </li>
            ))}
          </ul>
          <button
            onClick={() => { navigate('/login'); scrollTo(0, 0) }}
            className='mt-8 flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold px-7 py-3 rounded-xl text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-400/40 hover:-translate-y-0.5 transition-all duration-200 group'
          >
            Create Free Account
            <span className='group-hover:translate-x-1 transition-transform inline-block'>→</span>
          </button>
        </div>

        {/* Right image */}
        <div className='hidden md:block md:w-[320px] lg:w-[360px] relative self-end'>
          <img
            className='w-full max-h-64 object-contain object-bottom drop-shadow-2xl'
            src={assets.appointment_img}
            alt='Book appointment'
          />
        </div>
      </div>
    </motion.div>
  )
}

export default Banner
