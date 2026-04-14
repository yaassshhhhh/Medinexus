import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { CheckCircle2, Star, Users, Heart, Award, Clock } from 'lucide-react'
import { AppContext } from '../context/AppContext'

const stats = [
  { value: '50K+', label: 'Patients Served', icon: <Users size={20} /> },
  { value: '500+', label: 'Verified Doctors', icon: <Award size={20} /> },
  { value: '4.9★', label: 'Average Rating', icon: <Star size={20} /> },
  { value: '24/7', label: 'Support', icon: <Clock size={20} /> },
]

const whyUs = [
  { title: 'Efficiency', text: 'Streamlined appointment scheduling that fits into your busy lifestyle.', icon: <CheckCircle2 size={24} />, color: 'from-blue-500 to-indigo-600' },
  { title: 'Convenience', text: 'Access to a network of trusted healthcare professionals in your area.', icon: <Users size={24} />, color: 'from-violet-500 to-purple-600' },
  { title: 'Personalization', text: 'Tailored recommendations and reminders to help you stay on top of your health.', icon: <Heart size={24} />, color: 'from-pink-500 to-rose-600' },
]

const About = () => {
  const { darkMode } = useContext(AppContext)

  return (
    <div className='pb-20'>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='text-center pt-12 pb-4'>
        <span className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
          Our Story
        </span>
        <h1 className={`text-4xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          About <span className='gradient-text'>Rogveda</span>
        </h1>
        <p className={`mt-3 text-base max-w-xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Revolutionizing healthcare accessibility through AI-powered technology and compassionate care.
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 my-10 p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100'}`}
      >
        {stats.map(({ value, label, icon }) => (
          <div key={label} className='text-center'>
            <div className={`flex justify-center mb-2 ${darkMode ? 'text-indigo-400' : 'text-primary'}`}>{icon}</div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{value}</p>
            <p className={`text-xs font-medium mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Story section */}
      <div className='flex flex-col md:flex-row gap-10 items-center my-10'>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='w-full md:w-2/5'
        >
          <div className='relative'>
            <img className='w-full rounded-2xl shadow-2xl object-cover' src={assets.about_image} alt='About Rogveda' />
            <div className={`absolute -bottom-4 -right-4 px-5 py-4 rounded-2xl shadow-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>10+</p>
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Years of Excellence</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className='flex-1 space-y-5'
        >
          <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Welcome to <span className='font-bold text-primary'>MediNexus Ai</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. We connect patients with verified specialists through a seamless digital experience.
          </p>
          <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We continuously strive to enhance our platform, integrating the latest advancements in AI to improve user experience and deliver superior healthcare coordination.
          </p>

          <div className={`p-5 rounded-2xl border-l-4 border-primary ${darkMode ? 'bg-gray-800/60 border border-gray-700' : 'bg-indigo-50/60 border border-indigo-100'}`}>
            <p className={`font-bold text-base mb-1.5 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Our Vision</p>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              To create a seamless healthcare experience for every user — bridging the gap between patients and providers through intelligent technology.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Why choose us */}
      <div className='mt-16'>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='text-center mb-10'>
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
            Why Us
          </span>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Why Choose MediNexus?</h2>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {whyUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={`group rounded-2xl p-7 border cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                darkMode ? 'bg-gray-800 border-gray-700 hover:border-primary/40' : 'bg-white border-gray-100 hover:border-primary/20 hover:shadow-indigo-100/60'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{item.title}</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
