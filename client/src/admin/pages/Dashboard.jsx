import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import {
  CalendarCheck,
  TrendingUp,
  Car,
  MapPin,
  MessageSquare,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  RefreshCw,
  Star
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { testimonialApi } from '../../services/testimonialApi';
import { bookingApi, isFakeBooking } from '../../services/bookingApi';
import { inquiryApi, isFakeInquiry } from '../../services/inquiryApi';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewsCount, setReviewsCount] = useState(0);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const [res, revRes, bookingsRes, inquiriesRes] = await Promise.all([
        adminApi.getDashboard().catch(() => null),
        testimonialApi.getAll({ status: '' }).catch(() => null),
        bookingApi.getAll({ limit: 10 }).catch(() => null),
        inquiryApi.getAll({ limit: 10 }).catch(() => null)
      ]);

      let backendData = (res && res.success && res.data) ? res.data : {};

      // Filter out any fake bookings/inquiries that might be in backend response
      const remoteBookings = (backendData.recentBookings || []).filter(b => !isFakeBooking(b));
      const localBookings = (bookingsRes && bookingsRes.data ? bookingsRes.data : []).filter(b => !isFakeBooking(b));
      const genuineBookings = remoteBookings.length > 0
        ? remoteBookings
        : localBookings.slice(0, 5);

      const remoteInquiries = (backendData.recentInquiries || []).filter(i => !isFakeInquiry(i));
      const localInquiries = (inquiriesRes && inquiriesRes.data ? inquiriesRes.data : []).filter(i => !isFakeInquiry(i));
      const genuineInquiries = remoteInquiries.length > 0
        ? remoteInquiries
        : localInquiries.slice(0, 5);

      const totalBookings = backendData.metrics?.totalBookings ?? localBookings.length;
      const pendingBookings = backendData.metrics?.pendingBookings ?? localBookings.filter(b => b.bookingStatus === 'Pending').length;
      const confirmedBookings = backendData.metrics?.confirmedBookings ?? localBookings.filter(b => b.bookingStatus === 'Confirmed').length;
      const completedBookings = backendData.metrics?.completedBookings ?? localBookings.filter(b => b.bookingStatus === 'Completed').length;
      const totalRevenue = backendData.metrics?.totalRevenue ?? localBookings.reduce((acc, b) => acc + (Number(b.totalAmount) || 0), 0);
      const totalInquiries = backendData.metrics?.totalInquiries ?? localInquiries.length;
      const newInquiries = backendData.metrics?.newInquiries ?? localInquiries.filter(i => i.status === 'New').length;

      setData({
        ...backendData,
        metrics: {
          ...backendData.metrics,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          totalRevenue,
          totalInquiries,
          newInquiries
        },
        recentBookings: genuineBookings,
        recentInquiries: genuineInquiries,
        statusDistribution: [
          { name: 'Confirmed', value: confirmedBookings },
          { name: 'Completed', value: completedBookings },
          { name: 'Pending Review', value: pendingBookings },
          { name: 'Cancelled', value: backendData.metrics?.cancelledBookings || 0 }
        ]
      });

      if (revRes && revRes.success && Array.isArray(revRes.data)) {
        setReviewsCount(revRes.data.length);
      }
    } catch (err) {
      console.warn('Dashboard sync error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const handleUpdate = () => fetchDashboard();
    window.addEventListener('rtt_bookings_updated', handleUpdate);
    window.addEventListener('rtt_inquiries_updated', handleUpdate);
    return () => {
      window.removeEventListener('rtt_bookings_updated', handleUpdate);
      window.removeEventListener('rtt_inquiries_updated', handleUpdate);
    };
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Syncing executive analytics..." />
      </div>
    );
  }

  // Live genuine metrics
  const rawMetrics = data?.metrics || {};
  const metrics = {
    totalBookings: rawMetrics.totalBookings || 0,
    pendingBookings: rawMetrics.pendingBookings || 0,
    confirmedBookings: rawMetrics.confirmedBookings || 0,
    completedBookings: rawMetrics.completedBookings || 0,
    totalRevenue: rawMetrics.totalRevenue || 0,
    activeFleet: 12,
    totalDestinations: rawMetrics.totalDestinations || 10,
    totalInquiries: rawMetrics.totalInquiries || 0,
    newInquiries: rawMetrics.newInquiries || 0,
  };

  // Monthly trends with actual data or zero baseline
  const hasLiveTrends = data?.monthlyTrends && data.monthlyTrends.length > 0 && data.monthlyTrends.some(t => (t.revenue > 0 || t.bookings > 0));
  const defaultMonths = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const monthlyTrends = hasLiveTrends
    ? data.monthlyTrends
    : defaultMonths.map(name => ({ name, bookings: 0, revenue: 0 }));

  // Status breakdown donut
  const statusColors = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];
  const hasLiveDistribution = data?.statusDistribution && data.statusDistribution.some(s => s.value > 0);
  const statusDistribution = hasLiveDistribution
    ? data.statusDistribution
    : [
        { name: 'Confirmed', value: metrics.confirmedBookings },
        { name: 'Completed', value: metrics.completedBookings },
        { name: 'Pending Review', value: metrics.pendingBookings },
        { name: 'Cancelled', value: 0 },
      ];

  // Genuine bookings list
  const recentBookings = (data?.recentBookings && data.recentBookings.length > 0)
    ? data.recentBookings.filter(b => !isFakeBooking(b))
    : [];

  // Genuine inquiries list
  const recentInquiries = (data?.recentInquiries && data.recentInquiries.length > 0)
    ? data.recentInquiries.filter(i => !isFakeInquiry(i))
    : [];

  return (
    <div className="space-y-8">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Portal Active
            </span>
            <span className="text-xs text-slate-400 font-medium">| Vista Tour and Travels HQ</span>
          </div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Live fleet operations, traveler inquiries, and destination performance.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleManualRefresh}
            title="Refresh metrics"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/admin/destinations/new')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Add Destination
          </button>
          <button
            onClick={() => navigate('/admin/fleet')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Car className="w-4 h-4" /> Manage Fleet (12)
          </button>
          <button
            onClick={() => navigate('/admin/reviews')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs transition-all"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> Traveler Reviews
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Bookings */}
        <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex flex-col justify-between hover:border-brand-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md">Live</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bookings</p>
            <h3 className="text-2xl font-black text-navy-900">{metrics.totalBookings}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {metrics.pendingBookings} awaiting dispatch
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex flex-col justify-between hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">INR</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Turnover</p>
            <h3 className="text-xl font-black text-navy-900 truncate">{formatCurrency(metrics.totalRevenue)}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Confirmed trips</p>
          </div>
        </div>

        {/* Fleet Cabs */}
        <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex flex-col justify-between hover:border-sky-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md">Ready</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Fleet</p>
            <h3 className="text-2xl font-black text-navy-900">{metrics.activeFleet} Cabs</h3>
            <p className="text-[10px] text-slate-500 mt-1">Sedan, SUV & Tempo</p>
          </div>
        </div>

        {/* Destinations */}
        <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex flex-col justify-between hover:border-amber-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">Active</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Destinations</p>
            <h3 className="text-2xl font-black text-navy-900">{metrics.totalDestinations}</h3>
            <p className="text-[10px] text-slate-500 mt-1">Himachal circuits</p>
          </div>
        </div>

        {/* Traveler Reviews */}
        <div
          onClick={() => navigate('/admin/reviews')}
          className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex flex-col justify-between hover:border-amber-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">5.0 ★</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Traveler Reviews</p>
            <h3 className="text-2xl font-black text-navy-900">{reviewsCount}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-1">Live Original Reviews</p>
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 flex flex-col justify-between hover:border-rose-200 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md">Leads</span>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct Inquiries</p>
            <h3 className="text-2xl font-black text-navy-900">{metrics.totalInquiries}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-1">{metrics.newInquiries} new leads</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue & Booking Trends Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-navy-900">Revenue & Booking Trends</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  Season 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Monthly booking demand and revenue generated across Himachal circuits</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600" /> Revenue (₹)
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Bookings
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : val}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : `${value} trips`,
                    name === 'revenue' ? 'Revenue Intake' : 'Total Trips'
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut PieChart */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-navy-900">Booking Status</h3>
              <span className="text-[10px] font-bold text-slate-400">Total: {metrics.totalBookings}</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Operational status of customer orders</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {hasLiveDistribution ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={statusColors[index % statusColors.length]}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <CalendarCheck className="w-9 h-9 mx-auto text-slate-300 mb-2 stroke-1" />
                <p className="text-xs font-semibold text-slate-500">No Booking Records Yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Status breakdown will populate with customer bookings.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {statusDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: statusColors[i % statusColors.length] }}
                  />
                  <span className="text-slate-600 text-[11px] truncate">{item.name}</span>
                </div>
                <span className="font-bold text-navy-900 text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Tables: Recent Bookings & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-navy-900">Recent Customer Bookings</h3>
                <p className="text-xs text-slate-400">Scheduled vehicle dispatches and airport transfers</p>
              </div>
              <Link
                to="/admin/bookings"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Tour / Destination</th>
                    <th className="py-2.5 px-3">Cab Model</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-brand-700">
                          {b.bookingNumber || `RTT-${b._id.slice(-4).toUpperCase()}`}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-navy-900">{b.customerName || b.user?.name || 'Traveler'}</p>
                          <p className="text-[10px] text-slate-400">{b.phone || b.user?.phone || 'Direct Call'}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium truncate max-w-[160px]">
                          {b.serviceName || b.service || b.package?.title || b.destination?.name || 'Custom Tour'}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {b.vehicle || b.vehicleType || b.carType || 'Sedan / SUV'}
                        </td>
                        <td className="py-3 px-3 font-bold text-navy-900">
                          {formatCurrency(b.totalAmount || 0)}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            b.bookingStatus === 'Completed' ? 'bg-brand-100 text-brand-800' :
                            b.bookingStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {b.bookingStatus || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <CalendarCheck className="w-8 h-8 text-slate-300 stroke-1" />
                          <p className="text-xs font-semibold text-slate-600">No Bookings Received Yet</p>
                          <p className="text-[11px] text-slate-400">Customer bookings submitted through the portal will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Inquiries (1 Col) */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-navy-900">Incoming Inquiries</h3>
                <p className="text-xs text-slate-400">Prospective traveler queries</p>
              </div>
              <Link
                to="/admin/inquiries"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentInquiries.length > 0 ? (
                recentInquiries.map((inq) => (
                  <div key={inq._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-navy-900 truncate">{inq.name}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        inq.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        inq.status === 'Contacted' ? 'bg-sky-100 text-sky-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {inq.status || 'New Lead'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">{inq.message || inq.subject}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400">
                      <span className="font-mono text-slate-600 font-semibold">{inq.phone || 'Phone verified'}</span>
                      <span>{inq.createdAt ? formatDate(inq.createdAt) : 'Today'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto stroke-1 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-600">No Inquiries Yet</p>
                  <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">Customer queries submitted from the website will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Need to call back?</span>
            <a
              href="tel:+919068888578"
              className="inline-flex items-center gap-1 text-brand-600 font-bold hover:text-brand-700"
            >
              <PhoneCall className="w-3 h-3" /> Dial Dispatch HQ (+91 90688 88578)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
