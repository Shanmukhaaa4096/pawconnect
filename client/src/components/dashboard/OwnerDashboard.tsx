import React, { useState, useEffect } from 'react';
import { useDashTab, useConsumeNewParam } from './useDashTab';
import { Plus, PawPrint, LayoutGrid, ShieldCheck, Pencil, Trash2, Users, Home, ChevronRight } from 'lucide-react';
import { Pet, Application, PetStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { DashboardShell } from './DashboardShell';
import { AddPetModal } from './AddPetModal';
import { EditPetModal } from './EditPetModal';
import { ApplicationReviewModal } from './ApplicationReviewModal';
import { OwnerTips } from './OwnerTips';
import { buildChecks, fitScore } from './ApplicantMatch';

type Tab = 'desk' | 'board' | 'safety';

const INK = '#4A2218';
const petIdOf = (a: Application) => (a.pet as any)?._id || (a.pet as unknown as string);

const COLUMNS: { status: Application['status']; title: string; hint: string; bg: string }[] = [
  { status: 'Pending', title: 'New applicants', hint: 'Read and decide', bg: '#FBE3A1' },
  { status: 'Approved', title: 'Meeting & handover', hint: 'Meet, check, hand over', bg: '#F8DDBF' },
  { status: 'Completed', title: 'Rehomed', hint: 'A happy ending', bg: '#BFE3C0' },
];

const scoreColor = (n: number) => (n >= 80 ? '#2E7D32' : n >= 55 ? '#B8860B' : '#B3261E');

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useDashTab<Tab>(['desk', 'board', 'safety'], 'desk');
  const [pets, setPets] = useState<Pet[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const newParam = useConsumeNewParam(() => setAdding(true));
  useEffect(() => { if (newParam.wants) newParam.consume(); }, [newParam.wants]);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [reviewing, setReviewing] = useState<Application | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const [p, a] = await Promise.all([api.getPets({ shelterId: user?._id }), api.getShelterApplications()]);
      setPets(p.pets || []);
      setApps(a.applications || []);
    } catch (err) {
      console.error('Owner dashboard load failed:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [user?._id]);

  const pending = apps.filter((a) => a.status === 'Pending');
  const closed = apps.filter((a) => ['Rejected', 'Withdrawn'].includes(a.status));

  const changeStatus = async (pet: Pet, status: PetStatus) => {
    try {
      await api.updatePetStatus(pet._id, status);
      setPets((l) => l.map((p) => (p._id === pet._id ? { ...p, status } : p)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const remove = async (pet: Pet) => {
    if (!window.confirm(`Remove ${pet.name}'s listing?`)) return;
    try {
      await api.deletePet(pet._id);
      setPets((l) => l.filter((p) => p._id !== pet._id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const nextAction = (pet: Pet) => {
    const mine = apps.filter((a) => petIdOf(a) === pet._id);
    const np = mine.filter((a) => a.status === 'Pending').length;
    if (np > 0) return { label: `${np} new applicant${np > 1 ? 's' : ''}`, tone: '#C2572F', go: 'board' as Tab };
    if (mine.some((a) => a.status === 'Approved')) return { label: 'Plan the handover', tone: '#2E7D32', go: 'board' as Tab };
    if (pet.status === 'Adopted') return { label: 'Rehomed', tone: '#2E7D32', go: null };
    return { label: 'Waiting for applicants', tone: '#8A5A48', go: null };
  };

  if (loading) return <LoadingSpinner label="Opening your desk..." />;

  return (
    <DashboardShell
      role="owner"
      active={tab}
      onChange={(id) => setTab(id as Tab)}
      title={`${(user?.name || 'Friend').split(' ')[0]}'s rehoming desk`}
      subtitle="Find the right family for the pets you love."
      actions={
        <button onClick={() => setAdding(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>List my pet</span>
        </button>
      }
      nav={[
        { id: 'desk', label: 'My pets', icon: <Home className="w-4 h-4" />, badge: pets.length },
        { id: 'board', label: 'Applicant board', icon: <LayoutGrid className="w-4 h-4" />, badge: pending.length },
        { id: 'safety', label: 'Safety guide', icon: <ShieldCheck className="w-4 h-4" /> },
      ]}
    >
      {/* ── MY PETS ── */}
      {tab === 'desk' && (
        <>
          {pets.length === 0 ? (
            <div className="rounded-3xl border-2 p-10 text-center space-y-3" style={{ background: '#FBE3A1', borderColor: INK, boxShadow: `5px 5px 0 ${INK}` }}>
              <PawPrint className="w-10 h-10 mx-auto" style={{ color: INK }} />
              <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-serif)', color: INK }}>No pet listed yet</h3>
              <p className="text-sm max-w-sm mx-auto" style={{ color: '#6B4A2E' }}>
                Add a photo, a few details, and why you are rehoming. It takes two minutes.
              </p>
              <button onClick={() => setAdding(true)} className="btn-primary">
                <Plus className="w-4 h-4" />
                <span>List my pet</span>
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {pets.map((pet) => {
                const next = nextAction(pet);
                return (
                  <article
                    key={pet._id}
                    className="rounded-3xl border-2 bg-white overflow-hidden flex flex-col"
                    style={{ borderColor: INK, boxShadow: `5px 5px 0 ${INK}` }}
                  >
                    <div className="relative aspect-[4/3] border-b-2" style={{ borderColor: INK }}>
                      <img src={pet.photos?.[0]} alt={pet.name} className="absolute inset-0 w-full h-full object-cover" />
                      <span
                        className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border-2 -rotate-3"
                        style={{ background: next.tone === '#C2572F' ? '#FBE3A1' : '#FFFFFF', color: next.tone, borderColor: INK, boxShadow: `2px 2px 0 ${INK}` }}
                      >
                        {next.label}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <div>
                        <h3 className="text-xl font-black" style={{ fontFamily: 'var(--font-serif)', color: '#3E1F1A' }}>{pet.name}</h3>
                        <p className="text-xs font-medium" style={{ color: '#8A5A48' }}>
                          {pet.breed} · {pet.age} yr{pet.age === 1 ? '' : 's'} · {pet.gender}
                        </p>
                      </div>
                      <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider" style={{ color: '#8A5A48' }}>
                        Status
                        <select
                          value={pet.status}
                          onChange={(e) => changeStatus(pet, e.target.value as PetStatus)}
                          className="flex-1 h-9 px-2 rounded-lg border-2 bg-white text-xs font-bold normal-case tracking-normal"
                          style={{ borderColor: INK, color: '#3E1F1A' }}
                        >
                          <option>Available</option>
                          <option>Reserved</option>
                          <option>Adopted</option>
                        </select>
                      </label>
                      <div className="mt-auto flex items-center gap-2 pt-1">
                        {next.go && (
                          <button
                            onClick={() => setTab(next.go!)}
                            className="flex-1 h-9 rounded-full text-xs font-extrabold inline-flex items-center justify-center gap-1 border-2 text-[#FBE3A1]"
                            style={{ background: INK, borderColor: INK }}
                          >
                            Open board <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => setEditing(pet)} aria-label={`Edit ${pet.name}`} className="w-9 h-9 rounded-full border-2 flex items-center justify-center hover:bg-[#FBE3A1]" style={{ borderColor: INK }}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(pet)} aria-label={`Remove ${pet.name}`} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[#B3261E] hover:bg-[#FCE4E1]" style={{ borderColor: INK }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── APPLICANT BOARD ── */}
      {tab === 'board' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 items-start">
            {COLUMNS.map((col) => {
              const list = apps.filter((a) => a.status === col.status);
              return (
                <section key={col.status} className="rounded-3xl border-2 p-3 space-y-3" style={{ background: col.bg, borderColor: INK, boxShadow: `4px 4px 0 ${INK}` }}>
                  <header className="px-1 pt-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm" style={{ color: INK }}>{col.title}</h3>
                      <span className="min-w-6 h-6 px-1.5 rounded-full bg-white border-2 text-[11px] font-black flex items-center justify-center" style={{ borderColor: INK, color: INK }}>
                        {list.length}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: '#6B4A2E' }}>{col.hint}</p>
                  </header>

                  {list.length === 0 && (
                    <p className="text-xs text-center py-6 rounded-2xl border-2 border-dashed" style={{ borderColor: `${INK}55`, color: '#6B4A2E' }}>
                      Nothing here yet
                    </p>
                  )}

                  {list.map((a) => {
                    const score = a.pet && a.questionnaire ? fitScore(buildChecks(a.pet, a.questionnaire)) : null;
                    const done = a.handover
                      ? ['meetGreet', 'homeCheck', 'vetRecords', 'agreement'].filter((k) => (a.handover as any)[k]).length
                      : 0;
                    return (
                      <button
                        key={a._id}
                        onClick={() => setReviewing(a)}
                        className="w-full text-left rounded-2xl border-2 bg-white p-3.5 space-y-2 transition hover:-translate-y-0.5"
                        style={{ borderColor: INK, boxShadow: `3px 3px 0 ${INK}` }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-sm truncate" style={{ color: '#3E1F1A' }}>
                            {a.questionnaire?.fullName || a.adopter?.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black border" style={{ borderColor: INK, background: '#FCE8D0', color: INK }}>
                            {a.pet?.name}
                          </span>
                        </div>
                        <p className="text-[11px]" style={{ color: '#8A5A48' }}>
                          {a.questionnaire?.housingType} · {a.questionnaire?.petExperience}
                        </p>
                        {col.status === 'Pending' && score != null && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#FCE8D0' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${score}%`, background: scoreColor(score) }} />
                            </div>
                            <span className="text-[11px] font-black" style={{ color: scoreColor(score) }}>{score}% fit</span>
                          </div>
                        )}
                        {col.status === 'Approved' && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#FCE8D0' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${(done / 4) * 100}%`, background: '#2E7D32' }} />
                            </div>
                            <span className="text-[11px] font-black" style={{ color: '#2E7D32' }}>{done}/4 steps</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </section>
              );
            })}
          </div>
          {closed.length > 0 && (
            <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#8A5A48' }}>
              <Users className="w-3.5 h-3.5" /> {closed.length} closed application{closed.length > 1 ? 's' : ''} (declined or withdrawn) are hidden.
            </p>
          )}
        </div>
      )}

      {/* ── SAFETY ── */}
      {tab === 'safety' && (
        <div className="space-y-5">
          <OwnerTips />
          <section className="rounded-2xl border-2 bg-white p-5" style={{ borderColor: INK, boxShadow: `3px 3px 0 ${INK}` }}>
            <h3 className="font-black text-base mb-2" style={{ color: '#3E1F1A' }}>Before you hand over your pet</h3>
            <ul className="text-sm space-y-1.5 list-disc pl-5" style={{ color: '#8A5A48' }}>
              <li>Pack vet records, vaccination card, favourite toy and food routine.</li>
              <li>Update the microchip details to the adopter if your pet is chipped.</li>
              <li>Agree what happens if the adoption does not work out.</li>
              <li>Set the pet to <strong>Adopted</strong> here so others stop applying.</li>
            </ul>
          </section>
        </div>
      )}

      {adding && <AddPetModal isOwner onClose={() => setAdding(false)} onCreated={load} />}
      {editing && (
        <EditPetModal
          pet={editing}
          showRehoming
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setPets((l) => l.map((p) => (p._id === updated._id ? updated : p)));
            setEditing(null);
          }}
        />
      )}
      {reviewing && (
        <ApplicationReviewModal
          key={reviewing._id}
          app={reviewing}
          noteLabel="Note to the adopter"
          onClose={() => setReviewing(null)}
          onChanged={(updated, closedModal) => {
            setApps((l) => l.map((x) => (x._id === updated._id ? { ...x, ...updated } : x)));
            if (closedModal) load();
            else setReviewing(updated);
          }}
        />
      )}
    </DashboardShell>
  );
};
