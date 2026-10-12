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
    <nav className="sticky top-0 z-40 editorial-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Paw icon — simple SVG in forest green */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <ellipse cx="7"  cy="11" rx="3"   ry="4"   fill="#263A32" />
              <ellipse cx="13" cy="7"  rx="3"   ry="4.5" fill="#263A32" />
              <ellipse cx="19" cy="7"  rx="3"   ry="4.5" fill="#263A32" />
              <ellipse cx="25" cy="11" rx="3"   ry="4"   fill="#263A32" />
              <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="#263A32"/>
            </svg>
            <span style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: '1.125rem', color: '#252825', letterSpacing: '-0.01em' }}>
              Paw<span style={{ color: '#263A32' }}>Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/browse', label: 'Find a Pet' },
              { to: '/shelters', label: 'Shelters' },
              { to: '/#how-it-works', label: 'How It Works' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3.5 py-2 rounded text-sm font-medium transition-colors duration-150 ${
                  isActive(to)
                    ? 'text-[#263A32] bg-[#EAECE4]'
                    : 'text-[#6B7068] hover:text-[#252825] hover:bg-[#EAECE4]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-[#DDE0D8] text-[#6B7068] hover:border-[#263A32] hover:text-[#252825] transition-colors bg-white"
              >
                <span>Demo</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 dropdown-panel p-1.5 z-50"
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                >
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#9BA097' }}>
                    Switch Demo Persona
                  </p>
                  {[
                    { role: 'adopter' as UserRole, label: 'Adopter Demo',      sub: 'Sarah Jenkins · Austin, TX' },
                    { role: 'shelter' as UserRole, label: 'Shelter / NGO',     sub: 'Haven Animal Rescue' },
                    { role: 'admin'   as UserRole, label: 'Admin Demo',        sub: 'PawConnect Moderator' },
                  ].map(({ role, label, sub }) => (
                    <button
                      key={role}
                      onClick={() => handleDemo(role)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-left transition-colors hover:bg-[#EAECE4]"
                      style={{ color: '#252825' }}
                    >
                      <span className="w-7 h-7 rounded flex items-center justify-center shrink-0 text-white text-xs font-semibold" style={{ background: '#263A32' }}>
                        {role[0].toUpperCase()}
                      </span>
                      <div>
                        <div className="font-medium text-[13px]">{label}</div>
                        <div className="text-[11px]" style={{ color: '#9BA097' }}>{sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                {user.role === 'adopter' && (
                  <Link
                    to="/dashboard?tab=favorites"
                    className="relative p-2 rounded text-[#6B7068] hover:text-[#263A32] hover:bg-[#EAECE4] transition-colors"
                    title="My Favourites"
                  >
                    <Heart className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
                    {favorites.length > 0 && (
                      <span className="absolute top-0.5 right-0.5 h-3.5 min-w-3.5 px-0.5 rounded-full bg-[#C8795A] text-white text-[8px] font-semibold flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )}

                <Link
                  to="/messages"
                  className="p-2 rounded text-[#6B7068] hover:text-[#263A32] hover:bg-[#EAECE4] transition-colors"
                  title="Messages"
                >
                  <MessageSquare style={{ width: '1.125rem', height: '1.125rem' }} />
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#DDE0D8] text-xs font-medium text-[#252825] hover:bg-[#EAECE4] transition-colors"
                >
                  <LayoutDashboard style={{ width: '0.875rem', height: '0.875rem' }} />
                  <span>Dashboard</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-[#DDE0D8] hover:border-[#263A32] transition-colors bg-white"
                  >
                    <span className="text-xs font-medium text-[#252825] max-w-[80px] truncate hidden lg:inline">
                      {user.name}
                    </span>
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 dropdown-panel p-1.5 z-50"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-3 py-2.5 border-b border-[#E8EBE3] mb-1">
                        <p className="text-sm font-semibold" style={{ color: '#252825' }}>{user.name}</p>
                        <p className="text-xs truncate mt-0.5" style={{ color: '#9BA097' }}>{user.email}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded text-[10px] font-medium bg-[#EAECE4] text-[#263A32]">
                          {user.role === 'shelter' && <Building2 className="w-3 h-3" />}
                          {user.role === 'admin'   && <ShieldCheck className="w-3 h-3" />}
                          {user.role === 'adopter' && <Heart className="w-3 h-3" />}
                          {user.role} account
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-[#6B7068] hover:bg-[#EAECE4] hover:text-[#252825] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        My Dashboard
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-[#6B7068] hover:bg-[#EAECE4] hover:text-[#252825] transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Messages
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-left transition-colors hover:bg-[#EAECE4] mt-1 border-t border-[#E8EBE3] pt-2"
                        style={{ color: '#C8795A' }}
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
                  className="px-4 py-2 text-sm font-medium text-[#6B7068] hover:text-[#252825] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-5"
                  style={{ textDecoration: 'none' }}
                >
                  Adopt a Pet
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-[#6B7068] hover:text-[#252825] hover:bg-[#EAECE4] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8EBE3] px-4 pt-3 pb-6 space-y-4 animate-fade-up" style={{ background: '#F7F5EF' }}>
          <div className="space-y-0.5">
            {[
              { to: '/browse',   label: 'Find a Pet' },
              { to: '/shelters', label: 'Shelters' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded text-sm font-medium text-[#252825] hover:bg-[#EAECE4] transition-colors"
              >
                {label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded text-sm font-medium text-[#252825] hover:bg-[#EAECE4] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded text-sm font-medium text-[#252825] hover:bg-[#EAECE4] transition-colors"
                >
                  Messages
                </Link>
              </>
            )}
          </div>

          {/* Mobile Demo */}
          <div className="pt-3 border-t border-[#E8EBE3]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9BA097] mb-2 px-1">
              Quick Demo
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'adopter' as UserRole, label: 'Adopter' },
                { role: 'shelter' as UserRole, label: 'Shelter' },
                { role: 'admin'   as UserRole, label: 'Admin' },
              ].map(({ role, label }) => (
                <button
                  key={role}
                  onClick={() => handleDemo(role)}
                  className="py-2 px-2 text-xs font-medium rounded border border-[#DDE0D8] text-center hover:bg-[#EAECE4] transition-colors"
                  style={{ color: '#263A32' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Auth */}
          <div className="pt-3 border-t border-[#E8EBE3]">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-sm font-medium rounded border border-[#DDE0D8] transition-colors hover:bg-[#EAECE4]"
                style={{ color: '#C8795A' }}
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-sm font-medium rounded border border-[#DDE0D8] text-[#252825] hover:bg-[#EAECE4] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-sm font-semibold text-white rounded transition-colors"
                  style={{ background: '#263A32' }}
                >
                  Adopt a Pet
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
