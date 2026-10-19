import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { packageApi } from '../services/packageApi';
import { bookingApi } from '../services/bookingApi';
import {
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Phone,
  Mail,
  User,
  Home,
  Car,
  Star,
  MessageCircle
} from 'lucide-react';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export const Booking = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    travelDate: searchParams.get('date') || '',
    adults: searchParams.get('passengers') === '3-4' ? 4 : searchParams.get('passengers') === '5-7' ? 6 : 2,
    children: 0,
    vehicleType: searchParams.get('cab') === 'sedan' ? 'Dzire / Etios (Sedan)' : searchParams.get('cab') === 'suv' ? 'Ertiga (SUV)' : 'Innova Crysta / Ertiga',
    pickupLocation: searchParams.get('from') || searchParams.get('pickup') || 'Ladwa / Kurukshetra / Chandigarh / Delhi Airport',
    specialRequirements: ''
  });

  const [carsList, setCarsList] = useState([]);

  const defaultBookingTarget = {
    _id: 'custom-tour-booking',
    title: searchParams.get('to') ? `${searchParams.get('to')} Tour & Cab Booking` : 'Haryana & Delhi NCR Chauffeur Cab & Tour Booking',
    duration: 'Customized Itinerary',
    featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=800',
    description: 'Personalized door-to-door travel with licensed commercial cabs and experienced professional highway chauffeurs.',
    inclusions: [
      'Sanitized Commercial Chauffeur Cab',
      'Experienced Verified Driver',
      'All Fuel, Toll Taxes & State Border Permits Included',
      '24/7 On-Road Assistance'
    ]
  };

  useEffect(() => {
    // Load active commercial fleet
    const loadCars = async () => {
      try {
        const res = await carApi.getAll();
        if (res.success && res.data) {
          setCarsList(res.data);
        }
      } catch (e) {}
    };
    loadCars();

    const fetchPackage = async () => {
      setLoading(true);
      if (!packageId) {
        setPkg(defaultBookingTarget);
        setLoading(false);
        return;
      }
      try {
        const res = await packageApi.getBySlug(packageId);
        if (res.success && res.data) {
          setPkg(res.data);
        } else {
          setPkg(defaultBookingTarget);
        }
      } catch (err) {
        setPkg(defaultBookingTarget);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  const adultCount = Math.max(1, parseInt(formData.adults, 10) || 1);
  const childCount = Math.max(0, parseInt(formData.children, 10) || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.phone || !formData.travelDate) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    try {
      setSubmitting(true);
      const bookingPayload = {
        packageId: pkg?._id || 'custom-tour-booking',
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        travelDate: formData.travelDate,
        adults: adultCount,
        children: childCount,
        pickupLocation: formData.pickupLocation,
        vehicleType: formData.vehicleType,
        service: pkg?.title || 'Haryana & Delhi NCR Tour & Cab Booking',
        specialRequirements: `${formData.specialRequirements} [Preferred Cab: ${formData.vehicleType}]`
      };

      const res = await bookingApi.create(bookingPayload);
      if (res.success && res.data) {
        setConfirmedBooking(res.data);
        toast.success('Your tour & taxi booking request was submitted successfully!');

        // Dispatch instant WhatsApp alert directly to Admin (+91 90688 88578)
        const waText = `🛎️ *NEW TOUR & CAB BOOKING - VISTA TRAVELS*\n\n` +
          `📌 *Booking Ref:* ${res.data.bookingNumber || 'VTT-' + Date.now().toString().slice(-6)}\n` +
          `🚗 *Tour/Cab:* ${pkg?.title || 'Tour & Cab Booking'}\n` +
          `👤 *Customer Name:* ${formData.customerName}\n` +
          `📞 *Customer Phone:* ${formData.phone}\n` +
          `✉️ *Email:* ${formData.email || 'N/A'}\n` +
          `📍 *Pickup:* ${formData.pickupLocation || 'Ladwa / Nawarsi Bazar'}\n` +
          `📅 *Travel Date:* ${formData.travelDate}\n` +
          `👥 *Travelers:* ${adultCount} Adult(s), ${childCount} Child(ren)\n` +
          `🚙 *Cab Preference:* ${formData.vehicleType || 'Any'}\n` +
          `💬 *Notes:* ${formData.specialRequirements || 'None'}\n\n` +
          `🌐 *Dispatch Portal:* Vista Tour and Travels (Nawarsi Bazar, Ladwa)`;

        const waUrl = `https://wa.me/919068888578?text=${encodeURIComponent(waText)}`;
        try {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        } catch (e) {
          console.warn('Popup blocked, WhatsApp button available on confirmation screen.');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Preparing tour & cab booking details..." />
      </div>
    );
  }

  const currentPkg = pkg || defaultBookingTarget;

  // Confirmation View (Price-Free)
  if (confirmedBooking) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/80 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Booking Inquiry Placed
          </span>

          <h1 className="text-3xl font-black text-navy-900 tracking-tight mt-3 mb-2">
            Thank You, {confirmedBooking.customerName}!
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            Your tour & cab request has been received by <strong>Vista Tour and Travels</strong>. We will call you within 30 minutes with cab confirmation and transparent rates.
          </p>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 mb-8 space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono font-bold text-brand-700">{confirmedBooking.bookingNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Tour Package:</span>
              <span className="font-bold text-navy-900">{currentPkg.title}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Travel Date:</span>
              <span className="font-bold text-navy-900">
                {new Date(confirmedBooking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Passengers:</span>
              <span className="font-bold text-navy-900">{confirmedBooking.adults} Adult(s), {confirmedBooking.children} Child(ren)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500">Assigned Service:</span>
              <span className="font-bold text-emerald-700">Chauffeur Driven Dedicated Cab</span>
            </div>
            <div className="flex justify-between py-1 pt-1 text-xs text-slate-500">
              <span>Immediate Helpline:</span>
              <a href="tel:9068888578" className="font-bold text-brand-600 hover:underline">+91 90688 88578</a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/919068888578?text=${encodeURIComponent(`*TOUR & CAB BOOKING INQUIRY*\nBooking ID: ${confirmedBooking.bookingNumber}\nPackage: ${currentPkg.title}\nPassenger: ${confirmedBooking.customerName}\nPhone: ${confirmedBooking.phone || confirmedBooking.customerPhone || ''}\nTravel Date: ${new Date(confirmedBooking.travelDate).toLocaleDateString('en-IN')}\nPassengers: ${confirmedBooking.adults} Adults, ${confirmedBooking.children} Children\nVehicle: ${confirmedBooking.vehicleType || 'Standard'}\nPickup: ${confirmedBooking.pickupLocation || 'Nawarsi Bazar, Ladwa'}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Notify Admin on WhatsApp
            </a>
            <a
              href="tel:9068888578"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md"
            >
              <Phone className="w-4 h-4" /> Call +91 90688 88578
            </a>
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Banner */}
      <div className="bg-navy-950 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/packages" className="hover:text-white">Packages</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-400">Book Tour & Cab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Book Tour: {pkg.title}
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Vista Tour and Travels • Chauffeur Driven Cab Included • Transparent Pricing
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primary Contact Details (Glassmorphism) */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-glass border border-white/80">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900">Lead Passenger Details</h3>
                    <p className="text-xs text-slate-400">Where we should send the booking confirmation and driver details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full text-sm rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 90688 88578"
                        className="w-full text-sm rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="name@example.com"
                        className="w-full text-sm rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">City / Home Address</label>
                    <div className="relative">
                      <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. Kurukshetra, Ladwa, Ambala, Delhi"
                        className="w-full text-sm rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Journey & Vehicle Preferences (Glassmorphism) */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-glass border border-white/80">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900">Journey & Taxi Preferences</h3>
                    <p className="text-xs text-slate-400">Tell us your dates, passengers, and vehicle preference</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Journey Start Date *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full text-sm rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Pickup Point</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        placeholder="Ladwa / Kurukshetra / Chandigarh / Delhi Airport / Railway Station"
                        className="w-full text-sm rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Number of Adults</label>
                    <select
                      name="adults"
                      value={formData.adults}
                      onChange={handleChange}
                      className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => (
                        <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Children (if any)</label>
                    <select
                      name="children"
                      value={formData.children}
                      onChange={handleChange}
                      className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500"
                    >
                      {[0, 1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} Child{n > 1 ? 'ren' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Cab / Vehicle</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:border-brand-500 font-medium"
                    >
                      {carsList.length > 0 ? (
                        carsList.map(c => (
                          <option key={c._id} value={c.name}>
                            {c.name} ({c.seatingCapacity})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Innova Crysta Luxury">Toyota Innova Crysta (6+1 Luxury SUV)</option>
                          <option value="Maruti Suzuki Ertiga">Maruti Suzuki Ertiga (Comfortable 5+1 SUV)</option>
                          <option value="Swift Dzire / Etios">Swift Dzire / Toyota Etios (Sedan 4+1)</option>
                          <option value="Tempo Traveller 12 Seater">Tempo Traveller (12 Seater Luxury)</option>
                          <option value="Tempo Traveller 17 Seater">Tempo Traveller (17 Seater Group)</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Special Requirements or Custom Requests</label>
                    <textarea
                      rows={3}
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      placeholder="e.g. Need baby seat, specific hotel tier preference, additional sightseeing spots in Kurukshetra / Delhi..."
                      className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                loading={submitting}
                className="w-full py-4 font-bold text-base shadow-xl"
              >
                Submit Tour & Cab Booking Request <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>

          {/* Right 1 Col: Trip Summary & Direct Phone Contact */}
          <div>
            <div className="glass-panel rounded-3xl p-6 shadow-glass border border-white/80 sticky top-24 space-y-6">
              <h3 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3">
                Trip Details
              </h3>

              {/* Package preview */}
              <div className="flex items-center gap-3">
                <img
                  src={currentPkg.featuredImage && !currentPkg.featuredImage.includes('unsplash') ? currentPkg.featuredImage : 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=400'}
                  alt={currentPkg.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=400';
                  }}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-navy-900 line-clamp-1">{currentPkg.title}</h4>
                  <p className="text-xs text-brand-600 font-bold">{currentPkg.duration}</p>
                  <p className="text-[11px] text-slate-400">{currentPkg.destinationName || 'Haryana & NCR'}</p>
                </div>
              </div>

              {/* Inclusions checklist */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sanitized AC Cab with Professional Chauffeur</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Verified 3/4 Star Stays & Daily Breakfast</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tolls, Parking, Fuel & Driver Allowance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>24/7 Helpline & On-Road Assistance</span>
                </div>
              </div>

              {/* Direct Phone Call Box */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Phone className="w-4 h-4 text-amber-600" /> Need Instant Confirmation?
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Call Vista Tour and Travels directly for immediate quotes and cab dispatch.
                </p>
                <a
                  href="tel:9068888578"
                  className="inline-flex items-center justify-center gap-1.5 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-lg text-xs transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Call +91 90688 88578
                </a>
              </div>

              <div className="bg-brand-50/60 p-4 rounded-xl border border-brand-100 text-xs text-brand-900 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-brand-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 5.0 Rated on Google
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Over 50+ verified reviews for reliable taxi service across Kurukshetra, Ladwa, Ambala, Chandigarh, and Delhi NCR.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
