import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Lock, Mail, Sparkles, Building2, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect
  if (user) {
    navigate('/dashboard');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      navigate(role === 'shelter' ? '/dashboard' : '/browse');
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-8">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-600/20">
          <PawPrint className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-sm text-slate-500">Sign in to your PawConnect account</p>
      </div>

      {/* 1-Click Demo Login Panel */}
      <div className="bg-orange-50/80 rounded-3xl p-5 border border-orange-200/80 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
            One-Click Instant Demo Login
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemo('adopter')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white text-slate-800 border border-orange-200 hover:border-orange-500 hover:shadow-md transition-all text-center"
          >
            <Heart className="w-4 h-4 text-rose-500 mb-1" />
            <span className="text-xs font-bold leading-tight">Adopter</span>
            <span className="text-[10px] text-slate-400">Sarah J.</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('shelter')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white text-slate-800 border border-orange-200 hover:border-orange-500 hover:shadow-md transition-all text-center"
          >
            <Building2 className="w-4 h-4 text-emerald-600 mb-1" />
            <span className="text-xs font-bold leading-tight">Shelter NGO</span>
            <span className="text-[10px] text-slate-400">Haven Rescue</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('admin')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white text-slate-800 border border-orange-200 hover:border-orange-500 hover:shadow-md transition-all text-center"
          >
            <ShieldCheck className="w-4 h-4 text-purple-600 mb-1" />
            <span className="text-xs font-bold leading-tight">Admin</span>
            <span className="text-[10px] text-slate-400">Moderator</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all shadow-md shadow-orange-600/20 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-orange-600 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
