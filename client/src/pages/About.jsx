import React from 'react';
import { useWebsite } from '../context/WebsiteContext';
import {
  Compass,
  Target,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const About = () => {
  const { settings } = useWebsite();
  const navigate = useNavigate();

  const milestones = [
    { year: '2014', title: 'Foundation', desc: 'Started with 2 private cabs providing Shimla & Manali weekend tours.' },
    { year: '2017', title: 'Pan-India Expansion', desc: 'Launched full tour operations in Kashmir, Goa, Rajasthan, and Kerala.' },
    { year: '2021', title: '5000+ Travelers Milestone', desc: 'Recognized as leading Himachal & North India holiday specialists.' },
    { year: '2026', title: 'Modern SaaS Travel Platform', desc: '100% digital booking, 24/7 live concierge, and verified stays.' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-3.5 py-1 rounded-full mb-3 border border-amber-400/30">
            <Compass className="w-3.5 h-3.5" /> Vista Tour and Travels • 5.0 ★ Google Rated
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            About Vista Tour and Travels
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Leading luxury cab service and tour operator in Mohali, Chandigarh, and Himachal Pradesh. Trusted for punctual cab pickups, verified mountain chauffeurs, and customized holiday packages.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 space-y-16">
        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">
              Our Story
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight mb-4 leading-tight">
              Rooted in Passion for Seamless Travel
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Headquartered in Sector 73, Mohali, Punjab (160055), <strong>Vista Tour and Travels</strong> was founded with a dedicated mission: to provide the safest, most reliable chauffeur-driven cabs and tour journeys across Mohali, Chandigarh Tricity, Himachal, and North India.
              </p>
              <p>
                Backed by 50+ verified 5.0★ Google reviews, we serve travelers across Mohali (Sector 73 / 119), Chandigarh International Airport, Panchkula, Kangra, Dharamshala, McLeodGanj, Dalhousie, Manali, and Shimla.
              </p>
              <p>
                Our fleet of modern, sanitized Innova Crysta, Ertiga, Dzire sedans, and Tempo Travellers are manned by polite, police-verified mountain chauffeurs who know every curve, scenic viewpoint, and local gem.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
              alt="Himalayan travel story"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80';
              }}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To deliver bespoke, transparent, and joyful travel experiences with uncompromised comfort, honest pricing, and genuine hospitality for every single traveler.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To be India’s most trusted and beloved tour operator, recognized for exceptional customer satisfaction, responsible tourism, and unforgettable adventures.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="bg-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-navy-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-navy-800">
            <div className="pt-4 lg:pt-0">
              <p className="text-4xl lg:text-5xl font-black text-brand-400">{settings.experienceYears || '10+'}</p>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">Years Experience</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-4xl lg:text-5xl font-black text-amber-400">{settings.happyTravelers || '5000+'}</p>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">Happy Travelers</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-4xl lg:text-5xl font-black text-sky-400">{settings.destinationCount || '100+'}</p>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">Destinations Covered</p>
            </div>
            <div className="pt-4 lg:pt-0">
              <p className="text-4xl lg:text-5xl font-black text-emerald-400">{settings.supportHours || '24/7'}</p>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-1">Live Helpline</p>
            </div>
          </div>
        </div>

        {/* Milestones / Timeline */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-100">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Key Milestones</h2>
            <p className="text-slate-500 text-sm mt-1">How we grew into a nationwide holiday brand.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-2xl font-black text-brand-600 mb-2 block">{m.year}</span>
                <h4 className="text-base font-bold text-navy-900 mb-1">{m.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
