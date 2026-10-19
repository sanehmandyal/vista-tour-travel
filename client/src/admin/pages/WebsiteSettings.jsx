import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { useWebsite, defaultSettings } from '../../context/WebsiteContext';
import { Settings, Save, Upload, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Navigation, Bell, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const defaultNav = [
  { id: 'nav-home', label: 'Home', path: '/', isEnabled: true, order: 1 },
  { id: 'nav-destinations', label: 'Destinations', path: '/destinations', isEnabled: true, order: 2 },
  { id: 'nav-packages', label: 'Tour Packages', path: '/packages', isEnabled: true, order: 3 },
  { id: 'nav-cars', label: 'Fleet & Cabs', path: '/cars', isEnabled: true, order: 4 },
  { id: 'nav-services', label: 'Taxi Services', path: '/services', isEnabled: true, order: 5 },
  { id: 'nav-about', label: 'About Us', path: '/about', isEnabled: true, order: 6 },
  { id: 'nav-contact', label: 'Contact', path: '/contact', isEnabled: true, order: 7 }
];

export const WebsiteSettings = () => {
  const { settings, updateSettingsState, refreshSettings } = useWebsite();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newNavItem, setNewNavItem] = useState({ label: '', path: '' });

  const [form, setForm] = useState(() => ({
    companyName: settings.companyName || defaultSettings.companyName,
    tagline: settings.tagline || defaultSettings.tagline,
    heroTitle: settings.heroTitle || defaultSettings.heroTitle,
    heroSubtitle: settings.heroSubtitle || defaultSettings.heroSubtitle,
    heroImage: settings.heroImage || defaultSettings.heroImage,
    logo: settings.logo || defaultSettings.logo,
    phone: settings.phone || defaultSettings.phone,
    secondaryPhone: settings.secondaryPhone || defaultSettings.secondaryPhone || '+91 99965 70920',
    altPhone: settings.altPhone || settings.secondaryPhone || defaultSettings.altPhone || '+91 99965 70920',
    email: (settings.email && !settings.email.includes('ravi') && !settings.email.includes('rinku')) ? settings.email : defaultSettings.email,
    address: settings.address || defaultSettings.address,
    serviceName: settings.serviceName || defaultSettings.serviceName,
    areasServed: settings.areasServed || defaultSettings.areasServed,
    googleRating: settings.googleRating || defaultSettings.googleRating,
    googleReviewCount: settings.googleReviewCount || defaultSettings.googleReviewCount,
    googleReviewsUrl: settings.googleReviewsUrl || defaultSettings.googleReviewsUrl,
    googleMapsUrl: settings.googleMapsUrl || defaultSettings.googleMapsUrl,
    facebook: settings.facebook || defaultSettings.facebook,
    instagram: settings.instagram || defaultSettings.instagram,
    youtube: settings.youtube || defaultSettings.youtube,
    whatsapp: settings.whatsapp || defaultSettings.whatsapp,
    businessHours: settings.businessHours || defaultSettings.businessHours,
    experienceYears: settings.experienceYears || defaultSettings.experienceYears,
    happyTravelers: settings.happyTravelers || defaultSettings.happyTravelers,
    destinationCount: settings.destinationCount || defaultSettings.destinationCount,
    supportHours: settings.supportHours || defaultSettings.supportHours,
    navigation: Array.isArray(settings.navigation) && settings.navigation.length > 0 ? settings.navigation : defaultNav,
    announcementBar: settings.announcementBar || { isEnabled: false, text: 'Special 10% discount on outstation bookings from Kurukshetra & Ladwa!', linkText: 'Book Now', linkUrl: '/contact' },
    footerText: settings.footerText || 'Premium 24/7 taxi service and customized tour packages based in Nawarsi Bazar, Ladwa (Kurukshetra, Haryana). Verified chauffeurs, sanitized cabs, and transparent rates.',
    copyrightText: settings.copyrightText || '© 2026 Vista Tour and Travels. All rights reserved. Registered Haryana Travel Operator.'
  }));

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminApi.getSettings();
        if (res.success && res.data) {
          const d = res.data;
          setForm(prev => ({
            ...prev,
            ...d,
            navigation: Array.isArray(d.navigation) && d.navigation.length > 0 ? d.navigation : (prev.navigation?.length > 0 ? prev.navigation : defaultNav),
            announcementBar: d.announcementBar || prev.announcementBar,
            footerText: d.footerText || prev.footerText,
            copyrightText: d.copyrightText || prev.copyrightText
          }));
        }
      } catch (err) {
        // use initial settings
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleNav = (index) => {
    setForm(prev => {
      const nav = [...prev.navigation];
      nav[index] = { ...nav[index], isEnabled: !nav[index].isEnabled };
      return { ...prev, navigation: nav };
    });
  };

  const handleUpdateNav = (index, field, value) => {
    setForm(prev => {
      const nav = [...prev.navigation];
      nav[index] = { ...nav[index], [field]: value };
      return { ...prev, navigation: nav };
    });
  };

  const handleMoveNav = (index, direction) => {
    setForm(prev => {
      const nav = [...prev.navigation];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= nav.length) return prev;
      const temp = nav[index];
      nav[index] = nav[targetIndex];
      nav[targetIndex] = temp;
      return { ...prev, navigation: nav };
    });
  };

  const handleRemoveNav = (index) => {
    setForm(prev => ({
      ...prev,
      navigation: prev.navigation.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddNav = () => {
    if (!newNavItem.label.trim() || !newNavItem.path.trim()) {
      toast.error('Navigation label and link path are required');
      return;
    }
    setForm(prev => ({
      ...prev,
      navigation: [
        ...prev.navigation,
        {
          id: `nav-${Date.now()}`,
          label: newNavItem.label.trim(),
          path: newNavItem.path.trim(),
          isEnabled: true,
          order: prev.navigation.length + 1
        }
      ]
    }));
    setNewNavItem({ label: '', path: '' });
    toast.success('Navigation link added!');
  };

  const handleAnnouncementChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      announcementBar: {
        ...prev.announcementBar,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file, 1920, 1080, 0.85);
      setForm(prev => ({ ...prev, heroImage: dataUri }));
      toast.success('Hero photo loaded from your device!');
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUri = await processDeviceImage(file, 400, 400, 0.9);
      setForm(prev => ({ ...prev, logo: dataUri }));
      toast.success('Website logo loaded from your device!');
    } catch (err) {
      toast.error(err.message || 'Logo upload failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      updateSettingsState(form);
      await adminApi.updateSettings(form);
      toast.success('Website settings saved & updated live across the site!');
    } catch (err) {
      updateSettingsState(form);
      toast.success('Website settings updated live!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading website configurations..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight">Website Settings & CMS</h1>
        <p className="text-xs text-slate-500">Update company branding, contact details, hero banner headline, and social media handles.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100 space-y-8">
        {/* 1. Brand & Hero Banner */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
            1. Brand & Homepage Hero Banner
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Hero Headline</label>
              <input
                type="text"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                name="heroSubtitle"
                value={form.heroSubtitle}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Logo</label>
              <div className="flex gap-2 items-center">
                {form.logo && (
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-100 border border-amber-400/30 shrink-0">
                    <img src={form.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <input
                  type="text"
                  name="logo"
                  value={form.logo || ''}
                  onChange={handleChange}
                  placeholder="/logo.jpg or upload from device"
                  className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shrink-0">
                  <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Logo'}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Hero Background Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="heroImage"
                  value={form.heroImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
                />
                <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shrink-0">
                  <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Photo'}
                  <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
                </label>
              </div>
              {form.heroImage && (
                <div className="mt-3 h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={form.heroImage} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
            2. Contact & Office Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Primary Phone (Navbar, WhatsApp & Hotline)</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-bold"
              />
              <span className="text-[10px] text-amber-600 font-medium">Only this number displays in Navbar & triggers WhatsApp</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Secondary Helpline Phone (Footer Only)</label>
              <input
                type="text"
                name="secondaryPhone"
                value={form.secondaryPhone || form.altPhone || '+91 99965 70920'}
                onChange={(e) => {
                  handleChange(e);
                  setForm(prev => ({ ...prev, altPhone: e.target.value }));
                }}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-bold text-emerald-700"
              />
              <span className="text-[10px] text-emerald-600 font-medium">Secondary helpline displayed exclusively in website footer</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Target Number</label>
              <input
                type="text"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Business Operating Hours</label>
              <input
                type="text"
                name="businessHours"
                value={form.businessHours}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Office Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. Nawarsi Bazar, Ladwa, Haryana 136132, India"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Areas Served (Taxi & Tour Operation)</label>
              <input
                type="text"
                name="areasServed"
                value={form.areasServed || ''}
                onChange={handleChange}
                placeholder="Kurukshetra, Ambala, Delhi NCR, Karnal, Panipat, Yamunanagar, Kaithal, Chandigarh, Ladwa..."
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Google Rating (e.g. 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                name="googleRating"
                value={form.googleRating || 5.0}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-bold text-amber-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Google Review Count (e.g. 46)</label>
              <input
                type="number"
                name="googleReviewCount"
                value={form.googleReviewCount || 46}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Google Reviews Web URL</label>
              <input
                type="text"
                name="googleReviewsUrl"
                value={form.googleReviewsUrl || ''}
                onChange={handleChange}
                placeholder="https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Social Media Links */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
            3. Social Media Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Facebook URL</label>
              <input
                type="text"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Instagram URL</label>
              <input
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">YouTube URL</label>
              <input
                type="text"
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Trust Statistics */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
            4. Agency Statistics Counters
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Experience Years</label>
              <input
                type="text"
                name="experienceYears"
                value={form.experienceYears}
                onChange={handleChange}
                placeholder="10+"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Happy Travelers</label>
              <input
                type="text"
                name="happyTravelers"
                value={form.happyTravelers}
                onChange={handleChange}
                placeholder="5000+"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Destinations</label>
              <input
                type="text"
                name="destinationCount"
                value={form.destinationCount}
                onChange={handleChange}
                placeholder="100+"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Support Hours</label>
              <input
                type="text"
                name="supportHours"
                value={form.supportHours}
                onChange={handleChange}
                placeholder="24/7"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 5. Navigation Menu Management */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-600" /> 5. Navigation Menu Management
              </h2>
              <p className="text-xs text-slate-500">Configure, reorder, or toggle header menu links on the public website.</p>
            </div>
          </div>

          <div className="space-y-2">
            {form.navigation.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
                  item.isEnabled ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveNav(idx, -1)}
                      className="p-1 rounded-md text-slate-400 hover:text-navy-900 disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === form.navigation.length - 1}
                      onClick={() => handleMoveNav(idx, 1)}
                      className="p-1 rounded-md text-slate-400 hover:text-navy-900 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateNav(idx, 'label', e.target.value)}
                      placeholder="Menu Label"
                      className="text-xs font-bold text-navy-900 rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-brand-500 bg-transparent"
                    />
                    <input
                      type="text"
                      value={item.path}
                      onChange={(e) => handleUpdateNav(idx, 'path', e.target.value)}
                      placeholder="/destinations"
                      className="text-xs text-slate-600 rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-brand-500 bg-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleNav(idx)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      item.isEnabled ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {item.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{item.isEnabled ? 'Visible' : 'Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveNav(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Menu Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Navigation Link */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row gap-2.5 items-center">
            <input
              type="text"
              placeholder="New Label (e.g. Haryana Heritage)"
              value={newNavItem.label}
              onChange={(e) => setNewNavItem(prev => ({ ...prev, label: e.target.value }))}
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3.5 py-2 bg-white focus:outline-none focus:border-brand-500 w-full"
            />
            <input
              type="text"
              placeholder="Path (e.g. /destinations/kurukshetra)"
              value={newNavItem.path}
              onChange={(e) => setNewNavItem(prev => ({ ...prev, path: e.target.value }))}
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3.5 py-2 bg-white focus:outline-none focus:border-brand-500 w-full"
            />
            <button
              type="button"
              onClick={handleAddNav}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Menu Item
            </button>
          </div>
        </div>

        {/* 6. Announcement Bar */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" /> 6. Announcement Top Alert Banner
              </h2>
              <p className="text-xs text-slate-500">Display a dynamic notification strip at the very top of all public pages.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isEnabled"
                checked={form.announcementBar?.isEnabled || false}
                onChange={handleAnnouncementChange}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span className="text-xs font-bold text-navy-900">Show Announcement</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Announcement Message</label>
              <input
                type="text"
                name="text"
                value={form.announcementBar?.text || ''}
                onChange={handleAnnouncementChange}
                placeholder="Special 10% discount on outstation bookings from Kurukshetra & Ladwa!"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Action Button Text</label>
              <input
                type="text"
                name="linkText"
                value={form.announcementBar?.linkText || ''}
                onChange={handleAnnouncementChange}
                placeholder="Book Now"
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 7. Global Footer & Copyright */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-2">
            7. Global Footer & Copyright Branding
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Footer Brand Summary</label>
              <textarea
                rows={2}
                name="footerText"
                value={form.footerText}
                onChange={handleChange}
                placeholder="Brief agency description displayed in the footer..."
                className="w-full text-sm rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:border-brand-500 font-normal leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Copyright Line</label>
              <input
                type="text"
                name="copyrightText"
                value={form.copyrightText}
                onChange={handleChange}
                placeholder="© 2026 Vista Tour and Travels. All rights reserved."
                className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            <Save className="w-4 h-4 mr-1.5" /> Save Website Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteSettings;
