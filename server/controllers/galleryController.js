import Gallery from '../models/Gallery.js';

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add photo to gallery
// @route   POST /api/gallery
// @access  Private/Admin
export const addGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Photo added to gallery',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete photo from gallery
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Photo deleted from gallery'
    });
  } catch (error) {
    next(error);
  }
};
