import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceApi } from '../../services/serviceApi';
import { carApi } from '../../services/carApi';
import { adminApi } from '../../services/adminApi';
import { processDeviceImage } from '../../utils/imageUpload';
import {
  Car,
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  Fuel,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  ExternalLink,
  Upload
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { getExactCarImage } from '../../services/carApi';

export const Services = ({ defaultTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || defaultTab || 'fleet';
  const [activeTab, setActiveTab] = useState(initialTab);

  const fallbackCars = [
    {
      _id: 'c1',
      name: 'Toyota Innova Crysta',
      category: 'SUV',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800',
      features: [
        'Dual AC & Climate Control',
        'Roof Carrier for Extra Luggage',
        'Pushback Recliner Seats',
        'Experienced Mountain Driver'
      ],
      description: 'Premier luxury SUV for Himachal hill stations and family vacations. High safety rating and comfortable ride.',
      isAvailable: true
    },
    {
      _id: 'c2',
      name: 'Toyota Innova Hycross',
      category: 'Luxury',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Hybrid / Petrol',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Toyota_Kijang_Innova_Zenix_2.0_Q_Hybrid_Modellista_(front),_West_Surabaya.jpg?width=800',
      features: [
        'Ottoman Recliner Captain Seats',
        'Dual Zone Chilled Climate Control',
        'Panoramic Sunroof Experience',
        'Silent Hybrid Hill Cruise'
      ],
      description: 'Ultra-luxurious hybrid cruiser for VIPs, executives, and luxury family holidays across Himachal.',
      isAvailable: true
    },
    {
      _id: 'c3',
      name: 'Maruti Suzuki Ertiga',
      category: 'MUV',
      seatingCapacity: '5 + 1 Seats',
      luggageCapacity: '3 Large Bags',
      fuelType: 'Petrol / Hybrid',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ertiga(2).jpg?width=800',
      features: [
        'Chilled AC with Rear Vents',
        'Comfortable 3-Row Seating',
        'Smooth Hill Suspension',
        'Certified Chauffeur'
      ],
      description: 'Budget-friendly yet remarkably spacious. Great for small families and airport transfers.',
      isAvailable: true
    },
    {
      _id: 'c4',
      name: 'Maruti Suzuki Swift Dzire',
      category: 'Sedan',
      seatingCapacity: '4 + 1 Seats',
      luggageCapacity: '2 Large Bags + Handbags',
      fuelType: 'Petrol',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Dzire_VXi_VVT_(front).JPG?width=800',
      features: [
        'AC & Cabin Heating',
        'Deep Boot Space',
        'Smooth Highway Ride',
        'Sanitized Daily'
      ],
      description: 'Most popular and economical choice for couples, solo travelers, and city tours.',
      isAvailable: true
    },
    {
      _id: 'c5',
      name: 'Toyota Etios',
      category: 'Sedan',
      seatingCapacity: '4 + 1 Seats',
      luggageCapacity: '3 Large Bags',
      fuelType: 'Diesel / Petrol',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Etios_1.5_XLS_Sedan_2019.jpg?width=800',
      features: [
        'Extra Legroom & Shoulder Room',
        'Huge 595L Boot Space',
        'Powerful Mountain AC',
        'Chauffeur Driven'
      ],
      description: 'Remarkably roomy sedan renowned for rugged reliability and generous luggage room.',
      isAvailable: true
    },
    {
      _id: 'c6',
      name: 'Maruti Suzuki Alto K10 / WagonR',
      category: 'Hatchback',
      seatingCapacity: '4 + 1 Seats',
      luggageCapacity: '2 Medium Bags',
      fuelType: 'Petrol',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_-_Alto_800_LXi.JPG?width=800',
      features: [
        'Compact & Nimble on Mountain Roads',
        'Chilled AC & Hill Heater',
        'Most Economical Budget Rates',
        'Local Kangra Driver'
      ],
      description: 'Agile and budget-friendly. Navigates narrow mountain lanes and temple roads with ease.',
      isAvailable: true
    },
    {
      _id: 'c7',
      name: 'Mahindra Scorpio-N 4x4',
      category: '4x4 Off-Road',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio.jpg?width=800',
      features: [
        '4x4 High Ground Clearance',
        'Rugged All-Terrain Hill Tires',
        'Roof Luggage Rack',
        'Snow Chain Equipped'
      ],
      description: 'Built tough for rough Himalayan terrains. Best suited for high-altitude Spiti expeditions.',
      isAvailable: true
    },
    {
      _id: 'c8',
      name: 'Toyota Fortuner 4x4',
      category: 'Luxury',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '5 Large Bags',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Fortuner_2.8_GR_Sport_4x4_2022.jpg?width=800',
      features: [
        '4x4 High-Torque Mountain Engine',
        'Plush Leather Interior',
        'Extreme Off-Road Capability',
        'VIP Hill Escort Service'
      ],
      description: 'The ultimate beast for luxury travel, mountain passes, and snowy winter expeditions.',
      isAvailable: true
    },
    {
      _id: 'c9',
      name: 'Force Urbania Super-Luxury Van',
      category: 'Tempo Traveller',
      seatingCapacity: '10 + 1 Passengers',
      luggageCapacity: '8 Large Bags',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
      features: [
        'Individual Aircraft-Style Bucket Seats',
        'Triple AC with Personalized Vents',
        'Panoramic Tinted Windows',
        'Individual USB Ports & Mood Lights'
      ],
      description: 'Next-generation European luxury van for executive groups, high-end family trips, and corporate delegates.',
      isAvailable: true
    },
    {
      _id: 'c10',
      name: 'Force Tempo Traveller (12-Seater Deluxe)',
      category: 'Tempo Traveller',
      seatingCapacity: '12 + 1 Passengers',
      luggageCapacity: 'Rear Boot + Heavy Roof Carrier',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
      features: [
        'Reclining Pushback Seats',
        'Individual AC Vents',
        'Music Surround Sound',
        'High Roof Stand-up Interior'
      ],
      description: 'First-class group luxury. Perfect for joint families and group tours across Himachal.',
      isAvailable: true
    },
    {
      _id: 'c11',
      name: 'Force Tempo Traveller (17-Seater Deluxe)',
      category: 'Tempo Traveller',
      seatingCapacity: '17 + 1 Passengers',
      luggageCapacity: 'Extra Heavy Overhead Carrier',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
      features: [
        'Wide Reclining Luxury Seats',
        'Dual High-Capacity AC Units',
        'High-Roof Stand-up Height',
        'First Aid Kit & Fire Safety'
      ],
      description: 'Maximum capacity with supreme comfort for large pilgrim groups and family holidays.',
      isAvailable: true
    },
    {
      _id: 'c12',
      name: 'Force Tempo Traveller (26-Seater Maharaja)',
      category: 'Tempo Traveller',
      seatingCapacity: '26 + 1 Passengers',
      luggageCapacity: 'Massive Roof Carrier + Rear Space',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
      features: [
        '2x2 Pushback Maharaja Seats',
        'Twin High-Powered Cooling Units',
        'LCD TV with Sound System',
        'Senior Mountain Chauffeur'
      ],
      description: 'The ultimate group carrier for weddings, school excursions, and grand Himachal temple pilgrimages.',
      isAvailable: true
    }
  ];

  // Cars State initialized with fallbackCars
  const [cars, setCars] = useState(fallbackCars);
  const [loadingCars, setLoadingCars] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [submittingCar, setSubmittingCar] = useState(false);
  const [uploadingCarImage, setUploadingCarImage] = useState(false);
  const [carCategoryFilter, setCarCategoryFilter] = useState('All');
  const [carSearchQuery, setCarSearchQuery] = useState('');

  const initialCarForm = {
    name: '',
    category: 'SUV',
    seatingCapacity: '6 + 1 Seats',
    luggageCapacity: '4 Large Bags',
    fuelType: 'Diesel',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    features: 'Dual AC, Roof Carrier, Pushback Seats, Hill Specialist Chauffeur',
    description: '',
    isAvailable: true
  };
  const [carForm, setCarForm] = useState(initialCarForm);

  // General Services State
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [submittingService, setSubmittingService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    icon: 'Compass',
    features: ''
  });

  // Fetch Cars
  const fetchCars = async () => {
    try {
      const stored = localStorage.getItem('rtt_custom_cars');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCars(parsed);
          }
        } catch {}
      }

      const res = await carApi.getAll({ all: 'true' });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCars(res.data);
        localStorage.setItem('rtt_custom_cars', JSON.stringify(res.data));
      }
    } catch {
      // Backend car API unavailable; relying on stored/fallback fleet
    } finally {
      setLoadingCars(false);
    }
  };

  // Fetch Services
  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const res = await serviceApi.getAll();
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchServices();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Car Actions
  const handleOpenCreateCar = () => {
    setEditingCarId(null);
    setCarForm(initialCarForm);
    setIsCarModalOpen(true);
  };

  const handleOpenEditCar = (car) => {
    setEditingCarId(car._id);
    setCarForm({
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
    setIsCarModalOpen(true);
  };

  const handleCarImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCarImage(true);
      const dataUri = await processDeviceImage(file);
      setCarForm(prev => ({ ...prev, image: dataUri }));
      toast.success('Car photo loaded from your device!');
    } catch (err) {
      toast.error(err.message || 'Failed to process car photo');
    } finally {
      setUploadingCarImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const applyCarPreset = (type) => {
    if (type === 'innova') {
      setCarForm({
        name: 'Toyota Innova Crysta',
        category: 'SUV',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Diesel',
        image: getExactCarImage('Toyota Innova Crysta'),
        features: 'Dual AC & Climate Control, Roof Carrier for Luggage, Pushback Recliner Seats, Experienced Mountain Driver, Sanitized Daily',
        description: 'Premier luxury SUV for Himachal hill stations and family vacations. High safety rating and comfortable ride.',
        isAvailable: true
      });
    } else if (type === 'hycross') {
      setCarForm({
        name: 'Toyota Innova Hycross',
        category: 'Luxury',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Hybrid / Petrol',
        image: getExactCarImage('Toyota Innova Hycross'),
        features: 'Ottoman Recliner Captain Seats, Dual Zone Climate Control, Panoramic Sunroof, Silent Hybrid Hill Cruise',
        description: 'Ultra-luxurious hybrid cruiser for VIPs, corporate executives, and luxury family holidays across Himachal.',
        isAvailable: true
      });
    } else if (type === 'ertiga') {
      setCarForm({
        name: 'Maruti Suzuki Ertiga',
        category: 'MUV',
        seatingCapacity: '5 + 1 Seats',
        luggageCapacity: '3 Large Bags',
        fuelType: 'Petrol / Hybrid',
        image: getExactCarImage('Maruti Suzuki Ertiga'),
        features: 'Chilled AC with Rear Vents, Comfortable 3-Row Seating, Smooth Hill Suspension, Certified Chauffeur, USB Ports',
        description: 'Budget-friendly yet remarkably spacious. Great for small families, local Kangra temple circuits, and airport transfers.',
        isAvailable: true
      });
    } else if (type === 'dzire') {
      setCarForm({
        name: 'Maruti Suzuki Swift Dzire',
        category: 'Sedan',
        seatingCapacity: '4 + 1 Seats',
        luggageCapacity: '2 Large Bags + Handbags',
        fuelType: 'Petrol',
        image: getExactCarImage('Maruti Suzuki Swift Dzire'),
        features: 'AC & Cabin Heating, Deep Boot Space, Smooth Highway Ride, Sanitized Daily, Economical & Fast',
        description: 'Most popular and economical choice for couples, solo travelers, and city tours across Kangra and Dharamshala.',
        isAvailable: true
      });
    } else if (type === 'alto') {
      setCarForm({
        name: 'Maruti Suzuki Alto K10 / WagonR',
        category: 'Hatchback',
        seatingCapacity: '4 + 1 Seats',
        luggageCapacity: '2 Medium Bags',
        fuelType: 'Petrol',
        image: getExactCarImage('Maruti Suzuki Alto K10'),
        features: 'Compact & Nimble on Mountain Roads, Chilled AC & Hill Heater, Most Economical Rates, Local Kangra Driver',
        description: 'Agile, economical, and swift through narrow mountain turns and steep hillside temple ascents.',
        isAvailable: true
      });
    } else if (type === 'scorpio') {
      setCarForm({
        name: 'Mahindra Scorpio-N 4x4',
        category: '4x4 Off-Road',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Diesel',
        image: getExactCarImage('Mahindra Scorpio'),
        features: '4x4 High Ground Clearance, Rugged All-Terrain Hill Tires, Roof Luggage Rack, Snow Chain Equipped',
        description: 'Heavy-duty 4x4 high ground clearance SUV built tough for high-altitude Spiti expeditions and winter snow.',
        isAvailable: true
      });
    } else if (type === 'urbania') {
      setCarForm({
        name: 'Force Urbania Luxury Van',
        category: 'Tempo Traveller',
        seatingCapacity: '10 + 1 Passengers',
        luggageCapacity: '8 Large Bags',
        fuelType: 'Diesel',
        image: getExactCarImage('Force Urbania'),
        features: 'Individual Aircraft Bucket Seats, Triple AC with Individual Vents, Panoramic Tinted Windows, USB Ports',
        description: 'European-class ultra-luxury passenger van for VIP groups and family luxury expeditions.',
        isAvailable: true
      });
    } else if (type === 'tempo') {
      setCarForm({
        name: 'Force Tempo Traveller (12-Seater)',
        category: 'Tempo Traveller',
        seatingCapacity: '12 + 1 Passengers',
        luggageCapacity: 'Rear Boot + Heavy Roof Carrier',
        fuelType: 'Diesel',
        image: getExactCarImage('Force Tempo Traveller 12'),
        features: 'Reclining Pushback Seats, Individual AC Vents, Music Surround Sound, High Roof Stand-up Interior, Senior Chauffeur',
        description: 'First-class group luxury. Perfect for joint families, corporate offsites, and wedding guest transfers across Himachal.',
        isAvailable: true
      });
    } else if (type === 'tempo17') {
      setCarForm({
        name: 'Force Tempo Traveller (17-Seater Deluxe)',
        category: 'Tempo Traveller',
        seatingCapacity: '17 + 1 Passengers',
        luggageCapacity: 'Extra Heavy Overhead Carrier',
        fuelType: 'Diesel',
        image: getExactCarImage('Force Tempo Traveller 17'),
        features: 'Wide Reclining Luxury Seats, Dual High-Capacity AC Units, High-Roof Stand-up Height, First Aid Kit & Fire Safety',
        description: 'Maximum passenger capacity with supreme comfort for large pilgrim groups and family holidays.',
        isAvailable: true
      });
    }
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    if (!carForm.name.trim()) {
      toast.error('Car model name is required');
      return;
    }

    try {
      setSubmittingCar(true);
      const payload = {
        ...carForm,
        features: typeof carForm.features === 'string'
          ? carForm.features.split(',').map(s => s.trim()).filter(Boolean)
          : carForm.features
      };

      // 1. If backend API is available, try updating/creating in DB
      let assignedId = editingCarId;
      try {
        if (editingCarId && /^[0-9a-fA-F]{24}$/.test(editingCarId)) {
          await carApi.update(editingCarId, payload);
        } else if (!editingCarId) {
          const res = await carApi.create(payload);
          if (res?.data?._id) assignedId = res.data._id;
        }
      } catch (apiErr) {
        console.warn('Backend car endpoint not reachable; persisting locally:', apiErr);
      }

      // 2. Persist locally and in state so edits and new cars NEVER fail
      const finalId = assignedId || (editingCarId ? editingCarId : `car-${Date.now()}`);
      setCars(prev => {
        let updated;
        if (editingCarId) {
          updated = prev.map(c => c._id === editingCarId ? { ...c, ...payload, _id: finalId } : c);
        } else {
          updated = [{ ...payload, _id: finalId }, ...prev];
        }
        try {
          localStorage.setItem('rtt_custom_cars', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      toast.success(editingCarId ? 'Car model updated successfully!' : 'Car model added to fleet successfully!');
      setIsCarModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save car model');
    } finally {
      setSubmittingCar(false);
    }
  };

  const handleDeleteCar = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your fleet?`)) {
      try {
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
          try {
            await carApi.delete(id);
          } catch {}
        }
        setCars(prev => {
          const updated = prev.filter(c => c._id !== id);
          try {
            localStorage.setItem('rtt_custom_cars', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        toast.success('Car model removed');
      } catch (err) {
        toast.error(err.message || 'Failed to delete car model');
      }
    }
  };

  // Service Actions
  const handleOpenCreateService = () => {
    setEditingServiceId(null);
    setServiceForm({ title: '', shortDescription: '', description: '', icon: 'Compass', features: '' });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (svc) => {
    setEditingServiceId(svc._id);
    setServiceForm({
      title: svc.title || '',
      shortDescription: svc.shortDescription || '',
      description: svc.description || '',
      icon: svc.icon || 'Compass',
      features: Array.isArray(svc.features) ? svc.features.join(', ') : svc.features || ''
    });
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.shortDescription) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setSubmittingService(true);
      const payload = {
        ...serviceForm,
        features: typeof serviceForm.features === 'string'
          ? serviceForm.features.split(',').map(s => s.trim()).filter(Boolean)
          : serviceForm.features
      };

      if (editingServiceId) {
        await serviceApi.update(editingServiceId, payload);
        toast.success('Service updated');
      } else {
        await serviceApi.create(payload);
        toast.success('Service created');
      }
      setIsServiceModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err.message || 'Failed to save service');
    } finally {
      setSubmittingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        await serviceApi.delete(id);
        toast.success('Service removed');
        setServices(prev => prev.filter(s => s._id !== id));
      } catch (err) {
        toast.error(err.message || 'Failed to delete');
      }
    }
  };

  const filteredCars = cars.filter(c => {
    const matchesCategory = carCategoryFilter === 'All' || c.category === carCategoryFilter;
    const matchesSearch = c.name?.toLowerCase().includes(carSearchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(carSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Services & Taxi Fleet</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Post and manage the car models you have in Vista Tour and Travels, plus general tour offerings.
          </p>
        </div>

        {activeTab === 'fleet' ? (
          <Button
            variant="primary"
            onClick={handleOpenCreateCar}
            className="flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Add Car Model
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleOpenCreateService}
            className="flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" /> Add Service
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => handleTabChange('fleet')}
          className={`flex items-center gap-2.5 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'fleet'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Car Models & Fleet</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-semibold">
            {cars.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('services')}
          className={`flex items-center gap-2.5 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'services'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>General Services</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-semibold">
            {services.length}
          </span>
        </button>
      </div>

      {/* TAB 1: CAR FLEET */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={carSearchQuery}
                onChange={(e) => setCarSearchQuery(e.target.value)}
                placeholder="Search car models..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'SUV', 'MUV', 'Sedan', '4x4 Off-Road', 'Tempo Traveller'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCarCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    carCategoryFilter === cat
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cars Grid */}
          {loadingCars ? (
            <div className="py-20 flex justify-center">
              <Loader size="lg" text="Loading car fleet..." />
            </div>
          ) : filteredCars.length === 0 ? (
            <EmptyState
              title="No car models found"
              description="Click the button below to add the vehicle models you operate for taxi and tour bookings."
              actionText="Add Car Model"
              onAction={handleOpenCreateCar}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Car Image & Badges */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={car.image && !car.image.includes('images.unsplash.com') ? car.image : getExactCarImage(car.name)}
                        alt={car.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getExactCarImage(car.name);
                        }}
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-navy-950/80 text-white backdrop-blur-sm shadow-sm">
                          {car.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        {car.isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-sm shadow-sm">
                            <CheckCircle2 className="w-3 h-3" /> Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/90 text-white backdrop-blur-sm shadow-sm">
                            <XCircle className="w-3 h-3" /> Booked / Unavailable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 leading-tight">
                          {car.name}
                        </h3>
                        {car.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {car.description}
                          </p>
                        )}
                      </div>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Seats</span>
                          <span className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                            <Users className="w-3 h-3 text-brand-600" /> {car.seatingCapacity}
                          </span>
                        </div>
                        <div className="space-y-0.5 border-x border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Luggage</span>
                          <span className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                            <Briefcase className="w-3 h-3 text-brand-600" /> {car.luggageCapacity}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Fuel</span>
                          <span className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                            <Fuel className="w-3 h-3 text-brand-600" /> {car.fuelType}
                          </span>
                        </div>
                      </div>


                      {/* Features */}
                      {car.features && car.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {car.features.slice(0, 4).map((f, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              ✓ {f}
                            </span>
                          ))}
                          {car.features.length > 4 && (
                            <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
                              +{car.features.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditCar(car)}
                      className="text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCar(car._id, car.name)}
                      className="text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GENERAL SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {loadingServices ? (
            <div className="py-20 flex justify-center">
              <Loader size="lg" text="Loading services..." />
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              title="No services added yet"
              description="Create general services offered by Vista Tour and Travels."
              actionText="Add Service"
              onAction={handleOpenCreateService}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{svc.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{svc.shortDescription}</p>

                    {svc.features && svc.features.length > 0 && (
                      <ul className="space-y-1.5 pt-3 border-t border-slate-100">
                        {svc.features.map((f, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                            <span className="text-emerald-500 font-bold">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditService(svc)}
                      className="text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteService(svc._id)}
                      className="text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CAR MODAL */}
      <Modal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        title={editingCarId ? 'Edit Car Model' : 'Post New Car Model'}
      >
        <form onSubmit={handleCarSubmit} className="space-y-4">
          {/* Quick presets */}
          {!editingCarId && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Popular Car Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyCarPreset('innova')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Innova Crysta
                </button>
                <button
                  type="button"
                  onClick={() => applyCarPreset('hycross')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Innova Hycross (Luxury)
                </button>
                <button
                  type="button"
                  onClick={() => applyCarPreset('ertiga')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Maruti Ertiga
                </button>
                <button
                  type="button"
                  onClick={() => applyCarPreset('dzire')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Swift Dzire
                </button>
                <button
                  type="button"
                  onClick={() => applyCarPreset('alto')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Alto / WagonR
                </button>
                <button
                  type="button"
                  onClick={() => applyCarPreset('scorpio')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Scorpio 4x4
                </button>
                <button
                  type="button"
                  onClick={() => applyCarPreset('urbania')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Force Urbania
                </button>
                <button
                  type="button"
                  onClick={() => applyCarPreset('tempo')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Tempo 12-Seater
                </button>
                <button
                  type="button"
                  onClick={() => applyCarPreset('tempo17')}
                  className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:border-brand-500 rounded-lg font-semibold text-slate-700 shadow-2xs"
                >
                  Tempo 17-Seater
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Car Model Name * (e.g. Toyota Innova Crysta, Maruti Suzuki Ertiga)
            </label>
            <input
              type="text"
              value={carForm.name}
              onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
              required
              placeholder="e.g. Toyota Innova Crysta"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Category</label>
              <select
                value={carForm.category}
                onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium bg-white"
              >
                <option value="SUV">SUV</option>
                <option value="MUV">MUV</option>
                <option value="Sedan">Sedan</option>
                <option value="4x4 Off-Road">4x4 Off-Road</option>
                <option value="Tempo Traveller">Tempo Traveller</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fuel Type</label>
              <input
                type="text"
                value={carForm.fuelType}
                onChange={(e) => setCarForm({ ...carForm, fuelType: e.target.value })}
                placeholder="e.g. Diesel, Petrol, Hybrid"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Seating Capacity</label>
              <input
                type="text"
                value={carForm.seatingCapacity}
                onChange={(e) => setCarForm({ ...carForm, seatingCapacity: e.target.value })}
                placeholder="e.g. 6 + 1 Seats"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Luggage Capacity</label>
              <input
                type="text"
                value={carForm.luggageCapacity}
                onChange={(e) => setCarForm({ ...carForm, luggageCapacity: e.target.value })}
                placeholder="e.g. 4 Large Bags"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>


          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Car Photo * (Upload directly or enter URL)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl cursor-pointer font-bold text-xs transition-colors border border-brand-200 shadow-2xs">
                <Upload className="w-4 h-4" />
                {uploadingCarImage ? 'Uploading Image...' : 'Upload Car Photo from Device'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCarImageUpload}
                  disabled={uploadingCarImage}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400">or enter image link below:</span>
            </div>
            <input
              type="text"
              value={carForm.image}
              onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
            />
            {carForm.image && (
              <div className="relative mt-2 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <img
                  src={carForm.image}
                  alt="Car preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setCarForm(prev => ({ ...prev, image: '' }))}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white text-xs shadow-md transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Key Features (comma-separated)
            </label>
            <input
              type="text"
              value={carForm.features}
              onChange={(e) => setCarForm({ ...carForm, features: e.target.value })}
              placeholder="Dual AC, Roof Carrier, Pushback Seats, Hill Specialist Chauffeur"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description / Notes</label>
            <textarea
              rows="3"
              value={carForm.description}
              onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
              placeholder="Ideal for Himachal hill travel, comfortable seating, reliable performance..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAvailable"
              checked={carForm.isAvailable}
              onChange={(e) => setCarForm({ ...carForm, isAvailable: e.target.checked })}
              className="w-4 h-4 text-brand-600 rounded"
            />
            <label htmlFor="isAvailable" className="text-xs font-bold text-slate-700 cursor-pointer">
              Mark as Available for Booking
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCarModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submittingCar}
            >
              {editingCarId ? 'Save Changes' : 'Add to Fleet'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* SERVICE MODAL */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title={editingServiceId ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleServiceSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Service Title *</label>
            <input
              type="text"
              value={serviceForm.title}
              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Short Description *</label>
            <input
              type="text"
              value={serviceForm.shortDescription}
              onChange={(e) => setServiceForm({ ...serviceForm, shortDescription: e.target.value })}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Description</label>
            <textarea
              rows="3"
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
            ></textarea>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Features (comma-separated)</label>
            <input
              type="text"
              value={serviceForm.features}
              onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
              placeholder="Feature 1, Feature 2, Feature 3"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsServiceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submittingService}
            >
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Services;
