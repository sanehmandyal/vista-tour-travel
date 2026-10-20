import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { destinationApi, getExactDestinationImages } from '../services/destinationApi';
import { formatCurrency } from '../utils/formatCurrency';
import { Search, MapPin, ArrowRight, Filter, Compass, SlidersHorizontal } from 'lucide-react';
import { CardSkeleton } from '../components/common/Skeleton';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';

export const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [region, setRegion] = useState(searchParams.get('region') || 'All');
  const [budget, setBudget] = useState(searchParams.get('budget') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const regions = ['All', 'Kurukshetra / GT Road', 'Ambala Division', 'National Capital Region', 'Karnal / GT Road', 'Panipat / GT Road', 'Shivalik Foothills', 'Kaithal / Pehowa Belt', 'Chandigarh Tricity'];

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (region && region !== 'All') params.region = region;
      if (sort) params.sort = sort;

      if (budget === 'under-10k') params.maxPrice = 10000;
      else if (budget === '10k-20k') { params.minPrice = 10000; params.maxPrice = 20000; }
      else if (budget === 'above-20k') params.minPrice = 20000;

      const res = await destinationApi.getAll(params);
      if (res.success) {
        setDestinations(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Error loading destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();

    const handleUpdate = () => fetchDestinations();
    window.addEventListener('rtt_destinations_updated', handleUpdate);
    return () => window.removeEventListener('rtt_destinations_updated', handleUpdate);
  }, [search, region, budget, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDestinations();
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/assets/images/hero-haryana-kurukshetra.jpg"
            alt="Haryana Destinations Header"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1920";
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 uppercase tracking-widest bg-brand-500/20 px-3 py-1 rounded-full mb-3 border border-brand-400/30">
            <Compass className="w-3.5 h-3.5" /> Explore Haryana, Delhi NCR & Chandigarh
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Haryana & Regional Destinations
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Explore sacred heritage sites, battlefields, national parks, and urban centers across Kurukshetra, Ambala, Delhi, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh with Vista Tour and Travels.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {/* Search & Filter Bar (Glassmorphism) */}
        <div className="glass-panel rounded-2xl shadow-glass border border-white/80 p-4 sm:p-6 mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destination or state..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Region pills - Hidden scrollbar */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRegion(r); setPage(1); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    region === r
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Sorting dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="text-xs font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 text-slate-700 focus:outline-none focus:border-brand-500"
              >
                <option value="">Default Sorting</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </form>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <EmptyState
            title="No destinations match your criteria"
            description="Try changing your search keywords or resetting your budget filters."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setRegion('All');
              setBudget('all');
              setSort('');
              setPage(1);
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest) => {
                const exact = getExactDestinationImages(dest.name, dest.slug);
                const isInvalid = (url) => !url || typeof url !== 'string' || url.trim() === '' || url.includes('unsplash.com') || (url.startsWith('http') && (url.includes('photo-15') || url.includes('photo-16') || url.includes('photo-14'))) || url.includes('Dharamshala_stadium');
                const destImg = !isInvalid(dest.heroImage)
                  ? dest.heroImage
                  : (!isInvalid(dest.featuredImage)
                      ? dest.featuredImage
                      : (dest.attractions?.[0]?.image && !isInvalid(dest.attractions[0].image) ? dest.attractions[0].image : exact.featuredImage));
                return (
                  <Link
                    key={dest._id}
                    to={`/destinations/${dest.slug}`}
                    className="group relative glass-panel glass-panel-hover rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300 border border-white/80 flex flex-col"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-slate-200">
                      <img
                        src={destImg}
                        alt={dest.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = (dest.attractions?.[0]?.image && !isInvalid(dest.attractions[0].image)) ? dest.attractions[0].image : (exact.featuredImage || exact.heroImage);
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-75" />

                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-navy-900 flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3 text-brand-600" />
                      <span>{dest.state}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">Taxi & Tour Packages</p>
                      <p className="text-base font-black text-white">Custom Itineraries</p>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {dest.shortDescription}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                      <span className="text-slate-500 font-medium">Best: {dest.bestTimeToVisit}</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Destination <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                  </Link>
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

export default Destinations;
