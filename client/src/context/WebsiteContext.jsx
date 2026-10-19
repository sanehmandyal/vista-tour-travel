import React, { createContext, useState, useEffect, useContext } from 'react';
import { adminApi } from '../services/adminApi';

const SETTINGS_KEY = 'vtt_website_settings';

export const defaultSettings = {
  companyName: 'Vista Tour and Travels',
  serviceName: 'Vista Tour and Travels',
  tagline: '5.0 ★ Rated Tour Packages & Luxury Cabs in Ladwa, Kurukshetra & Haryana',
  heroTitle: 'Experience Seamless Journeys with Vista Tour and Travels',
  heroSubtitle: 'Top-rated 5.0★ Google Verified Tour & Luxury Cab Service in Nawarsi Bazar, Ladwa (Kurukshetra, Haryana). Clean commercial fleet, polite chauffeurs, and customized tour packages for Kurukshetra, Ambala, Delhi, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh.',
  heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1920',
  logo: '/logo.jpg',
  phone: '+91 90688 88578',
  secondaryPhone: '+91 99965 70920',
  altPhone: '+91 99965 70920',
  email: 'info@vistatourtravels.com',
  address: 'Nawarsi Bazar, Ladwa, Haryana 136132, India',
  areasServed: 'Nawarsi Bazar, Ladwa, Kurukshetra, Ambala, Delhi NCR, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh',
  googleRating: 5.0,
  googleReviewCount: 50,
  googleMapsUrl: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132',
  googleReviewsUrl: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132',
  facebook: 'https://facebook.com/vistatourtravels',
  instagram: 'https://instagram.com/vistatourtravels',
  youtube: 'https://youtube.com/@vistatourtravels',
  whatsapp: '+919068888578',
  businessHours: '24 Hours Open (7 Days a Week)',
  experienceYears: '12+',
  happyTravelers: '10,000+',
  destinationCount: '8 Premier Destinations',
  supportHours: '24/7'
};

const getInitialSettings = () => {
  try {
    // Purge old legacy key
    localStorage.removeItem('rtt_website_settings');

    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Cleanse any old cached mountain images or old data
      if (
        !parsed.companyName ||
        parsed.companyName.includes('Ravi') ||
        parsed.phone === '70180 88530' ||
        parsed.phone === '098164 13603' ||
        parsed.phone?.includes('98765') ||
        parsed.address?.includes('Mohali') ||
        parsed.address?.includes('Sector 73') ||
        parsed.address?.includes('Amb') ||
        parsed.address?.includes('Una') ||
        parsed.email?.includes('ravi') ||
        parsed.logo === '/logo.svg' ||
        parsed.heroImage?.includes('photo-1506744038136-46273834b3fb') ||
        parsed.heroImage?.includes('unsplash')
      ) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
        return defaultSettings;
      }
      return { ...defaultSettings, ...parsed, heroImage: parsed.heroImage?.includes('unsplash') ? defaultSettings.heroImage : (parsed.heroImage || defaultSettings.heroImage), logo: parsed.logo === '/logo.svg' ? '/logo.jpg' : (parsed.logo || '/logo.jpg') };
    }
  } catch (e) {}
  return defaultSettings;
};

const WebsiteContext = createContext({
  settings: defaultSettings,
  loading: false,
  updateSettingsState: () => {},
  refreshSettings: async () => {}
});

export const WebsiteProvider = ({ children }) => {
  const [settings, setSettings] = useState(getInitialSettings);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await adminApi.getSettings();
      if (res && res.success && res.data) {
        // Sanitize incoming server data if it has legacy references
        const data = { ...res.data };
        if (data.companyName?.includes('Ravi') || data.address?.includes('Amb') || data.phone === '70180 88530') {
          data.companyName = defaultSettings.companyName;
          data.serviceName = defaultSettings.serviceName;
          data.phone = defaultSettings.phone;
          data.altPhone = defaultSettings.altPhone;
          data.email = defaultSettings.email;
          data.address = defaultSettings.address;
          data.areasServed = defaultSettings.areasServed;
          data.googleMapsUrl = defaultSettings.googleMapsUrl;
          data.googleReviewsUrl = defaultSettings.googleReviewsUrl;
          data.whatsapp = defaultSettings.whatsapp;
        }
        if (!data.heroImage || data.heroImage.includes('unsplash') || data.heroImage.includes('photo-1506744038136-46273834b3fb')) {
          data.heroImage = defaultSettings.heroImage;
        }
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Using local settings cache:', err.message);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen for real-time setting updates from Admin panel
    const handleSync = (e) => {
      if (e.detail) {
        setSettings(prev => ({ ...prev, ...e.detail }));
      } else {
        const cached = getInitialSettings();
        setSettings(cached);
      }
    };

    const handleStorage = (e) => {
      if (e.key === SETTINGS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch {}
      }
    };

    window.addEventListener('vtt_settings_updated', handleSync);
    window.addEventListener('rtt_settings_updated', handleSync);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('vtt_settings_updated', handleSync);
      window.removeEventListener('rtt_settings_updated', handleSync);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateSettingsState = (newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('vtt_settings_updated', { detail: updated }));
      return updated;
    });
  };

  return (
    <WebsiteContext.Provider value={{ settings, loading, updateSettingsState, refreshSettings: fetchSettings }}>
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    return {
      settings: defaultSettings,
      loading: false,
      updateSettingsState: () => {},
      refreshSettings: async () => {}
    };
  }
  return context;
};
