import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { KawaiiPaw } from '../components/common/KawaiiIcons';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('adopter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [orgLicense, setOrgLicense] = useState('');
  const [orgDescription, setOrgDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 space-y-7">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-[#FFF6EC] border border-[#F8E2CA] flex items-center justify-center text-[#FF7E67] mx-auto shadow-sm">
          <KawaiiPaw className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-[#2B2523] tracking-tight">Create an Account</h1>
        <p className="text-sm text-[#7A6E68] font-medium">Join the warm PawConnect adoption community</p>
      </div>

      {/* Role Picker Card */}
      <div className="grid grid-cols-2 gap-3 bg-[#FAF7F2] p-2 rounded-2xl border border-[#EDE6DC]">
        <button
          type="button"
          onClick={() => setRole('adopter')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black transition-all ${
            role === 'adopter'
              ? 'bg-[#FF7E67] text-white shadow-md shadow-[#FF7E67]/20'
              : 'text-[#7A6E68] hover:text-[#2B2523] hover:bg-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>I Want to Adopt</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('shelter')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black transition-all ${
            role === 'shelter'
              ? 'bg-[#FF7E67] text-white shadow-md shadow-[#FF7E67]/20'
              : 'text-[#7A6E68] hover:text-[#2B2523] hover:bg-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Shelter / Rescue NGO</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE6DC] shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFF2EE] border border-[#FCD7CE] text-[#FF7E67] text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
              {role === 'shelter' ? 'Organization or Shelter Name *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'shelter' ? 'e.g. Haven Animal Rescue' : 'e.g. Sarah Jenkins'}
              className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Austin"
                className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="TX"
                className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
              />
            </div>
          </div>

          {/* Extra fields for Shelter / NGO */}
          {role === 'shelter' && (
            <div className="space-y-4 pt-2 border-t border-[#EDE6DC]">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
                  501(c)(3) or Rescue License Number
                </label>
                <input
                  type="text"
                  value={orgLicense}
                  onChange={(e) => setOrgLicense(e.target.value)}
                  placeholder="e.g. TX-SHELTER-49210"
                  className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#2B2523] mb-1.5">
                  Organization Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  placeholder="Briefly describe your animal rescue program and shelter facility..."
                  className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#EDE6DC] rounded-2xl text-[#2B2523] font-medium placeholder-[#A49B95] focus:outline-none focus:border-[#FF7E67]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FF7E67] hover:bg-[#F26B53] text-white font-black text-sm transition-all shadow-md shadow-[#FF7E67]/20 disabled:opacity-50 active:scale-98"
          >
            {loading ? 'Creating Account...' : 'Complete Registration 🐾'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#7A6E68] font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-black text-[#FF7E67] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

