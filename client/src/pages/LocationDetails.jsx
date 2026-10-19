import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { defaultLocations } from '../data/defaultLocations';
import {
  MapPin,
  Car,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Navigation,
  Star,
  Users,
  Briefcase
} from 'lucide-react';
import Button from '../components/common/Button';

export const LocationDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const loc = defaultLocations.find(
      (l) => l.slug === (slug || '').toLowerCase() || l.id === slug
    );
    setLocation(loc || null);
    if (loc) {
      document.title = `${loc.name} 24/7 Cab Service & Taxi Booking | Vista Tour & Travels`;
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (!location) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 min-h-[50vh] flex flex-col justify-center items-center">
        <MapPin className="w-12 h-12 text-slate-300 mb-3" />
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Location Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">
          We operate across Haryana, Delhi NCR & Chandigarh. Please select from our active service locations.
        </p>
        <Button onClick={() => navigate('/locations')}>Browse All Locations</Button>
      </div>
    );
  }

  const cleanPhone = '9068888578';
  const waText = encodeURIComponent(
    `Hello Vista Tour & Travels, I need cab service in ${location.name}. Please share cab rates and availability.`
  );
  const waUrl = `https://wa.me/91${cleanPhone}?text=${waText}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner with Glassmorphism */}
      <div className="relative h-[440px] lg:h-[500px] bg-navy-950 overflow-hidden flex items-end">
        <img
          src={location.heroImage}
          alt={location.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-900/30" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/locations" className="hover:text-white transition-colors">Locations</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-400">{location.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/50 text-brand-200 text-xs font-bold backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{location.district ? `${location.district}, ` : ''}{location.state}</span>
                </span>
                {location.slug === 'ladwa' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-navy-950 text-xs font-black shadow-md">
                    ★ Central Head Office (Nawarsi Bazar)
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-slate-200 text-xs font-medium backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> 24/7 Cab Dispatch
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
                24/7 Cab Service in {location.name}
              </h1>
              <p className="text-amber-300 text-sm sm:text-base font-semibold mt-2 drop-shadow-sm">
                {location.tagline}
              </p>
            </div>

            <div className="glass-dark border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-glass shrink-0">
              <div>
                <p className="text-[11px] text-slate-300 uppercase font-extrabold tracking-wider">Starting Fare</p>
                <p className="text-xl sm:text-2xl font-black text-amber-300">{location.startingFare}</p>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" /> Book Cab Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Location Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-glass border border-white/80">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">
              Taxi & Cab Rental Services in {location.name}
            </h2>
            <div className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4">
              {location.description}
            </div>

            {/* Features list */}
            {location.features && (
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
                {location.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pickup Points Covered */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-glass border border-white/80">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full mb-3 border border-brand-200/60">
              <Navigation className="w-3.5 h-3.5" /> Doorstep Coverage
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-navy-900 mb-2">
              Key Pickup Points Covered in {location.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Our drivers reach any of these pickup locations within 15 to 30 minutes of booking.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {location.pickupPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2.5 text-xs font-semibold text-slate-800"
                >
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Outstation Routes Table */}
          {location.popularRoutes && location.popularRoutes.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-glass border border-white/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-navy-900">
                    Popular Outstation Routes from {location.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Fixed transparent rates including tolls and driver allowances.
                  </p>
                </div>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Inquire Route
                </a>
              </div>

              <div className="space-y-3">
                {location.popularRoutes.map((route, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200/70 hover:border-brand-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        <h4 className="text-sm font-bold text-navy-900">To {route.to}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 pl-4">
                        Travel Time: {route.time} • Vehicle: {route.vehicle}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-4 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <span className="text-sm font-black text-brand-600">{route.fare}</span>
                      <a
                        href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello Vista Travels, I want to book cab from ${location.name} to ${route.to}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors"
                      >
                        Book →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Quick Booking Card */}
          <div className="glass-panel rounded-2xl p-6 shadow-glass border border-white/90 sticky top-24">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Central Dispatch Active</p>
            </div>
            <h3 className="text-xl font-black text-navy-900 mb-2">
              Book Cab in {location.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Instant pickup, sanitized air-conditioned vehicle, and verified highway driver dispatched directly to your location.
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md mb-3 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Dispatch ({cleanPhone})
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-sm mb-3 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Call +91 90688 88578
            </a>

            <Link
              to="/cars"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              Browse Vehicle Fleet (Innova, Ertiga, Dzire)
            </Link>

            <div className="mt-6 pt-6 border-t border-slate-200/80 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Advance Deposit for Local Pickups</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24/7 Delhi & Chandigarh Airport Transfers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Fastag Automated Highway Passage</span>
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
              <strong className="text-navy-900 block mb-0.5">Central Head Office:</strong>
              Nawarsi Bazar, Ladwa, Haryana 136132
            </div>
          </div>

          {/* Other Service Locations */}
          <div className="glass-panel rounded-2xl p-6 shadow-glass border border-white/80">
            <h3 className="text-base font-bold text-navy-900 mb-4">Other Service Locations</h3>
            <div className="space-y-3">
              {defaultLocations
                .filter((l) => l.slug !== location.slug)
                .map((loc) => (
                  <Link
                    key={loc.id}
                    to={`/locations/${loc.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/70 transition-colors group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                        {loc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{loc.state}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
