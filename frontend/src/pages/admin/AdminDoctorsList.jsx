import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { motion } from 'framer-motion';
import { Copy, Check, Users } from 'lucide-react';

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
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">All Doctors</h1>
          <p className="text-sm mt-1" style={{ color: '#8ba3c7' }}>{doctors.length} registered doctors</p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}
        >
          🔑 Default password: <span className="font-mono font-bold ml-1">12345678</span>
        </div>
      </div>

      {/* Info banner */}
      <div
        className="rounded-xl px-5 py-3.5 mb-6 text-sm flex items-start gap-3"
        style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', color: '#8ba3c7' }}
      >
        <span className="text-cyan-400 mt-0.5 flex-shrink-0">ℹ</span>
        <p>
          Doctors log in at <span className="font-mono font-bold text-cyan-400">/doctor-portal</span> using their email and the default password{' '}
          <span className="font-mono font-bold text-cyan-400">12345678</span>
        </p>
      </div>

      {/* Doctor grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {doctors.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,212,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            {/* Image */}
            <div className="overflow-hidden aspect-[4/3]" style={{ background: 'rgba(0,212,255,0.05)' }}>
              <img
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                src={item.image}
                alt={item.name}
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-white font-bold text-base group-hover:text-cyan-400 transition-colors">{item.name}</p>
              <p className="text-sm font-medium mt-0.5" style={{ color: '#00d4ff' }}>{item.speciality}</p>
              <p className="text-xs mt-0.5" style={{ color: '#8ba3c7' }}>{item.degree} · {item.experience}</p>

              {/* Availability */}
              <div className="flex items-center gap-2 mt-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: item.available ? '#4ade80' : '#6b7280',
                    boxShadow: item.available ? '0 0 6px #4ade80' : 'none',
                  }}
                />
                <p className="text-xs font-medium" style={{ color: item.available ? '#4ade80' : '#8ba3c7' }}>
                  {item.available ? 'Available' : 'Not Available'}
                </p>
              </div>

              {/* Email copy */}
              <div
                className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-xs truncate flex-1 font-mono" style={{ color: '#8ba3c7' }}>{item.email}</span>
                <button
                  onClick={() => copyEmail(item.email, item._id)}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: copied === item._id ? '#4ade80' : '#00d4ff' }}
                  title="Copy email"
                >
                  {copied === item._id ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>

              {/* Password badge */}
              <div
                className="mt-2 flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <span className="text-xs">🔑</span>
                <span className="text-xs font-mono font-bold" style={{ color: '#fbbf24' }}>12345678</span>
              </div>
            </div>
          </motion.div>
        ))}

        {doctors.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Users size={32} style={{ color: '#8ba3c7' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#8ba3c7' }}>No doctors found. Add doctors using the "Add Doctor" section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDoctorsList;
