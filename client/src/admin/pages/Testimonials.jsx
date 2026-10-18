import React, { useEffect, useState } from 'react';
import { testimonialApi } from '../../services/testimonialApi';
import {
  Star,
  Trash2,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Car,
  AlertTriangle,
  Quote
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await testimonialApi.getAll({ status: '' });
      if (res.success && res.data) {
        setTestimonials(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    const handleUpdate = () => {
      fetchReviews();
    };
    window.addEventListener('rtt_testimonials_updated', handleUpdate);
    return () => window.removeEventListener('rtt_testimonials_updated', handleUpdate);
  }, []);

  const handleDelete = async (id, reviewerName) => {
    const displayName = reviewerName || 'this traveler';
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the review by "${displayName}"?\n\nThis action cannot be undone and will remove the review from both the website and database.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const res = await testimonialApi.delete(id);
      if (res.success) {
        toast.success(`Review by "${displayName}" has been deleted`);
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter reviews by search and rating
  const filteredReviews = testimonials.filter((t) => {
    const matchesSearch =
      (t.customerName && t.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (t.destination && t.destination.toLowerCase().includes(search.toLowerCase())) ||
      (t.packageTitle && t.packageTitle.toLowerCase().includes(search.toLowerCase())) ||
      (t.review && t.review.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (ratingFilter === '5') return t.rating === 5;
    if (ratingFilter === '4') return t.rating === 4;
    if (ratingFilter === '3below') return t.rating && t.rating <= 3;

    return true;
  });

  const totalCount = testimonials.length;
  const fiveStarCount = testimonials.filter((t) => t.rating === 5).length;
  const averageRating =
    totalCount > 0
      ? (testimonials.reduce((sum, t) => sum + (Number(t.rating) || 5), 0) / totalCount).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Traveler Reviews Management</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              Delete-Only Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Moderate authentic traveler reviews and journey stories. You can delete spam or inappropriate reviews. (Review editing is strictly disabled to preserve authentic customer feedback).
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Live Reviews</p>
            <p className="text-2xl font-black text-navy-900 mt-0.5">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Rating</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-2xl font-black text-navy-900">{averageRating}</p>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">5-Star Ratings</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{fiveStarCount} Reviews</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by reviewer name, destination, route, or text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'All', label: 'All' },
            { id: '5', label: '5 Stars' },
            { id: '4', label: '4 Stars' },
            { id: '3below', label: '3 Stars & Below' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setRatingFilter(btn.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                ratingFilter === btn.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Review Cards Grid */}
      {loading ? (
        <Loader text="Loading traveler reviews..." />
      ) : filteredReviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No reviews match your filter"
          description="Reviews submitted by travelers will appear here. Admins can permanently delete unwanted or spam reviews."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 hover:border-slate-200 hover:shadow-card transition-all flex flex-col justify-between group relative"
            >
              <div>
                {/* Header: Rating & Destination */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-1.5">{t.rating || 5}.0</span>
                  </div>

                  {t.destination && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-50 text-brand-700 border border-slate-200">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      {t.destination}
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <div className="relative mb-4">
                  <Quote className="w-7 h-7 text-brand-100 absolute -top-2 -left-1 opacity-70 -z-0" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal relative z-10">
                    "{t.review}"
                  </p>
                </div>
              </div>

              {/* Footer: Reviewer Details & Admin Action */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        t.profileImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={t.customerName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                      }}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-navy-900 truncate">
                        {t.customerName || 'Anonymous Traveler'}
                      </h4>
                      <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified Guest Review
                      </p>
                    </div>
                  </div>

                  {t.packageTitle && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md shrink-0 border border-slate-200/60">
                      <Car className="w-3 h-3 text-slate-400" /> {t.packageTitle}
                    </span>
                  )}
                </div>

                {/* Admin Delete Action Button */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {t._id?.slice(-8)}
                  </span>

                  <button
                    onClick={() => handleDelete(t._id, t.customerName)}
                    disabled={deletingId === t._id}
                    title="Permanently Delete Review"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingId === t._id ? 'Deleting...' : 'Delete Review'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;
