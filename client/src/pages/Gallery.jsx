import React, { useState, useEffect } from 'react';
import { galleryApi } from '../services/galleryApi';
import { Camera, Eye, X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = [
    'All',
    'Mountains',
    'Beaches',
    'Adventure',
    'Hotels',
    'Road Trips',
    'Culture',
    'Honeymoon'
  ];

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const res = await galleryApi.getAll(params);
      if (res.success && res.data) {
        setPhotos(res.data);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();

    const handleUpdate = () => fetchPhotos();
    window.addEventListener('rtt_gallery_updated', handleUpdate);
    return () => window.removeEventListener('rtt_gallery_updated', handleUpdate);
  }, [selectedCategory]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 uppercase tracking-widest bg-brand-500/20 px-3 py-1 rounded-full mb-3 border border-brand-400/30">
            <Camera className="w-3.5 h-3.5" /> Visual Wanderlust
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Travel Photo Gallery
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Real snaps from Himalayan snow peaks, Goan sunsets, Kerala backwaters, and traveler journeys.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {/* Category Filter Pills - Hidden scrollbar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader size="lg" text="Loading photo gallery..." />
          </div>
        ) : photos.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="No photos in this category yet"
            description="Try selecting another category or view All."
            actionLabel="View All Photos"
            onAction={() => setSelectedCategory('All')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative h-64 rounded-2xl overflow-hidden bg-slate-200 shadow-soft cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'}
                  alt={item.title || 'Gallery image'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold leading-tight">{item.title}</h4>
                  {item.location && (
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-brand-400" /> {item.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={prevPhoto}
            className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Photo & Info Container */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={photos[lightboxIndex].imageUrl || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'}
              alt={photos[lightboxIndex].title || 'Gallery image'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80';
              }}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold">{photos[lightboxIndex].title}</h3>
              {photos[lightboxIndex].location && (
                <p className="text-xs text-brand-300 mt-1 flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {photos[lightboxIndex].location}
                </p>
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextPhoto}
            className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
