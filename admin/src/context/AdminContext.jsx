import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } });
      if (data.success) setAppointments(data.appointments.reverse());
      else toast.error(data.message);
    } catch (error) { 
      console.error('getAllAppointments error:', error);
      if (error.response) {
        toast.error(error.response.data?.message || 'Failed to fetch appointments');
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message);
      }
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } });
      if (data.success) { toast.success(data.message); getAllAppointments(); }
      else toast.error(data.message);
    } catch (error) { 
      console.error('cancelAppointment error:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } });
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (error) { 
      console.error('getAllDoctors error:', error);
      if (error.response) {
        toast.error(error.response.data?.message || 'Failed to fetch doctors');
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message);
      }
    }
  };

  const addDoctor = async (formData) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const deleteDoctor = async (doctorId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/delete-doctor', { doctorId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const toggleAvailability = async (doctorId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/toggle-availability', { doctorId }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    }
  };

  const value = {
    aToken, setAToken,
    backendUrl,
    appointments, setAppointments,
    getAllAppointments, cancelAppointment,
    doctors, getAllDoctors,
    addDoctor, deleteDoctor, toggleAvailability
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
