import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import {
  ShieldCheck, CalendarCheck, Lock, Clock, Cpu, Wallet,
  Users, Award, Star, Headphones, Target, Linkedin
} from 'lucide-react'
import { AppContext } from '../context/AppContext'

/* ─── Data ─────────────────────────────────────────────── */
const stats = [
  { value: '50K+',  label: 'Patients Served',   icon: <Users size={22} /> },
  { value: '150+',  label: 'Verified Doctors',   icon: <Award size={22} /> },
  { value: '4.9/5', label: 'Average Rating',     icon: <Star  size={22} /> },
  { value: '24/7',  label: 'Support',            icon: <Headphones size={22} /> },
]

const whyUs = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Verified Doctors',
    text: 'All doctors are carefully verified and experienced.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: <CalendarCheck size={22} />,
    title: 'Easy Appointments',
    text: 'Book appointments in just a few clicks.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: <Lock size={22} />,
    title: 'Secure & Private',
    text: 'Your data is safe with our advanced security.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: <Clock size={22} />,
    title: '24/7 Support',
    text: 'Our support team is always here to help you.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Advanced Technology',
    text: 'We use the latest technology for better healthcare.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: <Wallet size={22} />,
    title: 'Affordable Care',
    text: 'Quality healthcare that fits your budget.',
    color: 'from-pink-500 to-rose-600',
  },
]

const leadership = [
  {
    name: 'Dr. Rajeev Mehta',
    role: 'Chief Executive Officer',
    roleColor: 'text-cyan-400',
    bio: 'Healthcare leader with 15+ years of experience.',
    img: null,
  },
  {
    name: 'Dr. Anjali Sharma',
    role: 'Chief Medical Officer',
    roleColor: 'text-cyan-400',
    bio: 'Expert in patient care and medical operations.',
    img: null,
  },
  {
    name: 'Vikram Malhotra',
    role: 'CTO',
    roleColor: 'text-orange-400',
    bio: 'Tech enthusiast driving innovation in healthcare.',
    img: null,
  },
  {
    name: 'Neha Verma',
    role: 'Head of Operations',
    roleColor: 'text-orange-400',
    bio: 'Ensures seamless experience for patients and doctors.',
    img: null,
  },
]

/* ─── Helpers ───────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
})

/* ─── Component ─────────────────────────────────────────── */
const About = () => {
  const { darkMode } = useContext(AppContext)

  /* colour tokens – always dark-navy on this page to match design */
  const bg       = 'bg-[#0a0f1e]'
  const cardBg   = 'bg-[#0f1629]'
  const border   = 'border-[#1e2d4a]'
  const textPri  = 'text-white'
  const textSec  = 'text-gray-400'

  return (
    <div className={`${bg} min-h-screen pb-24 -mx-4 sm:-mx-[8%] px-4 sm:px-[8%]`}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <motion.div
        {...fadeUp()}
        className='relative overflow-hidden rounded-2xl mt-8 mb-10 px-8 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10'
        style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #0a0f1e 60%)' }}
      >
        {/* Glow blobs */}
        <div className='absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none' />
        <div className='absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none' />

        {/* Text */}
        <div className='relative z-10 flex-1 text-center md:text-left'>
          <span className='inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 mb-5'>
            <ShieldCheck size={12} /> Trusted by 50,000+ patients
          </span>
          <h1 className={`text-4xl md:text-5xl font-extrabold leading-tight ${textPri}`}>
            About{' '}
            <span className='gradient-text'>MediNexus AI</span>
          </h1>
          <p className={`mt-4 text-base max-w-lg ${textSec}`}>
            MediNexus AI is committed to providing world-class healthcare with compassion,
            innovation, and excellence. We connect patients with trusted doctors and ensure
            a seamless healthcare experience.
          </p>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className='relative z-10 w-full md:w-2/5 flex justify-center'
        >
          <img
            src={assets.about_image}
            alt='About MediNexus AI'
            className='w-full max-w-sm rounded-2xl shadow-2xl object-cover'
          />
          {/* floating badge */}
          <div className={`absolute -bottom-4 -left-4 px-4 py-3 rounded-xl shadow-xl border ${cardBg} ${border}`}>
            <p className={`text-xl font-bold ${textPri}`}>10+</p>
            <p className={`text-xs ${textSec}`}>Years of Excellence</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Stats bar ────────────────────────────────────── */}
      <motion.div
        {...fadeUp(0.1)}
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 rounded-2xl border ${cardBg} ${border}`}
      >
        {stats.map(({ value, label, icon }) => (
          <div key={label} className='text-center'>
            <div className='flex justify-center mb-2 text-cyan-400'>{icon}</div>
            <p className={`text-2xl font-bold ${textPri}`}>{value}</p>
            <p className={`text-xs font-medium mt-0.5 ${textSec}`}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Our Story + Our Mission ───────────────────────── */}
      <motion.div
        {...fadeUp(0.15)}
        className={`flex flex-col lg:flex-row gap-6 mb-12 rounded-2xl border overflow-hidden ${cardBg} ${border}`}
      >
        {/* Story – left */}
        <div className='flex flex-col sm:flex-row gap-6 flex-1 p-7'>
          {/* building image placeholder */}
          <div className='w-full sm:w-40 h-40 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-[#0d1b3e] flex items-center justify-center'>
            <img
              src={assets.about_image}
              alt='Our Story'
              className='w-full h-full object-cover opacity-80'
            />
          </div>
          <div>
            <h2 className={`text-xl font-bold mb-3 ${textPri}`}>
              Our <span className='gradient-text'>Story</span>
            </h2>
            <p className={`text-sm leading-relaxed mb-3 ${textSec}`}>
              Founded with a vision to make quality healthcare accessible to everyone,
              MediNexus AI leverages technology and expertise to bridge the gap between
              patients and healthcare providers.
            </p>
            <p className={`text-sm leading-relaxed ${textSec}`}>
              We continuously strive to enhance our platform and services to deliver the
              best possible care.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className={`hidden lg:block w-px ${border} bg-[#1e2d4a]`} />

        {/* Mission – right */}
        <div className='flex-1 p-7 flex flex-col justify-center'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg'>
              <Target size={18} className='text-white' />
            </div>
            <h2 className={`text-xl font-bold ${textPri}`}>Our Mission</h2>
          </div>
          <p className={`text-sm leading-relaxed ${textSec}`}>
            To provide accessible, affordable, and personalized healthcare to everyone
            through innovative technology and compassionate care.
          </p>
        </div>
      </motion.div>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <div className='mb-16'>
        <motion.div {...fadeUp(0.1)} className='text-center mb-10'>
          <p className={`text-sm ${textSec} mb-1`}>— Why</p>
          <h2 className={`text-3xl font-bold ${textPri}`}>
            Why <span className='gradient-text'>Choose Us</span>
          </h2>
          {/* decorative line */}
          <div className='flex items-center justify-center gap-2 mt-3'>
            <div className='h-px w-16 bg-gradient-to-r from-transparent to-cyan-500' />
            <div className='w-2 h-2 rounded-full bg-cyan-400' />
            <div className='h-px w-16 bg-gradient-to-l from-transparent to-cyan-500' />
          </div>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {whyUs.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.08)}
              className={`group rounded-2xl p-6 border cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20 ${cardBg} ${border} hover:border-blue-500/30`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className={`text-base font-bold mb-1.5 ${textPri}`}>{item.title}</h3>
              <p className={`text-sm leading-relaxed ${textSec}`}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Our Leadership ───────────────────────────────── */}
      <div>
        <motion.div {...fadeUp(0.1)} className='text-center mb-10'>
          <h2 className={`text-3xl font-bold ${textPri}`}>
            Our <span className='gradient-text'>Leadership</span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {leadership.map((person, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className={`group rounded-2xl p-6 border text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20 ${cardBg} ${border} hover:border-blue-500/30`}
            >
              {/* Avatar */}
              <div className='w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg'>
                {person.img
                  ? <img src={person.img} alt={person.name} className='w-full h-full object-cover' />
                  : <span className='text-2xl font-bold text-white'>
                      {person.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </span>
                }
              </div>

              <h3 className={`text-base font-bold ${textPri}`}>{person.name}</h3>
              <p className={`text-xs font-semibold mt-0.5 mb-2 ${person.roleColor}`}>{person.role}</p>
              <p className={`text-xs leading-relaxed ${textSec}`}>{person.bio}</p>

              {/* LinkedIn icon */}
              <div className='mt-4 flex justify-center'>
                <button
                  aria-label={`${person.name} LinkedIn`}
                  className='w-8 h-8 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 flex items-center justify-center transition-colors'
                >
                  <Linkedin size={14} className='text-blue-400' />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default About
