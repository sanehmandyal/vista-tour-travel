import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationApi, getExactDestinationImages } from '../services/destinationApi';
import { formatCurrency } from '../utils/formatCurrency';
import {
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  ChevronRight,
  Car,
  Phone,
  MessageCircle,
  ShieldCheck,
  Navigation,
  Info,
  Users
} from 'lucide-react';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

export const DestinationDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await destinationApi.getBySlug(slug);
        if (res.success && res.data) {
          setDestination(res.data);
          // Set dynamic SEO page title
          document.title = `${res.data.name} Tour Packages & 24/7 Cab Booking | Vista Tour & Travels`;
        }
      } catch (err) {
        console.error('Failed to fetch destination details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading destination details..." />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Destination Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">
          The requested regional destination does not exist or has been moved.
        </p>
        <Button onClick={() => navigate('/destinations')}>Browse All Destinations</Button>
      </div>
    );
  }

  const exact = getExactDestinationImages(destination.name, destination.slug);
  const isInvalid = (url) =>
    !url ||
    typeof url !== 'string' ||
    url.trim() === '' ||
    url.includes('unsplash.com') ||
    url.includes('photo-15') ||
    url.includes('photo-16') ||
    url.includes('photo-14') ||
    url.includes('Dharamshala_stadium');

  const heroImg = !isInvalid(destination.heroImage)
    ? destination.heroImage
    : (!isInvalid(destination.featuredImage) ? destination.featuredImage : exact.heroImage);

  const cleanPhone = '9068888578';
  const waMessage = encodeURIComponent(
    `Hello Vista Tour & Travels, I want to inquire about Cab Booking and Tour Packages for ${destination.name}.`
  );
  const waUrl = `https://wa.me/91${cleanPhone}?text=${waMessage}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner with Glassmorphism Overlay */}
      <div className="relative h-auto min-h-[440px] sm:min-h-[480px] lg:h-[540px] bg-navy-950 overflow-hidden flex items-end pt-12">
        <img
          src={heroImg}
          alt={destination.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = exact.heroImage;
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-900/30" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />

        {/* Ambient Warm Glow */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full text-white">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-4 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/destinations" className="hover:text-white transition-colors">Destinations</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-300 font-bold">{destination.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/50 text-brand-200 text-xs font-bold backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{destination.state || 'Haryana'}, {destination.country || 'India'}</span>
                </span>
                {destination.distanceFromLadwa && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-slate-200 text-xs font-medium backdrop-blur-md">
                    <Navigation className="w-3.5 h-3.5 text-amber-300" />
                    <span>{destination.distanceFromLadwa} from Ladwa</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> 5.0★ Google Verified Cab
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
                {destination.name}
              </h1>
              <p className="text-amber-300 text-sm sm:text-base font-semibold mt-2 max-w-2xl drop-shadow-sm">
                {destination.tagline || destination.shortDescription}
              </p>
            </div>

            {/* Quick Action Glass CTA in Hero */}
            <div className="glass-dark border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-wrap sm:flex-nowrap items-center gap-4 shadow-glass shrink-0">
              <div>
                <p className="text-[11px] text-slate-300 uppercase font-extrabold tracking-wider">Starting Cab Fare</p>
                <p className="text-xl sm:text-2xl font-black text-amber-300">{destination.cabFare || 'Starting ₹1,499'}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" /> Book Cab
                </a>
                <Button
                  variant="accent"
                  onClick={() => navigate(`/contact?destination=${encodeURIComponent(destination.name)}`)}
                  className="py-2.5 px-4 text-xs font-bold"
                >
                  Inquire Tour
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel rounded-2xl p-4 border border-white/80 shadow-glass flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">From Ladwa</span>
              <p className="text-base font-black text-navy-900 mt-1">{destination.distanceFromLadwa || 'Direct Route'}</p>
              <span className="text-[11px] text-brand-600 font-semibold mt-1">24/7 Doorstep Pickup</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/80 shadow-glass flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Best Time</span>
              <p className="text-base font-black text-navy-900 mt-1">{destination.bestTimeToVisit || 'Oct - March'}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1">Pleasant Weather</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/80 shadow-glass flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ideal Duration</span>
              <p className="text-base font-black text-navy-900 mt-1">{destination.idealDuration || '1 - 2 Days'}</p>
              <span className="text-[11px] text-amber-600 font-semibold mt-1">Same-Day / Weekend</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-white/80 shadow-glass flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Chauffeur Service</span>
              <p className="text-base font-black text-navy-900 mt-1">Verified Drivers</p>
              <span className="text-[11px] text-brand-600 font-semibold mt-1">Sanitized AC Cabs</span>
            </div>
          </div>

          {/* Overview Section */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-glass border border-white/80">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full mb-3 border border-brand-200/60">
              <Compass className="w-3.5 h-3.5" /> Destination Overview
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-4">
              Explore {destination.name} with Vista Tour and Travels
            </h2>
            <div className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4">
              {destination.description}
            </div>

            {destination.routeInfo && (
              <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
                <Navigation className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Driving Route & Access</p>
                  <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                    {destination.routeInfo}. Punctual pickups available from Ladwa (Nawarsi Bazar), Kurukshetra, Ambala, and Karnal.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Cab Fare & Rates Table */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-glass border border-white/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-200/80">
                  <Car className="w-3.5 h-3.5 text-emerald-600" /> Commercial Taxi Rates
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-navy-900">
                  {destination.name} Cab Fare & Vehicle Options
                </h3>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shrink-0 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" /> Instant WhatsApp Booking
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(destination.cabRates && destination.cabRates.length > 0
                ? destination.cabRates
                : [
                    { vehicle: 'Maruti Dzire (AC Sedan)', price: destination.cabFare || 'Starting ₹1,499', capacity: '4 Passengers + Boot', idealFor: 'Couples & Small Families' },
                    { vehicle: 'Maruti Ertiga (AC MUV)', price: 'Starting ₹2,199', capacity: '6 Passengers + Boot', idealFor: 'Family Group Travel' },
                    { vehicle: 'Innova Crysta (Luxury SUV)', price: 'Starting ₹3,199', capacity: '7 Passengers + Boot', idealFor: 'VIP Chauffeur & Executives' },
                    { vehicle: 'Tempo Traveller (12/17 Seater)', price: 'Starting ₹4,999', capacity: '12-17 Passengers', idealFor: 'Pilgrims & Large Groups' }
                  ]
              ).map((cab, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-brand-400 hover:bg-brand-50/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-navy-900">{cab.vehicle}</h4>
                      <span className="text-sm font-black text-brand-600">{cab.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {cab.capacity}
                    </p>
                    <p className="text-[11px] text-slate-600">{cab.idealFor}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> All Tolls & Chauffeur
                    </span>
                    <a
                      href={`https://wa.me/919068888578?text=${encodeURIComponent(`Hello Vista Travels, I want to book ${cab.vehicle} for ${destination.name}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-brand-600 hover:text-brand-800 transition-colors"
                    >
                      Book Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Attractions */}
          {destination.attractions && destination.attractions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-navy-900">
                    Must-Visit Attractions in {destination.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Top iconic places included in our customized private tour itineraries.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {destination.attractions.map((attr, idx) => {
                  const title = typeof attr === 'string' ? attr : attr.title;
                  const desc = typeof attr === 'string' ? 'Top rated regional sightseeing spot.' : attr.description;
                  const fallbackAttrImg = (exact.images && exact.images[idx % exact.images.length]) || exact.heroImage;
                  const attrImg = (typeof attr === 'object' && attr.image && !isInvalid(attr.image)) ? attr.image : fallbackAttrImg;

                  return (
                    <div
                      key={idx}
                      className="glass-panel glass-panel-hover rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300 border border-white/80 flex flex-col"
                    >
                      <div className="h-48 w-full bg-slate-200 overflow-hidden relative">
                        <img
                          src={attrImg}
                          alt={title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackAttrImg;
                          }}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 bg-navy-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-300">
                          Attraction #{idx + 1}
                        </div>
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="text-base font-bold text-navy-900 mb-1.5">{title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-semibold">
                          <span>Cab Sightseeing Included</span>
                          <span className="flex items-center gap-1">Guided Stop <ArrowRight className="w-3 h-3" /></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Things to Experience */}
          {destination.thingsToDo && destination.thingsToDo.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-glass border border-white/80">
              <h3 className="text-2xl font-bold text-navy-900 mb-2">
                Top Experiences & Activities
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Handpicked cultural, spiritual, and adventure experiences curated by local specialists.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.thingsToDo.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-white transition-all flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {((destination.gallery && destination.gallery.length > 0) || (exact.images && exact.images.length > 0)) && (
            <div>
              <h3 className="text-2xl font-bold text-navy-900 mb-2">Photo Gallery</h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Authentic glimpses of {destination.name} captured on the ground.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(destination.gallery || exact.images).map((img, idx) => (
                  <div key={idx} className="h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-200 shadow-soft relative group">
                    <img
                      src={isInvalid(img) ? exact.heroImage : img}
                      alt={`${destination.name} gallery image ${idx + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = exact.heroImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-transparent transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Travel Tips Card */}
          {destination.travelTips && destination.travelTips.length > 0 && (
            <div className="p-6 rounded-2xl bg-brand-50/70 border border-brand-200/60">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-brand-600" />
                <h4 className="text-base font-bold text-brand-950">Local Travel Tips from Our Drivers</h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-brand-900/80">
                {destination.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Tour Packages */}
          {destination.recommendedPackages && destination.recommendedPackages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-navy-900">Recommended Tour Packages</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    All-inclusive holiday packages with verified stays and cab service.
                  </p>
                </div>
                <Link
                  to={`/packages?search=${encodeURIComponent(destination.name)}`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 shrink-0"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {destination.recommendedPackages.map((pkg, idx) => (
                  <Link
                    key={pkg._id || idx}
                    to={`/packages/${pkg.slug}`}
                    className="group glass-panel glass-panel-hover rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300 border border-white/80 flex flex-col"
                  >
                    <div className="h-44 w-full overflow-hidden bg-slate-200 relative">
                      <img
                        src={pkg.featuredImage || exact.heroImage}
                        alt={pkg.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = exact.heroImage;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-semibold text-brand-700 shadow-sm">
                        {pkg.duration || '2 Days'}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-navy-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-300">
                        {pkg.discountedPrice ? formatCurrency(pkg.discountedPrice) : formatCurrency(pkg.price || 4999)}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="text-base font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
                        <span>Vista Tour and Travels</span>
                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Quick Booking & Inquiry Card (Sticky Glassmorphic Panel) */}
          <div className="glass-panel rounded-2xl p-6 shadow-glass border border-white/90 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Online & Ready to Dispatch</p>
            </div>
            <h3 className="text-xl font-black text-navy-900 mb-2">
              Book Cab for {destination.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Instant quote, door-to-door pickup from Ladwa, Kurukshetra, Ambala, or Karnal, and clean sanitized commercial vehicles.
            </p>

            {/* Direct WhatsApp Action */}
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md mb-3 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Dispatch ({cleanPhone})
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${cleanPhone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-sm mb-3 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Call +91 90688 88578
            </a>

            {/* Custom Quote Form Link */}
            <Button
              variant="outline"
              onClick={() => navigate(`/contact?destination=${encodeURIComponent(destination.name)}`)}
              className="w-full py-2.5 text-xs font-bold border-slate-300"
            >
              Request Custom Itinerary Quote
            </Button>

            {/* Trust Points */}
            <div className="mt-6 pt-6 border-t border-slate-200/80 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Advance Deposit for Local Booking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Chauffeur with Local Route Knowledge</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Transparent Rates with Fuel & Tolls</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24/7 Live Emergency Passenger Support</span>
              </div>
            </div>

            {/* Office Address Banner */}
            <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
              <span className="font-bold text-navy-900 block mb-0.5">Head Office Location:</span>
              Nawarsi Bazar, Ladwa, Haryana 136132
            </div>
          </div>

          {/* Other Regional Destinations Selector */}
          <div className="glass-panel rounded-2xl p-6 shadow-glass border border-white/80">
            <h3 className="text-base font-bold text-navy-900 mb-4">Explore Other Destinations</h3>
            <div className="space-y-3">
              {[
                { name: 'Kurukshetra', slug: 'kurukshetra', state: 'Haryana', tag: 'Brahma Sarovar' },
                { name: 'Ambala', slug: 'ambala', state: 'Haryana', tag: 'Cloth Market & Cantt' },
                { name: 'Delhi NCR', slug: 'delhi', state: 'Delhi NCR', tag: 'Heritage & IGI Airport' },
                { name: 'Karnal', slug: 'karnal', state: 'Haryana', tag: 'Karna Lake & Haveli' },
                { name: 'Panipat', slug: 'panipat', state: 'Haryana', tag: 'Battlefields & Weavers' },
                { name: 'Yamunanagar', slug: 'yamunanagar', state: 'Haryana', tag: 'Kalesar Jungle Safari' },
                { name: 'Kaithal', slug: 'kaithal', state: 'Haryana', tag: 'Hanuman Tirth & Fort' },
                { name: 'Chandigarh', slug: 'chandigarh', state: 'Chandigarh UT', tag: 'Rock Garden & Lake' }
              ]
                .filter((d) => d.slug !== destination.slug)
                .map((rel) => {
                  const relExact = getExactDestinationImages(rel.name, rel.slug);
                  return (
                    <Link
                      key={rel.slug}
                      to={`/destinations/${rel.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100/70 transition-colors group"
                    >
                      <img
                        src={relExact.heroImage}
                        alt={rel.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold text-navy-900 group-hover:text-brand-600 transition-colors truncate">
                          {rel.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{rel.tag}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
