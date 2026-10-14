import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { api } from '../../../services/api';
import { getSocket } from '../../../services/socket';
import { BarTheme } from '../roleNav';

export const serif: React.CSSProperties = { fontFamily: 'var(--font-serif)' };

export const MenuButton: React.FC<{ onClick: () => void; open?: boolean }> = ({ onClick, open }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Open menu"
    aria-haspopup="dialog"
    aria-expanded={open}
    className="md:hidden w-10 h-10 rounded-xl border-2 border-[#4A2218] bg-white text-[#4A2218] shadow-[2px_2px_0_#4A2218] flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0"
  >
    <Menu className="w-5 h-5" />
  </button>
);

export const Brand: React.FC<{ theme: BarTheme; showTag?: boolean; wordmarkOnMobile?: boolean }> = ({
  theme,
  showTag = true,
  wordmarkOnMobile = false,
}) => (
  <div className="flex items-center gap-3 shrink-0">
    <Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }} aria-label="PawConnect home">
      <span className="w-10 h-10 rounded-full bg-[#C2572F] border-2 border-[#4A2218] shadow-[2px_2px_0_#4A2218] flex items-center justify-center text-lg -rotate-6 hover:rotate-6 transition-transform">
        🐾
      </span>
      <span className={`${wordmarkOnMobile ? 'inline' : 'hidden sm:inline'} text-xl font-black`} style={{ ...serif, color: theme.brand }}>
        PawConnect
      </span>
    </Link>
    {showTag && theme.tag && (
      <span
        className="hidden md:inline-block px-2 py-0.5 rounded-md border-2 border-[#4A2218] text-[10px] font-black uppercase tracking-widest -rotate-2"
        style={{ background: theme.activeBg, color: theme.activeText }}
      >
        {theme.tag}
      </span>
    )}
  </div>
);

export const CountBadge: React.FC<{ n: number }> = ({ n }) =>
  n > 0 ? (
    <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#C2572F] text-white text-[9px] font-black flex items-center justify-center border border-[#4A2218]">
      {n}
    </span>
  ) : null;

/** Live application counts for owners and shelters. Refreshes on socket events and every 30s. */
export const useListerStats = (enabled: boolean) => {
  const [stats, setStats] = useState({ pending: 0, approved: 0, completed: 0 });
  const load = useCallback(async () => {
    try {
      const { applications } = await api.getShelterApplications();
      setStats({
        pending: applications.filter((a) => a.status === 'Pending').length,
        approved: applications.filter((a) => a.status === 'Approved').length,
        completed: applications.filter((a) => a.status === 'Completed').length,
      });
    } catch {
      /* keep last numbers */
    }
  }, []);
  useEffect(() => {
    if (!enabled) return;
    load();
    const t = setInterval(load, 30000);
    const sock = getSocket();
    sock.on('notification', load);
    return () => {
      clearInterval(t);
      sock.off('notification', load);
    };
  }, [enabled, load]);
  return stats;
};

/** Admin attention counts. */
export const useAdminCounts = (enabled: boolean) => {
  const [counts, setCounts] = useState({ unverified: 0, suspended: 0 });
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const load = () =>
      api
        .getAdminUsers()
        .then((r) => {
          if (!alive) return;
          setCounts({
            unverified: r.users.filter((u) => u.role === 'shelter' && !u.organization?.verified).length,
            suspended: r.users.filter((u) => u.isSuspended).length,
          });
        })
        .catch(() => undefined);
    load();
    const t = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [enabled]);
  return counts;
};
