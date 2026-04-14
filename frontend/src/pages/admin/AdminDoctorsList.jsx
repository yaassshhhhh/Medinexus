import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { motion } from 'framer-motion';

const AdminDoctorsList = () => {
  const { aToken, doctors, getAllDoctors } = useContext(AdminContext);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  const copyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className='m-5 h-full overflow-y-scroll'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>All Doctors</h1>
        <div className='bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 text-sm text-indigo-700 font-medium'>
          🔑 Default password: <span className='font-bold font-mono'>12345678</span>
        </div>
      </div>

      <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-700'>
        <p className='font-semibold mb-1'>Doctor Portal Access</p>
        <p>Doctors log in at <span className='font-mono font-bold'>/doctor-portal</span> using their email + password <span className='font-mono font-bold'>12345678</span></p>
      </div>

      <div className='flex flex-wrap gap-6 pt-2'>
        {doctors.map((item, index) => (
          <motion.div whileHover={{ y: -6 }} key={index}
            className='bg-white border border-gray-100 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 w-full sm:w-72'>
            <div className='bg-[#F2F3FF] overflow-hidden'>
              <img className='w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-500'
                src={item.image} alt={item.name} />
            </div>
            <div className='p-5'>
              <p className='text-gray-900 text-lg font-bold group-hover:text-primary transition-colors'>{item.name}</p>
              <p className='text-gray-500 text-sm font-medium'>{item.speciality}</p>
              <p className='text-gray-400 text-xs mt-0.5'>{item.degree} · {item.experience}</p>

              {/* Email */}
              <div className='mt-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100'>
                <span className='text-xs text-gray-600 truncate flex-1 font-mono'>{item.email}</span>
                <button onClick={() => copyEmail(item.email, item._id)}
                  className='text-xs text-indigo-600 font-bold hover:text-indigo-800 flex-shrink-0'>
                  {copied === item._id ? '✓' : 'Copy'}
                </button>
              </div>

              {/* Default password badge */}
              <div className='mt-2 flex items-center gap-2 bg-yellow-50 rounded-lg px-3 py-1.5 border border-yellow-100'>
                <span className='text-xs text-yellow-700'>🔑</span>
                <span className='text-xs font-mono font-bold text-yellow-800'>12345678</span>
              </div>

              <div className='flex items-center gap-2 mt-3'>
                <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-300'}`} />
                <p className='text-sm font-medium text-gray-600'>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {doctors.length === 0 && (
          <p className='text-gray-400 py-10'>No doctors found. Add doctors using the "Add Doctor" section.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDoctorsList;
