import Testimonial from '../models/Testimonial.js';

// @desc    Get all testimonials (Public only gets approved)
// @route   GET /api/testimonials
// @access  Public
const FAKE_REVIEW_NAMES = [
  'aarav sharma',
  'priya sen & vikram',
  'col. sanjeev nair',
  'neha malhotra',
  'dr. rajesh khanna',
  'sunita chauhan',
  'vikram & sneha kapur',
  'kunal singhania',
  'deepika iyer',
  'harpreet singh'
];

export const getTestimonials = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'approved';
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    // Filter out obsolete fake reviews to only serve genuine traveler feedback
    const genuine = testimonials.filter(t => {
      const name = (t.customerName || '').toLowerCase().trim();
      return !FAKE_REVIEW_NAMES.some(fn => name === fn || name.includes(fn));
    });

    res.status(200).json({
      success: true,
      data: genuine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Public
export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It will be visible after approval.',
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial (Admin)
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial (Admin)
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
