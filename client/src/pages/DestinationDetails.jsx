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
  ChevronRight
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
        }
      } catch (err) {
        console.error('Failed to fetch destination details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
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
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Destination Not Found</h2>
        <p className="text-slate-500 mb-6">The requested destination does not exist.</p>
        <Button onClick={() => navigate('/destinations')}>Back to Destinations</Button>
      </div>
    );
  }

  const exact = getExactDestinationImages(destination.name, destination.slug);
  const isInvalid = (url) => !url || typeof url !== 'string' || url.includes('unsplash.com') || url.includes('photo-15') || url.includes('photo-16') || url.includes('photo-14');
  const heroImg = isInvalid(destination.heroImage)
    ? (isInvalid(destination.featuredImage) ? exact.heroImage : destination.featuredImage)
    : destination.heroImage;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="relative h-[440px] lg:h-[520px] bg-navy-950 overflow-hidden flex items-end">
        <img
          src={heroImg}
          alt={destination.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = exact.heroImage;
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full text-white">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/destinations" className="hover:text-white">Destinations</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-brand-300">{destination.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/40 text-brand-200 text-xs font-semibold mb-2">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>{destination.state}, {destination.country}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                {destination.name}
              </h1>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-6">
              <div>
                <p className="text-xs text-slate-300 uppercase font-bold tracking-wider">Vista Tour and Travels</p>
                <p className="text-lg sm:text-xl font-black text-amber-300">Customized Quotes</p>
              </div>
              <Button
                variant="accent"
                onClick={() => navigate(`/contact?destination=${encodeURIComponent(destination.name)}`)}
              >
                Inquire Cab / Tour
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">About {destination.name}</h2>
            <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
              {destination.description}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Best Time to Visit</p>
                  <p className="text-sm font-bold text-navy-900">{destination.bestTimeToVisit}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Region</p>
                  <p className="text-sm font-bold text-navy-900">{destination.region}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Attractions */}
          {destination.attractions && destination.attractions.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Popular Attractions in {destination.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {destination.attractions.map((attr, idx) => {
                  const fallbackAttrImg = (exact.images && exact.images[idx % exact.images.length]) || exact.heroImage;
                  const attrImg = isInvalid(attr.image) ? fallbackAttrImg : attr.image;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 flex flex-col"
                    >
                      <div className="h-44 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={attrImg}
                          alt={attr.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackAttrImg;
                          }}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-bold text-navy-900 mb-1">{attr.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{attr.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Things to Do */}
          {destination.thingsToDo && destination.thingsToDo.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-slate-100">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Top Things to Experience</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {destination.thingsToDo.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-navy-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Destination Gallery */}
          {((destination.gallery && destination.gallery.length > 0) || (exact.images && exact.images.length > 0)) && (
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {((destination.gallery && destination.gallery.length > 0 && !destination.gallery.some(isInvalid))
                  ? destination.gallery
                  : exact.images
                ).map((img, idx) => (
                  <div key={idx} className="h-48 rounded-2xl overflow-hidden bg-slate-100 shadow-soft">
                    <img
                      src={isInvalid(img) ? exact.heroImage : img}
                      alt={`${destination.name} ${idx + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = exact.heroImage;
                      }}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Tour Packages */}
          {destination.recommendedPackages && destination.recommendedPackages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-navy-900">Recommended Packages</h2>
                <Link
                  to={`/packages?search=${encodeURIComponent(destination.name)}`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View All Packages <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {destination.recommendedPackages.map((pkg) => (
                  <Link
                    key={pkg._id}
                    to={`/packages/${pkg.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all border border-slate-100 flex flex-col"
                  >
                    <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                      <img
                        src={pkg.featuredImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'}
                        alt={pkg.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-semibold text-brand-700">
                        {pkg.duration}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="text-base font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pkg.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-brand-600 uppercase font-bold">Vista Tour and Travels</span>
                          <p className="text-sm font-black text-navy-900">
                            Customized Itinerary
                          </p>
                        </div>
                        <span className="text-xs font-bold text-brand-600 flex items-center gap-1">
                          Details <ArrowRight className="w-3 h-3" />
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
          {/* Quick Inquiry Card */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 sticky top-24">
            <h3 className="text-lg font-bold text-navy-900 mb-2">Need a Customized Plan?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Our destination specialists will craft a customized itinerary for {destination.name} within 2 hours.
            </p>

            <Button
              variant="accent"
              onClick={() => navigate(`/contact?destination=${encodeURIComponent(destination.name)}`)}
              className="w-full py-3 text-sm font-bold shadow-md mb-3"
            >
              Request Custom Quote
            </Button>

            <Link
              to={`/packages?search=${encodeURIComponent(destination.name)}`}
              className="w-full inline-flex items-center justify-center py-2.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Browse All {destination.name} Packages
            </Link>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified 3 & 4-Star Accommodations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dedicated Chauffeur & Sanitized Cab</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24/7 Live Emergency Support</span>
              </div>
            </div>
          </div>

          {/* Related Destinations */}
          {destination.relatedDestinations && destination.relatedDestinations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100">
              <h3 className="text-base font-bold text-navy-900 mb-4">Other Destinations in {destination.region}</h3>
              <div className="space-y-4">
                {destination.relatedDestinations.map((rel) => (
                  <Link
                    key={rel._id}
                    to={`/destinations/${rel.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <img
                      src={rel.heroImage}
                      alt={rel.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-brand-600 font-semibold mt-0.5">
                        Tours & Cabs Available
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
