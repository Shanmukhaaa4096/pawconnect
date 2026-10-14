import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useFavorites } from '../../../context/FavoritesContext';
import { useCart } from '../../../context/CartContext';
import { BAR_THEME, navFor, isNavActive } from '../roleNav';
import { Brand, MenuButton, CountBadge } from './headerParts';

/** Visitors: classic marketing bar. Brand left, links centre, join actions right. */
export const GuestHeader: React.FC<{ onMenu: () => void }> = ({ onMenu }) => {
  const theme = BAR_THEME.guest;
  const { favorites } = useFavorites();
  const { totalCount } = useCart();
  const { pathname, search } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#4A2218] backdrop-blur" style={{ background: theme.bg, color: theme.text }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <MenuButton onClick={onMenu} />
          <Brand theme={theme} />
        </div>

        <nav className="hidden md:flex items-center gap-1.5 text-sm font-extrabold" aria-label="Main">
          {navFor().map((it) => {
            const on = isNavActive(it, pathname, search);
            return (
              <Link
                key={it.to}
                to={it.to}
                aria-current={on ? 'page' : undefined}
                className="px-3.5 py-1.5 rounded-full border-2 transition hover:bg-[#F8DDBF]"
                style={{ background: on ? theme.activeBg : undefined, color: on ? theme.activeText : theme.text, borderColor: on ? '#4A2218' : 'transparent' }}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4 text-sm font-extrabold">
          <Link to="/login" title="Favourites" className="relative p-1 hover:text-[#C2572F] transition">
            <Heart className="w-5 h-5" />
            <CountBadge n={favorites.length} />
          </Link>
          <Link to="/shop" title="Cart" className="relative p-1 hover:text-[#C2572F] transition">
            <ShoppingBag className="w-5 h-5" />
            <CountBadge n={totalCount} />
          </Link>
          <Link to="/register?role=owner" className="hidden lg:inline hover:text-[#C2572F] transition">Rehome a pet</Link>
          <Link to="/login" className="hover:text-[#C2572F] transition">Log in</Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-full bg-[#C2572F] border-2 border-[#4A2218] shadow-[2px_2px_0_#4A2218] hover:bg-[#B04A24] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-white transition text-xs"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};
