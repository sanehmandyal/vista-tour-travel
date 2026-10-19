import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import { destinationApi } from '../../services/destinationApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { ArrowLeft, Upload, Save, Sparkles, Image as ImageIcon, MapPin } from 'lucide-react';
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

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    destinationName: '',
    category: 'Spiritual & Heritage',
    duration: '2 Days / 1 Night',
    description: '',
    inclusions: 'Sanitized AC Cab, Verified Polite Chauffeur, Sightseeing, All Tolls & State Taxes Included',
    featuredImage: '',
    featured: false,
    status: 'published'
  });

  useEffect(() => {
    const fetchDests = async () => {
      try {
        const res = await destinationApi.getAll({ limit: 100 });
        if (res.success && res.data) {
          setDestinations(res.data);
          if (!formData.destination && res.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              destination: res.data[0].slug || res.data[0]._id,
              destinationName: res.data[0].name
            }));
          }
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
              destination: p.destination?._id || p.destination || p.destinationSlug || '',
              destinationName: p.destinationName || p.destination?.name || '',
              category: p.category || 'Spiritual & Heritage',
              duration: p.duration || '2 Days / 1 Night',
              description: p.description || '',
              inclusions: Array.isArray(p.inclusions) ? p.inclusions.join(', ') : p.inclusions || '',
              featuredImage: p.featuredImage || '',
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
        destination: value,
        destinationName: matched ? matched.name : value
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
      setFormData(prev => ({ ...prev, featuredImage: dataUri }));
      toast.success('Package image loaded from device!');
    } catch (err) {
      toast.error(err.message || 'Image processing failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
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

      const payload = {
        ...formData,
        featuredImage: finalImage,
        images: [finalImage],
        inclusions: inclusionsArray.length > 0 ? inclusionsArray : ['Sanitized AC Cab', 'Professional Driver', 'Customized Itinerary'],
        description: formData.description.trim() || `Enjoy our customized ${formData.title} tour across Haryana, Delhi NCR and Chandigarh with Vista Tour and Travels.`,
        price: 0,
        discountedPrice: 0
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
            <label className="text-xs font-bold text-slate-700 block mb-1">Destination Area</label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-medium"
            >
              {destinations.map(d => (
                <option key={d._id || d.slug} value={d.slug || d._id}>
                  {d.name} ({d.state})
                </option>
              ))}
              <option value="Haryana & NCR">Haryana & Delhi NCR (Multi-City)</option>
              <option value="Chandigarh">Chandigarh & Shivalik</option>
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
              <option value="Spiritual & Heritage">Spiritual & Heritage</option>
              <option value="Family Trips">Family Trips</option>
              <option value="Weekend Getaways">Weekend Getaways</option>
              <option value="Sightseeing & Day Tours">Sightseeing & Day Tours</option>
              <option value="Wildlife & Nature">Wildlife & Nature (Kalesar)</option>
              <option value="Luxury Cab Tour">Luxury Cab Tour</option>
              <option value="Custom Group Tour">Custom Group Tour</option>
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
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-brand-500 font-medium bg-white"
              />
            </div>
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
