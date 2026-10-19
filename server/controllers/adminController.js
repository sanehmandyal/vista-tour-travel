import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import Inquiry from '../models/Inquiry.js';
import WebsiteSetting from '../models/WebsiteSetting.js';
import Car from '../models/Car.js';
import { handleImageUpload } from '../services/cloudinaryService.js';
import { destinationsData, getRegionalPackagesData, carsData } from '../data/regionalCatalogData.js';

// @desc    Get dashboard statistics & analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const FAKE_BOOKING_NUMS = ['VTT-2026-108', 'VTT-2026-109', 'VTT-2026-110', 'VTT-2026-111', 'VTT-2026-112'];
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

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalUsers,
      totalPackages,
      totalDestinations,
      totalInquiries,
      revenueData,
      recentBookings,
      recentInquiries
    ] = await Promise.all([
      Booking.countDocuments({ bookingNumber: { $nin: FAKE_BOOKING_NUMS } }),
      Booking.countDocuments({ bookingStatus: 'Pending', bookingNumber: { $nin: FAKE_BOOKING_NUMS } }),
      Booking.countDocuments({ bookingStatus: 'Confirmed', bookingNumber: { $nin: FAKE_BOOKING_NUMS } }),
      Booking.countDocuments({ bookingStatus: 'Completed', bookingNumber: { $nin: FAKE_BOOKING_NUMS } }),
      Booking.countDocuments({ bookingStatus: 'Cancelled', bookingNumber: { $nin: FAKE_BOOKING_NUMS } }),
      User.countDocuments({ role: 'user' }),
      Package.countDocuments(),
      Destination.countDocuments(),
      Inquiry.countDocuments({
        email: { $nin: FAKE_INQUIRY_EMAILS },
        name: { $nin: FAKE_INQUIRY_NAMES }
      }),
      Booking.aggregate([
        {
          $match: {
            bookingStatus: { $in: ['Confirmed', 'Completed', 'Pending'] },
            bookingNumber: { $nin: FAKE_BOOKING_NUMS }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' }
          }
        }
      ]),
      Booking.find({ bookingNumber: { $nin: FAKE_BOOKING_NUMS } })
        .populate('package', 'title')
        .sort({ createdAt: -1 })
        .limit(5),
      Inquiry.find({
        email: { $nin: FAKE_INQUIRY_EMAILS },
        name: { $nin: FAKE_INQUIRY_NAMES }
      })
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Monthly bookings & revenue trend for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          bookingNumber: { $nin: FAKE_BOOKING_NUMS }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedTrends = monthlyTrends.map(item => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      bookings: item.bookings,
      revenue: item.revenue
    }));

    // Status distribution
    const statusDistribution = [
      { name: 'Confirmed', value: confirmedBookings, color: '#0ea5e9' },
      { name: 'Completed', value: completedBookings, color: '#10b981' },
      { name: 'Pending', value: pendingBookings, color: '#f59e0b' },
      { name: 'Cancelled', value: cancelledBookings, color: '#ef4444' }
    ];

    // Popular Destinations count
    const popularDestinations = await Package.aggregate([
      {
        $group: {
          _id: '$destinationName',
          packagesCount: { $sum: 1 }
        }
      },
      { $sort: { packagesCount: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalBookings,
          totalRevenue,
          totalUsers,
          totalPackages,
          totalDestinations,
          totalInquiries,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings
        },
        monthlyTrends: formattedTrends,
        statusDistribution,
        popularDestinations: popularDestinations.map(d => ({
          name: d._id || 'Kurukshetra',
          count: d.packagesCount
        })),
        recentBookings,
        recentInquiries
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get website settings
// @route   GET /api/admin/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSetting.findOne();
    if (!settings) {
      settings = await WebsiteSetting.create({});
    }

    let needsSave = false;
    if (!settings.email || settings.email.includes('rinku') || settings.email === 'info@vistatourtravels.com') {
      settings.email = 'info@vistatourtravels.com';
      needsSave = true;
    }
    if (!settings.address || settings.address.includes('Kangra') || settings.address.includes('Amb') || settings.address.includes('Una') || settings.address.includes('Mohali')) {
      settings.address = 'Nawarsi Bazar, Ladwa, Haryana 136132, India';
      needsSave = true;
    }
    if (!settings.areasServed || settings.areasServed.includes('Himachal') || settings.areasServed.includes('Amb') || settings.areasServed.includes('Una') || settings.areasServed.includes('Mohali') || settings.areasServed.includes('Kangra')) {
      settings.areasServed = 'Nawarsi Bazar, Ladwa, Kurukshetra, Ambala, Delhi NCR, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh';
      needsSave = true;
    }
    if (!settings.serviceName || settings.serviceName.includes('Kangra') || settings.serviceName.includes('Rinku')) {
      settings.serviceName = 'Vista Tour and Travels';
      needsSave = true;
    }
    if (!settings.googleMapsUrl || settings.googleMapsUrl.includes('Kangra') || settings.googleMapsUrl.includes('Amb') || settings.googleMapsUrl.includes('Una')) {
      settings.googleMapsUrl = 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132';
      needsSave = true;
    }
    if (!settings.googleReviewsUrl || settings.googleReviewsUrl.includes('Kangra') || settings.googleReviewsUrl.includes('Amb') || settings.googleReviewsUrl.includes('Una')) {
      settings.googleReviewsUrl = 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132';
      needsSave = true;
    }
    if (settings.facebook && settings.facebook.includes('rinku')) {
      settings.facebook = 'https://facebook.com/vistatourtravels';
      needsSave = true;
    }
    if (settings.instagram && settings.instagram.includes('rinku')) {
      settings.instagram = 'https://instagram.com/vistatourtravels';
      needsSave = true;
    }
    if (settings.youtube && settings.youtube.includes('rinku')) {
      settings.youtube = 'https://youtube.com/@vistatourtravels';
      needsSave = true;
    }

    if (needsSave) {
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSetting.findOne();
    if (!settings) {
      settings = await WebsiteSetting.create(req.body);
    } else {
      settings = await WebsiteSetting.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      message: 'Website settings updated successfully',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload image file
// @route   POST /api/admin/upload
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imageUrl = await handleImageUpload(req.file);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed Regional Catalog (Haryana, Delhi NCR & Chandigarh)
// @route   POST /api/admin/seed-himachal
// @access  Private/Admin
export const seedHimachalCatalog = async (req, res, next) => {
  try {
    // 1. Clear old destinations, packages, cars
    await Promise.all([
      Destination.deleteMany(),
      Package.deleteMany(),
      Car.deleteMany()
    ]);

    // 2. 8 Authentic Regional Destinations
    const insertedDestinations = await Destination.insertMany(destinationsData);
    const destMap = {};
    insertedDestinations.forEach(d => {
      destMap[d.slug] = d;
    });

    // 3. 8 Regional Tour Packages
    const packagesData = getRegionalPackagesData(destMap);
    const insertedPackages = await Package.insertMany(packagesData);

    // 4. 10 Verified Car Fleet Models
    const insertedCars = await Car.insertMany(carsData);

    res.status(200).json({
      success: true,
      message: 'Regional catalog (Haryana, Delhi NCR & Chandigarh) successfully seeded into database!',
      data: {
        destinationsCount: insertedDestinations.length,
        packagesCount: insertedPackages.length,
        carsCount: insertedCars.length
      }
    });
  } catch (error) {
    next(error);
  }
};
