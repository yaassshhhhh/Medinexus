import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { token, setToken, userData, darkMode, toggleDarkMode } = useContext(AppContext)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logout = () => { setToken(false); localStorage.removeItem('token') }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-gray-900/90 backdrop-blur-md shadow-lg shadow-black/20 border-b border-gray-800'
            : 'bg-white/90 backdrop-blur-md shadow-md shadow-indigo-100/50 border-b border-gray-100'
          : darkMode ? 'bg-transparent' : 'bg-transparent'
      }`}>
        <div className='flex items-center justify-between py-3 px-4 sm:px-6'>

          {/* Logo */}
          <div onClick={() => navigate('/')} className='flex items-center gap-2.5 cursor-pointer group'>
            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md shadow-indigo-300/40 group-hover:scale-105 transition-transform'>
              <svg viewBox="0 0 24 24" fill="none" className='w-5 h-5 text-white' stroke="currentColor" strokeWidth="2.5">
                <path d="M8 6h8M8 12h8M8 18h4" strokeLinecap="round"/>
                <rect x="3" y="3" width="18" height="18" rx="3"/>
              </svg>
            </div>
            <span className='text-xl font-bold gradient-text'>MediNexus</span>
          </div>

          {/* Desktop nav */}
          <ul className='hidden md:flex items-center gap-1'>
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to}>
                {({ isActive }) => (
                  <li className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    {label}
                  </li>
                )}
              </NavLink>
            ))}

            <NavLink to='/video-consult'>
              {({ isActive }) => (
                <li className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive ? 'bg-green-50 text-green-700' : 'text-green-600 hover:bg-green-50'
                }`}>
                  <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'/>
                  Video Consult
                </li>
              )}
            </NavLink>

            <NavLink to='/doctor-portal'>
              {({ isActive }) => (
                <li className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  Doctor Portal
                </li>
              )}
            </NavLink>
          </ul>

          {/* Right actions */}
          <div className='flex items-center gap-2'>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'text-yellow-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <NavLink to='/admin/dashboard' className='hidden md:block'>
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                darkMode ? 'border-gray-600 text-gray-400 hover:border-primary hover:text-primary' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
              }`}>Admin</span>
            </NavLink>

            {token ? (
              <div className='relative group cursor-pointer'>
                <div className='flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all'>
                  <img className='w-8 h-8 rounded-lg object-cover border-2 border-primary/20' src={userData ? userData.image : assets.profile_pic} alt="" />
                  <ChevronDown size={14} className={`transition-transform group-hover:rotate-180 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className='absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0'>
                  <div className={`rounded-xl shadow-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                      <p className={`text-xs font-semibold truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userData?.name || 'My Account'}</p>
                    </div>
                    {[
                      { label: 'My Profile', action: () => navigate('/my-profile') },
                      { label: 'My Appointments', action: () => navigate('/my-appointment') },
                    ].map(({ label, action }) => (
                      <button key={label} onClick={action} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                        {label}
                      </button>
                    ))}
                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button onClick={logout} className='w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors'>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className='hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-all shadow-md shadow-indigo-200/50 hover:shadow-indigo-300/60 hover:-translate-y-0.5'
              >
                Get Started
              </button>
            )}

            <button onClick={() => setShowMenu(true)} className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'>
              <Menu size={20} className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${showMenu ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowMenu(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-72 transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'} ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl flex flex-col`}>
          <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800'>
            <span className='text-lg font-bold gradient-text'>MediNexus</span>
            <button onClick={() => setShowMenu(false)} className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10'>
              <X size={18} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
          <div className='flex-1 overflow-y-auto py-4 px-3 space-y-1'>
            {[...navLinks, { to: '/video-consult', label: 'Video Consult' }, { to: '/doctor-portal', label: 'Doctor Portal' }, { to: '/admin/dashboard', label: 'Admin Panel' }].map(({ to, label }) => (
              <NavLink key={to} to={to} onClick={() => setShowMenu(false)}>
                {({ isActive }) => (
                  <div className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : darkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'}`}>
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
            {token && (
              <>
                <NavLink to='/my-profile' onClick={() => setShowMenu(false)}>
                  <div className={`px-4 py-3 rounded-xl text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'}`}>My Profile</div>
                </NavLink>
                <NavLink to='/my-appointment' onClick={() => setShowMenu(false)}>
                  <div className={`px-4 py-3 rounded-xl text-sm font-medium ${darkMode ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-50'}`}>My Appointments</div>
                </NavLink>
                <button onClick={() => { logout(); setShowMenu(false) }} className='w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50'>
                  Sign out
                </button>
              </>
            )}
          </div>
          <div className='p-4 border-t border-gray-100 dark:border-gray-800 space-y-3'>
            <button onClick={toggleDarkMode} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'bg-white/10 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}>
              {darkMode ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
            </button>
            {!token && (
              <button onClick={() => { navigate('/login'); setShowMenu(false) }} className='w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold'>
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
