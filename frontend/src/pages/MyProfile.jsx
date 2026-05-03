import React, { useContext, useState } from "react"
import { motion } from "framer-motion"
import { Edit2, Check, Upload, Trash2, User, Mail, Phone, MapPin, Calendar, Users } from "lucide-react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [removeImage, setRemoveImage] = useState(false)

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      if (image) formData.append('image', image)
      if (removeImage) formData.append('removeImage', 'true')

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
        setRemoveImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!userData && token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Loading profile...</p>
      </div>
    )
  }

  const inputCls = `rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500
    bg-[#0d1b3e] border border-[#1e2d4a] text-gray-100 placeholder-gray-500 transition-all`

  return userData && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto md:mx-0"
    >
      {/* Page header */}
      <div className="mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Account
        </span>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-sm mt-1 text-gray-400">Manage your personal information</p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Profile header band */}
        <div
          className="px-6 pt-6 pb-4 flex items-end gap-5 flex-wrap"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {isEdit ? (
              <label htmlFor="image" className="cursor-pointer group">
                <div className="relative">
                  <img
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/40 opacity-80"
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt=""
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-400 bg-black/50 rounded-2xl">
                    <Upload size={20} className="mb-0.5" />
                    <span className="text-xs font-bold">Change</span>
                  </div>
                </div>
                <input onChange={(e) => {
                  const file = e.target.files[0]
                  if (!file) return
                  if (file.size > 2 * 1024 * 1024) {
                    toast.error('Image must be under 2MB')
                    return
                  }
                  setImage(file)
                  setRemoveImage(false)
                }} type="file" id="image" hidden accept="image/*" />
              </label>
            ) : (
              <img
                className="w-24 h-24 rounded-2xl object-cover"
                style={{ border: '2px solid rgba(0,212,255,0.3)' }}
                src={userData.image}
                alt=""
              />
            )}
            {isEdit && !image && userData.image && !userData.image.startsWith("data:") && (
              <button
                onClick={() => { setRemoveImage(true); setImage(false) }}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full hover:bg-red-500/40 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0 pb-1">
            {isEdit ? (
              <input
                className={`${inputCls} text-xl font-bold w-full max-w-xs`}
                type="text"
                value={userData.name}
                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
              />
            ) : (
              <p className="text-xl font-bold text-white truncate">{userData.name}</p>
            )}
            <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: '#00d4ff' }}>
              <Mail size={13} />
              {userData.email}
            </p>
          </div>

          {/* Edit / Save button */}
          <div className="pb-1">
            {isEdit ? (
              <button
                onClick={updateUserProfileData}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', boxShadow: '0 4px 14px rgba(14,165,233,0.3)' }}
              >
                <Check size={15} /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff', background: 'rgba(0,212,255,0.07)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.07)'}
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Contact Information */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-cyan-400 flex items-center gap-2">
              <Phone size={12} /> Contact Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                  <Phone size={11} /> Phone
                </p>
                {isEdit ? (
                  <input
                    className={`${inputCls} w-full`}
                    type="text"
                    value={userData.phone}
                    onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                ) : (
                  <p className="text-sm font-medium text-white">{userData.phone || '—'}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                  <Mail size={11} /> Email
                </p>
                <p className="text-sm font-medium truncate" style={{ color: '#00d4ff' }}>{userData.email}</p>
              </div>

              {/* Address */}
              <div
                className="sm:col-span-2 rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                  <MapPin size={11} /> Address
                </p>
                {isEdit ? (
                  <div className="space-y-2">
                    <input
                      className={`${inputCls} w-full`}
                      type="text"
                      placeholder="Address line 1"
                      value={userData.address?.line1 || ''}
                      onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev?.address, line1: e.target.value } }))}
                    />
                    <input
                      className={`${inputCls} w-full`}
                      type="text"
                      placeholder="Address line 2"
                      value={userData.address?.line2 || ''}
                      onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev?.address, line2: e.target.value } }))}
                    />
                  </div>
                ) : (
                  <p className="text-sm font-medium text-white leading-relaxed">
                    {userData.address?.line1 || '—'}
                    {userData.address?.line2 && <><br />{userData.address.line2}</>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-cyan-400 flex items-center gap-2">
              <User size={12} /> Basic Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gender */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                  <Users size={11} /> Gender
                </p>
                {isEdit ? (
                  <select
                    className={`${inputCls} w-full`}
                    value={userData.gender}
                    onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                  >
                    <option style={{ background: '#0d1525' }}>Male</option>
                    <option style={{ background: '#0d1525' }}>Female</option>
                    <option style={{ background: '#0d1525' }}>Not Selected</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-white">{userData.gender || '—'}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1.5">
                  <Calendar size={11} /> Date of Birth
                </p>
                {isEdit ? (
                  <input
                    className={`${inputCls} w-full`}
                    type="date"
                    value={userData.dob}
                    onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm font-medium text-white">{userData.dob || '—'}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default MyProfile
