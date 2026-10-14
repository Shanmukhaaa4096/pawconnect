import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { NotificationBell } from '../NotificationBell';
import { AccountMenu } from '../AccountMenu';
import { BAR_THEME } from '../roleNav';
import { Brand, MenuButton, useListerStats } from './headerParts';

/** Owners: slim bar plus a live "status strip" showing where each applicant stands. */
export const OwnerHeader: React.FC<{ onMenu: () => void }> = ({ onMenu }) => {
  const theme = BAR_THEME.owner;
  const stats = useListerStats(true);
  const { pathname, search } = useLocation();
  const tab = new URLSearchParams(search).get('tab');
  const onDash = pathname === '/dashboard';

  const pills = [
    { label: 'new applicants', n: stats.pending, to: '/dashboard?tab=board', dot: '#C2572F', hot: stats.pending > 0 },
    { label: 'in handover', n: stats.approved, to: '/dashboard?tab=board', dot: '#2E7D32', hot: false },
    { label: 'rehomed', n: stats.completed, to: '/dashboard?tab=board', dot: '#4A2218', hot: false },
  ];

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#4A2218]" style={{ background: theme.bg, color: theme.text }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <MenuButton onClick={onMenu} />
          <Brand theme={theme} />
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-sm font-extrabold">
          <Link to="/messages" className="hidden sm:inline hover:underline underline-offset-4">Messages</Link>
          <Link to="/browse" className="hidden sm:inline hover:underline underline-offset-4">Browse</Link>
          <NotificationBell />
          <Link
            to="/dashboard?tab=desk&new=1"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#4A2218] bg-[#C2572F] text-white text-xs shadow-[2px_2px_0_#4A2218] hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition"
          >
            <Plus className="w-4 h-4" /> List my pet
          </Link>
          <AccountMenu theme={theme} />
        </div>
      </div>

      {/* Status strip */}
      <div className="border-t-2 border-[#4A2218]" style={{ background: '#F5D56E' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-2 overflow-x-auto">
          <Link
            to="/dashboard?tab=desk"
            className="shrink-0 px-3 py-1 rounded-full text-xs font-extrabold border-2 border-[#4A2218]"
            style={{ background: onDash && (tab === 'desk' || !tab) ? '#4A2218' : '#FFFFFF', color: onDash && (tab === 'desk' || !tab) ? '#FBE3A1' : '#4A2218' }}
          >
            My pets
          </Link>
          <span className="shrink-0 w-px h-5 bg-[#4A2218]/30" />
          {pills.map((p) => (
            <Link
              key={p.label}
              to={p.to}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border-2 border-[#4A2218] bg-white hover:-translate-y-px transition"
              style={{ color: '#4A2218' }}
            >
              <span className={`w-2 h-2 rounded-full ${p.hot ? 'animate-pulse' : ''}`} style={{ background: p.dot }} />
              <strong>{p.n}</strong> {p.label}
            </Link>
          ))}
          <Link to="/dashboard?tab=safety" className="shrink-0 ml-auto text-xs font-extrabold underline underline-offset-4" style={{ color: '#4A2218' }}>
            Safety guide
          </Link>
        </div>
      </div>
    </header>
  );
};
