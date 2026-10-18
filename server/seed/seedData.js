import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Booking from '../models/Booking.js';
import Blog from '../models/Blog.js';
import Gallery from '../models/Gallery.js';
import Testimonial from '../models/Testimonial.js';
import Inquiry from '../models/Inquiry.js';
import FAQ from '../models/FAQ.js';
import Service from '../models/Service.js';
import WebsiteSetting from '../models/WebsiteSetting.js';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vista_tour_travels';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await Promise.all([
      User.deleteMany(),
      Destination.deleteMany(),
      Package.deleteMany(),
      Booking.deleteMany(),
      Blog.deleteMany(),
      Gallery.deleteMany(),
      Testimonial.deleteMany(),
      Inquiry.deleteMany(),
      FAQ.deleteMany(),
      Service.deleteMany(),
      WebsiteSetting.deleteMany()
    ]);
    console.log('[Seed] Cleared existing data');

    // 1. Create Users
    const adminPassword = process.env.ADMIN_PASSWORD || 'Vista@Admin2026!';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vistatourtravels.com';

    const admin = await User.create({
      name: 'Vista Admin (Super Admin)',
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      phone: '+91 98765 43210',
      role: 'superadmin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      isActive: true
    });

    const demoUser = await User.create({
      name: 'Aarav Mehta',
      email: 'user@vistatourtravels.com',
      password: 'User@12345',
      phone: '+91 98111 22334',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      isActive: true
    });

    console.log('[Seed] Created Superadmin and Demo User');

    // 2. Create Destinations
    const destinationsData = [
      {
        name: 'Manali',
        slug: 'manali',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Snow-capped peaks, pine forests, adventure sports, and scenic Himalayan valleys.',
        description: 'Nestled on the banks of the Beas River, Manali is one of India’s most celebrated mountain destinations. From skiing down Solang Valley to unwinding near the historic Hadimba Temple and experiencing the high-altitude pass of Rohtang, Manali caters to families, honeymooners, and thrill-seekers alike.',
        heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586351012965-861624544334?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Solang Valley', description: 'Famous for paragliding, zorbing, and winter skiing.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
          { title: 'Rohtang Pass', description: 'Gateway to Lahaul & Spiti with panoramic glacial views.', image: 'https://images.unsplash.com/photo-1586351012965-861624544334?auto=format&fit=crop&w=600&q=80' },
          { title: 'Hadimba Temple', description: 'Historic pagoda-style wooden temple built in 1553.', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Paragliding at Solang', description: 'Soar high above the pine-covered valleys with certified pilots.', icon: 'Wind' },
          { title: 'River Rafting in Beas', description: 'Navigate thrilling Grade II and III rapids along Kullu valley.', icon: 'Compass' },
          { title: 'Old Manali Cafe Crawl', description: 'Taste wood-fired pizzas, herbal teas, and live acoustic music.', icon: 'Coffee' }
        ],
        bestTimeToVisit: 'October to June (Snow in Dec-Feb)',
        startingPrice: 12999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Shimla',
        slug: 'shimla',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'The Queen of Hills with charming British colonial heritage and Mall Road strolls.',
        description: 'Shimla, the former summer capital of British India, retains its timeless colonial charm. Surrounded by oak and deodar forests, Shimla is famed for its iconic Ridge, Christ Church, the UNESCO World Heritage Toy Train, and lush Apple Orchards in Kufri.',
        heroImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'The Ridge & Mall Road', description: 'The cultural heart with neo-Gothic Christ Church and mountain views.', image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80' },
          { title: 'Kufri Snow Point', description: 'Winter wonderland for horse riding, yak rides, and tobogganing.', image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Kalka-Shimla Toy Train', description: 'Ride through 102 tunnels across scenic pine valleys.', icon: 'Train' },
          { title: 'Jakhoo Temple Ropeway', description: 'Panoramic cable car ride to the giant Lord Hanuman statue.', icon: 'Mountain' }
        ],
        bestTimeToVisit: 'March to June & December to February',
        startingPrice: 8999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Dharamshala & McLeodganj',
        slug: 'dharamshala-mcleodganj',
        country: 'India',
        state: 'Himachal Pradesh',
        region: 'Himalayas',
        shortDescription: 'Spiritual haven, Tibetan monasteries, and the majestic backdrop of the Dhauladhar Range.',
        description: 'Home to His Holiness the Dalai Lama and the Tibetan government in exile, McLeodganj in upper Dharamshala is a vibrant blend of serene Buddhist monasteries, cedar woodlands, quaint cafes, and world-class trekking trails like Triund.',
        heroImage: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Tsuglagkhang Complex', description: 'The official residence of the 14th Dalai Lama.', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=600&q=80' },
          { title: 'HPCA Cricket Stadium', description: 'One of the most scenic cricket grounds in the world overlooking snow peaks.', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Triund Trek', description: 'A rewarding day trek to view the immense Dhauladhar ridgeline.', icon: 'Compass' },
          { title: 'Tibetan Cooking Class', description: 'Learn how to fold authentic momos and steam Tibetan tingmo.', icon: 'Utensils' }
        ],
        bestTimeToVisit: 'September to June',
        startingPrice: 9499,
        featured: true,
        status: 'active'
      },
      {
        name: 'Amritsar',
        slug: 'amritsar',
        country: 'India',
        state: 'Punjab',
        region: 'North India',
        shortDescription: 'The Golden Temple, rich Sikh traditions, patriotic Wagah Border, and culinary feasts.',
        description: 'Amritsar is the spiritual and cultural heart of Punjab. Witness the breathtaking Golden Temple glistening day and night, savor legendary kulchas and sweet lassi, pay solemn respects at Jallianwala Bagh, and feel the electrifying patriotic fervor at Wagah Border.',
        heroImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Golden Temple (Harmandir Sahib)', description: 'Golden sanctuary serving world’s largest community kitchen (Langar).', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80' },
          { title: 'Wagah Border', description: 'World-famous beating retreat ceremony on the India-Pakistan border.', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Heritage Walk & Food Trail', description: 'Sample Amritsari kulcha, makki di roti, and jalebi.', icon: 'Utensils' },
          { title: 'Langar Seva Experience', description: 'Partake in voluntary selfless service at the Golden Temple kitchen.', icon: 'Heart' }
        ],
        bestTimeToVisit: 'October to March',
        startingPrice: 6999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Goa',
        slug: 'goa',
        country: 'India',
        state: 'Goa',
        region: 'West India',
        shortDescription: 'Sun-kissed golden beaches, Portuguese heritage villas, water sports, and vibrant nightlife.',
        description: 'Goa provides the quintessential tropical getaway. Relax under swaying coconut palms in South Goa or dive into water sports, beach shacks, night markets, and sunset cruises across North Goa’s vibrant coastline.',
        heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Baga & Calangute Beaches', description: 'Lively beaches with water sports and lively beach shack dining.', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
          { title: 'Basilica of Bom Jesus', description: 'UNESCO World Heritage church holding relics of St. Francis Xavier.', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Scuba Diving at Grande Island', description: 'Explore coral reefs, exotic fish, and underwater shipwrecks.', icon: 'Anchor' },
          { title: 'Mandovi Sunset Cruise', description: 'Traditional Goan folk dance and music along the Mandovi river.', icon: 'Sun' }
        ],
        bestTimeToVisit: 'November to April',
        startingPrice: 14999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Kerala',
        slug: 'kerala',
        country: 'India',
        state: 'Kerala',
        region: 'South India',
        shortDescription: 'Tranquil emerald backwaters, tea gardens in Munnar, Ayurvedic healing, and spice hills.',
        description: 'Known as God’s Own Country, Kerala is blessed with serene houseboat cruises along the palm-fringed lagoons of Alleppey, sprawling emerald tea plantations in Munnar, pristine wildlife in Thekkady, and peaceful Ayurvedic wellness retreats.',
        heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Alleppey Backwaters', description: 'Private luxury houseboats meandering through peaceful palm waterways.', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80' },
          { title: 'Munnar Tea Plantations', description: 'Misty hills blanketed with fragrant green tea terraces.', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Houseboat Stay', description: 'Overnight cruise with authentic freshly prepared Kerala cuisine.', icon: 'Ship' },
          { title: 'Authentic Ayurvedic Massage', description: 'Rejuvenate your body and soul with herbal oils and traditional therapy.', icon: 'Sparkles' }
        ],
        bestTimeToVisit: 'September to March',
        startingPrice: 18499,
        featured: true,
        status: 'active'
      },
      {
        name: 'Kashmir',
        slug: 'kashmir',
        country: 'India',
        state: 'Jammu & Kashmir',
        region: 'Himalayas',
        shortDescription: 'Shikara rides on Dal Lake, snow meadows of Gulmarg, and valleys of Pahalgam.',
        description: 'Celebrated as Heaven on Earth, Kashmir enchants with wooden houseboats on tranquil Dal Lake, gondola cable car rides to Apharwat peak in Gulmarg, cascading streams in Pahalgam, and saffron fields in Pampore.',
        heroImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Dal Lake & Shikara', description: 'Iconic traditional wooden boats and floating vegetable markets.', image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=600&q=80' },
          { title: 'Gulmarg Gondola', description: 'Asia’s highest cable car taking you into deep alpine snow.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Shikara Sunset Ride', description: 'Glide across mirrored waters surrounded by snow-capped peaks.', icon: 'Feather' },
          { title: 'Skiing in Gulmarg', description: 'World-class powder snow skiing for novices and experts.', icon: 'Wind' }
        ],
        bestTimeToVisit: 'April to October (Flowers) & Dec to Feb (Snow)',
        startingPrice: 21999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Ladakh',
        slug: 'ladakh',
        country: 'India',
        state: 'Ladakh',
        region: 'Himalayas',
        shortDescription: 'High-altitude desert, Pangong Tso azure lake, Nubra sand dunes, and ancient gompas.',
        description: 'Ladakh offers dramatic mountain scenery unlike anywhere else on Earth. Cross the world’s highest motorable passes like Khardung La, ride double-humped camels across the white sands of Hunder, and gaze at Pangong Lake reflecting deep turquoise waters.',
        heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Pangong Tso', description: 'Color-changing endorheic lake at 14,270 ft extending into Tibet.', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80' },
          { title: 'Nubra Valley', description: 'High desert with cold sand dunes and Bactrian camels.', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Khardung La Pass Expedition', description: 'Drive past 18,380 ft with panoramic views of the Karakoram range.', icon: 'Compass' },
          { title: 'Stargazing in Hanle', description: 'Crystal-clear night skies inside India’s first Dark Sky Reserve.', icon: 'Star' }
        ],
        bestTimeToVisit: 'May to September',
        startingPrice: 27999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Rajasthan (Jaipur & Udaipur)',
        slug: 'rajasthan-heritage',
        country: 'India',
        state: 'Rajasthan',
        region: 'West India',
        shortDescription: 'Majestic forts, royal palaces, desert safaris, and colorful cultural royalty.',
        description: 'Immerse yourself in regal grandeur. Explore the Amber Fort and Hawa Mahal in the Pink City of Jaipur, cruise on Lake Pichola in the romantic City of Lakes Udaipur, and witness golden dunes in Jaisalmer.',
        heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
        ],
        attractions: [
          { title: 'Amber Fort & Palace', description: 'Opulent hilltop fortress with Sheesh Mahal (hall of mirrors).', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80' },
          { title: 'Lake Pichola & City Palace', description: 'Royal palace complex overlooking the glistening lake.', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80' }
        ],
        thingsToDo: [
          { title: 'Hot Air Balloon Safari', description: 'Fly over Jaipur’s rugged hills and majestic fortresses at sunrise.', icon: 'Wind' },
          { title: 'Royal Heritage Dinner', description: 'Feast on Dal Baati Churma with traditional Rajasthani Kalbeliya dancers.', icon: 'Utensils' }
        ],
        bestTimeToVisit: 'October to March',
        startingPrice: 16999,
        featured: true,
        status: 'active'
      }
    ];

    const destinations = await Destination.insertMany(destinationsData);
    console.log(`[Seed] Seeded ${destinations.length} Destinations`);

    // Map destinations by slug
    const destMap = {};
    destinations.forEach(d => {
      destMap[d.slug] = d;
    });

    // 3. Create Tour Packages
    const packagesData = [
      {
        title: 'Manali Escape – Himalayan Retreat',
        slug: 'manali-escape-himalayan-retreat',
        destination: destMap['manali']._id,
        destinationName: 'Manali',
        category: 'Family Trips',
        duration: '5 Days / 4 Nights',
        daysCount: 5,
        nightsCount: 4,
        price: 15999,
        discountedPrice: 12999,
        rating: 4.9,
        reviewsCount: 38,
        description: 'Escape the heat and immerse in fresh mountain breeze, lush cedar woodlands, and high-altitude adventures in Manali, Solang Valley, and Rohtang Pass.',
        featuredImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586351012965-861624544334?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Manali & Local Sightseeing', description: 'Arrive in Manali, check-in to your mountain resort. Visit Hadimba Temple, Vashisht Hot Water Springs, and spend the evening leisurely strolling on Mall Road.', meals: 'Welcome drink & Dinner', hotel: 'Snow Valley Resort or similar' },
          { day: 2, title: 'Solang Valley Adventure Day', description: 'Drive to Solang Valley. Indulge in exhilarating activities like paragliding, zorbing, and quad biking against scenic snow peaks.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort or similar' },
          { day: 3, title: 'Rohtang Pass or Atal Tunnel Excursion', description: 'Ascend to the majestic Rohtang Pass (subject to permit) or cross the engineering wonder of Atal Tunnel to explore Sissu in Lahaul.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort or similar' },
          { day: 4, title: 'Naggar Castle & Heritage Art Gallery', description: 'Discover the ancient 15th-century wood and stone Naggar Castle and Nicholas Roerich Art Gallery overlooking the Kullu valley.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort or similar' },
          { day: 5, title: 'Departure with Cherished Memories', description: 'After a hearty breakfast, transfer back to Chandigarh / Delhi airport with unforgettable Himalayan memories.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '4 Nights luxury accommodation in 4-Star resort with balcony view',
          'Daily buffet breakfast and multi-cuisine dinner',
          'Dedicated private AC Sedan / SUV for transfers and sightseeing',
          'Fuel, toll taxes, driver allowances, and parking charges',
          'Guided sightseeing tours as mentioned in the itinerary'
        ],
        exclusions: [
          'Airfare or train tickets',
          'Adventure sports tickets (paragliding, river rafting)',
          'Rohtang Pass national green tribunal permits if applied separately',
          'Personal expenses like laundry, tips, and room service'
        ],
        hotels: 'The Grand Manali / Snow Valley Resort (4-Star with scenic mountain views)',
        transport: 'Private AC Toyota Innova / Dzire with seasoned mountain chauffeur',
        tags: ['Honeymoon', 'Family', 'Snow', 'Adventure'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Shimla & Kufri Weekend Getaway',
        slug: 'shimla-kufri-weekend-getaway',
        destination: destMap['shimla']._id,
        destinationName: 'Shimla',
        category: 'Weekend Getaways',
        duration: '3 Days / 2 Nights',
        daysCount: 3,
        nightsCount: 2,
        price: 10999,
        discountedPrice: 8999,
        rating: 4.8,
        reviewsCount: 24,
        description: 'The perfect weekend retreat from Delhi/Chandigarh to the Queen of Hills. Stroll Mall Road, enjoy pine trails in Kufri, and savor crisp mountain air.',
        featuredImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Chandigarh/Delhi to Shimla Scenic Drive', description: 'Scenic uphill drive to Shimla. Check into the hotel, unwind, and head out to The Ridge and Lakkar Bazaar.', meals: 'Dinner', hotel: 'Willow Banks or similar' },
          { day: 2, title: 'Kufri Snow Adventure & Jakhoo Hill', description: 'Visit Kufri Fun World, horse ride to Mahasu Peak, and take the Jakhoo ropeway cable car.', meals: 'Breakfast & Dinner', hotel: 'Willow Banks or similar' },
          { day: 3, title: 'Viceregal Lodge & Departure', description: 'Tour the historical Indian Institute of Advanced Study (Viceregal Lodge) before return journey.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '2 Nights hotel stay with breakfast and dinner',
          'Private sanitized car for the entire journey',
          'Toll tax, parking, and driver charges'
        ],
        exclusions: ['Monument entrance tickets', 'Jakhoo ropeway tickets', 'Personal items'],
        tags: ['Weekend', 'Hills', 'Heritage'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Kashmir Paradise – Srinagar, Gulmarg & Pahalgam',
        slug: 'kashmir-paradise-srinagar-gulmarg-pahalgam',
        destination: destMap['kashmir']._id,
        destinationName: 'Kashmir',
        category: 'Honeymoon',
        duration: '6 Days / 5 Nights',
        daysCount: 6,
        nightsCount: 5,
        price: 26999,
        discountedPrice: 22499,
        rating: 5.0,
        reviewsCount: 52,
        description: 'Immerse in pure heaven on earth. Enjoy deluxe houseboat stay on Dal Lake, gondola ride in Gulmarg, and picturesque Betaab Valley in Pahalgam.',
        featuredImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Srinagar & Dal Lake Shikara', description: 'Meet & greet at Srinagar airport. Transfer to luxury houseboat. Enjoy romantic 1-hour sunset Shikara ride.', meals: 'Dinner', hotel: 'Luxury Dal Lake Houseboat' },
          { day: 2, title: 'Mughal Gardens Tour', description: 'Visit Shalimar Bagh, Nishat Bagh, and the Botanical Garden. Evening shopping for Pashmina and saffron.', meals: 'Breakfast & Dinner', hotel: 'Four Points by Sheraton or similar' },
          { day: 3, title: 'Gulmarg – Meadow of Flowers', description: 'Day trip to Gulmarg. Ride the famous Gondola Phase 1 & 2 reaching 13,780 feet into snow fields.', meals: 'Breakfast & Dinner', hotel: 'Four Points by Sheraton' },
          { day: 4, title: 'Transfer to Pahalgam (Valley of Shepherds)', description: 'Drive past saffron fields and Apple orchards. Visit Lidder River and relax in Pahalgam.', meals: 'Breakfast & Dinner', hotel: 'Pahalgam Pine Spring Resort' },
          { day: 5, title: 'Betaab & Aru Valleys', description: 'Explore scenic Betaab Valley, Aru Village, and Chandanwari by local taxi.', meals: 'Breakfast & Dinner', hotel: 'Pahalgam Pine Spring Resort' },
          { day: 6, title: 'Departure from Srinagar', description: 'Transfer to Srinagar Airport with unforgettable memories of Jannat-e-Kashmir.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '1 Night in Super Deluxe Dal Lake Houseboat + 4 Nights in 4-Star Hotels',
          'Daily Kashmiri buffet breakfast & dinner',
          'Complimentary Shikara ride on Dal Lake',
          'Dedicated private vehicle for all transfers and tours'
        ],
        exclusions: ['Gondola cable car tickets', 'Pony / Horse rides', 'Lidder valley local union vehicle charges'],
        tags: ['Romantic', 'Honeymoon', 'Luxury', 'Snow'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Goa Coastal Bliss & Sun-Kissed Beaches',
        slug: 'goa-coastal-bliss-sun-kissed-beaches',
        destination: destMap['goa']._id,
        destinationName: 'Goa',
        category: 'Adventure',
        duration: '5 Days / 4 Nights',
        daysCount: 5,
        nightsCount: 4,
        price: 18999,
        discountedPrice: 14999,
        rating: 4.8,
        reviewsCount: 30,
        description: 'From watersports at Baga to the tranquil sands of Palolem and Portuguese villas in Fontainhas, experience the best of tropical Goa.',
        featuredImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Arrival in North Goa', description: 'Airport pick up and transfer to beach resort. Relax by the pool and enjoy beach sunset.', meals: 'Dinner', hotel: 'Resort Rio or similar' },
          { day: 2, title: 'North Goa Beaches & Water Sports', description: 'Visit Fort Aguada, Calangute, and Anjuna. Water sports combo: jet ski, parasailing, and banana boat.', meals: 'Breakfast & Dinner', hotel: 'Resort Rio' },
          { day: 3, title: 'South Goa Heritage & Sunset Cruise', description: 'Tour Old Goa churches, Mangueshi Temple, and evening Mandovi river cruise with cultural dance.', meals: 'Breakfast & Dinner', hotel: 'Resort Rio' },
          { day: 4, title: 'Dudhsagar Waterfalls & Spice Plantation', description: 'Jeep safari to roaring Dudhsagar Falls and traditional Goan lunch at a lush organic spice farm.', meals: 'Breakfast, Spice Farm Lunch & Dinner', hotel: 'Resort Rio' },
          { day: 5, title: 'Farewell Goa', description: 'Morning dip in the sea and transfer to Goa Airport / Railway Station.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['4 Nights resort stay near beach', 'Daily breakfast & dinner', 'Mandovi sunset river cruise tickets', 'Private AC car for sightseeing'],
        exclusions: ['Flight tickets', 'Scuba diving', 'Alcoholic drinks'],
        tags: ['Beach', 'Nightlife', 'Water Sports'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Kerala Backwaters & Munnar Hills Experience',
        slug: 'kerala-backwaters-munnar-hills-experience',
        destination: destMap['kerala']._id,
        destinationName: 'Kerala',
        category: 'Luxury Travel',
        duration: '6 Days / 5 Nights',
        daysCount: 6,
        nightsCount: 5,
        price: 22999,
        discountedPrice: 18999,
        rating: 4.9,
        reviewsCount: 41,
        description: 'Cruise emerald backwaters in Alleppey, wake up to misty tea plantations in Munnar, and explore Periyar Wildlife Sanctuary in Thekkady.',
        featuredImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Cochin to Munnar (Scenic Hills)', description: 'Drive past Valara and Cheeyappara waterfalls to Munnar. Evening at leisure.', meals: 'Dinner', hotel: 'Fragrant Nature Munnar' },
          { day: 2, title: 'Munnar Tea Gardens & Eravikulam', description: 'Visit Eravikulam National Park (Nilgiri Tahr habitat), Mattupetty Dam, and Tea Museum.', meals: 'Breakfast & Dinner', hotel: 'Fragrant Nature Munnar' },
          { day: 3, title: 'Munnar to Thekkady Spice Hills', description: 'Drive to Thekkady. Spice plantation walking tour and evening Kathakali cultural show.', meals: 'Breakfast & Dinner', hotel: 'The Elephant Court' },
          { day: 4, title: 'Alleppey Private Houseboat Cruise', description: 'Board traditional luxury houseboat. Cruise through narrow canals, paddy fields, and lagoons.', meals: 'Breakfast, Traditional Lunch & Dinner', hotel: 'Private Deluxe Houseboat' },
          { day: 5, title: 'Marari Beach Relaxation', description: 'Disembark and relax along the peaceful white sands of Marari Beach with Ayurvedic session.', meals: 'Breakfast & Dinner', hotel: 'Marari Sands Resort' },
          { day: 6, title: 'Departure from Cochin', description: 'Transfer to Cochin International Airport with sweet memories.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['Exclusive Houseboat with all meals', 'Munnar & Thekkady 4-Star stays', 'Private AC vehicle throughout', 'Spice plantation guided entry'],
        exclusions: ['Flight tickets', 'Ayurvedic treatments', 'Personal expenses'],
        tags: ['Ayurveda', 'Houseboat', 'Tea Gardens'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Rajasthan Royal Heritage & Desert Safari',
        slug: 'rajasthan-royal-heritage-desert-safari',
        destination: destMap['rajasthan-heritage']._id,
        destinationName: 'Rajasthan (Jaipur & Udaipur)',
        category: 'Cultural',
        duration: '7 Days / 6 Nights',
        daysCount: 7,
        nightsCount: 6,
        price: 24999,
        discountedPrice: 19999,
        rating: 4.9,
        reviewsCount: 29,
        description: 'A royal journey across Jaipur (Pink City), Jodhpur (Blue City), and Udaipur (City of Lakes) with camel rides, forts, and palatial stays.',
        featuredImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Jaipur', description: 'Check in, visit Birla Temple and Albert Hall Museum illuminated at night.', meals: 'Dinner', hotel: 'Heritage Haveli Jaipur' },
          { day: 2, title: 'Jaipur Forts & Palaces', description: 'Explore Amber Fort, Jal Mahal, City Palace, and photo stop at Hawa Mahal.', meals: 'Breakfast & Dinner', hotel: 'Heritage Haveli Jaipur' },
          { day: 3, title: 'Jaipur to Jodhpur (Blue City)', description: 'Drive to Jodhpur. Visit towering Mehrangarh Fort and Jaswant Thada cenotaph.', meals: 'Breakfast & Dinner', hotel: 'Ranbanka Palace Jodhpur' },
          { day: 4, title: 'Jodhpur to Udaipur via Ranakpur', description: 'Visit marble Jain temples at Ranakpur. Continue drive to romantic Udaipur.', meals: 'Breakfast & Dinner', hotel: 'Fateh Garh Palace Udaipur' },
          { day: 5, title: 'Udaipur City Palace & Lake Pichola', description: 'Tour Udaipur City Palace, Saheliyon-ki-Bari, and enjoy boat cruise on Lake Pichola.', meals: 'Breakfast & Dinner', hotel: 'Fateh Garh Palace Udaipur' },
          { day: 6, title: 'Chittorgarh Fort Excursion', description: 'Visit the legendary fortress of Chittorgarh, symbol of Rajput valor and sacrifice.', meals: 'Breakfast & Dinner', hotel: 'Fateh Garh Palace Udaipur' },
          { day: 7, title: 'Departure from Udaipur', description: 'Drop-off at Udaipur Airport with memories of royal hospitality.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['6 Nights heritage hotel stays', 'Daily breakfast & dinner', 'Private AC sedan with experienced guide-cum-driver', 'Lake Pichola boat cruise'],
        exclusions: ['Monument entry tickets', 'Camera fees', 'Tips'],
        tags: ['Royalty', 'Heritage', 'Forts'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Golden Temple & Punjab Heritage Tour',
        slug: 'golden-temple-punjab-heritage-tour',
        destination: destMap['amritsar']._id,
        destinationName: 'Amritsar',
        category: 'Group Tours',
        duration: '4 Days / 3 Nights',
        daysCount: 4,
        nightsCount: 3,
        price: 9999,
        discountedPrice: 7999,
        rating: 4.9,
        reviewsCount: 33,
        description: 'Experience pure divinity at Sri Harmandir Sahib, goosebumps at Wagah Border, and the world-renowned culinary flavours of Punjab.',
        featuredImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Arrival & Palki Sahib Ceremony', description: 'Pick up from Amritsar Station/Airport. Evening visit to the illuminated Golden Temple.', meals: 'Dinner', hotel: 'Hyatt Regency Amritsar' },
          { day: 2, title: 'Jallianwala Bagh & Wagah Border', description: 'Visit Jallianwala Bagh Memorial, Partition Museum, and grand Wagah Border parade.', meals: 'Breakfast & Dinner', hotel: 'Hyatt Regency Amritsar' },
          { day: 3, title: 'Gobindgarh Fort & Street Food Trail', description: 'Explore Gobindgarh Fort 7D show and indulge in authentic kulcha and makhan fish.', meals: 'Breakfast & Dinner', hotel: 'Hyatt Regency Amritsar' },
          { day: 4, title: 'Departure', description: 'Morning souvenir shopping (Phulkari, Juttis) and departure drop.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['3 Nights stay in luxury hotel', 'Daily breakfast and authentic Punjabi dinner', 'AC vehicle with VIP Wagah Border coordination'],
        exclusions: ['Airfare', 'Shopping', 'Personal tips'],
        tags: ['Spiritual', 'Heritage', 'Food'],
        featured: false,
        status: 'published'
      },
      {
        title: 'Ladakh High Passes & Pangong Lake Expedition',
        slug: 'ladakh-high-passes-pangong-lake-expedition',
        destination: destMap['ladakh']._id,
        destinationName: 'Ladakh',
        category: 'Adventure',
        duration: '7 Days / 6 Nights',
        daysCount: 7,
        nightsCount: 6,
        price: 34999,
        discountedPrice: 28999,
        rating: 5.0,
        reviewsCount: 47,
        description: 'An adrenaline-fueled odyssey across Khardung La, double-humped camel safaris in Nubra Valley, and nights under starry skies at Pangong Lake.',
        featuredImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Leh & Complete Rest', description: 'Acclimatization day. Rest at hotel to adjust to high altitude (11,500 ft).', meals: 'Dinner', hotel: 'Grand Dragon Leh' },
          { day: 2, title: 'Hall of Fame, Magnetic Hill & Sangam', description: 'Visit confluence of Indus & Zanskar rivers, Magnetic Hill, and Gurudwara Pathar Sahib.', meals: 'Breakfast & Dinner', hotel: 'Grand Dragon Leh' },
          { day: 3, title: 'Leh to Nubra Valley via Khardung La', description: 'Conquer Khardung La Pass (18,380 ft). Camel safari in Hunder Sand Dunes.', meals: 'Breakfast & Dinner', hotel: 'Deluxe Swiss Camps Nubra' },
          { day: 4, title: 'Turtuk Village Excursion', description: 'Explore Turtuk, the northernmost village of India with unique Balti culture and apricot groves.', meals: 'Breakfast & Dinner', hotel: 'Deluxe Swiss Camps Nubra' },
          { day: 5, title: 'Nubra to Pangong Tso via Shyok', description: 'Breathtaking drive along Shyok River to Pangong Lake (14,270 ft). Stargazing by the lake.', meals: 'Breakfast & Dinner', hotel: 'Lakeview Cottage Pangong' },
          { day: 6, title: 'Pangong to Leh via Chang La', description: 'Witness magical sunrise at Pangong. Cross Chang La Pass (17,590 ft) back to Leh.', meals: 'Breakfast & Dinner', hotel: 'Grand Dragon Leh' },
          { day: 7, title: 'Fly back with Lifelong Memories', description: 'Early morning transfer to Leh Kushok Bakula Rimpochee Airport.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: ['Oxygen cylinder in vehicle', 'Inner line permits & wildlife fees', '6 Nights hotel/camp stay with breakfast & dinner', 'Dedicated 4x4 / Scorpio vehicle'],
        exclusions: ['Airfare to Leh', 'Camel rides', 'Personal medication'],
        tags: ['Adventure', 'Biking', 'Himalayas', 'Stargazing'],
        featured: true,
        status: 'published'
      }
    ];

    const packages = await Package.insertMany(packagesData);
    console.log(`[Seed] Seeded ${packages.length} Tour Packages`);

    // 4. Create Sample Bookings
    const bookingsData = [
      {
        bookingNumber: 'VTT-20260910-1042',
        user: demoUser._id,
        package: packages[0]._id,
        customerName: 'Aarav Mehta',
        email: 'user@vistatourtravels.com',
        phone: '+91 98111 22334',
        address: 'House 42, Sector 21, Chandigarh',
        travelDate: new Date('2026-10-15'),
        adults: 2,
        children: 1,
        pickupLocation: 'Chandigarh Airport',
        specialRequirements: 'Vegetarian meals preferred, mountain-facing room',
        packagePrice: 12999,
        taxes: 1625,
        totalAmount: 34122,
        paymentStatus: 'Paid',
        bookingStatus: 'Confirmed'
      },
      {
        bookingNumber: 'VTT-20260912-8419',
        package: packages[2]._id,
        customerName: 'Priya Verma',
        email: 'priya.verma@example.com',
        phone: '+91 98721 55432',
        address: 'B-14 Green Park, New Delhi',
        travelDate: new Date('2026-11-05'),
        adults: 2,
        children: 0,
        pickupLocation: 'Srinagar Airport',
        specialRequirements: 'Honeymoon arrangement with flower bed decor',
        packagePrice: 22499,
        taxes: 2250,
        totalAmount: 47248,
        paymentStatus: 'Pending',
        bookingStatus: 'Pending'
      },
      {
        bookingNumber: 'VTT-20260901-5231',
        package: packages[3]._id,
        customerName: 'Rohan Deshmukh',
        email: 'rohan.deshmukh@example.com',
        phone: '+91 99234 11223',
        address: 'Bandra West, Mumbai',
        travelDate: new Date('2026-09-20'),
        adults: 4,
        children: 0,
        pickupLocation: 'Goa Dabolim Airport',
        specialRequirements: 'Adjoining rooms in resort',
        packagePrice: 14999,
        taxes: 3000,
        totalAmount: 62996,
        paymentStatus: 'Paid',
        bookingStatus: 'Completed'
      }
    ];

    await Booking.insertMany(bookingsData);
    console.log('[Seed] Seeded Sample Bookings');

    // 5. Testimonials (Seeded from Verified 5.0★ Google Reviews)
    const testimonialsData = [
      {
        customerName: 'Gurpreet Singh',
        destination: 'Manali, Himachal Pradesh',
        packageTitle: 'Manali & Rohtang Pass Chauffeur Tour',
        rating: 5,
        review: 'Outstanding cab service by Vista Tour and Travels! Chauffeur arrived punctually at our Sector 73 Mohali home, vehicle was spotless Innova Crysta, and hill driving was safe and smooth throughout our Manali family holiday. Highly recommended!',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        createdAt: new Date('2026-09-18')
      },
      {
        customerName: 'Ananya Sharma',
        destination: 'Dharamshala & McLeodGanj',
        packageTitle: 'Chandigarh Airport to Dharamshala Cab',
        rating: 5,
        review: 'Booked Vista Tour and Travels for airport pickup at Chandigarh to McLeodGanj. Exceptional polite driver, zero hidden tolls, and very comfortable ride. 5-star Google experience!',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        createdAt: new Date('2026-09-28')
      },
      {
        customerName: 'Rajesh Kumar',
        destination: 'Shimla & Kufri',
        packageTitle: 'Shimla Weekend Gateway Package',
        rating: 5,
        review: 'Best taxi service in Mohali and Tricity! Transparent pricing with prompt WhatsApp booking confirmation. Chauffeur was knowledgeable about mountain roads and safe scenic spots.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        createdAt: new Date('2026-10-04')
      },
      {
        customerName: 'Vikramjit Sandhu',
        destination: 'Dalhousie & Khajjiar',
        packageTitle: 'Luxury Tempo Traveller Hill Tour',
        rating: 5,
        review: 'Booked a Tempo Traveller with Vista Tour and Travels for our 12-member group trip. Spotless AC vehicle, very professional driver, and on-time pickups. Truly 5.0★ service!',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        createdAt: new Date('2026-10-12')
      }
    ];
    await Testimonial.insertMany(testimonialsData);
    console.log('[Seed] Seeded 5.0★ Google Verified Testimonials');

    // 6. Blog Articles
    const blogsData = [
      {
        title: 'Top 10 Things You Must Do in Manali This Winter',
        slug: 'top-10-things-to-do-in-manali-winter',
        coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
        excerpt: 'From snow sports in Solang Valley to unwinding with hot chocolate in Old Manali cafes, here is your ultimate winter itinerary.',
        content: `Manali in winter transforms into a postcard-perfect snowy wonderland. As fresh powder blanket covers the pine trees and riverbanks, travelers flock to experience mountain thrill and serenity.\n\n### 1. Snowboarding & Skiing at Solang Valley\nSolang is Himachal’s premier winter sports hub. Certified instructors provide 1-hour intro ski lessons with equipment rental directly on the slopes.\n\n### 2. Crossing the Atal Tunnel to Lahaul\nDriving through the 9.02 km Atal Tunnel beneath the Rohtang Pass brings you directly into the frozen wonderland of Sissu, featuring a stunning ice-sheet waterfall.\n\n### 3. Soak in Vashisht Hot Sulphur Springs\nWhen the temperatures dip below freezing, dipping into the natural hot mineral springs of Vashisht temple relaxes tired muscles naturally.\n\n### 4. Experience Old Manali Cafe Culture\nOld Manali offers cozy wooden cabins serving wood-fired trout, apple pies, and warm cinnamon tea beside crackling wood stoves.`,
        category: 'Travel Guides',
        readTime: '6 min read',
        status: 'published',
        tags: ['Manali', 'Snow', 'Himachal', 'Winter']
      },
      {
        title: 'Complete Kashmir Travel Guide: When to Go & What to Pack',
        slug: 'complete-kashmir-travel-guide-when-to-go',
        coverImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1000&q=80',
        excerpt: 'Everything you need to know before visiting Heaven on Earth: seasons, permits, must-visit valleys, and local etiquette.',
        content: `Kashmir is breathtaking across all four seasons. In spring (March-April), millions of tulips burst into color at Asia’s largest Tulip Garden in Srinagar. Summer brings cool pine breezes and lush meadows to Pahalgam, while winter covers Gulmarg in world-class ski powder.\n\n### What to Pack:\n- Layered thermals for Gulmarg Gondola Phase 2\n- Comfortable trekking sneakers or warm snow boots\n- Cash for local shikaras and pony rides\n- Government ID cards for security checkpoints`,
        category: 'Travel Tips',
        readTime: '5 min read',
        status: 'published',
        tags: ['Kashmir', 'Gulmarg', 'Pahalgam', 'Tips']
      },
      {
        title: 'Hidden Backwater Routes in Kerala You Have Never Heard Of',
        slug: 'hidden-backwater-routes-in-kerala',
        coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
        excerpt: 'Ditch the crowded Alleppey channels and explore the secluded mangrove waterways of Kumarakom and Monroe Island.',
        content: `While Alleppey gets all the limelight, Kerala harbors secret emerald waterways where Kingfishers dive and village fishermen cast Chinese fishing nets in total tranquility.\n\nMonroe Island near Kollam is criss-crossed by narrow canals perfect for guided country canoes where motor boats cannot reach. Enjoy coconut water straight from palms and fresh Karimeen fish fry served on banana leaves.`,
        category: 'Destinations',
        readTime: '4 min read',
        status: 'published',
        tags: ['Kerala', 'Houseboat', 'South India', 'Offbeat']
      }
    ];

    await Blog.insertMany(blogsData);
    console.log('[Seed] Seeded Blog Articles');

    // 7. Gallery
    const galleryData = [
      { title: 'Snow Solang Valley', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80', category: 'Mountains', location: 'Manali, Himachal' },
      { title: 'Dal Lake Shikaras', imageUrl: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=80', category: 'Honeymoon', location: 'Srinagar, Kashmir' },
      { title: 'Palolem Beach Sunset', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80', category: 'Beaches', location: 'South Goa' },
      { title: 'Pangong Tso Reflections', imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=900&q=80', category: 'Adventure', location: 'Ladakh' },
      { title: 'Alleppey Houseboat Laggoon', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80', category: 'Culture', location: 'Kerala' },
      { title: 'Amber Fort Jaipur', imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80', category: 'Culture', location: 'Jaipur, Rajasthan' },
      { title: 'Luxury Mountain Resort', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80', category: 'Hotels', location: 'Shimla' },
      { title: 'Himalayan Highway Road Trip', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', category: 'Road Trips', location: 'Manali-Leh Highway' }
    ];

    await Gallery.insertMany(galleryData);
    console.log('[Seed] Seeded Gallery Photos');

    // 8. FAQs
    const faqsData = [
      {
        question: 'How do I book a tour package with Vista Tour and Travels?',
        answer: 'You can easily browse through our curated tour packages, select your preferred travel date and number of guests, and click "Book This Package". Fill in your contact details and submit. Our travel specialist will immediately review and send your confirmed itinerary.',
        category: 'Booking',
        order: 1
      },
      {
        question: 'What are the available payment methods?',
        answer: 'We accept all major payment modes including UPI (Google Pay, PhonePe, Paytm), Net Banking, Credit/Debit Cards, and NEFT/RTGS bank transfers. You can choose to pay a 30% advance deposit to secure your booking, with the balance payable prior to trip departure.',
        category: 'Payment',
        order: 2
      },
      {
        question: 'What is the cancellation and refund policy?',
        answer: 'We offer free cancellation up to 7 days before your scheduled departure date with a 100% refund. Cancellations made between 7 to 3 days receive a 50% refund. Within 72 hours of departure, bookings are non-refundable as hotel and transport commitments are already finalized.',
        category: 'Cancellation',
        order: 3
      },
      {
        question: 'Are all hotels verified and family-friendly?',
        answer: 'Yes! Every hotel, resort, and boutique homestay in our portfolio is personally vetted by our team for hygiene, mountain/beach views, clean linens, hot water availability, and quality dining.',
        category: 'Hotels',
        order: 4
      },
      {
        question: 'What kind of transportation vehicles do you provide?',
        answer: 'We operate dedicated private vehicles including Toyota Innova Crysta, Maruti Ertiga, Swift Dzire, and Tempo Travellers. All vehicles are commercial licensed, equipped with air conditioning, and driven by experienced hill/tourist chauffeurs.',
        category: 'Transportation',
        order: 5
      },
      {
        question: 'Can I customize an existing package to fit my schedule?',
        answer: 'Absolutely! All our packages are 100% customizable. You can add extra days, upgrade to 5-star hotels, change pickup points, or request custom activities like candlelight dinners or adventure sports.',
        category: 'Packages',
        order: 6
      }
    ];

    await FAQ.insertMany(faqsData);
    console.log('[Seed] Seeded FAQs');

    // 9. Services
    const servicesData = [
      {
        title: 'Customized Tour Packages',
        slug: 'customized-tour-packages',
        shortDescription: 'Tailor-made vacation itineraries crafted precisely around your budget, pace, and interests.',
        description: 'Whether you want a private family vacation in Himachal, a romantic honeymoon in Kashmir, or a cultural exploration in Rajasthan, our travel designers build your custom day-by-day itinerary with verified hotels and private transport.',
        icon: 'Compass',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
        features: ['Personalized day-by-day planning', 'Hand-picked 3/4/5-star accommodations', '24/7 on-trip concierge assistance'],
        order: 1
      },
      {
        title: 'Premium Cab & Taxi Services',
        slug: 'premium-cab-services',
        shortDescription: 'Reliable, sanitized chauffeur-driven cabs for hill stations, outstation roundtrips, and local tours.',
        description: 'Fleet of Toyota Innova Crysta, Dzire, Ertiga, and Tempo Travellers driven by courteous, hill-certified chauffeurs with clean track records.',
        icon: 'Car',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        features: ['Experienced mountain drivers', 'Fixed transparent fares with no hidden tolls', 'Punctual door-to-door pickups'],
        order: 2
      },
      {
        title: 'Hotel & Resort Booking',
        slug: 'hotel-resort-booking',
        shortDescription: 'Exclusive negotiated rates at luxury resorts, heritage palaces, and scenic mountain chalets.',
        description: 'Enjoy complimentary room upgrades, mountain views, and breakfast inclusions through our established hospitality partnerships across India.',
        icon: 'Hotel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        features: ['Verified guest reviews', 'Best rate guarantee', 'Free cancellation options'],
        order: 3
      },
      {
        title: 'Honeymoon Special Packages',
        slug: 'honeymoon-packages',
        shortDescription: 'Intimate romantic getaways complete with candlelit dinners, flower bed decor, and scenic vistas.',
        description: 'Special arrangements in Kashmir, Manali, Shimla, Goa, and Kerala designed exclusively for newlyweds.',
        icon: 'Heart',
        image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80',
        features: ['Complimentary honeymoon cake & wine', 'Candlelit dinner setup', 'Private scenic photography spots'],
        order: 4
      },
      {
        title: 'Corporate & MICE Travel',
        slug: 'corporate-mice-travel',
        shortDescription: 'End-to-end conference planning, executive offsites, and team building retreats.',
        description: 'Hassle-free corporate travel logistics for startups and large enterprises with GST billing and corporate discounts.',
        icon: 'Briefcase',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
        features: ['Dedicated corporate relationship manager', 'GST compliant invoicing', 'Audio-visual conference support'],
        order: 5
      },
      {
        title: 'Airport & Railway Transfers',
        slug: 'airport-railway-transfers',
        shortDescription: 'Guaranteed on-time arrivals and departures with flight tracking and meet & greet service.',
        description: 'Never worry about missing a flight or train. Our drivers track flight timings and ensure timely pickup with luggage assistance.',
        icon: 'Plane',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
        features: ['Real-time flight arrival monitoring', 'Zero surge pricing', 'Chauffeur meet & greet with nameboard'],
        order: 6
      }
    ];

    await Service.insertMany(servicesData);
    console.log('[Seed] Seeded Services');

    // 10. Sample Inquiries
    // No fake inquiries seeded - inquiries start clean for real customer inquiries
    console.log('[Seed] Inquiries left empty for genuine customer inquiries');

    await WebsiteSetting.create({
      companyName: 'Vista Tour and Travels',
      serviceName: 'Vista Tour and Travels',
      tagline: '5.0 ★ Rated Tour Packages & Luxury Cabs in Mohali & Himachal',
      heroTitle: 'Experience Seamless Journeys with Vista Tour and Travels',
      heroSubtitle: 'Top-rated 5.0★ Google Verified Tour & Luxury Cab Service in Mohali, Chandigarh & Himachal. Clean commercial cabs, hill-certified chauffeurs, and customized holiday packages.',
      heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
      logo: '/logo.jpg',
      phone: '+91 98765 43210',
      altPhone: '+91 98765 43211',
      email: 'info@vistatourtravels.com',
      address: 'Sector 73, Mohali, Punjab 160055, India',
      areasServed: 'Mohali (Sector 73/119), Chandigarh Tricity, Airport Transfers, Kangra, Dharamshala, McLeodGanj, Bir Billing, Dalhousie, Manali, Shimla, Kurukshetra & All Himachal',
      googleRating: 5.0,
      googleReviewCount: 50,
      googleMapsUrl: 'https://www.google.com/maps?cid=2473238779693105097',
      googleReviewsUrl: 'https://www.google.com/maps?cid=2473238779693105097',
      facebook: 'https://facebook.com/vistatourtravels',
      instagram: 'https://instagram.com/vistatourtravels',
      youtube: 'https://youtube.com/@vistatourtravels',
      whatsapp: '+919876543210',
      businessHours: '24 Hours Open (7 Days a Week)',
      experienceYears: '12+',
      happyTravelers: '10,000+',
      destinationCount: '50+',
      supportHours: '24/7'
    });
    console.log('[Seed] Seeded Website Settings');

    console.log('\n===========================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY! ');
    console.log('===========================================');
    console.log(`Admin Email:    ${adminEmail}`);
    console.log(`Admin Password: ${adminPassword}`);
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDB();
