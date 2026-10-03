import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { UserRole } from '../../types';
import { KawaiiPaw, KawaiiSparkle } from './KawaiiIcons';

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
    <nav className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EDE6DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with Cute Japanese Startup Aesthetic */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-[#FF7E67] to-[#FFA78D] flex items-center justify-center text-white shadow-md shadow-[#FF7E67]/20 group-hover:scale-105 transition-transform duration-200">
              <KawaiiPaw size={24} fill="#FFFFFF" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-[#2B2523] leading-none">
                Paw<span className="text-[#FF7E67]">Connect</span>
              </span>
              <span className="text-[10px] font-bold text-[#8A7D73] tracking-wider uppercase mt-1 flex items-center gap-1">
                <span>Pet Adoption</span>
                <span className="text-[#FFB088]">•</span>
                <span className="text-[#A3978D]">ペットと家族</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <Link
              to="/browse"
              className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                isActive('/browse')
                  ? 'bg-[#FFEDE9] text-[#B8452F]'
                  : 'text-[#594E46] hover:text-[#2B2523] hover:bg-[#F2ECE3]'
              }`}
            >
              Find a Pet
            </Link>
            <Link
              to="/shelters"
              className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                isActive('/shelters')
                  ? 'bg-[#FFEDE9] text-[#B8452F]'
                  : 'text-[#594E46] hover:text-[#2B2523] hover:bg-[#F2ECE3]'
              }`}
            >
              Shelters & NGOs
            </Link>
            <Link
              to="/#how-it-works"
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold text-[#594E46] hover:text-[#2B2523] hover:bg-[#F2ECE3] transition-all"
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
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-2xl bg-[#FFF6EC] text-[#965B20] border border-[#FCE2C6] hover:bg-[#FDEBD8] transition-all"
              >
                <KawaiiSparkle size={13} fill="#E08B38" />
                <span>Demo Accounts</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-xl border border-[#EDE6DC] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                >
                  <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#9E9185]">
                    Switch Demo Persona
                  </p>
                  <button
                    onClick={() => handleDemo('adopter')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#423730] hover:bg-[#FFF0ED] hover:text-[#B54A34] text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#FFE4DE] text-[#B54A34] flex items-center justify-center font-extrabold text-xs">
                      A
                    </div>
                    <div>
                      <div className="font-extrabold text-[#2B2523]">Adopter Demo</div>
                      <div className="text-[10px] text-[#80746A]">Sarah Jenkins (Austin, TX)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemo('shelter')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#423730] hover:bg-[#EEF8F5] hover:text-[#1C6C57] text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#D6EFE7] text-[#1C6C57] flex items-center justify-center font-extrabold text-xs">
                      S
                    </div>
                    <div>
                      <div className="font-extrabold text-[#2B2523]">Shelter / NGO Demo</div>
                      <div className="text-[10px] text-[#80746A]">Haven Animal Rescue</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemo('admin')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#423730] hover:bg-[#F2F1FD] hover:text-[#4844B3] text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#DFDCFB] text-[#4844B3] flex items-center justify-center font-extrabold text-xs">
                      ★
                    </div>
                    <div>
                      <div className="font-extrabold text-[#2B2523]">Admin Demo</div>
                      <div className="text-[10px] text-[#80746A]">PawConnect Moderator</div>
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
                    className="relative p-2.5 rounded-2xl text-[#6E6359] hover:text-[#FF6584] hover:bg-[#FFF2F4] transition-colors"
                    title="My Favorites"
                  >
                    <Heart className="w-5 h-5" />
                    {favorites.length > 0 && (
                      <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-[#FF6584] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )}

                {/* Messages Link */}
                <Link
                  to="/messages"
                  className="relative p-2.5 rounded-2xl text-[#6E6359] hover:text-[#FF7E67] hover:bg-[#FFF0ED] transition-colors"
                  title="Messages & Inquiries"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Dashboard Shortcut */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold bg-[#F5EFEB] text-[#4A3F35] hover:bg-[#EDE5DA] transition-colors border border-[#E8DEC2]/60"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#FF7E67]" />
                  <span>Dashboard</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-[#EDE6DC] hover:border-[#FFB088] transition-colors bg-white shadow-xs"
                  >
                    <span className="text-xs font-bold text-[#2B2523] max-w-[100px] truncate hidden lg:inline">
                      {user.name}
                    </span>
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FF7E67]/20"
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-xl border border-[#EDE6DC] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="p-3 border-b border-[#F4EFE8] mb-1">
                        <p className="text-sm font-extrabold text-[#2B2523] leading-none">{user.name}</p>
                        <p className="text-xs text-[#80746A] mt-1 truncate">{user.email}</p>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-2 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF2EE] text-[#B54A34]">
                          {user.role === 'shelter' && <Building2 className="w-3 h-3" />}
                          {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {user.role === 'adopter' && <Heart className="w-3 h-3" />}
                          {user.role} Account
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#594E46] hover:bg-[#FAF7F2] hover:text-[#2B2523] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#8A7D73]" />
                        My Dashboard
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#594E46] hover:bg-[#FAF7F2] hover:text-[#2B2523] transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-[#8A7D73]" />
                        Messages
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#D6455D] hover:bg-[#FFF0F2] transition-colors text-left mt-1 border-t border-[#F4EFE8] pt-2"
                      >
                        <LogOut className="w-4 h-4" />
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
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-[#594E46] hover:text-[#2B2523] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-[#FF7E67] hover:bg-[#F26850] transition-all shadow-md shadow-[#FF7E67]/25"
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
              className="p-2 rounded-2xl text-[#594E46] hover:text-[#2B2523] hover:bg-[#F2ECE3] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EDE6DC] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-2xl text-sm font-bold text-[#2B2523] hover:bg-[#FFEDE9] hover:text-[#B8452F]"
            >
              Find a Pet
            </Link>
            <Link
              to="/shelters"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-2xl text-sm font-bold text-[#2B2523] hover:bg-[#FFEDE9] hover:text-[#B8452F]"
            >
              Shelters & NGOs
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-2xl text-sm font-bold text-[#2B2523] hover:bg-[#FFEDE9] hover:text-[#B8452F]"
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3.5 py-2.5 rounded-2xl text-sm font-bold text-[#2B2523] hover:bg-[#FFEDE9] hover:text-[#B8452F]"
                >
                  Messages
                </Link>
              </>
            )}
          </div>

          {/* Demo quick links on mobile */}
          <div className="pt-2 border-t border-[#EDE6DC]">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#9E9185] mb-2">
              Quick Demo Logins
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemo('adopter')}
                className="py-2 px-2 text-xs font-bold rounded-xl bg-[#FFF0ED] text-[#B54A34] text-center border border-[#FFE2DC]"
              >
                Adopter
              </button>
              <button
                onClick={() => handleDemo('shelter')}
                className="py-2 px-2 text-xs font-bold rounded-xl bg-[#EEF8F5] text-[#1C6C57] text-center border border-[#D1EFE6]"
              >
                Shelter
              </button>
              <button
                onClick={() => handleDemo('admin')}
                className="py-2 px-2 text-xs font-bold rounded-xl bg-[#F2F1FD] text-[#4844B3] text-center border border-[#DFDCFB]"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Mobile auth buttons */}
          <div className="pt-2 border-t border-[#EDE6DC] flex flex-col gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-xs font-bold text-[#D6455D] rounded-2xl bg-[#FFF0F2] border border-[#FDD5DC]"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-[#4A3F35] rounded-2xl bg-white border border-[#EDE6DC]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-[#FF7E67] rounded-2xl shadow-sm"
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
