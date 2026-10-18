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
  Compass,
  MapPin,
  CalendarCheck,
  BookOpen,
  HelpCircle,
  Info,
  Send
} from 'lucide-react';
import Button from '../common/Button';

export const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useWebsite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
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

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [location]);

  // Click outside listener for "More" dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary desktop links that fit comfortably without wrapping
  const primaryNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Taxi Service', path: '/services' },
    { name: 'Reviews', path: '/#reviews' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  // Secondary links placed inside "More" menu on desktop (empty as all links fit directly)
  const secondaryNavLinks = [];

  // All links for mobile drawer with icons
  const allMobileLinks = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Destinations', path: '/destinations', icon: MapPin },
    { name: 'Taxi & Cab Services', path: '/services', icon: Car },
    { name: 'Traveler Reviews', path: '/#reviews', icon: Star },
    { name: 'About Vista Travels', path: '/about', icon: Info },
    { name: 'FAQs', path: '/faq', icon: HelpCircle },
    { name: 'Contact & Inquiries', path: '/contact', icon: Send }
  ];

  return (
    <>
      {/* Top micro bar for phone, Google Reviews badge & Admin Panel */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-3 sm:px-6 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Phone & Area */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <a
              href={`tel:${settings.phone || '9876543210'}`}
              className="flex items-center gap-1.5 font-bold text-amber-400 hover:text-white transition-colors text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{settings.phone || '+91 98765 43210'}</span>
            </a>
            <span className="text-navy-700 hidden sm:inline">|</span>
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
              Tour Packages & Luxury Cabs • Mohali & Chandigarh (24/7 Helpline)
            </span>
          </div>

          {/* Google Reviews Badge + Admin CTA */}
          <div className="flex items-center gap-3">
            <a
              href={(settings.googleReviewsUrl && !settings.googleReviewsUrl.includes('Kangra')) ? settings.googleReviewsUrl : "https://www.google.com/maps?cid=2473238779693105097"}
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
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-slate-100 py-2.5'
            : 'bg-white border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2">
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
                Tours & Luxury Cabs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {primaryNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => {
                  const isLinkActive =
                    link.path === '/#reviews'
                      ? location.hash === '#reviews'
                      : link.path === '/'
                      ? location.pathname === '/' && !location.hash
                      : isActive;
                  return `px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                    isLinkActive
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`;
                }}
              >
                {link.name}
              </NavLink>
            ))}

            {/* Optional "More" Dropdown */}
            {secondaryNavLinks.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                    location.pathname === '/blog' || location.pathname === '/faq'
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {secondaryNavLinks.map((subLink) => {
                      const SubIcon = subLink.icon;
                      return (
                        <NavLink
                          key={subLink.name}
                          to={subLink.path}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={({ isActive }) =>
                            `flex items-start gap-2.5 p-2.5 rounded-xl transition-colors ${
                              isActive
                                ? 'bg-brand-50 text-brand-600'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-navy-900'
                            }`
                          }
                        >
                          <SubIcon className="w-4 h-4 mt-0.5 text-brand-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold leading-tight">{subLink.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{subLink.desc}</p>
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <a
              href={`tel:${settings.phone || '9876543210'}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-300 text-navy-900 text-xs font-bold transition-all whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span>Call: {settings.phone || '+91 98765 43210'}</span>
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
                Book Cab
              </Button>
            )}
          </div>

          {/* Mobile hamburger & Call icon */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
            <a
              href={`tel:${settings.phone || '9876543210'}`}
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

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 mt-2.5 shadow-xl animate-in slide-in-from-top duration-200 max-h-[80vh] overflow-y-auto no-scrollbar">
            {/* Direct quick-call banner on mobile */}
            <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 text-white flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] text-sky-100 font-semibold">24/7 Travel & Cab Helpline</p>
                <p className="text-sm font-extrabold">{settings.phone || '+91 98765 43210'}</p>
              </div>
              <a
                href={`tel:${settings.phone || '9876543210'}`}
                className="px-3 py-1.5 bg-white text-brand-600 rounded-xl font-bold text-xs shadow-sm"
              >
                Call Now
              </a>
            </div>

            <div className="flex flex-col gap-1 mb-4">
              {allMobileLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => {
                      const isLinkActive =
                        link.path === '/#reviews'
                          ? location.hash === '#reviews'
                          : link.path === '/'
                          ? location.pathname === '/' && !location.hash
                          : isActive;
                      return `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isLinkActive
                          ? 'bg-brand-50 text-brand-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`;
                    }}
                  >
                    <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Button
                variant="accent"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/contact');
                }}
                className="w-full font-bold text-xs py-2.5 justify-center shadow-sm"
              >
                Book Taxi / Tour Package
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
