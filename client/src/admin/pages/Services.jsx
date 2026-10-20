import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceApi } from '../../services/serviceApi';
import { processDeviceImage } from '../../utils/imageUpload';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Search,
  Upload,
  Car,
  Plane,
  Compass,
  Clock,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import Cars from './Cars';

export const Services = ({ defaultTab }) => {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || defaultTab || 'services';

  // If requested tab is fleet/cars, seamlessly render Cars view
  if (currentTab === 'fleet' || currentTab === 'cars') {
    return <Cars />;
  }

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialForm = {
    title: '',
    category: 'Outstation Cabs',
    shortDescription: '',
    description: '',
    features: 'Doorstep Pickup, Sanitized AC Cab, Verified Driver, All Tolls Included',
    image: '',
    icon: 'Car',
    isActive: true
  };
  const [form, setForm] = useState(initialForm);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const handleUpdate = () => fetchServices();
    window.addEventListener('rtt_services_updated', handleUpdate);
    return () => window.removeEventListener('rtt_services_updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingId(svc._id);
    setForm({
      title: svc.title || '',
      category: svc.category || 'Outstation Cabs',
      shortDescription: svc.shortDescription || '',
      description: svc.description || '',
      features: Array.isArray(svc.features) ? svc.features.join(', ') : svc.features || '',
      image: svc.image || '',
      icon: svc.icon || 'Car',
      isActive: svc.isActive !== undefined ? svc.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const dataUri = await processDeviceImage(file);
      setForm(prev => ({ ...prev, image: dataUri }));
      toast.success('Service photo loaded from device!');
    } catch (err) {
      toast.error(err.message || 'Image processing failed');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Service title is required');
      return;
    }

    try {
      setSubmitting(true);
      const featuresArray = typeof form.features === 'string'
        ? form.features.split(',').map(s => s.trim()).filter(Boolean)
        : form.features;

      const payload = {
        ...form,
        features: featuresArray.length > 0 ? featuresArray : ['24/7 Availability', 'Clean Sanitized Cabs', 'Verified Chauffeurs'],
        shortDescription: form.shortDescription.trim() || `${form.title} available 24/7 across Ladwa, Kurukshetra, Ambala, Delhi NCR & Chandigarh.`,
        description: form.description.trim() || `Book premium ${form.title} with Vista Tour and Travels. Verified chauffeurs and transparent billing guaranteed.`
      };

      if (editingId) {
        await serviceApi.update(editingId, payload);
        toast.success(`"${form.title}" updated successfully!`);
      } else {
        await serviceApi.create(payload);
        toast.success(`"${form.title}" created successfully and is live on site!`);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err.message || 'Could not save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (svc) => {
    if (window.confirm(`Permanently remove service "${svc.title}"?`)) {
      try {
        await serviceApi.delete(svc._id);
        toast.success(`"${svc.title}" removed`);
        fetchServices();
      } catch (err) {
        toast.error('Failed to remove service');
      }
    }
  };

  const filteredServices = services.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Taxi & Travel Services</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage outstation cabs, airport drops, and car rental services displayed on the website.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shadow-md font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service by title, route, or features..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500 font-medium"
          />
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <Loader text="Loading services..." />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No services found"
          description="Click 'Add New Service' to add a cab or travel service."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(svc => (
            <div
              key={svc._id || svc.title}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 flex flex-col justify-between group hover:shadow-card transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center font-bold">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {svc.category || 'Taxi Service'}
                  </span>
                </div>

                <h3 className="font-extrabold text-navy-900 text-base leading-snug">
                  {svc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                  {svc.shortDescription || svc.description}
                </p>

                {Array.isArray(svc.features) && svc.features.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    {svc.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-4 mt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(svc)}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                  title="Edit service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(svc)}
                  className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? `Edit Service: ${form.title}` : 'Add New Cab / Travel Service'}
        size="lg"
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Service Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="e.g. Outstation Cabs from Ladwa & Kurukshetra"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Service Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="Outstation Cabs">Outstation Cabs</option>
                <option value="Airport Taxi Transfer">Airport Taxi Transfer (IGI / IXC)</option>
                <option value="Local City & Pilgrimage Rental">Local City & Pilgrimage Rental</option>
                <option value="Wedding & Corporate Cabs">Wedding & Corporate Cabs</option>
                <option value="Luxury Car Fleet">Luxury Car Fleet</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
              <select
                value={form.isActive ? 'active' : 'inactive'}
                onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-semibold"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Hidden</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Short Summary
              </label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="e.g. Doorstep pickup to Delhi, Chandigarh, Karnal & Ambala with 24/7 chauffeurs"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Detailed Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Full details of what is included, route options, pickup timings..."
                className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Key Features / Inclusions (comma separated)
              </label>
              <input
                type="text"
                value={form.features}
                onChange={(e) => setForm(prev => ({ ...prev, features: e.target.value }))}
                placeholder="e.g. 24/7 Guaranteed Pickup, Sanitized AC Cabs, Polite Chauffeur, All Tolls Included"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Service Banner Photo</span>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </label>

            <div className="flex items-center gap-3">
              {form.image ? (
                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                    className="absolute top-0.5 right-0.5 bg-black/80 text-white rounded p-0.5 text-[9px]"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-24 h-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 bg-white">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}

              <div className="flex-1 space-y-1.5">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-navy-900 cursor-pointer shadow-xs hover:border-brand-500">
                  <Upload className="w-3.5 h-3.5 text-brand-600" />
                  <span>{uploadingImage ? 'Loading...' : 'Upload from Device'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Or paste photo URL / image path..."
                  className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting} className="font-bold">
              {editingId ? 'Save Changes' : 'Publish Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Services;
