import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#9BA097' }}>
    {children}
  </label>
);

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole]                   = useState<UserRole>('adopter');
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [phone, setPhone]                 = useState('');
  const [city, setCity]                   = useState('');
  const [state, setState]                 = useState('');
  const [orgLicense, setOrgLicense]       = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        phone,
        location: { city, state },
        organization:
          role === 'shelter'
            ? {
                name,
                licenseNumber: orgLicense || 'PENDING-VERIFY',
                description: orgDescription,
                verified: true,
              }
            : undefined,
      });
      navigate(role === 'shelter' ? '/dashboard' : '/browse');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-14"
      style={{ background: '#F7F5EF' }}
    >
      <div className="w-full max-w-xl space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <p className="section-label">Join PawConnect</p>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 600,
              fontSize: '2rem',
              color: '#252825',
              letterSpacing: '-0.02em',
            }}
          >
            Create your account
          </h1>
          <p className="text-sm" style={{ color: '#6B7068' }}>
            Start your adoption journey or register your rescue organisation.
          </p>
        </div>

        {/* Role Picker */}
        <div
          className="grid grid-cols-2 gap-2 p-1.5 rounded-lg border"
          style={{ background: '#EAECE4', borderColor: '#DDE0D8' }}
        >
          <button
            type="button"
            onClick={() => setRole('adopter')}
            id="role-adopter"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-medium transition-all"
            style={{
              background:  role === 'adopter' ? '#263A32' : 'transparent',
              color:       role === 'adopter' ? '#F7F5EF' : '#6B7068',
            }}
          >
            <Heart className="w-4 h-4" style={{ fill: role === 'adopter' ? 'currentColor' : 'none' }} />
            I want to adopt
          </button>
          <button
            type="button"
            onClick={() => setRole('shelter')}
            id="role-shelter"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-medium transition-all"
            style={{
              background:  role === 'shelter' ? '#263A32' : 'transparent',
              color:       role === 'shelter' ? '#F7F5EF' : '#6B7068',
            }}
          >
            <Building2 className="w-4 h-4" />
            Shelter / Rescue NGO
          </button>
        </div>

        {/* Form Card */}
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

          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <FieldLabel>{role === 'shelter' ? 'Organisation or shelter name *' : 'Full name *'}</FieldLabel>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'shelter' ? 'e.g. Haven Animal Rescue' : 'e.g. Sarah Jenkins'}
                id="register-name"
                className="editorial-input"
              />
            </div>

            {/* Email + Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel>Email *</FieldLabel>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  id="register-email"
                  className="editorial-input"
                />
              </div>
              <div>
                <FieldLabel>Password *</FieldLabel>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  id="register-password"
                  className="editorial-input"
                />
              </div>
            </div>

            {/* Phone + City + State */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <FieldLabel>Phone</FieldLabel>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="editorial-input"
                />
              </div>
              <div>
                <FieldLabel>City</FieldLabel>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Austin"
                  className="editorial-input"
                />
              </div>
              <div>
                <FieldLabel>State</FieldLabel>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="TX"
                  className="editorial-input"
                />
              </div>
            </div>

            {/* Shelter-specific fields */}
            {role === 'shelter' && (
              <div className="space-y-4 pt-4 border-t" style={{ borderColor: '#E8EBE3' }}>
                <p className="text-xs font-medium" style={{ color: '#263A32' }}>
                  Shelter registration details
                </p>
                <div>
                  <FieldLabel>501(c)(3) or Rescue licence number</FieldLabel>
                  <input
                    type="text"
                    value={orgLicense}
                    onChange={(e) => setOrgLicense(e.target.value)}
                    placeholder="e.g. TX-SHELTER-49210"
                    className="editorial-input"
                  />
                </div>
                <div>
                  <FieldLabel>Organisation mission</FieldLabel>
                  <textarea
                    rows={2}
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder="Briefly describe your rescue programme…"
                    className="editorial-input"
                    style={{ height: 'auto', padding: '0.625rem 0.875rem', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="register-submit"
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: '#9BA097' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium transition-colors" style={{ color: '#263A32' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
