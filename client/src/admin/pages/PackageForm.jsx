import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import { destinationApi } from '../../services/destinationApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { ArrowLeft, Upload, Save, Sparkles, Image as ImageIcon, MapPin, Plus, Trash2, Camera, Calendar, Check, X } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const PackageForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const VALID_CATEGORIES = ['Cultural', 'Weekend Getaways', 'Family Trips', 'Road Trips', 'Adventure', 'Group Tours', 'Luxury Travel', 'Honeymoon'];

  const mapCategory = (cat) => {
    if (VALID_CATEGORIES.includes(cat)) return cat;
    if (!cat) return 'Cultural';
    const c = cat.toLowerCase();
    if (c.includes('spirit') || c.includes('herit') || c.includes('cultur') || c.includes('temple')) return 'Cultural';
    if (c.includes('advent') || c.includes('wild') || c.includes('nature') || c.includes('safari')) return 'Adventure';
    if (c.includes('road') || c.includes('airport') || c.includes('cab') || c.includes('ncr') || c.includes('delhi')) return 'Road Trips';
    if (c.includes('weekend') || c.includes('escape') || c.includes('day')) return 'Weekend Getaways';
    if (c.includes('group') || c.includes('tempo') || c.includes('custom') || c.includes('grand')) return 'Group Tours';
    if (c.includes('luxur') || c.includes('vip')) return 'Luxury Travel';
    if (c.includes('honey')) return 'Honeymoon';
    return 'Family Trips';
  };

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    destinationName: '',
    category: 'Cultural',
    duration: '2 Days / 1 Night',
    price: 3499,
    discountedPrice: 2999,
    description: '',
    inclusions: 'Sanitized AC Cab, Verified Polite Chauffeur, Sightseeing, All Tolls & State Taxes Included',
    exclusions: 'Monument Entry Tickets, Personal Expenses, Flights/Trains',
    hotels: '3/4-Star Verified Deluxe Hotels & Resorts',
    transport: 'Private Sanitized AC Sedan / SUV / Tempo Traveller',
    featuredImage: '',
    images: [],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Iconic Sightseeing Tour',
        description: 'Doorstep cab pickup, check-in, visit major monuments and cultural heritage spots.',
        meals: 'Breakfast included',
        hotel: 'Deluxe Hotel'
      }
    ],
    featured: false,
    status: 'published'
  });

  useEffect(() => {
    const fetchDests = async () => {
      try {
        const res = await destinationApi.getAll({ limit: 100 });
        if (res.success && res.data && res.data.length > 0) {
          setDestinations(res.data);
          setFormData(prev => {
            if (prev.destination) return prev;
            return {
              ...prev,
              destination: res.data[0]._id,
              destinationName: res.data[0].name
            };
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDests();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchPkg = async () => {
        try {
          const res = await packageApi.getBySlug(id);
          if (res.success && res.data) {
            const p = res.data;
            setFormData({
              title: p.title || '',
              destination: p.destination?._id || p.destination || '',
              destinationName: p.destinationName || p.destination?.name || '',
              category: mapCategory(p.category),
              duration: p.duration || '2 Days / 1 Night',
              price: p.price || 3499,
              discountedPrice: p.discountedPrice || 2999,
              description: p.description || '',
              inclusions: Array.isArray(p.inclusions) ? p.inclusions.join(', ') : p.inclusions || '',
              exclusions: Array.isArray(p.exclusions) ? p.exclusions.join(', ') : p.exclusions || 'Monument Entry Tickets, Personal Expenses, Flights/Trains',
              hotels: p.hotels || '3/4-Star Verified Deluxe Hotels & Resorts',
              transport: p.transport || 'Private Sanitized AC Sedan / SUV / Tempo Traveller',
              featuredImage: p.featuredImage || '',
              images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.featuredImage ? [p.featuredImage] : []),
              itinerary: Array.isArray(p.itinerary) && p.itinerary.length > 0 ? p.itinerary : [
                {
                  day: 1,
                  title: 'Day 1: Arrival & Iconic Sightseeing Tour',
                  description: 'Doorstep cab pickup, check-in, visit major monuments and cultural heritage spots.',
                  meals: 'Breakfast included',
                  hotel: 'Deluxe Hotel'
                }
              ],
              featured: Boolean(p.featured),
              status: p.status || 'published'
            });
          }
        } catch (err) {
          toast.error('Failed to load package details');
        } finally {
          setFetching(false);
        }
      };
      fetchPkg();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'destination') {
      const matched = destinations.find(d => d._id === value || d.slug === value);
      setFormData(prev => ({
        ...prev,
        destination: matched ? matched._id : value,
        destinationName: matched ? matched.name : prev.destinationName
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file);
      setFormData(prev => ({
        ...prev,
        featuredImage: dataUri,
        images: prev.images.length === 0 ? [dataUri] : prev.images
      }));
      toast.success('Package banner image loaded from device!');
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
        images: [...prev.images, ...processed]
      }));
      toast.success(`${processed.length} package gallery image(s) uploaded!`);
    } catch (err) {
      toast.error(err.message || 'Gallery upload failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: nextDay,
          title: `Day ${nextDay}: Sightseeing & Excursions`,
          description: 'Explore scenic destinations, photography stops, and regional attractions.',
          meals: 'Breakfast included',
          hotel: '3/4-Star Deluxe Hotel'
        }
      ]
    }));
  };

  const handleUpdateDay = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const handleRemoveDay = (index) => {
    if (formData.itinerary.length <= 1) {
      toast.error('Tour package must have at least 1 day in itinerary');
      return;
    }
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, idx) => idx !== index).map((d, i) => ({ ...d, day: i + 1 }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a tour package title');
      return;
    }

    try {
      setLoading(true);

      const finalImage = formData.featuredImage.trim() || '/assets/images/hero-haryana-kurukshetra.jpg';
      const inclusionsArray = typeof formData.inclusions === 'string'
        ? formData.inclusions.split(',').map(s => s.trim()).filter(Boolean)
        : formData.inclusions;
      const exclusionsArray = typeof formData.exclusions === 'string'
        ? formData.exclusions.split(',').map(s => s.trim()).filter(Boolean)
        : formData.exclusions;

      const galleryList = Array.isArray(formData.images) && formData.images.length > 0
        ? formData.images
        : [finalImage];

      // Ensure valid destination ObjectId
      let targetDestId = formData.destination;
      const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(String(str));
      if (!isObjectId(targetDestId)) {
        const found = destinations.find(d => d._id === targetDestId || d.slug === targetDestId || d.name === formData.destinationName);
        targetDestId = found?._id || destinations[0]?._id;
      }

      const matchedDest = destinations.find(d => d._id === targetDestId);

      const payload = {
        ...formData,
        destination: targetDestId,
        destinationName: matchedDest?.name || formData.destinationName,
        destinationSlug: matchedDest?.slug || '',
        category: mapCategory(formData.category),
        featuredImage: finalImage,
        images: galleryList,
        price: Number(formData.price) || 3499,
        discountedPrice: Number(formData.discountedPrice) || Number(formData.price) || 2999,
        duration: formData.duration || '2 Days / 1 Night',
        itinerary: formData.itinerary && formData.itinerary.length > 0 ? formData.itinerary : [
          {
            day: 1,
            title: `Day 1: ${formData.title} Departure & Sightseeing`,
            description: formData.description.trim() || `Comfortable chauffeur pickup, scenic road journey, key monument exploration, and check-in assistance.`,
            meals: 'Breakfast included',
            hotel: '3/4-Star Verified Hotel or Resort'
          }
        ],
        inclusions: inclusionsArray.length > 0 ? inclusionsArray : ['Sanitized AC Cab', 'Professional Driver', 'Customized Itinerary'],
        exclusions: exclusionsArray.length > 0 ? exclusionsArray : ['Monument Entry Tickets', 'Personal Expenses'],
        hotels: formData.hotels || '3/4-Star Verified Deluxe Hotels',
        transport: formData.transport || 'Private Sanitized AC Cab',
        description: formData.description.trim() || `Enjoy our customized ${formData.title} tour across Haryana, Delhi NCR and Chandigarh with Vista Tour and Travels.`
      };

      if (isEdit) {
        await packageApi.update(id, payload);
        toast.success(`"${formData.title}" updated successfully!`);
      } else {
        await packageApi.create(payload);
        toast.success(`"${formData.title}" created successfully and is live on site!`);
      }
      navigate('/admin/packages');
    } catch (err) {
      toast.error(err.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loader text="Loading package details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/packages')}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          title="Back to Tour Packages"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            {isEdit ? `Edit Tour Package: ${formData.title}` : 'Add New Tour Package'}
          </h1>
          <p className="text-xs text-slate-500">
            Fill in basic details to publish or update this holiday itinerary on the website.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Package Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Kurukshetra Mahabharata Spiritual Tour"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-semibold text-navy-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Destination Area <span className="text-rose-500">*</span>
            </label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-semibold text-navy-900"
            >
              {destinations.map(d => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.state || 'North India'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Travel Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-medium"
            >
              <option value="Cultural">Spiritual, Temple & Heritage Yatra (Kurukshetra, Pehowa)</option>
              <option value="Weekend Getaways">Weekend Getaway & City Break (Chandigarh, Karnal)</option>
              <option value="Family Trips">Family Holiday & Sightseeing Tour</option>
              <option value="Road Trips">Delhi NCR, Highway & Airport Express Cab</option>
              <option value="Adventure">Wildlife Safari & Nature Eco-Tour (Kalesar)</option>
              <option value="Group Tours">Group Yatra & Tempo Traveller Tour</option>
              <option value="Luxury Travel">Luxury Chauffeur & VIP Cruiser Tour</option>
              <option value="Honeymoon">Honeymoon & Scenic Getaway</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 2 Days / 1 Night, Full Day, 3 Days / 2 Nights"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Package Fare (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 3499"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-semibold text-navy-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Discounted / Offer Fare (₹)</label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 2999"
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
              <option value="published">Published (Visible on Website)</option>
              <option value="draft">Draft / Hidden</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tour Overview & Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what travelers will experience, holy tirthas visited, scenic stops, and highlights..."
              className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:border-brand-500 font-normal leading-relaxed"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Inclusions & Highlights (comma separated)
            </label>
            <input
              type="text"
              name="inclusions"
              value={formData.inclusions}
              onChange={handleChange}
              placeholder="e.g. Sanitized AC Cab, Verified Chauffeur, Sightseeing, All Tolls & State Taxes"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Exclusions (What is not included, comma separated)
            </label>
            <input
              type="text"
              name="exclusions"
              value={formData.exclusions}
              onChange={handleChange}
              placeholder="e.g. Monument Entry Tickets, Personal Expenses, Lunch/Dinner, Train/Flight Fare"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Hotel Accommodation Standard</label>
            <input
              type="text"
              name="hotels"
              value={formData.hotels}
              onChange={handleChange}
              placeholder="e.g. 3/4-Star Verified Deluxe Hotels & Resorts"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Transport Vehicle Specification</label>
            <input
              type="text"
              name="transport"
              value={formData.transport}
              onChange={handleChange}
              placeholder="e.g. Private Sanitized AC Sedan / SUV / Tempo Traveller"
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>
        </div>

        {/* Package Photo Upload & Preview */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Tour Package Banner Image</span>
            <span className="text-[11px] text-slate-400 font-normal">Optional (Auto-assigns authentic regional image if blank)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {formData.featuredImage ? (
              <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
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
                <span>{uploading ? 'Processing Image...' : 'Upload Image from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <div className="text-[11px] text-slate-500">
                Or paste image web link:
              </div>
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-1.5 focus:outline-none focus:border-brand-500 font-medium bg-white"
              />
            </div>
          </div>
        </div>

        {/* Multi-Photo Tour Gallery */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-brand-600" /> Package Gallery ({formData.images.length} Photos)
              </h3>
              <p className="text-[11px] text-slate-400">Upload multiple photos for package showcase gallery.</p>
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

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {formData.images.map((imgUrl, idx) => (
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

        {/* Day-by-Day Itinerary Builder */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" /> Day-by-Day Tour Itinerary ({formData.itinerary.length} Days)
              </h3>
              <p className="text-[11px] text-slate-400">Define the day-by-day travel plan, route, meals, and accommodations.</p>
            </div>
            <button
              type="button"
              onClick={handleAddDay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Day
            </button>
          </div>

          <div className="space-y-4">
            {formData.itinerary.map((dayItem, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-black text-xs flex items-center justify-center">
                      {dayItem.day || idx + 1}
                    </span>
                    <span className="text-xs font-bold text-navy-900">Day {dayItem.day || idx + 1} Itinerary</span>
                  </div>
                  {formData.itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(idx)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Day
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Day Title / Main Highlights</label>
                    <input
                      type="text"
                      value={dayItem.title}
                      onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)}
                      placeholder="e.g. Day 1: Kurukshetra Arrival & Brahma Sarovar Aarti"
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Day Description & Sightseeing Plan</label>
                    <textarea
                      rows={2}
                      value={dayItem.description}
                      onChange={(e) => handleUpdateDay(idx, 'description', e.target.value)}
                      placeholder="Morning pickup from railway station, drive to hotel, evening visit to Jyotisar..."
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:border-brand-500 font-normal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Meals Provided</label>
                    <input
                      type="text"
                      value={dayItem.meals}
                      onChange={(e) => handleUpdateDay(idx, 'meals', e.target.value)}
                      placeholder="e.g. Breakfast included"
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Stay / Accommodation</label>
                    <input
                      type="text"
                      value={dayItem.hotel}
                      onChange={(e) => handleUpdateDay(idx, 'hotel', e.target.value)}
                      placeholder="e.g. 3-Star Deluxe Hotel in Kurukshetra"
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
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
            Feature this package on the homepage showcase
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/packages')}
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
            <span>{isEdit ? 'Save Changes' : 'Publish Tour Package'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;
