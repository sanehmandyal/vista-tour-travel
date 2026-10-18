import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setErrorMessage('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMessage(result.message || 'Login failed. Only authorized administrators can access this portal.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-16 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-slate-100">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <img
              src="/logo.jpg"
              alt="Vista Tour and Travels"
              className="w-12 h-12 rounded-2xl object-contain shadow-md bg-white border border-slate-100"
            />
            <div className="text-left">
              <span className="text-xl font-black text-navy-900 block leading-tight">
                Vista <span className="text-brand-600">Travels</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Tours & Luxury Cabs
              </span>
            </div>
          </Link>
          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Admin Portal Access Only
          </div>
          <h1 className="text-2xl font-black text-navy-900">Administrator Sign In</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in with authorized credentials to manage bookings, cabs, tour packages, inquiries, and website settings.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter admin email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full py-3 mt-2 font-bold text-sm shadow-md"
          >
            Sign In to Admin Panel <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
