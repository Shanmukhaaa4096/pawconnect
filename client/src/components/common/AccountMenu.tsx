import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BarTheme } from './roleNav';

const DASH_LABEL = {
  adopter: 'My dashboard',
  owner: 'My rehoming desk',
  shelter: 'Shelter desk',
  admin: 'Control room',
} as const;

export const AccountMenu: React.FC<{ theme: BarTheme }> = ({ theme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
    };
  }, [open]);

  if (!user) return null;
  const initial = (user.name || '?').charAt(0).toUpperCase();

  const item = 'flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-[#3E1F1A] hover:bg-[#FFF3E2] transition w-full text-left';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border-2 border-[#4A2218] bg-white shadow-[2px_2px_0_#4A2218] hover:-translate-y-px transition"
      >
        {user.avatar ? (
          <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black" style={{ background: theme.bg, color: theme.text }}>
            {initial}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-[#4A2218] transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-64 bg-white border-2 border-[#4A2218] rounded-2xl shadow-[5px_5px_0_#4A2218] overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-[#F3DCC0]">
            <p className="font-black text-sm text-[#3E1F1A] truncate" style={{ fontFamily: 'var(--font-serif)' }}>{user.name}</p>
            <p className="text-xs text-[#8A5A48] truncate">{user.email}</p>
          </div>
          <Link to="/dashboard" role="menuitem" onClick={() => setOpen(false)} className={item}>
            <LayoutDashboard className="w-4 h-4 text-[#C2572F]" /> {DASH_LABEL[user.role]}
          </Link>
          <Link to="/profile" role="menuitem" onClick={() => setOpen(false)} className={item}>
            <UserIcon className="w-4 h-4 text-[#C2572F]" /> Profile
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
              navigate('/');
            }}
            className={`${item} border-t border-[#F3DCC0] text-[#B3261E]`}
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
};
