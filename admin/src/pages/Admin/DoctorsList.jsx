import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { motion, AnimatePresence } from 'framer-motion'

const DoctorsList = () => {
    const { aToken, doctors, getAllDoctors, deleteDoctor, toggleAvailability } = useContext(AdminContext)
    const [copied, setCopied] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null) // stores doctor object to delete
    const [loadingId, setLoadingId] = useState(null)

    useEffect(() => {
        if (aToken) getAllDoctors()
    }, [aToken])

    const copyEmail = (email, id) => {
        navigator.clipboard.writeText(email)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleToggle = async (doctorId) => {
        setLoadingId(doctorId)
        await toggleAvailability(doctorId)
        setLoadingId(null)
    }

    const handleDelete = async () => {
        if (!confirmDelete) return
        setLoadingId(confirmDelete._id)
        await deleteDoctor(confirmDelete._id)
        setLoadingId(null)
        setConfirmDelete(null)
    }

    return (
        <div className='m-5 h-full overflow-y-scroll'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>All Doctors</h1>
                <div className='bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-sm text-indigo-700 font-medium'>
                    Total: <span className='font-bold'>{doctors.length}</span> doctors
                </div>
            </div>

            <div className='flex flex-wrap gap-6 pt-2'>
                {doctors.map((item, index) => (
                    <motion.div
                        whileHover={{ y: -4 }}
                        key={item._id}
                        className='bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 w-full sm:w-72'
                    >
                        <div className='bg-[#F2F3FF] overflow-hidden aspect-[3/4] relative'>
                            <img
                                className='w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500'
                                src={item.image} alt={item.name}
                            />
                            {/* Availability badge on image */}
                            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${item.available ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                                {item.available ? '● Available' : '● Unavailable'}
                            </div>
                        </div>

                        <div className='p-5'>
                            <p className='text-gray-900 text-lg font-bold group-hover:text-primary transition-colors'>{item.name}</p>
                            <p className='text-gray-500 text-sm font-medium'>{item.speciality}</p>
                            <p className='text-gray-400 text-xs mt-0.5'>{item.degree} · {item.experience}</p>

                            {/* Email row */}
                            <div className='mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100'>
                                <span className='text-xs text-gray-500 truncate flex-1 font-mono'>{item.email}</span>
                                <button
                                    onClick={() => copyEmail(item.email, item._id)}
                                    className='text-xs text-indigo-600 font-bold hover:text-indigo-800 flex-shrink-0'
                                >
                                    {copied === item._id ? '✓ Copied' : 'Copy'}
                                </button>
                            </div>

                            {/* Action buttons */}
                            <div className='mt-4 flex gap-2'>
                                {/* Toggle Availability */}
                                <button
                                    onClick={() => handleToggle(item._id)}
                                    disabled={loadingId === item._id}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all
                                        ${item.available
                                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                        } disabled:opacity-50`}
                                >
                                    {loadingId === item._id ? (
                                        <span className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                                    ) : (
                                        <>
                                            <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                                            {item.available ? 'Available' : 'Unavailable'}
                                        </>
                                    )}
                                </button>

                                {/* Delete button */}
                                <button
                                    onClick={() => setConfirmDelete(item)}
                                    disabled={loadingId === item._id}
                                    className='px-3 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all disabled:opacity-50'
                                    title='Delete Doctor'
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M2 4h12M5 4V2.5A1.5 1.5 0 016.5 1h3A1.5 1.5 0 0111 2.5V4M6 7v5M10 7v5M3 4l1 9.5A1 1 0 005 14.5h6a1 1 0 001-1L13 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {doctors.length === 0 && (
                    <div className='w-full text-center py-16 text-gray-400'>
                        <p className='text-lg'>No doctors added yet.</p>
                        <p className='text-sm mt-1'>Use "Add Doctor" to get started.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
                        onClick={() => setConfirmDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className='bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl'
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Icon */}
                            <div className='w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M14 9v6M14 18h.01M4 14a10 10 0 1020 0A10 10 0 004 14z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>

                            <h3 className='text-lg font-bold text-gray-900 text-center'>Delete Doctor?</h3>
                            <p className='text-sm text-gray-500 text-center mt-2'>
                                Are you sure you want to delete <span className='font-semibold text-gray-700'>{confirmDelete.name}</span>? This action cannot be undone.
                            </p>

                            <div className='flex gap-3 mt-6'>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className='flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loadingId === confirmDelete._id}
                                    className='flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2'
                                >
                                    {loadingId === confirmDelete._id ? (
                                        <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    ) : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default DoctorsList
