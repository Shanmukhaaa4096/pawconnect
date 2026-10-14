import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Building2, PawPrint, LayoutDashboard, Search, Trash2, BadgeCheck, Ban } from 'lucide-react';
import { api } from '../../services/api';
import { Pet, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { DashboardShell } from './DashboardShell';
import { useDashTab } from './useDashTab';

type Tab = 'overview' | 'users' | 'shelters' | 'listings';

interface Stats {
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  totalApplications: number;
  totalShelters: number;
  totalAdopters: number;
}

const Stat: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = '#8E3B22' }) => (
  <div className="rounded-2xl border-2 p-5 bg-white" style={{ borderColor: '#EBC9A5' }}>
    <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#B99A86' }}>{label}</span>
    <p className="text-3xl font-black mt-2" style={{ color, fontFamily: 'var(--font-serif)' }}>{value}</p>
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; tone?: 'ok' | 'warn' | 'bad' | 'neutral' }> = ({
  children,
  tone = 'neutral',
}) => {
  const c = {
    ok: ['#E6F4EA', '#137333'],
    warn: ['#FEF1DC', '#B06000'],
    bad: ['#FCE4E1', '#B3261E'],
    neutral: ['#F8DDBF', '#8E3B22'],
  }[tone];
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black" style={{ background: c[0], color: c[1] }}>
      {children}
    </span>
  );
};

const shelterName = (pet: Pet) =>
  typeof pet.shelter === 'object' && pet.shelter ? pet.shelter.organization?.name || pet.shelter.name : '—';

export const AdminDashboard: React.FC = () => {
  const { user: me } = useAuth();
  const [tab, setTab] = useDashTab<Tab>(['overview', 'users', 'shelters', 'listings'], 'overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  useEffect(() => { setQuery(searchParams.get('q') || ''); }, [searchParams]);
  const [roleFilter, setRoleFilter] = useState<'all' | 'adopter' | 'owner' | 'shelter' | 'admin'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [s, u, p] = await Promise.all([api.getPlatformStats(), api.getAdminUsers(), api.getPets()]);
        setStats(s.stats);
        setUsers(u.users || []);
        setPets(p.pets || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const shelters = useMemo(() => users.filter((u) => u.role === 'shelter'), [users]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === 'all' || u.role === roleFilter) &&
        (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  }, [users, query, roleFilter]);

  const toggleSuspend = async (u: User) => {
    const next = !u.isSuspended;
    if (next && !window.confirm(`Suspend ${u.name}? They will be signed out and cannot log in.`)) return;
    try {
      setBusyId(u._id);
      const res = await api.setUserSuspended(u._id, next);
      setUsers((list) => list.map((x) => (x._id === u._id ? { ...x, ...res.user } : x)));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const toggleVerify = async (u: User) => {
    try {
      setBusyId(u._id);
      const res = await api.verifyShelter(u._id, !u.organization?.verified);
      setUsers((list) => list.map((x) => (x._id === u._id ? { ...x, ...res.shelter } : x)));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const removePet = async (pet: Pet) => {
    if (!window.confirm(`Remove listing "${pet.name}"? This cannot be undone.`)) return;
    try {
      setBusyId(pet._id);
      await api.deletePet(pet._id);
      setPets((list) => list.filter((p) => p._id !== pet._id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <LoadingSpinner label="Loading admin portal..." />;

  const th = 'px-4 py-3 text-[10px] font-black uppercase tracking-widest';
  const td = 'px-4 py-3 text-sm';

  const unverified = shelters.filter((x) => !x.organization?.verified);
  const suspended = users.filter((u) => u.isSuspended);

  return (
    <DashboardShell
      role="admin"
      active={tab}
      onChange={(id) => setTab(id as Tab)}
      title="Control room"
      subtitle="People, shelters and listings across PawConnect."
      nav={[
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, badge: unverified.length },
        { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
        { id: 'shelters', label: 'Shelters', icon: <Building2 className="w-4 h-4" />, badge: unverified.length },
        { id: 'listings', label: 'Listings', icon: <PawPrint className="w-4 h-4" /> },
      ]}
    >
      {error && (
        <div className="rounded-xl border-2 border-[#F5C2BD] bg-[#FCE4E1] text-[#B3261E] text-sm font-bold p-3">{error}</div>
      )}

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Stat label="Total pets" value={stats?.totalPets || 0} />
          <Stat label="Available" value={stats?.availablePets || 0} color="#C2572F" />
          <Stat label="Adopted" value={stats?.adoptedPets || 0} />
          <Stat label="Applications" value={stats?.totalApplications || 0} color="#C2572F" />
          <Stat label="Shelters" value={stats?.totalShelters || 0} />
          <Stat label="Adopters" value={stats?.totalAdopters || 0} color="#C2572F" />

          <section
            className="col-span-2 lg:col-span-3 rounded-2xl border-2 p-5 space-y-3"
            style={{ background: '#3E1F1A', borderColor: '#4A2218', boxShadow: '4px 4px 0 #E8873F' }}
          >
            <h3 className="font-black text-base" style={{ color: '#FCE8D0', fontFamily: 'var(--font-serif)' }}>Needs your attention</h3>
            {unverified.length === 0 && suspended.length === 0 ? (
              <p className="text-sm" style={{ color: '#C9A58C' }}>All clear. No shelters waiting and no suspended accounts.</p>
            ) : (
              <ul className="space-y-2">
                {unverified.map((sh) => (
                  <li key={sh._id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2" style={{ background: '#4A2218' }}>
                    <span className="text-sm min-w-0" style={{ color: '#FCE8D0' }}>
                      <strong>{sh.organization?.name || sh.name}</strong> is waiting for verification
                    </span>
                    <button
                      disabled={busyId === sh._id}
                      onClick={() => toggleVerify(sh)}
                      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-extrabold disabled:opacity-50"
                      style={{ background: '#E8873F', color: '#3E1F1A' }}
                    >
                      Verify
                    </button>
                  </li>
                ))}
                {suspended.length > 0 && (
                  <li className="text-sm rounded-xl px-3 py-2" style={{ background: '#4A2218', color: '#FCE8D0' }}>
                    {suspended.length} suspended account{suspended.length > 1 ? 's' : ''}. Review them in Users.
                  </li>
                )}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B99A86]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or email..."
                className="w-full h-11 pl-10 pr-4 rounded-full bg-white border-2 border-[#EBC9A5] text-sm focus:outline-none focus:border-[#C2572F]"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="h-11 px-4 rounded-full bg-white border-2 border-[#EBC9A5] text-sm font-bold text-[#3E1F1A] focus:outline-none"
            >
              <option value="all">All roles</option>
              <option value="adopter">Adopters</option>
              <option value="owner">Pet owners</option>
              <option value="shelter">Shelters</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          <div className="rounded-2xl border-2 bg-white overflow-hidden" style={{ borderColor: '#EBC9A5' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead style={{ background: '#FCE8D0', color: '#B99A86' }}>
                  <tr>
                    <th className={th}>User</th>
                    <th className={th}>Role</th>
                    <th className={th}>Joined</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="border-t" style={{ borderColor: '#F8DDBF' }}>
                      <td className={td}>
                        <p className="font-bold text-[#3E1F1A]">{u.name}</p>
                        <p className="text-xs text-[#8A5A48]">{u.email}</p>
                      </td>
                      <td className={td}><Pill>{u.role}</Pill></td>
                      <td className={`${td} text-xs text-[#8A5A48]`}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className={td}>
                        {u.isSuspended ? <Pill tone="bad">Suspended</Pill> : <Pill tone="ok">Active</Pill>}
                      </td>
                      <td className={`${td} text-right`}>
                        {u.role === 'admin' || u._id === me?._id ? (
                          <span className="text-xs text-[#B99A86]">—</span>
                        ) : (
                          <button
                            disabled={busyId === u._id}
                            onClick={() => toggleSuspend(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border-2 transition disabled:opacity-50"
                            style={
                              u.isSuspended
                                ? { borderColor: '#C2572F', color: '#C2572F' }
                                : { borderColor: '#B3261E', color: '#B3261E' }
                            }
                          >
                            <Ban className="w-3.5 h-3.5" />
                            {u.isSuspended ? 'Reinstate' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#8A5A48]">No users match.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SHELTERS */}
      {tab === 'shelters' && (
        <div className="grid md:grid-cols-2 gap-4">
          {shelters.length === 0 && <p className="text-sm text-[#8A5A48]">No shelters registered.</p>}
          {shelters.map((s) => {
            const verified = Boolean(s.organization?.verified);
            const count = pets.filter(
              (p) => (typeof p.shelter === 'object' ? p.shelter._id : p.shelter) === s._id
            ).length;
            return (
              <div key={s._id} className="rounded-2xl border-2 bg-white p-5 space-y-3" style={{ borderColor: '#EBC9A5' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-black text-[#3E1F1A] truncate">{s.organization?.name || s.name}</h4>
                    <p className="text-xs text-[#8A5A48] truncate">{s.email}</p>
                  </div>
                  {verified ? <Pill tone="ok">Verified</Pill> : <Pill tone="warn">Unverified</Pill>}
                </div>
                <p className="text-xs text-[#8A5A48]">
                  License: {s.organization?.licenseNumber || 'not provided'} · {count} listing{count === 1 ? '' : 's'}
                </p>
                <button
                  disabled={busyId === s._id}
                  onClick={() => toggleVerify(s)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition disabled:opacity-50"
                  style={
                    verified
                      ? { border: '2px solid #EBC9A5', color: '#8A5A48' }
                      : { background: '#C2572F', color: '#FFFFFF' }
                  }
                >
                  <BadgeCheck className="w-4 h-4" />
                  {verified ? 'Remove verification' : 'Verify shelter'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* LISTINGS */}
      {tab === 'listings' && (
        <div className="rounded-2xl border-2 bg-white overflow-hidden" style={{ borderColor: '#EBC9A5' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead style={{ background: '#FCE8D0', color: '#B99A86' }}>
                <tr>
                  <th className={th}>Pet</th>
                  <th className={th}>Shelter</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((p) => (
                  <tr key={p._id} className="border-t" style={{ borderColor: '#F8DDBF' }}>
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        {p.photos?.[0] && (
                          <img src={p.photos[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-bold text-[#3E1F1A]">{p.name}</p>
                          <p className="text-xs text-[#8A5A48]">{p.species} · {p.breed}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} text-[#8A5A48]`}>{shelterName(p)}</td>
                    <td className={td}>
                      <Pill tone={p.status === 'Available' ? 'ok' : p.status === 'Reserved' ? 'warn' : 'neutral'}>
                        {p.status}
                      </Pill>
                    </td>
                    <td className={`${td} text-right`}>
                      <button
                        disabled={busyId === p._id}
                        onClick={() => removePet(p)}
                        className="p-2 rounded-full text-[#B3261E] hover:bg-[#FCE4E1] transition disabled:opacity-50"
                        title="Remove listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {pets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#8A5A48]">No listings.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};
