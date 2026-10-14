import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, BadgeCheck, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { NotificationBell } from '../NotificationBell';
import { AccountMenu } from '../AccountMenu';
import { BAR_THEME } from '../roleNav';
import { Brand, MenuButton, useListerStats, serif } from './headerParts';

/** Shelters: a slim "desk" bar. The sidebar does the navigating, so the bar shows identity and shortcuts. */
export const ShelterHeader: React.FC<{ onMenu: () => void }> = ({ onMenu }) => {
  const theme = BAR_THEME.shelter;
  const { user } = useAuth();
  const stats = useListerStats(true);
  const verified = Boolean(user?.organization?.verified);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#4A2218]" style={{ background: theme.bg, color: theme.text }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <MenuButton onClick={onMenu} />
          <Brand theme={theme} showTag={false} />
          <span className="hidden md:block w-px h-6 bg-[#FCE8D0]/40" />
          <div className="hidden md:flex items-center gap-2 min-w-0">
            <span className="font-black truncate max-w-[14rem]" style={serif}>
              {user?.organization?.name || user?.name}
            </span>
            <span
              className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md border-2 border-[#4A2218] text-[10px] font-black uppercase tracking-wider"
              style={{ background: verified ? '#BFE3C0' : '#FBE3A1', color: verified ? '#14532D' : '#7A4B00' }}
            >
              {verified ? <BadgeCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {verified ? 'Verified' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-sm font-extrabold">
          <Link to="/dashboard?tab=applications" className="hidden sm:inline-flex items-center gap-1.5 hover:underline underline-offset-4">
            Requests
            {stats.pending > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#FCE8D0] text-[#8E3B22] text-[10px] font-black flex items-center justify-center">{stats.pending}</span>
            )}
          </Link>
          <Link to="/messages" className="hidden sm:inline hover:underline underline-offset-4">Messages</Link>
          {user?._id && (
            <Link to={`/shelters/${user._id}`} className="hidden lg:inline hover:underline underline-offset-4">Public page</Link>
          )}
          <NotificationBell />
          <Link
            to="/dashboard?tab=pets&new=1"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#4A2218] bg-[#FCE8D0] text-[#8E3B22] text-xs shadow-[2px_2px_0_#4A2218] hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition"
          >
            <Plus className="w-4 h-4" /> List new pet
          </Link>
          <AccountMenu theme={theme} />
        </div>
      </div>
    </header>
  );
};
