import React, { useEffect, useState } from 'react';
import { testimonialApi } from '../../services/testimonialApi';
import { useWebsite } from '../../context/WebsiteContext';
import { processDeviceImage } from '../../utils/imageUpload';
import {
  Star,
  Quote,
  MessageSquareHeart,
  Plus,
  X,
  Upload,
  CheckCircle2,
  MapPin,
  Car,
  Camera,
  ThumbsUp,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { CardSkeleton } from '../common/Skeleton';
import toast from 'react-hot-toast';

export const Testimonials = () => {
  const { settings } = useWebsite();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleDeleteReview = async (id, name) => {
    const reviewer = name || 'this traveler';
    if (window.confirm(`Admin Action: Permanently delete the review by "${reviewer}"?`)) {
      try {
        const res = await testimonialApi.delete(id);
        if (res.success) {
          toast.success(`Review by "${reviewer}" deleted`);
          setTestimonials((prev) => prev.filter((t) => t._id !== id));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete review');
      }
    }
  };

  // New review form state
  const [formData, setFormData] = useState({
    customerName: '',
    destination: '',
    packageTitle: '',
    rating: 5,
    review: '',
    profileImage: ''
  });

  const [hoverRating, setHoverRating] = useState(0);

  const fetchReviews = async () => {
    try {
      const res = await testimonialApi.getAll({ status: 'approved' });
      if (res.success && res.data) {
        setTestimonials(res.data);
      }
    } catch (err) {
      console.error('Failed to load testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    const handleUpdate = () => fetchReviews();
    window.addEventListener('rtt_testimonials_updated', handleUpdate);
    return () => window.removeEventListener('rtt_testimonials_updated', handleUpdate);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const dataUri = await processDeviceImage(file, 400, 400, 0.85);
      setFormData((prev) => ({ ...prev, profileImage: dataUri }));
      toast.success('Your photo has been attached!');
    } catch (err) {
      toast.error(err.message || 'Failed to process photo');
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      return toast.error('Please provide your name');
    }
    if (!formData.destination.trim()) {
      return toast.error('Please specify the destination or route you traveled');
    }
    if (!formData.review.trim()) {
      return toast.error('Please share your journey experience');
    }

    try {
      setSubmitting(true);
      const res = await testimonialApi.create({
        ...formData,
        rating: Number(formData.rating),
        status: 'approved',
        createdAt: new Date().toISOString()
      });

      if (res.success) {
        toast.success('Thank you for sharing your experience! Your review is now live.');
        setFormData({
          customerName: '',
          destination: '',
          packageTitle: '',
          rating: 5,
          review: '',
          profileImage: ''
        });
        setIsModalOpen(false);
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === '5 Stars') return (t.rating || 5) === 5;
    if (activeFilter === 'Kurukshetra & Pilgrimage') {
      return /kurukshetra|brahma|jyotisar|pehowa|temple|tirth/i.test(t.destination || '');
    }
    if (activeFilter === 'Delhi NCR & Airport') {
      return /delhi|ncr|airport|igi|gurgaon|noida/i.test(t.destination || '');
    }
    if (activeFilter === 'Chandigarh & Ambala') {
      return /chandigarh|sukhna|ambala/i.test(t.destination || '');
    }
    if (activeFilter === 'Karnal & Panipat') {
      return /karnal|panipat|karna|kala amb/i.test(t.destination || '');
    }
    return true;
  });

  const getRatingLabel = (stars) => {
    switch (stars) {
      case 5:
        return '5.0 ★ Exceptional Experience!';
      case 4:
        return '4.0 ★ Very Good Trip';
      case 3:
        return '3.0 ★ Good';
      case 2:
        return '2.0 ★ Fair';
      case 1:
        return '1.0 ★ Needs Improvement';
      default:
        return 'Select your rating';
    }
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute -top-24 right-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-3">
              <MessageSquareHeart className="w-3.5 h-3.5" /> Traveler Reviews & Experiences
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              Real Stories from Real Travelers
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl font-medium">
              Verified experiences from families, business travelers, and pilgrim groups who traveled across Ladwa, Kurukshetra, Haryana, Delhi NCR, and Chandigarh with Vista Tour and Travels.
            </p>
          </div>

          {/* Action Buttons: Add Review & Google Badge */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Share Your Journey
            </button>

            <a
              href={settings.googleReviewsUrl || 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 text-slate-800 text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all"
            >
              <span className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </span>
              <span>5.0★ Google Verified</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Filter Pills - only shown when reviews exist */}
        {testimonials.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {[
              'All',
              '5 Stars',
              'Kurukshetra & Pilgrimage',
              'Delhi NCR & Airport',
              'Chandigarh & Ambala',
              'Karnal & Panipat'
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
              <MessageSquareHeart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">
              {testimonials.length === 0 ? 'Be the First to Review!' : 'No reviews match this filter'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {testimonials.length === 0
                ? 'Have you journeyed with Vista Tour and Travels? Share your genuine travel story, photos, and ratings to inspire fellow wanderers.'
                : 'Try selecting "All" or a different route filter to see more traveler stories.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Share Your Review
              </Button>
              {testimonials.length > 0 && activeFilter !== 'All' && (
                <button
                  onClick={() => setActiveFilter('All')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View All Reviews
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((t) => (
              <div
                key={t._id}
                className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 shadow-glass hover:shadow-glass-hover border border-white/80 flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Top Bar: Stars & Destination Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-50 text-brand-700 border border-slate-200/80">
                      <MapPin className="w-3 h-3 text-brand-500" />
                      {t.destination}
                    </span>
                  </div>

                  {/* Review Text */}
                  <div className="relative mb-6">
                    <Quote className="w-8 h-8 text-brand-100 absolute -top-3 -left-2 -z-0 opacity-60" />
                    <p className="text-slate-700 text-sm leading-relaxed relative z-10 font-normal">
                      "{t.review}"
                    </p>
                  </div>
                </div>

                {/* Traveler Details */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                      className="w-11 h-11 rounded-full object-cover border-2 border-brand-200 shadow-sm shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 leading-tight">
                        {t.customerName}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Traveler
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.packageTitle && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                        <Car className="w-3 h-3" /> {t.packageTitle}
                      </span>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteReview(t._id, t.customerName)}
                        title="Delete Review (Admin only)"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 px-2.5 py-1 rounded-xl transition-colors shadow-xs"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-brand-950 p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-navy-800">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <ThumbsUp className="w-4 h-4" /> Share Your Travel Story
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Traveled with Vista Tour and Travels Recently?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Tell other wanderers about your driver, highway driving safety, and journey highlights. Your review helps us continuously maintain 5.0★ service!
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            Write a Review Now
          </button>
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-brand-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-900">Share Your Journey Review</h3>
                  <p className="text-xs text-slate-500">Your review will be published for fellow travelers</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Star Rating Picker */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-center">
                <label className="text-xs font-bold text-amber-950 uppercase tracking-wider block mb-2">
                  How was your journey experience?
                </label>
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          (hoverRating || formData.rating) >= star
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-extrabold text-amber-900">
                  {getRatingLabel(hoverRating || formData.rating)}
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-medium"
                />
              </div>

              {/* Destination Visited */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination / Route Covered *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Kurukshetra Brahma Sarovar, Delhi IGI Airport Drop, Chandigarh Sightseeing..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-medium"
                />
              </div>

              {/* Package or Cab Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle / Tour Type (Optional)
                </label>
                <input
                  type="text"
                  name="packageTitle"
                  value={formData.packageTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Innova Crysta, Family Tour, Tempo Traveller"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-medium"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Journey Experience & Review *
                </label>
                <textarea
                  rows={4}
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us about the chauffeur, vehicle condition, punctuality, highway driving safety, and memorable journey highlights..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-sm font-medium"
                />
              </div>

              {/* Optional Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Attach Your Travel Photo / Avatar (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {formData.profileImage ? (
                    <div className="relative shrink-0">
                      <img
                        src={formData.profileImage}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-brand-500 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, profileImage: '' }))}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px]"
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                  )}

                  <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingPhoto ? 'Processing...' : formData.profileImage ? 'Change Photo' : 'Upload From Device'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" loading={submitting}>
                  Submit Journey Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
