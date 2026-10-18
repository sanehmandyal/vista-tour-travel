import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryApi } from '../../services/galleryApi';
import { Camera, ArrowRight, Eye } from 'lucide-react';

export const GalleryPreview = () => {
  const [photos, setPhotos] = useState([]);

  const fetchGallery = async () => {
    try {
      const res = await galleryApi.getAll();
      if (res.success && res.data) {
        setPhotos(res.data.slice(0, 6));
      }
    } catch (err) {
      console.error('Failed to load gallery', err);
    }
  };

  useEffect(() => {
    fetchGallery();

    const handleUpdate = () => fetchGallery();
    window.addEventListener('rtt_gallery_updated', handleUpdate);
    return () => window.removeEventListener('rtt_gallery_updated', handleUpdate);
  }, []);

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full mb-3">
              <Camera className="w-3.5 h-3.5" /> Visual Wanderlust
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Travel Gallery
            </h2>
            <p className="text-slate-500 mt-2 text-base max-w-xl">
              Glimpses of breathtaking landscapes, mountain sunrises, and happy traveler memories.
            </p>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-brand-600 font-bold hover:text-brand-700 text-sm mt-4 md:mt-0 transition-colors"
          >
            Explore Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {photos.map((item, idx) => (
            <Link
              key={item._id || idx}
              to="/gallery"
              className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'}
                alt={item.title || 'Travel photo'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-navy-950/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[11px] font-semibold truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
