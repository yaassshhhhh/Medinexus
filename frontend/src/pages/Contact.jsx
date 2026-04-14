import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Briefcase, ArrowRight, Send, CheckCircle } from 'lucide-react'
import { AppContext } from '../context/AppContext'

const Contact = () => {
  const { darkMode } = useContext(AppContext)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    setForm({ name: '', email: '', message: '' })
  }

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
    darkMode ? 'bg-gray-700/60 border-gray-600 text-gray-100 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 hover:border-gray-300'
  }`

  return (
    <div className='pb-20'>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='text-center pt-12 pb-8'>
        <span className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
          Get In Touch
        </span>
        <h1 className={`text-4xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          Contact <span className='gradient-text'>Us</span>
        </h1>
        <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We'd love to hear from you. Reach out anytime.</p>
      </motion.div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
        {/* Left — image + info cards */}
        <div className='space-y-5'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='relative overflow-hidden rounded-2xl shadow-xl group h-56'
          >
            <img className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700' src={assets.contact_image} alt='Contact' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6'>
              <div className='text-white'>
                <h3 className='text-xl font-bold'>Visit Our Office</h3>
                <p className='text-sm text-white/80 mt-1'>Experience world-class healthcare coordination.</p>
              </div>
            </div>
          </motion.div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <h3 className={`font-bold text-base mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              <span className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}><MapPin size={16} /></span>
              Our Office
            </h3>
            <div className={`space-y-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className='flex items-center gap-3'><MapPin size={15} className='text-primary flex-shrink-0' /> 42, Connaught Place, New Delhi - 110001, India</p>
              <p className='flex items-center gap-3 hover:text-primary transition-colors cursor-pointer'><Phone size={15} className='text-primary flex-shrink-0' /> +91-11-4567-8900</p>
              <p className='flex items-center gap-3 hover:text-primary transition-colors cursor-pointer'><Mail size={15} className='text-primary flex-shrink-0' /> contact@rogveda.com</p>
            </div>
          </motion.div>

          {/* Careers card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100'}`}
          >
            <h3 className={`font-bold text-base mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              <span className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}><Briefcase size={16} /></span>
              Careers at Rogveda
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Join our mission to revolutionize healthcare accessibility through AI.</p>
            <button className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all group hover:bg-primary hover:text-white hover:border-primary ${
              darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'
            }`}>
              Explore Openings <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' />
            </button>
          </motion.div>
        </div>

        {/* Right — contact form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`rounded-2xl border p-7 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}
        >
          <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Send a Message</h3>
          <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We'll get back to you within 24 hours.</p>

          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='flex flex-col items-center justify-center py-12 gap-3'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                <CheckCircle size={32} className='text-green-600' />
              </div>
              <p className={`font-bold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Message Sent!</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>We'll be in touch soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your Name</label>
                <input className={inputCls} type='text' placeholder='John Doe' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email Address</label>
                <input className={inputCls} type='email' placeholder='you@example.com' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Message</label>
                <textarea className={`${inputCls} resize-none`} rows={5} placeholder='How can we help you?' value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button type='submit' className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-300/30 hover:shadow-indigo-400/40 hover:-translate-y-0.5 transition-all text-sm group'>
                <Send size={15} /> Send Message
                <ArrowRight size={14} className='group-hover:translate-x-0.5 transition-transform' />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
