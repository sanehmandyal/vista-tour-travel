import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../services/bookingApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import {
  CalendarCheck,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Filter,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedBooking, setSelectedBooking] = useState(null);

  const statuses = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await bookingApi.getAll(params);
      if (res.success && res.data) {
        setBookings(res.data);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const handleUpdate = () => fetchBookings();
    window.addEventListener('rtt_bookings_updated', handleUpdate);
    return () => window.removeEventListener('rtt_bookings_updated', handleUpdate);
  }, [statusFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await bookingApi.updateStatus(id, { bookingStatus: newStatus });
      if (res.success) {
        toast.success(`Booking marked as ${newStatus}`);
        fetchBookings();
        if (selectedBooking && selectedBooking._id === id) {
          setSelectedBooking(res.data);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking record?')) {
      try {
        const res = await bookingApi.delete(id);
        if (res.success) {
          toast.success('Booking deleted');
          fetchBookings();
          if (selectedBooking?._id === id) setSelectedBooking(null);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete booking');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight">Booking Management</h1>
        <p className="text-xs text-slate-500">Track reservations, manage passenger manifests, and update payment records.</p>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID, guest, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings match criteria"
          description="Check another status filter or reset search."
          actionLabel="View All Bookings"
          onAction={() => { setStatusFilter('All'); setSearch(''); }}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Travel Date</th>
                  <th className="py-3 px-4">Travelers</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {b.bookingNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-navy-900 text-sm">{b.customerName}</p>
                      <p className="text-[11px] text-slate-400">{b.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700 max-w-[150px] truncate">
                      {b.package?.title || 'Custom Tour'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {formatDate(b.travelDate)}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {b.adults} Ad{b.children > 0 ? `, ${b.children} Ch` : ''}
                    </td>
                    <td className="py-3 px-4 font-black text-navy-900">
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        b.bookingStatus === 'Completed' ? 'bg-brand-100 text-brand-700' :
                        b.bookingStatus === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {b.bookingStatus === 'Pending' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'Confirmed')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="Confirm Booking"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {b.bookingStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking: ${selectedBooking.bookingNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Status switcher bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase">Current Status</p>
                <span className="text-sm font-black text-navy-900">{selectedBooking.bookingStatus}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'Confirmed')}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'Completed')}
                >
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'Cancelled')}
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Customer & Trip Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-xs">Customer Name</p>
                <p className="font-bold text-navy-900 text-sm">{selectedBooking.customerName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Phone Number</p>
                <p className="font-bold text-navy-900 text-sm">{selectedBooking.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Email Address</p>
                <p className="font-bold text-navy-900 text-sm">{selectedBooking.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Pickup Location</p>
                <p className="font-bold text-navy-900 text-sm">{selectedBooking.pickupLocation}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Travel Date</p>
                <p className="font-bold text-navy-900 text-sm">{formatDate(selectedBooking.travelDate)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Travelers</p>
                <p className="font-bold text-navy-900 text-sm">
                  {selectedBooking.adults} Adults, {selectedBooking.children} Children
                </p>
              </div>
            </div>

            {selectedBooking.address && (
              <div>
                <p className="text-slate-400 text-xs">Residential Address</p>
                <p className="font-medium text-slate-700">{selectedBooking.address}</p>
              </div>
            )}

            {selectedBooking.specialRequirements && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <p className="text-xs font-bold text-amber-900 mb-1">Customer Special Requests:</p>
                <p className="text-xs text-amber-800">{selectedBooking.specialRequirements}</p>
              </div>
            )}

            {/* Financial Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Package Fare:</span>
                <span className="font-semibold text-navy-900">{formatCurrency(selectedBooking.packagePrice)} per adult</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Taxes (GST 5%):</span>
                <span className="font-semibold text-navy-900">{formatCurrency(selectedBooking.taxes)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base">
                <span className="font-bold text-navy-900">Total Booking Amount:</span>
                <span className="font-black text-brand-700">{formatCurrency(selectedBooking.totalAmount)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Bookings;
