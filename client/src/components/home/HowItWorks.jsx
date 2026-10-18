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
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full mb-3 inline-block">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:bg-brand-50/50 hover:border-brand-200 transition-all flex flex-col items-center text-center group"
              >
                {/* Step Number */}
                <span className="text-xs font-black text-brand-500 mb-2">
                  STEP {step.num}
                </span>

                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-white shadow-soft text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-navy-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
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
