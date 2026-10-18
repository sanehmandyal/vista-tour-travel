import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config();

const seedCars = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://sanehmandyal_db_user:KvGLMRqlhhJNroRL@cluster0.wjzihrm.mongodb.net/rinku_tour_travels';
  await mongoose.connect(mongoUri);
  console.log('[Cars Seed] Connected to MongoDB Atlas');

  await Car.deleteMany();
  console.log('[Cars Seed] Cleared existing cars');

  const carsData = [
    {
      name: 'Toyota Innova Crysta',
      category: 'SUV',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Diesel',
      ratePerKm: 16,
      rateDaily: 4000,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800',
      features: [
        'Dual AC & Climate Control',
        'Roof Carrier for Extra Luggage',
        'Pushback Recliner Seats',
        'Experienced Hill Chauffeur',
        'Clean & Sanitized Interiors',
        'Phone Charger & Music System'
      ],
      description: 'The undisputed king of hill travel. Exceptional comfort, high safety rating, and ample luggage room make it the premier choice for family tours to Dharamshala, Manali, and Dalhousie.',
      isAvailable: true,
      order: 1
    },
    {
      name: 'Maruti Suzuki Ertiga',
      category: 'MUV',
      seatingCapacity: '5 + 1 Seats',
      luggageCapacity: '3 Large Bags',
      fuelType: 'Petrol / Hybrid',
      ratePerKm: 13,
      rateDaily: 3200,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ertiga(2).jpg?width=800',
      features: [
        'Chilled AC with Rear Vents',
        'Comfortable 3-Row Seating',
        'Smooth Mountain Suspension',
        'Hill-Certified Driver',
        'USB Charging Ports'
      ],
      description: 'Budget-friendly yet remarkably spacious. Perfect for small families, local Kangra temple circuits, and airport pickups from Kangra (Gaggal) or Pathankot.',
      isAvailable: true,
      order: 2
    },
    {
      name: 'Maruti Suzuki Swift Dzire',
      category: 'Sedan',
      seatingCapacity: '4 + 1 Seats',
      luggageCapacity: '2 Large Bags + Handbags',
      fuelType: 'Petrol',
      ratePerKm: 11,
      rateDaily: 2400,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Dzire_VXi_VVT_(front).JPG?width=800',
      features: [
        'AC & Rapid Cabin Heating',
        'Deep Boot Space',
        'Smooth Highway Ride',
        'Sanitized Daily',
        'Economical & Quick'
      ],
      description: 'Most popular and economical choice for couples, solo travelers, and city tours across Kangra, Dharamshala, Chamunda Devi, and Jawalaji.',
      isAvailable: true,
      order: 3
    },
    {
      name: 'Mahindra Scorpio-N / 4x4',
      category: '4x4 Off-Road',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Diesel',
      ratePerKm: 18,
      rateDaily: 4800,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio.jpg?width=800',
      features: [
        '4x4 High Ground Clearance',
        'Rugged All-Terrain Hill Tires',
        'Roof Luggage Rack',
        'Snow Chain Equipped',
        'Seasoned Mountain Chauffeur'
      ],
      description: 'Built tough for rough Himalayan terrains. Best suited for high-altitude expeditions to Rohtang Pass, Spiti Valley, Chandratal Lake, and snow-covered passes.',
      isAvailable: true,
      order: 4
    },
    {
      name: 'Force Tempo Traveller (12-Seater Executive)',
      category: 'Tempo Traveller',
      seatingCapacity: '12 + 1 Passengers',
      luggageCapacity: 'Rear Boot + Heavy Roof Carrier',
      fuelType: 'Diesel',
      ratePerKm: 24,
      rateDaily: 6500,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
      features: [
        '1x1 & 2x1 Reclining Pushback Seats',
        'Individual AC Vents & Reading Lights',
        'LED Screen & Stereo Music System',
        'Spacious Center Walkway',
        'Senior Tour Chauffeur'
      ],
      description: 'First-class group luxury. Ideal for joint families, corporate offsites, and wedding guest transfers across Himachal Pradesh and Punjab.',
      isAvailable: true,
      order: 5
    },
    {
      name: 'Force Tempo Traveller (17-Seater Deluxe)',
      category: 'Tempo Traveller',
      seatingCapacity: '17 + 1 Passengers',
      luggageCapacity: 'Extra Heavy Overhead Carrier',
      fuelType: 'Diesel',
      ratePerKm: 28,
      rateDaily: 7500,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
      features: [
        'Wide Reclining Luxury Seats',
        'Dual High-Capacity AC Units',
        'High-Roof Stand-up Height Interior',
        'First Aid Kit & Fire Safety',
        'Microphone PA System'
      ],
      description: 'Maximum capacity with supreme comfort for large pilgrim groups, college batches, and extended family holidays across North India.',
      isAvailable: true,
      order: 6
    }
  ];

  const created = await Car.insertMany(carsData);
  console.log(`[Cars Seed] Successfully seeded ${created.length} car models!`);
  await mongoose.disconnect();
};

seedCars().catch(console.error);
