import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home';
import Destinations from '../pages/Destinations';
import DestinationDetails from '../pages/DestinationDetails';
import Packages from '../pages/Packages';
import PackageDetails from '../pages/PackageDetails';
import Booking from '../pages/Booking';
import About from '../pages/About';
import Services from '../pages/Services';
import Blog from '../pages/Blog';
import BlogDetails from '../pages/BlogDetails';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Account from '../pages/Account';
import NotFound from '../pages/NotFound';

// Public Layout
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Admin Pages & Layout
import AdminProtectedRoute from '../admin/layout/AdminProtectedRoute';
import AdminLayout from '../admin/layout/AdminLayout';
import Dashboard from '../admin/pages/Dashboard';
import AdminDestinations from '../admin/pages/Destinations';
import DestinationForm from '../admin/pages/DestinationForm';
import AdminPackages from '../admin/pages/Packages';
import PackageForm from '../admin/pages/PackageForm';
import AdminBookings from '../admin/pages/Bookings';
import AdminUsers from '../admin/pages/Users';
import AdminBlogs from '../admin/pages/Blogs';
import BlogForm from '../admin/pages/BlogForm';
import AdminTestimonials from '../admin/pages/Testimonials';
import AdminInquiries from '../admin/pages/Inquiries';
import AdminFAQs from '../admin/pages/FAQs';
import AdminServices from '../admin/pages/Services';
import WebsiteSettings from '../admin/pages/WebsiteSettings';
import AdminProfile from '../admin/pages/AdminProfile';

// Layout wrapper for standard public website pages
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin Routes with strict protection */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="destinations/new" element={<DestinationForm />} />
        <Route path="destinations/:id/edit" element={<DestinationForm />} />

        <Route path="packages" element={<AdminPackages />} />
        <Route path="packages/new" element={<PackageForm />} />
        <Route path="packages/:id/edit" element={<PackageForm />} />

        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users" element={<AdminUsers />} />
        
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="blogs/new" element={<BlogForm />} />
        <Route path="blogs/:id/edit" element={<BlogForm />} />

        <Route path="gallery" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="reviews" element={<AdminTestimonials />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="faqs" element={<AdminFAQs />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="fleet" element={<AdminServices defaultTab="fleet" />} />
        <Route path="settings" element={<WebsiteSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Admin Login convenience alias */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* Public Routes wrapped in PublicLayout */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/destinations" element={<PublicLayout><Destinations /></PublicLayout>} />
      <Route path="/destinations/:slug" element={<PublicLayout><DestinationDetails /></PublicLayout>} />
      <Route path="/packages" element={<PublicLayout><Packages /></PublicLayout>} />
      <Route path="/packages/:slug" element={<PublicLayout><PackageDetails /></PublicLayout>} />
      <Route path="/booking/:packageId" element={<PublicLayout><Booking /></PublicLayout>} />
      
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/gallery" element={<Navigate to="/" replace />} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><BlogDetails /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/account" element={<Navigate to="/login" replace />} />
      <Route path="/account/bookings" element={<Navigate to="/login" replace />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
