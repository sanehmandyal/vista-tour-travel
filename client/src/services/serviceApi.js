import axiosClient from './axiosClient';
import { defaultServices } from '../data/defaultServices';

const STORAGE_KEY = 'rtt_custom_services';

const getLocalServices = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local services:', e);
  }
  return defaultServices;
};

const saveLocalServices = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('rtt_services_updated', { detail: list }));
  } catch (e) {
    console.warn('Error saving local services:', e);
  }
};

export const serviceApi = {
  getAll: async (params = {}) => {
    try {
      const res = await axiosClient.get('/services', { params });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const local = getLocalServices();
        const extraLocal = local.filter(s => !res.data.some(b => b._id === s._id));
        const merged = [...res.data.map(b => {
          const localMatch = local.find(l => l._id === b._id);
          return localMatch ? { ...b, ...localMatch } : b;
        }), ...extraLocal];
        return { success: true, data: merged };
      }
    } catch (err) {}

    const list = getLocalServices();
    return { success: true, data: list };
  },

  getById: async (id) => {
    try {
      const res = await axiosClient.get(`/services/${id}`);
      if (res && res.success && res.data) {
        return res;
      }
    } catch (err) {}

    const list = getLocalServices();
    const found = list.find(s => s._id === id);
    if (found) return { success: true, data: found };
    return { success: false, message: 'Service not found' };
  },

  create: async (data) => {
    const list = getLocalServices();
    const newService = {
      ...data,
      _id: `srv-custom-${Date.now()}`,
      features: Array.isArray(data.features)
        ? data.features
        : (typeof data.features === 'string' ? data.features.split(',').map(s => s.trim()).filter(Boolean) : []),
      order: list.length + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [newService, ...list];
    saveLocalServices(updated);

    try {
      await axiosClient.post('/services', data);
    } catch (e) {}
    return { success: true, data: newService };
  },

  update: async (id, data) => {
    const list = getLocalServices();
    const updated = list.map(s => {
      if (s._id === id) {
        const features = Array.isArray(data.features)
          ? data.features
          : (typeof data.features === 'string' ? data.features.split(',').map(str => str.trim()).filter(Boolean) : s.features);
        return { ...s, ...data, features };
      }
      return s;
    });
    saveLocalServices(updated);

    try {
      await axiosClient.put(`/services/${id}`, data);
    } catch (e) {}
    const updatedItem = updated.find(s => s._id === id);
    return { success: true, data: updatedItem };
  },

  delete: async (id) => {
    const list = getLocalServices();
    const filtered = list.filter(s => s._id !== id);
    saveLocalServices(filtered);

    try {
      await axiosClient.delete(`/services/${id}`);
    } catch (e) {}
    return { success: true, message: 'Service deleted successfully' };
  }
};

export default serviceApi;
