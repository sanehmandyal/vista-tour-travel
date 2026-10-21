import axiosClient from './axiosClient';
import { adminApi } from './adminApi';

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
      } else {
        throw new Error(res?.message || 'Server rejected page update');
      }
    } catch (err) {
      console.error(`Direct server update failed for page ${cleanSlug}:`, err);
      throw new Error(err.message || `Could not save page content for '${cleanSlug}' to database.`);
    }

    // If home page is updated, seamlessly synchronize hero image & text into global WebsiteSettings
    if (cleanSlug === 'home' && data.hero) {
      try {
        const syncPayload = {};
        if (data.hero.image) syncPayload.heroImage = data.hero.image;
        if (data.hero.title) syncPayload.heroTitle = data.hero.title;
        if (data.hero.subtitle) syncPayload.heroSubtitle = data.hero.subtitle;
        if (Object.keys(syncPayload).length > 0) {
          await adminApi.updateSettings(syncPayload);
        }
      } catch (e) {
        console.warn('Sync to website settings notice:', e.message);
      }
    }

    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${cleanSlug}`, JSON.stringify(updatedItem));
      window.dispatchEvent(new CustomEvent('vtt_page_updated', { detail: { slug: cleanSlug, data: updatedItem } }));
    } catch (e) {}

    return { success: true, data: updatedItem };
  },

  create: async (data) => {
    try {
      const res = await axiosClient.post('/pages', data);
      if (res && res.success && res.data) {
        return { success: true, data: res.data };
      }
      throw new Error(res?.message || 'Server rejected page creation');
    } catch (err) {
      console.error('Direct server create failed for page:', err);
      throw new Error(err.message || 'Could not create page in database.');
    }
  },

  delete: async (slug) => {
    try {
      const res = await axiosClient.delete(`/pages/${slug}`);
      if (res && res.success === false) {
        throw new Error(res.message || 'Server rejected page deletion');
      }
    } catch (err) {
      console.error(`Direct delete failed for page ${slug}:`, err);
      throw new Error(err.message || `Could not delete page '${slug}' from database.`);
    }
    return { success: true, message: 'Page deleted successfully' };
  }
};

export default pageApi;
