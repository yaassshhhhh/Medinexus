import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { motion } from 'framer-motion';
import { Users, CalendarDays, UserCheck, X, CheckCircle, Clock } from 'lucide-react';

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
    {
      label: 'Total Doctors',
      count: doctors.length,
      icon: UserCheck,
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.1)',
      border: 'rgba(99,102,241,0.25)',
    },
    {
      label: 'Appointments',
      count: appointments.length,
      icon: CalendarDays,
      color: '#00d4ff',
      bg: 'rgba(0,212,255,0.1)',
      border: 'rgba(0,212,255,0.25)',
    },
    {
      label: 'Patients',
      count: uniquePatients,
      icon: Users,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.25)',
    },
  ];

  const getStatusBadge = (item) => {
    if (item.cancelled)
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          <X size={10} /> Cancelled
        </span>
      );
    if (item.isCompleted)
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          <CheckCircle size={10} /> Completed
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Clock size={10} /> Pending
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6"
    >
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#8ba3c7' }}>Overview of your platform activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, count, icon: Icon, color, bg, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(255,255,255,0.08)`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = `0 8px 24px ${bg}` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{count}</p>
              <p className="text-sm font-medium" style={{ color: '#8ba3c7' }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="font-bold text-white">Latest Appointments</p>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {appointments.slice(0, 5).length} shown
          </span>
        </div>

        <div>
          {appointments.slice(0, 5).map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center px-4 sm:px-6 py-4 gap-3 sm:gap-4 transition-colors"
              style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <img
                className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                src={item.docData?.image || ''}
                alt={item.docData?.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{item.docData?.name || 'Unknown Doctor'}</p>
                <p className="text-xs mt-0.5" style={{ color: '#8ba3c7' }}>
                  {item.slotDate?.split('_').join('/')} at {item.slotTime}
                </p>
              </div>
              <div className="flex flex-1 items-center gap-3 flex-wrap justify-between sm:justify-end flex-shrink-0">
                {getStatusBadge(item)}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-lg px-3 py-1.5 transition-all hover:bg-red-500/10"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <CalendarDays size={28} style={{ color: '#8ba3c7' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#8ba3c7' }}>No appointments yet</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
