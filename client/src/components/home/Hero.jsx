import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsite } from '../../context/WebsiteContext';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Car,
  ArrowRight,
  Star,
  Phone,
  Navigation,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Compass
} from 'lucide-react';
import Button from '../common/Button';

export const Hero = () => {
  const { settings } = useWebsite();
  const navigate = useNavigate();

  // Form State
  const [fromLocation, setFromLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState('1-4');
  const [vehicleType, setVehicleType] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromLocation) params.append('from', fromLocation);
    if (destination) params.append('to', destination);
    if (vehicleType && vehicleType !== 'all') params.append('vehicle', vehicleType);
    if (date) params.append('date', date);
    if (travelers) params.append('travelers', travelers);
    navigate(`/booking?${params.toString()}`);
  };

  const handleWhatsAppInstantQuote = () => {
    const pickup = fromLocation || 'Ladwa / Kurukshetra / Haryana';
    const drop = destination || 'Sightseeing / Tour / Airport Drop';
    const cleanWa = (settings.whatsapp || '919068888578').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${settings.companyName || 'Vista Tour and Travels'}! I would like to get an instant cab/travel quote:\n` +
      `• Pickup: ${pickup}\n` +
      `• Destination: ${drop}\n` +
      `• Date: ${date || 'Upcoming'}\n` +
      `• Vehicle: ${vehicleType !== 'all' ? vehicleType : 'Best Available'}\n` +
      `• Passengers: ${travelers}\n` +
      `Please share availability and best Haryana & GT Road cab rates.`
    );
    window.open(`https://wa.me/${cleanWa}?text=${text}`, '_blank');
  };

  return (
    <div className="relative min-h-[560px] sm:min-h-[600px] 2xl:min-h-[700px] flex items-center justify-center bg-navy-950 overflow-hidden">
      {/* Background Photography with Vibrant Golden Hour Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImage && !settings.heroImage.includes('unsplash') && !settings.heroImage.includes('Brahma_Sarovar_Kurukshetra.jpg') ? settings.heroImage : "/assets/images/hero-haryana-kurukshetra.jpg"}
          alt="Vista Tour and Travels - Ladwa, Kurukshetra & Haryana Tour & Luxury Cabs"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/hero-haryana-chariot-mirror.jpg';
          }}
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 brightness-[1.03] contrast-[1.03]"
          loading="eager"
        />
        {/* Cinematic atmospheric overlays that let the warm golden sunset and chariot shine through */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-900/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/65 via-transparent to-navy-950/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/30 via-transparent to-navy-950/70" />
      </div>

      {/* Decorative Warm Glass Glow Elements */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-amber-400/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 py-8 sm:py-10 lg:py-12 2xl:py-16 flex flex-col items-center text-center">
        {/* Google 5.0 Rating Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3.5 sm:mb-4">
          <a
            href={(settings.googleReviewsUrl && !settings.googleReviewsUrl.includes('Kangra')) ? settings.googleReviewsUrl : "https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-400/25 border border-amber-300/50 text-amber-300 text-[11px] sm:text-xs md:text-sm font-bold backdrop-blur-xl hover:bg-amber-400/35 transition-all shadow-lg shadow-amber-500/20"
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 shrink-0" />
            <span>5.0 ★ Google Rated • 50+ Verified Reviews</span>
          </a>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-300/50 text-emerald-300 text-xs font-semibold backdrop-blur-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Ladwa, Kurukshetra & NCR Specialists
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.15] mb-3 sm:mb-4 drop-shadow-md">
          {settings.heroTitle || 'Experience Seamless Journeys with Vista Tour and Travels'}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm lg:text-base text-slate-100 max-w-2xl leading-relaxed mb-5 sm:mb-6 font-medium drop-shadow-sm px-2">
          {settings.heroSubtitle || 'Haryana’s top-rated luxury cab service and travel provider. Clean commercial cabs, verified professional chauffeurs, and transparent all-inclusive quotes.'}
        </p>

        {/* Action Buttons: Phone, WhatsApp, Destinations */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-8 w-full max-w-xl sm:max-w-none">
          <a
            href={`tel:${settings.phone || '9068888578'}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-slate-950 shrink-0" /> Call {settings.phone || '+91 90688 88578'}
          </a>

          <a
            href={`https://wa.me/${(settings.whatsapp || '919068888578').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${settings.companyName || 'Vista Tour and Travels'}! I would like to inquire about cab booking and custom Haryana/Delhi/Chandigarh tour itineraries.`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-white shrink-0" /> Instant WhatsApp Quote
          </a>

          <Button
            size="lg"
            variant="white"
            onClick={() => navigate('/destinations')}
            className="w-full sm:w-auto font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-5 shadow-lg justify-center whitespace-nowrap"
          >
            <Compass className="w-4 h-4 mr-1.5 text-brand-600 shrink-0" /> Explore Destinations
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/cars')}
            className="w-full sm:w-auto font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-5 text-white border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all shadow-sm justify-center whitespace-nowrap"
          >
            <Car className="w-4 h-4 mr-1.5 text-amber-400 shrink-0" /> View Fleet
          </Button>
        </div>

        {/* Cab Booking & Travel Search Card (Glassmorphism) */}
        <div className="w-full max-w-5xl glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/85 text-left text-navy-900">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50/90 text-brand-600 text-xs font-bold border border-brand-200/50">
                <Car className="w-4 h-4" /> Book Chauffeur Cab / Sightseeing
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs text-slate-500 font-semibold">
              🚖 24/7 Doorstep Pickup Across Ladwa, Kurukshetra, Ambala, Delhi NCR & Chandigarh
            </span>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-end">
            {/* Field 1: Pickup Point */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" /> Pickup Location
              </label>
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="Ladwa, Kurukshetra, Delhi..."
                className="w-full h-11 text-sm font-medium text-navy-900 placeholder:text-slate-400 glass-input rounded-xl px-3 py-2 transition-colors"
              />
            </div>

            {/* Field 2: Destination */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Delhi, Chandigarh, Ambala, Karnal..."
                className="w-full h-11 text-sm font-medium text-navy-900 placeholder:text-slate-400 glass-input rounded-xl px-3 py-2 transition-colors"
              />
            </div>

            {/* Field 3: Travel Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" /> Journey Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 text-sm font-medium text-navy-900 glass-input rounded-xl px-3 py-2 transition-colors"
              />
            </div>

            {/* Field 4: Vehicle Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-brand-600" /> Preferred Cab
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full h-11 text-sm font-medium text-navy-900 glass-input rounded-xl px-3 py-2 transition-colors"
              >
                <option value="all">Any Vehicle Type</option>
                <option value="sedan">Dzire / Etios (Sedan)</option>
                <option value="suv">Ertiga / Scorpio (SUV)</option>
                <option value="innova">Innova Crysta (Luxury)</option>
                <option value="tempo">Tempo (12/17 Seater)</option>
              </select>
            </div>

            {/* Field 5: Passengers */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-600" /> Passengers
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full h-11 text-sm font-medium text-navy-900 glass-input rounded-xl px-3 py-2 transition-colors"
              >
                <option value="1-2">1 - 2 Passengers</option>
                <option value="3-4">3 - 4 Passengers</option>
                <option value="5-7">5 - 7 Passengers</option>
                <option value="8+">8+ Group</option>
              </select>
            </div>

            {/* Field 6: Action Button */}
            <div className="w-full pt-1 sm:pt-0">
              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 px-3 text-sm font-bold shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap bg-brand-600 hover:bg-brand-700"
              >
                <Search className="w-4 h-4 shrink-0" /> Book Cab
              </Button>
            </div>
          </form>

          {/* Quick Features Strip */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verified Professional Chauffeurs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>Sanitized Cabs • Chilled AC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span>Zero Hidden Charges</span>
            </div>
            <button
              type="button"
              onClick={handleWhatsAppInstantQuote}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1 sm:ml-auto pt-1 sm:pt-0"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" /> Need quick quote? WhatsApp Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
