import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { motion } from 'framer-motion';

const AdminAllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full max-w-6xl m-5'>
      <p className='mb-6 font-bold text-2xl text-gray-800'>All Appointments</p>

      <div className='bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-4 px-6 border-b bg-gray-50 text-gray-600 font-bold text-sm'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees/Status</p>
          <p>Action</p>
        </div>

        <div className='divide-y divide-gray-50'>
          {appointments.map((item, index) => (
            <div
              key={index}
              className='flex flex-wrap sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-4 px-6 hover:bg-gray-50 transition-colors text-sm'
            >
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData?.image || ''} className='w-10 h-10 rounded-full border border-gray-100 object-cover' alt="" />
                <p className='text-gray-800 font-bold'>{item.userData?.name || 'Unknown Patient'}</p>
              </div>
              <p className='max-sm:hidden'>{item.userData?.dob ? item.userData.dob : 'N/A'}</p>
              <p>{item.slotDate?.split('_').join('/')}, {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img src={item.docData?.image || ''} className='w-10 h-10 rounded-full border border-gray-100 object-cover' alt="" />
                <p className='text-gray-800 font-bold'>{item.docData?.name || 'Unknown Doctor'}</p>
              </div>
              <div className='flex flex-col'>
                <p className='font-bold text-gray-800'>₹{item.amount}</p>
                <p className={`text-xs font-semibold ${item.payment ? 'text-green-500' : 'text-yellow-500'}`}>
                  {item.payment ? 'Paid' : 'Pending'}
                </p>
              </div>
              {item.cancelled ? (
                <p className='text-red-500 text-xs font-bold'>Cancelled</p>
              ) : (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className='text-xs text-red-400 hover:text-red-600 border border-red-200 rounded-lg px-3 py-1 transition-colors'
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
          {appointments.length === 0 && (
            <p className='text-gray-400 text-center py-10'>No appointments found</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminAllAppointments;
