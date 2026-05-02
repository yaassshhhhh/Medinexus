import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import {
  LayoutDashboard, CalendarDays, UserPlus, Users, LogOut, Menu, X, ShieldCheck
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { setAToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('aToken');
    setAToken('');
    navigate('/');
  };

  const navItems = [
    { to: '/admin/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
    { to: '/admin/add-doctor',   label: 'Add Doctor',   icon: UserPlus },
    { to: '/admin/doctors',      label: 'Doctors List', icon: Users },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div
        className="px-5 py-5 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.2))',
            border: '1px solid rgba(245,158,11,0.4)',
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
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive
              ? { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }
              : { background: 'transparent', border: '1px solid transparent' }
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex min-h-[80vh] rounded-2xl overflow-hidden"
      style={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Desktop sidebar */}
      <div
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
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-56 flex flex-col"
            style={{ background: '#0d1525', borderRight: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <SidebarContent />
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
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-bold text-white">Admin Panel</span>
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
