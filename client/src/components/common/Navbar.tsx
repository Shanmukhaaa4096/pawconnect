import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  PawPrint,
  Heart,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleDemo = async (role: UserRole) => {
    try {
      await demoLogin(role);
      setDemoDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate(role === 'shelter' ? '/dashboard' : role === 'admin' ? '/dashboard' : '/browse');
    } catch (err: any) {
      alert(`Demo login failed: ${err.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <PawPrint className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                Paw<span className="text-orange-600">Connect</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-600 tracking-wider uppercase mt-0.5">
                Pet Adoption & Welfare
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/browse"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/browse')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Find a Pet
            </Link>
            <Link
              to="/shelters"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/shelters')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Shelters & NGOs
            </Link>
            <Link
              to="/#how-it-works"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-orange-50 text-orange-700 border border-orange-200/80 hover:bg-orange-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                >
                  <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Switch Active Role
                  </p>
                  <button
                    onClick={() => handleDemo('adopter')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700 text-left transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      A
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Adopter Demo</div>
                      <div className="text-[10px] text-slate-600">Sarah Jenkins (NYC/Austin)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemo('shelter')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700 text-left transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      S
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Shelter / NGO Demo</div>
                      <div className="text-[10px] text-slate-600">Haven Animal Rescue</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemo('admin')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700 text-left transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      ★
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Admin Demo</div>
                      <div className="text-[10px] text-slate-600">PawConnect Moderator</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* Favorites Link for Adopters */}
                {user.role === 'adopter' && (
                  <Link
                    to="/dashboard?tab=favorites"
                    className="relative p-2.5 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition-colors"
                    title="My Favorites"
                  >
                    <Heart className="w-5 h-5" />
                    {favorites.length > 0 && (
                      <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )}

                {/* Messages Link */}
                <Link
                  to="/messages"
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-slate-100 transition-colors"
                  title="Messages & Inquiries"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Dashboard Shortcut */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-600" />
                  <span>Dashboard</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:border-orange-300 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden lg:inline">
                      {user.name}
                    </span>
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/20"
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="p-3 border-b border-slate-100 mb-1">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                        <p className="text-xs text-slate-600 mt-1 truncate">{user.email}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                          {user.role === 'shelter' && <Building2 className="w-3 h-3" />}
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {user.role === 'adopter' && <Heart className="w-3 h-3" />}
                          {user.role} Account
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        My Dashboard
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-500" />
                        Messages
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left mt-1 border-t border-slate-100 pt-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 transition-all shadow-md shadow-orange-600/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              Find a Pet
            </Link>
            <Link
              to="/shelters"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              Shelters & NGOs
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
                >
                  Messages
                </Link>
              </>
            )}
          </div>

          {/* Demo quick links on mobile */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Quick Demo Logins
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemo('adopter')}
                className="py-1.5 px-2 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 text-center"
              >
                Adopter
              </button>
              <button
                onClick={() => handleDemo('shelter')}
                className="py-1.5 px-2 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 text-center"
              >
                Shelter
              </button>
              <button
                onClick={() => handleDemo('admin')}
                className="py-1.5 px-2 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 text-center"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Mobile auth buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-sm font-bold text-rose-600 rounded-xl bg-rose-50"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-sm font-bold text-slate-700 rounded-xl border border-slate-300"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-sm font-bold text-white bg-orange-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
