import axiosClient from './axiosClient';

const STORAGE_KEY = 'rtt_custom_inquiries';

const defaultInquiries = [];

const FAKE_INQUIRY_IDS = new Set(['inq-1', 'inq-2', 'inq-3']);
const FAKE_INQUIRY_NAMES = new Set([
  'amitabh deshmukh',
  'neha kapoor',
  'col. sanjeev nair',
  'sanjeev nair',
  'siddharth saxena',
  'ananya sharma'
]);
const FAKE_INQUIRY_EMAILS = new Set([
  'amitabh.d@gmail.com',
  'neha.k@outlook.com',
  'sanjeev.nair@indianarmy.in',
  'siddharth@example.com',
  'ananya.s@example.com'
]);

export const isFakeInquiry = (i) => {
  if (!i) return true;
  if (i._id && FAKE_INQUIRY_IDS.has(i._id.toLowerCase())) return true;
  if (i.name && FAKE_INQUIRY_NAMES.has(i.name.toLowerCase().trim())) return true;
  if (i.email && FAKE_INQUIRY_EMAILS.has(i.email.toLowerCase().trim())) return true;
  return false;
};

const getLocalInquiries = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(i => !isFakeInquiry(i));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (e) {
    console.warn('Error reading local inquiries:', e);
  }
  return defaultInquiries;
};

const saveLocalInquiries = (list) => {
  try {
    const cleaned = (list || []).filter(i => !isFakeInquiry(i));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    window.dispatchEvent(new CustomEvent('rtt_inquiries_updated', { detail: cleaned }));
  } catch (e) {
    console.warn('Error saving local inquiries:', e);
  }
};

export const inquiryApi = {
  create: async (data) => {
    const list = getLocalInquiries();
    const newInquiry = {
      ...data,
      _id: `inq-custom-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    const updated = [newInquiry, ...list];
    saveLocalInquiries(updated);

    const adminPhone = '9068888578';
    const whatsappMsg = `🔔 *NEW TRAVEL INQUIRY*\n` +
      `👤 *Name:* ${data.name || 'Traveler'}\n` +
      `📞 *Phone:* ${data.phone || 'Not provided'}\n` +
      `✉️ *Email:* ${data.email || 'Not provided'}\n` +
      `📍 *Subject / Destination:* ${data.subject || data.destination || 'General Tour Inquiry'}\n` +
      `💬 *Message:* ${data.message || 'Interested in booking / tour'}\n` +
      `🌐 *Source:* Vista Tour and Travels Web Portal`;

    const whatsappUrl = `https://wa.me/91${adminPhone}?text=${encodeURIComponent(whatsappMsg)}`;

    try {
      await axiosClient.post('/inquiries', data);
    } catch (e) {
      // Local save preserved
    }
    return {
      success: true,
      message: 'Inquiry submitted successfully! Admin (+91 90688 88578) linked for notification.',
      data: newInquiry,
      adminPhone: '+91 90688 88578',
      whatsappUrl
    };
  },

  getAll: async (params = {}) => {
    let list = [];
    try {
      const res = await axiosClient.get('/inquiries', { params });
      if (res && res.success && Array.isArray(res.data)) {
        const remoteCleaned = res.data.filter(i => !isFakeInquiry(i));
        const local = getLocalInquiries();
        const extraLocal = local.filter(i => !remoteCleaned.some(b => b._id === i._id));
        list = [...extraLocal, ...remoteCleaned];
      } else {
        list = getLocalInquiries();
      }
    } catch (err) {
      list = getLocalInquiries();
    }

    if (params.status && params.status !== 'All') {
      list = list.filter(i => i.status?.toLowerCase() === params.status?.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(i =>
        i.name?.toLowerCase().includes(q) ||
        i.phone?.toLowerCase().includes(q) ||
        i.message?.toLowerCase().includes(q) ||
        i.subject?.toLowerCase().includes(q)
      );
    }
    return { success: true, data: list };
  },

  update: async (id, data) => {
    const list = getLocalInquiries();
    const updated = list.map(i => (i._id === id ? { ...i, ...data } : i));
    saveLocalInquiries(updated);

    try {
      await axiosClient.put(`/inquiries/${id}`, data);
    } catch (e) {}
    const found = updated.find(i => i._id === id);
    return { success: true, data: found };
  },

  delete: async (id) => {
    const list = getLocalInquiries();
    const filtered = list.filter(i => i._id !== id);
    saveLocalInquiries(filtered);

    try {
      await axiosClient.delete(`/inquiries/${id}`);
    } catch (e) {}
    return { success: true, message: 'Inquiry deleted successfully' };
  }
};

export default inquiryApi;
