import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebsite } from '../../context/WebsiteContext';
import { PhoneCall, Compass, ArrowRight, MessageCircle } from 'lucide-react';
import Button from '../common/Button';

export const FinalCTA = () => {
  const { settings } = useWebsite();
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
          alt="Adventure Background"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80';
          }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center mx-auto mb-6 text-brand-400">
          <Compass className="w-6 h-6 animate-spin-slow" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
          Your next adventure is waiting.
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          From tranquil Kashmir houseboats to sun-drenched Goan beaches and snow peaks in Himachal — let our destination experts tailor your perfect journey.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="accent"
            onClick={() => navigate('/contact')}
            className="shadow-xl"
          >
            Plan My Trip <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>

          <a
            href={`https://wa.me/${(settings.whatsapp || '').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center font-medium rounded-xl text-base px-6 py-3.5 gap-2.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xl"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp Us
          </a>

          <a
            href={`tel:${settings.phone || '9876543210'}`}
            className="inline-flex items-center justify-center font-medium rounded-xl text-base px-6 py-3.5 gap-2.5 font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
          >
            <PhoneCall className="w-4 h-4" /> {settings.phone || '+91 98765 43210'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
