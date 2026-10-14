import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, MessageCircle, Star, Info } from 'lucide-react';
import { api } from '../../services/api';
import { getSocket } from '../../services/socket';
import { AppNotification } from '../../types';

const ICONS = { application: FileText, message: MessageCircle, review: Star, system: Info };

const ago = (iso: string) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.getNotifications();
      setItems(res.notifications);
      setUnread(res.unreadCount);
    } catch {
      /* offline or logged out: keep last state */
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    const socket = getSocket();
    socket.on('notification', load);
    return () => {
      clearInterval(timer);
      socket.off('notification', load);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openItem = async (n: AppNotification) => {
    setOpen(false);
    if (!n.read) {
      setItems((l) => l.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      setUnread((c) => Math.max(0, c - 1));
      api.markNotificationRead(n._id).catch(() => load());
    }
    if (n.link) navigate(n.link);
  };

  const readAll = async () => {
    setItems((l) => l.map((x) => ({ ...x, read: true })));
    setUnread(0);
    api.markAllNotificationsRead().catch(() => load());
  };

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative p-1 hover:text-[#C2572F] transition"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#C2572F] text-white text-[9px] font-black flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-white border-2 border-[#EBC9A5] rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3DCC0]">
            <span className="font-black text-sm text-[#3E1F1A]">Notifications</span>
            {unread > 0 && (
              <button onClick={readAll} className="text-xs font-extrabold text-[#C2572F] hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-[#8A5A48] font-medium">You are all caught up.</li>
            )}
            {items.map((n) => {
              const Icon = ICONS[n.type] || Info;
              return (
                <li key={n._id}>
                  <button
                    onClick={() => openItem(n)}
                    className="w-full text-left flex gap-3 px-4 py-3 hover:bg-[#FFF3E2] transition border-b border-[#F8DDBF] last:border-0"
                    style={{ background: n.read ? undefined : '#FFF8EE' }}
                  >
                    <span className="w-8 h-8 rounded-full bg-[#F8DDBF] text-[#C2572F] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${n.read ? 'font-bold' : 'font-black'} text-[#3E1F1A]`}>
                          {n.title}
                        </span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#C2572F] shrink-0" />}
                      </span>
                      {n.body && <span className="block text-xs text-[#8A5A48] line-clamp-2">{n.body}</span>}
                      <span className="block text-[10px] text-[#B99A86] mt-0.5">{ago(n.createdAt)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
