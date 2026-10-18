import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceApi } from '../services/serviceApi';
import { carApi } from '../services/carApi';
import {
  Compass,
  Car,
  Hotel,
  Plane,
  Heart,
  Briefcase,
  Sliders,
  Users2,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  Users,
  Fuel,
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { getExactCarImage } from '../services/carApi';

export const Services = () => {
  const navigate = useNavigate();

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
        'Experienced Hill Chauffeur'
      ],
      description: 'The premier choice for hill travel. Exceptional comfort, high safety rating, and ample luggage room for family tours across Himachal Pradesh.'
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
      description: 'Ultra-luxurious hybrid cruiser for VIPs, executives, and luxury family holidays across Himachal Pradesh.'
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
        'Smooth Mountain Suspension',
        'Hill-Certified Driver'
      ],
      description: 'Budget-friendly yet remarkably spacious. Perfect for small families, local Kangra temple circuits, and airport pickups.'
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
      description: 'Most popular and economical choice for couples, solo travelers, and city tours across Kangra, Dharamshala, and Chamunda Devi.'
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
      description: 'Remarkably roomy sedan renowned for rugged reliability, comfort, and generous luggage room for mountain touring.'
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
      description: 'Agile and budget-friendly. Navigates narrow mountain lanes and temple roads with ease.'
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
      description: 'Built tough for rough Himalayan terrains. Best suited for high-altitude expeditions to Rohtang Pass, Spiti Valley, and snow passes.'
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
      description: 'The ultimate beast for luxury travel, high mountain passes, and snowy winter expeditions across Himachal.'
    },
    {
      _id: 'c9',
      name: 'Force Urbania Luxury Van',
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
      description: 'Next-generation European luxury van for executive groups, high-end family trips, and corporate delegates.'
    },
    {
      _id: 'c10',
      name: 'Force Tempo Traveller (12-Seater)',
      category: 'Tempo Traveller',
      seatingCapacity: '12 + 1 Passengers',
      luggageCapacity: 'Rear Boot + Heavy Roof Carrier',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
      features: [
        '1x1 & 2x1 Reclining Pushback Seats',
        'Individual AC Vents & Reading Lights',
        'Music Surround Sound',
        'Spacious Center Walkway'
      ],
      description: 'First-class group luxury. Ideal for joint families, corporate offsites, and wedding guest transfers across Himachal.'
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
        'First Aid & Fire Safety'
      ],
      description: 'Maximum capacity with supreme comfort for large pilgrim groups, college batches, and extended family holidays across North India.'
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
      description: 'The ultimate group carrier for weddings, school excursions, and grand Himachal temple pilgrimages.'
    }
  ];

  // Fleet / Cars state initialized with fallbackCars so it is never empty
  const [cars, setCars] = useState(fallbackCars);
  const [loadingCars, setLoadingCars] = useState(false);
  const [selectedCarCategory, setSelectedCarCategory] = useState('All');

  // Services state
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const fallbackServices = [
    {
      title: 'Chauffeur Cab & Taxi Services',
      desc: 'Sanitized AC sedans, SUVs, and luxury Tempo Travellers driven by experienced hill-certified chauffeurs.',
      icon: Car,
      features: ['Fixed Transparent Fares', 'Zero Cancellation Fees', 'Punctual Doorstep Pickups']
    },
    {
      title: 'Customized Tour Packages',
      desc: 'Bespoke domestic and international holiday plans personalized to your travel pace, budget, and dates.',
      icon: Compass,
      features: ['100% Tailored Day-by-Day Itineraries', 'Handpicked 3/4/5-Star Hotels', 'Dedicated Tour Guide Option']
    },
    {
      title: 'Airport & Railway Transfers',
      desc: 'Punctual meet-and-greet transfers for Gaggal (Kangra) Airport, Pathankot, Amritsar, and Chandigarh.',
      icon: Clock,
      features: ['Flight Tracking Technology', 'Luggage Handling Assistance', 'Zero Surge Pricing']
    },
    {
      title: 'Hotel & Resort Booking',
      desc: 'Special negotiated rates at verified family resorts, boutique mountain chalets, and heritage palaces.',
      icon: Hotel,
      features: ['Verified Cleanliness & Hygiene', 'Complimentary Breakfast Inclusions', 'Prime Scenic Locations']
    },
    {
      title: 'Adventure Expeditions & Paragliding',
      desc: 'Authorized bookings for Bir Billing paragliding, Solang skiing, Beas rafting, and high-pass trekking.',
      icon: Sliders,
      features: ['Authorized Permit Assistance', 'Certified Safety Equipment', 'Experienced Local Guides']
    },
    {
      title: 'Honeymoon Special Packages',
      desc: 'Romantic escapes in Kashmir, Manali, Goa, and Kerala featuring candlelit dinners and floral setups.',
      icon: Heart,
      features: ['Romantic Candlelit Dinners', 'Balcony Mountain Views', 'Complimentary Honeymoon Cake']
    },
    {
      title: 'Corporate Travel & MICE',
      desc: 'Hassle-free corporate retreats, team offsites, conferences, and executive ground logistics.',
      icon: Briefcase,
      features: ['Dedicated Account Manager', 'GST Invoicing & Compliance', 'AV Equipment & Event Coordination']
    },
    {
      title: 'Large Group & Pilgrim Tours',
      desc: 'Luxury 12 to 26-seater Tempo Travellers for joint families, weddings, Chamunda-Jawalaji yatra, and college tours.',
      icon: Users2,
      features: ['Spacious Recliner Seats', 'Experienced Fleet Chauffeurs', 'Flexible Multiple Stops']
    }
  ];

  // Fetch Cars with graceful fallback
  const fetchCars = async () => {
    try {
      const res = await carApi.getAll();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCars(res.data);
      }
    } catch (err) {
      console.warn('Using stored/fallback cars');
    } finally {
      setLoadingCars(false);
    }
  };

  // Fetch Services
  const fetchServices = async () => {
    try {
      const res = await serviceApi.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setServices(res.data);
      }
    } catch (err) {
      console.warn('Using fallback services');
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchServices();

    const handleCarsUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCars(e.detail);
      } else {
        fetchCars();
      }
    };
    const handleServicesUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setServices(e.detail);
      } else {
        fetchServices();
      }
    };

    window.addEventListener('rtt_cars_updated', handleCarsUpdate);
    window.addEventListener('rtt_services_updated', handleServicesUpdate);

    return () => {
      window.removeEventListener('rtt_cars_updated', handleCarsUpdate);
      window.removeEventListener('rtt_services_updated', handleServicesUpdate);
    };
  }, []);

  const carCategories = ['All', 'SUV', 'Luxury', 'MUV', 'Sedan', 'Hatchback', '4x4 Off-Road', 'Tempo Traveller'];

  const filteredCars = cars.filter(c => {
    if (selectedCarCategory === 'All') return true;
    return c.category === selectedCarCategory;
  });

  const getWhatsAppLink = (carName) => {
    const message = `Hello Vista Tour and Travels, I want to inquire about booking the ${carName} for my upcoming trip. Please share availability and rates.`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-3.5 py-1 rounded-full mb-3 border border-amber-400/30">
            <Compass className="w-3.5 h-3.5" /> Vista Tour and Travels • 5.0 ★ Google Rated
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Our Taxi Fleet & Travel Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Choose from our premium sanitized fleet of SUVs, Sedans, Hatchbacks, 4x4 Off-Roaders, and Tempo Travellers. Driven by police-verified, certified mountain chauffeurs across Himachal Pradesh.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <a
              href="tel:9876543210"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-colors"
            >
              <Phone className="w-4 h-4" /> Call: +91 98765 43210
            </a>
            <a
              href="https://wa.me/919876543210?text=Hello%20Vista%20Tour%20and%20Travels,%20I%20want%20to%20inquire%20about%20cab%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Instant WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: CAB & CAR MODELS FLEET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-14">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest inline-flex items-center gap-1 bg-brand-50 px-3 py-1 rounded-full mb-2">
            <Car className="w-3.5 h-3.5" /> Available Car Models
          </span>
          <h2 className="text-3xl font-black text-navy-900">
            Our Taxi & Cab Fleet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Clean, sanitized, and commercial-licensed vehicles equipped for smooth hill driving and highway tours.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {carCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCarCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCarCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cars Grid */}
        {loadingCars ? (
          <div className="py-16 flex justify-center">
            <Loader size="lg" text="Loading available car fleet..." />
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No cars found in this category</h3>
            <p className="text-xs text-slate-400 mt-1">Please select "All" to view our complete vehicle fleet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-card hover:border-brand-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Car Image with Category and Availability */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={car.image && !car.image.includes('images.unsplash.com') ? car.image : getExactCarImage(car.name)}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getExactCarImage(car.name);
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-navy-950/85 text-white backdrop-blur-md shadow-sm">
                        {car.category}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-sm shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Available
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-base font-black text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                        {car.name}
                      </h3>
                      {car.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {car.description}
                        </p>
                      )}
                    </div>

                    {/* Specs Row */}
                    <div className="grid grid-cols-3 gap-1 py-2 border-y border-slate-100 text-center bg-slate-50/70 rounded-xl p-1.5">
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Seats</span>
                        <span className="text-[11px] font-bold text-navy-900 flex items-center justify-center gap-0.5">
                          <Users className="w-3 h-3 text-brand-600" /> {car.seatingCapacity?.replace('Passengers', 'P')?.replace('Seats', 'S')}
                        </span>
                      </div>
                      <div className="space-y-0.5 border-x border-slate-200">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Luggage</span>
                        <span className="text-[11px] font-bold text-navy-900 flex items-center justify-center gap-0.5 truncate px-0.5" title={car.luggageCapacity}>
                          <Briefcase className="w-3 h-3 text-brand-600 shrink-0" /> <span className="truncate">{car.luggageCapacity?.slice(0, 10)}</span>
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Fuel</span>
                        <span className="text-[11px] font-bold text-navy-900 flex items-center justify-center gap-0.5">
                          <Fuel className="w-3 h-3 text-brand-600" /> {car.fuelType?.split('/')[0]?.trim()}
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    {car.features && car.features.length > 0 && (
                      <div className="space-y-1 pt-0.5">
                        {car.features.slice(0, 2).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 truncate">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Best Mountain Rates / Instant Quote */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Best Hill Rates</span>
                      </div>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Instant Quote
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <a
                    href={getWhatsAppLink(car.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition-colors text-center shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>

                  <Button
                    variant="primary"
                    onClick={() => navigate(`/contact?service=${encodeURIComponent(`Cab Booking: ${car.name}`)}`)}
                    className="text-xs font-bold py-2 px-2.5"
                  >
                    Book Cab <ArrowRight className="w-3 h-3 ml-0.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: WHY HIRE VISTA TOUR AND TRAVELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest inline-flex items-center gap-1 bg-amber-400/20 px-3 py-1 rounded-full mb-3 border border-amber-400/30">
              <Award className="w-3.5 h-3.5" /> Vista Tour and Travels Guarantee
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              Safe Mountain Chauffeurs & Punctual Doorstep Cabs
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Driving on Himalayan bends requires expert skill and local familiarity. All our cab drivers have 8+ years of mountain driving experience, valid commercial hill permits, police verification, and extensive knowledge of scenic viewpoints and shortcuts.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <span className="text-2xl font-black text-amber-400 block">5.0 ★</span>
                <span className="text-xs text-slate-300">Google Rating</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white block">10,000+</span>
                <span className="text-xs text-slate-300">Safe Hill Trips</span>
              </div>
              <div>
                <span className="text-2xl font-black text-white block">24/7</span>
                <span className="text-xs text-slate-300">Helpline Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPREHENSIVE TRAVEL SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest inline-flex items-center gap-1 bg-brand-50 px-3 py-1 rounded-full mb-2">
            <Compass className="w-3.5 h-3.5" /> Complete Travel Logistics
          </span>
          <h2 className="text-3xl font-black text-navy-900">
            More Travel Services by Vista Travels
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Beyond cabs, we organize full holiday tours, flight/train reservations, hotel bookings, and adventure activities across North India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fallbackServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 hover:shadow-card hover:border-brand-100 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-navy-900 mb-2">{service.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">
                    {service.desc}
                  </p>

                  <ul className="space-y-1.5 mb-6 border-t border-slate-100 pt-4">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/contact?service=${encodeURIComponent(service.title)}`)}
                  className="w-full text-xs font-bold py-2 hover:bg-brand-50 hover:text-brand-700"
                >
                  Inquire Now <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Services;
