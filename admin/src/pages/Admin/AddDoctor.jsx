import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { motion } from 'framer-motion'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [loading, setLoading] = useState(false)

    const { aToken, backendUrl, addDoctor } = useContext(AdminContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (!docImg) { alert('Please upload a doctor photo'); return }
        setLoading(true)

        const formData = new FormData()
        formData.append('image', docImg)
        formData.append('name', name)
        formData.append('email', email)
        formData.append('experience', experience)
        formData.append('fees', fees)
        formData.append('about', about)
        formData.append('speciality', speciality)
        formData.append('degree', degree)
        formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

        const success = await addDoctor(formData)
        if (success) {
            setDocImg(null); setName(''); setEmail('')
            setExperience('1 Year'); setFees(''); setAbout('')
            setSpeciality('General physician'); setDegree('')
            setAddress1(''); setAddress2('')
        }
        setLoading(false)
    }

    return (
        <motion.form
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onSubmit={onSubmitHandler}
            className='m-5 w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl'
        >
            <p className='mb-4 text-2xl font-bold text-gray-800 border-b pb-4'>Add New Doctor</p>

            <div className='bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-700 font-medium'>
                ✅ Default password <span className='font-mono font-bold'>12345678</span> is set automatically. Doctor can log in at <span className='font-mono'>/doctor-portal</span>.
            </div>

            <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                <div className='flex flex-col items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-dashed border-primary/30'>
                    <label htmlFor="doc-img" className='cursor-pointer'>
                        <img
                            className='w-24 h-24 bg-white rounded-full object-cover shadow-sm'
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt=""
                        />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden accept="image/*" />
                    <p className='text-sm font-medium'>Upload Photo</p>
                </div>

                <div className='flex-1 flex flex-col gap-5 w-full'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm font-bold ml-1'>Doctor Name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors' type="text" placeholder='Full name' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm font-bold ml-1'>Email (Login ID)</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors' type="email" placeholder='doctor@email.com' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm font-bold ml-1'>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded-xl px-4 py-2.5 outline-none focus:border-primary bg-white'>
                                {['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm font-bold ml-1'>Education</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors' type="text" placeholder='MBBS, MD...' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm font-bold ml-1'>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded-xl px-4 py-2.5 outline-none focus:border-primary bg-white'>
                                {['1 Year','2 Years','3 Years','4 Years','5 Years','6 Years','7 Years','8 Years','9 Years','10+ Years'].map(y => <option key={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm font-bold ml-1'>Consultation Fees (₹)</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors' type="number" placeholder='500' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm font-bold ml-1'>Address Line 1</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors' type="text" placeholder='Clinic / Hospital name' required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm font-bold ml-1'>Address Line 2</p>
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-colors' type="text" placeholder='City, State' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-bold ml-1'>About Doctor</p>
                        <textarea onChange={e => setAbout(e.target.value)} value={about} className='border rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors min-h-28' placeholder='Brief bio and expertise...' rows={4} required />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-primary w-full md:w-fit px-12 py-3.5 text-white rounded-xl hover:bg-indigo-600 transition-all font-bold disabled:opacity-60'
                    >
                        {loading ? 'Adding...' : 'Add Doctor'}
                    </button>
                </div>
            </div>
        </motion.form>
    )
}

export default AddDoctor
