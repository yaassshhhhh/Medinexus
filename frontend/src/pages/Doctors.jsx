import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react'

const specialties = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist'
]

const specialtyIcons = {
  'General physician': '🩺',
  'Gynecologist': '👩‍⚕️',
  'Dermatologist': '🔬',
  'Pediatricians': '👶',
  'Neurologist': '🧠',
  'Gastroenterologist': '💊',
}

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [search, setSearch] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('name') // name, fees-low, fees-high, rating
  const navigate = useNavigate()
  const { doctors, darkMode } = useContext(AppContext)

  useEffect(() => {
    let list = speciality ? doctors.filter(d => d.speciality === speciality) : doctors
    
    // Search filter
    if (search.trim()) {
      list = list.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.speciality.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Price range filter
    list = list.filter(d => {
      const fees = parseInt(d.fees) || 0
      return fees >= priceRange[0] && fees <= priceRange[1]
    })
    
    // Rating filter (mock - you can add real ratings later)
    if (minRating > 0) {
      list = list.filter(d => (d.rating || 4.5) >= minRating)
    }
    
    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'fees-low') return (parseInt(a.fees) || 0) - (parseInt(b.fees) || 0)
      if (sortBy === 'fees-high') return (parseInt(b.fees) || 0) - (parseInt(a.fees) || 0)
      if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5)
      return a.name.localeCompare(b.name)
    })
    
    setFilterDoc(list)
  }, [doctors, speciality, search, priceRange, minRating, sortBy])

  return (
    <div className='pb-16 pt-6'>
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className='mb-8'>
        <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
          Our Specialists
        </span>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Find a Specialist</h1>
        <p className={`mt-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {filterDoc.length} verified doctors available
        </p>
      </motion.div>

      {/* Search bar */}
      <div className='flex flex-col sm:flex-row gap-3 mb-6'>
        <div className={`flex-1 flex items-center gap-3 p-3 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
          <Search size={18} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className={`flex-1 text-sm bg-transparent focus:outline-none ${darkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
          />
          {search && (
            <button onClick={() => setSearch('')} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <X size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          )}
        </div>
        
        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className={`px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}
        >
          <option value="name">Sort by Name</option>
          <option value="fees-low">Fees: Low to High</option>
          <option value="fees-high">Fees: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
        
        <button
          onClick={() => setShowFilter(p => !p)}
          className={`md:hidden flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-3 rounded-2xl transition-colors ${showFilter ? 'bg-primary text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className='flex flex-col md:flex-row items-start gap-6'>
        {/* Sidebar filter */}
        <motion.div
          initial={false}
          animate={{ height: showFilter || window.innerWidth >= 768 ? 'auto' : 0, opacity: showFilter || window.innerWidth >= 768 ? 1 : 0 }}
          className={`w-full md:w-56 flex-shrink-0 overflow-hidden md:overflow-visible md:opacity-100 md:h-auto ${showFilter ? 'block' : 'hidden md:block'}`}
        >
          <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Specialties</p>
            <div className='space-y-1 mb-6'>
              <button
                onClick={() => navigate('/doctors')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  !speciality ? 'bg-primary text-white shadow-sm' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>🏥</span> All Doctors
              </button>
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => navigate(spec === speciality ? '/doctors' : `/doctors/${spec}`)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    speciality === spec ? 'bg-primary text-white shadow-sm' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{specialtyIcons[spec]}</span> {spec}
                </button>
              ))}
            </div>
            
            {/* Price Range Filter */}
            <div className='mb-6 pb-6 border-b border-gray-700'>
              <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Consultation Fees
              </p>
              <div className='space-y-2'>
                <input
                  type='range'
                  min='0'
                  max='2000'
                  step='100'
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                  className='w-full accent-primary'
                />
                <div className={`flex justify-between text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>₹0</span>
                  <span className='font-semibold text-primary'>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            {/* Rating Filter */}
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Minimum Rating
              </p>
              <div className='space-y-2'>
                {[0, 3, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      minRating === rating ? 'bg-primary text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {rating === 0 ? 'All Ratings' : `${rating}+ ⭐`}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Clear Filters */}
            {(priceRange[1] < 2000 || minRating > 0) && (
              <button
                onClick={() => { setPriceRange([0, 2000]); setMinRating(0) }}
                className={`w-full mt-4 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Doctor grid */}
        <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          <AnimatePresence mode='popLayout'>
            {filterDoc.map((item, index) => (
              <motion.div
                layout
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className={`rounded-2xl overflow-hidden cursor-pointer group border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  darkMode ? 'bg-gray-800 border-gray-700 hover:border-primary/40 hover:shadow-indigo-900/30' : 'bg-white border-gray-100 hover:border-primary/20 hover:shadow-indigo-100/80'
                }`}
              >
                {/* Image */}
                <div className='relative overflow-hidden bg-gradient-to-b from-gray-100 to-gray-50'>
                  {item.image ? (
                    <img
                      className='w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500'
                      src={item.image} 
                      alt={item.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className='w-full h-64 bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center'>
                      <span className='text-white text-6xl font-bold'>{item.name?.charAt(0) || 'D'}</span>
                    </div>
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                  <div className='absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-green-600 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm'>
                    <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' /> Available
                  </div>
                  <div className='absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0'>
                    <div className='bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg'>
                      Book Now <ArrowRight size={11} />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className='p-4'>
                  <p className={`font-bold text-base group-hover:text-primary transition-colors ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {item.name}
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.speciality}</p>
                  
                  {/* Rating Display */}
                  <div className='flex items-center gap-1.5 mt-2'>
                    <span className='text-yellow-500 text-sm'>⭐</span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.rating || 4.5}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      ({item.reviewCount || 0} reviews)
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${darkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'}`}>
                      Available
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${darkMode ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
                      📹 Video
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filterDoc.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='col-span-full flex flex-col items-center justify-center py-24 gap-4'>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>🔍</div>
              <p className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No doctors found</p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Try a different specialty or search term</p>
              <button onClick={() => { setSearch(''); navigate('/doctors') }} className='text-sm text-primary font-semibold hover:underline'>Clear filters</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
