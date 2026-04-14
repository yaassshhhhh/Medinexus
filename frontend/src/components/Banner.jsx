import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
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
      className='relative overflow-hidden rounded-2xl my-16 bg-gradient-to-br from-[#4F6EF7] to-[#7C3AED]'
    >
      {/* Decorative blobs */}
      <div className='absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-10 left-1/3 w-48 h-48 bg-violet-300/20 rounded-full blur-2xl pointer-events-none' />

      <div className='relative z-10 flex flex-col md:flex-row items-center px-8 sm:px-12 md:px-16 py-12 gap-8'>
        {/* Left */}
        <div className='flex-1'>
          <p className='inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5'>
            <span className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
            100+ Trusted Specialists
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug'>
            Book Appointment<br />
            <span className='text-indigo-200'>With Trusted Doctors</span>
          </h2>
          <ul className='mt-5 space-y-2'>
            {perks.map(p => (
              <li key={p} className='flex items-center gap-2 text-indigo-100 text-sm font-medium'>
                <CheckCircle size={15} className='text-green-400 flex-shrink-0' /> {p}
              </li>
            ))}
          </ul>
          <button
            onClick={() => { navigate('/login'); scrollTo(0, 0) }}
            className='mt-8 flex items-center gap-2 bg-white text-primary font-bold px-7 py-3 rounded-xl text-sm shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group'
          >
            Create Free Account
            <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
          </button>
        </div>

        {/* Right image */}
        <div className='hidden md:block md:w-[340px] lg:w-[380px] relative self-end'>
          <img
            className='w-full max-h-72 object-contain object-bottom drop-shadow-2xl'
            src={assets.appointment_img}
            alt='Book appointment'
          />
        </div>
      </div>
    </motion.div>
  )
}

export default Banner
