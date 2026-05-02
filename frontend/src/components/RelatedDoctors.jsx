import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
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
          <span className='inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'>
            Same Specialty
          </span>
          <h2 className='text-2xl font-bold text-gray-100'>Related Doctors</h2>
        </div>
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
          className='flex items-center gap-1.5 text-sm font-semibold group transition-colors text-cyan-400 hover:text-cyan-300'
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
            className='relative rounded-2xl overflow-hidden cursor-pointer group border border-[#1e2d4a] bg-[#0f1629]
              transition-all duration-300
              hover:-translate-y-2
              hover:border-cyan-500/40
              hover:shadow-[0_0_24px_rgba(6,182,212,0.12)]'
          >
            {/* Glow overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10' />

            <div className='relative overflow-hidden aspect-[3/4] bg-[#0d1b3e]'>
              <img
                className='w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500'
                src={item.image}
                alt={item.name}
              />
              <div className='absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30'>
                <span className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' /> Available
              </div>
            </div>

            <div className='p-3 relative z-20'>
              <p className='font-bold text-sm text-gray-100 group-hover:text-cyan-400 transition-colors duration-300 truncate'>{item.name}</p>
              <p className='text-xs mt-0.5 text-gray-500 truncate'>{item.speciality}</p>
              <div className='mt-2.5 pt-2.5 border-t border-[#1e2d4a] flex items-center justify-between'>
                <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors'>
                  Book
                </span>
                <ArrowRight size={12} className='text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-300' />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default RelatedDoctors
