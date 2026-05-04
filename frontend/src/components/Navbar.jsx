import React, { useContext, useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Menu, X, ChevronDown, Video, ShieldCheck, Sparkles } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logout = () => { setToken(false); localStorage.removeItem('token') }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/doctor-portal', label: 'Doctor Portal' },
  ]

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%', background: 'linear-gradient(90deg, #14b8a6, #00d4ff, #6366f1)', position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 50 }}
      />

      <nav
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(8, 12, 26, 0.97)'
            : 'rgba(8, 12, 26, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(0,212,255,0.12)' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="w-full px-6 grid grid-cols-[auto_1fr_auto] items-center h-16 gap-4">

          {/* ── Logo (far left, no space) ── */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                boxShadow: '0 4px 16px rgba(14,165,233,0.45)',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" />
                <path d="M12 8v8M8 12h8" strokeLinecap="round" />
              </svg>
            </div>

            {/* Brand name */}
            <div className="flex flex-col gap-0.5 leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-extrabold tracking-tight text-white leading-none">
                  Medi<span style={{ color: '#00d4ff' }}>Nexus</span>
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(14,165,233,0.35))',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99,102,241,0.4)',
                    letterSpacing: '0.05em',
                  }}
                >
                  AI
                </span>
              </div>
              <span className="text-[9px] font-medium uppercase" style={{ color: '#4a6fa5', letterSpacing: '0.14em' }}>
                Healthcare Platform
              </span>
            </div>
          </div>

          {/* ── Nav links (exact center column) ── */}
          <ul className="hidden md:flex items-center gap-0.5 justify-center">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to + label} to={to}>
                {({ isActive }) => (
                  <li
                    className="relative px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 rounded-lg"
                    style={{ color: isActive ? '#00d4ff' : 'rgba(255,255,255,0.68)' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'white' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.68)' }}
                  >
                    {label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] rounded-full"
                        style={{ background: 'linear-gradient(90deg, #00d4ff, #6366f1)' }}
                      />
                    )}
                  </li>
                )}
              </NavLink>
            ))}

          </ul>

          {/* ── Right side (far right, no space) ── */}
          <div className="flex items-center gap-3 justify-end">

            {/* Video Consult pill */}
            <NavLink to="/video-consult" className="hidden md:block">
              {({ isActive }) => (
                <div
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200"
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(99,102,241,0.12)',
                    color: isActive ? 'white' : '#a5b4fc',
                    border: '1px solid rgba(99,102,241,0.35)',
                    boxShadow: isActive ? '0 0 18px rgba(99,102,241,0.45)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.color = 'white' }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#a5b4fc' }
                  }}
                >
                  <Video size={13} />
                  Video Consult
                </div>
              )}
            </NavLink>

            {/* Admin pill */}
            <NavLink to="/admin" className="hidden md:block">
              {({ isActive }) => (
                <div
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200"
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(245,158,11,0.1)',
                    color: isActive ? 'white' : '#fbbf24',
                    border: '1px solid rgba(245,158,11,0.35)',
                    boxShadow: isActive ? '0 0 18px rgba(245,158,11,0.4)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) { e.currentTarget.style.background = 'rgba(245,158,11,0.22)'; e.currentTarget.style.color = 'white' }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.color = '#fbbf24' }
                  }}
                >
                  <ShieldCheck size={13} />
                  Admin
                </div>
              )}
            </NavLink>
            {token ? (
              <div className="relative group cursor-pointer">
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-xl transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <img
                    className="w-8 h-8 rounded-lg object-cover"
                    src={userData ? userData.image : assets.profile_pic}
                    alt="profile"
                  />
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-hover:rotate-180"
                    style={{ color: '#8ba3c7' }}
                  />
                </div>

                {/* Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <div
                    className="rounded-xl shadow-2xl overflow-hidden"
                    style={{ background: '#0d1b2e', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-xs font-semibold text-white truncate">{userData?.name || 'My Account'}</p>
                    </div>
                    {[
                      { label: 'My Profile', action: () => navigate('/my-profile') },
                      { label: 'My Appointments', action: () => navigate('/my-appointment') },
                    ].map(({ label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                      >
                        {label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 transition-colors"
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
                }}
              >
                <Sparkles size={14} />
                Login / Sign Up
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setShowMenu(true)}
              className="md:hidden p-3 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${showMenu ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowMenu(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[85vw] sm:w-72 transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
          style={{ background: '#080c1a', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" />
                  <path d="M12 8v8M8 12h8" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-base font-extrabold text-white">
                Medi<span style={{ color: '#00d4ff' }}>Nexus</span>
                <span
                  className="ml-1 text-[10px] font-semibold px-1 py-0.5 rounded align-middle"
                  style={{ background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                  AI
                </span>
              </span>
            </div>
            <button onClick={() => setShowMenu(false)} className="p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <X size={18} />
            </button>
          </div>

          {/* Drawer links */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to + label} to={to} onClick={() => setShowMenu(false)}>
                {({ isActive }) => (
                  <div
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? '#00d4ff' : 'rgba(255,255,255,0.7)',
                      background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                    }}
                  >
                    {label}
                  </div>
                )}
              </NavLink>
            ))}

            <NavLink to="/video-consult" onClick={() => setShowMenu(false)}>
              {({ isActive }) => (
                <div
                  className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
                  style={{
                    color: isActive ? 'white' : '#a5b4fc',
                    background: isActive ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.3)',
                  }}
                >
                  <Video size={14} />
                  Video Consult
                </div>
              )}
            </NavLink>

            <NavLink to="/admin" onClick={() => setShowMenu(false)}>
              {({ isActive }) => (
                <div
                  className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
                  style={{
                    color: isActive ? 'white' : '#fbbf24',
                    background: isActive ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}
                >
                  <ShieldCheck size={14} />
                  Admin
                </div>
              )}
            </NavLink>

            {token && (
              <>
                <NavLink to="/my-profile" onClick={() => setShowMenu(false)}>
                  <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    My Profile
                  </div>
                </NavLink>
                <NavLink to="/my-appointment" onClick={() => setShowMenu(false)}>
                  <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    My Appointments
                  </div>
                </NavLink>
                <button
                  onClick={() => { logout(); setShowMenu(false) }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-400"
                >
                  Sign out
                </button>
              </>
            )}
          </div>

          {/* Drawer footer */}
          <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {!token && (
              <button
                onClick={() => { navigate('/login'); setShowMenu(false) }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
              >
                <Sparkles size={14} />
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
