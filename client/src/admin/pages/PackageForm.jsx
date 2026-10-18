import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import { destinationApi } from '../../services/destinationApi';
import { adminApi } from '../../services/adminApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { ArrowLeft, Upload, Save, Plus, Trash2, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export const PackageForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    category: 'Family Trips',
    duration: '5 Days / 4 Nights',
    daysCount: 5,
    nightsCount: 4,
    price: '',
    discountedPrice: '',
    featuredImage: '',
    description: '',
    inclusions: '4-Star Resort Stay, Daily Breakfast & Dinner, Private Sanitized Cab, Sightseeing Tours',
    exclusions: 'Airfare, Personal Expenses, Adventure activity fees',
    hotels: 'Verified 3-Star & 4-Star Resort Stays with mountain/valley views',
    transport: 'Private Chauffeur AC Sedan / SUV for transfers and tours',
    featured: false,
    status: 'published',
    itinerary: [
      { day: 1, title: 'Arrival & Hotel Check-in', description: 'Meet & greet, hotel check-in and evening at leisure.', meals: 'Dinner', hotel: '4-Star Resort' },
      { day: 2, title: 'Local Sightseeing Tour', description: 'Explore iconic highlights and viewpoints.', meals: 'Breakfast & Dinner', hotel: '4-Star Resort' }
    ]
  });

  useEffect(() => {
    const fetchDests = async () => {
      try {
        const res = await destinationApi.getAll({ limit: 100 });
        if (res.success && res.data) {
          setDestinations(res.data);
          if (!formData.destination && res.data.length > 0) {
            setFormData(prev => ({ ...prev, destination: res.data[0]._id }));
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
              destination: p.destination?._id || p.destination || '',
              category: p.category || 'Family Trips',
              duration: p.duration || '',
              daysCount: p.daysCount || 5,
              nightsCount: p.nightsCount || 4,
              price: p.price || '',
              discountedPrice: p.discountedPrice || '',
              featuredImage: p.featuredImage || '',
              description: p.description || '',
              inclusions: Array.isArray(p.inclusions) ? p.inclusions.join(', ') : p.inclusions || '',
              exclusions: Array.isArray(p.exclusions) ? p.exclusions.join(', ') : p.exclusions || '',
              hotels: p.hotels || '',
              transport: p.transport || '',
              featured: Boolean(p.featured),
              status: p.status || 'published',
              itinerary: p.itinerary && p.itinerary.length > 0 ? p.itinerary : [
                { day: 1, title: 'Arrival & Welcome', description: 'Arrival and transfer to hotel.', meals: 'Dinner', hotel: 'Standard Hotel' }
              ]
            });
          }
        } catch (err) {
          toast.error('Failed to load package details');
        }
      };
      fetchPkg();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file);
      setFormData(prev => ({ ...prev, featuredImage: dataUri }));
      toast.success('Package image loaded from your device!');
    } catch (err) {
      toast.error(err.message || 'Image processing failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Itinerary handlers
  const handleItineraryChange = (index, field, value) => {
    const updated = [...formData.itinerary];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  const addItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: nextDay, title: `Day ${nextDay} Itinerary`, description: '', meals: 'Breakfast & Dinner', hotel: 'Hotel' }
      ]
    }));
  };

  const removeItineraryDay = (index) => {
    const updated = formData.itinerary.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      day: i + 1
    }));
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.destination || !formData.price || !formData.featuredImage) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountedPrice: Number(formData.discountedPrice) || 0,
        inclusions: formData.inclusions.split(',').map(s => s.trim()).filter(Boolean),
        exclusions: formData.exclusions.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (isEdit) {
        await packageApi.update(id, payload);
        toast.success('Package updated successfully');
      } else {
        await packageApi.create(payload);
        toast.success('Package created successfully');
      }
      navigate('/admin/packages');
    } catch (err) {
      toast.error(err.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/packages')}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            {isEdit ? 'Edit Tour Package' : 'Create New Tour Package'}
          </h1>
          <p className="text-xs text-slate-500">Configure itinerary days, pricing, hotel inclusions, and photos.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 space-y-8">
        {/* 1. Basic Info */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">1. General Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Package Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Manali Escape – Himalayan Retreat"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Destination *</label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
              >
                {destinations.map(d => (
                  <option key={d._id} value={d._id}>{d.name} ({d.state})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Travel Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
              >
                <option value="Family Trips">Family Trips</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Adventure">Adventure</option>
                <option value="Weekend Getaways">Weekend Getaways</option>
                <option value="Luxury Travel">Luxury Travel</option>
                <option value="Group Tours">Group Tours</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Duration Text *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="e.g. 5 Days / 4 Nights"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Days Count</label>
              <input
                type="number"
                name="daysCount"
                value={formData.daysCount}
                onChange={handleChange}
                min={1}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Regular Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="15999"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Discounted Price (₹)</label>
              <input
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleChange}
                placeholder="12999"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Photo */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">Featured Image URL or File *</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleChange}
              required
              placeholder="https://images.unsplash.com/..."
              className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
            />
            <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shrink-0">
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload'}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          {formData.featuredImage && (
            <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Package Description *</label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Detailed overview for travelers..."
            className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* 3. Dynamic Itinerary Builder */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900">Day-by-Day Itinerary</h2>
              <p className="text-xs text-slate-400">Add detailed schedules for each day of the journey.</p>
            </div>
            <button
              type="button"
              onClick={addItineraryDay}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" /> Add Day
            </button>
          </div>

          <div className="space-y-4">
            {formData.itinerary.map((day, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-brand-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Day {day.day}
                  </span>
                  {formData.itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(idx)}
                      className="text-rose-600 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                      placeholder="Day Title (e.g. Solang Valley Adventure)"
                      className="w-full text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <textarea
                      rows={2}
                      value={day.description}
                      onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)}
                      placeholder="Day activities and schedule..."
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={day.meals}
                      onChange={(e) => handleItineraryChange(idx, 'meals', e.target.value)}
                      placeholder="Meals (e.g. Breakfast & Dinner)"
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-1.5 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={day.hotel}
                      onChange={(e) => handleItineraryChange(idx, 'hotel', e.target.value)}
                      placeholder="Hotel / Stay (e.g. Snow Valley Resort)"
                      className="w-full text-xs rounded-xl border border-slate-200 px-3 py-1.5 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Inclusions & Exclusions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Inclusions (comma separated)</label>
            <textarea
              rows={3}
              name="inclusions"
              value={formData.inclusions}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Exclusions (comma separated)</label>
            <textarea
              rows={3}
              name="exclusions"
              value={formData.exclusions}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-navy-900">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Feature on Homepage
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Status:</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="text-xs font-semibold rounded-lg border border-slate-200 px-2 py-1 bg-slate-50"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/packages')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            <Save className="w-4 h-4 mr-1.5" /> {isEdit ? 'Update Package' : 'Publish Package'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;
