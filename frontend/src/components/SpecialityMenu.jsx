import React, { useContext } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'

// Icon map for specialities
const specialityIcons = {
  'General physician': { icon: '🩺', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', text: 'Consult general physicians online' },
  'Gynecologist':      { icon: '🌸', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', text: 'Women\'s health specialist' },
  'Dermatologist':     { icon: '✨', color: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30', text: 'Skin & hair specialist' },
  'Pediatricians':     { icon: '👶', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', text: 'Child healthcare specialist' },
  'Neurologist':       { icon: '🧠', color: 'from-teal-500/20 to-emerald-500/20', border: 'border-teal-500/30', text: 'Brain & nervous system expert' },
  'Gastroenterologist':{ icon: '💊', color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', text: 'Digestive system specialist' },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const SpecialityMenu = () => {
  const { darkMode } = useContext(AppContext)

  return (
    <section className='py-10' id='speciality'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className='mb-8'
      >
        <p className='text-xs font-bold uppercase tracking-widest mb-2 text-cyan-400'>
          Specialities
        </p>
        <h2 className='text-2xl font-bold text-gray-100'>
          Browse by Speciality
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, margin: '-40px' }}
        className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'
      >
        {specialityData.map((item, index) => {
          const meta = specialityIcons[item.speciality] || { icon: '🏥', color: 'from-slate-500/20 to-gray-500/20', border: 'border-slate-500/30', text: 'Specialist consultation' }
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <Link
                onClick={() => scrollTo(0, 0)}
                to={`/doctors/${item.speciality}`}
                className={`group flex flex-col items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl border
                  bg-[#0f1629] border-[#1e2d4a]
                  transition-colors duration-300
                  hover:border-cyan-500/40
                  hover:shadow-[0_0_24px_rgba(6,182,212,0.12)]
                  hover:bg-[#0d1b3e]`}
              >
                {/* Icon box — glows on hover */}
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${meta.color} border ${meta.border}
                    flex items-center justify-center text-xl sm:text-2xl shadow-lg`}
                >
                  {meta.icon}
                </motion.div>
                <div>
                  <p className='text-xs sm:text-sm font-bold leading-tight text-gray-100 group-hover:text-cyan-400 transition-colors duration-300'>
                    {item.speciality}
                  </p>
                  <p className='text-[10px] sm:text-xs mt-0.5 sm:mt-1 leading-snug text-slate-500 hidden sm:block'>
                    {meta.text}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

export default SpecialityMenu
