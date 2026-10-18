import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carApi, getExactCarImage } from '../../services/carApi';
import {
  Car,
  Users,
  Fuel,
  Briefcase,
  PhoneCall,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const fallbackFleet = [
  {
    _id: 'car-innova-crysta',
    name: 'Toyota Innova Crysta (7+1 Luxury SUV)',
    category: 'SUV',
    seatingCapacity: '7 + 1 Chauffeur',
    luggageCapacity: '3-4 Large Bags + Rooftop Carrier',
    fuelType: 'Diesel',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800',
    features: [
      'Dual Front & Rear Chill AC',
      'Plush Reclining Captain Seats',
      'Generous Legroom for Long Journeys',
      'Verified Highway-Expert Chauffeur'
    ],
    description: 'The undisputed monarch of road trips. Outstanding suspension, comfort, and reliability for Kurukshetra, Ambala, Delhi NCR, and Chandigarh routes.',
    isAvailable: true
  },
  {
    _id: 'car-innova-hycross',
    name: 'Toyota Innova Hycross (Hybrid Comfort)',
    category: 'SUV',
    seatingCapacity: '7 + 1 Chauffeur',
    luggageCapacity: '4 Large Suitcases',
    fuelType: 'Hybrid',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Toyota_Kijang_Innova_Zenix_2.0_Q_Hybrid_Modellista_(front),_West_Surabaya.jpg?width=800',
    features: [
      'Panoramic Sunroof & Ambient Light',
      'Ultra Silent Hybrid Powertrain',
      'First Class Ottoman Lounge Seating',
      'Phone Fast Charging & High-End Audio'
    ],
    description: 'Next-generation luxury for VIP tours, executive delegates, and family journeys requiring supreme highway refinement across Haryana & Delhi NCR.',
    isAvailable: true
  },
  {
    _id: 'car-ertiga',
    name: 'Maruti Suzuki Ertiga (Smart MUV)',
    category: 'MUV',
    seatingCapacity: '6 + 1 Chauffeur',
    luggageCapacity: '2 Large Bags + Roof Carrier',
    fuelType: 'Petrol / Hybrid',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ertiga(2).jpg?width=800',
    features: [
      'Roof Mounted AC Blower Vents',
      'Modular 3-Row Foldable Seating',
      'Smooth Highway & City Ride',
      'USB Ports in All Rows'
    ],
    description: 'The preferred family choice offering unbeatable value, high mileage, and spacious seating for Kurukshetra, Kaithal, and Karnal trips.',
    isAvailable: true
  },
  {
    _id: 'car-dzire',
    name: 'Maruti Suzuki Dzire (Premium Sedan)',
    category: 'Sedan',
    seatingCapacity: '4 + 1 Chauffeur',
    luggageCapacity: '2 Large + 2 Hand Bags',
    fuelType: 'Petrol',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Dzire_VXi_VVT_(front).JPG?width=800',
    features: [
      'Effective Auto Climate Control',
      'Deep 378L Boot Trunk Capacity',
      'Bluetooth Music System',
      'Ideal for Couples & Small Families'
    ],
    description: 'Comfortable, compact sedan for 24/7 Delhi IGI & Chandigarh airport transfers, local Ladwa trips, and fast outstation travel.',
    isAvailable: true
  },
  {
    _id: 'car-scorpio',
    name: 'Mahindra Scorpio-N (Tough Highway SUV)',
    category: 'SUV',
    seatingCapacity: '6 + 1 Chauffeur',
    luggageCapacity: '3 Large Bags + Heavy Roof Carrier',
    fuelType: 'Diesel',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio.jpg?width=800',
    features: [
      'High Ground Clearance & Sturdy Build',
      'Electronic Terrain Modes & High Torque Engine',
      'Commanding Seating & Safety',
      'Pothole & Rough Highway Armor'
    ],
    description: 'Powerful and commanding SUV for all-weather cruising across Haryana, GT Road (NH 44), and regional excursions.',
    isAvailable: true
  },
  {
    _id: 'car-alto',
    name: 'Maruti Suzuki Alto K10 (Budget City Cab)',
    category: 'Hatchback',
    seatingCapacity: '3 + 1 Chauffeur',
    luggageCapacity: '2 Medium Bags',
    fuelType: 'Petrol',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_-_Alto_800_LXi.JPG?width=800',
    features: [
      'Nimble Handling for City Traffic & Local Markets',
      'Efficient Engine for Cost-Effective Travel',
      'Chilling AC & Comfortable Seating',
      'Most Economical Per-KM Fare'
    ],
    description: 'Pocket-friendly cab for solo travelers, couples, and fast point-to-point journeys across Ladwa, Kurukshetra, and nearby districts.',
    isAvailable: true
  },
  {
    _id: 'car-urbania',
    name: 'Force Urbania Luxury Van (10-Seater)',
    category: 'Tempo Traveller',
    seatingCapacity: '10 + 1 Chauffeur',
    luggageCapacity: 'Spacious Dedicated Luggage Boot',
    fuelType: 'Diesel',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
    features: [
      'Individual Business-Class Reclining Seats',
      'Aerodynamic European Styling & Wide Aisles',
      'Sealed Dust-Free Cabin with Triple AC',
      'Panoramic View Tinted Windows'
    ],
    description: 'The gold standard of luxury group travel in Haryana and Delhi NCR. Unmatched ride smoothness, quietness, and high-roof cabin space.',
    isAvailable: true
  },
  {
    _id: 'car-tempo-17',
    name: 'Force Tempo Traveller (17-Seater Deluxe)',
    category: 'Tempo Traveller',
    seatingCapacity: '17 + 1 Chauffeur',
    luggageCapacity: 'Extra Heavy Overhead Carrier',
    fuelType: 'Diesel',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
    features: [
      'Wide 2x1 Reclining Luxury Seats',
      'Dual High-Capacity AC Units',
      'High-Roof Stand-up Cabin Height',
      'Senior Verified Chauffeur'
    ],
    description: 'Maximum capacity with supreme comfort for large pilgrim groups visiting Kurukshetra Jyotisar, family functions, and weddings.',
    isAvailable: true
  }
];

export const FleetPreview = () => {
  const [cars, setCars] = useState(fallbackFleet);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchCars = async () => {
    try {
      const res = await carApi.getAll();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCars(res.data);
      }
    } catch {
      // use stored or fallback fleet
    }
  };

  useEffect(() => {
    fetchCars();

    const handleCarsUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCars(e.detail);
      } else {
        fetchCars();
      }
    };

    window.addEventListener('rtt_cars_updated', handleCarsUpdate);
    return () => window.removeEventListener('rtt_cars_updated', handleCarsUpdate);
  }, []);

  const categories = ['All', 'SUV', 'Sedan', 'MUV', '4x4 Off-Road', 'Tempo Traveller'];

  const filteredCars = cars.filter(car => {
    if (selectedCategory === 'All') return true;
    return car.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Display top 8 cars on homepage for optimal performance and grid balance
  const displayedCars = filteredCars.slice(0, 8);

  const getWhatsAppBookingLink = (carName) => {
    const text = encodeURIComponent(
      `Hello Vista Tour and Travels! I would like to check availability and get a quote for booking the ${carName} for my journey.`
    );
    return `https://wa.me/919068888578?text=${text}`;
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Glow Elements for Glassmorphic Cars */}
      <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/60 text-brand-600 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <Car className="w-3.5 h-3.5" /> Premium Chauffeur-Driven Fleet
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              Our Cabs & Vehicle Fleet
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl font-medium">
              Travel comfortably across Kurukshetra, Ambala, Delhi NCR, Karnal, Panipat, Yamunanagar, Kaithal, and Chandigarh with verified cabs and professional chauffeurs.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 group shrink-0 transition-colors self-start md:self-auto"
          >
            Explore Complete Fleet & Services{' '}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat === 'All' ? 'All Fleet Models' : cat}
            </button>
          ))}
        </div>

        {/* Car Cards Grid - 4 Columns on Large Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedCars.map((car) => {
            const features = Array.isArray(car.features)
              ? car.features.slice(0, 3)
              : typeof car.features === 'string'
              ? car.features.split(',').slice(0, 3)
              : [];

            return (
              <div
                key={car._id || car.name}
                className="glass-panel glass-panel-hover rounded-2xl border border-white/80 shadow-glass hover:shadow-glass-hover transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={car.image && !car.image.includes('images.unsplash.com') ? car.image : getExactCarImage(car.name)}
                    alt={car.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getExactCarImage(car.name);
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Category Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-navy-900/85 backdrop-blur-sm text-white text-[11px] font-extrabold tracking-wide uppercase shadow-sm">
                    {car.category || 'SUV'}
                  </span>

                  {/* Availability Badge */}
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Available
                  </span>
                </div>

                {/* Content Container */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-navy-900 leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {car.name}
                    </h3>
                    <p className="mt-1 text-slate-500 text-xs line-clamp-2 leading-relaxed">
                      {car.description}
                    </p>
                  </div>

                  {/* Spec Icons */}
                  <div className="grid grid-cols-2 gap-1.5 py-2 border-y border-slate-100 text-[11px] text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <Users className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{car.seatingCapacity || '4+1 Seater'}</span>
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

                  {/* Features Bullet List */}
                  {features.length > 0 && (
                    <div className="space-y-1">
                      {features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing Badge (Transparent / Zero Numeric Price) */}
                  <div className="pt-1">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold">
                      <Sparkles className="w-3 h-3" /> Best Rates & Transparent Billing Guaranteed
                    </div>
                  </div>

                  {/* Action Buttons: WhatsApp & Call */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <a
                      href={getWhatsAppBookingLink(car.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all"
                      title="Instant WhatsApp Quote"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Book Cab
                    </a>

                    <a
                      href="tel:9068888578"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                      title="Call Taxi Service"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-brand-600" /> Call Now
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Banner (Glassmorphism Dark) */}
        <div className="mt-12 glass-dark rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl border border-white/15 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">Govt. Authorized Commercial Fleet</h4>
              <p className="text-xs text-slate-300">All commercial permits, full insurance coverage, and verified professional chauffeurs included.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:9068888578"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-navy-900 hover:bg-slate-100 text-xs font-bold transition-colors shadow"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" /> +91 90688 88578
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
            >
              View Fleet <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FleetPreview;
