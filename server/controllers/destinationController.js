import mongoose from 'mongoose';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import { createSlug } from '../utils/slugify.js';

const getExactDestinationImages = (name = '', slug = '') => {
  const q = `${name} ${slug}`.toLowerCase();
  if (q.includes('kurukshetra') || q.includes('brahma') || q.includes('jyotisar')) {
    return {
      heroImage: '/assets/images/hero-haryana-kurukshetra.jpg',
      featuredImage: '/assets/images/hero-haryana-kurukshetra.jpg',
      images: [
        '/assets/images/hero-haryana-kurukshetra.jpg',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200'
      ]
    };
  }
  if (q.includes('ambala') || q.includes('cantt')) {
    return {
      heroImage: '/assets/images/ambala.jpg',
      featuredImage: '/assets/images/ambala.jpg',
      images: [
        '/assets/images/ambala.jpg'
      ]
    };
  }
  if (q.includes('delhi') || q.includes('ncr') || q.includes('qutub') || q.includes('india gate')) {
    return {
      heroImage: '/assets/images/delhi.jpg',
      featuredImage: '/assets/images/delhi.jpg',
      images: [
        '/assets/images/delhi.jpg',
        'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=1200'
      ]
    };
  }
  if (q.includes('karnal') || q.includes('karna')) {
    return {
      heroImage: '/assets/images/karnal.jpg',
      featuredImage: '/assets/images/karnal.jpg',
      images: [
        '/assets/images/karnal.jpg'
      ]
    };
  }
  if (q.includes('panipat') || q.includes('kala amb') || q.includes('kabuli')) {
    return {
      heroImage: '/assets/images/panipat.jpg',
      featuredImage: '/assets/images/panipat.jpg',
      images: [
        '/assets/images/panipat.jpg'
      ]
    };
  }
  if (q.includes('yamunanagar') || q.includes('kalesar') || q.includes('hathni')) {
    return {
      heroImage: '/assets/images/yamunanagar.jpg',
      featuredImage: '/assets/images/yamunanagar.jpg',
      images: [
        '/assets/images/yamunanagar.jpg'
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
      heroImage: '/assets/images/chandigarh.jpg',
      featuredImage: '/assets/images/chandigarh.jpg',
      images: [
        '/assets/images/chandigarh.jpg',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=1200'
      ]
    };
  }
  return {
    heroImage: '/assets/images/hero-haryana-kurukshetra.jpg',
    featuredImage: '/assets/images/hero-haryana-kurukshetra.jpg',
    images: [
      '/assets/images/hero-haryana-kurukshetra.jpg'
    ]
  };
};

const normalizeDestination = (dest) => {
  if (!dest) return dest;
  const doc = dest.toObject ? dest.toObject() : { ...dest };
  const exact = getExactDestinationImages(doc.name, doc.slug);

  const isLegacyCorrupted = (url) => !url || 
    typeof url !== 'string' ||
    url.trim() === '' ||
    url.includes('Dharamshala_stadium') ||
    url.includes('Kaithal_Fort');

  // Strictly preserve admin-uploaded images (base64 data URIs, hosted URLs, assets)
  const hasCustomHero = doc.heroImage && !isLegacyCorrupted(doc.heroImage);
  const hasCustomFeatured = doc.featuredImage && !isLegacyCorrupted(doc.featuredImage);

  const validHero = hasCustomHero ? doc.heroImage : (hasCustomFeatured ? doc.featuredImage : exact.heroImage);
  const validFeatured = hasCustomFeatured ? doc.featuredImage : (hasCustomHero ? doc.heroImage : exact.featuredImage);

  doc.heroImage = validHero;
  doc.featuredImage = validFeatured;

  const validGallery = Array.isArray(doc.gallery) ? doc.gallery.filter(img => !isLegacyCorrupted(img)) : [];
  doc.gallery = validGallery.length > 0 ? validGallery : [validHero];
  doc.images = doc.gallery;

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
    const cleanSlug = slug.replace(/^dest-/, '').toLowerCase().trim();

    let destination = null;
    if (isId) {
      destination = await Destination.findById(slug);
    }
    if (!destination) {
      destination = await Destination.findOne({
        $or: [
          { slug: slug },
          { slug: cleanSlug },
          { slug: new RegExp('^' + cleanSlug + '$', 'i') },
          { name: new RegExp('^' + cleanSlug.replace(/[-_]/g, ' ') + '$', 'i') }
        ]
      });
    }

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
    const cleanSlug = id.replace(/^dest-/, '').toLowerCase().trim();
    const bodySlug = (req.body.slug || '').toLowerCase().trim();
    const bodyName = (req.body.name || '').trim();

    let destination = null;
    if (isId) {
      destination = await Destination.findById(id);
    }
    if (!destination) {
      destination = await Destination.findOne({
        $or: [
          ...(cleanSlug ? [{ slug: cleanSlug }, { slug: id }, { slug: new RegExp('^' + cleanSlug + '$', 'i') }] : []),
          ...(bodySlug ? [{ slug: bodySlug }, { slug: new RegExp('^' + bodySlug + '$', 'i') }] : []),
          ...(bodyName ? [{ name: new RegExp('^' + bodyName + '$', 'i') }] : []),
          { name: new RegExp('^' + id.replace(/[-_]/g, ' ') + '$', 'i') }
        ]
      });
    }

    if (req.body.heroImage && !req.body.featuredImage) {
      req.body.featuredImage = req.body.heroImage;
    }
    if (req.body.featuredImage && !req.body.heroImage) {
      req.body.heroImage = req.body.featuredImage;
    }

    if (destination) {
      Object.assign(destination, req.body);
      if (req.body.heroImage) destination.heroImage = req.body.heroImage;
      if (req.body.featuredImage) destination.featuredImage = req.body.featuredImage;
      if (req.body.gallery) destination.gallery = req.body.gallery;
      if (req.body.attractions) destination.attractions = req.body.attractions;
      if (req.body.thingsToDo) destination.thingsToDo = req.body.thingsToDo;
      if (req.body.travelTips) destination.travelTips = req.body.travelTips;
      destination.markModified('gallery');
      destination.markModified('attractions');
      destination.markModified('thingsToDo');
      destination.markModified('travelTips');
      await destination.save();
      return res.status(200).json({
        success: true,
        message: 'Destination updated in database successfully',
        data: normalizeDestination(destination)
      });
    }

    const newDoc = await Destination.create({
      ...req.body,
      slug: bodySlug || cleanSlug || createSlug(req.body.name || id)
    });

    res.status(201).json({
      success: true,
      message: 'Destination saved to database successfully',
      data: normalizeDestination(newDoc)
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
