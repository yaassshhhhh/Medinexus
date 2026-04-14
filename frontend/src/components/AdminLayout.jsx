import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const AdminLayout = ({ children }) => {
  const { setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('aToken');
    setAToken('');
    navigate('/');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/appointments', label: 'Appointments' },
    { to: '/admin/add-doctor', label: 'Add Doctor' },
    { to: '/admin/doctors', label: 'Doctors List' },
  ];

  return (
    <div className='flex min-h-[80vh] bg-[#F8F9FD] rounded-2xl overflow-hidden border border-gray-100 shadow-sm'>
      {/* Sidebar */}
      <div className='w-48 bg-white border-r border-gray-100 flex flex-col'>
        <div className='p-4 border-b border-gray-50'>
          <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Admin Panel</p>
        </div>
        <nav className='flex-1 py-4'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F2F3FF] text-primary border-r-4 border-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className='p-4 border-t border-gray-50'>
          <button
            onClick={logout}
            className='w-full text-sm text-red-400 hover:text-red-600 font-medium py-2 transition-colors'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-auto'>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
