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
    <div className={`${darkMode ? 'text-gray-100 bg-gray-950' : 'text-gray-900'} transition-colors duration-300`}>
      <div className='mx-4 sm:mx-[8%]'>
      <Navbar />
      </div>
      <div className='mx-4 sm:mx-[8%]'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointment' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/video-consult' element={<VideoConsult />} />
        <Route path='/doctor-portal' element={<DoctorPortal />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
      <Footer />
      <Chatbot />
      <ToastContainer theme={darkMode ? 'dark' : 'light'} />
      </div>
    </div>
  )
}

export default App
