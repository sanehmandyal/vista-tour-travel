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
      heroImage: '/assets/images/kaithal-temple.jpg',
      featuredImage: '/assets/images/kaithal-temple.jpg',
      images: [
        '/assets/images/kaithal-temple.jpg',
        '/assets/images/kaithal-temple-anjani.jpg'
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
  const isInvalidUrl = (url) => !url || 
    typeof url !== 'string' || 
    url.trim() === '' || 
    url.includes('Dharamshala_stadium') ||
    url.includes('Kaithal_Fort');

  // Prioritize custom valid images uploaded by admin (data URIs, hosted URLs, assets)
  const hasCustomHero = dest.heroImage && !isInvalidUrl(dest.heroImage);
  const hasCustomFeatured = dest.featuredImage && !isInvalidUrl(dest.featuredImage);
  const attrCustom = Array.isArray(dest.attractions) && dest.attractions[0]?.image && !isInvalidUrl(dest.attractions[0].image)
    ? dest.attractions[0].image
    : null;

  const heroImage = hasCustomHero ? dest.heroImage : (hasCustomFeatured ? dest.featuredImage : (attrCustom || exact.heroImage));
  const featuredImage = hasCustomFeatured ? dest.featuredImage : heroImage;

  const validGallery = Array.isArray(dest.gallery)
    ? dest.gallery.filter(img => !isInvalidUrl(img))
    : [];
  const gallery = validGallery.length > 0 ? validGallery : [heroImage];
  const images = Array.isArray(dest.images) && dest.images.length > 0 && !dest.images.some(isInvalidUrl)
    ? dest.images
    : gallery;

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

  return list;
};

export const destinationApi = {
  getAll: async (params = {}) => {
    try {
      const res = await axiosClient.get('/destinations', { params });
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        const localList = getLocalDestinations();
        const enriched = res.data.map(serverItem => {
          const matchSlug = String(serverItem.slug || serverItem.name || '').toLowerCase().trim();
          const matchId = String(serverItem._id || '').toLowerCase().trim();
          const localMatch = localList.find(loc => 
            String(loc._id || '').toLowerCase() === matchId || 
            String(loc.slug || '').toLowerCase() === matchSlug ||
            String(loc.name || '').toLowerCase() === matchSlug
          );
          const hasCustomLocalHero = localMatch?.heroImage && !isInvalidUrl(localMatch.heroImage);
          const itemToEnrich = hasCustomLocalHero && isInvalidUrl(serverItem.heroImage)
            ? { ...serverItem, heroImage: localMatch.heroImage, featuredImage: localMatch.heroImage }
            : serverItem;
          return enrichDestinationWithExactImage(itemToEnrich);
        });
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
    const VALID_REGIONS = ['North India', 'South India', 'West India', 'East India', 'Himalayas', 'Central India', 'International'];
    const exact = getExactDestinationImages(data.name, data.slug);
    const finalHero = data.heroImage || exact.heroImage;

    const payload = {
      ...data,
      region: VALID_REGIONS.includes(data.region) ? data.region : 'North India',
      startingPrice: 0,
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
        const enriched = enrichDestinationWithExactImage(res.data);
        const list = getLocalDestinations();
        const updated = [enriched, ...list.filter(d => d._id !== enriched._id && d.slug !== enriched.slug)];
        saveLocalDestinations(updated);
        return { success: true, data: enriched };
      }
      throw new Error(res?.message || 'Server rejected destination creation');
    } catch (e) {
      console.error('Direct server create error:', e);
      throw new Error(e.message || 'Could not save destination to database. Please check your admin login session.');
    }
  },

  update: async (id, data) => {
    let updatedItem = null;
    const VALID_REGIONS = ['North India', 'South India', 'West India', 'East India', 'Himalayas', 'Central India', 'International'];
    const payload = {
      ...data,
      region: data.region && VALID_REGIONS.includes(data.region) ? data.region : (data.region ? 'North India' : undefined)
    };
    payload.startingPrice = 0;
    if (payload.heroImage && !payload.featuredImage) payload.featuredImage = payload.heroImage;
    if (payload.featuredImage && !payload.heroImage) payload.heroImage = payload.featuredImage;

    const isObjectId = (val) => Boolean(val && /^[0-9a-fA-F]{24}$/.test(String(val).trim()));
    const targetId = isObjectId(id) ? id : (isObjectId(data._id) ? data._id : (id || data.slug));

    let serverError = null;
    try {
      const res = await axiosClient.put(`/destinations/${targetId}`, payload);
      if (res && res.success && res.data) {
        updatedItem = res.data;
      }
    } catch (e) {
      serverError = e;
      // If failed with custom id, retry with slug or real ObjectId if available
      if (data.slug && targetId !== data.slug) {
        try {
          const res2 = await axiosClient.put(`/destinations/${data.slug}`, payload);
          if (res2 && res2.success && res2.data) {
            updatedItem = res2.data;
            serverError = null;
          }
        } catch (e2) {}
      }
    }

    if (!updatedItem) {
      console.error('Direct server update error:', serverError);
      throw new Error(serverError?.message || 'Failed to update destination in database. Please verify your connection.');
    }

    const finalHero = payload.heroImage || updatedItem?.heroImage;
    const list = getLocalDestinations();
    const matchId = String(id || '').toLowerCase().trim();
    const matchSlug = String(payload.slug || payload.name || '').toLowerCase().trim();

    const updated = list.map(d => {
      const isMatch =
        String(d._id || '').toLowerCase() === matchId ||
        String(d.slug || '').toLowerCase() === matchId ||
        String(d.slug || '').toLowerCase() === matchSlug ||
        String(d.name || '').toLowerCase() === matchSlug ||
        String(d.name || '').toLowerCase() === String(payload.name || '').toLowerCase().trim();

      if (isMatch) {
        const merged = { ...d, ...updatedItem, ...payload };
        if (finalHero) {
          merged.heroImage = finalHero;
          merged.featuredImage = finalHero;
        }
        return enrichDestinationWithExactImage(merged);
      }
      return d;
    });

    saveLocalDestinations(updated);
    return { success: true, data: enrichDestinationWithExactImage(updatedItem) };
  },

  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`/destinations/${id}`);
      if (res && res.success === false) {
        throw new Error(res.message || 'Failed to delete destination from database');
      }
    } catch (e) {
      console.error('Direct server delete failed:', e);
      throw new Error(e.message || 'Could not delete destination from database');
    }

    const list = getLocalDestinations();
    const filtered = list.filter(d => d._id !== id && d.slug !== id);
    saveLocalDestinations(filtered);
    return { success: true, message: 'Destination deleted successfully' };
  }
};

export default destinationApi;
