import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CheckCircle, XCircle, IndianRupee, Users, Calendar, Stethoscope } from 'lucide-react'

const Dashboard = () => {
    const { aToken, backendUrl, cancelAppointment, completeAppointment } = useContext(AdminContext)
    const [dashData, setDashData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingId, setLoadingId] = useState(null)
    const navigate = useNavigate()

    const getDashboardData = async () => {
        try {
            setLoading(true)
            const { data } = await axios.post(`${backendUrl}/api/admin/dashboard`, {}, {
                headers: { aToken },
                timeout: 10000
            })
            if (data.success) setDashData(data.dashData)
            else toast.error(data.message)
        } catch (error) {
            if (error.code === 'ECONNABORTED') toast.error('Request timeout.')
            else if (error.request) toast.error('Cannot connect to backend.')
            else toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (aToken) getDashboardData()
    }, [aToken])

    const handleComplete = async (id) => {
        setLoadingId(id + '_c')
        await completeAppointment(id)
        setLoadingId(null)
        getDashboardData()
    }

    const handleCancel = async (id) => {
        setLoadingId(id + '_x')
        await cancelAppointment(id)
        setLoadingId(null)
        getDashboardData()
    }

    const statCards = [
        {
            icon: <Stethoscope size={22} style={{ color: '#818cf8' }} />,
            label: 'Doctors',
            count: dashData?.doctors ?? 0,
            bg: 'rgba(99,102,241,0.1)',
            border: 'rgba(99,102,241,0.2)',
            color: '#818cf8',
            onClick: () => navigate('/doctors')
        },
        {
            icon: <Calendar size={22} style={{ color: '#34d399' }} />,
            label: 'Appointments',
            count: dashData?.appointments ?? 0,
            bg: 'rgba(52,211,153,0.1)',
            border: 'rgba(52,211,153,0.2)',
            color: '#34d399',
            onClick: () => navigate('/appointments')
        },
        {
            icon: <Users size={22} style={{ color: '#60a5fa' }} />,
            label: 'Patients',
            count: dashData?.patients ?? 0,
            bg: 'rgba(96,165,250,0.1)',
            border: 'rgba(96,165,250,0.2)',
            color: '#60a5fa',
            onClick: () => navigate('/appointments')
        },
        {
            icon: <IndianRupee size={22} style={{ color: '#f59e0b' }} />,
            label: 'Revenue',
            count: dashData?.revenue != null ? `₹${Number(dashData.revenue).toLocaleString('en-IN')}` : '₹0',
            bg: 'rgba(245,158,11,0.1)',
            border: 'rgba(245,158,11,0.2)',
            color: '#f59e0b',
            onClick: () => navigate('/analytics')
        },
    ]

    if (loading) return (
        <div className='p-5'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                {[1,2,3,4].map(i => (
                    <div key={i} className='rounded-2xl h-28 animate-pulse' style={{ background: 'rgba(255,255,255,0.05)' }} />
                ))}
            </div>
            <div className='rounded-2xl h-64 animate-pulse' style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
    )

    return aToken && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className='p-5 pb-16'>

            {/* Welcome */}
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-white'>Dashboard</h1>
                <p className='text-sm mt-0.5' style={{ color: '#8ba3c7' }}>Welcome back, Admin</p>
            </div>

            {/* Stat Cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onClick={card.onClick}
                        className='rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1'
                        style={{ background: card.bg, border: `1px solid ${card.border}` }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 24px ${card.bg}`}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <div className='w-10 h-10 rounded-xl flex items-center justify-center mb-3'
                            style={{ background: 'rgba(255,255,255,0.08)' }}>
                            {card.icon}
                        </div>
                        <p className='text-2xl font-extrabold text-white'>{card.count}</p>
                        <p className='text-sm mt-0.5 font-medium' style={{ color: card.color }}>{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Latest Appointments */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='rounded-2xl overflow-hidden'
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
                <div className='flex items-center justify-between px-5 py-4'
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                    <p className='font-bold text-white'>Latest Appointments</p>
                    <button onClick={() => navigate('/appointments')}
                        className='text-xs font-semibold transition-colors hover:text-white'
                        style={{ color: '#818cf8' }}>
                        View All →
                    </button>
                </div>

                <div>
                    {dashData?.latestAppointments?.length > 0 ? (
                        dashData.latestAppointments.map((item, index) => (
                            <div key={index}
                                className='flex items-center px-5 py-3.5 gap-4 transition-colors'
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                                <img
                                    className='w-10 h-10 rounded-full object-cover flex-shrink-0'
                                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                    src={item.docData?.image || assets.doctor_icon}
                                    onError={e => { e.target.onerror = null; e.target.src = assets.doctor_icon }}
                                    alt=''
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-bold text-white truncate'>{item.docData?.name || 'Doctor'}</p>
                                    <p className='text-xs mt-0.5 truncate' style={{ color: '#8ba3c7' }}>
                                        {item.userData?.name || 'Patient'} • {item.slotDate?.replace(/_/g, '/')} at {item.slotTime}
                                    </p>
                                </div>

                                {/* Status badge */}
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                                    item.cancelled
                                        ? 'text-red-400 bg-red-400/10'
                                        : item.isCompleted
                                        ? 'text-green-400 bg-green-400/10'
                                        : 'text-amber-400 bg-amber-400/10'
                                }`}>
                                    {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Pending'}
                                </span>

                                {/* Quick actions */}
                                {!item.cancelled && !item.isCompleted && (
                                    <div className='flex items-center gap-1.5 flex-shrink-0'>
                                        <button
                                            onClick={() => handleComplete(item._id)}
                                            disabled={loadingId === item._id + '_c'}
                                            title='Mark Complete'
                                            className='w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50'
                                            style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)' }}>
                                            {loadingId === item._id + '_c'
                                                ? <span className='w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin' />
                                                : <CheckCircle size={13} className='text-green-400' />}
                                        </button>
                                        <button
                                            onClick={() => handleCancel(item._id)}
                                            disabled={loadingId === item._id + '_x'}
                                            title='Cancel'
                                            className='w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50'
                                            style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
                                            {loadingId === item._id + '_x'
                                                ? <span className='w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin' />
                                                : <XCircle size={13} className='text-red-400' />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className='text-center py-12' style={{ color: '#8ba3c7' }}>
                            <Calendar size={32} className='mx-auto mb-3 opacity-30' />
                            <p className='text-sm'>No appointments yet</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Dashboard
