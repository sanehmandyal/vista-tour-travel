import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { destinationApi } from '../../services/destinationApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { ArrowLeft, Upload, Save, Sparkles, Plus, Trash2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const DestinationForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    state: 'Himachal Pradesh',
    country: 'India',
    region: 'Himalayas',
    shortDescription: '',
    description: '',
    heroImage: '',
    gallery: [],
    attractions: [],
    thingsToDo: [],
    bestTimeToVisit: '',
    startingPrice: '',
    featured: false,
    status: 'active'
  });

  const [newAttraction, setNewAttraction] = useState({ title: '', description: '', image: '' });
  const [newThing, setNewThing] = useState({ title: '', description: '', icon: 'Compass' });
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchDest = async () => {
        try {
          let current = null;
          try {
            const res = await destinationApi.getById(id);
            if (res.success && res.data) {
              current = res.data;
            }
          } catch {
            // fallback
          }

          if (!current) {
            const listRes = await destinationApi.getAll({ limit: 100 });
            if (listRes.success && listRes.data) {
              current = listRes.data.find(d => d._id === id);
            }
          }

          if (current) {
            setFormData({
              name: current.name || '',
              state: current.state || 'Himachal Pradesh',
              country: current.country || 'India',
              region: current.region || 'Himalayas',
              shortDescription: current.shortDescription || '',
              description: current.description || '',
              heroImage: current.heroImage || '',
              gallery: Array.isArray(current.gallery) ? current.gallery : [],
              attractions: Array.isArray(current.attractions) ? current.attractions : [],
              thingsToDo: Array.isArray(current.thingsToDo) ? current.thingsToDo : [],
              bestTimeToVisit: current.bestTimeToVisit || '',
              startingPrice: current.startingPrice || '',
              featured: Boolean(current.featured),
              status: current.status || 'active'
            });
          } else {
            toast.error('Could not find destination details');
          }
        } catch (err) {
          toast.error('Failed to load destination data');
        } finally {
          setFetching(false);
        }
      };
      fetchDest();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleHeroFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file);
      setFormData(prev => ({ ...prev, heroImage: dataUri }));
      toast.success('Hero photo loaded from your device!');
    } catch (err) {
      toast.error(err.message || 'Image processing failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleGalleryFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const newUris = [];
      for (const file of files) {
        const uri = await processDeviceImage(file);
        newUris.push(uri);
      }
      setFormData(prev => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...newUris]
      }));
      toast.success(`${newUris.length} gallery photo(s) added from device!`);
    } catch (err) {
      toast.error(err.message || 'Failed to process gallery images');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const addGalleryByUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), galleryUrlInput.trim()]
    }));
    setGalleryUrlInput('');
    toast.success('Image URL added to gallery!');
  };

  const removeGalleryImage = (idxToRemove) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== idxToRemove)
    }));
  };

  const handleAttractionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file);
      setNewAttraction(prev => ({ ...prev, image: dataUri }));
      toast.success('Attraction photo loaded!');
    } catch (err) {
      toast.error(err.message || 'Failed to process attraction image');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const addAttraction = () => {
    if (!newAttraction.title.trim()) {
      toast.error('Attraction title is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      attractions: [...(prev.attractions || []), { ...newAttraction }]
    }));
    setNewAttraction({ title: '', description: '', image: '' });
    toast.success('Attraction added!');
  };

  const removeAttraction = (idx) => {
    setFormData(prev => ({
      ...prev,
      attractions: prev.attractions.filter((_, i) => i !== idx)
    }));
  };

  const addThingToDo = () => {
    if (!newThing.title.trim()) {
      toast.error('Activity title is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      thingsToDo: [...(prev.thingsToDo || []), { ...newThing }]
    }));
    setNewThing({ title: '', description: '', icon: 'Compass' });
    toast.success('Activity added!');
  };

  const removeThingToDo = (idx) => {
    setFormData(prev => ({
      ...prev,
      thingsToDo: prev.thingsToDo.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.state || !formData.heroImage || !formData.startingPrice) {
      toast.error('Please complete all mandatory fields (*)');
      return;
    }

    try {
      setLoading(true);
      const cleanPrice = Number(String(formData.startingPrice).replace(/[^0-9.]/g, '')) || 0;
      const payload = {
        ...formData,
        startingPrice: cleanPrice
      };
      if (isEdit) {
        await destinationApi.update(id, payload);
        toast.success('Destination updated successfully!');
      } else {
        await destinationApi.create(payload);
        toast.success('Destination created successfully!');
      }
      navigate('/admin/destinations');
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader text="Loading destination details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/destinations')}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            {isEdit ? 'Edit Destination' : 'Create New Destination'}
          </h1>
          <p className="text-xs text-slate-500">Configure destination details, photos from device, and highlights.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Destination Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Manali & Solang Valley"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="Himachal Pradesh"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Region *</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
            >
              <option value="Himalayas">Himalayas (Himachal Pradesh)</option>
              <option value="North India">North India</option>
              <option value="South India">South India</option>
              <option value="West India">West India</option>
              <option value="East India">East India</option>
              <option value="Central India">Central India</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Starting Tour Price (₹) *</label>
            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              required
              placeholder="e.g. 5999"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Best Time to Visit *</label>
            <input
              type="text"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleChange}
              required
              placeholder="e.g. Throughout the year (Snow: Dec-Feb)"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Visibility Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
            >
              <option value="active">Active (Visible on Website)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-brand-600" /> Main Destination Hero Photo *
            </label>
            {formData.heroImage && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Photo Attached
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="heroImage"
              value={formData.heroImage}
              onChange={handleChange}
              required
              placeholder="Paste Image URL or click Upload from Device →"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white focus:outline-none focus:border-brand-500 font-mono text-xs"
            />
            <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold cursor-pointer shrink-0 shadow-sm transition-all">
              <Upload className="w-4 h-4" /> {uploading ? 'Processing...' : 'Upload from Device'}
              <input type="file" accept="image/*" onChange={handleHeroFileUpload} className="hidden" />
            </label>
          </div>

          {formData.heroImage && (
            <div className="relative mt-2 h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
                className="absolute top-3 right-3 p-2 rounded-xl bg-red-600/90 text-white hover:bg-red-700 shadow-md transition-all flex items-center gap-1 text-xs font-bold"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          )}
        </div>

        {/* Gallery Photos Section */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" /> Destination Gallery Photos ({formData.gallery?.length || 0})
            </label>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-sm transition-all">
              <Upload className="w-3.5 h-3.5" /> Add Photos from Device
              <input type="file" accept="image/*" multiple onChange={handleGalleryFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={galleryUrlInput}
              onChange={(e) => setGalleryUrlInput(e.target.value)}
              placeholder="Or paste image URL and click Add →"
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2 bg-white focus:outline-none focus:border-brand-500 font-mono"
            />
            <button
              type="button"
              onClick={addGalleryByUrl}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 shrink-0"
            >
              Add URL
            </button>
          </div>

          {formData.gallery && formData.gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {formData.gallery.map((imgUrl, idx) => (
                <div key={idx} className="relative h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-all opacity-90 group-hover:opacity-100"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Short summary */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Short Summary (Shown on Destination Cards) *</label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            placeholder="One-line summary for travelers..."
            className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Full description */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Full Detailed Overview *</label>
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Comprehensive description of the destination, climate, history, and hill experiences..."
            className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Attractions Section */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
          <label className="text-xs font-bold text-slate-800 block">Top Attractions & Sightseeing Spots ({formData.attractions?.length || 0})</label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newAttraction.title}
              onChange={(e) => setNewAttraction(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Attraction Title (e.g. Rohtang Pass)"
              className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white"
            />
            <input
              type="text"
              value={newAttraction.description}
              onChange={(e) => setNewAttraction(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description..."
              className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white"
            />
            <div className="flex gap-2">
              <label className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" /> Photo
                <input type="file" accept="image/*" onChange={handleAttractionImageUpload} className="hidden" />
              </label>
              <button
                type="button"
                onClick={addAttraction}
                className="flex-1 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Spot
              </button>
            </div>
          </div>

          {newAttraction.image && (
            <div className="h-16 w-24 rounded-lg overflow-hidden border border-slate-200">
              <img src={newAttraction.image} alt="Attraction preview" className="w-full h-full object-cover" />
            </div>
          )}

          {formData.attractions && formData.attractions.length > 0 && (
            <div className="space-y-2 pt-2">
              {formData.attractions.map((att, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    {att.image ? (
                      <img src={att.image} alt={att.title} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-800">{att.title}</p>
                      {att.description && <p className="text-[11px] text-slate-500">{att.description}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttraction(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="featured" className="text-xs font-bold text-navy-900 cursor-pointer flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Feature this destination on Homepage
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/destinations')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save className="w-4 h-4 mr-1.5" /> {isEdit ? 'Save Changes' : 'Create Destination'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;

