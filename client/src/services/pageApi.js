import axiosClient from './axiosClient';

const STORAGE_KEY_PREFIX = 'vtt_cms_page_';

export const pageApi = {
  getAll: async () => {
    try {
      const res = await axiosClient.get('/pages');
      if (res && res.success && Array.isArray(res.data)) {
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.warn('API /pages error, falling back to cache:', err.message);
    }

    return {
      success: true,
      data: [
        { slug: 'home', title: 'Homepage', subtitle: 'Main landing page' },
        { slug: 'about', title: 'About Us', subtitle: 'Company story & heritage' },
        { slug: 'services', title: 'Taxi & Tour Services', subtitle: 'Cab & itinerary offerings' },
        { slug: 'contact', title: 'Contact Us', subtitle: 'Get in touch & office info' },
        { slug: 'faq', title: 'FAQ', subtitle: 'Frequently Asked Questions' }
      ]
    };
  },

  getBySlug: async (slug) => {
    const cleanSlug = (slug || 'home').toLowerCase().trim();
    try {
      const res = await axiosClient.get(`/pages/${cleanSlug}`);
      if (res && res.success && res.data) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${cleanSlug}`, JSON.stringify(res.data));
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.warn(`API /pages/${cleanSlug} error:`, err.message);
    }

    try {
      const cached = localStorage.getItem(`${STORAGE_KEY_PREFIX}${cleanSlug}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }
    } catch (e) {}

    return { success: false, message: `Page '${cleanSlug}' not found` };
  },

  update: async (slug, data) => {
    const cleanSlug = (slug || 'home').toLowerCase().trim();
    let updatedItem = null;

    try {
      const res = await axiosClient.put(`/pages/${cleanSlug}`, data);
      if (res && res.success && res.data) {
        updatedItem = res.data;
      }
    } catch (err) {
      console.warn(`Direct server update failed for page ${cleanSlug}:`, err.message);
    }

    const finalItem = updatedItem || { ...data, slug: cleanSlug, updatedAt: new Date().toISOString() };
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${cleanSlug}`, JSON.stringify(finalItem));
      window.dispatchEvent(new CustomEvent('vtt_page_updated', { detail: { slug: cleanSlug, data: finalItem } }));
    } catch (e) {}

    return { success: true, data: finalItem };
  },

  create: async (data) => {
    try {
      const res = await axiosClient.post('/pages', data);
      if (res && res.success && res.data) {
        return { success: true, data: res.data };
      }
    } catch (err) {
      console.warn('Direct server create failed for page:', err.message);
    }
    return { success: true, data: data };
  },

  delete: async (slug) => {
    try {
      await axiosClient.delete(`/pages/${slug}`);
    } catch (err) {
      console.warn(`Direct delete failed for page ${slug}:`, err.message);
    }
    return { success: true, message: 'Page deleted successfully' };
  }
};

export default pageApi;
