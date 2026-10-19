import mongoose from 'mongoose';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import { createSlug } from '../utils/slugify.js';

const getExactDestinationImages = (name = '', slug = '') => {
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

const normalizeDestination = (dest) => {
  if (!dest) return dest;
  const doc = dest.toObject ? dest.toObject() : { ...dest };
  const exact = getExactDestinationImages(doc.name, doc.slug);
  const isGeneric = (url) => !url || 
    typeof url !== 'string' ||
    url.trim() === '' ||
    url.includes('unsplash.com') ||
    url.includes('photo-15') ||
    url.includes('photo-16') ||
    url.includes('photo-14') ||
    url.includes('Dharamshala_stadium') ||
    (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/'));

  const validHero = !isGeneric(doc.heroImage) ? doc.heroImage : null;
  const validFeatured = !isGeneric(doc.featuredImage) ? doc.featuredImage : null;

  doc.heroImage = validHero || validFeatured || exact.heroImage;
  doc.featuredImage = validFeatured || validHero || exact.featuredImage;

  const validImages = Array.isArray(doc.images) ? doc.images.filter(img => !isGeneric(img)) : [];
  doc.images = validImages.length > 0 ? validImages : exact.images;

  const validGallery = Array.isArray(doc.gallery) ? doc.gallery.filter(img => !isGeneric(img)) : [];
  doc.gallery = validGallery.length > 0 ? validGallery : (validImages.length > 0 ? validImages : exact.images);

  return doc;
};

// @desc    Get all destinations with search, filter, pagination
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const {
      search,
      region,
      state,
      featured,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'active' };

    // Search by name or state
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Region filter
    if (region && region !== 'All') {
      query.region = region;
    }

    // State filter
    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    // Featured filter
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Price range
    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { startingPrice: 1 };
    else if (sort === 'price-desc') sortOption = { startingPrice: -1 };
    else if (sort === 'name-asc') sortOption = { name: 1 };
    else if (sort === 'name-desc') sortOption = { name: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const normalizedDestinations = destinations.map(normalizeDestination);

    res.status(200).json({
      success: true,
      data: normalizedDestinations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination by slug
// @route   GET /api/destinations/:slug
// @access  Public
export const getDestinationBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isId = mongoose.isValidObjectId(slug);
    const destination = isId
      ? await Destination.findById(slug)
      : await Destination.findOne({ slug });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Fetch recommended packages for this destination
    const packages = await Package.find({
      destination: destination._id,
      status: 'published'
    }).limit(6);

    // Fetch related destinations in same region
    const relatedDestinations = await Destination.find({
      _id: { $ne: destination._id },
      region: destination.region,
      status: 'active'
    }).limit(4);

    const normalizedDest = normalizeDestination(destination);
    const normalizedRelated = relatedDestinations.map(normalizeDestination);

    res.status(200).json({
      success: true,
      data: {
        ...normalizedDest,
        recommendedPackages: packages,
        relatedDestinations: normalizedRelated
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = req.body.slug || createSlug(name);

    // If exists with this slug or name, update smoothly instead of erroring
    let destination = await Destination.findOne({ $or: [{ slug }, { name: new RegExp('^' + name.trim() + '$', 'i') }] });
    if (destination) {
      Object.assign(destination, req.body, { slug });
      await destination.save();
    } else {
      destination = await Destination.create({
        ...req.body,
        slug
      });
    }

    res.status(201).json({
      success: true,
      message: 'Destination saved to database successfully',
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.name && !req.body.slug) {
      req.body.slug = createSlug(req.body.name);
    }

    const isId = mongoose.isValidObjectId(id);
    const filter = isId ? { _id: id } : { $or: [{ slug: id }, { name: new RegExp('^' + id.replace(/[-_]/g, ' ') + '$', 'i') }] };

    if (req.body.heroImage && !req.body.featuredImage) {
      req.body.featuredImage = req.body.heroImage;
    }
    if (req.body.featuredImage && !req.body.heroImage) {
      req.body.heroImage = req.body.featuredImage;
    }

    const destination = await Destination.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: false,
      upsert: true,
      setDefaultsOnInsert: true
    });

    res.status(200).json({
      success: true,
      message: 'Destination updated in database successfully',
      data: normalizeDestination(destination)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isId = mongoose.isValidObjectId(id);
    const filter = isId ? { _id: id } : { slug: id };
    const destination = await Destination.findOneAndDelete(filter);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
