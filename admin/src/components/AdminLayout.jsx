import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import {
  LayoutDashboard, CalendarDays, UserPlus, Users, LogOut, Menu, X, ShieldCheck, BarChart2
} from 'lucide-react';
import gsap from 'gsap';

const AdminLayout = ({ children }) => {
  const { setAToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refs
  const sidebarRef = useRef(null);
  const brandRef = useRef(null);
  const navItemsRef = useRef([]);
  const logoutRef = useRef(null);
  const mainRef = useRef(null);
  const mobileSidebarRef = useRef(null);

  const logout = () => {
    // Animate sidebar out before logout
    gsap.to(sidebarRef.current, {
      x: -220, opacity: 0, duration: 0.4, ease: 'power3.in',
      onComplete: () => {
        localStorage.removeItem('aToken');
        setAToken('');
        navigate('/');
      }
    });
  };

  const navItems = [
    { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/appointments', label: 'Appointments', icon: CalendarDays },
    { to: '/add-doctor',   label: 'Add Doctor',   icon: UserPlus },
    { to: '/doctors',      label: 'Doctors List', icon: Users },
    { to: '/analytics',    label: 'Analytics',    icon: BarChart2 },
  ];

  // Sidebar entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sidebar slides in from left
      gsap.set(sidebarRef.current, { x: -220, opacity: 0 });
      gsap.to(sidebarRef.current, {
        x: 0, opacity: 1, duration: 0.7, ease: 'expo.out', delay: 0.1
      });

      // Brand pops in
      gsap.set(brandRef.current, { opacity: 0, scale: 0.8, y: -10 });
      gsap.to(brandRef.current, {
        opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'back.out(1.7)'
      });

      // Nav items stagger in
      gsap.set(navItemsRef.current, { opacity: 0, x: -20 });
      gsap.to(navItemsRef.current, {
        opacity: 1, x: 0,
        duration: 0.45, delay: 0.65, stagger: 0.08, ease: 'power3.out'
      });

      // Logout button fades in
      gsap.set(logoutRef.current, { opacity: 0, y: 10 });
      gsap.to(logoutRef.current, {
        opacity: 1, y: 0, duration: 0.5, delay: 1.1, ease: 'power2.out'
      });

      // Main content slides in from right
      gsap.set(mainRef.current, { opacity: 0, x: 30 });
      gsap.to(mainRef.current, {
        opacity: 1, x: 0, duration: 0.7, delay: 0.3, ease: 'expo.out'
      });
    });

    return () => ctx.revert();
  }, []);

  // Page transition on route change
  useEffect(() => {
    if (!mainRef.current) return;
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
    );
  }, [location.pathname]);

  // Mobile sidebar open animation
  const openMobileSidebar = () => {
    setSidebarOpen(true);
    requestAnimationFrame(() => {
      if (mobileSidebarRef.current) {
        gsap.fromTo(
          mobileSidebarRef.current,
          { x: -240, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: 'expo.out' }
        );
      }
    });
  };

  const closeMobileSidebar = () => {
    if (mobileSidebarRef.current) {
      gsap.to(mobileSidebarRef.current, {
        x: -240, opacity: 0, duration: 0.3, ease: 'power3.in',
        onComplete: () => setSidebarOpen(false)
      });
    } else {
      setSidebarOpen(false);
    }
  };

  const handleNavHover = (el, enter) => {
    gsap.to(el, {
      x: enter ? 4 : 0,
      duration: 0.2, ease: 'power2.out'
    });
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        ref={isMobile ? null : brandRef}
        className="px-5 py-5 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.2))',
            border: '1px solid rgba(245,158,11,0.4)',
            boxShadow: '0 0 20px rgba(245,158,11,0.2)',
          }}
        >
          <ShieldCheck size={18} style={{ color: '#f59e0b' }} />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Admin Panel</p>
          <p className="text-xs mt-0.5" style={{ color: '#8ba3c7' }}>MediCare+</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }, i) => (
          <NavLink
            key={to}
            to={to}
            ref={isMobile ? null : el => (navItemsRef.current[i] = el)}
            onClick={isMobile ? closeMobileSidebar : undefined}
            onMouseEnter={e => handleNavHover(e.currentTarget, true)}
            onMouseLeave={e => handleNavHover(e.currentTarget, false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-white'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    boxShadow: '0 0 12px rgba(245,158,11,0.1)',
                  }
                : { background: 'transparent', border: '1px solid transparent' }
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div
        ref={isMobile ? null : logoutRef}
        className="p-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
          onMouseEnter={e => gsap.to(e.currentTarget, { x: 3, duration: 0.2 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.2 })}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#060c18' }}>
      {/* Desktop sidebar */}
      <div
        ref={sidebarRef}
        className="hidden md:flex flex-col w-52 flex-shrink-0"
        style={{ background: '#0d1525', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeMobileSidebar}
          />
          <div
            ref={mobileSidebarRef}
            className="absolute left-0 top-0 bottom-0 w-56 flex flex-col"
            style={{ background: '#0d1525', borderRight: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button
              onClick={closeMobileSidebar}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={openMobileSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-bold text-white">Admin Panel</span>
        </div>

        <div ref={mainRef} className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
