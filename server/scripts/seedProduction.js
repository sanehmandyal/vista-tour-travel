import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Car from '../models/Car.js';
import { destinationsData, getRegionalPackagesData, carsData } from '../data/regionalCatalogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const runSeed = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://sanehmandyal_db_user:UGMOXjT3MjiQ1ELz@cluster0.dgagojo.mongodb.net/vista-tour-travel?retryWrites=true&w=majority';
  console.log('[Seed] Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri);
  console.log('[Seed] Connected successfully!');

  // 1. Clear old destinations, packages, and cars
  await Promise.all([
    Destination.deleteMany(),
    Package.deleteMany(),
    Car.deleteMany()
  ]);
  console.log('[Seed] Cleared old destination, package, and car records.');

  // 2. 8 Regional Destinations: Haryana, Delhi NCR & Chandigarh
  const destinations = await Destination.insertMany(destinationsData);
  console.log(`[Seed] Successfully inserted ${destinations.length} Regional Destinations!`);

  const destMap = {};
  destinations.forEach(d => {
    destMap[d.slug] = d;
  });

  // 3. 8 Regional Tour Packages
  const packagesData = getRegionalPackagesData(destMap);
  const packages = await Package.insertMany(packagesData);
  console.log(`[Seed] Successfully inserted ${packages.length} Regional Tour Packages!`);

  // 4. 10 Verified Car Fleet Models
  const cars = await Car.insertMany(carsData);
  console.log(`[Seed] Successfully inserted ${cars.length} Car Fleet Models!`);

  console.log('\n==========================================');
  console.log('✅ SEED COMPLETE:');
  console.log(`- 8 Regional Destinations (Haryana, Delhi NCR & Chandigarh)`);
  console.log(`- 8 Comprehensive Regional Tour Packages`);
  console.log(`- 10 Commercial Car Fleet Models`);
  console.log('==========================================\n');

  process.exit(0);
};

runSeed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
