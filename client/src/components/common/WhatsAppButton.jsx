import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';

export const WhatsAppButton = () => {
  const { settings } = useWebsite();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  // Do not render on admin portal
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const cleanPhone = (settings.whatsapp || '9068888578').replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const defaultMessage = encodeURIComponent(
    `Hello Vista Tour and Travels! I am visiting your website and would like an instant quote for a cab / Himachal tour package from Ladwa / Haryana.`
  );
  const waUrl = `https://wa.me/${targetPhone}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Interactive Tooltip Card (Glassmorphism) */}
      {showTooltip && (
        <div className="mb-3 w-72 glass-dropdown rounded-2xl shadow-glass-hover border border-white/85 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                VT
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900 leading-tight">Vista Tour & Travels</p>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online • Typically replies in 5m
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              aria-label="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Looking for outstation cabs or customized Himachal tour packages? Click below to chat directly with our travel dispatch team.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Open WhatsApp Chat
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative group">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white" />
        </a>

        {/* Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping -z-10 pointer-events-none" />

        {/* Floating Mini Pill */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-dark text-white text-[11px] font-bold tracking-wide whitespace-nowrap shadow-glass-hover border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Instant Quote: +91 90688 88578</span>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppButton;
