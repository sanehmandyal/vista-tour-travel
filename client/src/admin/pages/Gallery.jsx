import React, { useEffect, useState } from 'react';
import { galleryApi } from '../../services/galleryApi';
import { adminApi } from '../../services/adminApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { Camera, PlusCircle, Trash2, Upload, MapPin } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Mountains',
    location: '',
    imageUrl: '',
    description: ''
  });

  const categories = ['All', 'Mountains', 'Beaches', 'Adventure', 'Hotels', 'Road Trips', 'Culture', 'Honeymoon'];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const res = await galleryApi.getAll(params);
      if (res.success && res.data) {
        setPhotos(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file);
      setForm(prev => ({ ...prev, imageUrl: dataUri }));
      toast.success('Gallery photo loaded from your device!');
    } catch (err) {
      toast.error(err.message || 'Failed to process image');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      toast.error('Title and Image are required.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await galleryApi.create(form);
      if (res.success) {
        toast.success('Photo added to gallery!');
        setIsModalOpen(false);
        setForm({ title: '', category: 'Mountains', location: '', imageUrl: '', description: '' });
        fetchGallery();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add photo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete photo "${title}"?`)) {
      try {
        const res = await galleryApi.delete(id);
        if (res.success) {
          toast.success('Photo deleted');
          setPhotos(prev => prev.filter(p => p._id !== id));
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Gallery CMS</h1>
          <p className="text-xs text-slate-500">Curate scenic photography across vacation categories.</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <PlusCircle className="w-4 h-4 mr-1.5" /> Add New Photo
        </Button>
      </div>

      {/* Category Filter - Hidden scrollbar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <Loader text="Loading gallery..." />
      ) : photos.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="No photos found"
          description="Upload vacation photos to inspire travelers."
          actionLabel="Add Photo"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((p) => (
            <div
              key={p._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'}
                  alt={p.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-navy-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {p.category}
                </span>
                <button
                  onClick={() => handleDelete(p._id, p.title)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-navy-900 line-clamp-1">{p.title}</h4>
                {p.location && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-600" /> {p.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Photo to Gallery">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g. Solang Valley Snowy Slopes"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Location / State</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Manali, Himachal"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Image URL or Local Upload *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                required
                placeholder="https://images.unsplash.com/... or click Upload"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
              <label
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer shrink-0 transition-colors ${
                  uploading
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-brand-50 hover:bg-brand-100 text-brand-700 border-brand-200'
                }`}
              >
                <Upload className={`w-4 h-4 ${uploading ? 'animate-bounce' : ''}`} />
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Live Image Preview */}
            {form.imageUrl && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-36 w-full flex items-center justify-center group">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                    className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-rose-700"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Add Photo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Gallery;
