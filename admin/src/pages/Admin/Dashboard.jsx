import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

const Dashboard = () => {

    const { aToken, backendUrl } = useContext(AdminContext)
    const [dashData, setDashData] = useState(null)
    const [loading, setLoading] = useState(true)

    const getDashboardData = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/dashboard`, {}, { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (aToken) {
            getDashboardData()
        }
    }, [aToken])

    const stats = [
        { icon: assets.doctor_icon, label: 'Doctors', count: dashData?.doctors || 0, bg: 'bg-[#F2F3FF]' },
        { icon: assets.appointments_icon, label: 'Appointments', count: dashData?.appointments || 0, bg: 'bg-[#E3FFFA]' },
        { icon: assets.patients_icon, label: 'Patients', count: dashData?.patients || 0, bg: 'bg-[#FFF5F5]' }
    ]

    if (loading) {
        return (
            <div className='m-5'>
                <div className='flex flex-wrap gap-5'>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className='bg-gray-100 p-6 min-w-72 rounded-xl animate-pulse h-28' />
                    ))}
                </div>
            </div>
        )
    }

    return aToken && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='m-5'
        >
            <div className='flex flex-wrap gap-5'>
                {stats.map((item, index) => (
                    <div key={index} className={`flex items-center gap-4 ${item.bg} p-6 min-w-72 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-sm border border-black/5`}>
                        <img className='w-14' src={item.icon} alt="" />
                        <div>
                            <p className='text-3xl font-bold text-gray-800'>{item.count}</p>
                            <p className='text-gray-500 font-medium'>{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='bg-white mt-10 rounded-xl border border-gray-100 shadow-sm'>
                <div className='flex items-center gap-3 px-6 py-4 border-b border-gray-50'>
                    <img src={assets.list_icon} alt="" />
                    <p className='font-bold text-lg text-gray-800'>Latest Appointments</p>
                </div>

                <div className='pt-2'>
                    {dashData?.latestAppointments?.length > 0 ? (
                        dashData.latestAppointments.map((item, index) => (
                            <div className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-colors' key={index}>
                                <img className='w-12 h-12 rounded-full border border-gray-100 object-cover' src={item.docData?.image || assets.doctor_icon} alt="" />
                                <div className='flex-1'>
                                    <p className='text-gray-800 font-bold'>{item.docData?.name || 'Doctor'}</p>
                                    <p className='text-gray-500 text-sm font-medium'>
                                        {item.userData?.name || 'Patient'} • {item.slotDate?.replace(/_/g, '/')} at {item.slotTime}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    item.cancelled ? 'bg-red-100 text-red-600' : 
                                    item.isCompleted ? 'bg-green-100 text-green-600' : 
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className='text-center py-8 text-gray-400'>No appointments yet</div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default Dashboard
