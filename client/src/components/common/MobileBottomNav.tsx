import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BAR_THEME, navFor, isNavActive, NavItem } from './roleNav';

/** Phone bottom bar. Same role colours and links as the top bar. */
export const MobileBottomNav: React.FC = () => {
  const { user } = useAuth();
  const { pathname, search } = useLocation();
  const role = user?.role;
  const theme = BAR_THEME[role ?? 'guest'];

  const base = navFor(role);
  const homeItem: NavItem = { to: '/', label: 'Home', short: 'Home', icon: Home };
  // Staff roles live in their dashboard; shoppers get a Home shortcut.
  const items = (role === 'adopter' || !role ? [homeItem, ...base].slice(0, 5) : base) as NavItem[];

  // Bar itself needs contrast on cream: use brand rust there.
  const bg = theme.bg === '#FCE8D0' ? '#C2572F' : theme.bg;
  const fg = theme.bg === '#FCE8D0' ? '#FFFFFF' : theme.text;

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 flex items-center justify-around border-t-2 border-[#4A2218] rounded-t-2xl px-2"
      style={{ background: bg, color: fg }}
    >
      {items.map((it) => {
        const on = it.to === '/' ? pathname === '/' : isNavActive(it, pathname, search);
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            aria-current={on ? 'page' : undefined}
            className="flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl transition min-w-14"
            style={{
              opacity: on ? 1 : 0.7,
              background: on ? 'rgba(0,0,0,0.18)' : 'transparent',
              fontWeight: on ? 800 : 600,
            }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{it.short}</span>
          </Link>
        );
      })}
    </nav>
  );
};
