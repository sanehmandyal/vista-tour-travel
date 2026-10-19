import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { destinationApi, getExactDestinationImages } from '../../services/destinationApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { ArrowLeft, Upload, Save, Sparkles, MapPin, Image as ImageIcon, Plus, Trash2, Camera, Compass } from 'lucide-react';
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
    state: 'Haryana',
    region: 'North India',
    startingPrice: 1999,
    shortDescription: '',
    description: '',
    heroImage: '',
    gallery: [],
    attractions: [],
    thingsToDo: [],
    travelTips: [],
    bestTimeToVisit: 'September to March',
    featured: false,
    status: 'active'
  });

  const [newAttraction, setNewAttraction] = useState({ title: '', description: '', image: '' });
  const [newThing, setNewThing] = useState({ title: '', description: '', icon: 'Compass' });
  const [newTip, setNewTip] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchDest = async () => {
        try {
          const res = await destinationApi.getById(id);
          if (res.success && res.data) {
            const current = res.data;
            setFormData({
              name: current.name || '',
              state: current.state || 'Haryana',
              region: current.region || 'North India',
              startingPrice: current.startingPrice || 1999,
              shortDescription: current.shortDescription || '',
              description: current.description || '',
              heroImage: current.heroImage || current.featuredImage || '',
              gallery: Array.isArray(current.gallery) && current.gallery.length > 0 ? current.gallery : (current.heroImage ? [current.heroImage] : []),
              attractions: Array.isArray(current.attractions) ? current.attractions : [],
              thingsToDo: Array.isArray(current.thingsToDo) ? current.thingsToDo : [],
              travelTips: Array.isArray(current.travelTips) ? current.travelTips : [],
              bestTimeToVisit: current.bestTimeToVisit || 'September to March',
              featured: Boolean(current.featured || current.isFeatured),
              status: current.status || 'active'
            });
          } else {
            toast.error('Destination details not found');
          }
        } catch (err) {
          toast.error('Failed to load destination');
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
      setFormData(prev => ({
        ...prev,
        heroImage: dataUri,
        gallery: prev.gallery.length === 0 ? [dataUri] : prev.gallery
      }));
      toast.success('Photo loaded successfully from device!');
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
      const processed = [];
      for (const file of files) {
        const uri = await processDeviceImage(file);
        processed.push(uri);
      }
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...processed]
      }));
      toast.success(`${processed.length} gallery photo(s) added from device!`);
    } catch (err) {
      toast.error(err.message || 'Gallery image processing failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl('');
    toast.success('Gallery photo URL added!');
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index)
    }));
  };

  const handleAttractionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file, 800, 600, 0.85);
      setNewAttraction(prev => ({ ...prev, image: dataUri }));
      toast.success('Attraction photo uploaded!');
    } catch (err) {
      toast.error(err.message || 'Attraction photo upload failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddAttraction = () => {
    if (!newAttraction.title.trim()) {
      toast.error('Attraction title is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      attractions: [...prev.attractions, { ...newAttraction }]
    }));
    setNewAttraction({ title: '', description: '', image: '' });
    toast.success('Attraction added!');
  };

  const handleRemoveAttraction = (index) => {
    setFormData(prev => ({
      ...prev,
      attractions: prev.attractions.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddThing = () => {
    if (!newThing.title.trim()) {
      toast.error('Activity title is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      thingsToDo: [...prev.thingsToDo, { ...newThing }]
    }));
    setNewThing({ title: '', description: '', icon: 'Compass' });
    toast.success('Experience activity added!');
  };

  const handleRemoveThing = (index) => {
    setFormData(prev => ({
      ...prev,
      thingsToDo: prev.thingsToDo.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddTip = () => {
    if (!newTip.trim()) return;
    setFormData(prev => ({
      ...prev,
      travelTips: [...prev.travelTips, newTip.trim()]
    }));
    setNewTip('');
  };

  const handleRemoveTip = (index) => {
    setFormData(prev => ({
      ...prev,
      travelTips: prev.travelTips.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter a destination name');
      return;
    }

    try {
      setLoading(true);

      // Auto-assign authentic image if left empty
      const exact = getExactDestinationImages(formData.name);
      const finalImage = formData.heroImage.trim() || exact.heroImage;
      const galleryList = Array.isArray(formData.gallery) && formData.gallery.length > 0
        ? formData.gallery
        : [finalImage];

      const payload = {
        ...formData,
        region: formData.region || 'North India',
        startingPrice: Number(formData.startingPrice) || 1999,
        bestTimeToVisit: formData.bestTimeToVisit || 'September to March',
        heroImage: finalImage,
        featuredImage: finalImage,
        images: galleryList,
        gallery: galleryList,
        attractions: formData.attractions,
        thingsToDo: formData.thingsToDo,
        travelTips: formData.travelTips,
        shortDescription: formData.shortDescription.trim() || `${formData.name} tour and 24/7 commercial cab packages from Ladwa & Kurukshetra, Haryana.`,
        description: formData.description.trim() || `Explore ${formData.name} in comfortable sanitized cabs with verified professional chauffeurs from Vista Tour and Travels.`,
        state: formData.state.trim() || 'Haryana'
      };

      if (isEdit) {
        await destinationApi.update(id, payload);
        toast.success(`"${formData.name}" updated successfully!`);
      } else {
        await destinationApi.create(payload);
        toast.success(`"${formData.name}" created successfully and is live on site!`);
      }
      navigate('/admin/destinations');
    } catch (err) {
      toast.error(err.message || 'Could not save destination');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader text="Loading destination details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/destinations')}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          title="Back to Destinations"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            {isEdit ? `Edit Destination: ${formData.name}` : 'Add New Destination'}
          </h1>
          <p className="text-xs text-slate-500">
            Fill in basic details to publish or update this destination on the website.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6">
        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Destination Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Kurukshetra, Ambala, Delhi, Karnal"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-semibold text-navy-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">State / Territory</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Haryana, Delhi NCR, Chandigarh"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Short Summary / Tagline
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="e.g. Brahma Sarovar, Jyotisar & Mahabharata heritage tours with luxury cabs"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Detailed Description / About This Destination
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Share what makes this destination special, key sights, temple circuits, or pickup info..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:border-brand-500 font-normal leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Starting Cab / Package Fare (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 1999"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-semibold text-navy-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Geographical Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-medium"
            >
              <option value="North India">North India (Haryana, Delhi NCR, Punjab, Chandigarh)</option>
              <option value="Himalayas">Himalayas & Foothills</option>
              <option value="South India">South India</option>
              <option value="West India">West India</option>
              <option value="East India">East India</option>
              <option value="Central India">Central India</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Best Time to Visit</label>
            <input
              type="text"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleChange}
              placeholder="e.g. September to March, or All year round"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-semibold"
            >
              <option value="active">Active (Visible on Website)</option>
              <option value="inactive">Draft / Hidden</option>
            </select>
          </div>
        </div>

        {/* Photo Upload & Preview */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Destination Photo</span>
            <span className="text-[11px] text-slate-400 font-normal">Optional (Auto-assigns authentic regional image if blank)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {formData.heroImage ? (
              <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                <img
                  src={formData.heroImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
                  className="absolute top-1 right-1 bg-navy-950/80 text-white rounded-full p-1 text-[10px] hover:bg-rose-600 transition-colors"
                  title="Remove Image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-36 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 bg-white">
                <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                <span className="text-[10px] font-bold">No Photo</span>
              </div>
            )}

            <div className="flex-1 space-y-2 w-full">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-brand-500 text-navy-900 font-bold text-xs shadow-xs cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-brand-600" />
                <span>{uploading ? 'Processing Image...' : 'Upload Photo from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <div className="text-[11px] text-slate-500">
                Or paste an image web link:
              </div>
              <input
                type="url"
                name="heroImage"
                value={formData.heroImage}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-brand-500 font-medium bg-white"
              />
            </div>
          </div>
        </div>

        {/* 2. Multi-Photo Gallery Manager */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-brand-600" /> Photo Gallery ({formData.gallery.length} Images)
              </h3>
              <p className="text-[11px] text-slate-400">Add multiple high-resolution photos displayed in the destination gallery.</p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs cursor-pointer transition-colors border border-brand-200">
              <Upload className="w-3 h-3" /> Upload Device Photos
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={newGalleryUrl}
              onChange={(e) => setNewGalleryUrl(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddGalleryUrl}
              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Add URL
            </button>
          </div>

          {formData.gallery.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {formData.gallery.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-slate-200 border border-slate-200 shadow-xs">
                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Must-Visit Attractions Builder */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" /> Must-Visit Attractions ({formData.attractions.length})
            </h3>
            <p className="text-[11px] text-slate-400">Key monuments, sacred tirthas, or sightseeing landmarks.</p>
          </div>

          {formData.attractions.length > 0 && (
            <div className="space-y-2">
              {formData.attractions.map((attr, idx) => {
                const title = typeof attr === 'string' ? attr : attr.title;
                const desc = typeof attr === 'string' ? '' : attr.description;
                const img = typeof attr === 'object' ? attr.image : '';

                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {img && (
                        <img src={img} alt={title} className="w-12 h-10 rounded-lg object-cover border border-slate-100 shrink-0" />
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-navy-900 truncate">{title}</p>
                        {desc && <p className="text-[11px] text-slate-500 truncate">{desc}</p>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttraction(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Attraction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-600 block">Add New Attraction</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Attraction Title (e.g. Brahma Sarovar)"
                value={newAttraction.title}
                onChange={(e) => setNewAttraction(prev => ({ ...prev, title: e.target.value }))}
                className="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500"
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newAttraction.description}
                onChange={(e) => setNewAttraction(prev => ({ ...prev, description: e.target.value }))}
                className="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                <Upload className="w-3 h-3 text-brand-600" /> Photo from Device
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAttractionImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {newAttraction.image && (
                <img src={newAttraction.image} alt="Preview" className="w-8 h-8 rounded-md object-cover border border-slate-200" />
              )}
              <input
                type="url"
                placeholder="Or Image URL"
                value={newAttraction.image}
                onChange={(e) => setNewAttraction(prev => ({ ...prev, image: e.target.value }))}
                className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddAttraction}
                className="px-4 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shrink-0"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* 4. Top Experiences & Activities */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Highlights & Activities ({formData.thingsToDo.length})
            </h3>
            <p className="text-[11px] text-slate-400">Special curated experiences for visitors.</p>
          </div>

          {formData.thingsToDo.length > 0 && (
            <div className="space-y-2">
              {formData.thingsToDo.map((thing, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 gap-3">
                  <div>
                    <p className="text-xs font-bold text-navy-900">{thing.title}</p>
                    <p className="text-[11px] text-slate-500">{thing.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveThing(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Activity Title (e.g. Evening Aarti & Light Show)"
              value={newThing.title}
              onChange={(e) => setNewThing(prev => ({ ...prev, title: e.target.value }))}
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newThing.description}
              onChange={(e) => setNewThing(prev => ({ ...prev, description: e.target.value }))}
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddThing}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shrink-0"
            >
              Add Activity
            </button>
          </div>
        </div>

        {/* 5. Driver Travel Tips */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-brand-600" /> Local Travel Tips ({formData.travelTips.length})
            </h3>
            <p className="text-[11px] text-slate-400">Helpful local advice from chauffeurs and guides.</p>
          </div>

          {formData.travelTips.length > 0 && (
            <div className="space-y-1.5">
              {formData.travelTips.map((tip, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                  <span>• {tip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTip(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Best photographed during early morning sunrise."
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddTip}
              className="px-3.5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shrink-0"
            >
              Add Tip
            </button>
          </div>
        </div>

        {/* Featured Switch */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
          />
          <label htmlFor="featured" className="text-xs font-bold text-navy-900 cursor-pointer">
            Feature this destination prominently on the homepage
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/destinations')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="px-6 font-bold shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEdit ? 'Save Changes' : 'Publish Destination'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;
