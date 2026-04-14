import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Award, Clock } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const StatsSection = () => {
  const { darkMode } = useContext(AppContext);

  const stats = [
    { icon: Users, label: 'Verified Doctors', value: '150+', color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, label: 'Appointments Booked', value: '10K+', color: 'from-violet-500 to-purple-500' },
    { icon: Award, label: 'Patient Satisfaction', value: '98%', color: 'from-green-500 to-emerald-500' },
    { icon: Clock, label: 'Avg. Wait Time', value: '<15min', color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className='my-16'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl p-6 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-lg'
            }`}
          >
            {/* Gradient background */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`} />
            
            <div className='relative z-10'>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                <stat.icon size={24} className='text-white' />
              </div>
              <p className={`text-3xl font-bold mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
