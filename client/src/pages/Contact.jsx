import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';
import { inquiryApi } from '../services/inquiryApi';
import { pageApi } from '../services/pageApi';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  CheckCircle2,
  PhoneCall,
  Bell,
  Sparkles
} from 'lucide-react';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export const Contact = () => {
  const { settings } = useWebsite();
  const [searchParams] = useSearchParams();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await pageApi.getBySlug('contact');
        if (res.success && res.data) {
          setPageData(res.data);
        }
      } catch (err) {
        console.warn('Contact page content fallback');
      }
    };
    fetchPage();
  }, []);

  const adminPhone = settings?.phone || '+91 90688 88578';
  const adminRawPhone = '919068888578';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: searchParams.get('destination')
      ? `Inquiry for ${searchParams.get('destination')} Tour`
      : searchParams.get('service')
      ? `Inquiry for ${searchParams.get('service')}`
      : '',
    destination: searchParams.get('destination') || '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastInquiry, setLastInquiry] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getAdminWhatsAppLink = (data) => {
    const text = `🔔 *NEW TRAVEL INQUIRY - Vista Tour and Travels*\n` +
      `👤 *Customer Name:* ${data.name || 'Traveler'}\n` +
      `📞 *Customer Phone:* ${data.phone || 'Not provided'}\n` +
      `✉️ *Email:* ${data.email || 'Not provided'}\n` +
      `📍 *Subject / Destination:* ${data.subject || data.destination || 'Haryana / NCR Tour'}\n` +
      `💬 *Message / Requirement:* ${data.message || 'Custom tour quote needed'}\n` +
      `🌐 *Source:* Vista Tour and Travels Website`;
    return `https://wa.me/${adminRawPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e, directWhatsApp = false) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    const currentData = { ...formData };

    try {
      setLoading(true);
      const res = await inquiryApi.create(currentData);
      if (res.success) {
        setLastInquiry(currentData);
        setSubmitted(true);
        toast.success(res.message || 'Inquiry submitted! Admin (+91 90688 88578) notified on WhatsApp.');

        // Automatically open WhatsApp with inquiry details for instant admin update
        const waUrl = res.whatsappUrl || getAdminWhatsAppLink(currentData);
        try {
          window.open(waUrl, '_blank', 'noopener,noreferrer');
        } catch (e) {
          console.warn('Popup blocked, WhatsApp link available in confirmation screen.');
        }

        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          destination: '',
          message: ''
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="absolute -top-24 left-1/3 w-96 h-96 bg-brand-500/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-24 right-1/3 w-96 h-96 bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 uppercase tracking-widest bg-brand-500/20 px-3 py-1 rounded-full mb-3 border border-brand-400/30">
            <Headphones className="w-3.5 h-3.5" /> {pageData?.hero?.badge || 'Direct Dispatch Hotline Connected'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            {pageData?.hero?.title || 'Contact & Travel Inquiries'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {pageData?.hero?.subtitle || (
              <>
                Inquiries are linked directly to Admin Vista (<span className="text-amber-400 font-bold">{settings.phone || '+91 90688 88578'}</span>) for instant notification and fast booking confirmation.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 1 Col: Contact Info Cards */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass border border-white/80 space-y-6">
            <h3 className="text-xl font-bold text-navy-900">Direct Office Contacts</h3>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900">Registered Office</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {settings.address || 'Nawarsi Bazar, Ladwa, Haryana 136132, India'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900">Admin Phone Support (24/7)</h4>
                <a href={`tel:${settings.phone || '9068888578'}`} className="text-xs text-brand-600 font-bold mt-1 block">
                  {settings.phone || '+91 90688 88578'}
                </a>
                {settings.altPhone && (
                  <a href={`tel:${settings.altPhone}`} className="text-xs text-slate-500 block">
                    {settings.altPhone}
                  </a>
                )}
                <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                  Instant Dispatch
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900">Email Inquiries</h4>
                <a href={`mailto:${settings.email && !settings.email.includes('rinku') ? settings.email : 'info@vistatourtravels.com'}`} className="text-xs text-brand-600 font-semibold mt-1 block">
                  {settings.email && !settings.email.includes('rinku') ? settings.email : 'info@vistatourtravels.com'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-navy-900">Office Working Hours</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {settings.businessHours || 'Mon - Sun: 24/7 Emergency & Taxi Dispatch'}
                </p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${adminRawPhone}?text=${encodeURIComponent('Hi Vista Tour and Travels, I have an inquiry regarding tour & taxi service.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Admin (+91 90688 88578)
            </a>
          </div>
        </div>

        {/* Right 2 Cols: Form + Google Maps */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-glass border border-white/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h2 className="text-2xl font-bold text-navy-900">Send Us an Inquiry</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                <Bell className="w-3.5 h-3.5 text-amber-600" /> Linked to Admin (+91 90688 88578)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your trip details below. Your request is linked directly to Dispatch Admin (+91 90688 88578) for swift confirmation.
            </p>

            {submitted ? (
              <div className="p-6 sm:p-8 text-center bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy-900">Inquiry Received & Linked with Admin!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you, <strong>{lastInquiry?.name || 'Traveler'}</strong>! Your inquiry is logged in our portal. You can now notify Dispatch Admin directly on WhatsApp for an immediate response.
                </p>

                {/* Direct Admin Notification Box */}
                <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm max-w-md mx-auto mb-6 text-left">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Admin Dispatch Notification
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Hotline: +91 90688 88578
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4">
                    Send inquiry details directly to <strong>Dispatch Admin (+91 90688 88578)</strong> on WhatsApp:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={lastInquiry ? getAdminWhatsAppLink(lastInquiry) : `https://wa.me/${adminRawPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                    >
                      <MessageCircle className="w-4 h-4" /> Notify Admin on WhatsApp
                    </a>

                    <a
                      href={`tel:${adminRawPhone}`}
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md transition-all shrink-0"
                    >
                      <PhoneCall className="w-4 h-4" /> Call Admin
                    </a>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                {/* Admin notification live badge banner */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-900">Direct Admin Hotline Linked</p>
                      <p className="text-[11px] text-amber-900">Submitting here notifies Dispatch Admin on <strong>+91 90688 88578</strong></p>
                    </div>
                  </div>
                  <a
                    href={`tel:${adminRawPhone}`}
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shrink-0 transition-colors"
                  >
                    Call +91 90688 88578
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rahul Sen"
                      className="w-full text-sm rounded-xl glass-input px-3.5 py-2.5 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="e.g. rahul@example.com"
                      className="w-full text-sm rounded-xl glass-input px-3.5 py-2.5 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. +91 90688 88578"
                      className="w-full text-sm rounded-xl glass-input px-3.5 py-2.5 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Kurukshetra Spiritual Tour or Delhi Cab Inquiry"
                      className="w-full text-sm rounded-xl glass-input px-3.5 py-2.5 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Message / Requirement *</label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us your travel dates, number of travelers, budget, or any specific questions..."
                    className="w-full text-sm rounded-xl glass-input px-3.5 py-2.5 transition-colors"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full sm:flex-1 py-3 font-bold text-xs shadow-md"
                  >
                    <Send className="w-4 h-4 mr-2" /> Submit Inquiry
                  </Button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={(e) => handleSubmit(e, true)}
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Submit & Notify Admin on WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Google Maps Embed Section (Glassmorphism) */}
          <div className="glass-panel rounded-3xl p-4 shadow-glass border border-white/80 overflow-hidden">
            <iframe
              title="Vista Tour and Travels Office Location"
              src="https://maps.google.com/maps?q=29.9943, 77.0494+(Vista+Tour+and+Travels)&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="320"
              style={{ border: 0, borderRadius: '1rem' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
