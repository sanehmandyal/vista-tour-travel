import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../services/bookingApi';
import { authApi } from '../services/authApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import {
  User,
  CalendarCheck,
  KeyRound,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export const Account = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile' | 'password'

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const res = await bookingApi.getMyBookings();
        if (res.success && res.data) {
          setBookings(res.data);
        }
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await authApi.updateProfile(profileData);
      if (res.success) {
        updateUser(res.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await authApi.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (res.success) {
        toast.success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Confirmed') return <Badge variant="success">Confirmed</Badge>;
    if (status === 'Completed') return <Badge variant="primary">Completed</Badge>;
    if (status === 'Cancelled') return <Badge variant="danger">Cancelled</Badge>;
    return <Badge variant="warning">Pending</Badge>;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Banner */}
      <div className="bg-navy-950 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-400"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{user?.name}</h1>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout} className="text-white border-white/20 hover:bg-white/10">
            <LogOut className="w-4 h-4 mr-1.5" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Tabs Nav */}
        <div>
          <div className="bg-white rounded-2xl p-2 shadow-soft border border-slate-100 space-y-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-brand-50 text-brand-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CalendarCheck className="w-4 h-4" /> My Bookings ({bookings.length})
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'profile'
                  ? 'bg-brand-50 text-brand-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" /> Personal Profile
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'password'
                  ? 'bg-brand-50 text-brand-700 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <KeyRound className="w-4 h-4" /> Change Password
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          {/* TAB 1: My Bookings */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100">
              <h2 className="text-xl font-bold text-navy-900 mb-6">Booking History & Status</h2>

              {loadingBookings ? (
                <Loader text="Loading your bookings..." />
              ) : bookings.length === 0 ? (
                <EmptyState
                  icon={CalendarCheck}
                  title="No bookings placed yet"
                  description="Explore our hand-crafted destinations and book your dream vacation."
                  actionLabel="Browse Tour Packages"
                  onAction={() => window.location.href = '/packages'}
                />
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div
                      key={b._id}
                      className="p-5 rounded-2xl border border-slate-200/80 hover:border-brand-200 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        {b.package?.featuredImage && (
                          <img
                            src={b.package.featuredImage}
                            alt={b.package?.title}
                            className="w-20 h-20 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                              {b.bookingNumber}
                            </span>
                            {getStatusBadge(b.bookingStatus)}
                          </div>
                          <h4 className="text-base font-bold text-navy-900 line-clamp-1">
                            {b.package?.title || 'Tour Package'}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Travel Date: <strong>{formatDate(b.travelDate)}</strong> • {b.adults} Adults{b.children > 0 ? `, ${b.children} Children` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <span className="text-lg font-black text-navy-900">
                          {formatCurrency(b.totalAmount)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBooking(b)}
                          className="text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Personal Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 max-w-xl">
              <h2 className="text-xl font-bold text-navy-900 mb-6">Edit Profile</h2>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                    className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-100 text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Email address cannot be changed.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={savingProfile}
                  className="px-6 py-2.5 font-bold text-sm"
                >
                  Save Profile Changes
                </Button>
              </form>
            </div>
          )}

          {/* TAB 3: Change Password */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 max-w-xl">
              <h2 className="text-xl font-bold text-navy-900 mb-6">Change Account Password</h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full text-sm rounded-xl border border-slate-200 pl-3.5 pr-11 py-2.5 focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors"
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">New Password (min 6 chars) *</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full text-sm rounded-xl border border-slate-200 pl-3.5 pr-11 py-2.5 focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Confirm New Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full text-sm rounded-xl border border-slate-200 pl-3.5 pr-11 py-2.5 focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={savingPassword}
                  className="px-6 py-2.5 font-bold text-sm"
                >
                  Update Password
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Details: ${selectedBooking.bookingNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-slate-400 text-xs">Status</p>
                <div className="mt-1">{getStatusBadge(selectedBooking.bookingStatus)}</div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Payment Status</p>
                <span className="font-bold text-navy-900">{selectedBooking.paymentStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-xs">Tour Package</p>
                <p className="font-bold text-navy-900">{selectedBooking.package?.title}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Travel Date</p>
                <p className="font-bold text-navy-900">{formatDate(selectedBooking.travelDate)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Travelers</p>
                <p className="font-bold text-navy-900">{selectedBooking.adults} Adults, {selectedBooking.children} Children</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Pickup Location</p>
                <p className="font-bold text-navy-900">{selectedBooking.pickupLocation}</p>
              </div>
            </div>

            {selectedBooking.specialRequirements && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-600 mb-1">Special Requirements:</p>
                <p className="text-slate-700">{selectedBooking.specialRequirements}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="font-bold text-navy-900">Total Booking Fare:</span>
              <span className="text-2xl font-black text-brand-700">{formatCurrency(selectedBooking.totalAmount)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Account;
