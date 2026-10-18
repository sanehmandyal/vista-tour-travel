import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';

dotenv.config();

const seedCars = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://sanehmandyal_db_user:UGMOXjT3MjiQ1ELz@cluster0.dgagojo.mongodb.net/vista-tour-travel?retryWrites=true&w=majority';
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
        'Dual Front & Rear Chill AC',
        'Plush Reclining Captain Seats',
        'Roof Carrier for Extra Luggage',
        'Verified Highway Chauffeur',
        'Clean & Sanitized Interiors',
        'Phone Fast Charger & Music System'
      ],
      description: 'The undisputed monarch of road trips. Outstanding suspension, comfort, and reliability for Kurukshetra, Ambala, Delhi NCR, and Chandigarh routes.',
      isAvailable: true,
      order: 1
    },
    {
      name: 'Toyota Innova Hycross',
      category: 'Luxury',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Hybrid / Petrol',
      ratePerKm: 20,
      rateDaily: 5500,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Toyota_Kijang_Innova_Zenix_2.0_Q_Hybrid_Modellista_(front),_West_Surabaya.jpg?width=800',
      features: [
        'Panoramic Sunroof & Ambient Light',
        'Ultra Silent Hybrid Powertrain',
        'First Class Ottoman Lounge Seating',
        'Dual Zone Chilled Climate Control',
        'High-End Premium Audio'
      ],
      description: 'Next-generation luxury for VIP tours, executive delegates, and family journeys requiring supreme highway refinement across Haryana & Delhi NCR.',
      isAvailable: true,
      order: 2
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
        'Roof Mounted AC Blower Vents',
        'Modular 3-Row Foldable Seating',
        'Smooth Highway Suspension',
        'Verified Commercial Driver',
        'USB Ports in All Rows'
      ],
      description: 'The preferred family choice offering unbeatable value, high mileage, and spacious seating for Kurukshetra, Kaithal, and Karnal trips.',
      isAvailable: true,
      order: 3
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
        'Effective Auto Climate Control',
        'Deep 378L Boot Space',
        'Smooth Highway Ride',
        'Sanitized Daily',
        'Economical & Punctual'
      ],
      description: 'Comfortable, compact sedan for 24/7 Delhi IGI & Chandigarh airport transfers, local Ladwa trips, and fast outstation travel.',
      isAvailable: true,
      order: 4
    },
    {
      name: 'Toyota Etios',
      category: 'Sedan',
      seatingCapacity: '4 + 1 Seats',
      luggageCapacity: '3 Large Bags',
      fuelType: 'Diesel / Petrol',
      ratePerKm: 11,
      rateDaily: 2500,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Etios_1.5_XLS_Sedan_2019.jpg?width=800',
      features: [
        'Extra Legroom & Shoulder Room',
        'Huge 595L Boot Space',
        'Powerful Chilling AC',
        'Chauffeur Driven'
      ],
      description: 'Remarkably roomy sedan renowned for rugged reliability, comfort, and generous luggage room for outstation touring.',
      isAvailable: true,
      order: 5
    },
    {
      name: 'Maruti Suzuki Alto K10',
      category: 'Hatchback',
      seatingCapacity: '3 + 1 Seats',
      luggageCapacity: '2 Medium Bags',
      fuelType: 'Petrol',
      ratePerKm: 9,
      rateDaily: 1800,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_-_Alto_800_LXi.JPG?width=800',
      features: [
        'Nimble Handling for City Traffic & Local Markets',
        'Efficient Engine for Cost-Effective Travel',
        'Chilling AC & Comfortable Seating',
        'Most Economical Per-KM Fare'
      ],
      description: 'Pocket-friendly cab for solo travelers, couples, and fast point-to-point journeys across Ladwa, Kurukshetra, and nearby districts.',
      isAvailable: true,
      order: 6
    },
    {
      name: 'Mahindra Scorpio-N',
      category: 'SUV',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Diesel',
      ratePerKm: 17,
      rateDaily: 4500,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio.jpg?width=800',
      features: [
        'High Ground Clearance & Sturdy Build',
        'Electronic Terrain Modes & High Torque Engine',
        'Commanding Seating & Safety',
        'Pothole & Rough Highway Armor'
      ],
      description: 'Powerful and commanding SUV for all-weather cruising across Haryana, GT Road (NH 44), and regional excursions.',
      isAvailable: true,
      order: 7
    },
    {
      name: 'Toyota Fortuner',
      category: 'Luxury',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '5 Large Bags',
      fuelType: 'Diesel',
      ratePerKm: 24,
      rateDaily: 6500,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Fortuner_2.8_GR_Sport_4x4_2022.jpg?width=800',
      features: [
        'High-Torque Reliable Engine',
        'Plush Leather Interior',
        'Commanding Road Presence',
        'VIP Escort Service'
      ],
      description: 'The ultimate beast for luxury travel, executive delegations, and VIP family travel across North India.',
      isAvailable: true,
      order: 8
    },
    {
      name: 'Force Urbania Luxury Van',
      category: 'Tempo Traveller',
      seatingCapacity: '10 + 1 Passengers',
      luggageCapacity: '8 Large Bags',
      fuelType: 'Diesel',
      ratePerKm: 26,
      rateDaily: 7500,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
      features: [
        'Individual Aircraft-Style Bucket Seats',
        'Triple AC with Personalized Vents',
        'Panoramic Tinted Windows',
        'Individual USB Ports & Mood Lights'
      ],
      description: 'Next-generation European luxury van for executive groups, high-end family trips, and corporate delegates.',
      isAvailable: true,
      order: 9
    },
    {
      name: 'Force Tempo Traveller (17-Seater Deluxe)',
      category: 'Tempo Traveller',
      seatingCapacity: '17 + 1 Passengers',
      luggageCapacity: 'Extra Heavy Overhead Carrier',
      fuelType: 'Diesel',
      ratePerKm: 22,
      rateDaily: 6000,
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
      features: [
        'Wide Reclining Luxury Seats',
        'Dual High-Capacity AC Units',
        'High-Roof Stand-up Height',
        'First Aid Kit & Fire Safety',
        'Senior Verified Chauffeur'
      ],
      description: 'Maximum capacity with supreme comfort for large pilgrim groups visiting Kurukshetra Jyotisar, family functions, and weddings.',
      isAvailable: true,
      order: 10
    }
  ];

  await Car.insertMany(carsData);
  console.log('[Cars Seed] Successfully seeded cars for Haryana and regional routes!');
  process.exit(0);
};

seedCars().catch(err => {
  console.error('[Cars Seed Error]', err);
  process.exit(1);
});
