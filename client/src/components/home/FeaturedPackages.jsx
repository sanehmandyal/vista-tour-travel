import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { Clock, Star, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CardSkeleton } from '../common/Skeleton';
import Badge from '../common/Badge';

export const FeaturedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await packageApi.getAll({ featured: true, limit: 6 });
        if (res.success && res.data) {
          setPackages(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden border-y border-slate-100">
      {/* Ambient background glow orbs */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-brand-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1 rounded-full mb-3 border border-amber-200/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Best Selling Journeys
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Featured Tour Packages
            </h2>
            <p className="text-slate-500 mt-2 text-base max-w-xl">
              All-inclusive holiday experiences with handpicked 4-star stays, private sanitized vehicles, and 24/7 dedicated trip support.
            </p>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 text-brand-600 font-bold hover:text-brand-700 text-sm mt-4 md:mt-0 transition-colors"
          >
            Explore All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {packages.map((pkg) => {
              const hasDiscount = pkg.discountedPrice > 0 && pkg.discountedPrice < pkg.price;
              const displayPrice = hasDiscount ? pkg.discountedPrice : pkg.price;

              return (
                <div
                  key={pkg._id}
                  className="group glass-panel glass-panel-hover rounded-2xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-300 border border-white/80 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-200">
                    <img
                      src={pkg.featuredImage && !pkg.featuredImage.includes('unsplash') ? pkg.featuredImage : '/assets/images/hero-haryana-kurukshetra.jpg'}
                      alt={pkg.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/hero-haryana-kurukshetra.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Category Tag */}
                    <div className="absolute top-3.5 left-3.5">
                      <Badge variant="primary" className="bg-white/95 backdrop-blur-sm shadow-sm font-semibold">
                        {pkg.category}
                      </Badge>
                    </div>

                    {/* Rating Tag */}
                    <div className="absolute top-3.5 right-3.5 bg-navy-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-slate-300 font-normal">({pkg.reviewsCount})</span>
                    </div>

                    {/* Duration ribbon */}
                    <div className="absolute bottom-3 left-3.5 bg-navy-950/70 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Destination name */}
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

                      {/* Inclusion Highlights */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="text-[11px] bg-slate-50 text-slate-600 border border-slate-100 rounded px-2 py-0.5 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Hotels Included
                        </span>
                        <span className="text-[11px] bg-slate-50 text-slate-600 border border-slate-100 rounded px-2 py-0.5 font-medium">
                          Meals & Cab
                        </span>
                      </div>
                    </div>

                    {/* Action & Rate Info */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-brand-600 uppercase font-bold tracking-wider">Vista Tour and Travels</span>
                        <p className="text-sm font-black text-navy-900">Customized Pricing</p>
                      </div>

                      <Link
                        to={`/packages/${pkg.slug}`}
                        className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Get Best Quote <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPackages;
