import React, { useContext } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'

const SpecialityMenu = () => {
  const { darkMode } = useContext(AppContext)

  return (
    <section className='py-16' id='speciality'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='text-center mb-10'
      >
        <span className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
          Specialities
        </span>
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Find by Speciality
        </h2>
        <p className={`mt-3 text-sm max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Browse our extensive list of trusted doctors and schedule your appointment hassle-free.
        </p>
      </motion.div>

      <div className='flex justify-start sm:justify-center gap-4 overflow-x-auto pb-3 px-1 scrollbar-hide'>
        {specialityData.map((item, index) => (
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
              className={`flex flex-col items-center gap-3 flex-shrink-0 group cursor-pointer`}
            >
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${
                darkMode
                  ? 'bg-gray-800 border border-gray-700 group-hover:border-primary/50 group-hover:bg-gray-700'
                  : 'bg-white border border-gray-100 shadow-sm group-hover:border-primary/30 group-hover:shadow-indigo-100'
              }`}>
                <img className='w-12 sm:w-14 object-contain' src={item.image} alt={item.speciality} />
              </div>
              <p className={`text-xs font-semibold text-center leading-tight max-w-[80px] transition-colors group-hover:text-primary ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.speciality}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default SpecialityMenu
