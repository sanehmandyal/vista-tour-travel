import React, { useEffect, useState } from 'react';
import { carApi, getExactCarImage } from '../../services/carApi';
import { processDeviceImage } from '../../utils/imageUpload';
import {
  Car,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  Fuel,
  Briefcase,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

export const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialForm = {
    name: '',
    category: 'SUV',
    seatingCapacity: '6 + 1 Seats',
    luggageCapacity: '4 Large Bags',
    fuelType: 'Diesel',
    image: '',
    features: 'Dual AC, Roof Carrier, Reclining Seats, Verified Chauffeur',
    description: '',
    isAvailable: true
  };
  const [form, setForm] = useState(initialForm);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await carApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        setCars(res.data);
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    const handleUpdate = () => fetchCars();
    window.addEventListener('rtt_cars_updated', handleUpdate);
    return () => window.removeEventListener('rtt_cars_updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setEditingId(car._id);
    setForm({
      name: car.name || '',
      category: car.category || 'SUV',
      seatingCapacity: car.seatingCapacity || '6 + 1 Seats',
      luggageCapacity: car.luggageCapacity || '4 Bags',
      fuelType: car.fuelType || 'Diesel',
      image: car.image || '',
      features: Array.isArray(car.features) ? car.features.join(', ') : car.features || '',
      description: car.description || '',
      isAvailable: car.isAvailable !== undefined ? car.isAvailable : true
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
      toast.success('Car photo loaded from device!');
    } catch (err) {
      toast.error(err.message || 'Image processing failed');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const applyPreset = (presetName) => {
    const p = presetName.toLowerCase();
    if (p === 'innova') {
      setForm({
        name: 'Toyota Innova Crysta',
        category: 'SUV',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Diesel',
        image: getExactCarImage('Toyota Innova Crysta'),
        features: 'Dual AC & Climate Control, Roof Carrier, Reclining Seats, Experienced Chauffeur',
        description: 'Premier luxury SUV for outstation travel, Kurukshetra pilgrimages and airport drops.',
        isAvailable: true
      });
    } else if (p === 'hycross') {
      setForm({
        name: 'Toyota Innova Hycross',
        category: 'Luxury',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Hybrid',
        image: getExactCarImage('Toyota Innova Hycross'),
        features: 'Ottoman Reclining Seats, Dual Zone AC, Panoramic Sunroof, Silent Hybrid Powertrain',
        description: 'Next-gen luxury hybrid cruiser for VIPs, corporate travelers, and luxury family trips.',
        isAvailable: true
      });
    } else if (p === 'ertiga') {
      setForm({
        name: 'Maruti Suzuki Ertiga',
        category: 'MUV',
        seatingCapacity: '5 + 1 Seats',
        luggageCapacity: '3 Large Bags',
        fuelType: 'Petrol / Hybrid',
        image: getExactCarImage('Maruti Suzuki Ertiga'),
        features: 'Chilled AC with Rear Vents, Comfortable 3-Row Seating, Smooth Suspension',
        description: 'Economical family favorite for temple tours, local shopping, and outstation trips.',
        isAvailable: true
      });
    } else if (p === 'dzire') {
      setForm({
        name: 'Maruti Suzuki Dzire',
        category: 'Sedan',
        seatingCapacity: '4 + 1 Seats',
        luggageCapacity: '2 Large + 2 Handbags',
        fuelType: 'Petrol',
        image: getExactCarImage('Maruti Suzuki Dzire'),
        features: 'Automatic AC, Deep 378L Boot, Smooth Highway Ride, Daily Sanitized',
        description: 'Popular compact sedan for quick airport drops, local errands, and point-to-point transfers.',
        isAvailable: true
      });
    } else if (p === 'scorpio') {
      setForm({
        name: 'Mahindra Scorpio-N',
        category: 'SUV',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Diesel',
        image: getExactCarImage('Mahindra Scorpio'),
        features: 'High Ground Clearance, Heavy Duty Build, Roof Luggage Rack, Rugged Highway Cruiser',
        description: 'Commanding heavy-duty SUV built for highways and all weather conditions.',
        isAvailable: true
      });
    } else if (p === 'urbania') {
      setForm({
        name: 'Force Urbania Luxury Van',
        category: 'Tempo Traveller',
        seatingCapacity: '10 + 1 Passengers',
        luggageCapacity: '8 Large Bags',
        fuelType: 'Diesel',
        image: getExactCarImage('Force Urbania'),
        features: 'Individual Reclining Seats, Triple AC with Personal Vents, Tinted Panoramic Windows',
        description: 'European styling, whisper-quiet cabin and unmatched luxury for VIP group excursions.',
        isAvailable: true
      });
    } else if (p === 'tempo17') {
      setForm({
        name: 'Force Tempo Traveller (17-Seater Deluxe)',
        category: 'Tempo Traveller',
        seatingCapacity: '17 + 1 Passengers',
        luggageCapacity: 'Extra Heavy Overhead Carrier',
        fuelType: 'Diesel',
        image: getExactCarImage('Force Tempo Traveller 17'),
        features: 'Wide Reclining Seats, Dual High-Capacity AC, High-Roof Stand-up Height',
        description: 'Maximum capacity and comfort for large pilgrimage groups, weddings, and family functions.',
        isAvailable: true
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Car model name is required');
      return;
    }

    try {
      setSubmitting(true);
      const finalImage = form.image.trim() || getExactCarImage(form.name);
      const featuresArray = typeof form.features === 'string'
        ? form.features.split(',').map(s => s.trim()).filter(Boolean)
        : form.features;

      const payload = {
        ...form,
        image: finalImage,
        features: featuresArray.length > 0 ? featuresArray : ['Chilled AC', 'Clean Cab', 'Verified Chauffeur'],
        description: form.description.trim() || `${form.name} available for 24/7 commercial hire, outstation journeys and airport transfers.`
      };

      if (editingId) {
        await carApi.update(editingId, payload);
        toast.success(`"${form.name}" updated successfully!`);
      } else {
        await carApi.create(payload);
        toast.success(`"${form.name}" added to fleet and is live on site!`);
      }
      setIsModalOpen(false);
      fetchCars();
    } catch (err) {
      toast.error(err.message || 'Could not save vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (car) => {
    if (window.confirm(`Permanently remove "${car.name}" from the fleet?`)) {
      try {
        await carApi.delete(car._id);
        toast.success(`"${car.name}" removed from fleet`);
        fetchCars();
      } catch (err) {
        toast.error('Failed to remove car');
      }
    }
  };

  const handleToggleAvailable = async (car) => {
    try {
      const updated = !car.isAvailable;
      await carApi.update(car._id, { isAvailable: updated });
      toast.success(`${car.name} marked as ${updated ? 'Available' : 'Unavailable'}`);
      fetchCars();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Filter cars
  const filteredCars = cars.filter(c => {
    if (categoryFilter !== 'All' && c.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Car Fleet & Vehicles</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage commercial cabs, SUVs, and luxury vans displayed on the public website.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="shadow-md font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search car by name, category, or features..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['All', 'SUV', 'Sedan', 'MUV', 'Tempo Traveller', 'Luxury'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cars Grid */}
      {loading ? (
        <Loader text="Loading vehicle fleet..." />
      ) : filteredCars.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No vehicles found"
          description="Click 'Add New Vehicle' to add a car to your fleet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCars.map(car => (
            <div
              key={car._id || car.name}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden flex flex-col group hover:shadow-card transition-all"
            >
              {/* Photo */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={car.image || getExactCarImage(car.name)}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getExactCarImage(car.name);
                  }}
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-navy-900/90 text-white text-[11px] font-bold">
                  {car.category || 'SUV'}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleAvailable(car)}
                  className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs transition-colors ${
                    car.isAvailable !== false
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-600 text-white'
                  }`}
                  title="Click to toggle availability"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${car.isAvailable !== false ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                  {car.isAvailable !== false ? 'Active' : 'Hidden'}
                </button>
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-navy-900 text-sm sm:text-base leading-snug">
                    {car.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {car.description || 'Verified commercial taxi service with polite driver.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 py-2 border-y border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="truncate">{car.seatingCapacity || '6 + 1 Seats'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Fuel className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{car.fuelType || 'Diesel'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">{car.luggageCapacity || 'Luggage Space Available'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    ★ Best Quotes
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(car)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      title="Edit vehicle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(car)}
                      className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Car Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? `Edit Vehicle: ${form.name}` : 'Add New Vehicle to Fleet'}
        size="lg"
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Presets */}
          {!editingId && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Quick Autofill Presets:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Innova Crysta', key: 'innova' },
                  { label: 'Innova Hycross', key: 'hycross' },
                  { label: 'Ertiga', key: 'ertiga' },
                  { label: 'Dzire', key: 'dzire' },
                  { label: 'Scorpio-N', key: 'scorpio' },
                  { label: 'Force Urbania', key: 'urbania' },
                  { label: '17-Seater Tempo', key: 'tempo17' }
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => applyPreset(item.key)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-xs font-semibold text-navy-900 transition-colors"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Car Model Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="e.g. Toyota Innova Crysta (7+1 Luxury SUV)"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="MUV">MUV</option>
                <option value="Tempo Traveller">Tempo Traveller</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury VIP</option>
                <option value="4x4 Off-Road">4x4 Off-Road</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fuel Type</label>
              <select
                value={form.fuelType}
                onChange={(e) => setForm(prev => ({ ...prev, fuelType: e.target.value }))}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Seating Capacity</label>
              <input
                type="text"
                value={form.seatingCapacity}
                onChange={(e) => setForm(prev => ({ ...prev, seatingCapacity: e.target.value }))}
                placeholder="e.g. 6 + 1 Seats"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Luggage Capacity</label>
              <input
                type="text"
                value={form.luggageCapacity}
                onChange={(e) => setForm(prev => ({ ...prev, luggageCapacity: e.target.value }))}
                placeholder="e.g. 4 Large Bags + Roof Carrier"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Features & Comfort (comma separated)
              </label>
              <input
                type="text"
                value={form.features}
                onChange={(e) => setForm(prev => ({ ...prev, features: e.target.value }))}
                placeholder="e.g. Dual AC, Pushback Seats, Roof Carrier, Verified Chauffeur"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief summary of vehicle, ideal route, or best use..."
                className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Vehicle Photo</span>
              <span className="text-[11px] text-slate-400 font-normal">Optional (auto-assigns realistic photo if blank)</span>
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

          {/* Availability Switch */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAvailable"
              checked={form.isAvailable}
              onChange={(e) => setForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
              className="w-4 h-4 rounded text-brand-600 border-slate-300"
            />
            <label htmlFor="isAvailable" className="text-xs font-bold text-slate-700 cursor-pointer">
              Active and available for bookings on the website
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting} className="font-bold">
              {editingId ? 'Save Changes' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Cars;
