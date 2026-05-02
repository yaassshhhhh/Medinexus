import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, Calendar, ChevronLeft, ChevronRight, RefreshCw, Settings2, ChevronDown, Users } from 'lucide-react'

const specialties = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist'
]

const ITEMS_PER_PAGE = 9

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [search, setSearch] = useState('')
  const [maxFee, setMaxFee] = useState(2000)
  const [minRating, setMinRating] = useState(0)
  const [gender, setGender] = useState('All')
  const [sortBy, setSortBy] = useState('Popularity')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedExp, setSelectedExp] = useState('')
  const [selectedAvail, setSelectedAvail] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [wishlist, setWishlist] = useState([])
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const ratingOptions = [
    { label: 'All Ratings', value: 0 },
    { label: '4.5 & Above', value: 4.5 },
    { label: '4.0 & Above', value: 4.0 },
    { label: '3.5 & Above', value: 3.5 },
    { label: '3.0 & Above', value: 3.0 },
  ]

  useEffect(() => {
    let list = speciality ? doctors.filter(d => d.speciality === speciality) : doctors
    if (search.trim()) {
      list = list.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.speciality.toLowerCase().includes(search.toLowerCase())
      )
    }
    list = list.filter(d => (parseInt(d.fees) || 0) <= maxFee)
    if (minRating > 0) list = list.filter(d => (d.rating || 4.5) >= minRating)
    if (gender !== 'All') list = list.filter(d => (d.gender || 'Male') === gender)
    if (selectedDept) list = list.filter(d => d.speciality === selectedDept)
    list = [...list].sort((a, b) => {
      if (sortBy === 'Fees: Low') return (parseInt(a.fees) || 0) - (parseInt(b.fees) || 0)
      if (sortBy === 'Fees: High') return (parseInt(b.fees) || 0) - (parseInt(a.fees) || 0)
      if (sortBy === 'Rating') return (b.rating || 4.5) - (a.rating || 4.5)
      return (b.rating || 4.5) - (a.rating || 4.5)
    })
    setFilterDoc(list)
    setCurrentPage(1)
  }, [doctors, speciality, search, maxFee, minRating, gender, sortBy, selectedDept])

  const totalPages = Math.ceil(filterDoc.length / ITEMS_PER_PAGE)
  const paginated = filterDoc.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const toggleWishlist = (id, e) => {
    e.stopPropagation()
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const clearFilters = () => {
    setMaxFee(2000); setMinRating(0); setGender('All')
    setSelectedDept(''); setSelectedExp(''); setSelectedAvail(''); setSearch('')
  }

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 50%, #0a1628 100%)' }}>

      {/* HERO BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 60%, #0a1628 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between gap-8 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Find Your <span style={{ color: '#00d4ff' }}>Specialist</span>
            </h1>
            <p className="mt-3 text-sm" style={{ color: '#8ba3c7' }}>
              Browse our network of verified specialists and book an appointment with the right doctor for you.
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-36 h-36 relative">
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)' }} />
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ border: '2px solid rgba(0,212,255,0.35)', background: 'rgba(0,212,255,0.07)' }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="18" cy="15" r="8" stroke="#00d4ff" strokeWidth="2" fill="none"/>
                <path d="M4 38c0-8 6-14 14-14s14 6 14 14" stroke="#00d4ff" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="32" cy="30" r="9" stroke="#00d4ff" strokeWidth="2" fill="rgba(0,212,255,0.08)"/>
                <path d="M28 30h8M32 26v8" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="absolute top-2 right-5 w-2.5 h-2.5 rounded-full" style={{ background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' }} />
            <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full" style={{ background: '#00d4ff', opacity: 0.5 }} />
          </div>
          <div className="flex-shrink-0 rounded-2xl p-5 flex items-center gap-4" style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.12)' }}>
              <Users size={24} style={{ color: '#00d4ff' }} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">150+</p>
              <p className="text-sm" style={{ color: '#8ba3c7' }}>Verified Doctors</p>
            </div>
          </div>
        </div>

        {/* Top filter bar */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Select Department', sub: selectedDept || 'All Departments', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="#00d4ff" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="#00d4ff" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="#00d4ff" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="#00d4ff" strokeWidth="1.5"/></svg>, type: 'dept' },
              { label: 'Experience', sub: selectedExp || 'All Experience', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="3" stroke="#00d4ff" strokeWidth="1.5"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round"/></svg>, type: 'exp' },
              { label: 'Availability', sub: selectedAvail || 'Available Today', icon: <Calendar size={14} style={{ color: '#00d4ff' }} />, type: 'avail' },
            ].map(item => (
              <div key={item.type} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,212,255,0.1)' }}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: '#8ba3c7' }}>{item.label}</p>
                  <p className="text-sm font-medium text-white truncate">{item.sub}</p>
                </div>
                <ChevronDown size={14} style={{ color: '#8ba3c7' }} />
              </div>
            ))}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Search size={15} style={{ color: '#8ba3c7', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search doctor by name or specialty..."
                className="flex-1 text-sm bg-transparent border-none outline-none"
                style={{ color: 'white' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">

        {/* LEFT SIDEBAR */}
        <div className="w-52 flex-shrink-0 hidden md:block">
          <div className="rounded-2xl p-5 sticky top-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-base font-bold text-white mb-5">Filter by</p>

            {/* Fee slider */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#8ba3c7" strokeWidth="1.2"/><path d="M7 4v6M5 6h3.5a1.5 1.5 0 010 3H5" stroke="#8ba3c7" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <p className="text-sm font-semibold text-white">Consultation Fee</p>
              </div>
              <input
                type="range" min="0" max="2000" step="100" value={maxFee}
                onChange={e => setMaxFee(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#00d4ff' }}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs" style={{ color: '#8ba3c7' }}>₹0</span>
                <span className="text-xs font-semibold" style={{ color: '#00d4ff' }}>₹{maxFee >= 2000 ? '2000+' : maxFee}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1l1.4 3.2L11 4.7l-2.3 2.3.5 3.2-2.7-1.5-2.7 1.5.5-3.2L2 4.7l3.1-.5L6.5 1z" stroke="#f59e0b" strokeWidth="1.2" fill="none"/></svg>
                <p className="text-sm font-semibold text-white">Rating</p>
              </div>
              <div className="space-y-2.5">
                {ratingOptions.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer" onClick={() => setMinRating(opt.value)}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ borderColor: minRating === opt.value ? '#00d4ff' : 'rgba(255,255,255,0.25)', background: minRating === opt.value ? '#00d4ff' : 'transparent' }}>
                      {minRating === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs" style={{ color: minRating === opt.value ? 'white' : '#8ba3c7' }}>
                      {opt.label}{opt.value > 0 && <span className="ml-1 text-yellow-400">★</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="5" r="3" stroke="#8ba3c7" strokeWidth="1.2"/><path d="M3.5 12c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="#8ba3c7" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <p className="text-sm font-semibold text-white">Gender</p>
              </div>
              <div className="space-y-2.5">
                {['All', 'Male', 'Female'].map(g => (
                  <label key={g} className="flex items-center gap-2.5 cursor-pointer" onClick={() => setGender(g)}>
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ borderColor: gender === g ? '#00d4ff' : 'rgba(255,255,255,0.25)', background: gender === g ? '#00d4ff' : 'transparent' }}>
                      {gender === g && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs" style={{ color: gender === g ? 'white' : '#8ba3c7' }}>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={clearFilters} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff', background: 'rgba(0,212,255,0.05)' }}>
              <RefreshCw size={13} /> Clear Filters
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Results + sort bar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <p className="text-sm" style={{ color: '#8ba3c7' }}>
              Showing {filterDoc.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filterDoc.length)} of {filterDoc.length}+ doctors
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-xs" style={{ color: '#8ba3c7' }}>Sort by:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="text-sm font-semibold bg-transparent border-none outline-none appearance-none cursor-pointer" style={{ color: 'white' }}>
                  <option value="Popularity" style={{ background: '#0d1b2e' }}>Popularity</option>
                  <option value="Rating" style={{ background: '#0d1b2e' }}>Rating</option>
                  <option value="Fees: Low" style={{ background: '#0d1b2e' }}>Fees: Low</option>
                  <option value="Fees: High" style={{ background: '#0d1b2e' }}>Fees: High</option>
                </select>
                <ChevronDown size={13} style={{ color: '#8ba3c7' }} />
              </div>
              <button className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Settings2 size={16} style={{ color: '#8ba3c7' }} />
              </button>
            </div>
          </div>

          {/* Doctor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {paginated.map((item, index) => (
                <motion.div layout key={item._id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.22, delay: index * 0.04 }}
                  onClick={() => navigate('/appointment/' + item._id)}
                  className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,212,255,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div className="relative flex items-start gap-3 p-4 pb-3">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: '#00d4ff' }}>{item.name?.charAt(0) || 'D'}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="font-bold text-sm text-white leading-tight truncate group-hover:text-cyan-300 transition-colors">{item.name}</p>
                      <p className="text-xs mt-0.5 font-medium" style={{ color: '#00d4ff' }}>{item.speciality}</p>
                      <div className="flex items-center gap-0.5 mt-1.5">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} width="10" height="10" viewBox="0 0 10 10" fill={s <= Math.round(item.rating || 4.5) ? '#f59e0b' : 'rgba(255,255,255,0.2)'}>
                            <path d="M5 1l1 2.5L9 4 7 6l.5 2.5L5 7 2.5 8.5 3 6 1 4l3-.5L5 1z"/>
                          </svg>
                        ))}
                        <span className="text-xs font-semibold text-white ml-1">{item.rating || 4.5}</span>
                        <span className="text-xs ml-0.5" style={{ color: '#8ba3c7' }}>({item.reviewCount || Math.floor(Math.random()*120)+50})</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="#8ba3c7" strokeWidth="1"/><path d="M5.5 3v2.5l1.5 1" stroke="#8ba3c7" strokeWidth="1" strokeLinecap="round"/></svg>
                        <span className="text-xs" style={{ color: '#8ba3c7' }}>{item.experience || '5+ Years'} Exp.</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" style={{ boxShadow: '0 0 4px #4ade80' }} />
                        <span className="text-xs font-medium text-green-400">Available Today</span>
                      </div>
                    </div>
                    <button onClick={e => toggleWishlist(item._id, e)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <Heart size={13} fill={wishlist.includes(item._id) ? '#f43f5e' : 'none'} stroke={wishlist.includes(item._id) ? '#f43f5e' : '#8ba3c7'} />
                    </button>
                  </div>
                  <div className="px-4 pb-4">
                    <button onClick={e => { e.stopPropagation(); navigate('/appointment/' + item._id) }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', boxShadow: '0 4px 15px rgba(14,165,233,0.3)' }}>
                      <Calendar size={14} /> Book Appointment
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filterDoc.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: 'rgba(255,255,255,0.05)' }}>🔍</div>
              <p className="font-semibold text-white">No doctors found</p>
              <p className="text-sm" style={{ color: '#8ba3c7' }}>Try a different specialty or search term</p>
              <button onClick={clearFilters} className="text-sm font-semibold hover:underline" style={{ color: '#00d4ff' }}>Clear filters</button>
            </motion.div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <ChevronLeft size={16} />
              </button>
              {getPageNumbers().map((page, i) => (
                page === '...'
                  ? <span key={'e' + i} className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: '#8ba3c7' }}>...</span>
                  : <button key={page} onClick={() => setCurrentPage(page)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all"
                      style={currentPage === page
                        ? { background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', boxShadow: '0 4px 12px rgba(14,165,233,0.4)' }
                        : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#8ba3c7' }}>
                      {page}
                    </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
