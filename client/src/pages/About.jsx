import React, { useState, useEffect } from 'react';
import { useWebsite } from '../context/WebsiteContext';
import { pageApi } from '../services/pageApi';
import {
  Compass,
  Target,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const About = () => {
  const { settings } = useWebsite();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await pageApi.getBySlug('about');
        if (res.success && res.data) {
          setPageData(res.data);
        }
      } catch (err) {
        console.warn('Page content fallback to local data');
      }
    };
    fetchPage();
  }, []);

  const storySection = pageData?.sections?.find(s => s.sectionId === 'story');
  const missionSection = pageData?.sections?.find(s => s.sectionId === 'mission-vision');
  const milestonesSection = pageData?.sections?.find(s => s.sectionId === 'milestones');

  const defaultMilestones = [
    { year: '2014', title: 'Foundation', desc: 'Started with 2 private cabs providing Kurukshetra, Ambala & Delhi NCR outstation tours.' },
    { year: '2017', title: 'Regional Expansion', desc: 'Expanded fleet across Haryana, Chandigarh Tricity, and Delhi NCR.' },
    { year: '2021', title: '5000+ Travelers Milestone', desc: 'Recognized as leading Haryana, GT Road & NCR travel specialists.' },
    { year: '2026', title: 'Modern SaaS Travel Platform', desc: '100% digital booking, 24/7 live concierge, and verified stays.' }
  ];

  const milestones = (milestonesSection && milestonesSection.items && milestonesSection.items.length > 0)
    ? milestonesSection.items.map(i => ({ year: i.badge || '2026', title: i.title, desc: i.description }))
    : defaultMilestones;

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-3.5 py-1 rounded-full mb-3 border border-amber-400/30">
            <Compass className="w-3.5 h-3.5" /> {pageData?.hero?.badge || 'Vista Tour and Travels • 5.0 ★ Google Rated'}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            {pageData?.hero?.title || 'About Vista Tour and Travels'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {pageData?.hero?.subtitle || 'Leading luxury cab service and tour operator based in Nawarsi Bazar, Ladwa (Kurukshetra, Haryana), serving Kurukshetra, Ambala, Karnal, Panipat, Yamunanagar, Kaithal, Chandigarh, and Delhi NCR. Trusted for punctual cab pickups, verified professional chauffeurs, and customized holiday packages.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 space-y-16">
        {/* Story Section */}
        {storySection?.isEnabled !== false && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2 block">
                {storySection?.badge || 'Our Story'}
              </span>
              <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight mb-4 leading-tight">
                {storySection?.title || 'Rooted in Passion for Seamless Travel'}
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {storySection?.description || (
                  <>
                    <p>
                      Headquartered in Nawarsi Bazar, Ladwa, Haryana (136132), <strong>Vista Tour and Travels</strong> was founded with a dedicated mission: to provide the safest, most reliable chauffeur-driven cabs and tour journeys across Ladwa, Kurukshetra, Haryana, Chandigarh, and Delhi NCR.
                    </p>
                    <p>
                      Backed by 50+ verified 5.0★ Google reviews, we serve travelers across Kurukshetra, Ambala, Delhi NCR, Chandigarh International Airport, Karnal, Panipat, Yamunanagar, and Kaithal.
                    </p>
                    <p>
                      Our fleet of modern, sanitized Innova Crysta, Ertiga, Dzire sedans, and Tempo Travellers are manned by polite, police-verified commercial chauffeurs who know every highway route, express corridor, and local landmark.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/60">
              <img
                src={storySection?.image || "/assets/images/hero-haryana-kurukshetra.jpg"}
                alt="Vista Tour and Travels - Ladwa, Kurukshetra & Haryana Journeys"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/hero-haryana-kurukshetra.jpg';
                }}
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        )}

        {/* Mission & Vision (Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 shadow-glass hover:shadow-glass-hover border border-white/80 flex flex-col justify-between transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-50/80 border border-brand-200/50 text-brand-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To deliver bespoke, transparent, and joyful travel experiences with uncompromised comfort, honest pricing, and genuine hospitality for every single traveler.
              </p>
            </div>
          </div>

          <div className="glass-panel glass-panel-hover rounded-3xl p-8 shadow-glass hover:shadow-glass-hover border border-white/80 flex flex-col justify-between transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50/80 border border-amber-200/50 text-amber-600 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To be India’s most trusted and beloved tour operator, recognized for exceptional customer satisfaction, responsible tourism, and unforgettable adventures.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Bar (Glassmorphism Dark) */}
        <div className="glass-dark text-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl border border-white/15 relative overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-400">{settings.experienceYears || '10+'}</p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-bold uppercase tracking-wider mt-1.5">Years Experience</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400">{settings.happyTravelers || '5000+'}</p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-bold uppercase tracking-wider mt-1.5">Happy Travelers</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-sky-400">{settings.destinationCount || '100+'}</p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-bold uppercase tracking-wider mt-1.5">Destinations Covered</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400">{settings.supportHours || '24/7'}</p>
              <p className="text-[11px] sm:text-xs text-slate-300 font-bold uppercase tracking-wider mt-1.5">Live Helpline</p>
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
