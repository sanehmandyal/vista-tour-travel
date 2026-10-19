import axiosClient from './axiosClient';
import { defaultDestinations } from '../data/defaultDestinations';

const STORAGE_KEY = 'rtt_custom_destinations';

export const getExactDestinationImages = (name = '', slug = '') => {
  const q = `${name} ${slug}`.toLowerCase();
  if (q.includes('kurukshetra') || q.includes('brahma') || q.includes('jyotisar')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Sheikh_Chilli_Tomb_Kurukshetra.jpg?width=1200'
      ]
    };
  }
  if (q.includes('ambala') || q.includes('cantt')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Ambala_Cantt_Railway_Station.jpg?width=1200'
      ]
    };
  }
  if (q.includes('delhi') || q.includes('ncr') || q.includes('qutub') || q.includes('india gate')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Qutub_Minar_in_New_Delhi_03-2016.jpg?width=1200'
      ]
    };
  }
  if (q.includes('karnal') || q.includes('karna')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Cantonment_Church_Tower_Karnal.jpg?width=1200'
      ]
    };
  }
  if (q.includes('panipat') || q.includes('kala amb') || q.includes('kabuli')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kala_Amb_Panipat.jpg?width=1200'
      ]
    };
  }
  if (q.includes('yamunanagar') || q.includes('kalesar') || q.includes('hathni')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hathni_Kund_Barrage.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hathni_Kund_Barrage.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Hathni_Kund_Barrage.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kalesar_National_Park.jpg?width=1200'
      ]
    };
  }
  if (q.includes('kaithal') || q.includes('kathial') || q.includes('hanuman') || q.includes('anjani')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kaithal_Fort.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kaithal_Fort.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kaithal_Fort.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Bidkyar_Lake_Kaithal.jpg?width=1200'
      ]
    };
  }
  if (q.includes('chandigarh') || q.includes('chandigark') || q.includes('sukhna') || q.includes('rock garden')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Sukhna_Lake_Chandigarh.jpg?width=1200'
      ]
    };
  }
  return {
    heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200',
    featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Sheikh_Chilli_Tomb_Kurukshetra.jpg?width=1200'
    ]
  };
};

const enrichDestinationWithExactImage = (dest) => {
  if (!dest) return dest;
  const exact = getExactDestinationImages(dest.name, dest.slug);
  const isGenericOrUnmatched = (url) => !url || 
    typeof url !== 'string' || 
    url.includes('images.unsplash.com') || 
    url.includes('photo-15') || 
    url.includes('photo-16') || 
    url.includes('photo-14') ||
    !url.startsWith('http');

  const heroImage = isGenericOrUnmatched(dest.heroImage) ? exact.heroImage : (dest.heroImage || exact.heroImage);
  const featuredImage = isGenericOrUnmatched(dest.featuredImage) ? exact.featuredImage : (dest.featuredImage || exact.featuredImage);
  const images = Array.isArray(dest.images) && dest.images.length > 0 && !dest.images.some(isGenericOrUnmatched)
    ? dest.images
    : exact.images;
  const gallery = Array.isArray(dest.gallery) && dest.gallery.length > 0 && !dest.gallery.some(isGenericOrUnmatched)
    ? dest.gallery
    : exact.images;

  return {
    ...dest,
    heroImage,
    featuredImage,
    images,
    gallery
  };
};

const getLocalDestinations = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Discard legacy himachal or outdated schema with string attractions
        const isOutdated = parsed.some(d =>
          d.name?.toLowerCase().includes('manali') ||
          d.name?.toLowerCase().includes('shimla') ||
          d.state?.toLowerCase().includes('himachal') ||
          (Array.isArray(d.attractions) && typeof d.attractions[0] === 'string') ||
          !d.shortDescription
        );
        if (!isOutdated) {
          return parsed.map(enrichDestinationWithExactImage);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  } catch (e) {
    console.warn('Error reading local destinations:', e);
  }
  return defaultDestinations;
};

const saveLocalDestinations = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('rtt_destinations_updated', { detail: list }));
  } catch (e) {
    console.warn('Error saving local destinations:', e);
  }
};

const filterDestinationsLocally = (params = {}) => {
  let list = [...getLocalDestinations()];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.region?.toLowerCase().includes(q) ||
      d.tagline?.toLowerCase().includes(q)
    );
  }

  if (params.region && params.region !== 'All') {
    list = list.filter(d => d.region === params.region);
  }

  if (params.featured !== undefined) {
    const isFeat = Boolean(params.featured);
    list = list.filter(d => Boolean(d.featured || d.isFeatured) === isFeat);
  }

  if (params.minPrice) {
    list = list.filter(d => (d.startingPrice || d.estimatedBudget || 0) >= params.minPrice);
  }

  if (params.maxPrice) {
    list = list.filter(d => (d.startingPrice || d.estimatedBudget || 0) <= params.maxPrice);
  }

  return list;
};

export const destinationApi = {
  getAll: async (params = {}) => {
    try {
      const res = await axiosClient.get('/destinations', { params });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const local = getLocalDestinations();
        // Merge backend data with local admin modifications
        const customItems = local.filter(d => String(d._id).startsWith('custom-dest-'));
        const merged = [
          ...customItems,
          ...res.data.map(b => {
            const localMatch = local.find(l => l._id === b._id || l.slug === b.slug);
            const item = localMatch ? { ...b, ...localMatch } : b;
            return enrichDestinationWithExactImage(item);
          })
        ];
        const unique = Array.from(new Map(merged.map(item => [item.slug || item._id, item])).values());
        return {
          success: true,
          data: unique,
          pagination: {
            total: unique.length,
            page: params.page || 1,
            totalPages: 1,
            limit: params.limit || 50
          }
        };
      }
    } catch (err) {
      // Remote backend unreachable or returning 404 - fallback to rich local data
    }
    const filtered = filterDestinationsLocally(params);
    return {
      success: true,
      data: filtered.map(enrichDestinationWithExactImage),
      pagination: {
        total: filtered.length,
        page: params.page || 1,
        totalPages: 1,
        limit: params.limit || 50
      }
    };
  },

  getBySlug: async (slug) => {
    const cleanSlug = (slug || '').toLowerCase().trim();
    const list = getLocalDestinations();
    const defaultMatch = list.find(d =>
      (d.slug || '').toLowerCase() === cleanSlug ||
      (d._id || '').toLowerCase() === cleanSlug ||
      (d.name || '').toLowerCase() === cleanSlug
    );

    try {
      const res = await axiosClient.get(`/destinations/${slug}`);
      if (res && res.success && res.data) {
        const item = defaultMatch ? { ...defaultMatch, ...res.data } : res.data;
        return { success: true, data: enrichDestinationWithExactImage(item) };
      }
    } catch (err) {}

    if (defaultMatch) {
      return { success: true, data: enrichDestinationWithExactImage(defaultMatch) };
    }
    return { success: false, message: 'Destination not found' };
  },

  getById: async (id) => {
    const cleanId = (id || '').toLowerCase().trim();
    const list = getLocalDestinations();
    const defaultMatch = list.find(d =>
      (d._id || '').toLowerCase() === cleanId ||
      (d.slug || '').toLowerCase() === cleanId
    );

    try {
      const res = await axiosClient.get(`/destinations/${id}`);
      if (res && res.success && res.data) {
        const item = defaultMatch ? { ...defaultMatch, ...res.data } : res.data;
        return { success: true, data: enrichDestinationWithExactImage(item) };
      }
    } catch (err) {}

    if (defaultMatch) {
      return { success: true, data: enrichDestinationWithExactImage(defaultMatch) };
    }
    return { success: false, message: 'Destination not found' };
  },

  create: async (data) => {
    const list = getLocalDestinations();
    const newDest = {
      ...data,
      _id: `custom-dest-${Date.now()}`,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: data.rating || 5.0,
      reviewsCount: data.reviewsCount || 1,
      featured: data.featured !== undefined ? data.featured : true,
      isFeatured: data.featured !== undefined ? data.featured : true,
      createdAt: new Date().toISOString()
    };
    const updated = [newDest, ...list];
    saveLocalDestinations(updated);

    try {
      await axiosClient.post('/destinations', data);
    } catch (e) {
      // API call failed, local save succeeded
    }
    return { success: true, data: newDest };
  },

  update: async (id, data) => {
    const list = getLocalDestinations();
    const updated = list.map(d => (d._id === id || d.slug === id ? { ...d, ...data } : d));
    saveLocalDestinations(updated);

    try {
      await axiosClient.put(`/destinations/${id}`, data);
    } catch (e) {
      // Local updated
    }
    const updatedItem = updated.find(d => d._id === id || d.slug === id);
    return { success: true, data: updatedItem };
  },

  delete: async (id) => {
    const list = getLocalDestinations();
    const filtered = list.filter(d => d._id !== id && d.slug !== id);
    saveLocalDestinations(filtered);

    try {
      await axiosClient.delete(`/destinations/${id}`);
    } catch (e) {
      // Local deleted
    }
    return { success: true, message: 'Destination deleted successfully' };
  }
};

export default destinationApi;
