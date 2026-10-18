import Blog from '../models/Blog.js';
import { createSlug } from '../utils/slugify.js';

// @desc    Get all blogs with filter and pagination
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const query = { status: 'published' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: blogs,
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

// @desc    Get blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Related articles
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      status: 'published'
    }).limit(3);

    res.status(200).json({
      success: true,
      data: {
        ...blog.toObject(),
        relatedBlogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog (Admin)
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    const { title } = req.body;
    const slug = req.body.slug || createSlug(title);

    const blog = await Blog.create({
      ...req.body,
      slug
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog (Admin)
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.body.title && !req.body.slug) {
      req.body.slug = createSlug(req.body.title);
    }

    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog (Admin)
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
