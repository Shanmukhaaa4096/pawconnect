import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { KawaiiPaw, KawaiiSparkle } from '../components/common/KawaiiIcons';

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
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-7">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-[#FFF6EC] border border-[#F8E2CA] flex items-center justify-center text-[#FF7E67] mx-auto shadow-sm">
          <KawaiiPaw className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-[#2B2523] tracking-tight">Welcome Back</h1>
        <p className="text-sm text-[#7A6E68] font-medium">Sign in to your PawConnect sanctuary account</p>
      </div>

      {/* 1-Click Demo Login Panel */}
      <div className="bg-[#FFF6EC] rounded-3xl p-5 border border-[#F8E2CA] space-y-3 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <KawaiiSparkle className="w-4 h-4 text-[#FF7E67]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#965B20]">
            1-Click Instant Demo Login
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleDemo('adopter')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white text-[#2B2523] border border-[#EDE6DC] hover:border-[#FF7E67] hover:shadow-xs transition-all text-center active:scale-95"
          >
            <Heart className="w-4 h-4 text-[#FF7E67] mb-1 fill-[#FFF2EE]" />
            <span className="text-xs font-black leading-tight">Adopter</span>
            <span className="text-[10px] text-[#7A6E68] font-medium">Sarah J.</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('shelter')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white text-[#2B2523] border border-[#EDE6DC] hover:border-[#1C6C57] hover:shadow-xs transition-all text-center active:scale-95"
          >
            <Building2 className="w-4 h-4 text-[#1C6C57] mb-1" />
            <span className="text-xs font-black leading-tight">Shelter NGO</span>
            <span className="text-[10px] text-[#7A6E68] font-medium">Haven Rescue</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('admin')}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-white text-[#2B2523] border border-[#EDE6DC] hover:border-[#4844B3] hover:shadow-xs transition-all text-center active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-[#4844B3] mb-1" />
            <span className="text-xs font-black leading-tight">Admin</span>
            <span className="text-[10px] text-[#7A6E68] font-medium">Moderator</span>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE6DC] shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFF2EE] border border-[#FCD7CE] text-[#FF7E67] text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A49B95] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A49B95] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FF7E67] hover:bg-[#F26B53] text-white font-black text-sm transition-all shadow-md shadow-[#FF7E67]/20 disabled:opacity-50 active:scale-98"
          >
            {loading ? 'Signing in...' : 'Sign In 🐾'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#7A6E68] font-medium">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-black text-[#FF7E67] hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

