import React, { useContext, useState } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SplashScreen from './components/SplashScreen'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import VideoConsult from './pages/VideoConsult'
import DoctorPortal from './pages/DoctorPortal'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './context/AppContext'
import { AdminContext } from './context/AdminContext'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAllAppointments from './pages/admin/AdminAllAppointments'
import AdminDoctorsList from './pages/admin/AdminDoctorsList'
import AdminAddDoctor from './pages/admin/AdminAddDoctor'
import AdminLayout from './components/AdminLayout'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AdminAnalytics from './pages/admin/AdminAnalytics'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.26, ease: 'easeIn' } },
}

const AnimatedPage = ({ children }) => (
  <motion.div variants={pageVariants} initial='initial' animate='animate' exit='exit'>
    {children}
  </motion.div>
)

const AdminRoutes = () => {
  const { aToken } = useContext(AdminContext)
  if (!aToken) return <AdminLogin />
  return (
    <AdminLayout>
      <Routes>
        <Route path='login'        element={<Navigate to='/admin/dashboard' replace />} />
        <Route path='dashboard'    element={<AdminDashboard />} />
        <Route path='appointments' element={<AdminAllAppointments />} />
        <Route path='add-doctor'   element={<AdminAddDoctor />} />
        <Route path='doctors'      element={<AdminDoctorsList />} />
        <Route path='analytics'    element={<AdminAnalytics />} />
        <Route path='*'            element={<AdminDashboard />} />
      </Routes>
    </AdminLayout>
  )
}

const App = () => {
  const { darkMode } = useContext(AppContext)
  const { aToken } = useContext(AdminContext)
  const location = useLocation()
  const [splashDone, setSplashDone] = useState(false)

  const isAdminRoute = location.pathname.startsWith('/admin') || aToken

  return (
    <>
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen onComplete={() => setSplashDone(true)} />
        )}
      </AnimatePresence>

      {splashDone && (
        <>
          {/* ADMIN — agar aToken hai ya /admin route pe hai toh sirf admin panel */}
          {isAdminRoute ? (
            <div style={{ background: '#060c18', minHeight: '100vh' }}>
              <Routes location={location} key={location.pathname}>
                <Route path='/admin/*' element={<AdminRoutes />} />
                {/* Agar admin logged in hai aur kisi aur route pe gaya toh admin dashboard pe bhejo */}
                <Route path='*' element={<AdminRoutes />} />
              </Routes>
              <ToastContainer theme='dark' />
            </div>
          ) : (
            /* USER ROUTES — sirf tab jab admin logged in nahi hai */
            <div style={{ background: '#0a0f1e', minHeight: '100vh', color: 'white' }}>
              <Navbar />
              <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                  <Route path='/' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><Home /></div></AnimatedPage>} />
                  <Route path='/doctors' element={<AnimatedPage><Doctors /></AnimatedPage>} />
                  <Route path="/doctors/:speciality" element={<AnimatedPage><Doctors /></AnimatedPage>} />
                  <Route path='/login' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><Login /></div></AnimatedPage>} />
                  <Route path='/forgot-password' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><ForgotPassword /></div></AnimatedPage>} />
                  <Route path='/about' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><About /></div></AnimatedPage>} />
                  <Route path='/contact' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><Contact /></div></AnimatedPage>} />
                  <Route path='/my-profile' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><MyProfile /></div></AnimatedPage>} />
                  <Route path='/my-appointment' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><MyAppointment /></div></AnimatedPage>} />
                  <Route path='/appointment/:docId' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><Appointment /></div></AnimatedPage>} />
                  <Route path='/video-consult' element={<AnimatedPage><VideoConsult /></AnimatedPage>} />
                  <Route path='/doctor-portal' element={<AnimatedPage><div className='mx-4 sm:mx-[8%]'><DoctorPortal /></div></AnimatedPage>} />
                  <Route path='/privacy-policy' element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
                  <Route path='/admin/*' element={<AdminRoutes />} />
                </Routes>
              </AnimatePresence>
              <Footer />
              <Chatbot />
              <ToastContainer theme='dark' />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default App
