import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors, darkMode } = useContext(AppContext)
  const navigate = useNavigate()
  const [relDoc, setRelDocs] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      setRelDocs(doctors.filter(doc => doc.speciality === speciality && doc._id !== docId))
    }
  }, [doctors, speciality, docId])

  if (relDoc.length === 0) return null

  return (
    <section>
      <div className='flex items-end justify-between mb-6'>
        <div>
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
            Same Specialty
          </span>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Related Doctors</h2>
        </div>
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
          className={`flex items-center gap-1.5 text-sm font-semibold group transition-colors ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-primary hover:text-indigo-700'}`}
        >
          View all <ArrowRight size={14} className='group-hover:translate-x-0.5 transition-transform' />
        </button>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {relDoc.slice(0, 5).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07 }}
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            className={`rounded-2xl overflow-hidden cursor-pointer group border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${
              darkMode ? 'bg-gray-800 border-gray-700 hover:border-primary/40' : 'bg-white border-gray-100 hover:border-primary/20 hover:shadow-indigo-100/60'
            }`}
          >
            <div className={`relative overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-b from-indigo-50 to-indigo-100/30'}`}>
              <img className='w-full h-40 object-cover object-top group-hover:scale-105 transition-transform duration-500' src={item.image} alt={item.name} />
              <div className='absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full'>
                <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' /> Available
              </div>
            </div>
            <div className='p-3'>
              <p className={`font-bold text-sm group-hover:text-primary transition-colors truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{item.name}</p>
              <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.speciality}</p>
              <div className={`mt-2.5 pt-2.5 border-t flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${darkMode ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>Book</span>
                <ArrowRight size={12} className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:text-primary transition-colors`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default RelatedDoctors
