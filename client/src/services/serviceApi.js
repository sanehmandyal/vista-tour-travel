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
    try {
      const res = await axiosClient.post('/services', data);
      if (res && res.success && res.data) {
        const list = getLocalServices();
        const updated = [res.data, ...list.filter(s => s._id !== res.data._id)];
        saveLocalServices(updated);
        return { success: true, data: res.data };
      }
      throw new Error(res?.message || 'Server rejected service creation');
    } catch (e) {
      console.error('Direct server create failed:', e);
      throw new Error(e.message || 'Could not save service to database.');
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`/services/${id}`, data);
      if (res && res.success && res.data) {
        const list = getLocalServices();
        const updated = list.map(s => (s._id === id ? res.data : s));
        saveLocalServices(updated);
        return { success: true, data: res.data };
      }
      throw new Error(res?.message || 'Server update failed');
    } catch (e) {
      console.error('Direct server update failed:', e);
      throw new Error(e.message || 'Could not update service in database.');
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`/services/${id}`);
      if (res && res.success === false) {
        throw new Error(res.message || 'Failed to delete service from database');
      }
    } catch (e) {
      console.error('Direct server delete failed:', e);
      throw new Error(e.message || 'Could not remove service from database.');
    }

    const list = getLocalServices();
    const filtered = list.filter(s => s._id !== id);
    saveLocalServices(filtered);
    return { success: true, message: 'Service deleted successfully' };
  }
};

export default serviceApi;
