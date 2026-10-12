import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Building2, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

/* Shared editorial form label */
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#9BA097' }}>
    {children}
  </label>
);

export const LoginPage: React.FC = () => {
  const { login, demoLogin, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-14"
      style={{ background: '#F7F5EF' }}
    >
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <p className="section-label">Welcome back</p>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 600,
              fontSize: '2rem',
              color: '#252825',
              letterSpacing: '-0.02em',
            }}
          >
            Sign in to PawConnect
          </h1>
          <p className="text-sm" style={{ color: '#6B7068' }}>
            Continue your adoption journey.
          </p>
        </div>

        {/* Demo Panel */}
        <div
          className="rounded-lg border p-4 space-y-3"
          style={{ background: '#EAECE4', borderColor: '#DDE0D8' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6B7068' }}>
            Try a demo account
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'adopter' as UserRole, icon: <Heart className="w-3.5 h-3.5" />, label: 'Adopter',  sub: 'Sarah J.' },
              { role: 'shelter' as UserRole, icon: <Building2 className="w-3.5 h-3.5" />, label: 'Shelter',  sub: 'Haven Rescue' },
              { role: 'admin'   as UserRole, icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Admin',    sub: 'Moderator' },
            ].map(({ role, icon, label, sub }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemo(role)}
                className="flex flex-col items-center py-2.5 px-2 rounded border bg-white transition-all hover:border-[#263A32] text-center"
                style={{ borderColor: '#DDE0D8' }}
              >
                <span className="mb-1" style={{ color: '#263A32' }}>{icon}</span>
                <span className="text-xs font-medium" style={{ color: '#252825' }}>{label}</span>
                <span className="text-[10px]" style={{ color: '#9BA097' }}>{sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div
          className="rounded-lg border p-6 sm:p-8 space-y-5"
          style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
        >
          {error && (
            <div
              className="p-3.5 rounded text-sm flex items-start gap-2"
              style={{ background: 'rgba(200,121,90,0.08)', border: '1px solid rgba(200,121,90,0.25)', color: '#9B5A3A' }}
            >
              <span className="mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <FieldLabel>Email address</FieldLabel>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9BA097' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  id="login-email"
                  className="editorial-input pl-9"
                />
              </div>
            </div>

            <div>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9BA097' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  id="login-password"
                  className="editorial-input pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: '#9BA097' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium transition-colors" style={{ color: '#263A32' }}>
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
