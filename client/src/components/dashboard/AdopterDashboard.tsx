import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Heart, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, X, Star, Undo2, Compass, Sparkles, Bell } from 'lucide-react';
import { Application, Pet, AppNotification } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DashboardShell } from './DashboardShell';
import { useDashTab } from './useDashTab';
import { api } from '../../services/api';
import { useFavorites } from '../../context/FavoritesContext';
import { StatusBadge } from '../common/Badge';
import { PetCard } from '../common/PetCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ApplicationTracker } from './ApplicationTracker';
import { ReviewModal } from './ReviewModal';
import { HandoverChecklist } from './HandoverChecklist';

const EmptyState = ({
  icon, title, body, action,
}: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) => (
  <div
    className="p-10 sm:p-14 text-center space-y-4 max-w-md mx-auto rounded-lg border"
    style={{ background: '#F8DDBF', borderColor: '#EBC9A5' }}
  >
    <div className="flex justify-center mb-2">{icon}</div>
    <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '1.125rem', color: '#3E1F1A' }}>{title}</h3>
    <p className="text-sm leading-relaxed" style={{ color: '#8A5A48', maxWidth: '32ch', margin: '0 auto' }}>{body}</p>
    {action}
  </div>
);

type AdopterTab = 'overview' | 'applications' | 'favorites' | 'history';

export const AdopterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useDashTab<AdopterTab>(['overview', 'applications', 'favorites', 'history'], 'overview');
  const [suggested, setSuggested] = useState<Pet[]>([]);
  const [activity, setActivity] = useState<AppNotification[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewApp, setReviewApp] = useState<Application | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  const shelterIdOf = (a: Application) => (a.shelter as any)?._id || (a.shelter as unknown as string);

  const handleWithdraw = async (app: Application) => {
    if (!window.confirm(`Withdraw your application for ${app.pet?.name}?`)) return;
    try {
      setBusyId(app._id);
      const res = await api.withdrawApplication(app._id);
      setApplications((list) => list.map((a) => (a._id === app._id ? { ...a, ...res.application, pet: a.pet, shelter: a.shelter } : a)));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.getMyApplications();
        const apps = res.applications || [];
        setApplications(apps);

        // Which completed adoptions already have a review from me?
        const shelterIds = [...new Set(apps.filter((a) => a.status === 'Completed').map((a) => (a.shelter as any)?._id || (a.shelter as unknown as string)))];
        const lists = await Promise.all(shelterIds.map((id) => api.getShelterReviews(id).catch(() => null)));
        const mine = new Set<string>();
        lists.forEach((l) => l?.reviews.forEach((r) => mine.add(r.application)));
        setReviewedIds(mine);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    api.getNotifications().then((r) => setActivity(r.notifications.slice(0, 4))).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (loading) return;
    api
      .getPets({})
      .then((r) => {
        const appliedIds = new Set(applications.map((a) => (a.pet as any)?._id || (a.pet as unknown as string)));
        const savedIds = new Set(favorites.map((f: any) => f._id || f.pet?._id));
        const savedSpecies = favorites.map((f: any) => (f.species || f.pet?.species) as string).filter(Boolean);
        const topSpecies = savedSpecies.sort((a, b) => savedSpecies.filter((x) => x === b).length - savedSpecies.filter((x) => x === a).length)[0];
        const pool = (r.pets || []).filter((p) => p.status === 'Available' && !appliedIds.has(p._id) && !savedIds.has(p._id));
        const ranked = [...pool].sort((a, b) => Number(b.species === topSpecies) - Number(a.species === topSpecies));
        setSuggested(ranked.slice(0, 4));
      })
      .catch(() => undefined);
  }, [loading, applications, favorites]);

  const completedAdoptions = applications.filter((a) => a.status === 'Completed');
  const activeApps = applications.filter((a) => ['Pending', 'Approved'].includes(a.status));
  const waitingReview = completedAdoptions.find((a) => !reviewedIds.has(a._id));
  const approvedApp = applications.find((a) => a.status === 'Approved');
  const pendingApp = applications.find((a) => a.status === 'Pending');

  const nextStep = approvedApp
    ? {
        tone: '#2E7D32',
        title: `${approvedApp.pet?.name} was approved!`,
        body: `Message ${approvedApp.shelter?.name || 'the lister'} to arrange the meet & greet, then follow the handover checklist.`,
        cta: { to: '/messages', label: 'Open messages' },
      }
    : waitingReview
      ? {
          tone: '#E8873F',
          title: `How was adopting ${waitingReview.pet?.name}?`,
          body: 'Leave a rating to help other adopters trust good shelters.',
          cta: null,
        }
      : pendingApp
        ? {
            tone: '#C2572F',
            title: `Waiting on ${pendingApp.pet?.name}`,
            body: 'Your application is being reviewed. You can message them while you wait.',
            cta: { to: '/messages', label: 'Say hello' },
          }
        : {
            tone: '#C2572F',
            title: 'Start your journey',
            body: 'Browse pets from shelters and owners, save favourites, and apply when you find a match.',
            cta: { to: '/browse', label: 'Find a pet' },
          };

  return (
    <DashboardShell
      role="adopter"
      active={activeTab}
      onChange={(id) => setActiveTab(id as AdopterTab)}
      title={`Hi ${(user?.name || 'there').split(' ')[0]}, welcome back`}
      subtitle="Your adoption journey, all in one place."
      actions={
        <Link to="/browse" className="btn-primary" style={{ textDecoration: 'none' }}>
          <Compass className="w-4 h-4" />
          <span>Browse pets</span>
        </Link>
      }
      nav={[
        { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" />, badge: activeApps.length },
        { id: 'favorites', label: 'Saved pets', icon: <Heart className="w-4 h-4" />, badge: favorites.length },
        { id: 'history', label: 'Adoptions', icon: <CheckCircle2 className="w-4 h-4" /> },
      ]}
    >
      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <section
            className="rounded-3xl border-2 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ background: '#FFFFFF', borderColor: '#4A2218', boxShadow: '5px 5px 0 #4A2218' }}
          >
            <div className="flex items-start gap-4">
              <span className="w-3 h-14 rounded-full shrink-0" style={{ background: nextStep.tone }} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8A5A48' }}>Your next step</p>
                <h2 className="text-xl sm:text-2xl font-black mt-0.5" style={{ color: '#3E1F1A' }}>{nextStep.title}</h2>
                <p className="text-sm mt-1 max-w-xl" style={{ color: '#8A5A48' }}>{nextStep.body}</p>
              </div>
            </div>
            {nextStep.cta ? (
              <Link to={nextStep.cta.to} className="btn-primary shrink-0" style={{ textDecoration: 'none' }}>
                <span>{nextStep.cta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              waitingReview && (
                <button onClick={() => setReviewApp(waitingReview)} className="btn-primary shrink-0">
                  <Star className="w-4 h-4" />
                  <span>Rate shelter</span>
                </button>
              )
            )}
          </section>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: 'Active applications', value: activeApps.length, go: 'applications' as AdopterTab },
              { label: 'Saved pets', value: favorites.length, go: 'favorites' as AdopterTab },
              { label: 'Adopted', value: completedAdoptions.length, go: 'history' as AdopterTab },
            ].map((m) => (
              <button
                key={m.label}
                onClick={() => setActiveTab(m.go)}
                className="text-left rounded-2xl border-2 p-4 sm:p-5 transition hover:-translate-y-0.5"
                style={{ background: '#FFFFFF', borderColor: '#4A2218', boxShadow: '3px 3px 0 #4A2218' }}
              >
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8A5A48' }}>{m.label}</span>
                <span className="block text-3xl font-black mt-1" style={{ color: '#C2572F', fontFamily: 'var(--font-serif)' }}>{m.value}</span>
              </button>
            ))}
          </div>

          {suggested.length > 0 && (
            <section>
              <h3 className="text-xl font-black mb-3" style={{ fontFamily: 'var(--font-serif)', color: '#3E1F1A' }}>Pets you might love</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {suggested.map((p) => (
                  <PetCard key={p._id} pet={p} />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border-2 p-5" style={{ background: '#FFFFFF', borderColor: '#4A2218', boxShadow: '3px 3px 0 #4A2218' }}>
            <h3 className="font-black text-base flex items-center gap-2 mb-3" style={{ color: '#3E1F1A' }}>
              <Bell className="w-4 h-4" style={{ color: '#C2572F' }} /> Recent activity
            </h3>
            {activity.length === 0 ? (
              <p className="text-sm" style={{ color: '#8A5A48' }}>Nothing yet. Updates on your applications will show here.</p>
            ) : (
              <ul className="space-y-2.5">
                {activity.map((n) => (
                  <li key={n._id} className="flex items-start gap-3 text-sm">
                    <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: n.read ? '#EBC9A5' : '#C2572F' }} />
                    <span>
                      <span className="font-bold" style={{ color: '#3E1F1A' }}>{n.title}</span>
                      {n.body && <span className="block text-xs" style={{ color: '#8A5A48' }}>{n.body}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner label="Loading your applications…" />
          ) : applications.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-8 h-8" style={{ color: '#B99A86' }} />}
              title="No applications yet"
              body="Browse our adoptable companions and submit your first application."
              action={
                <Link to="/browse" className="btn-primary inline-flex items-center gap-2" style={{ textDecoration: 'none', marginTop: '0.5rem' }}>
                  <span>Find a pet</span><ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="rounded-lg border p-5 sm:p-6 transition-colors"
                  style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.pet?.photos?.[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
                      alt={app.pet?.name || 'Pet'}
                      className="w-16 h-16 rounded object-cover shrink-0"
                      style={{ border: '1px solid #EBC9A5' }}
                    />
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <Link
                          to={`/pets/${app.pet?._id}`}
                          className="font-semibold text-base transition-colors hover:text-[#8E3B22]"
                          style={{ color: '#3E1F1A', textDecoration: 'none' }}
                        >
                          {app.pet?.name}
                        </Link>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <p className="text-xs mb-0.5" style={{ color: '#B99A86' }}>
                        {app.pet?.breed} · Submitted{' '}
                        {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs" style={{ color: '#8A5A48' }}>
                        {app.shelter?.role === 'owner' ? 'Owner' : 'Shelter'}: {app.shelter?.name || 'Rescue Centre'}
                      </p>
                      {app.shelterNotes && (
                        <div
                          className="mt-2 text-xs p-2.5 rounded border"
                          style={{ background: '#FCE8D0', borderColor: '#EBC9A5', color: '#8A5A48' }}
                        >
                          <span className="font-medium" style={{ color: '#C8795A' }}>Shelter note: </span>
                          {app.shelterNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="btn-secondary text-xs"
                      style={{ height: '2.25rem', padding: '0 0.875rem' }}
                    >
                      View details
                    </button>
                    <Link
                      to="/messages"
                      className="btn-secondary text-xs inline-flex items-center gap-1.5"
                      style={{ textDecoration: 'none', height: '2.25rem', padding: '0 0.875rem' }}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </Link>
                    {app.status === 'Pending' && (
                      <button
                        onClick={() => handleWithdraw(app)}
                        disabled={busyId === app._id}
                        className="btn-secondary text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
                        style={{ height: '2.25rem', padding: '0 0.875rem', color: '#B3261E' }}
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        Withdraw
                      </button>
                    )}
                    {app.status === 'Completed' && !reviewedIds.has(app._id) && (
                      <button
                        onClick={() => setReviewApp(app)}
                        className="text-xs font-extrabold inline-flex items-center gap-1.5 rounded-full text-white"
                        style={{ height: '2.25rem', padding: '0 0.875rem', background: '#E8873F' }}
                      >
                        <Star className="w-3.5 h-3.5" />
                        Rate shelter
                      </button>
                    )}
                  </div>
                  </div>
                  <ApplicationTracker app={app} />
                  {['Approved', 'Completed'].includes(app.status) && (
                    <div className="mt-4">
                      <HandoverChecklist key={`${app._id}-${app.updatedAt}`} app={app} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVORITES */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <EmptyState
              icon={<Heart className="w-8 h-8" style={{ color: '#B99A86' }} />}
              title="No saved pets yet"
              body="Tap the heart icon on any pet card to save them here for quick access."
              action={
                <Link to="/browse" className="btn-primary inline-flex items-center gap-2" style={{ textDecoration: 'none', marginTop: '0.5rem' }}>
                  <span>Browse pets</span><ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {favorites.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          {completedAdoptions.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="w-8 h-8" style={{ color: '#B99A86' }} />}
              title="No completed adoptions yet"
              body="Once a shelter finalises your adoption, your pet companion will appear here."
            />
          ) : (
            <div className="space-y-4">
              <div
                className="rounded-lg border p-5 flex items-center gap-4"
                style={{ background: 'rgba(38,58,50,0.06)', borderColor: 'rgba(38,58,50,0.15)' }}
              >
                <ShieldCheck className="w-8 h-8 shrink-0" style={{ color: '#8E3B22' }} />
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: '#8E3B22' }}>Congratulations on your adoption</h4>
                  <p className="text-xs mt-0.5" style={{ color: '#4A6659' }}>
                    Thank you for opening your home to a rescue animal.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedAdoptions.map((app) => (
                  <div
                    key={app._id}
                    className="rounded-lg border p-4 flex items-center gap-4"
                    style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}
                  >
                    <img
                      src={app.pet?.photos?.[0]}
                      alt={app.pet?.name}
                      className="w-14 h-14 rounded object-cover shrink-0"
                      style={{ border: '1px solid #EBC9A5' }}
                    />
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: '#3E1F1A' }}>{app.pet?.name}</h4>
                      <p className="text-xs mt-0.5" style={{ color: '#B99A86' }}>{app.pet?.breed}</p>
                      <span
                        className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded"
                        style={{ background: '#F8DDBF', color: '#8E3B22' }}
                      >
                        Adopted via {app.shelter?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* APPLICATION DETAILS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(37,40,37,0.5)' }}>
          <div
            className="w-full max-w-lg rounded-lg border p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#F8DDBF' }}>
              <div>
                <h3 className="font-semibold text-base" style={{ color: '#3E1F1A', fontFamily: "'Fraunces', serif" }}>Application details</h3>
                <p className="text-xs mt-0.5" style={{ color: '#B99A86' }}>For {selectedApp.pet?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedApp.status} />
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded transition-colors hover:bg-[#F8DDBF]"
                  style={{ color: '#8A5A48' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-sm rounded border p-4" style={{ background: '#FCE8D0', borderColor: '#EBC9A5' }}>
              {[
                { label: 'Adopter', value: `${selectedApp.questionnaire?.fullName} (${selectedApp.questionnaire?.phone})` },
                { label: 'Living situation', value: `${selectedApp.questionnaire?.housingType} (${selectedApp.questionnaire?.ownership})` },
                { label: 'Experience', value: selectedApp.questionnaire?.petExperience || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="font-medium text-xs shrink-0" style={{ color: '#B99A86' }}>{label}</span>
                  <span className="text-xs text-right" style={{ color: '#3E1F1A' }}>{value}</span>
                </div>
              ))}
              <div>
                <span className="block font-medium text-xs mb-1.5" style={{ color: '#B99A86' }}>Reason for adopting</span>
                <p className="text-xs italic leading-relaxed p-3 rounded border" style={{ background: '#FFFFFF', borderColor: '#EBC9A5', color: '#8A5A48' }}>
                  "{selectedApp.questionnaire?.reasonForAdopting}"
                </p>
              </div>
              {selectedApp.shelterNotes && (
                <div className="pt-2.5 border-t" style={{ borderColor: '#F8DDBF' }}>
                  <span className="font-medium text-xs" style={{ color: '#C8795A' }}>Shelter feedback: </span>
                  <span className="text-xs" style={{ color: '#3E1F1A' }}>{selectedApp.shelterNotes}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            {selectedApp.timeline && selectedApp.timeline.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#B99A86' }}>Status history</p>
                <div className="space-y-2">
                  {selectedApp.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#8E3B22' }} />
                      <div>
                        <span className="font-medium" style={{ color: '#3E1F1A' }}>{item.status}</span>
                        {' · '}
                        <span style={{ color: '#B99A86' }}>{new Date(item.date).toLocaleDateString()}</span>
                        {item.note && <p className="mt-0.5" style={{ color: '#8A5A48' }}>{item.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setSelectedApp(null)} className="btn-primary w-full">Close</button>
          </div>
        </div>
      )}

      {reviewApp && (
        <ReviewModal
          app={reviewApp}
          onClose={() => setReviewApp(null)}
          onDone={(id) => {
            setReviewedIds((set) => new Set(set).add(id));
            setReviewApp(null);
          }}
        />
      )}
    </DashboardShell>
  );
};
