import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
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

const AdminRoutes = () => {
  const { aToken } = useContext(AdminContext)
  if (!aToken) return <AdminLogin />
  return (
    <AdminLayout>
      <Routes>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='appointments' element={<AdminAllAppointments />} />
        <Route path='add-doctor' element={<AdminAddDoctor />} />
        <Route path='doctors' element={<AdminDoctorsList />} />
        <Route path='*' element={<AdminDashboard />} />
      </Routes>
    </AdminLayout>
  )
}

const App = () => {
  const { darkMode } = useContext(AppContext)

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      <Routes>
        <Route path='/' element={<div className='mx-4 sm:mx-[8%]'><Home /></div>} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path='/login' element={<div className='mx-4 sm:mx-[8%]'><Login /></div>} />
        <Route path='/forgot-password' element={<div className='mx-4 sm:mx-[8%]'><ForgotPassword /></div>} />
        <Route path='/about' element={<div className='mx-4 sm:mx-[8%]'><About /></div>} />
        <Route path='/contact' element={<div className='mx-4 sm:mx-[8%]'><Contact /></div>} />
        <Route path='/my-profile' element={<div className='mx-4 sm:mx-[8%]'><MyProfile /></div>} />
        <Route path='/my-appointment' element={<div className='mx-4 sm:mx-[8%]'><MyAppointment /></div>} />
        <Route path='/appointment/:docId' element={<div className='mx-4 sm:mx-[8%]'><Appointment /></div>} />
        <Route path='/video-consult' element={<VideoConsult />} />
        <Route path='/doctor-portal' element={<div className='mx-4 sm:mx-[8%]'><DoctorPortal /></div>} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
      <Footer />
      <Chatbot />
      <ToastContainer theme='dark' />
    </div>
  )
}

export default App
