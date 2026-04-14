import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAToken, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
      if (data.success) {
        localStorage.setItem('aToken', data.token);
        setAToken(data.token);
        navigate('/admin/dashboard');
        toast.success('Welcome, Admin!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-2xl text-[#5E5E5E] text-sm bg-white shadow-xl shadow-indigo-100/50'>
        <p className='text-2xl font-bold m-auto'>Admin Login</p>
        <div className='w-full mt-4'>
          <p className='font-bold ml-1 mb-1'>Email</p>
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-[#DADADA] rounded-xl w-full p-2.5 mt-1 outline-none focus:border-primary transition-colors'
          />
        </div>
        <div className='w-full'>
          <p className='font-bold ml-1 mb-1'>Password</p>
          <input
            type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-[#DADADA] rounded-xl w-full p-2.5 mt-1 outline-none focus:border-primary transition-colors'
          />
        </div>
        <button className='bg-primary text-white w-full py-3 rounded-xl text-base font-bold hover:bg-indigo-600 transition-all mt-4'>
          Login
        </button>
      </div>
    </form>
  );
};

export default AdminLogin;
