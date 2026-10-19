import React from 'react';
import { MapPin, PackageCheck, Sliders, CheckCircle2, PlaneTakeoff } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      icon: MapPin,
      title: 'Choose Destination',
      description: 'Explore scenic mountains, sandy shores, or heritage towns across India.'
    },
    {
      num: '02',
      icon: PackageCheck,
      title: 'Select Package',
      description: 'Pick from our all-inclusive family, honeymoon, or adventure packages.'
    },
    {
      num: '03',
      icon: Sliders,
      title: 'Customize Your Trip',
      description: 'Specify dates, guests, pickup point, and personal food or hotel preferences.'
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: 'Confirm Booking',
      description: 'Receive instant confirmation, booking reference ID, and trip coordinator details.'
    },
    {
      num: '05',
      icon: PlaneTakeoff,
      title: 'Enjoy Your Journey',
      description: 'Sit back in your dedicated sanitized cab and make lifelong memories!'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden border-b border-slate-100">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 border border-brand-200/60 px-3.5 py-1 rounded-full mb-3 inline-block shadow-xs">
            Seamless & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-500 mt-2 text-base">
            From initial dream to seamless departure, your vacation is sorted in five simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative glass-panel glass-panel-hover rounded-2xl p-6 border border-white/85 shadow-glass hover:shadow-glass-hover flex flex-col items-center text-center group"
              >
                {/* Step Number */}
                <span className="text-xs font-black text-brand-600 mb-2 tracking-wider">
                  STEP {step.num}
                </span>

                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-white/90 border border-white shadow-soft text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6 transition-colors" />
                </div>

                <h3 className="text-base font-bold text-navy-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
