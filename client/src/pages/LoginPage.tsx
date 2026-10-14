import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Heart, Building2, ShieldCheck, PawPrint, Eye, EyeOff, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, lazyLogin, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lazyRole, setLazyRole] = useState<UserRole>('adopter');
  const [error, setError] = useState<string | null>(null);

  if (user) navigate('/dashboard');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLazyLogin = async (role: UserRole = lazyRole) => {
    setError(null);
    setLoading(true);
    try {
      await lazyLogin(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Lazy login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#C2572F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Screen 2 Mascot & Logo */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-white text-[#C2572F] flex items-center justify-center mx-auto border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] -rotate-6">
            <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="7" cy="11" rx="3" ry="4" fill="currentColor" />
              <ellipse cx="13" cy="7" rx="3" ry="4.5" fill="currentColor" />
              <ellipse cx="19" cy="7" rx="3" ry="4.5" fill="currentColor" />
              <ellipse cx="25" cy="11" rx="3" ry="4" fill="currentColor" />
              <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white tracking-wider uppercase mt-2">
            PawConnect
          </h2>
          <p className="text-xs text-white/80 font-medium">Welcome back! Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#4A2218] shadow-[8px_8px_0_#4A2218] space-y-5">
          <div className="border-b border-[#F3DCC0] pb-3 text-center">
            <h1 className="text-lg font-black text-[#3E1F1A]">Sign In & Quick Access</h1>
            <p className="text-xs text-[#8A5A48] mt-0.5 font-medium">Choose Lazy Login or enter credentials</p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          {/* ── ⚡ 1-CLICK LAZY LOGIN HERO BOX ── */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F5] via-[#FFF3E2] to-[#FCE8D0] border-2 border-[#EBC9A5] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#C2572F] font-black text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-[#C2572F]" />
                <span>Lazy Login</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C2572F] text-white">
                Instant 1-Click
              </span>
            </div>

            <p className="text-[11px] text-[#8A5A48] font-medium leading-relaxed">
              No password needed! Click below to jump straight into PawConnect.
            </p>

            {/* Role Persona Selector */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { role: 'adopter' as UserRole, label: 'Adopter', icon: '🐶' },
                { role: 'owner' as UserRole, label: 'Owner', icon: '🧡' },
                { role: 'shelter' as UserRole, label: 'Shelter', icon: '🏡' },
                { role: 'admin' as UserRole, label: 'Admin', icon: '🛡️' },
              ].map(({ role, label, icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setLazyRole(role)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition flex flex-col items-center gap-0.5 border cursor-pointer ${
                    lazyRole === role
                      ? 'bg-[#C2572F] text-white border-[#C2572F] shadow-sm'
                      : 'bg-white/80 text-[#3E1F1A] border-[#EBC9A5] hover:bg-white'
                  }`}
                >
                  <span className="text-sm">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Instant Lazy Login Button */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleLazyLogin(lazyRole)}
              className="w-full h-11 rounded-full bg-gradient-to-r from-amber-500 via-[#C2572F] to-[#8E3B22] hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{loading ? 'Authenticating...' : `⚡ Lazy Login as ${lazyRole}`}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#F3DCC0] w-full" />
            <span className="bg-white px-2.5 text-[10px] font-black uppercase tracking-wider text-[#B99A86] absolute">
              or enter password
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B99A86]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adopter@pawconnect.org"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] placeholder-[#B99A86] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B99A86]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] placeholder-[#B99A86] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B99A86] hover:text-[#3E1F1A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-[#3E1F1A] hover:bg-[#3D3333] text-white font-black text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {loading ? 'Signing In...' : 'Log In With Password'}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-[#8A5A48]">
              Don't have an account?{' '}
              <Link to="/register" className="font-extrabold text-[#C2572F] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Disclaimer / footer */}
        <p className="text-[10px] text-center text-white/70 max-w-xs mx-auto leading-relaxed">
          By signing in you agree to PawConnect’s ethical rescue standards and pet welfare terms.
        </p>
      </div>
    </div>
  );
};
