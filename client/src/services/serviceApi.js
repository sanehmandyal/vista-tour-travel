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
        saveLocalServices(res.data);
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.warn('Backend unavailable, using cached services:', err.message);
    }

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
    let savedItem = null;
    try {
      const res = await axiosClient.post('/services', data);
      if (res && res.success && res.data) {
        savedItem = res.data;
      }
    } catch (e) {
      console.warn('Direct server create failed, saving locally:', e.message);
    }

    const list = getLocalServices();
    const newService = savedItem || {
      ...data,
      _id: `srv-custom-${Date.now()}`,
      features: Array.isArray(data.features)
        ? data.features
        : (typeof data.features === 'string' ? data.features.split(',').map(s => s.trim()).filter(Boolean) : []),
      order: list.length + 1,
      createdAt: new Date().toISOString()
    };
    const updated = [newService, ...list.filter(s => s._id !== newService._id)];
    saveLocalServices(updated);
    return { success: true, data: newService };
  },

  update: async (id, data) => {
    let updatedItem = null;
    try {
      const res = await axiosClient.put(`/services/${id}`, data);
      if (res && res.success && res.data) {
        updatedItem = res.data;
      }
    } catch (e) {
      console.warn('Direct server update failed, updating locally:', e.message);
    }

    const list = getLocalServices();
    const updated = list.map(s => {
      if (s._id === id) {
        if (updatedItem) return updatedItem;
        const features = Array.isArray(data.features)
          ? data.features
          : (typeof data.features === 'string' ? data.features.split(',').map(str => str.trim()).filter(Boolean) : s.features);
        return { ...s, ...data, features };
      }
      return s;
    });
    saveLocalServices(updated);
    const resultItem = updated.find(s => s._id === id) || updatedItem;
    return { success: true, data: resultItem };
  },

  delete: async (id) => {
    try {
      await axiosClient.delete(`/services/${id}`);
    } catch (e) {
      console.warn('Direct server delete failed, removing locally:', e.message);
    }

    const list = getLocalServices();
    const filtered = list.filter(s => s._id !== id);
    saveLocalServices(filtered);
    return { success: true, message: 'Service deleted successfully' };
  }
};

export default serviceApi;
