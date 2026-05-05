import React, { useContext, useEffect, useRef } from 'react';
import { AdminContext } from '../context/AdminContext';
import { Users, CalendarDays, UserCheck, X, CheckCircle, Clock } from 'lucide-react';
import gsap from 'gsap';

// Animated counter component
const AnimatedCount = ({ value }) => {
  const ref = useRef(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isNumber = typeof value === 'number';
    if (!isNumber) {
      el.textContent = value;
      return;
    }
    const from = prevValue.current;
    const to = value;
    prevValue.current = to;
    const obj = { val: from };
    gsap.to(obj, {
      val: to,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(obj.val); }
    });
  }, [value]);

  return <span ref={ref}>0</span>;
};

const AdminDashboard = () => {
  const { aToken, appointments, doctors, getAllAppointments, getAllDoctors, cancelAppointment } = useContext(AdminContext);

  // Refs
  const headerRef = useRef(null);
  const statsRef = useRef([]);
  const tableRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
      getAllDoctors();
    }
  }, [aToken]);

  // Animate on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.set(headerRef.current, { opacity: 0, y: -20 });
      gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });

      // Stat cards stagger with 3D flip
      gsap.set(statsRef.current, { opacity: 0, y: 40, rotateY: -15, scale: 0.9 });
      gsap.to(statsRef.current, {
        opacity: 1, y: 0, rotateY: 0, scale: 1,
        duration: 0.65, stagger: 0.1, delay: 0.2, ease: 'back.out(1.4)'
      });

      // Table
      gsap.set(tableRef.current, { opacity: 0, y: 30 });
      gsap.to(tableRef.current, {
        opacity: 1, y: 0, duration: 0.6, delay: 0.55, ease: 'power3.out'
      });
    });

    return () => ctx.revert();
  }, []);

  // Animate rows when appointments load
  useEffect(() => {
    if (rowsRef.current.length === 0) return;
    gsap.set(rowsRef.current, { opacity: 0, x: -20 });
    gsap.to(rowsRef.current, {
      opacity: 1, x: 0,
      duration: 0.4, stagger: 0.06, delay: 0.1, ease: 'power3.out'
    });
  }, [appointments.length]);

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

  const handleCardHover = (el, enter, border, bg) => {
    gsap.to(el, {
      y: enter ? -6 : 0,
      scale: enter ? 1.02 : 1,
      borderColor: enter ? border : 'rgba(255,255,255,0.08)',
      boxShadow: enter ? `0 16px 40px ${bg}` : 'none',
      duration: 0.25, ease: 'power2.out'
    });
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Page header */}
      <div ref={headerRef} className="mb-7">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#8ba3c7' }}>Overview of your platform activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" style={{ perspective: '800px' }}>
        {stats.map(({ label, count, icon: Icon, color, bg, border }, i) => (
          <div
            key={label}
            ref={el => (statsRef.current[i] = el)}
            className="rounded-2xl p-5 flex items-center gap-4 cursor-default"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              transformStyle: 'preserve-3d',
            }}
            onMouseEnter={e => handleCardHover(e.currentTarget, true, border, bg)}
            onMouseLeave={e => handleCardHover(e.currentTarget, false, border, bg)}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                <AnimatedCount value={count} />
              </p>
              <p className="text-sm font-medium" style={{ color: '#8ba3c7' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div
        ref={tableRef}
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
              ref={el => (rowsRef.current[i] = el)}
              className="flex flex-col sm:flex-row items-start sm:items-center px-4 sm:px-6 py-4 gap-3 sm:gap-4 transition-colors cursor-default"
              style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                gsap.to(e.currentTarget, { x: 4, duration: 0.2, ease: 'power2.out' });
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                gsap.to(e.currentTarget, { x: 0, duration: 0.2, ease: 'power2.out' });
              }}
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
                    onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.15 })}
                    onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.15 })}
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
    </div>
  );
};

export default AdminDashboard;
