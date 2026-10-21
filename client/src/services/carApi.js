import axiosClient from './axiosClient';
import { defaultCars } from '../data/defaultCars';

const STORAGE_KEY = 'rtt_custom_cars';

export const getExactCarImage = (name = '') => {
  const n = String(name).toLowerCase();
  if (n.includes('hycross') || n.includes('zenix')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Toyota_Kijang_Innova_Zenix_2.0_Q_Hybrid_Modellista_(front),_West_Surabaya.jpg?width=800';
  }
  if (n.includes('crysta') || (n.includes('innova') && !n.includes('hycross'))) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800';
  }
  if (n.includes('ertiga')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ertiga(2).jpg?width=800';
  }
  if (n.includes('dzire') || n.includes('swift')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Dzire_VXi_VVT_(front).JPG?width=800';
  }
  if (n.includes('etios')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Etios_1.5_XLS_Sedan_2019.jpg?width=800';
  }
  if (n.includes('alto')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_-_Alto_800_LXi.JPG?width=800';
  }
  if (n.includes('wagonr') || n.includes('wagon r')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/2018_Suzuki_Karimun_Wagon_R_GL_(front).jpg?width=800';
  }
  if (n.includes('scorpio')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio.jpg?width=800';
  }
  if (n.includes('fortuner')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Fortuner_2.8_GR_Sport_4x4_2022.jpg?width=800';
  }
  if (n.includes('urbania')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800';
  }
  if (n.includes('tempo') || n.includes('traveller')) {
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800';
  }
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800';
};

const enrichCarWithExactImage = (car) => {
  if (!car) return car;
  const exact = getExactCarImage(car.name);
  const isOldGenericImage = !car.image || 
    car.image.includes('images.unsplash.com') || 
    car.image.includes('2018_Maruti_Suzuki_Dzire') ||
    car.image.includes('Leh-Manali') ||
    car.image.includes('2019_Maruti_Suzuki_Wagon');
  return {
    ...car,
    image: isOldGenericImage ? exact : car.image
  };
};

const getLocalCars = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (parsed.some(c => c.description?.includes('Kangra') || c.description?.includes('Himachal') || c.description?.includes('Manali') || c.image?.includes('Leh-Manali'))) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCars));
          return defaultCars;
        }
        return parsed.map(enrichCarWithExactImage);
      }
    }
  } catch (e) {
    console.warn('Error reading local cars:', e);
  }
  return defaultCars;
};

const saveLocalCars = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('rtt_cars_updated', { detail: list }));
  } catch (e) {
    console.warn('Error saving local cars:', e);
  }
};

export const carApi = {
  getAll: async (params = {}) => {
    try {
      const res = await axiosClient.get('/cars', { params });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const enriched = res.data.map(enrichCarWithExactImage);
        saveLocalCars(enriched);
        return { success: true, data: enriched };
      }
    } catch (err) {
      console.warn('Backend unavailable, using cached cars:', err.message);
    }

    let list = getLocalCars();
    if (params.category && params.category !== 'All') {
      list = list.filter(c => c.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    return { success: true, data: list.map(enrichCarWithExactImage) };
  },

  getById: async (id) => {
    try {
      const res = await axiosClient.get(`/cars/${id}`);
      if (res && res.success && res.data) {
        return { success: true, data: enrichCarWithExactImage(res.data) };
      }
    } catch (err) {}

    const list = getLocalCars();
    const found = list.find(c => c._id === id);
    if (found) {
      return { success: true, data: enrichCarWithExactImage(found) };
    }
    return { success: false, message: 'Vehicle not found' };
  },

  create: async (data) => {
    try {
      const res = await axiosClient.post('/cars', data);
      if (res && res.success && res.data) {
        const enriched = enrichCarWithExactImage(res.data);
        const list = getLocalCars();
        const updated = [enriched, ...list.filter(c => c._id !== enriched._id && c.name !== enriched.name)];
        saveLocalCars(updated);
        return { success: true, data: enriched };
      }
      throw new Error(res?.message || 'Server rejected car creation');
    } catch (e) {
      console.error('Direct server car create failed:', e);
      throw new Error(e.message || 'Could not save vehicle to database.');
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`/cars/${id}`, data);
      if (res && res.success && res.data) {
        const enriched = enrichCarWithExactImage(res.data);
        const list = getLocalCars();
        const updated = list.map(c => (c._id === id || c.name?.toLowerCase() === id?.toLowerCase() ? enriched : c));
        saveLocalCars(updated);
        return { success: true, data: enriched };
      }
      throw new Error(res?.message || 'Server update failed');
    } catch (e) {
      console.error('Direct server car update failed:', e);
      throw new Error(e.message || 'Could not update vehicle in database.');
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`/cars/${id}`);
      if (res && res.success === false) {
        throw new Error(res.message || 'Failed to delete vehicle from database');
      }
    } catch (e) {
      console.error('Direct server car delete failed:', e);
      throw new Error(e.message || 'Could not remove vehicle from database.');
    }

    const list = getLocalCars();
    const filtered = list.filter(c => c._id !== id);
    saveLocalCars(filtered);
    return { success: true, message: 'Vehicle removed from fleet' };
  }
};

export default carApi;
