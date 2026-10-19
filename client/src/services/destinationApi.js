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
    url.trim() === '' ||
    url.includes('images.unsplash.com') || 
    url.includes('photo-15') || 
    url.includes('photo-16') || 
    url.includes('photo-14') ||
    url.includes('Dharamshala_stadium') ||
    (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/'));

  // Prioritize custom valid images uploaded by admin
  const validHero = !isGenericOrUnmatched(dest.heroImage) ? dest.heroImage : null;
  const validFeatured = !isGenericOrUnmatched(dest.featuredImage) ? dest.featuredImage : null;

  const heroImage = validHero || validFeatured || exact.heroImage;
  const featuredImage = validFeatured || validHero || exact.featuredImage;

  const validImages = Array.isArray(dest.images)
    ? dest.images.filter(img => !isGenericOrUnmatched(img))
    : [];
  const images = validImages.length > 0 ? validImages : exact.images;

  const validGallery = Array.isArray(dest.gallery)
    ? dest.gallery.filter(img => !isGenericOrUnmatched(img))
    : [];
  const gallery = validGallery.length > 0 ? validGallery : (validImages.length > 0 ? validImages : exact.images);

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
        // Filter out legacy Himachal items while preserving all custom destinations
        const cleanList = parsed.filter(d =>
          !d.name?.toLowerCase().includes('manali') &&
          !d.name?.toLowerCase().includes('shimla') &&
          !d.state?.toLowerCase().includes('himachal')
        );
        if (cleanList.length > 0) {
          return cleanList.map(enrichDestinationWithExactImage);
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
        const enriched = res.data.map(enrichDestinationWithExactImage);
        // Sync local cache with global server catalog
        saveLocalDestinations(enriched);
        return {
          success: true,
          data: enriched,
          pagination: res.pagination || {
            total: enriched.length,
            page: params.page || 1,
            totalPages: 1,
            limit: params.limit || 50
          }
        };
      }
    } catch (err) {
      console.warn('Backend unavailable, using cached destinations:', err.message);
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
    let savedItem = null;
    const VALID_REGIONS = ['North India', 'South India', 'West India', 'East India', 'Himalayas', 'Central India', 'International'];
    const exact = getExactDestinationImages(data.name, data.slug);
    const finalHero = data.heroImage || exact.heroImage;

    const payload = {
      ...data,
      region: VALID_REGIONS.includes(data.region) ? data.region : 'North India',
      startingPrice: Number(data.startingPrice) || 1999,
      bestTimeToVisit: data.bestTimeToVisit || 'September to March',
      heroImage: finalHero,
      featuredImage: data.featuredImage || finalHero,
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [finalHero],
      gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [finalHero],
      shortDescription: data.shortDescription?.trim() || `${data.name} tour and taxi packages from Ladwa & Kurukshetra, Haryana.`,
      description: data.description?.trim() || `Explore ${data.name} with reliable sanitized cabs and experienced drivers from Vista Tour and Travels.`,
      attractions: Array.isArray(data.attractions) && data.attractions.length > 0 ? data.attractions : [
        { title: `${data.name} Sightseeing`, description: 'Key historic and spiritual points of interest', image: finalHero }
      ],
      thingsToDo: Array.isArray(data.thingsToDo) && data.thingsToDo.length > 0 ? data.thingsToDo : [
        { title: 'Local Sightseeing & Tour', description: 'Explore top landmarks and markets', icon: 'Compass' }
      ]
    };

    try {
      const res = await axiosClient.post('/destinations', payload);
      if (res && res.success && res.data) {
        savedItem = res.data;
      }
    } catch (e) {
      console.warn('Direct server create error, falling back locally:', e.message);
    }

    const list = getLocalDestinations();
    const newDest = savedItem ? enrichDestinationWithExactImage(savedItem) : {
      ...payload,
      _id: `custom-dest-${Date.now()}`,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: data.rating || 5.0,
      reviewsCount: data.reviewsCount || 1,
      featured: data.featured !== undefined ? data.featured : true,
      isFeatured: data.featured !== undefined ? data.featured : true,
      createdAt: new Date().toISOString()
    };

    const updated = [newDest, ...list.filter(d => d._id !== newDest._id && d.slug !== newDest.slug)];
    saveLocalDestinations(updated);
    return { success: true, data: newDest };
  },

  update: async (id, data) => {
    let updatedItem = null;
    const VALID_REGIONS = ['North India', 'South India', 'West India', 'East India', 'Himalayas', 'Central India', 'International'];
    const payload = {
      ...data,
      region: data.region && VALID_REGIONS.includes(data.region) ? data.region : (data.region ? 'North India' : undefined)
    };
    if (payload.startingPrice !== undefined) payload.startingPrice = Number(payload.startingPrice) || 1999;
    if (payload.heroImage && !payload.featuredImage) payload.featuredImage = payload.heroImage;
    if (payload.featuredImage && !payload.heroImage) payload.heroImage = payload.featuredImage;

    try {
      const res = await axiosClient.put(`/destinations/${id}`, payload);
      if (res && res.success && res.data) {
        updatedItem = res.data;
      }
    } catch (e) {
      console.warn('Direct server update error, updating locally:', e.message);
      if (e.status === 401 || e.status === 403) {
        throw new Error(e.message || 'You must be signed in as administrator to update destinations.');
      }
    }

    const list = getLocalDestinations();
    const updated = list.map(d => {
      if (d._id === id || d.slug === id) {
        return updatedItem ? enrichDestinationWithExactImage(updatedItem) : { ...d, ...payload };
      }
      return d;
    });
    saveLocalDestinations(updated);
    const resultItem = updated.find(d => d._id === id || d.slug === id) || (updatedItem ? enrichDestinationWithExactImage(updatedItem) : null);
    return { success: true, data: resultItem };
  },

  delete: async (id) => {
    try {
      await axiosClient.delete(`/destinations/${id}`);
    } catch (e) {
      console.warn('Direct server delete failed, removing locally:', e.message);
    }

    const list = getLocalDestinations();
    const filtered = list.filter(d => d._id !== id && d.slug !== id);
    saveLocalDestinations(filtered);
    return { success: true, message: 'Destination deleted successfully' };
  }
};

export default destinationApi;
