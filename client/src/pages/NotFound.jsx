import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 shadow-soft">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <h1 className="text-6xl sm:text-7xl font-black text-navy-900 mb-2">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-navy-800 mb-3">Destination Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
        It looks like this trail wandered off the map! The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </Link>
        <Link to="/destinations">
          <Button variant="outline">
            Explore Destinations
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
