import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users, Sparkles, Coffee, Users2, Landmark } from 'lucide-react';

export const Experiences = () => {
  const experiences = [
    {
      title: 'Mahabharata & Holy Tirthas',
      category: 'Spiritual Yatras',
      count: '8+ Packages',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=600',
      icon: Sparkles,
      description: 'Sacred darshan at Brahma Sarovar, Jyotisar Geeta Updesh Sthal, Sheikh Chilli Tomb & Pehowa.'
    },
    {
      title: 'Chandigarh City & Gardens',
      category: 'Weekend Getaways',
      count: '6+ Packages',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=600',
      icon: Compass,
      description: 'Nek Chand Rock Garden, Sukhna Lake sunset boating, and Rose Garden leisure tours.'
    },
    {
      title: 'GT Road Heritage & Food Trails',
      category: 'Heritage & History',
      count: '10+ Packages',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=600',
      icon: Landmark,
      description: 'Panipat historic battlegrounds, Kala Amb, iconic highway dhabas, and Karnal lake retreats.'
    },
    {
      title: 'Kalesar Wildlife & Riverfront',
      category: 'Weekend Getaways',
      count: '5+ Packages',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hathni_Kund_Barrage.jpg?width=600',
      icon: Coffee,
      description: 'Lush sal forest safaris at Kalesar National Park and Hathni Kund Yamuna riverfront retreats.'
    },
    {
      title: 'Delhi NCR Shopping & City Drops',
      category: 'Delhi NCR & Airport',
      count: '12+ Packages',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=600',
      icon: Users,
      description: 'Capital city monument tours, wholesale shopping, Aerocity hotel drops, and 24/7 IGI airport cabs.'
    },
    {
      title: 'Family & Wedding Chauffeur Fleet',
      category: 'Group Tours',
      count: '14+ Packages',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=600',
      icon: Users2,
      description: 'Innova Crysta, Ertiga, and luxury Tempo Travellers for joint family functions, weddings, and yatras.'
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
            Haryana & Regional Travel Experiences
          </h2>
          <p className="text-slate-500 mt-2 text-base">
            Curated journeys across Haryana, Delhi NCR, and Chandigarh — crafted for families, pilgrims, corporate groups, and travelers.
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
                  src={exp.image || 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=600'}
                  alt={exp.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=600';
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
