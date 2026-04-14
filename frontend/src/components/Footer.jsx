import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Footer = () => {
  const { darkMode, backendUrl } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const links = {
    Platform: [
      { label: 'Find Doctors', to: '/doctors' },
      { label: 'Video Consult', to: '/video-consult' },
      { label: 'Doctor Portal', to: '/doctor-portal' },
      { label: 'My Appointments', to: '/my-appointment' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Admin Panel', to: '/admin/dashboard' },
    ],
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/newsletter/subscribe', { email })
      
      if (data.success) {
        toast.success(data.message)
        setEmail('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className={`mt-16 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl p-8 md:p-12 my-8 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-indigo-50/40'}`}
      >
        <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10'>

          {/* Brand */}
          <div>
            <div className='flex items-center gap-2.5 mb-4'>
              <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md shadow-indigo-300/30'>
                <svg viewBox="0 0 24 24" fill="none" className='w-5 h-5 text-white' stroke="currentColor" strokeWidth="2.5">
                  <path d="M8 6h8M8 12h8M8 18h4" strokeLinecap="round"/>
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                </svg>
              </div>
              <span className='text-xl font-bold gradient-text'>MediNexus Ai</span>
            </div>
            <p className={`text-sm leading-7 max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Revolutionizing healthcare accessibility with AI-powered tools and seamless appointment scheduling.
            </p>
            <div className={`mt-5 space-y-2.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p className='flex items-center gap-2'><Phone size={14} className='text-primary flex-shrink-0' /> +91-11-4567-8900</p>
              <p className='flex items-center gap-2'><Mail size={14} className='text-primary flex-shrink-0' /> support@medinexus.ai</p>
              <p className='flex items-center gap-2'><MapPin size={14} className='text-primary flex-shrink-0' /> 42, Connaught Place, New Delhi - 110001</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className={`font-bold text-sm uppercase tracking-wider mb-5 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</p>
              <ul className='space-y-3'>
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      onClick={() => scrollTo(0, 0)}
                      className={`text-sm flex items-center gap-1 group transition-colors ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-primary'}`}
                    >
                      <ArrowRight size={12} className='opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all' />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className={`font-bold text-sm uppercase tracking-wider mb-5 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Stay Updated</p>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get health tips and updates in your inbox.</p>
            <form onSubmit={handleSubscribe} className='flex gap-2'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='your@email.com'
                disabled={loading}
                className={`flex-1 text-sm px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <button 
                type='submit'
                disabled={loading}
                className={`bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors flex-shrink-0 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? '...' : '→'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        <p>© 2025 <span className='font-semibold text-primary'>MediNexus Ai</span> — All Rights Reserved.</p>
        <div className='flex items-center gap-4'>
          <span className='cursor-pointer hover:text-primary transition-colors'>Privacy</span>
          <span className='cursor-pointer hover:text-primary transition-colors'>Terms</span>
          <span className='cursor-pointer hover:text-primary transition-colors'>Cookies</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
