import Inquiry from '../models/Inquiry.js';

// @desc    Submit new inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, subject, destination } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and message'
      });
    }

    const inquiry = await Inquiry.create(req.body);

    const adminPhone = '9068888578';
    const whatsappNotificationUrl = `https://wa.me/91${adminPhone}?text=${encodeURIComponent(
      `🔔 *NEW INQUIRY - Vista Tour and Travels*\n` +
      `👤 *Customer:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `✉️ *Email:* ${email}\n` +
      `📍 *Subject / Destination:* ${subject || destination || 'General Haryana & NCR Tour / Cab Inquiry'}\n` +
      `💬 *Message:* ${message}`
    )}`;

    console.log(`[ADMIN NOTIFICATION DISPATCH] New Inquiry for Admin Contact +91 90688 88578: ${name} (${phone}) - "${message.slice(0, 60)}"`);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Inquiry is linked with Admin contact (+91 90688 88578).',
      data: inquiry,
      adminContact: '+91 90688 88578',
      adminWhatsAppUrl: whatsappNotificationUrl
    });
  } catch (error) {
    next(error);
  }
};

const FAKE_INQUIRY_EMAILS = [
  'amitabh.d@gmail.com',
  'neha.k@outlook.com',
  'sanjeev.nair@indianarmy.in',
  'siddharth@example.com',
  'ananya.s@example.com'
];
const FAKE_INQUIRY_NAMES = [
  'Amitabh Deshmukh',
  'Neha Kapoor',
  'Col. Sanjeev Nair',
  'Siddharth Saxena',
  'Ananya Sharma'
];

// @desc    Get all inquiries (Admin)
// @route   GET /api/inquiries
// @access  Private/Admin
export const getInquiries = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const query = {
      email: { $nin: FAKE_INQUIRY_EMAILS },
      name: { $nin: FAKE_INQUIRY_NAMES }
    };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: inquiries,
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

// @desc    Update inquiry status & notes (Admin)
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
export const updateInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry (Admin)
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
