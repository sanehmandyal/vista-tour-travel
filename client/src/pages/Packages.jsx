import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { packageApi } from '../services/packageApi';
import { destinationApi } from '../services/destinationApi';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Search,
  Clock,
  Star,
  MapPin,
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
  Compass,
  X,
  Phone,
  Navigation
} from 'lucide-react';
import { CardSkeleton } from '../components/common/Skeleton';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

export const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [duration, setDuration] = useState(searchParams.get('duration') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(1);

  const categories = [
    'All',
    'Spiritual Yatras',
    'Heritage & History',
    'Family Trips',
    'Weekend Getaways',
    'Delhi NCR & Airport',
    'Group Tours'
  ];

  useEffect(() => {
    const fetchDestList = async () => {
      try {
        const res = await destinationApi.getAll({ limit: 50 });
        if (res.success && res.data) {
          setDestinations(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDestList();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (destination) params.destination = destination;
      if (category && category !== 'All') params.category = category;
      if (duration) params.duration = duration;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const res = await packageApi.getAll(params);
      if (res.success) {
        setPackages(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [search, destination, category, duration, minPrice, maxPrice, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPackages();
  };

  const clearFilters = () => {
    setSearch('');
    setDestination('');
    setCategory('All');
    setDuration('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setPage(1);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1920&q=80"
            alt="Packages Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full mb-3 border border-amber-400/30">
            <Compass className="w-3.5 h-3.5" /> All-Inclusive Tours
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Tour Packages & Journeys
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Carefully curated itineraries including verified 4-star stays, daily meals, private sanitized cabs, and 24/7 helpline support.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {/* Active Planned Route Banner from Hero Search */}
        {searchParams.get('from') && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 px-4 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-sky-900 shadow-sm">
            <div className="flex items-center gap-2 font-medium flex-wrap">
              <span className="font-bold text-sky-800 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" /> Pickup:
              </span>
              <span className="bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 font-bold">{searchParams.get('from')}</span>
              <ArrowRight className="w-4 h-4 text-sky-500" />
              <span className="font-bold text-sky-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> Destination:
              </span>
              <span className="bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 font-bold">{destination || search || 'Haryana, Delhi NCR & Chandigarh'}</span>
              {searchParams.get('date') && (
                <span className="text-slate-500 text-xs">📅 {searchParams.get('date')}</span>
              )}
            </div>
            <a
              href="tel:9068888578"
              className="inline-flex items-center gap-1.5 font-bold text-sky-700 hover:text-sky-800 bg-white px-3 py-1 rounded-lg border border-sky-200 text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> Book Direct Cab: +91 90688 88578
            </a>
          </div>
        )}

        {/* Category Pills Bar (Glassmorphism) */}
        <div className="glass-panel rounded-2xl shadow-glass border border-white/80 p-3 mb-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'bg-white/60 text-slate-700 hover:bg-white border border-slate-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls Row (Glassmorphism) */}
        <div className="glass-panel rounded-2xl shadow-glass border border-white/80 p-4 sm:p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search packages..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Destination Select */}
            <div>
              <select
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setPage(1); }}
                className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="">All Destinations</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} ({d.state})</option>
                ))}
              </select>
            </div>

            {/* Duration Select */}
            <div>
              <select
                value={duration}
                onChange={(e) => { setDuration(e.target.value); setPage(1); }}
                className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="">Any Duration</option>
                <option value="short">1 - 3 Days (Weekend)</option>
                <option value="medium">4 - 6 Days (Standard)</option>
                <option value="long">7+ Days (Extended)</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="">Sort By</option>
                <option value="rating">Highest Rated</option>
                <option value="duration">Trip Duration</option>
              </select>
            </div>

            {/* Clear Filters button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <EmptyState
            title="No packages match your criteria"
            description="Try loosening your filters or searching for another destination."
            actionLabel="Reset Filters"
            onAction={clearFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => {
                const hasDiscount = pkg.discountedPrice > 0 && pkg.discountedPrice < pkg.price;
                const displayPrice = hasDiscount ? pkg.discountedPrice : pkg.price;

                return (
                  <div
                    key={pkg._id}
                    className="group glass-panel glass-panel-hover rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300 border border-white/80 flex flex-col"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                      <img
                        src={pkg.featuredImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'}
                        alt={pkg.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      <div className="absolute top-3.5 left-3.5">
                        <Badge variant="primary" className="bg-white/95 backdrop-blur-sm shadow-sm font-semibold">
                          {pkg.category}
                        </Badge>
                      </div>

                      <div className="absolute top-3.5 right-3.5 bg-navy-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{pkg.rating}</span>
                      </div>

                      <div className="absolute bottom-3 left-3.5 bg-navy-950/70 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-400" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 mb-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{pkg.destinationName || pkg.destination?.name || 'India'}</span>
                        </div>

                        <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                          {pkg.title}
                        </h3>

                        <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          <span className="text-[11px] bg-slate-50 text-slate-600 border border-slate-100 rounded px-2 py-0.5 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Stays
                          </span>
                          <span className="text-[11px] bg-slate-50 text-slate-600 border border-slate-100 rounded px-2 py-0.5 font-medium">
                            Chauffeur Cab
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-brand-600 uppercase font-bold tracking-wider">Vista Tour and Travels</span>
                          <p className="text-sm font-black text-navy-900">Customized Pricing</p>
                        </div>

                        <Link
                          to={`/packages/${pkg.slug}`}
                          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          View Details & Quote <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Packages;
