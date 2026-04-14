import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { aToken, appointments, doctors, getAllAppointments, getAllDoctors, cancelAppointment } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
      getAllDoctors();
    }
  }, [aToken]);

  const uniquePatients = new Set(appointments.map(a => a.userId)).size;

  const stats = [
    { label: 'Doctors', count: doctors.length, bg: 'bg-[#F2F3FF]' },
    { label: 'Appointments', count: appointments.length, bg: 'bg-[#E3FFFA]' },
    { label: 'Patients', count: uniquePatients, bg: 'bg-[#FFF5F5]' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='m-5'>
      <div className='flex flex-wrap gap-5'>
        {stats.map((item, i) => (
          <div key={i} className={`flex items-center gap-4 ${item.bg} p-6 min-w-52 rounded-xl hover:scale-105 transition-all shadow-sm border border-black/5`}>
            <div>
              <p className='text-3xl font-bold text-gray-800'>{item.count}</p>
              <p className='text-gray-500 font-medium'>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white mt-10 rounded-xl border border-gray-100 shadow-sm'>
        <div className='flex items-center gap-3 px-6 py-4 border-b border-gray-50'>
          <p className='font-bold text-lg text-gray-800'>Latest Appointments</p>
        </div>
        <div className='pt-2'>
          {appointments.slice(0, 5).map((item, i) => (
            <div key={i} className='flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-colors'>
              <img
                className='w-12 h-12 rounded-full border border-gray-100 object-cover'
                src={item.docData?.image || ''}
                alt={item.docData?.name}
              />
              <div className='flex-1'>
                <p className='text-gray-800 font-bold'>{item.docData?.name || 'Unknown Doctor'}</p>
                <p className='text-gray-500 text-sm'>Booking on {item.slotDate?.split('_').join('/')}</p>
              </div>
              {item.cancelled ? (
                <span className='text-red-500 text-xs font-bold'>Cancelled</span>
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
            <p className='text-gray-400 text-center py-8'>No appointments yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
