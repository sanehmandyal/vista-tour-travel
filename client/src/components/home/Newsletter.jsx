import React, { useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await adminApi.subscribeNewsletter(email);
      if (res.success) {
        setSubscribed(true);
        toast.success(res.message || 'Subscribed successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-brand-600 text-white relative overflow-hidden">
      {/* Subtle background circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-navy-950/20 blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Get Secret Travel Discounts & Itineraries
        </h2>
        <p className="text-brand-100 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Join over 15,000+ wanderers receiving our curated weekend road trip maps and exclusive seasonal flash sales.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-bold px-6 py-3 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>You are subscribed! Welcome aboard.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-5 py-3.5 rounded-xl bg-white text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-medium shadow-md"
            />
            <Button
              type="submit"
              variant="accent"
              loading={loading}
              className="w-full sm:w-auto px-6 py-3.5 shadow-lg shrink-0"
            >
              <Send className="w-4 h-4 mr-1.5" /> Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
