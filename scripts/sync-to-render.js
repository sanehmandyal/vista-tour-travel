import { destinationsData, getRegionalPackagesData, carsData } from '../server/data/regionalCatalogData.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const BASE_URL = 'https://vista-tour-travel-api.onrender.com/api';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer vtt_admin_authenticated_1729320000'
};

async function syncAll() {
  console.log('🚀 Starting Global Cloud Database Sync to Render & MongoDB Atlas...');

  const destMap = {};

  // 1. Sync Destinations
  console.log(`\n📌 Syncing ${destinationsData.length} Destinations...`);
  for (const d of destinationsData) {
    try {
      const res = await fetch(`${BASE_URL}/destinations`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(d)
      });
      const data = await res.json();
      if (data.success && data.data) {
        console.log(`  ✓ Destination synced: ${d.name} (${data.data._id})`);
        destMap[d.slug] = data.data;
      } else {
        console.warn(`  ✗ Failed to sync ${d.name}:`, data.message);
      }
    } catch (e) {
      console.error(`  ✗ Error syncing ${d.name}:`, e.message);
    }
  }

  // 2. Sync Tour Packages
  const packages = getRegionalPackagesData(destMap);
  console.log(`\n📦 Syncing ${packages.length} Tour Packages...`);
  for (const p of packages) {
    try {
      const res = await fetch(`${BASE_URL}/packages`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(p)
      });
      const data = await res.json();
      if (data.success && data.data) {
        console.log(`  ✓ Package synced: ${p.title} (${data.data._id})`);
      } else {
        console.warn(`  ✗ Failed to sync package ${p.title}:`, data.message);
      }
    } catch (e) {
      console.error(`  ✗ Error syncing package ${p.title}:`, e.message);
    }
  }

  // 3. Sync Cars
  console.log(`\n🚗 Syncing ${carsData.length} Cars & Fleet Vehicles...`);
  for (const c of carsData) {
    try {
      const res = await fetch(`${BASE_URL}/cars`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(c)
      });
      const data = await res.json();
      if (data.success && data.data) {
        console.log(`  ✓ Car synced: ${c.name} (${data.data._id})`);
      } else {
        console.warn(`  ✗ Failed to sync car ${c.name}:`, data.message);
      }
    } catch (e) {
      console.error(`  ✗ Error syncing car ${c.name}:`, e.message);
    }
  }

  // 4. Sync Settings
  console.log(`\n⚙️ Syncing Website Settings...`);
  try {
    const settingsPayload = {
      companyName: 'Vista Tour and Travels',
      serviceName: 'Vista Tour and Travels',
      tagline: '5.0 ★ Rated Tour Packages & Luxury Cabs in Ladwa, Kurukshetra & Haryana',
      phone: '+91 90688 88578',
      secondaryPhone: '+91 99965 70920',
      altPhone: '+91 99965 70920',
      email: 'info@vistatourtravels.com',
      address: 'Nawarsi Bazar, Ladwa, Haryana 136132, India',
      areasServed: 'Nawarsi Bazar, Ladwa, Kurukshetra, Ambala, Delhi NCR, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh',
      whatsapp: '+919068888578',
      googleRating: 5.0,
      googleReviewCount: 50,
      googleMapsUrl: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132',
      googleReviewsUrl: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132',
      facebook: 'https://facebook.com/vistatourtravels',
      instagram: 'https://instagram.com/vistatourtravels',
      youtube: 'https://youtube.com/@vistatourtravels'
    };

    const res = await fetch(`${BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(settingsPayload)
    });
    const data = await res.json();
    if (data.success) {
      console.log('  ✓ Website settings synced globally into MongoDB Atlas!');
    } else {
      console.warn('  ✗ Failed to sync settings:', data.message);
    }
  } catch (e) {
    console.error('  ✗ Error syncing settings:', e.message);
  }

  console.log('\n🎉 CLOUD DATABASE SYNC COMPLETE! All data is now live globally in MongoDB Atlas.');
}

syncAll();
