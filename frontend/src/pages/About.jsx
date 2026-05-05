import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import {
  ShieldCheck, CalendarCheck, Lock, Clock, Cpu, Wallet,
  Users, Award, Star, Target, Linkedin, Twitter, Mail,
  Stethoscope, Code2, Settings, HeartPulse
} from 'lucide-react'
import { AppContext } from '../context/AppContext'
import doc4 from '../assets/doc4.png'
import doc5 from '../assets/doc5.png'
import doc7 from '../assets/doc7.png'
import doc9 from '../assets/doc9.png'

/* ─── Data ─────────────────────────────────────────────── */
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
    dept: 'Leadership',
    bio: 'Healthcare visionary with 15+ years driving patient-first innovation across India\'s top hospital networks.',
    img: doc4,
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6,182,212,0.25)',
    border: 'rgba(6,182,212,0.35)',
    tag: 'CEO',
    tagColor: '#00d4ff',
    icon: HeartPulse,
    stats: [{ label: 'Experience', value: '15+ yrs' }, { label: 'Hospitals', value: '20+' }],
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Dr. Anjali Sharma',
    role: 'Chief Medical Officer',
    dept: 'Medical',
    bio: 'Board-certified physician specializing in preventive care and digital health transformation.',
    img: doc5,
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.25)',
    border: 'rgba(139,92,246,0.35)',
    tag: 'CMO',
    tagColor: '#a78bfa',
    icon: Stethoscope,
    stats: [{ label: 'Patients', value: '10K+' }, { label: 'Research', value: '30+ papers' }],
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Vikram Malhotra',
    role: 'Chief Technology Officer',
    dept: 'Technology',
    bio: 'Full-stack architect and AI enthusiast building the future of healthcare technology at scale.',
    img: doc7,
    gradient: 'from-orange-500 to-amber-500',
    glow: 'rgba(249,115,22,0.25)',
    border: 'rgba(249,115,22,0.35)',
    tag: 'CTO',
    tagColor: '#fb923c',
    icon: Code2,
    stats: [{ label: 'Products', value: '12+' }, { label: 'Engineers', value: '50+' }],
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Neha Verma',
    role: 'Head of Operations',
    dept: 'Operations',
    bio: 'Operations strategist ensuring seamless care delivery for thousands of patients every day.',
    img: doc9,
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.25)',
    border: 'rgba(16,185,129,0.35)',
    tag: 'COO',
    tagColor: '#34d399',
    icon: Settings,
    stats: [{ label: 'Cities', value: '25+' }, { label: 'Uptime', value: '99.9%' }],
    linkedin: '#',
    twitter: '#',
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
  const [doctorAnim, setDoctorAnim] = useState(null)

  useEffect(() => {
    fetch('https://assets10.lottiefiles.com/packages/lf20_5njp3vgg.json')
      .then(r => r.json())
      .then(setDoctorAnim)
      .catch(() => setDoctorAnim(null))
  }, [])

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
        className='relative overflow-hidden rounded-2xl mt-6 sm:mt-8 mb-10 px-4 sm:px-8 py-8 sm:py-12 md:py-16 flex flex-col md:flex-row items-center gap-6 md:gap-10'
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
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight ${textPri}`}>
            About{' '}
            <span className='gradient-text'>MediNexus AI</span>
          </h1>
          <p className={`mt-4 text-base max-w-lg ${textSec}`}>
            MediNexus AI is committed to providing world-class healthcare with compassion,
            innovation, and excellence. We connect patients with trusted doctors and ensure
            a seamless healthcare experience.
          </p>
        </div>

        {/* Hero Lottie animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className='relative z-10 w-full md:w-2/5 flex justify-center'
        >
          <div className='w-full max-w-xs h-52 md:h-60 flex items-center justify-center'>
            {doctorAnim
              ? <Lottie animationData={doctorAnim} loop autoplay style={{ width: '100%', height: '100%' }} />
              : <div className='w-full h-full rounded-2xl bg-blue-900/20 animate-pulse' />
            }
          </div>
          {/* floating badges */}
          {/* Bottom-left: Years of Excellence */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute -bottom-4 left-0 sm:-left-4 px-3 py-2 rounded-xl shadow-xl border ${cardBg} ${border} flex items-center gap-2`}
          >
            <Award size={16} className='text-cyan-400' />
            <div>
              <p className={`text-lg font-bold ${textPri}`}>10+</p>
              <p className={`text-[10px] ${textSec}`}>Years of Excellence</p>
            </div>
          </motion.div>

          {/* Top-right: Verified Doctors */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className={`absolute -top-4 right-0 sm:-right-4 px-3 py-2 rounded-xl shadow-xl border ${cardBg} ${border} flex items-center gap-2`}
          >
            <ShieldCheck size={16} className='text-emerald-400' />
            <div>
              <p className={`text-lg font-bold ${textPri}`}>150+</p>
              <p className={`text-[10px] ${textSec}`}>Verified Doctors</p>
            </div>
          </motion.div>

          {/* Bottom-right: Patients Served */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            className={`absolute -bottom-4 right-0 sm:-right-4 px-3 py-2 rounded-xl shadow-xl border ${cardBg} ${border} flex items-center gap-2`}
          >
            <Users size={16} className='text-violet-400' />
            <div>
              <p className={`text-lg font-bold ${textPri}`}>50K+</p>
              <p className={`text-[10px] ${textSec}`}>Patients Served</p>
            </div>
          </motion.div>

          {/* Mid-left: Rating — hidden on small mobile */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-6 px-3 py-2 rounded-xl shadow-xl border ${cardBg} ${border} items-center gap-2`}
          >
            <Star size={16} className='text-yellow-400' />
            <div>
              <p className={`text-lg font-bold ${textPri}`}>4.9★</p>
              <p className={`text-[10px] ${textSec}`}>Avg Rating</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Our Story + Our Mission ───────────────────────── */}
      <motion.div
        {...fadeUp(0.15)}
        className={`flex flex-col lg:flex-row gap-6 mb-12 rounded-2xl border overflow-hidden ${cardBg} ${border}`}
      >
        {/* Story – left */}
        <div className='flex flex-col sm:flex-row gap-6 flex-1 p-7'>
          {/* building image placeholder */}
          <div className='w-full sm:w-40 h-40 sm:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 flex items-center justify-center'>
            {doctorAnim
              ? <Lottie animationData={doctorAnim} loop autoplay style={{ width: 120, height: 120 }} />
              : <div className='w-16 h-16 rounded-full bg-blue-900/30 animate-pulse' />
            }
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

        {/* Section header */}
        <motion.div {...fadeUp(0.1)} className='mb-12'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent to-[#1e2d4a]' />
            <span className='text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5'>
              Why MediNexus
            </span>
            <div className='h-px flex-1 bg-gradient-to-l from-transparent to-[#1e2d4a]' />
          </div>
          <h2 className={`text-3xl md:text-4xl font-extrabold text-center ${textPri}`}>
            The Standard of Care{' '}
            <span className='gradient-text'>You Deserve</span>
          </h2>
          <p className={`text-center text-sm mt-3 max-w-xl mx-auto ${textSec}`}>
            We combine cutting-edge technology with compassionate healthcare to deliver
            an experience that puts you first — every step of the way.
          </p>
        </motion.div>

        {/* Cards grid — alternating accent style */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1e2d4a] rounded-2xl overflow-hidden border border-[#1e2d4a]'>
          {whyUs.map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.07)}
              className={`group relative flex flex-col gap-4 p-7 ${cardBg} transition-all duration-300 hover:bg-[#111d38] cursor-default overflow-hidden`}
            >
              {/* top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* number + icon row */}
              <div className='flex items-center justify-between'>
                <span className='text-4xl font-black text-white/5 select-none leading-none'>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {item.icon}
                </div>
              </div>

              {/* text */}
              <div>
                <h3 className={`text-base font-bold mb-1.5 ${textPri} group-hover:text-cyan-300 transition-colors duration-200`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${textSec}`}>{item.text}</p>
              </div>

              {/* bottom arrow indicator */}
              <div className='mt-auto pt-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className={`h-px w-6 bg-gradient-to-r ${item.color}`} />
                <span className='text-xs text-cyan-400 font-medium'>Learn more</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <motion.div
          {...fadeUp(0.3)}
          className={`mt-6 flex flex-wrap items-center justify-center gap-6 px-6 py-4 rounded-2xl border ${border} ${cardBg}`}
        >
          {[
            { label: 'ISO Certified', dot: 'bg-emerald-400' },
            { label: 'HIPAA Compliant', dot: 'bg-blue-400' },
            { label: '256-bit Encryption', dot: 'bg-violet-400' },
            { label: '99.9% Uptime SLA', dot: 'bg-amber-400' },
          ].map(({ label, dot }) => (
            <div key={label} className='flex items-center gap-2'>
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              <span className={`text-xs font-medium ${textSec}`}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Our Leadership ───────────────────────────────── */}
      <div className='mb-4'>
        {/* Section header */}
        <motion.div {...fadeUp(0.1)} className='text-center mb-14'>
          <span className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'>
            <Users size={12} /> The Team Behind MediNexus
          </span>
          <h2 className={`text-3xl md:text-4xl font-extrabold ${textPri}`}>
            Our <span className='gradient-text'>Leadership</span>
          </h2>
          <p className={`text-sm mt-3 max-w-md mx-auto ${textSec}`}>
            Visionaries and experts united by one mission — making quality healthcare accessible to all.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          {leadership.map((person, i) => {
            const Icon = person.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
                className='group relative rounded-3xl overflow-hidden cursor-default'
                style={{
                  background: 'linear-gradient(160deg, #0d1b35 0%, #0a1220 100%)',
                  border: `1px solid ${person.border}`,
                  boxShadow: `0 4px 24px ${person.glow}`,
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 16px 48px ${person.glow}`
                  e.currentTarget.style.borderColor = person.tagColor
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = `0 4px 24px ${person.glow}`
                  e.currentTarget.style.borderColor = person.border
                }}
              >
                {/* Top gradient bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${person.gradient}`} />

                {/* Image area */}
                <div className='relative overflow-hidden' style={{ height: '220px' }}>
                  {/* Background glow */}
                  <div className='absolute inset-0'
                    style={{ background: `radial-gradient(ellipse at center bottom, ${person.glow} 0%, transparent 70%)` }} />

                  <img
                    src={person.img}
                    alt={person.name}
                    className='w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105'
                  />

                  {/* Role tag badge — top right */}
                  <div className='absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wider'
                    style={{
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${person.tagColor}50`,
                      color: person.tagColor,
                    }}>
                    {person.tag}
                  </div>

                  {/* Dept badge — top left */}
                  <div className='absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold'
                    style={{
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)',
                    }}>
                    <Icon size={10} style={{ color: person.tagColor }} />
                    {person.dept}
                  </div>

                  {/* Bottom gradient overlay */}
                  <div className='absolute bottom-0 left-0 right-0 h-20'
                    style={{ background: 'linear-gradient(to top, #0a1220 0%, transparent 100%)' }} />
                </div>

                {/* Content */}
                <div className='px-5 pb-5 pt-3'>
                  <h3 className='text-base font-bold text-white leading-tight'>{person.name}</h3>
                  <p className='text-xs font-semibold mt-0.5 mb-3' style={{ color: person.tagColor }}>{person.role}</p>

                  <p className='text-xs leading-relaxed text-gray-400 mb-4'>{person.bio}</p>

                  {/* Stats row */}
                  <div className='flex gap-2 mb-4'>
                    {person.stats.map((s, si) => (
                      <div key={si} className='flex-1 rounded-xl px-2.5 py-2 text-center'
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <p className='text-sm font-bold text-white'>{s.value}</p>
                        <p className='text-[10px] text-gray-500 mt-0.5'>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Social links */}
                  <div className='flex items-center gap-2'>
                    <a href={person.linkedin} target='_blank' rel='noopener noreferrer'
                      className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80'
                      style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
                      <Linkedin size={12} /> LinkedIn
                    </a>
                    <a href={person.twitter} target='_blank' rel='noopener noreferrer'
                      className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80'
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                      <Twitter size={12} /> Twitter
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom join team CTA */}
        <motion.div
          {...fadeUp(0.3)}
          className='mt-10 rounded-2xl px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left'
          style={{
            background: 'linear-gradient(135deg, #0d1b35 0%, #0f2040 100%)',
            border: '1px solid rgba(0,212,255,0.15)',
          }}
        >
          <div>
            <p className='text-white font-bold text-lg'>Want to join our team?</p>
            <p className='text-gray-400 text-sm mt-1'>We're always looking for passionate people to help us transform healthcare.</p>
          </div>
          <a
            href='mailto:careers@medinexus.ai'
            className='flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 flex-shrink-0'
            style={{ background: 'linear-gradient(135deg, #00d4ff, #0ea5e9)', boxShadow: '0 4px 20px rgba(0,212,255,0.3)' }}
          >
            <Mail size={15} /> View Open Roles
          </a>
        </motion.div>
      </div>

    </div>
  )
}

export default About
