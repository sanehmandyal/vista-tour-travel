import mongoose from 'mongoose';

const websiteSettingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'Vista Tour and Travels'
    },
    serviceName: {
      type: String,
      default: 'Vista Tour and Travels'
    },
    tagline: {
      type: String,
      default: '5.0 ★ Rated Haryana & Delhi NCR Luxury Cabs'
    },
    heroTitle: {
      type: String,
      default: 'Experience Seamless Journeys with Vista Tour and Travels'
    },
    heroSubtitle: {
      type: String,
      default: 'Top-rated 5.0★ Google Verified Tour & Luxury Cab Service in Haryana & Delhi NCR. Clean commercial cabs, verified chauffeurs, and customized travel packages.'
    },
    heroImage: {
      type: String,
      default: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1920'
    },
    logo: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: '+91 90688 88578'
    },
    secondaryPhone: {
      type: String,
      default: '+91 99965 70920'
    },
    altPhone: {
      type: String,
      default: '+91 99965 70920'
    },
    email: {
      type: String,
      default: 'info@vistatourtravels.com'
    },
    address: {
      type: String,
      default: 'Nawarsi Bazar, Ladwa, Haryana 136132, India'
    },
    areasServed: {
      type: String,
      default: 'Nawarsi Bazar, Ladwa, Kurukshetra, Ambala, Delhi NCR, Karnal, Panipat, Yamunanagar, Kaithal & Chandigarh'
    },
    googleRating: {
      type: Number,
      default: 5.0
    },
    googleReviewCount: {
      type: Number,
      default: 46
    },
    googleMapsUrl: {
      type: String,
      default: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132'
    },
    googleReviewsUrl: {
      type: String,
      default: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132'
    },
    facebook: {
      type: String,
      default: 'https://facebook.com/vistatourtravels'
    },
    instagram: {
      type: String,
      default: 'https://instagram.com/vistatourtravels'
    },
    youtube: {
      type: String,
      default: 'https://youtube.com/@vistatourtravels'
    },
    whatsapp: {
      type: String,
      default: '+919068888578'
    },
    businessHours: {
      type: String,
      default: '24 Hours Open (7 Days a Week)'
    },
    experienceYears: {
      type: String,
      default: '12+'
    },
    happyTravelers: {
      type: String,
      default: '10,000+'
    },
    destinationCount: {
      type: String,
      default: '50+'
    },
    supportHours: {
      type: String,
      default: '24/7'
    },
    navigation: [
      {
        label: { type: String, required: true },
        path: { type: String, required: true },
        isEnabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
        isExternal: { type: Boolean, default: false }
      }
    ],
    announcementBar: {
      isEnabled: { type: Boolean, default: false },
      text: { type: String, default: 'Special Offer: 10% OFF on all Kurukshetra, Ambala & Delhi NCR tour bookings!' },
      link: { type: String, default: '/packages' },
      linkText: { type: String, default: 'Book Now' }
    },
    footerText: {
      type: String,
      default: 'Premier 5.0★ Google verified tour operator and 24/7 luxury commercial cab provider based in Nawarsi Bazar, Ladwa (Kurukshetra, Haryana).'
    },
    copyrightText: {
      type: String,
      default: '© 2026 Vista Tour and Travels. All rights reserved. Registered commercial travel operator in Haryana, India.'
    }
  },
  { timestamps: true }
);

const WebsiteSetting = mongoose.model('WebsiteSetting', websiteSettingSchema);
export default WebsiteSetting;
