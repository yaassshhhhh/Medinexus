import React, { useContext, useEffect, useRef } from 'react';
import { AdminContext } from '../context/AdminContext';
import { X, CheckCircle, Clock, CreditCard, CalendarDays } from 'lucide-react';
import gsap from 'gsap';

const AdminAllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);

  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  // Mount animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headerRef.current, { opacity: 0, y: -20 });
      gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });

      gsap.set(tableRef.current, { opacity: 0, y: 30 });
      gsap.to(tableRef.current, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  // Rows animate when data loads
  useEffect(() => {
    const validRows = rowsRef.current.filter(Boolean);
    if (!validRows.length) return;
    gsap.set(validRows, { opacity: 0, x: -24 });
    gsap.to(validRows, {
      opacity: 1, x: 0,
      duration: 0.4, stagger: 0.05, delay: 0.1, ease: 'power3.out'
    });
  }, [appointments.length]);

  const getStatusBadge = (item) => {
    if (item.cancelled)
      return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"><X size={10} /> Cancelled</span>;
    if (item.isCompleted)
      return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle size={10} /> Completed</span>;
    if (item.payment)
      return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"><CreditCard size={10} /> Paid</span>;
    return <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock size={10} /> Pending</span>;
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div ref={headerRef} className="flex items-center justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">All Appointments</h1>
          <p className="text-sm mt-1" style={{ color: '#8ba3c7' }}>{appointments.length} total appointments</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {appointments.filter(a => !a.cancelled && !a.isCompleted).length} active
        </span>
      </div>

      {/* Table */}
      <div
        ref={tableRef}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Table header */}
        <div
          className="hidden sm:grid grid-cols-[0.4fr_2.5fr_2.5fr_2fr_1.5fr_1fr] py-3.5 px-6 text-xs font-bold uppercase tracking-wider"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', color: '#8ba3c7', background: 'rgba(255,255,255,0.02)' }}
        >
          <p>#</p>
          <p>Patient</p>
          <p>Doctor</p>
          <p>Date & Time</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        <div>
          {appointments.map((item, index) => (
            <div
              key={index}
              ref={el => (rowsRef.current[index] = el)}
              className="flex flex-wrap sm:grid grid-cols-[0.4fr_2.5fr_2.5fr_2fr_1.5fr_1fr] items-center py-4 px-4 sm:px-6 gap-3 transition-colors cursor-default"
              style={{ borderBottom: index < appointments.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                gsap.to(e.currentTarget, { x: 4, duration: 0.2, ease: 'power2.out' });
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                gsap.to(e.currentTarget, { x: 0, duration: 0.2, ease: 'power2.out' });
              }}
            >
              <p className="max-sm:hidden text-sm font-medium" style={{ color: '#8ba3c7' }}>{index + 1}</p>

              {/* Patient */}
              <div className="flex items-center gap-2.5">
                <img
                  src={item.userData?.image || ''}
                  className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  alt=""
                />
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{item.userData?.name || 'Unknown'}</p>
                  <p className="text-xs truncate" style={{ color: '#8ba3c7' }}>{item.userData?.email || ''}</p>
                </div>
              </div>

              {/* Doctor */}
              <div className="flex items-center gap-2.5">
                <img
                  src={item.docData?.image || ''}
                  className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  alt=""
                />
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{item.docData?.name || 'Unknown'}</p>
                  <p className="text-xs truncate" style={{ color: '#00d4ff' }}>{item.docData?.speciality || ''}</p>
                </div>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-white font-medium">{item.slotDate?.split('_').join('/')}</p>
                <p className="text-xs mt-0.5" style={{ color: '#8ba3c7' }}>{item.slotTime}</p>
              </div>

              {/* Status */}
              {getStatusBadge(item)}

              {/* Action */}
              {item.cancelled ? (
                <span className="text-xs font-medium" style={{ color: '#8ba3c7' }}>—</span>
              ) : item.isCompleted ? (
                <span className="text-xs font-medium" style={{ color: '#8ba3c7' }}>—</span>
              ) : (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-lg px-3 py-1.5 transition-all hover:bg-red-500/10 w-fit"
                  onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.06, duration: 0.15 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.15 })}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <CalendarDays size={28} style={{ color: '#8ba3c7' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#8ba3c7' }}>No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAllAppointments;
