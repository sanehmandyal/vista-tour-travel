import mongoose from 'mongoose';
import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import { createSlug } from '../utils/slugify.js';

// @desc    Get all tour packages with filters, search, pagination
// @route   GET /api/packages
// @access  Public
export const getPackages = async (req, res, next) => {
  try {
    const {
      search,
      destination,
      category,
      minPrice,
      maxPrice,
      duration,
      rating,
      featured,
      sort,
      status,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Filter by status if not specified (default to published for public)
    if (status) {
      query.status = status;
    } else {
      query.status = 'published';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { destinationName: { $regex: search, $options: 'i' } }
      ];
    }

    if (destination) {
      query.destination = destination;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Duration filter
    if (duration) {
      if (duration === 'short') { // 1-3 days
        query.daysCount = { $lte: 3 };
      } else if (duration === 'medium') { // 4-6 days
        query.daysCount = { $gte: 4, $lte: 6 };
      } else if (duration === 'long') { // 7+ days
        query.daysCount = { $gte: 7 };
      }
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'duration') sortOption = { daysCount: 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .populate('destination', 'name state country heroImage slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: packages,
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

// @desc    Get package by slug or ID
// @route   GET /api/packages/:slug
// @access  Public
export const getPackageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    // Check if slug is an ObjectId or slug string
    const isObjectId = slug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: slug } : { slug };

    const pkg = await Package.findOne(query).populate('destination');

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Tour package not found'
      });
    }

    // Related packages in same category or destination
    const relatedPackages = await Package.find({
      _id: { $ne: pkg._id },
      $or: [{ destination: pkg.destination?._id }, { category: pkg.category }],
      status: 'published'
    }).limit(3);

    res.status(200).json({
      success: true,
      data: {
        ...pkg.toObject(),
        relatedPackages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = async (req, res, next) => {
  try {
    const { title, destination } = req.body;
    const slug = req.body.slug || createSlug(title);

    const destDoc = await Destination.findById(destination);
    const destinationName = destDoc ? destDoc.name : '';

    const pkg = await Package.create({
      ...req.body,
      slug,
      destinationName
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: pkg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.body.title && !req.body.slug) {
      req.body.slug = createSlug(req.body.title);
    }

    if (req.body.destination) {
      const destDoc = await Destination.findById(req.body.destination);
      if (destDoc) req.body.destinationName = destDoc.name;
    }

    const isId = mongoose.isValidObjectId(id);
    const filter = isId ? { _id: id } : { slug: id };

    const pkg = await Package.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: pkg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isId = mongoose.isValidObjectId(id);
    const filter = isId ? { _id: id } : { slug: id };
    const pkg = await Package.findOneAndDelete(filter);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
