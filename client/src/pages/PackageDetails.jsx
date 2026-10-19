import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { packageApi } from '../services/packageApi';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Clock,
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  Hotel,
  Car,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Share2,
  Calendar,
  ChevronRight,
  Check,
  Phone,
  MessageCircle
} from 'lucide-react';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import toast from 'react-hot-toast';

export const PackageDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [openDay, setOpenDay] = useState(1);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      try {
        const res = await packageApi.getBySlug(slug);
        if (res.success && res.data) {
          setPkg(res.data);
          setActiveImage(res.data.featuredImage || res.data.images?.[0] || '');
        }
      } catch (err) {
        console.error('Failed to load package:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading package details..." />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Package Not Found</h2>
        <p className="text-slate-500 mb-6">The requested tour package does not exist.</p>
        <Button onClick={() => navigate('/packages')}>Back to Packages</Button>
      </div>
    );
  }

  const hasDiscount = pkg.discountedPrice > 0 && pkg.discountedPrice < pkg.price;
  const currentPrice = hasDiscount ? pkg.discountedPrice : pkg.price;
  const allImages = [pkg.featuredImage, ...(pkg.images || [])].filter(Boolean);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pkg.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Package link copied to clipboard!');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top breadcrumbs & Title Header */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/packages" className="hover:text-brand-600">Tour Packages</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-navy-900 font-bold truncate max-w-xs">{pkg.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge variant="primary">{pkg.category}</Badge>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>{pkg.destinationName || pkg.destination?.name || 'India'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{pkg.rating}</span>
                  <span className="text-slate-400 font-normal">({pkg.reviewsCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight">
                {pkg.title}
              </h1>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors self-start md:self-auto"
            >
              <Share2 className="w-4 h-4" /> Share Package
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Gallery, Itinerary, Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Photo Gallery */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-soft border border-slate-100 space-y-4">
            {/* Active Big Image */}
            <div className="h-72 sm:h-96 w-full rounded-xl overflow-hidden bg-slate-100">
              <img
                src={activeImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'}
                alt={pkg.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail selector - Hidden scrollbar */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-24 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-brand-600 scale-95 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=200&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Overview */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80">
            <h2 className="text-xl font-bold text-navy-900 mb-3">Package Overview</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {pkg.description}
            </p>
          </div>

          {/* Day-by-Day Itinerary Accordion */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-navy-900">Detailed Day-by-Day Itinerary</h2>
                <span className="text-xs font-semibold text-brand-600">{pkg.daysCount} Days Planned</span>
              </div>

              <div className="space-y-4">
                {pkg.itinerary.map((item) => {
                  const isOpen = openDay === item.day;
                  return (
                    <div
                      key={item.day}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenDay(isOpen ? null : item.day)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            D{item.day}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-navy-900">
                            {item.title}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-5 bg-white space-y-3 text-sm text-slate-600 border-t border-slate-200">
                          <p className="leading-relaxed whitespace-pre-line">{item.description}</p>
                          <div className="pt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-500 border-t border-slate-100">
                            {item.meals && <span>🍽️ <strong>Meals:</strong> {item.meals}</span>}
                            {item.hotel && <span>🏨 <strong>Stay:</strong> {item.hotel}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inclusions */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> What's Included
              </h3>
              <ul className="space-y-3">
                {pkg.inclusions?.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" /> What's Excluded
              </h3>
              <ul className="space-y-3">
                {pkg.exclusions?.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Hotel & Transport Details */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6">
            <h3 className="text-lg font-bold text-navy-900">Hotel & Transportation Logistics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Accommodations</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {pkg.hotels || 'Hand-picked 3 & 4-Star verified hotels with scenic views and daily breakfast.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Private Transportation</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {pkg.transport || 'Dedicated sanitized AC vehicle with polite, experienced commercial chauffeur.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
            <h3 className="text-lg font-bold text-navy-900 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> Cancellation Policy & Important Info
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {pkg.cancellationPolicy || 'Free cancellation up to 7 days before departure. 50% refund between 7 to 3 days. Non-refundable within 72 hours.'}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200">
              {pkg.importantInformation || 'Please carry valid government-issued photo ID (Aadhaar/Passport). All highway tolls, parking, and driver allowances included in quotes.'}
            </p>
          </div>
        </div>

        {/* Right 1 Col: Booking Sidebar Box */}
        <div>
          <div className="glass-panel rounded-3xl p-6 shadow-glass border border-white/80 lg:sticky lg:top-24 space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Vista Tour and Travels</span>
              <h3 className="text-2xl font-black text-navy-900 mt-1">
                Customized Fare on Request
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Transparent rates tailored to your travel dates, vehicle preference, and guest count.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold text-navy-900">{pkg.duration}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Destination:</span>
                <span className="font-bold text-navy-900">{pkg.destinationName || 'Haryana & NCR'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-navy-900">{pkg.category}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Service:</span>
                <span className="font-bold text-brand-700">Chauffeur Driven Cab Included</span>
              </div>
            </div>

            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate(`/booking/${pkg._id}`)}
              className="w-full py-3.5 font-bold shadow-lg"
            >
              Book / Inquire This Tour <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <a
              href={`https://wa.me/919068888578?text=${encodeURIComponent(`Hi Vista Tour and Travels, I am interested in inquiring about "${pkg.title}" (${pkg.duration}). Please share customized quote and vehicle availability.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" /> Instant Quote on WhatsApp
            </a>

            <a
              href="tel:9068888578"
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-brand-300 text-navy-900 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-brand-600" /> Direct Call: +91 90688 88578
            </a>

            <p className="text-[11px] text-slate-400 text-center">
              ⭐ 5.0 Rated Operator in Ladwa, Kurukshetra, Haryana, Delhi NCR & Chandigarh • No Hidden Charges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
