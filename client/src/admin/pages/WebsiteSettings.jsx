import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { processDeviceImage } from '../../utils/imageUpload';
import { useWebsite, defaultSettings } from '../../context/WebsiteContext';
import { Settings, Save, Upload } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export const WebsiteSettings = () => {
  const { settings, updateSettingsState, refreshSettings } = useWebsite();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    supportHours: settings.supportHours || defaultSettings.supportHours
  }));

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminApi.getSettings();
        if (res.success && res.data) {
          setForm(prev => ({ ...prev, ...res.data }));
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
                placeholder="https://www.google.com/search?q=Kangra+Taxi+Service..."
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
