import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Package,
  CalendarCheck,
  Users,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Briefcase,
  Settings,
  User,
  LogOut,
  Compass,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Car,
  Star,
  Layers
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Travel Catalog',
      items: [
        { name: 'Destinations', path: '/admin/destinations', icon: MapPin },
        { name: 'Tour Packages', path: '/admin/packages', icon: Package },
        { name: 'Car Fleet & Vehicles', path: '/admin/cars', icon: Car },
        { name: 'Taxi Services', path: '/admin/services', icon: Briefcase }
      ]
    },
    {
      group: 'Operations',
      items: [
        { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
        { name: 'Inquiries & Leads', path: '/admin/inquiries', icon: MessageSquare },
        { name: 'Users', path: '/admin/users', icon: Users }
      ]
    },
    {
      group: 'Content & Media',
      items: [
        { name: 'Pages & CMS', path: '/admin/pages', icon: Layers },
        { name: 'Traveler Reviews', path: '/admin/reviews', icon: Star },
        { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle }
      ]
    },
    {
      group: 'Administration',
      items: [
        { name: 'Website Settings', path: '/admin/settings', icon: Settings },
        { name: 'Admin Profile', path: '/admin/profile', icon: User }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 shrink-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Bar */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Vista Tour and Travels"
              className="w-9 h-9 rounded-full object-cover shadow-sm border border-amber-400/30 shrink-0"
            />
            <div>
              <span className="text-base font-black tracking-tight text-navy-900">
                Vista <span className="text-brand-600">Admin</span>
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links - Hidden scrollbar with smooth scrolling */}
        <div className="flex-1 py-4 px-4 space-y-5 overflow-y-auto no-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-brand-50 text-brand-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User Bar */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50 shrink-0">
          <div className="flex items-center justify-between px-2 py-1">
            <Link to="/admin/profile" className="flex items-center gap-2.5 truncate group">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'Admin'}
                  className="w-8 h-8 rounded-full object-cover border border-brand-300 group-hover:scale-105 transition-transform shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-sky-500 text-white text-xs font-black flex items-center justify-center shadow-sm shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'R'}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-navy-900 group-hover:text-brand-600 transition-colors truncate">{user?.name || 'Vista Admin'}</p>
                <p className="text-[10px] text-brand-600 capitalize font-medium">{user?.role || 'Superadmin'}</p>
              </div>
            </Link>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 lg:hidden hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-navy-900 font-bold capitalize">
                {location.pathname.split('/').pop().replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline font-medium">System Online</span>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
