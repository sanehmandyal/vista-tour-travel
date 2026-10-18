import FAQ from '../models/FAQ.js';

export const getFAQs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      data: faqs
    });
  } catch (error) {
    next(error);
  }
};

export const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

export const updateFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, message: 'FAQ updated successfully', data: faq });
  } catch (error) {
    next(error);
  }
};

export const deleteFAQ = async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
};
