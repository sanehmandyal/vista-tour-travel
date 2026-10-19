import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultLocations } from '../data/defaultLocations';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Car,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Search,
  CheckCircle2,
  Compass
} from 'lucide-react';

export const Locations = () => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Taxi Service Locations Across Haryana, Delhi NCR & Chandigarh | Vista Travels';
    window.scrollTo(0, 0);
  }, []);

  const filteredLocations = defaultLocations.filter(
    (loc) =>
      !search ||
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.district?.toLowerCase().includes(search.toLowerCase()) ||
      loc.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
      loc.pickupPoints?.some((p) => p.toLowerCase().includes(search.toLowerCase()))
  );

  const cleanPhone = '9068888578';

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="relative bg-navy-950 text-white py-20 px-4 sm:px-6 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-amber-400">Service Locations</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 border border-brand-400/40 text-brand-200 text-xs font-bold mb-4 backdrop-blur-md">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>24/7 Doorstep Cab Pickups Across Haryana & Delhi NCR</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Locations We Serve
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From our central headquarters in Nawarsi Bazar, Ladwa, to Kurukshetra, Ambala, Delhi IGI Airport, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh—we provide reliable 24/7 commercial cabs.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              📍 Head Office: Nawarsi Bazar, Ladwa (136132)
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              ⚡ Rapid Dispatch in Under 30 Mins
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              📞 24/7 Helpline: +91 90688 88578
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {/* Search Bar */}
        <div className="glass-panel rounded-2xl shadow-glass border border-white/80 p-4 sm:p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city, station, or pickup point..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing {filteredLocations.length} service locations
          </span>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLocations.map((loc) => {
            const waText = encodeURIComponent(
              `Hello Vista Tour & Travels, I need cab service in ${loc.name}. Please share cab availability.`
            );
            const waUrl = `https://wa.me/91${cleanPhone}?text=${waText}`;

            return (
              <div
                key={loc.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300 border border-white/80 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={loc.heroImage}
                      alt={loc.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-navy-900 shadow-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      <span>{loc.state}</span>
                    </div>
                    {loc.slug === 'ladwa' && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-navy-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        ★ Central Head Office
                      </div>
                    )}
                    <div className="absolute bottom-3 left-4 text-white">
                      <p className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">Cab Service & Airport Drops</p>
                      <h3 className="text-xl font-black text-white">{loc.name}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-brand-600 font-bold mb-1.5">{loc.tagline}</p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {loc.shortDescription}
                    </p>

                    {/* Key Pickup Points */}
                    <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Pickups Covered:</span>
                      {loc.pickupPoints.slice(0, 3).map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{pt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                      <span>Rate: <strong className="text-navy-900">{loc.startingFare}</strong></span>
                      <Link
                        to={`/locations/${loc.slug}`}
                        className="text-brand-600 hover:text-brand-800 font-bold flex items-center gap-1 group"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Book Cab in {loc.name}
                  </a>
                  <Link
                    to={`/locations/${loc.slug}`}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
                  >
                    Fares
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Locations;
