import React from 'react';
import { useAuth } from '../../context/AuthContext';

export type DashRole = 'adopter' | 'owner' | 'shelter' | 'admin';

export interface ShellNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface Theme {
  tag: string;
  side: string; // sidebar background
  sideText: string;
  muted: string;
  activeBg: string;
  activeText: string;
  chipBg: string;
  chipText: string;
  accent: string; // page-level accent (headline underline, etc.)
}

/** One identity per role so each dashboard feels like its own workspace. */
export const THEMES: Record<DashRole, Theme> = {
  adopter: {
    tag: 'Adopter',
    side: '#FFFFFF',
    sideText: '#3E1F1A',
    muted: '#8A5A48',
    activeBg: '#C2572F',
    activeText: '#FFFFFF',
    chipBg: '#F8DDBF',
    chipText: '#8E3B22',
    accent: '#C2572F',
  },
  owner: {
    tag: 'Pet owner',
    side: '#FBE3A1',
    sideText: '#4A2218',
    muted: '#6B4A2E',
    activeBg: '#4A2218',
    activeText: '#FBE3A1',
    chipBg: '#FFFFFF',
    chipText: '#4A2218',
    accent: '#B8860B',
  },
  shelter: {
    tag: 'Shelter',
    side: '#8E3B22',
    sideText: '#FCE8D0',
    muted: '#F0C9A8',
    activeBg: '#FCE8D0',
    activeText: '#8E3B22',
    chipBg: '#C2572F',
    chipText: '#FFFFFF',
    accent: '#8E3B22',
  },
  admin: {
    tag: 'Administrator',
    side: '#3E1F1A',
    sideText: '#FCE8D0',
    muted: '#C9A58C',
    activeBg: '#E8873F',
    activeText: '#3E1F1A',
    chipBg: '#4A2218',
    chipText: '#F8DDBF',
    accent: '#E8873F',
  },
};

interface ShellProps {
  role: DashRole;
  nav: ShellNavItem[];
  active: string;
  onChange: (id: string) => void;
  /** Big greeting at the top of the content column. */
  title: string;
  subtitle?: string;
  /** Right side of the heading row (buttons). */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<ShellProps> = ({ role, nav, active, onChange, title, subtitle, actions, children }) => {
  const { user } = useAuth();
  const t = THEMES[role];
  const initial = (user?.name || '?').charAt(0).toUpperCase();

  const NavButton: React.FC<{ item: ShellNavItem; compact?: boolean }> = ({ item, compact }) => {
    const on = item.id === active;
    return (
      <button
        type="button"
        onClick={() => onChange(item.id)}
        aria-current={on ? 'page' : undefined}
        className={`flex items-center gap-2.5 rounded-xl font-extrabold text-sm transition whitespace-nowrap border-2 ${
          compact ? 'px-3.5 py-2' : 'w-full px-3.5 py-2.5'
        }`}
        style={{
          background: on ? t.activeBg : 'transparent',
          color: on ? t.activeText : t.sideText,
          borderColor: on ? '#4A2218' : 'transparent',
          boxShadow: on ? '2px 2px 0 #4A2218' : 'none',
        }}
      >
        <span className="shrink-0">{item.icon}</span>
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge != null && item.badge > 0 && (
          <span
            className="min-w-5 h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center"
            style={{ background: on ? t.activeText : '#C2572F', color: on ? t.activeBg : '#FFFFFF' }}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block sticky top-24 rounded-3xl border-2 p-4"
        style={{ background: t.side, borderColor: '#4A2218', boxShadow: '5px 5px 0 #4A2218', color: t.sideText }}
      >
        <div className="flex items-center gap-3 pb-4 mb-3 border-b" style={{ borderColor: `${t.sideText}22` }}>
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2" style={{ borderColor: '#4A2218' }} />
          ) : (
            <span
              className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-lg"
              style={{ borderColor: '#4A2218', background: t.chipBg, color: t.chipText }}
            >
              {initial}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-black text-sm truncate" style={{ fontFamily: 'var(--font-serif)' }}>
              {user?.name}
            </p>
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-[#4A2218]"
              style={{ background: t.chipBg, color: t.chipText }}
            >
              {t.tag}
            </span>
          </div>
        </div>
        <nav className="space-y-1.5" aria-label={`${t.tag} dashboard`}>
          {nav.map((n) => (
            <NavButton key={n.id} item={n} />
          ))}
        </nav>
      </aside>

      <div className="min-w-0 space-y-6">
        {/* Mobile nav */}
        <nav
          className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 rounded-2xl"
          aria-label={`${t.tag} dashboard`}
        >
          <div className="flex gap-2 p-2 rounded-2xl border-2" style={{ background: t.side, borderColor: '#4A2218' }}>
            {nav.map((n) => (
              <NavButton key={n.id} item={n} compact />
            ))}
          </div>
        </nav>

        {/* Heading */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight" style={{ fontFamily: 'var(--font-serif)', color: '#3E1F1A' }}>
              {title}
            </h1>
            {subtitle && <p className="text-sm font-medium mt-1" style={{ color: '#8A5A48' }}>{subtitle}</p>}
            <span className="block mt-2 h-1.5 w-16 rounded-full" style={{ background: t.accent }} />
          </div>
          {actions}
        </header>

        {children}
      </div>
    </div>
  );
};
