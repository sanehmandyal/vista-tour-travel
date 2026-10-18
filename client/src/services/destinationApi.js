import axiosClient from './axiosClient';
import { defaultDestinations } from '../data/defaultDestinations';

const STORAGE_KEY = 'rtt_custom_destinations';

export const getExactDestinationImages = (name = '', slug = '') => {
  const q = `${name} ${slug}`.toLowerCase();
  if (q.includes('dharamshala') || q.includes('mcleod')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Mcleodganj.jpg?width=1200'
      ]
    };
  }
  if (q.includes('manali') || q.includes('solang') || q.includes('rohtang')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hidimba_Temple_Manali.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hidimba_Temple_Manali.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Hidimba_Temple_Manali.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Solang_Valley_Manali.JPG?width=1200'
      ]
    };
  }
  if (q.includes('dalhousie') || q.includes('khajjiar')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar_lake.jpg?width=1200'
      ]
    };
  }
  if (q.includes('bir') || q.includes('billing')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paragliding%2C_Bir-Billing_%28HP%29%2C_India.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paragliding%2C_Bir-Billing_%28HP%29%2C_India.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Paragliding%2C_Bir-Billing_%28HP%29%2C_India.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Bir-Billing.jpg?width=1200'
      ]
    };
  }
  if (q.includes('shimla') || q.includes('kufri')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_-_Ridge_-_Shimla_2014-05-07_0963.JPG?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_-_Ridge_-_Shimla_2014-05-07_0963.JPG?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_-_Ridge_-_Shimla_2014-05-07_0963.JPG?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_Shimla.jpg?width=1200'
      ]
    };
  }
  if (q.includes('spiti') || q.includes('kaza')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/1000_Year_loop.jpg?width=1200'
      ]
    };
  }
  if (q.includes('kasol') || q.includes('manikaran') || q.includes('tosh') || q.includes('parvati')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Sahib%2C_Himachal_Pradesh.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Sahib%2C_Himachal_Pradesh.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Sahib%2C_Himachal_Pradesh.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Lake.jpg?width=1200'
      ]
    };
  }
  if (q.includes('jibhi') || q.includes('tirthan')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Bridge.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Bridge.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Bridge.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Waterfall_Gate.jpg?width=1200'
      ]
    };
  }
  if (q.includes('kinnaur') || q.includes('kalpa') || q.includes('sangla') || q.includes('chitkul')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chitkul_the_last_village_of_India.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chitkul_the_last_village_of_India.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Chitkul_the_last_village_of_India.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Temple_at_Chitkul.JPG?width=1200'
      ]
    };
  }
  if (q.includes('palampur') || q.includes('baijnath')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Baijnath_temple.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Baijnath_temple.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Baijnath_temple.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=1200'
      ]
    };
  }
  if (q.includes('jawala') || q.includes('chintpurni')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jawala_Ji_Temple.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jawala_Ji_Temple.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Jawala_Ji_Temple.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Chintpurni_Devi_(1).JPG?width=1200'
      ]
    };
  }
  if (q.includes('kangra') || q.includes('masroor') || q.includes('chamunda')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_,Himachal_Pradesh_06.jpg?width=1200'
      ]
    };
  }
  if (q.includes('kullu') || q.includes('naggar')) {
    return {
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle_-_2.jpg?width=1200',
      featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle_-_2.jpg?width=1200',
      images: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle_-_2.jpg?width=1200',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle.jpg?width=1200'
      ]
    };
  }
  return {
    heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=1200',
    featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=1200',
    images: [
      'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=1200',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar.jpg?width=1200'
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
        return parsed.map(enrichDestinationWithExactImage);
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
    try {
      const res = await axiosClient.get(`/destinations/${slug}`);
      if (res && res.success && res.data) {
        const local = getLocalDestinations();
        const localMatch = local.find(l => l._id === res.data._id || l.slug === res.data.slug);
        const item = localMatch ? { ...res.data, ...localMatch } : res.data;
        return { success: true, data: enrichDestinationWithExactImage(item) };
      }
    } catch (err) {}

    const list = getLocalDestinations();
    const found = list.find(d => d.slug === slug || d._id === slug);
    if (found) {
      return { success: true, data: enrichDestinationWithExactImage(found) };
    }
    return { success: false, message: 'Destination not found' };
  },

  getById: async (id) => {
    try {
      const res = await axiosClient.get(`/destinations/${id}`);
      if (res && res.success && res.data) {
        const local = getLocalDestinations();
        const localMatch = local.find(l => l._id === res.data._id || l.slug === res.data.slug);
        const item = localMatch ? { ...res.data, ...localMatch } : res.data;
        return { success: true, data: enrichDestinationWithExactImage(item) };
      }
    } catch (err) {}

    const list = getLocalDestinations();
    const found = list.find(d => d._id === id || d.slug === id);
    if (found) {
      return { success: true, data: enrichDestinationWithExactImage(found) };
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
