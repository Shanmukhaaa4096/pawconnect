import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, Plus, LogOut, User as UserIcon, LayoutDashboard, LogIn, UserPlus, Home as HomeIcon, Gift, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { BAR_THEME, navFor, isNavActive } from './roleNav';

const DASH_LABEL = { adopter: 'My dashboard', owner: 'My rehoming desk', shelter: 'Shelter desk', admin: 'Control room' } as const;

/** Slide-in menu for phones. Same role colours and links as the top bar, plus account actions. */
export const MobileMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { totalCount } = useCart();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const closeRef = useRef<HTMLButtonElement>(null);

  const role = user?.role;
  const theme = BAR_THEME[role ?? 'guest'];
  const dark = theme.bg !== '#FCE8D0' && theme.bg !== '#FBE3A1';
  const isShopper = !user || role === 'adopter';

  // Close on navigation
  useEffect(() => { if (open) onClose(); /* eslint-disable-next-line */ }, [pathname, search]);

  // Esc, scroll lock, focus
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const items = navFor(role);
  const row = 'flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-[15px] font-extrabold transition';
  const rowStyle = (on: boolean): React.CSSProperties => ({
    background: on ? theme.activeBg : 'transparent',
    color: on ? theme.activeText : theme.text,
    borderColor: on ? '#4A2218' : 'transparent',
    boxShadow: on ? '2px 2px 0 #4A2218' : 'none',
  });
  const quiet = `${row} hover:bg-black/10`;

  return createPortal(
    <div className="md:hidden fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-[#3E1F1A]/55 backdrop-in" onClick={onClose} />

      <aside
        className="drawer-in absolute inset-y-0 left-0 w-[86%] max-w-sm flex flex-col border-r-2 border-[#4A2218] shadow-[6px_0_0_#4A2218] overflow-y-auto"
        style={{ background: theme.bg, color: theme.text }}
      >
        {/* Top: brand + close */}
        <div className="flex items-center justify-between px-4 h-16 shrink-0 border-b-2 border-[#4A2218]">
          <Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: 'none', color: theme.brand }}>
            <span className="w-10 h-10 rounded-full bg-[#C2572F] border-2 border-[#4A2218] shadow-[2px_2px_0_#4A2218] flex items-center justify-center text-lg -rotate-6">🐾</span>
            <span className="text-xl font-black" style={{ fontFamily: 'var(--font-serif)' }}>PawConnect</span>
          </Link>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full border-2 border-[#4A2218] bg-white text-[#4A2218] shadow-[2px_2px_0_#4A2218] flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Who */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-4">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-[#4A2218]" />
            ) : (
              <span className="w-12 h-12 rounded-2xl border-2 border-[#4A2218] bg-white text-[#4A2218] flex items-center justify-center font-black">
                {(user.name || '?').charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="font-black truncate" style={{ fontFamily: 'var(--font-serif)' }}>{user.name}</p>
              <p className="text-xs truncate opacity-80">{user.email}</p>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <div className="px-4 pt-2 space-y-2">
          {role === 'owner' && (
            <Link to="/dashboard?tab=desk&new=1" className="flex items-center justify-center gap-2 h-12 rounded-full border-2 border-[#4A2218] bg-[#C2572F] text-white font-extrabold shadow-[3px_3px_0_#4A2218] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
              <Plus className="w-5 h-5" /> List my pet
            </Link>
          )}
          {role === 'shelter' && (
            <Link to="/dashboard?tab=pets&new=1" className="flex items-center justify-center gap-2 h-12 rounded-full border-2 border-[#4A2218] bg-[#FCE8D0] text-[#8E3B22] font-extrabold shadow-[3px_3px_0_#4A2218] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
              <Plus className="w-5 h-5" /> List new pet
            </Link>
          )}
          {!user && (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" className="flex items-center justify-center gap-2 h-12 rounded-full border-2 border-[#4A2218] bg-white text-[#4A2218] font-extrabold shadow-[3px_3px_0_#4A2218]">
                <LogIn className="w-4 h-4" /> Log in
              </Link>
              <Link to="/register" className="flex items-center justify-center gap-2 h-12 rounded-full border-2 border-[#4A2218] bg-[#C2572F] text-white font-extrabold shadow-[3px_3px_0_#4A2218]">
                <UserPlus className="w-4 h-4" /> Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Main links */}
        <nav className="px-3 pt-5 space-y-1.5" aria-label="Main">
          {(role === 'adopter' || !role) && (
            <Link to="/" className={row} style={rowStyle(pathname === '/')}>
              <HomeIcon className="w-5 h-5" /> Home
            </Link>
          )}
          {items.map((it) => {
            const Icon = it.icon;
            const on = isNavActive(it, pathname, search);
            return (
              <Link key={it.to} to={it.to} aria-current={on ? 'page' : undefined} className={row} style={rowStyle(on)}>
                <Icon className="w-5 h-5" /> {it.label}
              </Link>
            );
          })}
        </nav>

        {/* Extras */}
        <div className="px-3 pt-4 mt-4 space-y-1.5 border-t-2 border-[#4A2218]/25">
          {isShopper && (
            <>
              <Link to={user ? '/favorites' : '/login'} className={quiet}>
                <Heart className="w-5 h-5" /> Saved pets
                {favorites.length > 0 && <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-[#C2572F] text-white text-[10px] font-black flex items-center justify-center">{favorites.length}</span>}
              </Link>
              <Link to="/shop" className={quiet}>
                <ShoppingBag className="w-5 h-5" /> Cart
                {totalCount > 0 && <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-[#C2572F] text-white text-[10px] font-black flex items-center justify-center">{totalCount}</span>}
              </Link>
            </>
          )}
          {!user && (
            <Link to="/register?role=owner" className={quiet}>
              <Gift className="w-5 h-5" /> Rehome a pet
            </Link>
          )}
          {(role === 'owner') && (
            <Link to="/shelters" className={quiet}>
              <Building2 className="w-5 h-5" /> Shelter directory
            </Link>
          )}
          {user && (
            <>
              {role === 'adopter' && (
                <Link to="/dashboard" className={quiet}>
                  <LayoutDashboard className="w-5 h-5" /> {DASH_LABEL[user.role]}
                </Link>
              )}
              <Link to="/profile" className={quiet}>
                <UserIcon className="w-5 h-5" /> Profile
              </Link>
            </>
          )}
        </div>

        {user && (
          <div className="px-3 py-4 mt-auto">
            <button
              onClick={() => {
                logout();
                onClose();
                navigate('/');
              }}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-full border-2 border-[#4A2218] bg-white text-[#B3261E] font-extrabold shadow-[3px_3px_0_#4A2218] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <LogOut className="w-5 h-5" /> Log out
            </button>
          </div>
        )}
        {!dark && <div className="h-4 shrink-0" />}
      </aside>
    </div>,
    document.body
  );
};
