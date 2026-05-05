import React, { useContext, useState } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminAllAppointments from './pages/AdminAllAppointments'
import AdminDoctorsList from './pages/AdminDoctorsList'
import AdminAddDoctor from './pages/AdminAddDoctor'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminLayout from './components/AdminLayout'

const AdminRoutes = () => {
  const { aToken } = useContext(AdminContext)
  if (!aToken) return <AdminLogin />
  return (
    <AdminLayout>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<AdminDashboard />} />
        <Route path='/appointments' element={<AdminAllAppointments />} />
        <Route path='/add-doctor' element={<AdminAddDoctor />} />
        <Route path='/doctors' element={<AdminDoctorsList />} />
        <Route path='/analytics' element={<AdminAnalytics />} />
        <Route path='*' element={<AdminDashboard />} />
      </Routes>
    </AdminLayout>
  )
}

const App = () => {
  return (
    <div style={{ background: '#060c18', minHeight: '100vh' }}>
      <AdminRoutes />
      <ToastContainer theme='dark' />
    </div>
  )
}

export default App
