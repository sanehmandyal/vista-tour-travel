import axiosClient from './axiosClient';
import { defaultPackages } from '../data/defaultPackages';

const STORAGE_KEY = 'rtt_custom_packages';

const getLocalPackages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Discard legacy himachal cache if any
        const hasLegacy = parsed.some(p =>
          p.title?.toLowerCase().includes('manali') ||
          p.title?.toLowerCase().includes('shimla') ||
          p.destinationName?.toLowerCase().includes('himachal')
        );
        if (!hasLegacy) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading local packages:', e);
  }
  return defaultPackages;
};

const saveLocalPackages = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('rtt_packages_updated', { detail: list }));
  } catch (e) {
    console.warn('Error saving local packages:', e);
  }
};

const filterPackagesLocally = (params = {}) => {
  let list = [...getLocalPackages()];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.destinationName?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }

  if (params.category && params.category !== 'All') {
    list = list.filter(p => p.category === params.category);
  }

  if (params.featured !== undefined) {
    const isFeat = Boolean(params.featured);
    list = list.filter(p => Boolean(p.featured) === isFeat);
  }

  if (params.destination) {
    list = list.filter(p =>
      p.destination === params.destination ||
      p.destinationSlug === params.destination ||
      p.destinationName?.toLowerCase() === params.destination.toLowerCase()
    );
  }

  if (params.minPrice) {
    list = list.filter(p => (p.discountedPrice || p.price || 0) >= params.minPrice);
  }

  if (params.maxPrice) {
    list = list.filter(p => (p.discountedPrice || p.price || 0) <= params.maxPrice);
  }

  return list;
};

export const packageApi = {
  getAll: async (params = {}) => {
    try {
      const res = await axiosClient.get('/packages', { params });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        saveLocalPackages(res.data);
        return {
          success: true,
          data: res.data,
          pagination: res.pagination || {
            total: res.data.length,
            page: params.page || 1,
            totalPages: 1,
            limit: params.limit || 50
          }
        };
      }
    } catch (err) {
      console.warn('Backend unavailable, using cached packages:', err.message);
    }

    const filtered = filterPackagesLocally(params);
    return {
      success: true,
      data: filtered,
      pagination: {
        total: filtered.length,
        page: params.page || 1,
        totalPages: 1,
        limit: params.limit || 50
      }
    };
  },

  getBySlug: async (slug) => {
    const list = getLocalPackages();
    const localFound = list.find(p => p.slug === slug || p._id === slug);

    try {
      const res = await axiosClient.get(`/packages/${slug}`);
      if (res && res.success && res.data) {
        const item = localFound ? { ...localFound, ...res.data } : res.data;
        return { success: true, data: item };
      }
    } catch (err) {}

    if (localFound) {
      return { success: true, data: localFound };
    }
    return { success: false, message: 'Package not found' };
  },

  create: async (data) => {
    let savedItem = null;
    try {
      const res = await axiosClient.post('/packages', data);
      if (res && res.success && res.data) {
        savedItem = res.data;
      }
    } catch (e) {
      console.warn('Direct server create failed, saving locally:', e.message);
    }

    const list = getLocalPackages();
    const newPkg = savedItem || {
      ...data,
      _id: `custom-pkg-${Date.now()}`,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: data.rating || 5.0,
      reviewsCount: data.reviewsCount || 1,
      status: 'published',
      createdAt: new Date().toISOString()
    };
    const updated = [newPkg, ...list.filter(p => p._id !== newPkg._id && p.slug !== newPkg.slug)];
    saveLocalPackages(updated);
    return { success: true, data: newPkg };
  },

  update: async (id, data) => {
    let updatedItem = null;
    try {
      const res = await axiosClient.put(`/packages/${id}`, data);
      if (res && res.success && res.data) {
        updatedItem = res.data;
      }
    } catch (e) {
      console.warn('Direct server update failed, updating locally:', e.message);
    }

    const list = getLocalPackages();
    const updated = list.map(p => {
      if (p._id === id || p.slug === id) {
        return updatedItem ? { ...p, ...updatedItem } : { ...p, ...data };
      }
      return p;
    });
    saveLocalPackages(updated);
    const resultItem = updated.find(p => p._id === id || p.slug === id) || updatedItem;
    return { success: true, data: resultItem };
  },

  delete: async (id) => {
    try {
      await axiosClient.delete(`/packages/${id}`);
    } catch (e) {
      console.warn('Direct server delete failed, removing locally:', e.message);
    }

    const list = getLocalPackages();
    const filtered = list.filter(p => p._id !== id && p.slug !== id);
    saveLocalPackages(filtered);
    return { success: true, message: 'Package deleted successfully' };
  }
};

export default packageApi;
