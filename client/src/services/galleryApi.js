import axiosClient from './axiosClient';
import { defaultGalleryPhotos } from '../data/defaultGallery';

const STORAGE_KEY = 'rtt_custom_gallery';

const getLocalGallery = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local gallery:', e);
  }
  return defaultGalleryPhotos;
};

const saveLocalGallery = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('rtt_gallery_updated', { detail: list }));
  } catch (e) {
    console.warn('Error saving local gallery:', e);
  }
};

export const galleryApi = {
  getAll: async (params = {}) => {
    try {
      const res = await axiosClient.get('/gallery', { params });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const local = getLocalGallery();
        const customPhotos = local.filter(p => String(p._id).startsWith('gal-custom-'));
        const merged = [...customPhotos, ...res.data];
        const unique = Array.from(new Map(merged.map(p => [p._id, p])).values());
        let filtered = unique;
        if (params.category && params.category !== 'All') {
          filtered = filtered.filter(p => p.category === params.category);
        }
        return { success: true, data: filtered, count: filtered.length };
      }
    } catch (err) {
      // Backend unreachable or 404 - fallback to local
    }

    let list = getLocalGallery();
    if (params.category && params.category !== 'All') {
      list = list.filter(p => p.category === params.category);
    }

    return {
      success: true,
      data: list,
      count: list.length
    };
  },

  create: async (data) => {
    const list = getLocalGallery();
    const newPhoto = {
      ...data,
      _id: `gal-custom-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newPhoto, ...list];
    saveLocalGallery(updated);

    try {
      await axiosClient.post('/gallery', data);
    } catch (e) {
      // Offline / API failed, local update preserved
    }
    return { success: true, data: newPhoto };
  },

  delete: async (id) => {
    const list = getLocalGallery();
    const updated = list.filter(p => p._id !== id);
    saveLocalGallery(updated);

    try {
      await axiosClient.delete(`/gallery/${id}`);
    } catch (e) {
      // Offline / API failed, local delete preserved
    }
    return { success: true, message: 'Photo deleted successfully' };
  }
};

export default galleryApi;
