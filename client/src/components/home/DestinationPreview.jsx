import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { destinationApi, getExactDestinationImages } from '../../services/destinationApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { MapPin, ArrowRight, Compass } from 'lucide-react';
import { CardSkeleton } from '../common/Skeleton';

export const DestinationPreview = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPopular = async () => {
    try {
      const res = await destinationApi.getAll({ featured: true, limit: 6 });
      if (res.success && res.data) {
        setDestinations(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopular();

    const handleUpdate = () => fetchPopular();
    window.addEventListener('rtt_destinations_updated', handleUpdate);
    return () => window.removeEventListener('rtt_destinations_updated', handleUpdate);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Glow Orbs for Glassmorphism Depth */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2.5 min-[360px]:px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/60 px-3.5 py-1 rounded-full mb-3 shadow-xs">
              <Compass className="w-3.5 h-3.5" /> Iconic Escapes
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-slate-500 mt-2 text-base max-w-xl">
              Explore sacred spiritual heritage, historic battlefields, wildlife sanctuaries, and bustling commercial hubs across Kurukshetra, Ambala, Delhi, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-brand-600 font-bold hover:text-brand-700 text-sm mt-4 md:mt-0 transition-colors"
          >
            View All Destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => {
              const exact = getExactDestinationImages(dest.name, dest.slug);
              const isInvalid = (url) => !url || typeof url !== 'string' || url.trim() === '' || url.includes('Dharamshala_stadium') || url.includes('Kaithal_Fort');
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
                  {/* Image & Overlay */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-200">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* State badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-navy-900 flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-brand-600" />
                    <span>{dest.state}</span>
                  </div>

                  {/* Destination Tag */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">Tour & Cab Packages</p>
                    <p className="text-base font-black text-white">Custom Itineraries</p>
                  </div>
                </div>

                {/* Content */}
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
                    <span>{dest.bestTimeToVisit}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationPreview;
