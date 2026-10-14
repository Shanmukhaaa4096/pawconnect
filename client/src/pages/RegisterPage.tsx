import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Building2, User, Lock, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

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
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3E6E6] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#C96366] text-white flex items-center justify-center mx-auto shadow-md">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="7" cy="11" rx="3" ry="4" fill="currentColor" />
              <ellipse cx="13" cy="7" rx="3" ry="4.5" fill="currentColor" />
              <ellipse cx="19" cy="7" rx="3" ry="4.5" fill="currentColor" />
              <ellipse cx="25" cy="11" rx="3" ry="4" fill="currentColor" />
              <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#292323] tracking-tight mt-2">
            Create Your Account
          </h1>
          <p className="text-xs text-[#736363]">
            Join as an adopter or register your verified rescue organisation.
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-2xl border border-[#EAD2D3] shadow-xs">
          <button
            type="button"
            onClick={() => setRole('adopter')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              role === 'adopter'
                ? 'bg-[#C96366] text-white shadow'
                : 'text-[#736363] hover:text-[#C96366] hover:bg-[#FDEEEF]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>I Want to Adopt</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('shelter')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
              role === 'shelter'
                ? 'bg-[#C96366] text-white shadow'
                : 'text-[#736363] hover:text-[#C96366] hover:bg-[#FDEEEF]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Shelter / Rescue NGO</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAD2D3] shadow-xl space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-1">
                {role === 'shelter' ? 'Organization or Shelter Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'shelter' ? 'Haven Animal Rescue' : 'Sarah Jenkins'}
                className="w-full h-11 px-4 rounded-xl bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] focus:outline-none focus:border-[#C96366]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full h-11 px-4 rounded-xl bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] focus:outline-none focus:border-[#C96366]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-11 px-4 rounded-xl bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] focus:outline-none focus:border-[#C96366]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555)..."
                  className="w-full h-11 px-4 rounded-xl bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] focus:outline-none focus:border-[#C96366]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Austin"
                  className="w-full h-11 px-4 rounded-xl bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] focus:outline-none focus:border-[#C96366]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="TX"
                  className="w-full h-11 px-4 rounded-xl bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] focus:outline-none focus:border-[#C96366]"
                />
              </div>
            </div>

            {role === 'shelter' && (
              <div className="space-y-3 pt-2 border-t border-[#F4E4E4]">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-1">
                    License / 501(c)(3) NGO Number
                  </label>
                  <input
                    type="text"
                    value={orgLicense}
                    onChange={(e) => setOrgLicense(e.target.value)}
                    placeholder="e.g. TX-SHELTER-49210"
                    className="w-full h-11 px-4 rounded-xl bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] focus:outline-none focus:border-[#C96366]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-1">
                    Mission / Shelter Description
                  </label>
                  <textarea
                    rows={2}
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder="Tell adopters about your rescue efforts and facilities..."
                    className="w-full p-3 rounded-xl bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] focus:outline-none focus:border-[#C96366] resize-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#C96366] hover:bg-[#98494B] text-white font-black text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50 mt-2 cursor-pointer active:scale-98"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <p className="text-center text-xs text-[#736363] pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#C96366] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
