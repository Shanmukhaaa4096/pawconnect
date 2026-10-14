import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Building2, User, Lock, Mail, MapPin, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role');
  const [role, setRole] = useState<UserRole>(
    initialRole === 'owner' || initialRole === 'shelter' ? initialRole : 'adopter'
  );
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
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCE8D0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#C2572F] text-white flex items-center justify-center mx-auto shadow-md">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="7" cy="11" rx="3" ry="4" fill="currentColor" />
              <ellipse cx="13" cy="7" rx="3" ry="4.5" fill="currentColor" />
              <ellipse cx="19" cy="7" rx="3" ry="4.5" fill="currentColor" />
              <ellipse cx="25" cy="11" rx="3" ry="4" fill="currentColor" />
              <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#3E1F1A] tracking-tight mt-2">
            Create Your Account
          </h1>
          <p className="text-xs text-[#8A5A48]">
            Adopt a friend, rehome your own pet, or register a rescue organisation.
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218]">
          {([
            { id: 'adopter', label: 'I want to adopt', icon: Heart },
            { id: 'owner', label: 'Rehome my pet', icon: Home },
            { id: 'shelter', label: 'Shelter / NGO', icon: Building2 },
          ] as { id: UserRole; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setRole(id)}
              aria-pressed={role === id}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-extrabold transition text-center ${
                role === id
                  ? 'bg-[#C2572F] text-white shadow'
                  : 'text-[#8A5A48] hover:text-[#C2572F] hover:bg-[#FFF3E2]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
        {role === 'owner' && (
          <p className="text-xs text-[#8A5A48] font-medium text-center -mt-2">
            Can no longer keep your pet? List them here, review applications, and choose a loving family.
          </p>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                {role === 'shelter' ? 'Organization or Shelter Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'shelter' ? 'Haven Animal Rescue' : 'Sarah Jenkins'}
                className="w-full h-11 px-4 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full h-11 px-4 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-11 px-4 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555)..."
                  className="w-full h-11 px-4 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Austin"
                  className="w-full h-11 px-4 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="TX"
                  className="w-full h-11 px-4 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
                />
              </div>
            </div>

            {role === 'shelter' && (
              <div className="space-y-3 pt-2 border-t border-[#F3DCC0]">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                    License / 501(c)(3) NGO Number
                  </label>
                  <input
                    type="text"
                    value={orgLicense}
                    onChange={(e) => setOrgLicense(e.target.value)}
                    placeholder="e.g. TX-SHELTER-49210"
                    className="w-full h-11 px-4 rounded-xl bg-[#FCE8D0]/60 border-2 border-[#4A2218]/70 text-xs font-medium text-[#3E1F1A] focus:outline-none focus:border-[#4A2218] focus:shadow-[3px_3px_0_#4A2218]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-[#B99A86] mb-1">
                    Mission / Shelter Description
                  </label>
                  <textarea
                    rows={2}
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder="Tell adopters about your rescue efforts and facilities..."
                    className="w-full p-3 rounded-xl bg-[#FCE8D0]/60 border border-[#EBC9A5] text-xs font-medium text-[#3E1F1A] focus:outline-none focus:border-[#C2572F] resize-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#C2572F] hover:bg-[#8E3B22] text-white font-black text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50 mt-2 cursor-pointer active:scale-98"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <p className="text-center text-xs text-[#8A5A48] pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#C2572F] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
