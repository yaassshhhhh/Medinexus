import React, { useContext, useEffect, useRef, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Check, Users, Trash2 } from 'lucide-react';
import gsap from 'gsap';

const AdminDoctorsList = () => {
  const { aToken, doctors, getAllDoctors, toggleAvailability, deleteDoctor } = useContext(AdminContext);
  const [copied, setCopied] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (aToken) getAllDoctors();
  }, [aToken]);

  // Header animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: -20 });
      gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  // Cards stagger when doctors load
  useEffect(() => {
    const valid = cardsRef.current.filter(Boolean);
    if (!valid.length) return;
    gsap.set(valid, { opacity: 0, y: 40, scale: 0.92, rotateY: -10 });
    gsap.to(valid, {
      opacity: 1, y: 0, scale: 1, rotateY: 0,
      duration: 0.55, stagger: 0.07, ease: 'back.out(1.3)'
    });
  }, [doctors.length]);

  const copyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleToggle = async (doctorId) => {
    setLoadingId(doctorId);
    await toggleAvailability(doctorId);
    setLoadingId(null);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setLoadingId(confirmDelete._id);
    await deleteDoctor(confirmDelete._id);
    setLoadingId(null);
    setConfirmDelete(null);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div ref={headerRef} className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">All Doctors</h1>
          <p className="text-sm mt-1" style={{ color: '#8ba3c7' }}>{doctors.length} registered doctors</p>
        </div>
      </div>

      {/* Doctor grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" style={{ perspective: '800px' }}>
        {doctors.map((item, index) => (
          <div
            key={index}
            ref={el => (cardsRef.current[index] = el)}
            className="rounded-2xl overflow-hidden group"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              transformStyle: 'preserve-3d',
            }}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, {
                y: -8, scale: 1.02,
                borderColor: 'rgba(0,212,255,0.35)',
                boxShadow: '0 16px 40px rgba(0,212,255,0.12)',
                duration: 0.25, ease: 'power2.out'
              });
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, {
                y: 0, scale: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                boxShadow: 'none',
                duration: 0.25, ease: 'power2.out'
              });
            }}
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

              {/* Availability Toggle */}
              <button
                onClick={() => handleToggle(item._id)}
                disabled={loadingId === item._id}
                className="mt-3 w-full flex items-center justify-between rounded-xl px-3 py-2 transition-all duration-200 disabled:opacity-50"
                style={{
                  background: item.available ? 'rgba(74,222,128,0.1)' : 'rgba(107,114,128,0.1)',
                  border: `1px solid ${item.available ? 'rgba(74,222,128,0.3)' : 'rgba(107,114,128,0.3)'}`,
                }}
              >
                <div className="flex items-center gap-2">
                  {loadingId === item._id ? (
                    <span
                      className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
                      style={{ borderColor: item.available ? '#4ade80' : '#6b7280', borderTopColor: 'transparent' }}
                    />
                  ) : (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: item.available ? '#4ade80' : '#6b7280',
                        boxShadow: item.available ? '0 0 6px #4ade80' : 'none',
                      }}
                    />
                  )}
                  <span className="text-xs font-semibold" style={{ color: item.available ? '#4ade80' : '#8ba3c7' }}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                {/* Toggle switch visual */}
                <div
                  className="relative w-9 h-5 rounded-full transition-all duration-300 flex-shrink-0"
                  style={{ background: item.available ? '#4ade80' : '#374151' }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                    style={{ left: item.available ? '18px' : '2px' }}
                  />
                </div>
              </button>

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

              {/* Delete button */}
              <button
                onClick={() => setConfirmDelete(item)}
                disabled={loadingId === item._id}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-200 disabled:opacity-50"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444',
                }}
                onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.15 })}
                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.15 })}
              >
                <Trash2 size={14} />
                <span className="text-xs font-semibold">Delete Doctor</span>
              </button>
            </div>
          </div>
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-sm mx-4 rounded-2xl p-6 shadow-2xl"
              style={{ background: '#0d1b2e', border: '1px solid rgba(239,68,68,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(239,68,68,0.15)' }}
              >
                <Trash2 size={26} style={{ color: '#ef4444' }} />
              </div>

              <h3 className="text-lg font-bold text-white text-center">Delete Doctor?</h3>
              <p className="text-sm text-center mt-2" style={{ color: '#8ba3c7' }}>
                Are you sure you want to delete{' '}
                <span className="text-white font-semibold">{confirmDelete.name}</span>?
                <br />This action cannot be undone.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#8ba3c7',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loadingId === confirmDelete._id}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{
                    background: 'rgba(239,68,68,0.2)',
                    border: '1px solid rgba(239,68,68,0.5)',
                    color: '#ef4444',
                  }}
                >
                  {loadingId === confirmDelete._id ? (
                    <span className="w-4 h-4 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDoctorsList;
