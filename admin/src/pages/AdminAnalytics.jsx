import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, CartesianGrid, LineChart, Line, Area, AreaChart
} from 'recharts'
import {
    TrendingUp, Users, Calendar, IndianRupee,
    Video, XCircle, CheckCircle, Activity, ArrowUpRight
} from 'lucide-react'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

/* ─── Custom Tooltip ─── */
const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
                <p className="font-semibold text-gray-700 mb-1">{label}</p>
                <p className="text-indigo-600 font-bold">{payload[0].value} appointments</p>
            </div>
        )
    }
    return null
}

const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
                <p className="font-semibold text-gray-700">{payload[0].name}</p>
                <p className="font-bold" style={{ color: payload[0].payload.fill }}>{payload[0].value} appointments</p>
            </div>
        )
    }
    return null
}

/* ─── Stat Card ─── */
const StatCard = ({ label, value, icon: Icon, gradient, textColor, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, ease: 'easeOut' }}
        className={`relative overflow-hidden rounded-2xl p-5 ${gradient} shadow-sm`}
    >
        <div className="flex items-start justify-between">
            <div>
                <p className={`text-3xl font-extrabold ${textColor}`}>{value}</p>
                <p className={`text-sm font-medium mt-1 ${textColor} opacity-75`}>{label}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl bg-white/30 flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={`${textColor}`} />
            </div>
        </div>
        {/* decorative circle */}
        <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
    </motion.div>
)

/* ─── Section Header ─── */
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Icon size={18} className="text-indigo-600" />
        </div>
        <div>
            <h2 className="font-bold text-gray-800 text-base leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
    </div>
)

/* ─── Skeleton Loader ─── */
const Skeleton = ({ className }) => (
    <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />
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

    /* ── Loading skeleton ── */
    if (loading) return (
        <div className="p-6 pb-16 space-y-6">
            <div className="space-y-1">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-56" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-72" />
                <Skeleton className="h-72" />
            </div>
        </div>
    )

    if (!data) return null

    const { stats, appointmentTrend, specialtyBreakdown } = data

    /* completion rate */
    const completionRate = stats.totalAppointments > 0
        ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100)
        : 0

    const cancellationRate = stats.totalAppointments > 0
        ? Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100)
        : 0

    const statCards = [
        {
            label: 'Total Appointments',
            value: stats.totalAppointments,
            icon: Calendar,
            gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
            textColor: 'text-white',
        },
        {
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
            icon: IndianRupee,
            gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            textColor: 'text-white',
        },
        {
            label: 'Total Doctors',
            value: stats.totalDoctors,
            icon: Users,
            gradient: 'bg-gradient-to-br from-violet-500 to-violet-600',
            textColor: 'text-white',
        },
        {
            label: 'Completed',
            value: stats.completedAppointments,
            icon: CheckCircle,
            gradient: 'bg-gradient-to-br from-teal-400 to-teal-500',
            textColor: 'text-white',
        },
        {
            label: 'Cancelled',
            value: stats.cancelledAppointments,
            icon: XCircle,
            gradient: 'bg-gradient-to-br from-rose-400 to-rose-500',
            textColor: 'text-white',
        },
        {
            label: 'Video Consults',
            value: stats.videoConsults,
            icon: Video,
            gradient: 'bg-gradient-to-br from-sky-400 to-sky-500',
            textColor: 'text-white',
        },
    ]

    return (
        <div className="p-6 pb-16 bg-gray-50 min-h-screen">

            {/* ── Page Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-7"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                        <Activity size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Analytics</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Platform overview & insights</p>
                    </div>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <StatCard key={i} {...card} delay={i * 0.07} />
                ))}
            </div>

            {/* ── Rate Pills ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-3 mb-8"
            >
                <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-gray-700">Completion Rate</span>
                    <span className="text-sm font-bold text-emerald-600">{completionRate}%</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-sm font-semibold text-gray-700">Cancellation Rate</span>
                    <span className="text-sm font-bold text-rose-600">{cancellationRate}%</span>
                </div>
                {stats.videoConsults > 0 && (
                    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 shadow-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        <span className="text-sm font-semibold text-gray-700">Video Consult Rate</span>
                        <span className="text-sm font-bold text-sky-600">
                            {Math.round((stats.videoConsults / stats.totalAppointments) * 100)}%
                        </span>
                    </div>
                )}
            </motion.div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Appointment Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                >
                    <SectionHeader
                        icon={TrendingUp}
                        title="Appointment Trend"
                        subtitle="Last 30 days"
                    />
                    {appointmentTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={230}>
                            <AreaChart data={appointmentTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    fill="url(#areaGrad)"
                                    dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
                                    name="Appointments"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState message="No appointment data in the last 30 days" />
                    )}
                </motion.div>

                {/* Specialty Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                >
                    <SectionHeader
                        icon={Users}
                        title="Appointments by Specialty"
                        subtitle="All time distribution"
                    />
                    {specialtyBreakdown.length > 0 ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={specialtyBreakdown}
                                        cx="50%" cy="50%"
                                        innerRadius={58}
                                        outerRadius={88}
                                        paddingAngle={3}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {specialtyBreakdown.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Custom legend */}
                            <div className="flex flex-col gap-2 min-w-[140px]">
                                {specialtyBreakdown.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                        />
                                        <span className="text-xs text-gray-600 truncate max-w-[110px]">{item.name}</span>
                                        <span className="text-xs font-bold text-gray-800 ml-auto">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyState message="No specialty data available" />
                    )}
                </motion.div>
            </div>

            {/* ── Bar Chart (appointments per day) ── */}
            {appointmentTrend.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6"
                >
                    <SectionHeader
                        icon={Activity}
                        title="Daily Appointment Volume"
                        subtitle="Bar view — last 30 days"
                    />
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={appointmentTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomBarTooltip />} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Appointments">
                                {appointmentTrend.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={i === appointmentTrend.length - 1 ? '#6366f1' : '#c7d2fe'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}

            {/* ── Summary Row ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
                <SummaryTile
                    label="Avg Revenue / Appointment"
                    value={stats.completedAppointments > 0
                        ? `₹${Math.round(stats.totalRevenue / stats.completedAppointments).toLocaleString('en-IN')}`
                        : '—'}
                    sub="Based on completed & paid"
                    color="indigo"
                />
                <SummaryTile
                    label="Pending Appointments"
                    value={stats.totalAppointments - stats.completedAppointments - stats.cancelledAppointments}
                    sub="Yet to be completed"
                    color="amber"
                />
                <SummaryTile
                    label="Doctors on Platform"
                    value={stats.totalDoctors}
                    sub="Registered specialists"
                    color="violet"
                />
            </motion.div>
        </div>
    )
}

/* ─── Helper: Empty State ─── */
const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-48 gap-2">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <Activity size={20} className="text-gray-300" />
        </div>
        <p className="text-sm text-gray-400">{message}</p>
    </div>
)

/* ─── Helper: Summary Tile ─── */
const SummaryTile = ({ label, value, sub, color }) => {
    const colorMap = {
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700 text-indigo-400',
        amber: 'bg-amber-50 border-amber-100 text-amber-700 text-amber-400',
        violet: 'bg-violet-50 border-violet-100 text-violet-700 text-violet-400',
    }
    const [bg, border, text, subText] = colorMap[color].split(' ')
    return (
        <div className={`${bg} border ${border} rounded-2xl p-5`}>
            <p className={`text-2xl font-extrabold ${text}`}>{value}</p>
            <p className={`text-sm font-semibold ${text} mt-1`}>{label}</p>
            <p className={`text-xs ${subText} mt-0.5`}>{sub}</p>
        </div>
    )
}

export default AdminAnalytics
