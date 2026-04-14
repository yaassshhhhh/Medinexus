import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, Clock, User, Video, MapPin } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, appointmentData, darkMode }) => {
  if (!appointmentData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
          >
            <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
              {/* Success Header */}
              <div className='bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className='w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3'
                >
                  <Check size={32} className='text-green-500' />
                </motion.div>
                <h2 className='text-2xl font-bold text-white'>Appointment Confirmed!</h2>
                <p className='text-green-100 text-sm mt-1'>Your booking has been successfully confirmed</p>
              </div>

              {/* Details */}
              <div className='p-6 space-y-4'>
                <div className='flex items-start gap-3'>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    darkMode ? 'bg-gray-700' : 'bg-indigo-50'
                  }`}>
                    <User size={20} className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>Doctor</p>
                    <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {appointmentData.docName}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {appointmentData.speciality}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    darkMode ? 'bg-gray-700' : 'bg-blue-50'
                  }`}>
                    <Calendar size={20} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>Date</p>
                    <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {appointmentData.slotDate?.replace(/_/g, '/')}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    darkMode ? 'bg-gray-700' : 'bg-purple-50'
                  }`}>
                    <Clock size={20} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>Time</p>
                    <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {appointmentData.slotTime}
                    </p>
                  </div>
                </div>

                {appointmentData.isVideoConsult && (
                  <div className='flex items-start gap-3'>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      darkMode ? 'bg-gray-700' : 'bg-green-50'
                    }`}>
                      <Video size={20} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${
                        darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>Consultation Type</p>
                      <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        Video Consultation
                      </p>
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className={`rounded-xl p-4 ${
                  darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-100'
                }`}>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    📧 A confirmation email has been sent to your registered email address.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className='p-6 pt-0 flex gap-3'>
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/my-appointment';
                  }}
                  className='flex-1 bg-gradient-to-r from-primary to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all'
                >
                  View Appointments
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
