import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import { generateBookingNumber } from '../utils/generateBookingNumber.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public / Private (authenticated if token provided)
export const createBooking = async (req, res, next) => {
  try {
    const {
      packageId,
      customerName,
      email,
      phone,
      address,
      travelDate,
      adults = 1,
      children = 0,
      pickupLocation,
      specialRequirements
    } = req.body;

    if (!packageId || !customerName || !email || !phone || !travelDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields including package, name, email, phone, and travel date'
      });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Selected tour package not found'
      });
    }

    const adultCount = Math.max(1, parseInt(adults, 10));
    const childCount = Math.max(0, parseInt(children, 10));

    // Dynamic price calculation
    const basePricePerPerson = pkg.discountedPrice > 0 ? pkg.discountedPrice : pkg.price;
    const adultsSubtotal = adultCount * basePricePerPerson;
    const childrenSubtotal = childCount * (basePricePerPerson * 0.5); // 50% for kids
    const subtotal = adultsSubtotal + childrenSubtotal;
    const taxes = Math.round(subtotal * 0.05); // 5% GST
    const totalAmount = subtotal + taxes;

    const bookingNumber = generateBookingNumber();

    const bookingData = {
      bookingNumber,
      package: pkg._id,
      customerName,
      email: email.toLowerCase(),
      phone,
      address: address || '',
      travelDate: new Date(travelDate),
      adults: adultCount,
      children: childCount,
      pickupLocation: pickupLocation || 'Airport / Railway Station Pick-up',
      specialRequirements: specialRequirements || '',
      packagePrice: basePricePerPerson,
      taxes,
      totalAmount,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending'
    };

    // If user is authenticated
    if (req.user) {
      bookingData.user = req.user._id;
    }

    const booking = await Booking.create(bookingData);
    const populatedBooking = await Booking.findById(booking._id).populate('package');

    res.status(201).json({
      success: true,
      message: 'Your booking has been placed successfully!',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
    })
      .populate('package')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID or bookingNumber
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { _id: id };

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { bookingNumber: id };
    }

    const booking = await Booking.findOne(query).populate('package user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Access control: User can only view their own booking unless admin
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'superadmin' &&
      booking.email.toLowerCase() !== req.user.email.toLowerCase() &&
      (!booking.user || booking.user._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

const FAKE_BOOKING_NUMS = ['VTT-2026-108', 'VTT-2026-109', 'VTT-2026-110', 'VTT-2026-111', 'VTT-2026-112'];

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {
      bookingNumber: { $nin: FAKE_BOOKING_NUMS }
    };

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    if (search) {
      query.$or = [
        { bookingNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('package', 'title duration price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: bookings,
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

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;

    const updateFields = {};
    if (bookingStatus) updateFields.bookingStatus = bookingStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const booking = await Booking.findByIdAndUpdate(id, updateFields, {
      new: true
    }).populate('package');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking (Admin)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
