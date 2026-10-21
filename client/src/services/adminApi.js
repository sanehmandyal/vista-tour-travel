import axiosClient from './axiosClient';

const SETTINGS_KEY = 'vtt_website_settings';

const sanitizeSettings = (data) => {
  if (!data) return data;
  const s = { ...data };
  if (s.phone === '098164 13603' || s.phone === '09816413603' || s.phone === '70180 88530' || !s.phone) {
    s.phone = '+91 90688 88578';
  }
  if (s.altPhone === '+91 98164 13603' || s.altPhone === '098164 13603' || s.altPhone === '+91 70180 88530' || !s.altPhone) {
    s.altPhone = '+91 90688 88578';
  }
  if (s.whatsapp === '+919816413603' || s.whatsapp === '919816413603' || s.whatsapp === '+917018088530' || s.whatsapp === '917018088530' || !s.whatsapp) {
    s.whatsapp = '+919068888578';
  }
  if (!s.email || s.email.includes('ravi') || s.email.includes('rinku')) {
    s.email = 'info@vistatourtravels.com';
  }
  if (!s.address || s.address.includes('Amb') || s.address.includes('Una') || s.address.includes('Mohali')) {
    s.address = 'Nawarsi Bazar, Ladwa, Haryana 136132, India';
  }
  if (!s.areasServed || s.areasServed.includes('Amb') || s.areasServed.includes('Mohali') || s.areasServed.includes('Himachal')) {
    s.areasServed = 'Nawarsi Bazar, Ladwa, Kurukshetra, Ambala, Delhi NCR, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh';
  }
  if (!s.serviceName || s.serviceName.includes('Ravi') || s.serviceName.includes('Rinku')) {
    s.serviceName = 'Vista Tour and Travels';
  }
  if (!s.companyName || s.companyName.includes('Ravi') || s.companyName.includes('Rinku')) {
    s.companyName = 'Vista Tour and Travels';
  }
  if (!s.googleMapsUrl || s.googleMapsUrl.includes('Amb') || s.googleMapsUrl.includes('Kangra')) {
    s.googleMapsUrl = 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132';
  }
  if (!s.googleReviewsUrl || s.googleReviewsUrl.includes('Amb') || s.googleReviewsUrl.includes('Kangra')) {
    s.googleReviewsUrl = 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132';
  }
  if (!s.facebook || s.facebook.includes('ravi') || s.facebook.includes('rinku')) {
    s.facebook = 'https://facebook.com/vistatourtravels';
  }
  if (!s.instagram || s.instagram.includes('ravi') || s.instagram.includes('rinku')) {
    s.instagram = 'https://instagram.com/vistatourtravels';
  }
  if (!s.youtube || s.youtube.includes('ravi') || s.youtube.includes('rinku')) {
    s.youtube = 'https://youtube.com/@vistatourtravels';
  }
  return s;
};

export const adminApi = {
  getDashboard: () => axiosClient.get('/admin/dashboard'),
  getUsers: (params) => axiosClient.get('/users', { params }),
  updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),

  getSettings: async () => {
    try {
      const res = await axiosClient.get('/admin/settings');
      if (res && res.success && res.data) {
        // Production MongoDB is the single source of truth
        const sanitized = sanitizeSettings(res.data);
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitized));
        } catch (e) {}
        return { success: true, data: sanitized };
      }
    } catch (err) {
      console.warn('Network issue fetching settings from server, checking local cache:', err.message);
    }

    // Fallback to local cache only if server is unreachable
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { success: true, data: sanitizeSettings(JSON.parse(saved)) };
      }
    } catch (e) {}

    return { success: false, data: null };
  },

  updateSettings: async (data) => {
    const sanitized = sanitizeSettings(data);

    // 1. Send update directly to Production MongoDB API
    try {
      const res = await axiosClient.put('/admin/settings', sanitized);
      if (res && res.success) {
        const serverData = res.data ? sanitizeSettings(res.data) : sanitized;
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(serverData));
          window.dispatchEvent(new CustomEvent('vtt_settings_updated', { detail: serverData }));
          window.dispatchEvent(new CustomEvent('rtt_settings_updated', { detail: serverData }));
        } catch (e) {}
        return { success: true, data: serverData, message: 'Settings saved to MongoDB and published globally!' };
      }
      throw new Error(res?.message || 'Server rejected settings update');
    } catch (err) {
      console.error('Failed to update website settings in database:', err);
      throw new Error(err.message || 'Could not save settings to database. Please check your admin session.');
    }
  },

  uploadImage: (formData) => axiosClient.post('/admin/upload', formData),
  subscribeNewsletter: (email) => axiosClient.post('/admin/newsletter', { email }),
  getNewsletterSubscribers: () => axiosClient.get('/admin/newsletter')
};

export default adminApi;
