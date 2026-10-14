import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, AlertTriangle } from 'lucide-react';
import { NotificationBell } from '../NotificationBell';
import { AccountMenu } from '../AccountMenu';
import { BAR_THEME } from '../roleNav';
import { Brand, MenuButton, useAdminCounts } from './headerParts';

/** Admins: dark command bar. Find a person fast, see what needs attention. */
export const AdminHeader: React.FC<{ onMenu: () => void }> = ({ onMenu }) => {
  const theme = BAR_THEME.admin;
  const counts = useAdminCounts(true);
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/dashboard?tab=users${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#4A2218]" style={{ background: theme.bg, color: theme.text }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3 sm:gap-5">
        <MenuButton onClick={onMenu} />
        <Brand theme={theme} />

        <form onSubmit={submit} role="search" className="hidden md:block flex-1 max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a user by name or email…"
            aria-label="Find a user"
            className="w-full h-9 pl-10 pr-3 rounded-lg text-sm font-medium border-2 border-[#5A2A22] bg-[#4A2218] text-[#FCE8D0] placeholder-[#C9A58C] focus:outline-none focus:border-[#E8873F]"
          />
        </form>

        <div className="flex items-center gap-3 sm:gap-4 ml-auto text-sm font-extrabold">
          {counts.unverified > 0 && (
            <Link
              to="/dashboard?tab=shelters"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#E8873F] text-[#E8873F] text-xs hover:bg-[#E8873F] hover:text-[#3E1F1A] transition"
              title="Shelters waiting for verification"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{counts.unverified} shelter{counts.unverified > 1 ? 's' : ''} waiting</span>
              <span className="sm:hidden">{counts.unverified}</span>
            </Link>
          )}
          <Link to="/dashboard" className="hidden lg:inline hover:underline underline-offset-4">Desk</Link>
          <NotificationBell />
          <AccountMenu theme={theme} />
        </div>
      </div>
    </header>
  );
};
