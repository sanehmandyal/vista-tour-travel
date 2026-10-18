import axiosClient from './axiosClient';
import { defaultFaqs } from '../data/defaultFaqs';

const STORAGE_KEY = 'rtt_custom_faqs';

const getLocalFaqs = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local FAQs:', e);
  }
  return defaultFaqs;
};

const saveLocalFaqs = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('rtt_faqs_updated', { detail: list }));
  } catch (e) {
    console.warn('Error saving local FAQs:', e);
  }
};

export const faqApi = {
  getAll: async (params = {}) => {
    try {
      const res = await axiosClient.get('/faqs', { params });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const local = getLocalFaqs();
        const extraLocal = local.filter(f => !res.data.some(b => b._id === f._id));
        const merged = [...res.data.map(b => {
          const localMatch = local.find(l => l._id === b._id);
          return localMatch ? { ...b, ...localMatch } : b;
        }), ...extraLocal];
        return { success: true, data: merged };
      }
    } catch (err) {}

    let list = getLocalFaqs();
    if (params.category && params.category !== 'All') {
      list = list.filter(f => f.category === params.category);
    }
    return { success: true, data: list };
  },

  create: async (data) => {
    const list = getLocalFaqs();
    const newFaq = {
      ...data,
      _id: `faq-custom-${Date.now()}`,
      order: list.length + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [newFaq, ...list];
    saveLocalFaqs(updated);

    try {
      await axiosClient.post('/faqs', data);
    } catch (e) {}
    return { success: true, data: newFaq };
  },

  update: async (id, data) => {
    const list = getLocalFaqs();
    const updated = list.map(f => (f._id === id ? { ...f, ...data } : f));
    saveLocalFaqs(updated);

    try {
      await axiosClient.put(`/faqs/${id}`, data);
    } catch (e) {}
    const updatedItem = updated.find(f => f._id === id);
    return { success: true, data: updatedItem };
  },

  delete: async (id) => {
    const list = getLocalFaqs();
    const filtered = list.filter(f => f._id !== id);
    saveLocalFaqs(filtered);

    try {
      await axiosClient.delete(`/faqs/${id}`);
    } catch (e) {}
    return { success: true, message: 'FAQ deleted successfully' };
  }
};

export default faqApi;
