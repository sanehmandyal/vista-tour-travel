import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users, Heart, Mountain, Sparkles, Coffee, Users2 } from 'lucide-react';

export const Experiences = () => {
  const experiences = [
    {
      title: 'Family Trips',
      category: 'Family Trips',
      count: '15+ Packages',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
      icon: Users,
      description: 'Comfortable family-friendly stays, private vehicles, and kid-approved itineraries.'
    },
    {
      title: 'Honeymoon Specials',
      category: 'Honeymoon',
      count: '12+ Packages',
      image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80',
      icon: Heart,
      description: 'Intimate candlelit dinners, lakeview balconies, flower decor, and scenic tranquility.'
    },
    {
      title: 'High Adventure',
      category: 'Adventure',
      count: '10+ Packages',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      icon: Mountain,
      description: 'Rohtang Pass expeditions, paragliding, river rafting, and high-altitude treks.'
    },
    {
      title: 'Weekend Getaways',
      category: 'Weekend Getaways',
      count: '8+ Packages',
      image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80',
      icon: Coffee,
      description: 'Quick 2 to 3 day rejuvenating road trips to Shimla, Kasauli, and Dharamshala.'
    },
    {
      title: 'Luxury Stays',
      category: 'Luxury Travel',
      count: '6+ Packages',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      icon: Sparkles,
      description: '5-star heritage palaces, private houseboats, and exclusive mountain chalets.'
    },
    {
      title: 'Group & Corporate Tours',
      category: 'Group Tours',
      count: '14+ Packages',
      image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=600&q=80',
      icon: Users2,
      description: 'Tempo Travellers and luxury coaches for college unions, friends, and corporate offsites.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full mb-3">
            <Compass className="w-3.5 h-3.5" /> Curated Vacation Types
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Travel Experiences
          </h2>
          <p className="text-slate-500 mt-2 text-base">
            Choose your journey style — tailored for couples, thrill-seekers, families, and corporate groups.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <Link
                key={idx}
                to={`/packages?category=${encodeURIComponent(exp.category)}`}
                className="group relative rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 h-72 flex flex-col justify-end p-6 border border-slate-100 hover:-translate-y-1"
              >
                {/* Image */}
                <img
                  src={exp.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
                  alt={exp.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-900/50 to-transparent" />

                {/* Badge */}
                <div className="relative z-10 flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-brand-200 bg-navy-900/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                    {exp.count}
                  </span>
                </div>

                {/* Text */}
                <div className="relative z-10 text-white">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {exp.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
