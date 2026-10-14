import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  ChevronDown,
  Building2,
  ShoppingBag,
  MapPin,
  Sparkles,
  User as UserIcon,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDrawer }) => {
  const { user, logout, demoLogin, lazyLogin } = useAuth();
  const { favorites } = useFavorites();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [locationCity, setLocationCity] = useState('Austin, TX');
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const handleLazyLogin = async (role: UserRole = 'adopter') => {
    try {
      await lazyLogin(role);
      navigate(role === 'shelter' ? '/dashboard' : role === 'admin' ? '/dashboard' : '/browse');
    } catch (err: any) {
      alert(`Lazy login failed: ${err.message}`);
    }
  };

  const handleDemo = async (role: UserRole) => {
    try {
      await demoLogin(role);
      setDemoDropdownOpen(false);
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
    <>
      <header className="sticky top-0 z-30 bg-[#F3E6E6]/95 backdrop-blur-md border-b border-[#EAD2D3] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left: Mobile Hamburger OR Desktop Brand */}
            <div className="flex items-center gap-3">
              {/* Mobile Drawer Trigger (matches Screen 4 & 5) */}
              <button
                type="button"
                onClick={onOpenDrawer}
                className="md:hidden p-2 -ml-2 rounded-xl text-[#292323] hover:text-[#C96366] hover:bg-white/60 transition"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Brand Logo (coral styling) */}
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-2xl bg-[#C96366] flex items-center justify-center text-white shadow-md shadow-[#C96366]/25 group-hover:scale-105 transition">
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="7" cy="11" rx="3" ry="4" fill="currentColor" />
                    <ellipse cx="13" cy="7" rx="3" ry="4.5" fill="currentColor" />
                    <ellipse cx="19" cy="7" rx="3" ry="4.5" fill="currentColor" />
                    <ellipse cx="25" cy="11" rx="3" ry="4" fill="currentColor" />
                    <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg text-[#292323] tracking-tight leading-none">
                    Paw<span className="text-[#C96366]">Connect</span>
                  </span>
                  <span className="text-[10px] text-[#736363] font-bold tracking-wider uppercase hidden sm:block">
                    Pet Adoption & Supplies
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Location Pill (Reference Screen 4, 5, 8, 9) */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="flex flex-col items-center px-3 py-1 rounded-xl hover:bg-white/60 transition group cursor-pointer"
              title="Click to change location"
            >
              <span className="text-[10px] text-[#736363] font-bold uppercase tracking-wider">Location</span>
              <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#C96366] group-hover:text-[#98494B]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-none">{locationCity}</span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { to: '/browse', label: 'Adopt Pets' },
                { to: '/shop', label: 'Pet Shop' },
                { to: '/shelters', label: 'Shelters' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive(to)
                      ? 'bg-[#C96366] text-white shadow-sm'
                      : 'text-[#292323] hover:text-[#C96366] hover:bg-white/80'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right: Actions, Cart & User Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Favorites link */}
              <Link
                to="/favorites"
                className={`hidden md:flex items-center justify-center p-2 rounded-xl text-[#292323] hover:text-[#C96366] hover:bg-white/80 transition relative ${
                  isActive('/favorites') ? 'bg-white text-[#C96366]' : ''
                }`}
                title="Your saved favorites"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C96366] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Shop / Cart Icon */}
              <Link
                to="/shop"
                className="flex items-center justify-center p-2 rounded-xl text-[#292323] hover:text-[#C96366] hover:bg-white/80 transition relative"
                title="Pet Shop Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C96366] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalCount}
                  </span>
                )}
              </Link>

              {/* Demo Switcher */}
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-white border border-[#EAD2D3] text-[#736363] hover:text-[#C96366] transition shadow-xs"
                >
                  <span>Demo Switcher</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {demoDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EAD2D3] py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#A89898]">
                      Switch Role
                    </div>
                    <button
                      onClick={() => handleDemo('adopter')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#292323] hover:bg-[#FDEEEF] hover:text-[#C96366] transition"
                    >
                      🐶 Sarah Jenkins (Adopter)
                    </button>
                    <button
                      onClick={() => handleDemo('shelter')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#292323] hover:bg-[#FDEEEF] hover:text-[#C96366] transition"
                    >
                      🏡 Haven Rescue (Shelter)
                    </button>
                    <button
                      onClick={() => handleDemo('admin')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#292323] hover:bg-[#FDEEEF] hover:text-[#C96366] transition"
                    >
                      🛡️ Platform Admin
                    </button>
                  </div>
                )}
              </div>

              {/* User Avatar & Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-white/80 transition"
                  >
                    <div className="relative">
                      <img
                        src={
                          user.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#C96366]"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <span className="hidden sm:block text-xs font-bold text-[#292323] max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EAD2D3] py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-[#F4E4E4]">
                        <p className="text-xs font-extrabold text-[#292323] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#736363] truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded bg-[#FDEEEF] text-[#C96366]">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#292323] hover:bg-[#FDEEEF] hover:text-[#C96366]"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard & Applications</span>
                      </Link>
                      <Link
                        to="/messages"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#292323] hover:bg-[#FDEEEF] hover:text-[#C96366]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Messages</span>
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#292323] hover:bg-[#FDEEEF] hover:text-[#C96366]"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Saved Favourites</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border-t border-[#F4E4E4] mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleLazyLogin('adopter')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-black bg-gradient-to-r from-amber-500 to-[#C96366] hover:from-amber-600 hover:to-[#98494B] text-white rounded-full shadow hover:shadow-md transition cursor-pointer active:scale-95"
                    title="1-Click Instant Adopter Login"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>⚡ Lazy Login</span>
                  </button>
                  <Link
                    to="/login"
                    className="px-2.5 py-1.5 text-xs font-bold text-[#C96366] hover:bg-white/80 rounded-full transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-block px-3 py-1.5 text-xs font-bold bg-[#C96366] text-white rounded-full shadow hover:bg-[#98494B] transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#EAD2D3] animate-in zoom-in-95">
            <h3 className="font-extrabold text-lg text-[#292323] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C96366]" />
              Choose Your Location
            </h3>
            <p className="text-xs text-[#736363] mt-1">
              Select your region to find pets and fast local pet supplies delivery.
            </p>

            <div className="mt-4 space-y-2">
              {['Austin, TX', 'Seattle, WA', 'Denver, CO', 'Portland, OR', 'San Francisco, CA'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocationCity(loc);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    locationCity === loc
                      ? 'bg-[#C96366] text-white shadow'
                      : 'bg-[#F3E6E6] text-[#292323] hover:bg-[#EAD2D3]'
                  }`}
                >
                  <span>{loc}</span>
                  {locationCity === loc && <span className="text-[10px]">Selected</span>}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLocationModalOpen(false)}
              className="mt-5 w-full py-2.5 text-xs font-bold text-[#736363] hover:bg-gray-100 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
