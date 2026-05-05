import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { TrendingUp, Users, Calendar, IndianRupee, Video, XCircle, CheckCircle } from 'lucide-react'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const StatCard = ({ label, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className={`bg-${color}-50 border border-${color}-100 rounded-2xl p-5 flex items-center gap-4`}
    >
        <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
            <Icon size={22} className={`text-${color}-600`} />
        </div>
        <div>
            <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
            <p className={`text-xs text-${color}-500 font-medium`}>{label}</p>
        </div>
    </motion.div>
)

const AdminAnalytics = () => {
    const { aToken, backendUrl } = useContext(AdminContext)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data: res } = await axios.get(backendUrl + '/api/admin/analytics', { headers: { aToken } })
                if (res.success) setData(res)
                else toast.error(res.message)
            } catch (e) {
                toast.error(e.message)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!data) return null

    const { stats, appointmentTrend, specialtyBreakdown } = data

    return (
        <div className="p-6 pb-16">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-500 mt-0.5">Platform overview and insights</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <StatCard label="Total Appointments" value={stats.totalAppointments} icon={Calendar} color="indigo" />
                <StatCard label="Total Doctors" value={stats.totalDoctors} icon={Users} color="violet" />
                <StatCard label="Total Revenue" value={`₹${stats.totalRevenue}`} icon={IndianRupee} color="green" />
                <StatCard label="Completed" value={stats.completedAppointments} icon={CheckCircle} color="emerald" />
                <StatCard label="Cancelled" value={stats.cancelledAppointments} icon={XCircle} color="red" />
                <StatCard label="Video Consults" value={stats.videoConsults} icon={Video} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment trend */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" /> Appointments (Last 30 Days)
                    </h2>
                    {appointmentTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={appointmentTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                                />
                                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Appointments" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
                    )}
                </div>

                {/* Specialty breakdown */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-primary" /> Appointments by Specialty
                    </h2>
                    {specialtyBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={specialtyBreakdown}
                                    cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {specialtyBreakdown.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                                />
                                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminAnalytics
