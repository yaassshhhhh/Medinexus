import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle,
  Navigation, MessageCircle, Shield, ChevronDown
} from 'lucide-react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const SUBJECTS = [
  'General Inquiry',
  'Appointment Support',
  'Technical Issue',
  'Billing & Payments',
  'Doctor Partnership',
  'Emergency Assistance',
  'Other',
]

const Contact = () => {
  const { backendUrl } = useContext(AppContext)

  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [subjectOpen, setSubjectOpen] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubject = (val) => {
    setForm({ ...form, subject: val })
    setSubjectOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/contact/send`, form)
      if (data.success) {
        setSent(true)
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        toast.error(data.message || 'Failed to send message.')
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Shared input style
  const inputCls =
    'w-full bg-[#0d1b2e] border border-[#1e3a5f] text-white placeholder-gray-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all'

  return (
    <div className='min-h-screen' style={{ background: '#0a0f1e', color: 'white' }}>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <div className='relative overflow-hidden pt-10 sm:pt-12 pb-10 px-4 sm:px-0'>
        {/* Background grid dots */}
        <div className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: 'radial-gradient(circle, #00d4ff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

        <div className='relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 max-w-5xl mx-auto'>
          {/* Left text */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 border border-cyan-500/40 rounded-full px-4 py-1.5 mb-5 bg-cyan-500/10'>
              <Navigation size={12} className='text-cyan-400' />
              <span className='text-cyan-400 text-xs font-semibold tracking-widest uppercase'>Get In Touch</span>
            </div>

            <h1 className='text-4xl sm:text-5xl font-bold leading-tight'>
              Contact <span className='text-cyan-400'>Us</span>
            </h1>
            <p className='mt-3 text-gray-400 text-sm max-w-xs leading-relaxed'>
              We'd love to hear from you. Reach out to us for appointments, support, or any general inquiries.
            </p>
          </motion.div>

          {/* Right — 24/7 headset graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='hidden lg:flex items-center justify-center relative'
          >
            {/* Outer glow rings */}
            <div className='absolute w-52 h-52 rounded-full border border-cyan-500/20 animate-ping' style={{ animationDuration: '3s' }} />
            <div className='absolute w-44 h-44 rounded-full border border-cyan-500/30' />
            <div className='absolute w-36 h-36 rounded-full border border-cyan-400/40' />

            {/* Center circle */}
            <div className='relative w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400/60 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.3)]'>
              {/* Headset SVG */}
              <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M8 28V24C8 15.163 15.163 8 24 8C32.837 8 40 15.163 40 24V28' stroke='#00d4ff' strokeWidth='2.5' strokeLinecap='round' />
                <rect x='6' y='28' width='6' height='10' rx='3' fill='#00d4ff' opacity='0.8' />
                <rect x='36' y='28' width='6' height='10' rx='3' fill='#00d4ff' opacity='0.8' />
                <path d='M42 36C42 39.314 39.314 42 36 42H28' stroke='#00d4ff' strokeWidth='2.5' strokeLinecap='round' />
                <circle cx='26' cy='42' r='2' fill='#00d4ff' />
              </svg>
              <span className='text-cyan-400 font-bold text-lg mt-1'>24/7</span>
            </div>

            {/* ECG line */}
            <svg className='absolute bottom-0 left-1/2 -translate-x-1/2 w-64 opacity-40' height='30' viewBox='0 0 256 30'>
              <polyline
                points='0,15 40,15 50,5 60,25 70,5 80,25 90,15 130,15 140,2 150,28 160,15 256,15'
                fill='none' stroke='#00d4ff' strokeWidth='1.5'
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className='max-w-5xl mx-auto px-4 sm:px-0 pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>

          {/* ── Left: Get In Touch cards ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='lg:col-span-2 space-y-4'
          >
            <div className='rounded-2xl border border-[#1e3a5f] bg-[#0d1b2e] p-5'>
              <h3 className='text-cyan-400 font-semibold text-base mb-4'>Get In Touch</h3>

              {/* Phone */}
              <ContactCard
                icon={<Phone size={18} className='text-cyan-400' />}
                title='Phone'
                lines={['+91 98765 43210', '+91 91234 56789']}
              />
              {/* Email */}
              <ContactCard
                icon={<Mail size={18} className='text-cyan-400' />}
                title='Email'
                lines={['support@medinexus.ai', 'info@medinexus.ai']}
              />
              {/* Address */}
              <ContactCard
                icon={<MapPin size={18} className='text-cyan-400' />}
                title='Address'
                lines={['42, Connaught Place,', 'New Delhi - 110001, India']}
              />
              {/* Hours */}
              <ContactCard
                icon={<Clock size={18} className='text-cyan-400' />}
                title='Working Hours'
                lines={['Mon - Sun: 24 Hours', 'Emergency Services Always Available']}
                last
              />
            </div>
          </motion.div>

          {/* ── Right: Contact Form ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className='lg:col-span-3'
          >
            <div className='rounded-2xl border border-[#1e3a5f] bg-[#0d1b2e] p-6'>
              <h3 className='text-white font-semibold text-base mb-5'>Send Us a Message</h3>

              <AnimatePresence mode='wait'>
                {sent ? (
                  <motion.div
                    key='success'
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-col items-center justify-center py-16 gap-4'
                  >
                    <div className='w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.2)]'>
                      <CheckCircle size={36} className='text-cyan-400' />
                    </div>
                    <p className='text-white font-bold text-xl'>Message Sent!</p>
                    <p className='text-gray-400 text-sm text-center max-w-xs'>
                      We've received your message and will get back to you within 24 hours. Check your inbox for a confirmation.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className='mt-2 text-cyan-400 text-sm border border-cyan-400/40 px-5 py-2 rounded-lg hover:bg-cyan-400/10 transition-all'
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key='form'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className='space-y-4'
                  >
                    {/* Name + Email row */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className='relative'>
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 3.6-7 8-7s8 3 8 7'/></svg>
                        </span>
                        <input
                          className={`${inputCls} pl-9`}
                          type='text'
                          name='name'
                          placeholder='Your Name'
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className='relative'>
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                          <Mail size={15} />
                        </span>
                        <input
                          className={`${inputCls} pl-9`}
                          type='email'
                          name='email'
                          placeholder='Your Email'
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className='relative'>
                      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                        <Phone size={15} />
                      </span>
                      <input
                        className={`${inputCls} pl-9`}
                        type='tel'
                        name='phone'
                        placeholder='Your Phone Number'
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Subject dropdown */}
                    <div className='relative'>
                      <button
                        type='button'
                        onClick={() => setSubjectOpen(!subjectOpen)}
                        className={`${inputCls} flex items-center justify-between text-left ${form.subject ? 'text-white' : 'text-gray-500'}`}
                      >
                        <span className='flex items-center gap-2'>
                          <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='text-gray-500'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3 10h18'/></svg>
                          {form.subject || 'Select Subject'}
                        </span>
                        <ChevronDown size={15} className={`transition-transform ${subjectOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {subjectOpen && (
                          <motion.ul
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className='absolute z-50 w-full mt-1 bg-[#0d1b2e] border border-[#1e3a5f] rounded-lg overflow-hidden shadow-xl'
                          >
                            {SUBJECTS.map((s) => (
                              <li
                                key={s}
                                onClick={() => handleSubject(s)}
                                className='px-4 py-2.5 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer transition-colors'
                              >
                                {s}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Message */}
                    <div className='relative'>
                      <span className='absolute left-3 top-3.5 text-gray-500'>
                        <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M11 4H4a2 2 0 0 0-2 2v14l4-4h14a2 2 0 0 0 2-2v-5'/><path d='M18 2l4 4-8 8H10v-4l8-8z'/></svg>
                      </span>
                      <textarea
                        className={`${inputCls} pl-9 resize-none`}
                        name='message'
                        rows={4}
                        placeholder='Your Message'
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] text-sm'
                    >
                      {loading ? (
                        <>
                          <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom CTA banner ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className='mt-6 rounded-2xl border border-[#1e3a5f] bg-[#0d1b2e] px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left'
        >
          {/* Left */}
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0'>
              <Shield size={22} className='text-cyan-400' />
            </div>
            <div>
              <p className='text-white font-semibold text-sm'>Need Immediate Assistance?</p>
              <p className='text-gray-400 text-xs mt-0.5'>Our support team is available 24/7 to help you.</p>
            </div>
          </div>

          {/* Center */}
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0'>
              <Phone size={16} className='text-cyan-400' />
            </div>
            <div>
              <p className='text-gray-400 text-xs'>Call Us Now</p>
              <p className='text-white font-semibold text-sm'>+91 98765 43210</p>
            </div>
          </div>

          {/* Right */}
          <a
            href='https://chat.whatsapp.com/GyDo1Tad9uZ3aXHYCXtZHG?mode=gi_t'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] text-sm flex-shrink-0'
          >
            <MessageCircle size={15} />
            Chat With Us
          </a>
        </motion.div>
      </div>
    </div>
  )
}

/* ── Helper component ─────────────────────────────────────────────── */
const ContactCard = ({ icon, title, lines, last }) => (
  <div className={`flex items-start gap-3 py-3.5 ${!last ? 'border-b border-[#1e3a5f]' : ''}`}>
    <div className='w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
      {icon}
    </div>
    <div>
      <p className='text-white text-sm font-medium'>{title}</p>
      {lines.map((l, i) => (
        <p key={i} className='text-gray-400 text-xs mt-0.5'>{l}</p>
      ))}
    </div>
  </div>
)

export default Contact
