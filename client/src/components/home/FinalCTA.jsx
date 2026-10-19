import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsite } from '../../context/WebsiteContext';
import { PhoneCall, Compass, ArrowRight, MessageCircle } from 'lucide-react';
import Button from '../common/Button';

export const FinalCTA = () => {
  const { settings } = useWebsite();
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-navy-950 text-white relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="/assets/images/hero-haryana-kurukshetra.jpg"
          alt="Haryana Heritage Background"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/images/hero-haryana-kurukshetra.jpg';
          }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-5xl mx-auto px-2.5 min-[360px]:px-4 sm:px-6 relative z-10">
        <div className="glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-14 border border-white/15 text-center shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-400/40 flex items-center justify-center mx-auto mb-6 text-brand-400 shadow-glass">
            <Compass className="w-7 h-7 animate-spin-slow" />
          </div>

          <h2 className="text-2xl sm:text-5xl font-black tracking-tight mb-4 leading-tight break-words">
            Experience the True Spirit of Haryana & Beyond
          </h2>

          <p className="text-slate-300 text-xs sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
            From sacred Brahma Sarovar & Jyotisar tirthas in Kurukshetra to vibrant Delhi NCR shopping and scenic Chandigarh getaways — travel across Haryana & North India in premium AC cabs with authentic Haryanvi hospitality.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              variant="accent"
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto shadow-xl justify-center text-xs sm:text-base py-2.5 sm:py-3.5 px-4 sm:px-6"
            >
              Plan My Trip <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <a
              href={`https://wa.me/${(settings.whatsapp || '9068888578').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi Vista Tour and Travels, I am planning a holiday trip and would like to get a customized quote.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl text-xs sm:text-base px-4 sm:px-6 py-2.5 sm:py-3.5 gap-2 font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> WhatsApp Us
            </a>

            <a
              href={`tel:${settings.phone || '9068888578'}`}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl text-xs sm:text-base px-4 sm:px-6 py-2.5 sm:py-3.5 gap-2 font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 backdrop-blur-md shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" /> {settings.phone || '+91 90688 88578'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
