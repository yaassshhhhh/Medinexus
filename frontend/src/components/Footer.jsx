import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Footer = () => {
  const { backendUrl } = useContext(AppContext)
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
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/newsletter/subscribe', { email })
      if (data.success) { toast.success(data.message); setEmail('') }
      else toast.error(data.message)
    } catch {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer style={{ background: '#060c18', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 4px 14px rgba(14,165,233,0.35)' }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round"/>
                  <path d="M12 8v8M8 12h8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Medi<span style={{ color: '#00d4ff' }}>Care+</span></span>
            </div>
            <p className="text-sm leading-7 max-w-xs" style={{ color: '#8ba3c7' }}>
              Revolutionizing healthcare accessibility with AI-powered tools and seamless appointment scheduling.
            </p>
            <div className="mt-5 space-y-2.5 text-sm" style={{ color: '#8ba3c7' }}>
              <p className="flex items-center gap-2"><Phone size={14} style={{ color: '#00d4ff', flexShrink: 0 }} /> +91-11-4567-8900</p>
              <p className="flex items-center gap-2"><Mail size={14} style={{ color: '#00d4ff', flexShrink: 0 }} /> support@medinexus.ai</p>
              <p className="flex items-center gap-2"><MapPin size={14} style={{ color: '#00d4ff', flexShrink: 0 }} /> 42, Connaught Place, New Delhi - 110001</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="font-bold text-sm uppercase tracking-wider mb-5 text-white">{title}</p>
              <ul className="space-y-3">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} onClick={() => scrollTo(0, 0)}
                      className="text-sm flex items-center gap-1 group transition-colors"
                      style={{ color: '#8ba3c7' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                      onMouseLeave={e => e.currentTarget.style.color = '#8ba3c7'}
                    >
                      <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="font-bold text-sm uppercase tracking-wider mb-5 text-white">Stay Updated</p>
            <p className="text-sm mb-4" style={{ color: '#8ba3c7' }}>Get health tips and updates in your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" disabled={loading}
                className="flex-1 text-sm px-3 py-2.5 rounded-xl border-none outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button type="submit" disabled={loading}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white' }}>
                {loading ? '...' : '→'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
        <p className="text-xs" style={{ color: '#4a5568' }}>
          © 2025 <span className="font-semibold" style={{ color: '#00d4ff' }}>MediCare+</span> — All Rights Reserved.
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: '#4a5568' }}>
          {['Privacy', 'Terms', 'Cookies'].map(item => (
            <span key={item} className="cursor-pointer transition-colors hover:text-white">{item}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
