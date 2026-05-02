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

const SpecialityMenu = () => {
  const { darkMode } = useContext(AppContext)

  return (
    <section className='py-10' id='speciality'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='mb-8'
      >
        <p className='text-xs font-bold uppercase tracking-widest mb-2 text-cyan-400'>
          Specialities
        </p>
        <h2 className='text-2xl font-bold text-gray-100'>
          Browse by Speciality
        </h2>
      </motion.div>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
        {specialityData.map((item, index) => {
          const meta = specialityIcons[item.speciality] || { icon: '🏥', color: 'from-slate-500/20 to-gray-500/20', border: 'border-slate-500/30', text: 'Specialist consultation' }
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.4 }}
            >
              <Link
                onClick={() => scrollTo(0, 0)}
                to={`/doctors/${item.speciality}`}
                className={`group flex flex-col items-start gap-3 p-4 rounded-2xl border
                  bg-[#0f1629] border-[#1e2d4a]
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:border-cyan-500/40
                  hover:shadow-[0_0_24px_rgba(6,182,212,0.12)]
                  hover:bg-[#0d1b3e]`}
              >
                {/* Icon box — glows on hover */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} border ${meta.border}
                  flex items-center justify-center text-2xl
                  group-hover:scale-110 group-hover:shadow-lg transition-transform duration-300`}>
                  {meta.icon}
                </div>
                <div>
                  <p className='text-sm font-bold leading-tight text-gray-100 group-hover:text-cyan-400 transition-colors duration-300'>
                    {item.speciality}
                  </p>
                  <p className='text-xs mt-1 leading-snug text-slate-500'>
                    {meta.text}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default SpecialityMenu
