import React from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import {
  Users2,
  BadgePercent,
  Headphones,
  Sliders,
  Hotel,
  ShieldCheck,
  Award,
  HeartHandshake
} from 'lucide-react';

export const WhyChooseUs = () => {
  const { settings } = useWebsite();

  const reasons = [
    {
      icon: Users2,
      title: 'Experienced Travel Experts',
      description: 'Over a decade of crafting unforgettable vacations with seasoned local guides and planners.'
    },
    {
      icon: BadgePercent,
      title: 'Best Price Guarantee',
      description: 'Direct tie-ups with premium hotels and transport fleets ensure transparent rates without middleman fees.'
    },
    {
      icon: Headphones,
      title: '24/7 On-Trip Support',
      description: 'Our dedicated travel emergency helpline is always active while you are on the road.'
    },
    {
      icon: Sliders,
      title: '100% Customized Trips',
      description: 'Add extra days, modify sightseeing, or upgrade hotel categories to suit your exact vacation style.'
    },
    {
      icon: Hotel,
      title: 'Verified 3 & 4-Star Hotels',
      description: 'Hand-vetted properties with excellent hygiene, hot water, central locations, and scenic vistas.'
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Comfortable Travel',
      description: 'Commercial-licensed sanitized vehicles driven by polite, police-verified mountain chauffeurs.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3.5 py-1 rounded-full mb-3">
            <Award className="w-3.5 h-3.5" /> 5.0★ Google Rated Tour & Luxury Cab Service
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Why Choose Vista Tour and Travels
          </h2>
          <p className="text-slate-500 mt-3 text-base">
            Backed by 50+ five-star Google reviews, Vista Tour and Travels delivers sanitized cabs, expert hill chauffeurs, and customized itineraries across Mohali, Chandigarh, Himachal and North India.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-soft border border-slate-100 hover:shadow-card hover:border-brand-100 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Strip */}
        <div className="mt-16 bg-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-navy-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-navy-800">
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-400">
                {settings.experienceYears || '10+'}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium uppercase tracking-wider mt-1">
                Years of Experience
              </p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400">
                {settings.happyTravelers || '5000+'}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium uppercase tracking-wider mt-1">
                Delighted Travelers
              </p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-sky-400">
                {settings.destinationCount || '100+'}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium uppercase tracking-wider mt-1">
                Destinations Explored
              </p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400">
                {settings.supportHours || '24/7'}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium uppercase tracking-wider mt-1">
                Customer Assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
