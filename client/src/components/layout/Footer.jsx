import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../../context/WebsiteContext';
import { adminApi } from '../../services/adminApi';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  ShieldCheck,
  Star,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer = () => {
  const { settings } = useWebsite();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    try {
      setSubscribing(true);
      const res = await adminApi.subscribeNewsletter(newsletterEmail);
      if (res.success) {
        toast.success(res.message || 'Subscribed successfully!');
        setNewsletterEmail('');
      }
    } catch (err) {
      toast.error(err.message || 'Could not subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={settings.logo || "/logo.jpg"}
                alt="Vista Tour and Travels"
                className="w-12 h-12 rounded-full object-cover shadow-md border border-amber-400/40 shrink-0"
              />
              <div>
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Vista <span className="text-brand-400">Travels</span>
                </span>
                <span className="text-xs text-amber-400 font-semibold block -mt-1">
                  Himachal Tours & Luxury Cabs
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              <strong>Vista Tour and Travels</strong> is the top-rated 5.0★ Google verified tour agency and luxury cab service based in Nawarsi Bazar, Ladwa (Kurukshetra, Haryana). Offering reliable hill-tested cabs, experienced polite local chauffeurs, and customized holiday packages across Himachal and North India.
            </p>

            {/* Google Rating Showcase Box (Glassmorphism) */}
            <div className="p-3.5 rounded-2xl glass-dark border border-white/10 flex items-center justify-between gap-4 max-w-sm shadow-glass">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black text-sm">
                  5.0
                </div>
                <div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 font-bold mt-0.5">50+ Google reviews</p>
                </div>
              </div>
              <a
                href={(settings.googleReviewsUrl && !settings.googleReviewsUrl.includes('Kangra')) ? settings.googleReviewsUrl : "https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132"}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-brand-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                View on Google <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Govt. Approved Cabs
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-400" /> 12+ Years Trust
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.facebook && !settings.facebook.includes('rinku') ? settings.facebook : 'https://facebook.com/vistatourtravels'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:bg-navy-800 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.instagram && !settings.instagram.includes('rinku') ? settings.instagram : 'https://instagram.com/vistatourtravels'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:bg-navy-800 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.youtube && !settings.youtube.includes('rinku') ? settings.youtube : 'https://youtube.com/@vistatourtravels'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:bg-navy-800 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${(settings.whatsapp || '919068888578').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/destinations" className="hover:text-white transition-colors">Himachal & Hill Stations</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Luxury Cab Fleet</Link></li>
              <li><Link to="/#reviews" className="hover:text-white transition-colors text-brand-300 font-medium">★ Traveler Reviews</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Vista Travels</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Book Cab / Inquire</Link></li>
            </ul>
          </div>

          {/* Areas Served / Top Destinations */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Areas Served</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/destinations" className="hover:text-white transition-colors">Ladwa & Kurukshetra (Haryana)</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition-colors">Delhi NCR, Airport & Chandigarh</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition-colors">Kangra & Dharamshala</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition-colors">McLeodGanj & Bhagsunag</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition-colors">Bir Billing (Paragliding)</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition-colors">Dalhousie & Khajjiar</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition-colors">Manali & Shimla</Link></li>
            </ul>
          </div>

          {/* Contact & Google Details */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Contact Info</h4>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>{settings.address || 'Nawarsi Bazar, Ladwa, Haryana 136132, India'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone || '9068888578'}`} className="hover:text-white font-bold text-white transition-colors">
                  {settings.phone || '+91 90688 88578'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`mailto:${settings.email && !settings.email.includes('rinku') ? settings.email : 'info@vistatourtravels.com'}`} className="hover:text-white transition-colors">
                  {settings.email && !settings.email.includes('rinku') ? settings.email : 'info@vistatourtravels.com'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-1" />
                <span>{settings.businessHours || '24 Hours Open (7 Days a Week)'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Vista Tour and Travels. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/faq" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link to="/admin/login" className="text-slate-400 hover:text-white font-semibold flex items-center gap-1 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
