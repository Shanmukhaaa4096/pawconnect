import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Search } from 'lucide-react';
import { useFavorites } from '../../../context/FavoritesContext';
import { useCart } from '../../../context/CartContext';
import { NotificationBell } from '../NotificationBell';
import { AccountMenu } from '../AccountMenu';
import { BAR_THEME } from '../roleNav';
import { Brand, MenuButton, CountBadge } from './headerParts';

const CHIPS: { label: string; to: string; species?: string }[] = [
  { label: 'All pets', to: '/browse' },
  { label: 'Dogs', to: '/browse?species=Dog', species: 'Dog' },
  { label: 'Cats', to: '/browse?species=Cat', species: 'Cat' },
  { label: 'Rabbits', to: '/browse?species=Rabbit', species: 'Rabbit' },
  { label: 'Birds', to: '/browse?species=Bird', species: 'Bird' },
  { label: 'Pet shop', to: '/shop' },
  { label: 'Shelters', to: '/shelters' },
  { label: 'Messages', to: '/messages' },
];

/** Adopters: discovery bar. Search first, category chips underneath. */
export const AdopterHeader: React.FC<{ onMenu: () => void }> = ({ onMenu }) => {
  const theme = BAR_THEME.adopter;
  const { favorites } = useFavorites();
  const { totalCount } = useCart();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse${term.trim() ? `?search=${encodeURIComponent(term.trim())}` : ''}`);
  };

  const params = new URLSearchParams(search);
  const activeChip = (c: (typeof CHIPS)[number]) => {
    const [path] = c.to.split('?');
    if (pathname !== path) return false;
    if (path !== '/browse') return true;
    return (params.get('species') || '') === (c.species || '');
  };

  const searchBox = (
    <form onSubmit={submit} role="search" className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C2572F]" />
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search a name or breed…"
        aria-label="Search pets"
        className="w-full h-11 pl-11 pr-24 rounded-full bg-white border-2 border-[#4A2218] shadow-[3px_3px_0_#4A2218] text-sm font-medium text-[#3E1F1A] placeholder-[#B99A86] focus:outline-none focus:shadow-[4px_4px_0_#C2572F]"
      />
      <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full bg-[#C2572F] border-2 border-[#4A2218] text-white text-xs font-extrabold">
        Search
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#4A2218] backdrop-blur" style={{ background: theme.bg, color: theme.text }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2">
        <div className="flex items-center gap-3 sm:gap-5">
          <MenuButton onClick={onMenu} />
          <Brand theme={theme} />
          <div className="hidden md:block flex-1 max-w-xl mx-auto">{searchBox}</div>
          <div className="flex items-center gap-3 sm:gap-4 ml-auto text-sm font-extrabold">
            <Link to="/favorites" title="Saved pets" className="relative p-1 hover:text-[#C2572F] transition">
              <Heart className="w-5 h-5" />
              <CountBadge n={favorites.length} />
            </Link>
            <Link to="/shop" title="Cart" className="relative p-1 hover:text-[#C2572F] transition">
              <ShoppingBag className="w-5 h-5" />
              <CountBadge n={totalCount} />
            </Link>
            <NotificationBell />
            <AccountMenu theme={theme} />
          </div>
        </div>

        {/* phones: search under the brand row */}
        <div className="md:hidden mt-2.5">{searchBox}</div>

        {/* desktop: category chips */}
        <nav className="hidden md:flex items-center gap-2 mt-2.5 overflow-x-auto pb-1" aria-label="Browse by">
          {CHIPS.map((c) => {
            const on = activeChip(c);
            return (
              <Link
                key={c.label}
                to={c.to}
                aria-current={on ? 'page' : undefined}
                className="shrink-0 px-3.5 py-1 rounded-full border-2 border-[#4A2218] text-xs font-extrabold transition hover:-translate-y-px"
                style={{
                  background: on ? theme.activeBg : '#FFFFFF',
                  color: on ? theme.activeText : theme.text,
                  boxShadow: on ? 'none' : '2px 2px 0 #4A2218',
                }}
              >
                {c.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
