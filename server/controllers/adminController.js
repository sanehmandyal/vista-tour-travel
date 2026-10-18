import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import Inquiry from '../models/Inquiry.js';
import WebsiteSetting from '../models/WebsiteSetting.js';
import Car from '../models/Car.js';
import { handleImageUpload } from '../services/cloudinaryService.js';

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
          name: d._id || 'Himachal',
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
    if (!settings.address || settings.address.includes('Kangra') || !settings.address.includes('Bus Stand') || !settings.address.includes('Una') || settings.address === 'Amb, Himachal Pradesh 177203, India') {
      settings.address = 'Sector 73, Mohali, Punjab 160055, India';
      needsSave = true;
    }
    if (!settings.areasServed || !settings.areasServed.includes('Bus Stand') || settings.areasServed.startsWith('Kangra')) {
      settings.areasServed = 'Amb (Near Bus Stand), Una District, Kangra, Dharamshala, McLeodGanj, Bir Billing, Dalhousie, Manali, Shimla, Chandigarh & All Himachal';
      needsSave = true;
    }
    if (!settings.serviceName || settings.serviceName.includes('Kangra') || settings.serviceName.includes('Rinku')) {
      settings.serviceName = 'Vista Tour and Travels';
      needsSave = true;
    }
    if (!settings.googleMapsUrl || settings.googleMapsUrl.includes('Kangra')) {
      settings.googleMapsUrl = 'https://www.google.com/maps?q=Bus+Stand+Amb,+Una,+Himachal+Pradesh+177203';
      needsSave = true;
    }
    if (!settings.googleReviewsUrl || settings.googleReviewsUrl.includes('Kangra')) {
      settings.googleReviewsUrl = 'https://www.google.com/maps?cid=2473238779693105097';
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

// @desc    Seed strictly Himachal Destinations, Packages, and Car Fleet
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

    // 2. 12 Authentic 100% Himachal Pradesh Destinations
    const destinationsData = [
      {
        name: 'Dharamshala & McLeodganj',
        slug: 'dharamshala-mcleodganj',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Spiritual heart of Kangra with Dalai Lama Temple, HPCA Stadium, and snow-capped Dhauladhar peaks.',
        description: 'Home to His Holiness the 14th Dalai Lama and seat of the Tibetan government-in-exile, Dharamshala and McLeodganj offer a mesmerizing fusion of Buddhist spirituality, colonial charm, cedar woodlands, and scenic mountain cafes.',
        heroImage: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Tsuglagkhang Complex (Dalai Lama Temple)', description: 'Sacred sanctum with rotating prayer wheels and chanting monks.', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80' },
          { title: 'HPCA Cricket Stadium', description: 'Scenic international stadium with snow-covered Dhauladhar peaks in the backdrop.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
          { title: 'Bhagsunag Waterfall & Temple', description: 'Cascading natural mountain fresh spring and historic freshwater temple.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Triund Day Trek', description: 'Trek up through rhododendron and pine forests for panoramic Dhauladhar vistas.', icon: 'Compass' },
          { title: 'Tibetan Market Shopping', description: 'Handcrafted singing bowls, thangkas, and warm pashmina shawls.', icon: 'ShoppingBag' }
        ],
        bestTimeToVisit: 'Throughout the year',
        startingPrice: 5999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Dalhousie & Khajjiar',
        slug: 'dalhousie-khajjiar',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'The "Mini Switzerland of India" featuring dense deodar forests, colonial bungalows, and saucer-shaped emerald meadows.',
        description: 'Spread over five scenic hills, Dalhousie is famed for its vintage Scottish architecture, tranquil pine-scented promenades, and old stone churches. Nearby lies Khajjiar, a breathtaking saucer-shaped green meadow ringed by tall cedars with a pristine lake at its center.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar_lake.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar_lake.jpg?width=800'
        ],
        attractions: [
          { title: 'Khajjiar Lake & Meadow', description: 'Lush alpine meadow with cedar trees, floating island, and 12th-century Khajji Nag temple.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar_lake.jpg?width=600' },
          { title: 'Dainkund Peak', description: 'Highest point in Dalhousie offering 360-degree views of snow peaks and valley rivers.', image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Zorbing & Horse Riding', description: 'Roll down green grassy slopes or take a peaceful pony ride across the meadow.', icon: 'Sun' }
        ],
        bestTimeToVisit: 'April to July & December to February',
        startingPrice: 6999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Manali & Solang Valley',
        slug: 'manali-solang',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Snow-capped peaks, pine forests, Rohtang Pass glaciers, Atal Tunnel, and thrilling mountain sports.',
        description: 'Nestled on the banks of the Beas River, Manali is one of India’s most celebrated mountain destinations. From skiing down Solang Valley to unwinding near Hadimba Temple, traversing Rohtang Pass, and crossing Atal Tunnel to Sissu.',
        heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Solang Valley', description: 'Famous for paragliding, zorbing, and winter snow skiing.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
          { title: 'Atal Tunnel & Sissu Waterfall', description: 'Cross 9.02 km mountain tunnel into the glacial paradise of Lahaul.', image: 'https://images.unsplash.com/photo-1586351012965-861624544334?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Skiing & Snow Tubing', description: 'Pure powder snow fun during winter months.', icon: 'Wind' }
        ],
        bestTimeToVisit: 'Throughout the year',
        startingPrice: 8999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Shimla & Kufri',
        slug: 'shimla-kufri',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'The Queen of Hills with charming British colonial heritage, UNESCO Toy Train, and scenic Mall Road.',
        description: 'Shimla retains timeless colonial elegance. Surrounded by oak and deodar forests, Shimla is famed for its iconic Ridge, Christ Church, the UNESCO World Heritage Toy Train, and snow points in Kufri.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_Shimla.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_Shimla.jpg?width=800'
        ],
        attractions: [
          { title: 'The Ridge & Mall Road', description: 'Cultural center with neo-Gothic Christ Church and Himalayan valley views.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_Shimla.jpg?width=600' },
          { title: 'Kufri Snow Point', description: 'Winter wonderland for horse riding, yak rides, and tobogganing.', image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Toy Train Ride', description: 'Ride through scenic pine valleys.', icon: 'Train' }
        ],
        bestTimeToVisit: 'March to June & December to February',
        startingPrice: 7499,
        featured: true,
        status: 'active'
      },
      {
        name: 'Bir Billing',
        slug: 'bir-billing',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'World-famous Paragliding Capital of India with high-altitude take-offs, Tibetan monasteries, and organic tea estates.',
        description: 'Ranked as the 2nd best site in the world for paragliding, Bir Billing is an international adventure haven. Take off from the ridge of Billing (8,000 ft) and glide over the Kangra Valley before touching down in Bir.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bir-Billing.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Bir-Billing.jpg?width=800'
        ],
        attractions: [
          { title: 'Billing Take-Off Point', description: 'Launchpad at 2,400 meters offering panoramic aerial views of Kangra.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bir-Billing.jpg?width=600' },
          { title: 'Baijnath Temple', description: 'Ancient 13th-century stone Nagara-style temple dedicated to Lord Shiva.', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Tandem Paragliding', description: 'Fly with certified pilots and GoPro recording.', icon: 'Wind' }
        ],
        bestTimeToVisit: 'October to June',
        startingPrice: 4999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Spiti Valley & Kaza',
        slug: 'spiti-valley-kaza',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'The Middle Land with stark cold desert moonscapes, 1000-year-old Key Monastery, and azure Chandratal Lake.',
        description: 'Separating India from Tibet, Spiti Valley is a dramatic high-altitude desert kingdom with ancient monasteries, high passes, and glacial lakes.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=800'
        ],
        attractions: [
          { title: 'Key Gompa Monastery', description: 'Historic fortress-like Tibetan Buddhist monastery.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=600' },
          { title: 'Chandratal Lake', description: 'Turquoise glacial lake at 14,100 ft.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Milky Way Stargazing', description: 'Unmatched night skies.', icon: 'Star' }
        ],
        bestTimeToVisit: 'June to October',
        startingPrice: 18999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Kasol & Tosh (Parvati Valley)',
        slug: 'kasol-parvati-valley',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Riverside mountain cafes, hot sulphur springs of Manikaran, apple orchards of Tosh, and Kheerganga trails.',
        description: 'Cradled in the lush Parvati Valley, Kasol is a tranquil riverside haven famous for fresh mountain air, vibrant bohemian cafes, and pine forest walks.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Lake.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Lake.jpg?width=800'
        ],
        attractions: [
          { title: 'Manikaran Sahib Gurudwara & Hot Springs', description: 'Sacred thermal sulphur springs.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Lake.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Chalal Riverside Walk', description: 'Peaceful stroll along deodar trails.', icon: 'Compass' }
        ],
        bestTimeToVisit: 'March to June & September to November',
        startingPrice: 5499,
        featured: true,
        status: 'active'
      },
      {
        name: 'Jibhi & Tirthan Valley',
        slug: 'jibhi-tirthan-valley',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Pristine offbeat paradise with wooden Himachali cottages, Serolsar Lake, Jalori Pass, and trout streams.',
        description: 'Hidden away in the Kullu district, Jibhi and Tirthan Valley are the crown jewels of offbeat Himachal with pure rivers and wooden chalets.',
        heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Jalori Pass & Serolsar Lake', description: 'High pass at 10,800 ft leading to sacred crystal lake.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Trout Stream Walk', description: 'Relax by crystal clear mountain waters.', icon: 'Compass' }
        ],
        bestTimeToVisit: 'March to June & September to December',
        startingPrice: 6499,
        featured: true,
        status: 'active'
      },
      {
        name: 'Kinnaur, Kalpa & Sangla (Chitkul)',
        slug: 'kinnaur-kalpa-sangla',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Land of Kinner Kailash peak, apple orchards of Sangla, and Chitkul - the legendary last village of India.',
        description: 'Kinnaur is an enchanting tribal wonderland where Tibetan and Hindu traditions intertwine, with soaring peaks and apple orchards.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chitkul_the_last_village_of_India.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Chitkul_the_last_village_of_India.jpg?width=800'
        ],
        attractions: [
          { title: 'Kinner Kailash View in Kalpa', description: 'Sacred 6,050m peak.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
          { title: 'Chitkul Village', description: 'Last inhabited Indian village on the border.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Taste Kinnauri Apples', description: 'Crisp apples straight from orchards.', icon: 'Sun' }
        ],
        bestTimeToVisit: 'April to October',
        startingPrice: 16999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Palampur Tea Gardens & Baijnath',
        slug: 'palampur-baijnath',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'The Tea Capital of North India with sprawling emerald tea gardens, Neugal Khad stream, and ancient Shiva temple.',
        description: 'Lying in Kangra valley, Palampur is framed by snow-crested Dhauladhar mountains, lush tea plantations, and heritage stone shrines.',
        heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Kangra Tea Estates', description: 'Century-old fragrant tea bushes.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
          { title: 'Baijnath Shiva Temple', description: 'Revered 13th-century stone temple.', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Tea Tasting', description: 'Sample fresh Kangra green tea.', icon: 'Coffee' }
        ],
        bestTimeToVisit: 'Throughout the year',
        startingPrice: 4499,
        featured: false,
        status: 'active'
      },
      {
        name: 'Kangra & Jawalamukhi (Shaktipeeths)',
        slug: 'kangra-jawalamukhi',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Historic Kangra Fort, Brajeshwari Devi, Jawalaji eternal flame temple, Chamunda Devi, and Masroor Rock Cut Temple.',
        description: 'Kangra is the cradle of Himachal heritage with ancient forts and sacred Shaktipeeths where thousands seek blessings daily.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=800'
        ],
        attractions: [
          { title: 'Kangra Fort', description: 'Oldest fort in the Himalayas.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=600' },
          { title: 'Jawalamukhi Shaktipeeth', description: 'Eternal natural flames.', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Devi Darshan Yatra', description: 'Comfortable pilgrimage circuit with dedicated cab.', icon: 'Heart' }
        ],
        bestTimeToVisit: 'Throughout the year',
        startingPrice: 4999,
        featured: false,
        status: 'active'
      },
      {
        name: 'Kullu & Naggar Castle',
        slug: 'kullu-naggar',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Valley of Gods with wooden medieval Naggar Castle, Nicholas Roerich Art Gallery, and thrilling Beas river rafting.',
        description: 'Naggar is an artistic haven nestled amidst apple orchards and deodar hills above the Beas river with medieval timber architecture.',
        heroImage: 'https://images.unsplash.com/photo-1586351012965-861624544334?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1586351012965-861624544334?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Naggar Castle', description: 'Medieval timber and stone fort.', image: 'https://images.unsplash.com/photo-1586351012965-861624544334?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Beas River Rafting', description: 'Exciting rapids through Kullu valley.', icon: 'Compass' }
        ],
        bestTimeToVisit: 'March to June & September to December',
        startingPrice: 5999,
        featured: false,
        status: 'active'
      }
    ];

    const insertedDestinations = await Destination.insertMany(destinationsData);
    const destMap = {};
    insertedDestinations.forEach(d => {
      destMap[d.slug] = d;
    });

    // 3. 10 Comprehensive Himachal Tour Packages
    const packagesData = [
      {
        title: 'Kangra Valley, Dharamshala & Dalhousie Mini-Switzerland Tour',
        slug: 'kangra-valley-dharamshala-dalhousie-tour',
        destination: destMap['dharamshala-mcleodganj']._id,
        destinationName: 'Dharamshala & McLeodganj',
        category: 'Family Trips',
        duration: '5 Days / 4 Nights',
        daysCount: 5,
        nightsCount: 4,
        price: 16999,
        discountedPrice: 13999,
        rating: 5.0,
        reviewsCount: 48,
        description: 'The definitive Himachal holiday operated by Vista Tour and Travels. Discover Dalai Lama Temple in McLeodganj, scenic HPCA stadium, historic Kangra Fort, colonial Dalhousie, and Khajjiar (Mini Switzerland).',
        featuredImage: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Kangra / Dharamshala & Temples', description: 'Pickup from Kangra Airport / Pathankot. Visit Kangra Fort and Chamunda Devi.', meals: 'Welcome Drink & Dinner', hotel: 'Deluxe Valley Resort' },
          { day: 2, title: 'McLeodganj, Dalai Lama Temple & HPCA Stadium', description: 'Tour the temple complex, Bhagsu waterfall, and stadium.', meals: 'Breakfast & Dinner', hotel: 'Deluxe Valley Resort' },
          { day: 3, title: 'Dharamshala to Dalhousie Scenic Drive', description: 'Scenic drive to Dalhousie. Evening walk along Mall Road.', meals: 'Breakfast & Dinner', hotel: 'Grand View Resort' },
          { day: 4, title: 'Khajjiar (Mini Switzerland) Excursion', description: 'Full day in Khajjiar meadow and Kalatop sanctuary.', meals: 'Breakfast & Dinner', hotel: 'Grand View Resort' },
          { day: 5, title: 'Departure Transfer', description: 'Smooth drop to Pathankot / Kangra airport.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '4 Nights accommodation in 3/4-star valley-facing hotels',
          'Daily buffet breakfast and dinner',
          'Dedicated private AC Sedan / SUV (Toyota Innova Crysta / Dzire)',
          'All driver allowances, tolls, and parking'
        ],
        exclusions: ['Flight/Train tickets', 'Personal expenses'],
        hotels: 'Top rated valley hotels in Dharamshala & Dalhousie',
        transport: 'Private AC Toyota Innova / Dzire with mountain chauffeur',
        tags: ['Family', 'Hills', 'Scenic', 'Khajjiar'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Grand Complete Himachal Circuit (Shimla, Manali, Dharamshala, Dalhousie)',
        slug: 'complete-himachal-grand-circuit-tour',
        destination: destMap['manali-solang']._id,
        destinationName: 'Manali & Solang Valley',
        category: 'Family Trips',
        duration: '9 Days / 8 Nights',
        daysCount: 9,
        nightsCount: 8,
        price: 28999,
        discountedPrice: 24999,
        rating: 5.0,
        reviewsCount: 64,
        description: 'The ultimate all-inclusive Himachal vacation. Covers Shimla colonial heritage, Kufri snow point, Solang Valley, Atal Tunnel into Sissu, tea gardens of Palampur, McLeodganj Tibetan culture, and Khajjiar Mini-Switzerland.',
        featuredImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Chandigarh to Shimla Arrival', description: 'Scenic drive to Shimla. Evening on Mall Road.', meals: 'Dinner', hotel: 'Willow Banks Shimla' },
          { day: 2, title: 'Kufri Snow Adventure', description: 'Horse riding, nature park, and Jakhoo ropeway.', meals: 'Breakfast & Dinner', hotel: 'Willow Banks Shimla' },
          { day: 3, title: 'Shimla to Manali via Kullu', description: 'Drive along Beas river with Kullu stops.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
          { day: 4, title: 'Solang Valley & Atal Tunnel Sissu', description: 'Snow games and crossing the 9km tunnel into Lahaul.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
          { day: 5, title: 'Manali Local Sightseeing', description: 'Hadimba Temple and Vashisht springs.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
          { day: 6, title: 'Manali to Dharamshala via Palampur', description: 'Drive through tea gardens and Baijnath temple.', meals: 'Breakfast & Dinner', hotel: 'D’s Casa Dharamshala' },
          { day: 7, title: 'McLeodganj Sightseeing', description: 'Dalai Lama Temple and cricket stadium.', meals: 'Breakfast & Dinner', hotel: 'D’s Casa Dharamshala' },
          { day: 8, title: 'Dharamshala to Dalhousie & Khajjiar', description: 'Explore Khajjiar green meadows.', meals: 'Breakfast & Dinner', hotel: 'Grand View Dalhousie' },
          { day: 9, title: 'Departure Transfer', description: 'Drop to Pathankot / Chandigarh.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '8 Nights in verified 3/4-star mountain hotels',
          'Daily buffet breakfast and dinner',
          'Dedicated private AC Innova Crysta for complete tour',
          'All tolls, parking, and driver allowances'
        ],
        exclusions: ['Airfare/train', 'Personal shopping'],
        hotels: 'Top rated 4-star properties across Himachal',
        transport: 'Private AC Toyota Innova Crysta with hill chauffeur',
        tags: ['GrandTour', 'Family', 'Himachal', 'Complete'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Manali Snow Escape, Solang Valley & Atal Tunnel Tour',
        slug: 'manali-snow-solang-atal-tunnel-tour',
        destination: destMap['manali-solang']._id,
        destinationName: 'Manali & Solang Valley',
        category: 'Honeymoon',
        duration: '5 Days / 4 Nights',
        daysCount: 5,
        nightsCount: 4,
        price: 15999,
        discountedPrice: 12499,
        rating: 4.9,
        reviewsCount: 54,
        description: 'The classic honeymoon and family snow getaway in the Himalayas. Experience skiing down Solang Valley, traversing Atal Tunnel into frozen Sissu, Old Manali cafes, and riverside Kullu.',
        featuredImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Manali & Hadimba Temple', description: 'Visit Hadimba Temple and Mall Road.', meals: 'Welcome Drink & Dinner', hotel: 'Snow Valley Resort Manali' },
          { day: 2, title: 'Solang Valley Adventure', description: 'Paragliding, snow scooters, and ropeway.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
          { day: 3, title: 'Atal Tunnel & Sissu Waterfall', description: 'Pass through the 9.02 km tunnel into Lahaul.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
          { day: 4, title: 'Naggar Castle & Kullu Rafting', description: 'Explore wooden castle and riverside Kullu.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
          { day: 5, title: 'Departure Transfer', description: 'Return transfer to Chandigarh/Pathankot.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '4 Nights stay in 4-star mountain resort',
          'Daily buffet breakfast and dinner',
          'Private AC vehicle for all transfers',
          'Permits, tolls, and driver allowance'
        ],
        exclusions: ['Adventure fees', 'Personal expenses'],
        hotels: 'Snow Valley Resort Manali',
        transport: 'Private AC Sedan / Innova',
        tags: ['Snow', 'Honeymoon', 'Family', 'Manali'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Shimla, Kufri & Chail Heritage Getaway',
        slug: 'shimla-kufri-chail-heritage-tour',
        destination: destMap['shimla-kufri']._id,
        destinationName: 'Shimla & Kufri',
        category: 'Weekend Getaways',
        duration: '4 Days / 3 Nights',
        daysCount: 4,
        nightsCount: 3,
        price: 11999,
        discountedPrice: 9499,
        rating: 4.8,
        reviewsCount: 31,
        description: 'A refreshing British colonial escape. Experience iconic Mall Road, Christ Church, Kufri snow meadows, and Chail Palace, home to the world’s highest cricket ground.',
        featuredImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80',
        images: ['https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80'],
        itinerary: [
          { day: 1, title: 'Drive to Shimla & The Ridge Walk', description: 'Scenic drive. Evening on Mall Road.', meals: 'Dinner', hotel: 'Willow Banks Shimla' },
          { day: 2, title: 'Kufri Snow Adventure & Jakhoo Hill', description: 'Horse riding and cable car ride.', meals: 'Breakfast & Dinner', hotel: 'Willow Banks Shimla' },
          { day: 3, title: 'Chail Palace Excursion', description: 'Visit Chail Palace and cricket ground.', meals: 'Breakfast & Dinner', hotel: 'Willow Banks Shimla' },
          { day: 4, title: 'Departure', description: 'Return transfer.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['3 Nights stay with breakfast & dinner', 'Private AC vehicle', 'Tolls & driver allowance'],
        exclusions: ['Monument fees', 'Personal expenses'],
        hotels: 'Willow Banks Shimla',
        transport: 'Private AC Sedan',
        tags: ['Weekend', 'Heritage', 'Shimla'],
        featured: false,
        status: 'published'
      },
      {
        title: 'Spiti Valley & Chandratal Lake 4x4 High-Altitude Expedition',
        slug: 'spiti-valley-chandratal-4x4-expedition',
        destination: destMap['spiti-valley-kaza']._id,
        destinationName: 'Spiti Valley & Kaza',
        category: 'Adventure',
        duration: '7 Days / 6 Nights',
        daysCount: 7,
        nightsCount: 6,
        price: 32999,
        discountedPrice: 27999,
        rating: 5.0,
        reviewsCount: 42,
        description: 'An epic Himalayan road expedition through Atal Tunnel, Kunzum Pass (14,931 ft), Kaza, Key Monastery, Hikkim, and luxury camping beside the turquoise crescent Moon Lake (Chandratal).',
        featuredImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80',
        images: ['https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'],
        itinerary: [
          { day: 1, title: 'Manali to Kaza via Atal Tunnel & Kunzum', description: 'Drive into Spiti valley.', meals: 'Dinner', hotel: 'Grand Dew Kaza' },
          { day: 2, title: 'Key Monastery & Kibber', description: 'Tour 1,000-year-old monastery.', meals: 'Breakfast & Dinner', hotel: 'Grand Dew Kaza' },
          { day: 3, title: 'Hikkim, Komic & Langza Circuit', description: 'Highest post office and fossil village.', meals: 'Breakfast & Dinner', hotel: 'Grand Dew Kaza' },
          { day: 4, title: 'Pin Valley Exploration', description: 'Drive to Pin Valley National Park.', meals: 'Breakfast & Dinner', hotel: 'Grand Dew Kaza' },
          { day: 5, title: 'Chandratal Lake Camping', description: 'Camping by Moon Lake with stargazing.', meals: 'Breakfast & Dinner', hotel: 'Swiss Camps Chandratal' },
          { day: 6, title: 'Chandratal to Manali', description: 'Cross Rohtang Pass to Manali.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
          { day: 7, title: 'Departure Transfer', description: 'Smooth drop.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '6 Nights hotel & Swiss camp stays',
          'Dedicated 4x4 SUV (Mahindra Scorpio-N / Innova) with hill driver',
          'Oxygen cylinder and first-aid kits on board',
          'Daily breakfast & hot dinner',
          'Spiti permits and taxes'
        ],
        exclusions: ['Personal medicines', 'Tips'],
        hotels: 'Grand Dew Kaza & Chandratal Swiss Camps',
        transport: '4x4 High-Clearance SUV with expert chauffeur',
        tags: ['Offbeat', 'Adventure', '4x4', 'Spiti'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Bir Billing Paragliding & Baijnath Adventure Weekend',
        slug: 'bir-billing-paragliding-adventure-weekend',
        destination: destMap['bir-billing']._id,
        destinationName: 'Bir Billing',
        category: 'Adventure',
        duration: '3 Days / 2 Nights',
        daysCount: 3,
        nightsCount: 2,
        price: 8999,
        discountedPrice: 6999,
        rating: 4.9,
        reviewsCount: 38,
        description: 'Feel the ultimate rush of flying in the paragliding capital of India. Includes high-altitude tandem paragliding from Billing (8,000 ft), cozy boutique stay, cafe crawl, and visit to Baijnath Shiva Temple.',
        featuredImage: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1000&q=80',
        images: ['https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80'],
        itinerary: [
          { day: 1, title: 'Arrival in Bir & Sunset Site', description: 'Check into boutique camp, watch gliders land.', meals: 'Dinner & Bonfire', hotel: 'The Hosteller Bir' },
          { day: 2, title: 'Billing Paragliding Flight', description: 'Tandem paragliding with GoPro video.', meals: 'Breakfast & Dinner', hotel: 'The Hosteller Bir' },
          { day: 3, title: 'Baijnath Temple & Departure', description: 'Visit historic stone temple and drop.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '2 Nights stay in deluxe resort / boutique camp',
          '1 High-altitude tandem paragliding flight with certified pilot',
          'GoPro HD video recording of your flight',
          'Daily breakfast, dinner, and bonfire',
          'Private vehicle for transfers'
        ],
        exclusions: ['Personal expenses', 'Insurance'],
        hotels: 'The Hosteller Bir',
        transport: 'Private AC vehicle',
        tags: ['Paragliding', 'Adventure', 'Weekend'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Kasol, Tosh & Kheerganga Parvati Valley Trek Tour',
        slug: 'kasol-tosh-kheerganga-parvati-valley-tour',
        destination: destMap['kasol-parvati-valley']._id,
        destinationName: 'Kasol & Tosh (Parvati Valley)',
        category: 'Adventure',
        duration: '4 Days / 3 Nights',
        daysCount: 4,
        nightsCount: 3,
        price: 11499,
        discountedPrice: 8999,
        rating: 4.9,
        reviewsCount: 27,
        description: 'Immerse in the magic of Parvati Valley. Riverside cafes in Kasol, holy hot water springs of Manikaran Sahib, traditional Himachali homestay in Tosh, and scenic nature walks through deodar forests.',
        featuredImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
        images: ['https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'],
        itinerary: [
          { day: 1, title: 'Arrival in Kasol & River Walk', description: 'Riverside check-in and cafe hopping.', meals: 'Dinner', hotel: 'Riverside Resort Kasol' },
          { day: 2, title: 'Manikaran Sahib Hot Springs', description: 'Holy hot sulphur springs and Gurudwara.', meals: 'Breakfast & Dinner', hotel: 'Riverside Resort Kasol' },
          { day: 3, title: 'Tosh Village & Waterfall Excursion', description: 'Explore wooden village of Tosh.', meals: 'Breakfast & Dinner', hotel: 'Tosh Homestay' },
          { day: 4, title: 'Departure', description: 'Drop to Bhuntar / Chandigarh.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['3 Nights stay', 'Daily breakfast and dinner', 'Private car for all transfers'],
        exclusions: ['Personal cafe expenses'],
        hotels: 'Kasol Heights & Tosh Homestay',
        transport: 'Private AC Car',
        tags: ['ParvatiValley', 'Kasol', 'Tosh'],
        featured: false,
        status: 'published'
      },
      {
        title: 'Jibhi, Jalori Pass & Tirthan Valley Offbeat Nature Retreat',
        slug: 'jibhi-jalori-pass-tirthan-valley-tour',
        destination: destMap['jibhi-tirthan-valley']._id,
        destinationName: 'Jibhi & Tirthan Valley',
        category: 'Weekend Getaways',
        duration: '4 Days / 3 Nights',
        daysCount: 4,
        nightsCount: 3,
        price: 12999,
        discountedPrice: 9999,
        rating: 5.0,
        reviewsCount: 33,
        description: 'Discover untouched Himachal. Stay in authentic handcrafted wooden tree chalets, trek from Jalori Pass (10,800 ft) to crystal Serolsar Lake, see hidden Jibhi waterfalls, and relax by Tirthan river streams.',
        featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
        images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'],
        itinerary: [
          { day: 1, title: 'Arrival in Jibhi & Waterfall', description: 'Wooden chalet check-in and waterfall walk.', meals: 'Dinner & Bonfire', hotel: 'Jibhi Wooden Chalet' },
          { day: 2, title: 'Jalori Pass & Serolsar Lake', description: 'Oak forest trek to sacred lake.', meals: 'Breakfast & Dinner', hotel: 'Jibhi Wooden Chalet' },
          { day: 3, title: 'Tirthan Valley River Walk', description: 'Relax by crystal trout streams.', meals: 'Breakfast & Dinner', hotel: 'Jibhi Wooden Chalet' },
          { day: 4, title: 'Departure', description: 'Return transfer.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['3 Nights stay in wooden chalet', 'Breakfast and dinner daily', 'Private car for entire tour'],
        exclusions: ['Personal expenses'],
        hotels: 'Pine Chalets Jibhi',
        transport: 'Private AC Car',
        tags: ['Offbeat', 'Jibhi', 'Nature'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Kinnaur, Sangla, Chitkul & Kalpa Tribal Circuit',
        slug: 'kinnaur-sangla-chitkul-kalpa-tour',
        destination: destMap['kinnaur-kalpa-sangla']._id,
        destinationName: 'Kinnaur, Kalpa & Sangla (Chitkul)',
        category: 'Adventure',
        duration: '7 Days / 6 Nights',
        daysCount: 7,
        nightsCount: 6,
        price: 24999,
        discountedPrice: 20999,
        rating: 5.0,
        reviewsCount: 22,
        description: 'Journey into the heart of Kinnaur. Marvel at the golden Kinner Kailash peak at sunrise, walk through Baspa valley apple orchards, explore Kamru Fort, and stand at Chitkul - the last village on the border.',
        featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
        itinerary: [
          { day: 1, title: 'Drive to Sarahan', description: 'Visit Bhimakali Temple.', meals: 'Dinner', hotel: 'HPTDC Sarahan' },
          { day: 2, title: 'Sarahan to Sangla Valley', description: 'Check into riverside Swiss tents.', meals: 'Breakfast & Dinner', hotel: 'Sangla Camps' },
          { day: 3, title: 'Chitkul (Last Village) Excursion', description: 'Explore wooden village along Baspa river.', meals: 'Breakfast & Dinner', hotel: 'Sangla Camps' },
          { day: 4, title: 'Sangla to Kalpa', description: 'Gaze at Kinner Kailash peak.', meals: 'Breakfast & Dinner', hotel: 'Grand Kalpa Resort' },
          { day: 5, title: 'Kalpa Apple Orchards', description: 'Explore ancient monasteries.', meals: 'Breakfast & Dinner', hotel: 'Grand Kalpa Resort' },
          { day: 6, title: 'Kalpa to Narkanda', description: 'Drive along Sutlej canyon.', meals: 'Breakfast & Dinner', hotel: 'Tethys Resort Narkanda' },
          { day: 7, title: 'Departure Drop', description: 'Drop to Chandigarh.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['6 Nights stay', 'Daily breakfast & dinner', 'Dedicated private SUV', 'Permits and tolls'],
        exclusions: ['Personal expenses'],
        hotels: 'HPTDC Sarahan & Grand Kalpa Resort',
        transport: 'Private AC Toyota Innova / Mahindra Scorpio-N',
        tags: ['Kinnaur', 'Chitkul', 'Kalpa'],
        featured: false,
        status: 'published'
      },
      {
        title: 'Sacred Himachal Devi Darshan Shaktipeeth Yatra',
        slug: 'sacred-himachal-devi-darshan-shaktipeeth-yatra',
        destination: destMap['kangra-jawalamukhi']._id,
        destinationName: 'Kangra & Jawalamukhi (Shaktipeeths)',
        category: 'Group Tours',
        duration: '5 Days / 4 Nights',
        daysCount: 5,
        nightsCount: 4,
        price: 13999,
        discountedPrice: 10999,
        rating: 5.0,
        reviewsCount: 68,
        description: 'The most sacred pilgrimage in Himachal Pradesh operated by Vista Tour and Travels. Covers all major holy shrines: Mata Chamunda Devi, Kangra Brajeshwari Devi, Jawalamukhi (eternal flame), Chintpurni Devi, Baglamukhi, and Naina Devi.',
        featuredImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80',
        images: ['https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'],
        itinerary: [
          { day: 1, title: 'Arrival & Mata Chamunda Devi', description: 'Darshan at Chamunda Devi temple.', meals: 'Dinner', hotel: 'Hotel Sagar Ganga Kangra' },
          { day: 2, title: 'Mata Brajeshwari Devi & Kangra Fort', description: 'Morning Aarti and fort tour.', meals: 'Breakfast & Dinner', hotel: 'Hotel Sagar Ganga Kangra' },
          { day: 3, title: 'Mata Jawalamukhi & Baglamukhi', description: 'Witness miraculous eternal blue flames.', meals: 'Breakfast & Dinner', hotel: 'Hotel Jawalaji Grand' },
          { day: 4, title: 'Mata Chintpurni Devi', description: 'Seek blessings at wish-fulfilling shrine.', meals: 'Breakfast & Dinner', hotel: 'Hotel Chintpurni Residency' },
          { day: 5, title: 'Mata Naina Devi & Return Transfer', description: 'Cable car ride and return drop.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '4 Nights accommodation in comfortable AC hotels near temple complexes',
          'Daily pure vegetarian breakfast and dinner',
          'Dedicated AC vehicle (Dzire / Ertiga / Innova / Tempo Traveller)',
          'All parking, tolls, and driver allowances'
        ],
        exclusions: ['Special VIP entry tickets', 'Personal pooja items'],
        hotels: 'Verified pure-veg pilgrim hotels',
        transport: 'Dedicated private sanitized AC vehicle with respectful local driver',
        tags: ['Pilgrimage', 'Shaktipeeth', 'DeviDarshan', 'Kangra'],
        featured: true,
        status: 'published'
      }
    ];

    const insertedPackages = await Package.insertMany(packagesData);

    // 4. 12 Diverse Himachal Travel Fleet Cars
    const carsData = [
      {
        name: 'Toyota Innova Crysta',
        category: 'SUV',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Diesel',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800',
        features: [
          'Dual AC & Climate Control',
          'Roof Carrier for Extra Luggage',
          'Pushback Recliner Seats',
          'Experienced Mountain Driver'
        ],
        description: 'Premier luxury SUV for Himachal hill stations and family vacations. High safety rating and comfortable ride.',
        isAvailable: true
      },
      {
        name: 'Toyota Innova Hycross',
        category: 'Luxury',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Hybrid / Petrol',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Toyota_Kijang_Innova_Zenix_2.0_Q_Hybrid_Modellista_(front),_West_Surabaya.jpg?width=800',
        features: [
          'Ottoman Recliner Captain Seats',
          'Dual Zone Chilled Climate Control',
          'Panoramic Sunroof Experience',
          'Silent Hybrid Hill Cruise'
        ],
        description: 'Ultra-luxurious hybrid cruiser for VIPs, executives, and luxury family holidays across Himachal Pradesh.',
        isAvailable: true
      },
      {
        name: 'Maruti Suzuki Ertiga',
        category: 'MUV',
        seatingCapacity: '5 + 1 Seats',
        luggageCapacity: '3 Large Bags',
        fuelType: 'Petrol / Hybrid',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ertiga(2).jpg?width=800',
        features: [
          'Chilled AC with Rear Vents',
          'Comfortable 3-Row Seating',
          'Smooth Hill Suspension',
          'Certified Chauffeur'
        ],
        description: 'Budget-friendly yet remarkably spacious. Great for small families, local Kangra temple circuits, and airport transfers.',
        isAvailable: true
      },
      {
        name: 'Maruti Suzuki Swift Dzire',
        category: 'Sedan',
        seatingCapacity: '4 + 1 Seats',
        luggageCapacity: '2 Large Bags + Handbags',
        fuelType: 'Petrol',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Dzire_VXi_VVT_(front).JPG?width=800',
        features: [
          'AC & Cabin Heating',
          'Deep Boot Space',
          'Smooth Highway Ride',
          'Sanitized Daily'
        ],
        description: 'Most popular and economical choice for couples, solo travelers, and city tours across Kangra and Dharamshala.',
        isAvailable: true
      },
      {
        name: 'Toyota Etios',
        category: 'Sedan',
        seatingCapacity: '4 + 1 Seats',
        luggageCapacity: '3 Large Bags',
        fuelType: 'Diesel / Petrol',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Etios_1.5_XLS_Sedan_2019.jpg?width=800',
        features: [
          'Extra Legroom & Shoulder Room',
          'Huge 595L Boot Space',
          'Powerful Mountain AC',
          'Chauffeur Driven'
        ],
        description: 'Remarkably roomy sedan renowned for rugged reliability, comfort, and generous luggage room for mountain touring.',
        isAvailable: true
      },
      {
        name: 'Maruti Suzuki Alto K10 / WagonR',
        category: 'Hatchback',
        seatingCapacity: '4 + 1 Seats',
        luggageCapacity: '2 Medium Bags',
        fuelType: 'Petrol',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_-_Alto_800_LXi.JPG?width=800',
        features: [
          'Compact & Nimble on Mountain Roads',
          'Chilled AC & Hill Heater',
          'Most Economical Budget Rates',
          'Local Kangra Driver'
        ],
        description: 'Agile and budget-friendly. Navigates narrow mountain lanes and temple roads with ease.',
        isAvailable: true
      },
      {
        name: 'Mahindra Scorpio-N 4x4',
        category: '4x4 Off-Road',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '4 Large Bags',
        fuelType: 'Diesel',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio.jpg?width=800',
        features: [
          '4x4 High Ground Clearance',
          'Rugged All-Terrain Hill Tires',
          'Roof Luggage Rack',
          'Snow Chain Equipped'
        ],
        description: 'Built tough for rough Himalayan terrains. Best suited for high-altitude Spiti expeditions and winter snow.',
        isAvailable: true
      },
      {
        name: 'Toyota Fortuner 4x4',
        category: 'Luxury',
        seatingCapacity: '6 + 1 Seats',
        luggageCapacity: '5 Large Bags',
        fuelType: 'Diesel',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Fortuner_2.8_GR_Sport_4x4_2022.jpg?width=800',
        features: [
          '4x4 High-Torque Mountain Engine',
          'Plush Leather Interior',
          'Extreme Off-Road Capability',
          'VIP Hill Escort Service'
        ],
        description: 'The ultimate beast for luxury travel, mountain passes, and snowy winter expeditions across Himachal.',
        isAvailable: true
      },
      {
        name: 'Force Urbania Luxury Van',
        category: 'Tempo Traveller',
        seatingCapacity: '10 + 1 Passengers',
        luggageCapacity: '8 Large Bags',
        fuelType: 'Diesel',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
        features: [
          'Individual Aircraft-Style Bucket Seats',
          'Triple AC with Personalized Vents',
          'Panoramic Tinted Windows',
          'Individual USB Ports & Mood Lights'
        ],
        description: 'Next-generation European luxury van for executive groups, high-end family trips, and corporate delegates.',
        isAvailable: true
      },
      {
        name: 'Force Tempo Traveller (12-Seater Deluxe)',
        category: 'Tempo Traveller',
        seatingCapacity: '12 + 1 Passengers',
        luggageCapacity: 'Rear Boot + Heavy Roof Carrier',
        fuelType: 'Diesel',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
        features: [
          'Reclining Pushback Seats',
          'Individual AC Vents',
          'Music Surround Sound',
          'High Roof Stand-up Interior'
        ],
        description: 'First-class group luxury. Perfect for joint families, corporate offsites, and wedding guest transfers across Himachal.',
        isAvailable: true
      },
      {
        name: 'Force Tempo Traveller (17-Seater Deluxe)',
        category: 'Tempo Traveller',
        seatingCapacity: '17 + 1 Passengers',
        luggageCapacity: 'Extra Heavy Overhead Carrier',
        fuelType: 'Diesel',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
        features: [
          'Wide Reclining Luxury Seats',
          'Dual High-Capacity AC Units',
          'High-Roof Stand-up Height',
          'First Aid Kit & Fire Safety'
        ],
        description: 'Maximum capacity with supreme comfort for large pilgrim groups and family holidays.',
        isAvailable: true
      },
      {
        name: 'Force Tempo Traveller (26-Seater Maharaja)',
        category: 'Tempo Traveller',
        seatingCapacity: '26 + 1 Passengers',
        luggageCapacity: 'Massive Roof Carrier + Rear Space',
        fuelType: 'Diesel',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
        features: [
          '2x2 Pushback Maharaja Seats',
          'Twin High-Powered Cooling Units',
          'LCD TV with Sound System',
          'Senior Mountain Chauffeur'
        ],
        description: 'The ultimate group carrier for weddings, school excursions, and grand Himachal temple pilgrimages.',
        isAvailable: true
      }
    ];

    const insertedCars = await Car.insertMany(carsData);

    res.status(200).json({
      success: true,
      message: 'Himachal catalog successfully seeded into database!',
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
