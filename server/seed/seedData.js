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
import Car from '../models/Car.js';

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
      WebsiteSetting.deleteMany(),
      Car.deleteMany()
    ]);
    console.log('[Seed] Cleared existing data');

    // 1. Create Users
    const adminPassword = process.env.ADMIN_PASSWORD || 'Vista@Admin2026!';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vistatourtravels.com';

    const admin = await User.create({
      name: 'Vista Admin (Super Admin)',
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      phone: '+91 90688 88578',
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

    // 2. Create 8 Regional Destinations: Haryana, Delhi NCR & Chandigarh
    const destinationsData = [
      {
        name: 'Kurukshetra',
        slug: 'kurukshetra',
        country: 'India',
        state: 'Haryana',
        region: 'Kurukshetra / GT Road',
        shortDescription: 'Land of the Bhagavad Gita, sacred Brahma Sarovar, Sheikh Chilli’s tomb, and Mahabharata war battlefields.',
        description: 'The historic epicenter of the Mahabharata where Lord Krishna imparted the eternal Bhagavad Gita to Arjuna at Jyotisar. Visit Asia’s largest man-made water tank Brahma Sarovar, Sheikh Chilli’s marble tomb, Kurukshetra Panorama & Science Centre, Sannihit Sarovar, and Dharohar Folk Museum.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Sheikh_Chilli_Tomb_Kurukshetra.jpg?width=800'
        ],
        attractions: [
          { title: 'Brahma Sarovar', description: 'Asia’s largest sacred man-made water tank mentioned in ancient scriptures.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=600' },
          { title: 'Sheikh Chilli Tomb', description: 'Stunning Mughal-era marble mausoleum surrounded by lush gardens.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sheikh_Chilli_Tomb_Kurukshetra.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Spiritual Aarti at Brahma Sarovar', description: 'Participate in holy evening deepdaan and aarti on the sarovar ghats.', icon: 'Heart' },
          { title: 'Jyotisar Light & Sound Show', description: 'Watch the multimedia projection on the sacred Banyan tree where the Gita was born.', icon: 'Compass' }
        ],
        bestTimeToVisit: 'September to March',
        startingPrice: 1999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Ambala',
        slug: 'ambala',
        country: 'India',
        state: 'Haryana',
        region: 'Ambala Division',
        shortDescription: 'Twin city of military cantonment heritage, historic Gurdwaras, and Asia’s largest cloth market.',
        description: 'A historic crossroads of northern India known for magnificent British Cantonment architecture, revered Gurdwaras (Manji Sahib & Sis Ganj Sahib), Holy Redeemer Church, Patel Park, and Asia’s biggest wholesale textile market for wedding shopping.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Ambala_Cantt_Railway_Station.jpg?width=800'
        ],
        attractions: [
          { title: 'Gurudwara Manji Sahib', description: 'Revered historical Sikh pilgrimage shrine associated with Guru Hargobind Ji.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=600' },
          { title: 'Ambala Cloth Market', description: 'Asia’s largest wholesale hub for bridal wear, silks, and everyday textiles.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ambala_Cantt_Railway_Station.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Wholesale Textile & Bridal Shopping', description: 'Explore thousands of shops offering direct mill rates on wedding apparel.', icon: 'ShoppingBag' },
          { title: 'Ambala Cantt Food Tour', description: 'Enjoy famous Cantt kachoris, chole bhature, and traditional sweets.', icon: 'Utensils' }
        ],
        bestTimeToVisit: 'October to April',
        startingPrice: 1799,
        featured: true,
        status: 'active'
      },
      {
        name: 'Delhi',
        slug: 'delhi',
        country: 'India',
        state: 'Delhi NCR',
        region: 'National Capital Region',
        shortDescription: 'Heart of the nation combining monumental UNESCO heritage, Mughal forts, and 24/7 IGI airport transfers.',
        description: 'India’s bustling capital city combining monumental Mughal forts, colonial British avenues, and state-of-the-art expressways. Enjoy door-to-door AC cabs to India Gate, Red Fort, Qutub Minar, Akshardham Temple, Lotus Temple, and 24/7 direct IGI Airport transfers.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Qutub_Minar_in_New_Delhi_03-2016.jpg?width=800'
        ],
        attractions: [
          { title: 'India Gate & Kartavya Path', description: 'Iconic 42m stone arch war memorial and grand national boulevard.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=600' },
          { title: 'Qutub Minar', description: 'UNESCO World Heritage 73m red sandstone victory tower dating to 1192.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Qutub_Minar_in_New_Delhi_03-2016.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Chauffeur Monument Tour', description: 'Full-day air-conditioned sightseeing covering Old and New Delhi landmarks.', icon: 'Compass' },
          { title: '24/7 IGI Airport Transfer', description: 'Stress-free, punctual doorstep pickups directly to Terminal 1, 2, or 3.', icon: 'Clock' }
        ],
        bestTimeToVisit: 'October to March',
        startingPrice: 3499,
        featured: true,
        status: 'active'
      },
      {
        name: 'Karnal',
        slug: 'karnal',
        country: 'India',
        state: 'Haryana',
        region: 'Karnal / GT Road',
        shortDescription: 'City of Daanveer Karna, serene Karna Lake, Kalpana Chawla Planetarium, and highway culinary stops.',
        description: 'Named after the legendary King Karna, this scenic city on the Grand Trunk Road features the tranquil Karna Lake, British Cantonment Church Tower, Kalpana Chawla Memorial Planetarium, and renowned highway culinary destinations.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Cantonment_Church_Tower_Karnal.jpg?width=800'
        ],
        attractions: [
          { title: 'Karna Lake', description: 'Tranquil artificial lake surrounded by landscaped gardens and boating facilities.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=600' },
          { title: 'Cantonment Church Tower', description: 'Historic 35-meter 19th-century church tower showcasing British architecture.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cantonment_Church_Tower_Karnal.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Boating at Karna Lake', description: 'Relaxing pedal boating amidst tranquil green surroundings.', icon: 'Sun' },
          { title: 'Planetarium Cosmic Show', description: 'Interactive astronomy presentations at the Kalpana Chawla Memorial.', icon: 'Compass' }
        ],
        bestTimeToVisit: 'September to April',
        startingPrice: 1499,
        featured: true,
        status: 'active'
      },
      {
        name: 'Panipat',
        slug: 'panipat',
        country: 'India',
        state: 'Haryana',
        region: 'Panipat / GT Road',
        shortDescription: 'Historic battlefield of three epic Indian empire wars, Kabuli Bagh mosque, and City of Weavers.',
        description: 'Renowned worldwide for the three pivotal Battles of Panipat (1526, 1556, and 1761) that shaped the destiny of India. Explore Kala Amb battlefield memorial, the 500-year-old Kabuli Bagh Mosque, Tomb of Bu-Ali Shah Qalandar, and world-class textile markets.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Kala_Amb_Panipat.jpg?width=800'
        ],
        attractions: [
          { title: 'Kala Amb Memorial', description: 'Commemorative battlefield site marking the fierce Third Battle of Panipat.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kala_Amb_Panipat.jpg?width=600' },
          { title: 'Kabuli Bagh Mosque', description: 'Built by Mughal Emperor Babur in 1527 to celebrate his first battle victory.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Battlefield History Exploration', description: 'Guided visits through the museums and war memorial sites.', icon: 'Compass' },
          { title: 'Textile Factory Outlet Tour', description: 'Shop luxury handloom bedsheets, rugs, and blankets at manufacturer prices.', icon: 'ShoppingBag' }
        ],
        bestTimeToVisit: 'October to March',
        startingPrice: 1999,
        featured: true,
        status: 'active'
      },
      {
        name: 'Yamunanagar',
        slug: 'yamunanagar',
        country: 'India',
        state: 'Haryana',
        region: 'Shivalik Foothills',
        shortDescription: 'Eco-tourism paradise with Kalesar National Park, Hathni Kund Barrage, and ancient Chaneti stupa.',
        description: 'Nestled between the Yamuna River and the scenic Shivalik hills, Yamunanagar is Haryana’s eco-tourism and nature paradise. Discover wild leopards and elephants in Kalesar National Park, panoramic riverfront views at Hathni Kund Barrage, and ancient Chaneti Buddhist Stupa.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hathni_Kund_Barrage.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Hathni_Kund_Barrage.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Kalesar_National_Park.jpg?width=800'
        ],
        attractions: [
          { title: 'Hathni Kund Barrage', description: 'Spectacular river engineering project with panoramic mountain views and wetlands.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hathni_Kund_Barrage.jpg?width=600' },
          { title: 'Kalesar National Park', description: 'Lush dense Sal forest sanctuary home to leopards, deer, and migratory birds.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kalesar_National_Park.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Kalesar Wildlife Safari', description: 'Open jeep jungle trail tracking wild flora and fauna.', icon: 'Compass' },
          { title: 'Yamuna Riverbank Picnic', description: 'Scenic afternoon strolls and photography at Hathni Kund.', icon: 'Sun' }
        ],
        bestTimeToVisit: 'October to May',
        startingPrice: 1699,
        featured: true,
        status: 'active'
      },
      {
        name: 'Kaithal',
        slug: 'kaithal',
        country: 'India',
        state: 'Haryana',
        region: 'Kaithal / Pehowa Belt',
        shortDescription: 'Mythological birthplace of Lord Hanuman, Anjani Tirth, historic Bhai Uday Singh Fort, and Razia Sultana tomb.',
        description: 'Steeped in epic mythology as Kapisthala (the abode of Lord Hanuman), Kaithal is home to sacred Anjani Tirth, the grand 18th-century Bhai Uday Singh Fort, Bidkyar Lake, and the historic Tomb of Razia Sultana (the first woman ruler of Delhi).',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kaithal_Fort.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Kaithal_Fort.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Bidkyar_Lake_Kaithal.jpg?width=800'
        ],
        attractions: [
          { title: 'Bhai Uday Singh Fort', description: 'Impressive fort palace overlooking Bidkyar Lake with historical battlements.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kaithal_Fort.jpg?width=600' },
          { title: 'Anjani Tirth', description: 'Sacred pond and ancient temple dedicated to Mata Anjani, mother of Hanuman.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bidkyar_Lake_Kaithal.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Hanuman Birthplace Yatra', description: 'Special pilgrimage to Anjani Kund, Gyarah Rudri Temple, and Pehowa.', icon: 'Heart' },
          { title: 'Medieval Fort Architecture Tour', description: 'Photograph the centuries-old gates and stone ramparts of Kaithal.', icon: 'Compass' }
        ],
        bestTimeToVisit: 'October to March',
        startingPrice: 1599,
        featured: true,
        status: 'active'
      },
      {
        name: 'Chandigarh',
        slug: 'chandigarh',
        country: 'India',
        state: 'Chandigarh UT',
        region: 'Chandigarh Tricity',
        shortDescription: 'The City Beautiful with Rock Garden, Sukhna Lake, Rose Garden, and premier corporate & airport cab services.',
        description: 'India’s premier planned modern city designed by Le Corbusier. Relax by the serene waters of Sukhna Lake, walk through Nek Chand’s extraordinary Rock Garden, visit Zakir Hussain Rose Garden, shop at Elante Mall, and enjoy seamless 24/7 airport and corporate chauffeur service.',
        heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=1200',
        gallery: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Sukhna_Lake_Chandigarh.jpg?width=800'
        ],
        attractions: [
          { title: 'Nek Chand Rock Garden', description: 'World-famous 40-acre sculpture garden created completely out of industrial waste.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=600' },
          { title: 'Sukhna Lake', description: 'Picturesque 3 sq km artificial reservoir at the foothills of the Shivalik range.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sukhna_Lake_Chandigarh.jpg?width=600' }
        ],
        thingsToDo: [
          { title: 'Sukhna Lake Boating & Promenade Walk', description: 'Evening strolls, solar boat rides, and duck watching.', icon: 'Sun' },
          { title: 'Elante Mall Luxury Shopping', description: 'Explore North India’s top shopping and dining destination.', icon: 'ShoppingBag' }
        ],
        bestTimeToVisit: 'Year-Round (Best: October to April)',
        startingPrice: 2499,
        featured: true,
        status: 'active'
      }
    ];

    const destinations = await Destination.insertMany(destinationsData);
    console.log(`[Seed] Seeded ${destinations.length} Regional Destinations`);

    // Map destinations by slug
    const destMap = {};
    destinations.forEach(d => {
      destMap[d.slug] = d;
    });

    // 3. Create Tour Packages
    const packagesData = [
      {
        title: 'Kurukshetra Mahabharata & Holy Sarovars Spiritual Yatra',
        slug: 'kurukshetra-mahabharata-holy-sarovars-spiritual-yatra',
        destination: destMap['kurukshetra']._id,
        destinationName: 'Kurukshetra',
        category: 'Spiritual Yatras',
        duration: '2 Days / 1 Night',
        daysCount: 2,
        nightsCount: 1,
        price: 6499,
        discountedPrice: 4999,
        rating: 5.0,
        reviewsCount: 52,
        description: 'Immerse yourself in epic Indian history with our signature Kurukshetra spiritual tour. Experience sacred holy dip at Brahma Sarovar, visit the eternal Jyotisar banyan tree, explore Sheikh Chilli’s marble tomb, and witness the Gita Panorama.',
        featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=800',
        images: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Sheikh_Chilli_Tomb_Kurukshetra.jpg?width=800'
        ],
        itinerary: [
          { day: 1, title: 'Brahma Sarovar, Sannihit Sarovar & Evening Aarti', description: 'Doorstep pickup in sanitized AC cab. Check-in and afternoon darshan at Brahma Sarovar, Sannihit Sarovar, and grand evening aarti.', meals: 'Dinner', hotel: 'Deluxe Heritage Hotel Kurukshetra' },
          { day: 2, title: 'Jyotisar Gita Birthplace & Sheikh Chilli Tomb', description: 'Morning visit to Jyotisar, Kurukshetra Panorama & Science Centre, Sheikh Chilli’s tomb, and departure transfer.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '1 Night stay in comfortable verified 3-star AC hotel',
          'Daily breakfast and dinner',
          'Dedicated AC commercial cab for all local sightseeing',
          'Toll tax, parking, and driver allowances included'
        ],
        exclusions: ['Monument tickets', 'Personal expenses'],
        hotels: 'Hotel Pearl Marc / Hotel Saffron Kurukshetra',
        transport: 'Private AC Dzire / Ertiga / Innova Crysta',
        tags: ['Spiritual', 'Kurukshetra', 'Heritage', 'Gita', 'Yatra'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Ambala Heritage, Gurdwaras & Wholesale Textile Shopping Tour',
        slug: 'ambala-heritage-cloth-market-shopping-tour',
        destination: destMap['ambala']._id,
        destinationName: 'Ambala',
        category: 'Heritage & History',
        duration: '2 Days / 1 Night',
        daysCount: 2,
        nightsCount: 1,
        price: 5999,
        discountedPrice: 4499,
        rating: 5.0,
        reviewsCount: 38,
        description: 'Perfect blend of spiritual solace and world-class wedding shopping. Visit Gurudwara Manji Sahib, Holy Redeemer Church, and spend a dedicated day shopping at Asia’s largest cloth market with private cab luggage storage.',
        featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=800',
        images: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Ambala_Cantt_Railway_Station.jpg?width=800'
        ],
        itinerary: [
          { day: 1, title: 'Historical Gurudwaras & British Cantt Tour', description: 'Morning pickup and visit to Gurudwara Manji Sahib, Sis Ganj Sahib, and Holy Redeemer Church. Evening stroll in Patel Park.', meals: 'Dinner', hotel: 'Deluxe City Hotel Ambala Cantt' },
          { day: 2, title: 'All-Day Bridal & Textile Shopping at Wholesale Market', description: 'Dedicated full day with cab at Asia’s largest cloth market for wedding lehengas, suits, and handlooms.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '1 Night hotel stay in Ambala Cantt',
          'Daily breakfast and dinner',
          'Dedicated cab with safe trunk space for all shopping luggage',
          'Driver allowances and all parking charges'
        ],
        exclusions: ['Shopping purchases', 'Personal meals'],
        hotels: 'Hotel Clarks Inn / D.R. International Ambala',
        transport: 'Private AC Sedan / Ertiga MUV',
        tags: ['Shopping', 'Ambala', 'Heritage', 'Textile'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Delhi NCR Capital Monument & Heritage Explorer',
        slug: 'delhi-ncr-capital-heritage-tour',
        destination: destMap['delhi']._id,
        destinationName: 'Delhi',
        category: 'Delhi NCR & Airport',
        duration: '3 Days / 2 Nights',
        daysCount: 3,
        nightsCount: 2,
        price: 11999,
        discountedPrice: 8999,
        rating: 5.0,
        reviewsCount: 65,
        description: 'Comprehensive private chauffeur tour of India’s capital. Discover India Gate, Red Fort, Qutub Minar, Akshardham Temple, Lotus Temple, and Connaught Place with seamless point-to-point AC transfers.',
        featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=800',
        images: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Qutub_Minar_in_New_Delhi_03-2016.jpg?width=800'
        ],
        itinerary: [
          { day: 1, title: 'Delhi Arrival, India Gate & Connaught Place', description: 'Pickup from your doorstep or Delhi IGI Airport. Visit India Gate, Kartavya Path, and evening at Connaught Place.', meals: 'Dinner', hotel: '4-Star Central Delhi Hotel' },
          { day: 2, title: 'Mughal Heritage: Red Fort, Jama Masjid & Qutub Minar', description: 'Explore Old Delhi bazaar delicacies, UNESCO Qutub Minar complex, and Humayun’s Tomb.', meals: 'Breakfast & Dinner', hotel: '4-Star Central Delhi Hotel' },
          { day: 3, title: 'Akshardham Temple & Departure Transfer', description: 'Morning visit to Swaminarayan Akshardham Temple and smooth drop to airport or railway station.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '2 Nights in verified 4-star city hotel',
          'Daily buffet breakfast and dinner',
          'Dedicated AC commercial cab for full 3 days',
          'Toll, state border taxes, parking, and driver allowances'
        ],
        exclusions: ['Monument entrance fees', 'Personal expenses'],
        hotels: 'The Suryaa / Radisson Blu Delhi',
        transport: 'Private AC Toyota Innova Crysta / Dzire Sedan',
        tags: ['Delhi', 'Heritage', 'Monuments', 'Capital', 'Sightseeing'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Haryana GT Road Heritage & Lake Getaway (Karnal & Panipat)',
        slug: 'haryana-gt-road-karnal-panipat-getaway',
        destination: destMap['karnal']._id,
        destinationName: 'Karnal',
        category: 'Weekend Getaways',
        duration: '2 Days / 1 Night',
        daysCount: 2,
        nightsCount: 1,
        price: 5499,
        discountedPrice: 3999,
        rating: 5.0,
        reviewsCount: 31,
        description: 'Discover the rich history of the Grand Trunk Road. Cruise along NH 44 to relax at Karna Lake, explore the ancient Panipat battlefields at Kala Amb, visit Babur’s 500-year-old Kabuli Bagh Mosque, and savor authentic highway dhabas.',
        featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=800',
        images: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=800'
        ],
        itinerary: [
          { day: 1, title: 'Karnal Arrival, Karna Lake Boating & Planetarium', description: 'Scenic drive to Karnal. Relax at Karna Lake, take a pedal boat ride, and visit the Kalpana Chawla Planetarium.', meals: 'Dinner', hotel: 'Karna Lake Resort Karnal' },
          { day: 2, title: 'Panipat Historic Battlefields & Weaver Markets', description: 'Visit Kala Amb, Kabuli Bagh Mosque, Panipat Museum, and shop direct factory textiles before departure.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '1 Night resort stay at Karna Lake',
          'Daily breakfast and dinner',
          'Dedicated AC cab for complete GT Road circuit',
          'All toll, fuel, and parking expenses'
        ],
        exclusions: ['Shopping expenses', 'Entry fees'],
        hotels: 'Oasis Complex & Resort Karnal',
        transport: 'Private AC Sedan / Ertiga',
        tags: ['Karnal', 'Panipat', 'GTRoad', 'Lake', 'History'],
        featured: true,
        status: 'published'
      },
      {
        title: 'The City Beautiful Chandigarh & Sukhna Lake Weekend Escape',
        slug: 'chandigarh-rock-garden-sukhna-weekend-escape',
        destination: destMap['chandigarh']._id,
        destinationName: 'Chandigarh',
        category: 'Weekend Getaways',
        duration: '2 Days / 1 Night',
        daysCount: 2,
        nightsCount: 1,
        price: 7499,
        discountedPrice: 5999,
        rating: 5.0,
        reviewsCount: 47,
        description: 'Experience India’s cleanest and most modern city. Tour Nek Chand’s world-famous Rock Garden, enjoy sunset boating at Sukhna Lake, stroll through Zakir Hussain Rose Garden, and shop at Elante Mall with premium chauffeur comfort.',
        featuredImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=800',
        images: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=800',
          'https://commons.wikimedia.org/wiki/Special:FilePath/Sukhna_Lake_Chandigarh.jpg?width=800'
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Chandigarh, Rock Garden & Sukhna Lake Sunset', description: 'Smooth morning drive. Visit Nek Chand’s Rock Garden, followed by sunset boating and promenade dining at Sukhna Lake.', meals: 'Dinner', hotel: 'Deluxe City Hotel Chandigarh' },
          { day: 2, title: 'Rose Garden, Sector 17 & Elante Mall Shopping', description: 'Tour Zakir Hussain Rose Garden, explore Sector 17 plaza, shop at Elante Mall, and evening return transfer.', meals: 'Breakfast', hotel: 'Checkout' }
        ],
        inclusions: [
          '1 Night stay in top-rated 3/4-star Chandigarh hotel',
          'Daily breakfast and dinner',
          'Private dedicated AC cab for all city transfers',
          'All tolls, parking fees, and driver charges'
        ],
        exclusions: ['Boat rental tickets', 'Personal shopping'],
        hotels: 'Hotel Mountview / Park Plaza Chandigarh',
        transport: 'Private AC Toyota Innova Crysta / Dzire',
        tags: ['Chandigarh', 'Weekend', 'SukhnaLake', 'RockGarden', 'Modern'],
        featured: true,
        status: 'published'
      }
    ];

    const packages = await Package.insertMany(packagesData);
    console.log(`[Seed] Seeded ${packages.length} Tour Packages`);

    // 4. Sample Bookings
    const bookingsData = [
      {
        bookingNumber: 'VTT-20261015-1042',
        package: packages[0]._id,
        customerName: 'Aarav Mehta',
        email: 'user@vistatourtravels.com',
        phone: '+91 90688 88578',
        address: 'Nawarsi Bazar, Ladwa, Kurukshetra',
        travelDate: new Date('2026-10-25'),
        adults: 2,
        children: 1,
        pickupLocation: 'Ladwa, Kurukshetra',
        specialRequirements: 'Vegetarian meals preferred, ground floor room',
        packagePrice: 4999,
        taxes: 500,
        totalAmount: 10498,
        paymentStatus: 'Paid',
        bookingStatus: 'Confirmed'
      }
    ];
    await Booking.insertMany(bookingsData);
    console.log('[Seed] Seeded Sample Bookings');

    // 5. Testimonials (5.0★ Google Reviews)
    const testimonialsData = [
      {
        customerName: 'Gurpreet Singh',
        destination: 'Kurukshetra, Haryana',
        packageTitle: 'Kurukshetra Holy Sarovars Spiritual Yatra',
        rating: 5,
        review: 'Outstanding cab and yatra service by Vista Tour and Travels! Chauffeur arrived punctually at our doorstep, vehicle was spotless Innova Crysta, and driving was safe and smooth throughout our family pilgrimage. Highly recommended!',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        createdAt: new Date('2026-09-18')
      },
      {
        customerName: 'Ananya Sharma',
        destination: 'Delhi NCR & IGI Airport',
        packageTitle: '24/7 Delhi IGI Airport Cab Transfer',
        rating: 5,
        review: 'Booked Vista Tour and Travels for midnight airport pickup to Ladwa/Kurukshetra. Exceptional polite driver, zero hidden tolls, and very comfortable ride. 5-star Google experience!',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        createdAt: new Date('2026-09-28')
      },
      {
        customerName: 'Rajesh Kumar',
        destination: 'Ambala Cloth Market',
        packageTitle: 'Ambala Bridal Shopping Chauffeur Cab',
        rating: 5,
        review: 'Best taxi service in Ladwa and Kurukshetra! Transparent pricing with prompt WhatsApp booking confirmation. Chauffeur helped us with ample trunk space for our wedding shopping.',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        createdAt: new Date('2026-10-04')
      },
      {
        customerName: 'Vikramjit Sandhu',
        destination: 'Chandigarh Tricity',
        packageTitle: 'Luxury Tempo Traveller Group Tour',
        rating: 5,
        review: 'Booked a Tempo Traveller with Vista Tour and Travels for our 15-member family function. Spotless AC vehicle, very professional driver, and on-time pickups. Truly 5.0★ service!',
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
        title: 'Top 7 Historic Sites You Must Visit in Kurukshetra',
        slug: 'top-historic-sites-in-kurukshetra',
        coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1000',
        excerpt: 'From the sacred waters of Brahma Sarovar to the ancient banyan tree at Jyotisar, explore the Mahabharata heartland.',
        content: `Kurukshetra is one of the most culturally and historically significant pilgrimage destinations in India.\n\n### 1. Sacred Dip at Brahma Sarovar\nAsia’s largest sacred man-made water tank mentioned in ancient scriptures, with thousands taking part in evening aarti.\n\n### 2. Jyotisar: Birthplace of the Bhagavad Gita\nThe sacred spot where Lord Krishna delivered the Gita sermon to Arjuna beneath an immortal banyan tree.\n\n### 3. Sheikh Chilli’s Marble Mausoleum\nA magnificent example of Mughal architecture often called the Taj Mahal of Haryana.\n\n### 4. Kurukshetra Panorama & Science Centre\nAn interactive museum bringing the eighteen-day Mahabharata battle to life with scale models and acoustic narration.`,
        category: 'Travel Guides',
        readTime: '5 min read',
        status: 'published',
        tags: ['Kurukshetra', 'Heritage', 'History', 'Haryana']
      },
      {
        title: 'Complete Ambala Cloth Market Shopping Guide: Tips & Best Deals',
        slug: 'ambala-cloth-market-shopping-guide',
        coverImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ambala_Cantt_Railway_Station.jpg?width=1000',
        excerpt: 'Everything you need to know before visiting Asia’s largest wholesale fabric and bridal wear market in Ambala.',
        content: `Ambala Cloth Market is a paradise for brides, families, and boutique owners seeking premium fabrics at direct wholesale prices.\n\n### Tips for Shoppers:\n- Book a private cab with luggage boot space so your shopping bags are safely stored between markets\n- Morning hours (11 AM to 2 PM) offer the most personalized attention\n- Explore both wholesale lanes and dedicated bridal showrooms for maximum variety`,
        category: 'Travel Tips',
        readTime: '4 min read',
        status: 'published',
        tags: ['Ambala', 'Shopping', 'Bridal', 'Textile']
      }
    ];
    await Blog.insertMany(blogsData);
    console.log('[Seed] Seeded Blog Articles');

    // 7. Gallery
    const galleryData = [
      { title: 'Brahma Sarovar Aarti', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=900', category: 'Culture', location: 'Kurukshetra, Haryana' },
      { title: 'Sheikh Chilli Tomb', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sheikh_Chilli_Tomb_Kurukshetra.jpg?width=900', category: 'Heritage', location: 'Kurukshetra, Haryana' },
      { title: 'India Gate Monument', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=900', category: 'Monuments', location: 'New Delhi' },
      { title: 'Karna Lake Promenade', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=900', category: 'Nature', location: 'Karnal, Haryana' },
      { title: 'Rock Garden Sculptures', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=900', category: 'Culture', location: 'Chandigarh' },
      { title: 'Sukhna Lake Sunset', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sukhna_Lake_Chandigarh.jpg?width=900', category: 'Lakes', location: 'Chandigarh' }
    ];
    await Gallery.insertMany(galleryData);
    console.log('[Seed] Seeded Gallery Photos');

    // 8. FAQs
    const faqsData = [
      {
        question: 'How do I book a cab or tour package with Vista Tour and Travels?',
        answer: 'You can easily book online or call us directly at +91 90688 88578. You can also click the WhatsApp button to get an instant quote and booking confirmation on your phone.',
        category: 'Booking',
        order: 1
      },
      {
        question: 'Do you provide 24/7 doorstep pickup across Ladwa and Kurukshetra?',
        answer: 'Yes! We provide 24/7 round-the-clock doorstep cab pickups across Ladwa, Kurukshetra, Ambala, Karnal, Yamunanagar, Kaithal, and direct transfers to Delhi IGI Airport and Chandigarh Airport.',
        category: 'Transportation',
        order: 2
      },
      {
        question: 'What are the available payment methods?',
        answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, Cash, and Bank Transfer. All billing is completely transparent with zero hidden fees.',
        category: 'Payment',
        order: 3
      },
      {
        question: 'Are all vehicles commercial licensed and sanitized?',
        answer: 'Yes! Every car in our fleet (Innova Crysta, Ertiga, Dzire, Fortuner, Tempo Traveller) is commercial-licensed, sanitized before every journey, and driven by verified professional chauffeurs.',
        category: 'Vehicles',
        order: 4
      }
    ];
    await FAQ.insertMany(faqsData);
    console.log('[Seed] Seeded FAQs');

    // 9. Services
    const servicesData = [
      {
        title: 'Chauffeur Cab & Taxi Services',
        slug: 'chauffeur-cab-taxi-services',
        shortDescription: 'Sanitized AC sedans, SUVs, and luxury Tempo Travellers driven by verified commercial chauffeurs.',
        description: 'Fleet of Toyota Innova Crysta, Dzire, Ertiga, Fortuner, and Tempo Travellers driven by courteous, verified commercial chauffeurs across Haryana, Delhi NCR, and Chandigarh.',
        icon: 'Car',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=600',
        features: ['Verified commercial chauffeurs', 'Fixed transparent fares with zero hidden charges', 'Punctual door-to-door pickups'],
        order: 1
      },
      {
        title: 'Airport & Railway Transfers',
        slug: 'airport-railway-transfers',
        shortDescription: 'Punctual 24/7 meet-and-greet transfers for Delhi IGI Airport, Chandigarh Airport, and Ambala Cantt Railway Station.',
        description: 'Never worry about missing a flight or train. Our chauffeurs ensure on-time doorstep pickup with full luggage handling assistance.',
        icon: 'Clock',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=600',
        features: ['Real-time flight arrival tracking', 'Zero surge pricing', 'Chauffeur meet & greet service'],
        order: 2
      },
      {
        title: 'Customized Tour Packages',
        slug: 'customized-tour-packages',
        shortDescription: 'Bespoke regional and North India holiday plans personalized to your travel pace, budget, and dates.',
        description: 'Whether you want a spiritual yatra in Kurukshetra, a monument exploration in Delhi NCR, or a weekend in Chandigarh, we plan your custom itinerary with verified hotels and private transport.',
        icon: 'Compass',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=600',
        features: ['Personalized day-by-day planning', 'Hand-picked 3/4/5-star accommodations', '24/7 on-trip concierge assistance'],
        order: 3
      }
    ];
    await Service.insertMany(servicesData);
    console.log('[Seed] Seeded Services');

    // 10. Website Settings
    await WebsiteSetting.create({
      companyName: 'Vista Tour and Travels',
      serviceName: 'Vista Tour and Travels',
      tagline: '5.0 ★ Rated Tour Packages & Luxury Cabs in Haryana & Delhi NCR',
      heroTitle: 'Experience Seamless Journeys with Vista Tour and Travels',
      heroSubtitle: 'Haryana’s top-rated luxury cab service and travel provider. Clean commercial cabs, verified professional chauffeurs, and transparent all-inclusive quotes.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1920',
      logo: '/logo.jpg',
      phone: '+91 90688 88578',
      secondaryPhone: '+91 99965 70920',
      altPhone: '+91 99965 70920',
      email: 'info@vistatourtravels.com',
      address: 'Nawarsi Bazar, Ladwa, Haryana 136132, India',
      areasServed: 'Kurukshetra, Ambala, Delhi NCR, Karnal, Panipat, Yamunanagar, Kaithal, Chandigarh, Ladwa',
      googleRating: 5.0,
      googleReviewCount: 50,
      googleMapsUrl: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132',
      googleReviewsUrl: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132',
      facebook: 'https://facebook.com/vistatourtravels',
      instagram: 'https://instagram.com/vistatourtravels',
      youtube: 'https://youtube.com/@vistatourtravels',
      whatsapp: '+919068888578',
      businessHours: '24 Hours Open (7 Days a Week)',
      experienceYears: '12+',
      happyTravelers: '10,000+',
      destinationCount: '8+',
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
