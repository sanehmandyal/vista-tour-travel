import PageContent from '../models/PageContent.js';
import { defaultPageData } from '../data/defaultPageData.js';

// Seed default pages if not existing
export const seedDefaultPagesIfEmpty = async () => {
  try {
    const count = await PageContent.countDocuments();
    if (count === 0) {
      console.log('Seeding initial CMS page data into MongoDB Atlas...');
      for (const page of defaultPageData) {
        await PageContent.findOneAndUpdate({ slug: page.slug }, page, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      console.log(`Seeded ${defaultPageData.length} CMS pages into database.`);
    }
  } catch (err) {
    console.warn('Page content seeding notice:', err.message);
  }
};

// @desc    Get all CMS pages
// @route   GET /api/pages
// @access  Public
export const getPages = async (req, res, next) => {
  try {
    let pages = await PageContent.find().sort({ title: 1 });
    if (!pages || pages.length === 0) {
      await seedDefaultPagesIfEmpty();
      pages = await PageContent.find().sort({ title: 1 });
    }
    res.status(200).json({
      success: true,
      data: pages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single page content by slug
// @route   GET /api/pages/:slug
// @access  Public
export const getPageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let page = await PageContent.findOne({ slug: slug.toLowerCase() });
    
    // If not in database, attempt seed from defaults
    if (!page) {
      const defaultMatch = defaultPageData.find(p => p.slug === slug.toLowerCase());
      if (defaultMatch) {
        page = await PageContent.create(defaultMatch);
      }
    }

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page '${slug}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: page
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new CMS page
// @route   POST /api/pages
// @access  Private/Admin
export const createPage = async (req, res, next) => {
  try {
    const slug = (req.body.slug || req.body.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await PageContent.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A page with this slug already exists'
      });
    }

    const page = await PageContent.create({
      ...req.body,
      slug
    });

    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: page
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update CMS page content
// @route   PUT /api/pages/:slug
// @access  Private/Admin
export const updatePage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const filter = { slug: slug.toLowerCase() };

    const page = await PageContent.findOneAndUpdate(
      filter,
      req.body,
      { new: true, upsert: true, runValidators: false, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Page content updated successfully in database',
      data: page
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom CMS page
// @route   DELETE /api/pages/:slug
// @access  Private/Admin
export const deletePage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const protectedPages = ['home', 'about', 'services', 'contact', 'faq'];
    if (protectedPages.includes(slug.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Core system pages cannot be deleted. You can unpublish or edit them.'
      });
    }

    const page = await PageContent.findOneAndDelete({ slug: slug.toLowerCase() });
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
