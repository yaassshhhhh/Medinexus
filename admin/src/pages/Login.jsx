import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [state, setState] = useState('Admin'); // 'Admin' or 'Doctor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setAToken, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(
          backendUrl + '/api/admin/login',
          { email, password }
        );

        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          navigate('/admin-dashboard');
          toast.success("Welcome, Admin!");
        } else {
          toast.error(data.message);
        }
      } else {
        // Placeholder for Doctor login logic if backend is ready
        toast.info("Doctor Login logic is ready for backend integration!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center bg-[#F8F9FD]'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-2xl text-[#5E5E5E] text-sm bg-white shadow-xl shadow-indigo-100/50'>
        <p className='text-2xl font-bold m-auto bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent'><span className='text-gray-800'>{state}</span> Login</p>

        <div className='w-full mt-4'>
          <p className='font-bold ml-1 mb-1'>Email</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-[#DADADA] rounded-xl w-full p-2.5 mt-1 outline-none focus:border-primary transition-colors'
          />
        </div>

        <div className='w-full'>
          <p className='font-bold ml-1 mb-1'>Password</p>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-[#DADADA] rounded-xl w-full p-2.5 mt-1 outline-none focus:border-primary transition-colors'
          />
        </div>

        <button className='bg-primary text-white w-full py-3 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:bg-indigo-600 transition-all active:scale-95 cursor-pointer mt-4'>
          Login
        </button>

        {
          state === 'Admin'
            ? <p className='m-auto mt-2'>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer font-bold'>Click here</span></p>
            : <p className='m-auto mt-2'>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer font-bold'>Click here</span></p>
        }
      </div>
    </form>
  );
};

export default Login;
