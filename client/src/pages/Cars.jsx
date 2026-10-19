import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carApi, getExactCarImage } from '../services/carApi';
import {
  Car,
  Users,
  Briefcase,
  Fuel,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Search,
  Star,
  Clock,
  Compass,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

export const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Sedan', 'MUV', 'SUV', 'Luxury', 'Tempo Traveller'];

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await carApi.getAll();
      if (res.success && res.data) {
        setCars(res.data);
      }
    } catch (err) {
      console.error('Failed to load fleet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    document.title = 'Luxury Car Fleet & Taxi Rentals | Vista Tour and Travels Ladwa';
    window.scrollTo(0, 0);

    const handleUpdate = () => fetchCars();
    window.addEventListener('rtt_cars_updated', handleUpdate);
    return () => window.removeEventListener('rtt_cars_updated', handleUpdate);
  }, []);

  const filteredCars = cars.filter((car) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      car.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'SUV' && car.name?.toLowerCase().includes('suv')) ||
      (selectedCategory === 'MUV' && car.name?.toLowerCase().includes('muv')) ||
      (selectedCategory === 'Sedan' && car.name?.toLowerCase().includes('sedan')) ||
      (selectedCategory === 'Luxury' && (car.category?.toLowerCase() === 'luxury' || car.name?.toLowerCase().includes('luxury') || car.name?.toLowerCase().includes('hycross') || car.name?.toLowerCase().includes('fortuner'))) ||
      (selectedCategory === 'Tempo Traveller' && (car.category?.toLowerCase().includes('tempo') || car.name?.toLowerCase().includes('tempo') || car.name?.toLowerCase().includes('urbania')));

    const matchesSearch =
      !search ||
      car.name?.toLowerCase().includes(search.toLowerCase()) ||
      car.description?.toLowerCase().includes(search.toLowerCase()) ||
      car.features?.some((f) => f.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const cleanPhone = '9068888578';

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner with Glassmorphism */}
      <div className="relative bg-navy-950 text-white py-20 px-4 sm:px-6 overflow-hidden">
        {/* Ambient Warm Radial Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-400">Our Fleet & Cars</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 border border-brand-400/40 text-brand-200 text-xs font-bold mb-4 backdrop-blur-md">
            <Car className="w-4 h-4 text-amber-400" />
            <span>Commercial Verified Taxis • Nawarsi Bazar, Ladwa (Kurukshetra)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Our Luxury Cab & Vehicle Fleet
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Choose from Toyota Innova Crysta, Innova Hycross, Maruti Ertiga, Dzire, Scorpio-N, Fortuner, and Force Tempo Travellers for outstation trips, local day rentals, and 24/7 Delhi & Chandigarh airport transfers.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 5.0★ Google Rated Service
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Commercial Yellow Plates
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              <Clock className="w-4 h-4 text-amber-400" /> 24/7 Emergency Dispatch
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {/* Search & Category Filter Bar (Glassmorphic) */}
        <div className="glass-panel rounded-2xl shadow-glass border border-white/80 p-4 sm:p-6 mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-navy-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by car name or feature..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Cars Fleet Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader size="lg" text="Loading vehicle fleet..." />
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-soft">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-900">No vehicles found in this category</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try selecting "All" or clearing your search keywords.</p>
            <Button onClick={() => { setSelectedCategory('All'); setSearch(''); }}>Reset Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => {
              const exactImg = getExactCarImage(car.name);
              const waText = encodeURIComponent(
                `Hello Vista Tour & Travels, I want to book ${car.name} from Ladwa / Kurukshetra. Please share availability and fare details.`
              );
              const carWaUrl = `https://wa.me/91${cleanPhone}?text=${waText}`;

              return (
                <div
                  key={car._id}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300 border border-white/80 flex flex-col justify-between"
                >
                  <div>
                    {/* Vehicle Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <img
                        src={car.image || exactImg}
                        alt={car.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = exactImg;
                        }}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-navy-900 shadow-sm border border-slate-200/60">
                        {car.category || 'Commercial Cab'}
                      </div>
                      <div className="absolute top-3 right-3 bg-navy-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-400 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Available 24/7
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-6">
                      <h3 className="text-lg font-black text-navy-900 leading-snug mb-2">
                        {car.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                        {car.description}
                      </p>

                      {/* Capacity Badges */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-semibold text-slate-700">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <Users className="w-4 h-4 text-brand-600 shrink-0" />
                          <span className="truncate">{car.seatingCapacity || '4 + 1 Seats'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="truncate">{car.luggageCapacity || '3 Bags + Boot'}</span>
                        </div>
                      </div>

                      {/* Feature Highlights */}
                      {car.features && car.features.length > 0 && (
                        <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-100">
                          {car.features.slice(0, 3).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Action Buttons */}
                  <div className="p-6 pt-0 border-t border-slate-100/80 flex items-center gap-2.5">
                    <a
                      href={carWaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" /> Book on WhatsApp
                    </a>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="p-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-amber-400 hover:text-white transition-colors"
                      title="Call to Book"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Transparent Rates & Pricing Policy Guide */}
        <div className="mt-16 glass-panel rounded-3xl p-6 sm:p-10 shadow-glass border border-white/80">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full mb-2 border border-amber-200/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Transparent Pricing
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Cab Rental Pricing & Per-KM Billing Guide
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Clear, transparent rates with zero surge pricing, transparent toll billing, and polite verified chauffeurs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Maruti Dzire / Etios</span>
              <p className="text-xl font-black text-navy-900 mt-1">₹11 - ₹12 / km</p>
              <p className="text-[11px] text-slate-500 mt-1">Outstation min. 250 km/day. AC included.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Maruti Ertiga (MUV)</span>
              <p className="text-xl font-black text-navy-900 mt-1">₹14 - ₹15 / km</p>
              <p className="text-[11px] text-slate-500 mt-1">6 passenger seats + roof carrier for luggage.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Toyota Innova Crysta</span>
              <p className="text-xl font-black text-navy-900 mt-1">₹18 - ₹20 / km</p>
              <p className="text-[11px] text-slate-500 mt-1">Plush captain recliners & dual chill AC.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Force Tempo Traveller</span>
              <p className="text-xl font-black text-navy-900 mt-1">₹24 - ₹28 / km</p>
              <p className="text-[11px] text-slate-500 mt-1">12, 17, and 26-seater maharaja pushback seats.</p>
            </div>
          </div>

          {/* Booking Info Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-900 block mb-0.5">Zero Advance Deposit</strong>
                <span>Pay directly to driver or via UPI upon reaching your destination.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-900 block mb-0.5">24/7 Flight & Train Tracking</strong>
                <span>Never worry about delayed flights at Delhi IGI or trains at Ambala Cantt.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy-900 block mb-0.5">Doorstep Dispatch in Ladwa</strong>
                <span>Head office at Nawarsi Bazar, Ladwa (Haryana 136132).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Strip */}
        <div className="mt-12 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Custom Cab Requirements?</span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1">
              Need a Special Vehicle for Weddings or Corporate Events?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Contact our central dispatch in Ladwa at <strong className="text-white">+91 90688 88578</strong> for instant quotes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent('Hello Vista Tour & Travels, I need custom vehicle rental assistance.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 shrink-0" /> WhatsApp Dispatch
            </a>
            <Link
              to="/contact"
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all text-center"
            >
              Inquire Online
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
