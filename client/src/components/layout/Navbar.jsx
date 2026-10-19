import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebsite } from '../../context/WebsiteContext';
import {
  Car,
  Menu,
  X,
  Phone,
  LogOut,
  ShieldAlert,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Compass,
  MapPin,
  CalendarCheck,
  Package as PackageIcon,
  HelpCircle,
  Info,
  Send,
  MessageCircle,
  Sparkles,
  Plane,
  Trees,
  Heart,
  Users,
  Clock
} from 'lucide-react';
import Button from '../common/Button';

export const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useWebsite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({
    destinations: false,
    packages: false,
    services: false
  });

  const dropdownTimerRef = useRef(null);
  const navContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll listener for sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Click outside listener for desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (menu) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const toggleMobileSubmenu = (key) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Dropdown data definitions
  const destinationDropdownItems = [
    { name: 'Kurukshetra', desc: 'Brahma Sarovar, Jyotisar & Mahabharata heritage', path: '/destinations', icon: Star },
    { name: 'Ambala', desc: 'Historic Gurdwaras & Asia’s largest cloth market', path: '/destinations', icon: Compass },
    { name: 'Delhi & NCR', desc: 'Monuments, shopping & 24/7 IGI Airport cab drops', path: '/destinations', icon: Plane },
    { name: 'Karnal', desc: 'Karna Lake, heritage tower & Kalpana Chawla planetarium', path: '/destinations', icon: MapPin },
    { name: 'Panipat', desc: 'Historic battles, Kala Amb & weaver textile hub', path: '/destinations', icon: Sparkles },
    { name: 'Yamunanagar', desc: 'Kalesar National Park & Hathni Kund Barrage', path: '/destinations', icon: Trees },
    { name: 'Kaithal', desc: 'Hanuman birthplace, Anjani Tirth & historic forts', path: '/destinations', icon: Heart },
    { name: 'Chandigarh', desc: 'Rock Garden, Sukhna Lake & Elante luxury shopping', path: '/destinations', icon: Compass }
  ];

  const packagesDropdownItems = [
    { name: 'Kurukshetra Mahabharata Spiritual Tour', desc: 'Brahma Sarovar, Jyotisar & museum day tour', path: '/packages', icon: Star },
    { name: 'Haryana Golden Belt (Kurukshetra-Karnal-Panipat)', desc: '2D/1N historic battles & lake getaway', path: '/packages', icon: PackageIcon },
    { name: 'Chandigarh City & Sukhna Lake Tour', desc: '2D/1N weekend getaway with luxury cab', path: '/packages', icon: Sparkles },
    { name: 'Yamunanagar & Kalesar Wildlife Safari', desc: 'Nature, wildlife & Hathni Kund riverfront tour', path: '/packages', icon: Clock },
    { name: 'Delhi NCR Heritage & Shopping Tour', desc: 'Full-day door-to-door capital city excursion', path: '/packages', icon: Plane },
    { name: 'Haryana Shaktipeeth & Pehowa Darshan', desc: 'Divine 2D/1N family temple yatra', path: '/packages', icon: Users }
  ];

  const servicesDropdownItems = [
    { name: 'Outstation Cabs from Ladwa & Kurukshetra', desc: 'Doorstep pickup to Delhi, Chandigarh, Karnal & Ambala', path: '/services', icon: Car },
    { name: 'Delhi IGI & Chandigarh Airport Taxi', desc: 'Guaranteed 24/7 timely flight pickups with verified chauffeurs', path: '/services', icon: Plane },
    { name: 'Luxury Vehicle Fleet', desc: 'Innova Crysta, Ertiga, Dzire & Tempo Travellers', path: '/cars', icon: Sparkles },
    { name: 'Local & Wedding Cab Rentals', desc: 'Flexible hourly & day packages for events and business', path: '/services', icon: Clock }
  ];

  const cleanPhone = (settings.phone || '9068888578').replace(/[^0-9]/g, '');
  const cleanWa = (settings.whatsapp || '9068888578').replace(/[^0-9]/g, '');

  return (
    <>
      {/* Top micro bar for phone, Google Reviews badge & Admin Panel */}
      <div className="bg-navy-950/90 backdrop-blur-md text-slate-300 text-xs py-2 px-3 sm:px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Phone & Area */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 font-bold text-amber-400 hover:text-white transition-colors text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>+91 90688 88578</span>
            </a>
            <span className="text-navy-700 hidden sm:inline">|</span>
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
              Tour Packages & 24/7 Luxury Cabs • Nawarsi Bazar, Ladwa (Haryana)
            </span>
          </div>

          {/* Google Reviews Badge + WhatsApp + Admin CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href={`https://wa.me/91${cleanWa}?text=${encodeURIComponent('Hello Vista Tour and Travels! I would like to inquire about cabs / tour packages from Ladwa, Haryana.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors border border-emerald-400/30 shrink-0"
            >
              <MessageCircle className="w-3 h-3 fill-emerald-400 text-emerald-400 shrink-0" />
              <span>WhatsApp Inquiries</span>
            </a>

            <a
              href={settings.googleReviewsUrl || "https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors border border-amber-400/30 shrink-0"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <span>5.0 (50+ Google reviews)</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70 hidden xs:inline" />
            </a>

            {isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="bg-brand-600 hover:bg-brand-500 text-white px-2 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-sm shrink-0"
              >
                <ShieldAlert className="w-3 h-3 shrink-0" /> Admin
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-slate-400 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1 shrink-0"
              >
                <ShieldAlert className="w-3 h-3 text-brand-400 shrink-0" /> Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-navbar py-2.5 shadow-sm'
            : 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/60 shadow-xs py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2" ref={navContainerRef}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={settings.logo || "/logo.jpg"}
              alt="Vista Tour and Travels"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm border border-amber-400/30 group-hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-lg sm:text-xl font-black tracking-tight text-navy-900">
                  Vista <span className="text-brand-600">Travels</span>
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                Ladwa • Tours & Luxury Cabs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links with Interactive Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive && location.pathname === '/' && !location.hash
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>

            {/* 1. Destinations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('destinations')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'destinations' ? null : 'destinations')}
                className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                  location.pathname.startsWith('/destinations') || openDropdown === 'destinations'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <span>Destinations</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'destinations' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'destinations' && (
                <div className="absolute left-0 mt-2.5 w-[620px] max-w-[calc(100vw-2rem)] glass-dropdown rounded-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                  <div className="flex items-center justify-between px-2.5 pb-2 mb-2 border-b border-slate-100/90">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Haryana, Delhi NCR & Chandigarh Destinations
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200/60">
                      8 Major Hubs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {destinationDropdownItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gradient-to-r hover:from-brand-50/90 hover:to-sky-50/60 text-slate-700 hover:text-navy-900 transition-all group border border-transparent hover:border-brand-200/50"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100/90 border border-slate-200/60 group-hover:bg-brand-600 group-hover:border-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-all">
                            <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight text-navy-900 group-hover:text-brand-700 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100/90 px-3 flex items-center justify-between bg-slate-50/60 -mx-3.5 -mb-3.5 p-2.5 rounded-b-2xl">
                    <span className="text-[11px] text-slate-500 font-medium">All tours include sanitized AC cabs with verified local drivers</span>
                    <Link
                      to="/destinations"
                      onClick={() => setOpenDropdown(null)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group shrink-0"
                    >
                      <span>Explore All Destinations</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Tour Packages Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('packages')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'packages' ? null : 'packages')}
                className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                  location.pathname.startsWith('/packages') || openDropdown === 'packages'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <span>Tour Packages</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'packages' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'packages' && (
                <div className="absolute -left-28 mt-2.5 w-[640px] max-w-[calc(100vw-2rem)] glass-dropdown rounded-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                  <div className="flex items-center justify-between px-2.5 pb-2 mb-2 border-b border-slate-100/90">
                    <div className="flex items-center gap-1.5">
                      <PackageIcon className="w-3.5 h-3.5 text-brand-600" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        Curated Holiday & Spiritual Itineraries
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      Custom Quotes
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {packagesDropdownItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gradient-to-r hover:from-brand-50/90 hover:to-sky-50/60 text-slate-700 hover:text-navy-900 transition-all group border border-transparent hover:border-brand-200/50"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100/90 border border-slate-200/60 group-hover:bg-brand-600 group-hover:border-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-all">
                            <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight text-navy-900 group-hover:text-brand-700 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100/90 px-3 flex items-center justify-between bg-slate-50/60 -mx-3.5 -mb-3.5 p-2.5 rounded-b-2xl">
                    <span className="text-[11px] text-slate-500 font-medium">Customizable group & family packages from Ladwa & Kurukshetra</span>
                    <Link
                      to="/packages"
                      onClick={() => setOpenDropdown(null)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group shrink-0"
                    >
                      <span>View All Tour Packages</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Taxi & Cab Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setOpenDropdown(openDropdown === 'services' ? null : 'services')}
                className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                  location.pathname.startsWith('/services') || location.pathname.startsWith('/cars') || openDropdown === 'services'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                <span>Taxi Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'services' && (
                <div className="absolute -left-44 mt-2.5 w-[580px] max-w-[calc(100vw-2rem)] glass-dropdown rounded-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                  <div className="flex items-center justify-between px-2.5 pb-2 mb-2 border-b border-slate-100/90">
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-brand-600" />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                        24/7 Chauffeur Cabs & Verified Fleet
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                      Instant Booking
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {servicesDropdownItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gradient-to-r hover:from-brand-50/90 hover:to-sky-50/60 text-slate-700 hover:text-navy-900 transition-all group border border-transparent hover:border-brand-200/50"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100/90 border border-slate-200/60 group-hover:bg-brand-600 group-hover:border-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs transition-all">
                            <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight text-navy-900 group-hover:text-brand-700 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100/90 px-3 flex items-center justify-between bg-slate-50/60 -mx-3.5 -mb-3.5 p-2.5 rounded-b-2xl">
                    <Link
                      to="/cars"
                      onClick={() => setOpenDropdown(null)}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group py-0.5"
                    >
                      <span>View Cab Fleet (Innova, Ertiga, Dzire)</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                      to="/services"
                      onClick={() => setOpenDropdown(null)}
                      className="text-xs font-bold text-slate-600 hover:text-brand-700 flex items-center gap-1 group py-0.5"
                    >
                      <span>Taxi Rates & Services</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/#reviews"
              className={() =>
                `px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                  location.hash === '#reviews'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              Reviews
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Direct WhatsApp Pill */}
            <a
              href={`https://wa.me/91${cleanWa}?text=${encodeURIComponent('Hello Vista Tour & Travels! I want to inquire about a cab / holiday package.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all shadow-sm whitespace-nowrap"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>WhatsApp: 90688 88578</span>
            </a>

            {/* Direct Call Button */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-300 text-navy-900 text-xs font-bold transition-all whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>Call Now</span>
            </a>

            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button
                variant="accent"
                size="sm"
                onClick={() => navigate('/contact')}
                className="shadow-sm font-bold text-xs py-1.5 px-3.5 whitespace-nowrap"
              >
                Get Quote
              </Button>
            )}
          </div>

          {/* Mobile hamburger & Call icon */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/91${cleanWa}?text=${encodeURIComponent('Hello Vista Tour & Travels! I want to inquire about a cab / tour package.')}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200"
              aria-label="WhatsApp"
              title="WhatsApp Vista Travels"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-500" />
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200"
              aria-label="Call Now"
              title="Call Vista Tour and Travels"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown with Collapsible Accordions */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-dropdown border-b border-white/70 px-4 pt-3 pb-6 mt-2.5 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Direct quick-call & WhatsApp banner on mobile */}
            <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-brand-600 to-navy-900 text-white flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] text-sky-200 font-semibold">24/7 Helpline • Ladwa, Haryana</p>
                <p className="text-sm font-extrabold">+91 90688 88578</p>
              </div>
              <div className="flex gap-1.5">
                <a
                  href={`https://wa.me/91${cleanWa}?text=${encodeURIComponent('Hello Vista Travels! I need an instant tour/cab quote.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-2.5 py-1.5 bg-white text-navy-900 rounded-xl font-bold text-xs shadow-sm"
                >
                  Call
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-4">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Home</span>
              </NavLink>

              {/* Mobile Accordion: Destinations */}
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => toggleMobileSubmenu('destinations')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/70 text-sm font-bold text-navy-900"
                >
                  <span className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-600" /> Destinations
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileExpanded.destinations ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded.destinations && (
                  <div className="bg-white px-3 py-1 space-y-1">
                    {destinationDropdownItems.map(item => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-50"
                      >
                        • {item.name}
                      </Link>
                    ))}
                    <Link
                      to="/destinations"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-brand-600 border-t border-slate-100"
                    >
                      View All 8 Destinations →
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Accordion: Tour Packages */}
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => toggleMobileSubmenu('packages')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/70 text-sm font-bold text-navy-900"
                >
                  <span className="flex items-center gap-2.5">
                    <PackageIcon className="w-4 h-4 text-brand-600" /> Tour Packages
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileExpanded.packages ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded.packages && (
                  <div className="bg-white px-3 py-1 space-y-1">
                    {packagesDropdownItems.map(item => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-50"
                      >
                        • {item.name}
                      </Link>
                    ))}
                    <Link
                      to="/packages"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-brand-600 border-t border-slate-100"
                    >
                      View All Tour Packages →
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Accordion: Taxi & Cab Services */}
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => toggleMobileSubmenu('services')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/70 text-sm font-bold text-navy-900"
                >
                  <span className="flex items-center gap-2.5">
                    <Car className="w-4 h-4 text-brand-600" /> Taxi & Cab Services
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileExpanded.services ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpanded.services && (
                  <div className="bg-white px-3 py-1 space-y-1">
                    {servicesDropdownItems.map(item => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-50"
                      >
                        • {item.name}
                      </Link>
                    ))}
                    <Link
                      to="/cars"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-bold text-brand-600 border-t border-slate-100"
                    >
                      View All Cab Models & Rates →
                    </Link>
                  </div>
                )}
              </div>

              <NavLink
                to="/#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Star className="w-4 h-4 text-amber-500" />
                <span>Google Reviews (5.0 ★)</span>
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>About Vista Travels</span>
              </NavLink>

              <NavLink
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>FAQs</span>
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Send className="w-4 h-4 text-slate-400" />
                <span>Contact & Inquiries</span>
              </NavLink>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Button
                variant="accent"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/contact');
                }}
                className="w-full font-bold text-xs py-2.5 justify-center shadow-sm"
              >
                Get Custom Quote / Book Cab
              </Button>

              {isAdmin ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" /> Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-center py-2 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-brand-500" /> Admin Portal Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
