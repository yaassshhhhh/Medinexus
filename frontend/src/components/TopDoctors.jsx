import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.93 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors, darkMode } = useContext(AppContext)

  return (
    <section className='py-4'>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8'
      >
        <div>
          <span className='inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'>
            Top Rated
          </span>
          <h2 className='text-3xl font-bold text-gray-100'>
            Top Doctors to Book
          </h2>
          <p className='mt-2 text-sm text-gray-500'>
            Verified specialists ready to help you today.
          </p>
        </div>
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
          className='flex items-center gap-2 text-sm font-semibold transition-colors group flex-shrink-0 text-cyan-400 hover:text-cyan-300'
        >
          View all doctors
          <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
        </button>
      </motion.div>

      {/* Doctor grid */}
      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-40px' }}
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'
      >
        {doctors.slice(0, 10).map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            className='relative rounded-2xl overflow-hidden cursor-pointer border border-[#1e2d4a] bg-[#0f1629] group
              transition-colors duration-300
              hover:border-cyan-500/40
              hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
          >
            {/* Glow overlay on hover */}
            <div className='absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10' />

            {/* Image */}
            <div className='relative overflow-hidden bg-[#0d1b3e]'>
              {item.image ? (
                <img
                  className='w-full h-32 sm:h-40 md:h-48 object-cover object-top group-hover:scale-105 transition-transform duration-500'
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                />
              ) : (
                <div className='w-full h-48 bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center'>
                  <span className='text-white text-5xl font-bold'>{item.name?.charAt(0) || 'D'}</span>
                </div>
              )}
              <div className='absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-green-400 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/30'>
                <span className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
                Available
              </div>
            </div>

            {/* Info */}
            <div className='p-3.5 relative z-20'>
              <p className='font-bold text-sm leading-tight text-gray-100 group-hover:text-cyan-400 transition-colors duration-300'>
                {item.name}
              </p>
              <p className='text-xs mt-0.5 text-gray-500'>
                {item.speciality}
              </p>

              {/* Rating */}
              <div className='flex items-center gap-1 mt-2'>
                <span className='text-yellow-400 text-xs'>⭐</span>
                <span className='text-xs font-semibold text-gray-300'>
                  {item.rating || 4.5}
                </span>
              </div>

              <div className='mt-3 pt-3 border-t border-[#1e2d4a] flex items-center justify-between'>
                <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors'>
                  Book Now
                </span>
                <ArrowRight size={13} className='text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300' />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default TopDoctors
