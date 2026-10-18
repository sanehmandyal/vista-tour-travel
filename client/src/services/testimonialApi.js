import axiosClient from './axiosClient';
import { defaultTestimonials } from '../data/defaultTestimonials';

const STORAGE_KEY = 'vtt_custom_testimonials';

// Identifies obsolete mock/dummy test reviews to ensure only authentic traveler reviews appear
const FAKE_REVIEW_IDS = new Set(['test-1', 'test-2', 'test-3', 'test-4', 'test-5', 'test-6']);
const FAKE_REVIEW_NAMES = new Set([
  'aarav sharma',
  'priya sen & vikram',
  'col. sanjeev nair',
  'neha malhotra',
  'dr. rajesh khanna',
  'sunita chauhan',
  'vikram & sneha kapur',
  'kunal singhania',
  'deepika iyer',
  'harpreet singh'
]);

export const isFakeReview = (t) => {
  if (!t) return true;
  if (t._id && FAKE_REVIEW_IDS.has(String(t._id))) return true;
  const name = (t.customerName || '').toLowerCase().trim();
  if (FAKE_REVIEW_NAMES.has(name)) return true;
  return false;
};

const getLocalTestimonials = () => {
  try {
    localStorage.removeItem('rtt_custom_testimonials');
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Strip out any fake mock reviews that might have been saved in browser cache
        const genuineOnly = parsed.filter(t => !isFakeReview(t));
        if (genuineOnly.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(genuineOnly));
        }
        return genuineOnly;
      }
    }
  } catch (e) {
    console.warn('Error reading local testimonials:', e);
  }
  return defaultTestimonials.filter(t => !isFakeReview(t));
};

const saveLocalTestimonials = (list) => {
  try {
    const sanitized = (list || []).filter(t => !isFakeReview(t));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent('vtt_testimonials_updated', { detail: sanitized }));
    window.dispatchEvent(new CustomEvent('rtt_testimonials_updated', { detail: sanitized }));
  } catch (e) {
    console.warn('Error saving local testimonials:', e);
  }
};

export const testimonialApi = {
  getAll: async (params = {}) => {
    try {
      const res = await axiosClient.get('/testimonials', { params });
      if (res && res.success && Array.isArray(res.data)) {
        const genuineBackend = res.data.filter(t => !isFakeReview(t));
        const local = getLocalTestimonials();
        const extraLocal = local.filter(t => !genuineBackend.some(b => b._id === t._id));
        const merged = [...genuineBackend.map(b => {
          const localMatch = local.find(l => l._id === b._id);
          return localMatch ? { ...b, ...localMatch } : b;
        }), ...extraLocal];
        return { success: true, data: merged.filter(t => !isFakeReview(t)) };
      }
    } catch (err) {
      // Remote backend unreachable, fallback to genuine local reviews
    }

    let list = getLocalTestimonials();
    if (params.status && params.status !== '') {
      list = list.filter(t => t.status === params.status);
    }
    return { success: true, data: list.filter(t => !isFakeReview(t)) };
  },

  create: async (data) => {
    const list = getLocalTestimonials();
    const newTestimonial = {
      ...data,
      _id: `test-custom-${Date.now()}`,
      status: data.status || 'approved',
      rating: Number(data.rating) || 5,
      createdAt: new Date().toISOString()
    };
    const updated = [newTestimonial, ...list];
    saveLocalTestimonials(updated);

    try {
      await axiosClient.post('/testimonials', data);
    } catch (e) {}
    return { success: true, data: newTestimonial };
  },

  update: async (id, data) => {
    const list = getLocalTestimonials();
    const updated = list.map(t => (t._id === id ? { ...t, ...data } : t));
    saveLocalTestimonials(updated);

    try {
      await axiosClient.put(`/testimonials/${id}`, data);
    } catch (e) {}
    const updatedItem = updated.find(t => t._id === id);
    return { success: true, data: updatedItem };
  },

  delete: async (id) => {
    const list = getLocalTestimonials();
    const filtered = list.filter(t => t._id !== id);
    saveLocalTestimonials(filtered);

    try {
      await axiosClient.delete(`/testimonials/${id}`);
    } catch (e) {}
    return { success: true, message: 'Review deleted successfully' };
  }
};

export default testimonialApi;
