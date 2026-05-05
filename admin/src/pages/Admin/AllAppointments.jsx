import React, { useContext, useEffect, useState, useMemo } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { motion } from 'framer-motion'
import { Search, Filter, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react'

// Calculate age from DOB string "DD/MM/YYYY" or "YYYY-MM-DD"
const calcAge = (dob) => {
    if (!dob || dob === 'Not Selected') return '—'
    try {
        let d
        if (dob.includes('/')) {
            const [day, month, year] = dob.split('/')
            d = new Date(`${year}-${month}-${day}`)
        } else {
            d = new Date(dob)
        }
        if (isNaN(d)) return '—'
        const diff = Date.now() - d.getTime()
        const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
        return age > 0 && age < 120 ? age : '—'
    } catch { return '—' }
}

const STATUS_OPTIONS = ['All', 'Pending', 'Completed', 'Cancelled']
const PAYMENT_OPTIONS = ['All', 'Paid', 'Unpaid']

const AllAppointments = () => {
    const { aToken, appointments, getAllAppointments, cancelAppointment, completeAppointment } = useContext(AdminContext)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [paymentFilter, setPaymentFilter] = useState('All')
    const [statusOpen, setStatusOpen] = useState(false)
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [loadingId, setLoadingId] = useState(null)

    useEffect(() => {
        if (aToken) getAllAppointments()
    }, [aToken])

    const filtered = useMemo(() => {
        return appointments.filter(item => {
            const q = search.toLowerCase()
            const matchSearch = !q ||
                item.userData?.name?.toLowerCase().includes(q) ||
                item.docData?.name?.toLowerCase().includes(q) ||
                item.slotDate?.includes(q)

            const matchStatus =
                statusFilter === 'All' ? true :
                statusFilter === 'Cancelled' ? item.cancelled :
                statusFilter === 'Completed' ? (!item.cancelled && item.isCompleted) :
                (!item.cancelled && !item.isCompleted)

            const matchPayment =
                paymentFilter === 'All' ? true :
                paymentFilter === 'Paid' ? item.payment :
                !item.payment

            return matchSearch && matchStatus && matchPayment
        })
    }, [appointments, search, statusFilter, paymentFilter])

    const handleCancel = async (id) => {
        setLoadingId(id + '_cancel')
        await cancelAppointment(id)
        setLoadingId(null)
    }

    const handleComplete = async (id) => {
        setLoadingId(id + '_complete')
        await completeAppointment(id)
        setLoadingId(null)
    }

    const getStatusBadge = (item) => {
        if (item.cancelled) return <span className='flex items-center gap-1 text-red-400 text-xs font-bold'><XCircle size={12} />Cancelled</span>
        if (item.isCompleted) return <span className='flex items-center gap-1 text-green-400 text-xs font-bold'><CheckCircle size={12} />Completed</span>
        return <span className='flex items-center gap-1 text-amber-400 text-xs font-bold'><Clock size={12} />Pending</span>
    }

    const counts = useMemo(() => ({
        total: appointments.length,
        pending: appointments.filter(a => !a.cancelled && !a.isCompleted).length,
        completed: appointments.filter(a => !a.cancelled && a.isCompleted).length,
        cancelled: appointments.filter(a => a.cancelled).length,
    }), [appointments])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-5 pb-16'>

            {/* Header */}
            <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
                <div>
                    <h1 className='text-2xl font-bold text-white'>All Appointments</h1>
                    <p className='text-sm mt-0.5' style={{ color: '#8ba3c7' }}>{counts.total} total appointments</p>
                </div>
                {/* Summary pills */}
                <div className='flex flex-wrap gap-2'>
                    {[
                        { label: 'Pending', count: counts.pending, color: 'text-amber-400', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
                        { label: 'Completed', count: counts.completed, color: 'text-green-400', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)' },
                        { label: 'Cancelled', count: counts.cancelled, color: 'text-red-400', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' },
                    ].map(p => (
                        <div key={p.label} className='px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5'
                            style={{ background: p.bg, border: `1px solid ${p.border}`, color: p.color }}>
                            <span className='font-bold'>{p.count}</span> {p.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className='flex flex-wrap gap-3 mb-5'>
                {/* Search */}
                <div className='flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 min-w-[200px]'
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Search size={14} style={{ color: '#8ba3c7', flexShrink: 0 }} />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder='Search patient, doctor, date...'
                        className='flex-1 text-sm bg-transparent border-none outline-none text-white placeholder-slate-500'
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className='text-slate-500 hover:text-white transition-colors'>
                            <XCircle size={14} />
                        </button>
                    )}
                </div>

                {/* Status filter */}
                <div className='relative'>
                    <button onClick={() => { setStatusOpen(o => !o); setPaymentOpen(false) }}
                        className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all'
                        style={{
                            background: statusFilter !== 'All' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${statusFilter !== 'All' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.1)'}`,
                            color: statusFilter !== 'All' ? '#818cf8' : '#8ba3c7'
                        }}>
                        <Filter size={13} />
                        {statusFilter === 'All' ? 'Status' : statusFilter}
                        <ChevronDown size={12} style={{ transform: statusOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    {statusOpen && (
                        <div className='absolute z-50 top-full mt-1 w-36 rounded-xl shadow-2xl overflow-hidden'
                            style={{ background: '#0d1525', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {STATUS_OPTIONS.map(s => (
                                <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false) }}
                                    className='w-full text-left px-4 py-2.5 text-sm transition-colors'
                                    style={{ color: statusFilter === s ? '#818cf8' : '#8ba3c7', background: statusFilter === s ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payment filter */}
                <div className='relative'>
                    <button onClick={() => { setPaymentOpen(o => !o); setStatusOpen(false) }}
                        className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all'
                        style={{
                            background: paymentFilter !== 'All' ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${paymentFilter !== 'All' ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.1)'}`,
                            color: paymentFilter !== 'All' ? '#4ade80' : '#8ba3c7'
                        }}>
                        <Filter size={13} />
                        {paymentFilter === 'All' ? 'Payment' : paymentFilter}
                        <ChevronDown size={12} style={{ transform: paymentOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    {paymentOpen && (
                        <div className='absolute z-50 top-full mt-1 w-32 rounded-xl shadow-2xl overflow-hidden'
                            style={{ background: '#0d1525', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {PAYMENT_OPTIONS.map(p => (
                                <button key={p} onClick={() => { setPaymentFilter(p); setPaymentOpen(false) }}
                                    className='w-full text-left px-4 py-2.5 text-sm transition-colors'
                                    style={{ color: paymentFilter === p ? '#4ade80' : '#8ba3c7', background: paymentFilter === p ? 'rgba(34,197,94,0.08)' : 'transparent' }}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Clear filters */}
                {(search || statusFilter !== 'All' || paymentFilter !== 'All') && (
                    <button onClick={() => { setSearch(''); setStatusFilter('All'); setPaymentFilter('All') }}
                        className='px-4 py-2.5 rounded-xl text-sm font-medium transition-all'
                        style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}>
                        Clear
                    </button>
                )}
            </div>

            {/* Table */}
            <div className='rounded-2xl overflow-hidden' style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Header */}
                <div className='hidden sm:grid grid-cols-[0.4fr_2.5fr_0.6fr_2fr_2.5fr_1fr_1fr_1.2fr] py-3 px-5 text-xs font-bold uppercase tracking-wide'
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#8ba3c7', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p>Status</p>
                    <p>Actions</p>
                </div>

                <div>
                    {filtered.length === 0 ? (
                        <div className='text-center py-16' style={{ color: '#8ba3c7' }}>
                            <Search size={32} className='mx-auto mb-3 opacity-30' />
                            <p className='text-sm'>No appointments match your filters</p>
                        </div>
                    ) : (
                        filtered.map((item, index) => (
                            <div key={item._id || index}
                                className='flex flex-wrap sm:grid grid-cols-[0.4fr_2.5fr_0.6fr_2fr_2.5fr_1fr_1fr_1.2fr] items-center py-3.5 px-5 transition-colors'
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                onMouseLeave={e => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}>

                                <p className='text-xs max-sm:hidden' style={{ color: '#8ba3c7' }}>{index + 1}</p>

                                {/* Patient */}
                                <div className='flex items-center gap-2.5'>
                                    <img src={item.userData?.image || assets.patient_icon}
                                        className='w-9 h-9 rounded-full object-cover flex-shrink-0'
                                        style={{ border: '1px solid rgba(255,255,255,0.1)' }} alt='' />
                                    <p className='text-sm font-semibold text-white truncate'>{item.userData?.name || 'Unknown'}</p>
                                </div>

                                {/* Age */}
                                <p className='text-sm max-sm:hidden' style={{ color: '#8ba3c7' }}>
                                    {calcAge(item.userData?.dob)}
                                </p>

                                {/* Date */}
                                <div>
                                    <p className='text-sm text-white'>{item.slotDate?.split('_').join('/')}</p>
                                    <p className='text-xs mt-0.5' style={{ color: '#8ba3c7' }}>{item.slotTime}</p>
                                </div>

                                {/* Doctor */}
                                <div className='flex items-center gap-2.5'>
                                    <img src={item.docData?.image || assets.doctor_icon}
                                        className='w-9 h-9 rounded-full object-cover flex-shrink-0'
                                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                                        onError={e => { e.target.onerror = null; e.target.src = assets.doctor_icon }}
                                        alt='' />
                                    <div className='min-w-0'>
                                        <p className='text-sm font-semibold text-white truncate'>{item.docData?.name || 'Unknown'}</p>
                                        <p className='text-xs truncate' style={{ color: '#8ba3c7' }}>{item.docData?.speciality}</p>
                                    </div>
                                </div>

                                {/* Fees */}
                                <div>
                                    <p className='text-sm font-bold text-white'>₹{item.amount}</p>
                                    <p className={`text-xs font-semibold mt-0.5 ${item.payment ? 'text-green-400' : 'text-amber-400'}`}>
                                        {item.payment ? 'Paid' : 'Unpaid'}
                                    </p>
                                </div>

                                {/* Status */}
                                <div>{getStatusBadge(item)}</div>

                                {/* Actions */}
                                <div className='flex items-center gap-1.5'>
                                    {!item.cancelled && !item.isCompleted ? (
                                        <>
                                            <button
                                                onClick={() => handleComplete(item._id)}
                                                disabled={loadingId === item._id + '_complete'}
                                                title='Mark Complete'
                                                className='w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50'
                                                style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)' }}>
                                                {loadingId === item._id + '_complete'
                                                    ? <span className='w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin' />
                                                    : <CheckCircle size={13} className='text-green-400' />}
                                            </button>
                                            <button
                                                onClick={() => handleCancel(item._id)}
                                                disabled={loadingId === item._id + '_cancel'}
                                                title='Cancel'
                                                className='w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50'
                                                style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
                                                {loadingId === item._id + '_cancel'
                                                    ? <span className='w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin' />
                                                    : <XCircle size={13} className='text-red-400' />}
                                            </button>
                                        </>
                                    ) : (
                                        <span className='text-xs' style={{ color: '#8ba3c7' }}>—</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {filtered.length > 0 && (
                <p className='text-xs mt-3 text-right' style={{ color: '#8ba3c7' }}>
                    Showing {filtered.length} of {appointments.length} appointments
                </p>
            )}
        </motion.div>
    )
}

export default AllAppointments
