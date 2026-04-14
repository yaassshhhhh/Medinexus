import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors, darkMode } = useContext(AppContext)

  return (
    <section className='py-4'>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8'
      >
        <div>
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
            Top Rated
          </span>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Top Doctors to Book
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Verified specialists ready to help you today.
          </p>
        </div>
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors group flex-shrink-0 ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-primary hover:text-indigo-700'}`}
        >
          View all doctors
          <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
        </button>
      </motion.div>

      {/* Doctor grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {doctors.slice(0, 10).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            className={`rounded-2xl overflow-hidden cursor-pointer card-hover border group ${
              darkMode ? 'bg-gray-800 border-gray-700/60' : 'bg-white border-gray-100'
            }`}
          >
            {/* Image */}
            <div className={`relative overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-b from-indigo-50 to-indigo-100/50'}`}>
              <img
                className='w-full h-44 object-cover object-top group-hover:scale-105 transition-transform duration-500'
                src={item.image}
                alt={item.name}
              />
              <div className='absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-green-600 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm'>
                <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' />
                Available
              </div>
            </div>

            {/* Info */}
            <div className='p-3.5'>
              <p className={`font-bold text-sm leading-tight group-hover:text-primary transition-colors ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {item.name}
              </p>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.speciality}
              </p>
              <div className={`mt-3 pt-3 border-t flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                  Book Now
                </span>
                <ArrowRight size={13} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:text-primary group-hover:translate-x-0.5 transition-all`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default TopDoctors
