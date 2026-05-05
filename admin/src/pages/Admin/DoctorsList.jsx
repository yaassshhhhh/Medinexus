import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Trash2, X, Save, Upload } from 'lucide-react'

const SPECIALITIES = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']
const EXPERIENCE_OPTIONS = ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Years', '7 Years', '8 Years', '9 Years', '10+ Years']

const DoctorsList = () => {
    const { aToken, doctors, getAllDoctors, deleteDoctor, toggleAvailability, editDoctor } = useContext(AdminContext)
    const [copied, setCopied] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [loadingId, setLoadingId] = useState(null)

    // Edit modal state
    const [editDoc, setEditDoc] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [editImg, setEditImg] = useState(null)
    const [editLoading, setEditLoading] = useState(false)

    useEffect(() => {
        if (aToken) getAllDoctors()
    }, [aToken])

    const copyEmail = (email, id) => {
        navigator.clipboard.writeText(email)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const handleToggle = async (doctorId) => {
        setLoadingId(doctorId + '_t')
        await toggleAvailability(doctorId)
        setLoadingId(null)
    }

    const handleDelete = async () => {
        if (!confirmDelete) return
        setLoadingId(confirmDelete._id + '_d')
        await deleteDoctor(confirmDelete._id)
        setLoadingId(null)
        setConfirmDelete(null)
    }

    const openEdit = (doc) => {
        setEditDoc(doc)
        setEditImg(null)
        setEditForm({
            name: doc.name || '',
            speciality: doc.speciality || 'General physician',
            degree: doc.degree || '',
            experience: doc.experience || '1 Year',
            fees: doc.fees || '',
            about: doc.about || '',
            gender: doc.gender || 'Male',
            address1: doc.address?.line1 || '',
            address2: doc.address?.line2 || '',
        })
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        setEditLoading(true)
        const formData = new FormData()
        formData.append('doctorId', editDoc._id)
        formData.append('name', editForm.name)
        formData.append('speciality', editForm.speciality)
        formData.append('degree', editForm.degree)
        formData.append('experience', editForm.experience)
        formData.append('fees', editForm.fees)
        formData.append('about', editForm.about)
        formData.append('gender', editForm.gender)
        formData.append('address', JSON.stringify({ line1: editForm.address1, line2: editForm.address2 }))
        if (editImg) formData.append('image', editImg)

        const ok = await editDoctor(formData)
        setEditLoading(false)
        if (ok) setEditDoc(null)
    }

    const inputStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'white',
        borderRadius: '10px',
        padding: '8px 12px',
        fontSize: '13px',
        outline: 'none',
        width: '100%',
        transition: 'border-color 0.2s'
    }

    return (
        <div className='p-5 pb-16'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-bold text-white'>Doctors List</h1>
                    <p className='text-sm mt-0.5' style={{ color: '#8ba3c7' }}>{doctors.length} registered doctors</p>
                </div>
            </div>

            {/* Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {doctors.map((item, index) => (
                    <motion.div
                        whileHover={{ y: -3 }}
                        key={item._id}
                        className='rounded-2xl overflow-hidden transition-all duration-300'
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.1)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                        {/* Image */}
                        <div className='relative overflow-hidden' style={{ aspectRatio: '3/4', background: 'rgba(99,102,241,0.08)' }}>
                            <img
                                className='w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105'
                                src={item.image} alt={item.name}
                                onError={e => { e.target.onerror = null; e.target.src = `http://localhost:5173/doc${(index % 15) + 1}.png` }}
                            />
                            {/* Availability badge */}
                            <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${item.available ? 'text-green-400' : 'text-slate-400'}`}
                                style={{ background: item.available ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: `1px solid ${item.available ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.15)'}` }}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-400' : 'bg-slate-400'}`} />
                                {item.available ? 'Available' : 'Unavailable'}
                            </div>
                            {/* Gender badge */}
                            {item.gender && item.gender !== 'Not Selected' && (
                                <div className='absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-semibold'
                                    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#8ba3c7', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {item.gender}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className='p-4'>
                            <p className='text-white font-bold text-sm leading-tight'>{item.name}</p>
                            <p className='text-xs mt-0.5 font-medium' style={{ color: '#818cf8' }}>{item.speciality}</p>
                            <p className='text-xs mt-0.5' style={{ color: '#8ba3c7' }}>{item.degree} · {item.experience}</p>
                            <p className='text-xs mt-0.5 font-semibold' style={{ color: '#f59e0b' }}>₹{item.fees} / visit</p>

                            {/* Email */}
                            <div className='mt-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg'
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <span className='text-xs truncate flex-1 font-mono' style={{ color: '#8ba3c7' }}>{item.email}</span>
                                <button onClick={() => copyEmail(item.email, item._id)}
                                    className='text-xs font-bold flex-shrink-0 transition-colors'
                                    style={{ color: copied === item._id ? '#4ade80' : '#818cf8' }}>
                                    {copied === item._id ? '✓' : 'Copy'}
                                </button>
                            </div>

                            {/* Actions */}
                            <div className='mt-3 flex gap-2'>
                                {/* Toggle */}
                                <button
                                    onClick={() => handleToggle(item._id)}
                                    disabled={loadingId === item._id + '_t'}
                                    className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50'
                                    style={{
                                        background: item.available ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${item.available ? 'rgba(74,222,128,0.25)' : 'rgba(255,255,255,0.1)'}`,
                                        color: item.available ? '#4ade80' : '#8ba3c7'
                                    }}>
                                    {loadingId === item._id + '_t'
                                        ? <span className='w-3 h-3 border border-current border-t-transparent rounded-full animate-spin' />
                                        : <><span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-400' : 'bg-slate-500'}`} />{item.available ? 'Available' : 'Unavailable'}</>
                                    }
                                </button>

                                {/* Edit */}
                                <button
                                    onClick={() => openEdit(item)}
                                    className='w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110'
                                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
                                    title='Edit Doctor'>
                                    <Edit2 size={13} style={{ color: '#818cf8' }} />
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => setConfirmDelete(item)}
                                    disabled={loadingId === item._id + '_d'}
                                    className='w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50'
                                    style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}
                                    title='Delete Doctor'>
                                    <Trash2 size={13} style={{ color: '#f87171' }} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {doctors.length === 0 && (
                    <div className='col-span-full text-center py-16' style={{ color: '#8ba3c7' }}>
                        <p className='text-lg'>No doctors added yet.</p>
                        <p className='text-sm mt-1'>Use "Add Doctor" to get started.</p>
                    </div>
                )}
            </div>

            {/* ── Edit Modal ── */}
            <AnimatePresence>
                {editDoc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 flex items-center justify-center p-4'
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setEditDoc(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className='w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl'
                            style={{ background: '#0d1525', border: '1px solid rgba(255,255,255,0.1)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className='flex items-center justify-between px-6 py-4'
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                <div>
                                    <h3 className='text-lg font-bold text-white'>Edit Doctor</h3>
                                    <p className='text-xs mt-0.5' style={{ color: '#8ba3c7' }}>{editDoc.name}</p>
                                </div>
                                <button onClick={() => setEditDoc(null)}
                                    className='w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10'
                                    style={{ color: '#8ba3c7' }}>
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className='p-6 space-y-5'>
                                {/* Image upload */}
                                <div className='flex items-center gap-4'>
                                    <div className='w-20 h-20 rounded-xl overflow-hidden flex-shrink-0'
                                        style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
                                        <img
                                            src={editImg ? URL.createObjectURL(editImg) : editDoc.image}
                                            className='w-full h-full object-cover object-top'
                                            onError={e => { e.target.onerror = null; e.target.src = `http://localhost:5173/doc1.png` }}
                                            alt=''
                                        />
                                    </div>
                                    <label className='flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all hover:opacity-80'
                                        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
                                        <Upload size={14} />
                                        Change Photo
                                        <input type='file' accept='image/*' hidden onChange={e => setEditImg(e.target.files[0])} />
                                    </label>
                                </div>

                                {/* Form grid */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>Full Name</label>
                                        <input style={inputStyle} value={editForm.name}
                                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                            onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            required />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>Speciality</label>
                                        <select style={{ ...inputStyle, cursor: 'pointer' }} value={editForm.speciality}
                                            onChange={e => setEditForm(f => ({ ...f, speciality: e.target.value }))}>
                                            {SPECIALITIES.map(s => <option key={s} style={{ background: '#0d1525' }}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>Education</label>
                                        <input style={inputStyle} value={editForm.degree}
                                            onChange={e => setEditForm(f => ({ ...f, degree: e.target.value }))}
                                            onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            placeholder='MBBS, MD...' required />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>Experience</label>
                                        <select style={{ ...inputStyle, cursor: 'pointer' }} value={editForm.experience}
                                            onChange={e => setEditForm(f => ({ ...f, experience: e.target.value }))}>
                                            {EXPERIENCE_OPTIONS.map(y => <option key={y} style={{ background: '#0d1525' }}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>Consultation Fees (₹)</label>
                                        <input style={inputStyle} type='number' value={editForm.fees}
                                            onChange={e => setEditForm(f => ({ ...f, fees: e.target.value }))}
                                            onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            placeholder='500' required />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>Gender</label>
                                        <select style={{ ...inputStyle, cursor: 'pointer' }} value={editForm.gender}
                                            onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))}>
                                            {['Male', 'Female', 'Other'].map(g => <option key={g} style={{ background: '#0d1525' }}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>Address Line 1</label>
                                        <input style={inputStyle} value={editForm.address1}
                                            onChange={e => setEditForm(f => ({ ...f, address1: e.target.value }))}
                                            onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            placeholder='Clinic / Hospital' />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>Address Line 2</label>
                                        <input style={inputStyle} value={editForm.address2}
                                            onChange={e => setEditForm(f => ({ ...f, address2: e.target.value }))}
                                            onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            placeholder='City, State' />
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-xs font-semibold mb-1.5' style={{ color: '#8ba3c7' }}>About</label>
                                    <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                                        value={editForm.about}
                                        onChange={e => setEditForm(f => ({ ...f, about: e.target.value }))}
                                        onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                        rows={3} required />
                                </div>

                                {/* Footer buttons */}
                                <div className='flex gap-3 pt-2'>
                                    <button type='button' onClick={() => setEditDoc(null)}
                                        className='flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5'
                                        style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#8ba3c7' }}>
                                        Cancel
                                    </button>
                                    <button type='submit' disabled={editLoading}
                                        className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60'
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white' }}>
                                        {editLoading
                                            ? <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                            : <><Save size={14} /> Save Changes</>
                                        }
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete Confirm Modal ── */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 flex items-center justify-center p-4'
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setConfirmDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className='w-full max-w-sm rounded-2xl p-6'
                            style={{ background: '#0d1525', border: '1px solid rgba(248,113,113,0.2)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className='w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4'
                                style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
                                <Trash2 size={24} style={{ color: '#f87171' }} />
                            </div>
                            <h3 className='text-lg font-bold text-white text-center'>Delete Doctor?</h3>
                            <p className='text-sm text-center mt-2' style={{ color: '#8ba3c7' }}>
                                Are you sure you want to delete <span className='font-semibold text-white'>{confirmDelete.name}</span>? This cannot be undone.
                            </p>
                            <div className='flex gap-3 mt-6'>
                                <button onClick={() => setConfirmDelete(null)}
                                    className='flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5'
                                    style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#8ba3c7' }}>
                                    Cancel
                                </button>
                                <button onClick={handleDelete}
                                    disabled={loadingId === confirmDelete._id + '_d'}
                                    className='flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2'
                                    style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
                                    {loadingId === confirmDelete._id + '_d'
                                        ? <span className='w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin' />
                                        : 'Delete'}
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
