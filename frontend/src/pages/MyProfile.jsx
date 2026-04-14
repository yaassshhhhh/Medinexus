import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { Edit2, Check, Upload, Trash2 } from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData, darkMode } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);
      if (removeImage) formData.append('removeImage', 'true');

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
        setRemoveImage(false);
      } else { toast.error(data.message); }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!userData && token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading profile data...</p>
      </div>
    );
  }

  const inputClass = `rounded px-2 py-1 focus:outline-primary ${darkMode ? 'bg-gray-700 border border-gray-600 text-gray-100' : 'bg-gray-50 border border-gray-200'}`

  return userData && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-lg flex flex-col gap-2 text-sm mx-auto md:mx-0 p-6 border rounded-2xl shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-100 text-zinc-600'}`}
    >
      <div className="relative inline-block w-fit">
        {isEdit ? (
          <label htmlFor="image">
            <div className="relative cursor-pointer">
              <img className="w-36 rounded-2xl shadow-md opacity-75 object-cover h-36" src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 bg-white/30 rounded-2xl font-bold">
                <Upload size={24} className="mb-1" /> Upload
              </div>
            </div>
            <input onChange={(e) => { setImage(e.target.files[0]); setRemoveImage(false); }} type="file" id="image" hidden />
          </label>
        ) : (
          <img className='w-36 rounded-2xl shadow-md object-cover h-36' src={userData.image} alt="" />
        )}
        {isEdit && !image && userData.image && !userData.image.startsWith("data:") && (
          <button onClick={() => { setRemoveImage(true); setImage(false); }} className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full shadow-sm hover:bg-red-200 transition-colors">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {isEdit ? (
        <input className={`${inputClass} text-3xl font-medium max-w-60 mt-4`} type="text" value={userData.name}
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} />
      ) : (
        <p className={`font-bold text-3xl mt-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{userData.name}</p>
      )}
      <hr className={`h-[1px] border-none my-2 ${darkMode ? 'bg-gray-700' : 'bg-zinc-200'}`} />

      <div>
        <p className={`font-semibold underline mt-3 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>CONTACT INFORMATION</p>
        <div className={`grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Email id:</p>
          <p className='text-blue-500 font-medium'>{userData.email}</p>
          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Phone:</p>
          {isEdit ? (
            <input className={`${inputClass} max-w-52`} type="text" value={userData.phone}
              onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))} />
          ) : (
            <p className='text-blue-500'>{userData.phone}</p>
          )}
          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Address:</p>
          {isEdit ? (
            <p>
              <input className={`${inputClass} w-full mb-1`} onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev?.address, line1: e.target.value } }))} value={userData.address?.line1 || ''} type="text" />
              <br />
              <input className={`${inputClass} w-full`} onChange={(e) => setUserData((prev) => ({ ...prev, address: { ...prev?.address, line2: e.target.value } }))} value={userData.address?.line2 || ''} type="text" />
            </p>
          ) : (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {userData.address?.line1 || ''}<br />{userData.address?.line2 || ''}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className={`font-semibold underline mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>BASIC INFORMATION</p>
        <div className={`grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Gender:</p>
          {isEdit ? (
            <select className={`max-w-20 ${inputClass}`} onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Not Selected">Not Selected</option>
            </select>
          ) : (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{userData.gender}</p>
          )}
          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Birthday:</p>
          {isEdit
            ? <input className={`max-w-28 ${inputClass}`} type="date" onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
            : <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{userData.dob}</p>
          }
        </div>
      </div>

      <div className='mt-10'>
        {isEdit
          ? <button className='border border-primary px-8 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all font-semibold flex items-center gap-2' onClick={updateUserProfileData}>
            <Check size={18} /> Save information
          </button>
          : <button className='border border-primary px-8 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all font-semibold flex items-center gap-2' onClick={() => setIsEdit(true)}>
            <Edit2 size={16} /> Edit Profile
          </button>
        }
      </div>
    </motion.div>
  );
};

export default MyProfile;
