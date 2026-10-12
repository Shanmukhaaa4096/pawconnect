import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Heart, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { Application } from '../../types';
import { api } from '../../services/api';
import { useFavorites } from '../../context/FavoritesContext';
import { StatusBadge } from '../common/Badge';
import { PetCard } from '../common/PetCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

const TabBtn = ({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2"
    style={{
      borderColor:  active ? '#263A32' : 'transparent',
      color:        active ? '#263A32' : '#6B7068',
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const EmptyState = ({
  icon, title, body, action,
}: { icon: React.ReactNode; title: string; body: string; action?: React.ReactNode }) => (
  <div
    className="p-10 sm:p-14 text-center space-y-4 max-w-md mx-auto rounded-lg border"
    style={{ background: '#EAECE4', borderColor: '#DDE0D8' }}
  >
    <div className="flex justify-center mb-2">{icon}</div>
    <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: '1.125rem', color: '#252825' }}>{title}</h3>
    <p className="text-sm leading-relaxed" style={{ color: '#6B7068', maxWidth: '32ch', margin: '0 auto' }}>{body}</p>
    {action}
  </div>
);

export const AdopterDashboard: React.FC<{ initialTab?: string }> = ({ initialTab = 'applications' }) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'favorites' | 'history'>(
    initialTab as any || 'applications'
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.getMyApplications();
        setApplications(res.applications || []);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const completedAdoptions = applications.filter((a) => a.status === 'Completed');

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <div className="flex border-b gap-1 overflow-x-auto pb-px" style={{ borderColor: '#DDE0D8' }}>
        <TabBtn
          active={activeTab === 'applications'}
          onClick={() => setActiveTab('applications')}
          icon={<FileText className="w-4 h-4" />}
          label={`My applications (${applications.length})`}
        />
        <TabBtn
          active={activeTab === 'favorites'}
          onClick={() => setActiveTab('favorites')}
          icon={<Heart className="w-4 h-4" />}
          label={`Saved (${favorites.length})`}
        />
        <TabBtn
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          icon={<CheckCircle2 className="w-4 h-4" />}
          label={`Adoption history (${completedAdoptions.length})`}
        />
      </div>

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner label="Loading your applications…" />
          ) : applications.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-8 h-8" style={{ color: '#9BA097' }} />}
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
                  className="rounded-lg border p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors"
                  style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={app.pet?.photos?.[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
                      alt={app.pet?.name || 'Pet'}
                      className="w-16 h-16 rounded object-cover shrink-0"
                      style={{ border: '1px solid #DDE0D8' }}
                    />
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <Link
                          to={`/pets/${app.pet?._id}`}
                          className="font-semibold text-base transition-colors hover:text-[#263A32]"
                          style={{ color: '#252825', textDecoration: 'none' }}
                        >
                          {app.pet?.name}
                        </Link>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <p className="text-xs mb-0.5" style={{ color: '#9BA097' }}>
                        {app.pet?.breed} · Submitted{' '}
                        {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs" style={{ color: '#6B7068' }}>
                        Shelter: {app.shelter?.name || 'Rescue Centre'}
                      </p>
                      {app.shelterNotes && (
                        <div
                          className="mt-2 text-xs p-2.5 rounded border"
                          style={{ background: '#F7F5EF', borderColor: '#DDE0D8', color: '#6B7068' }}
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
                  </div>
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
              icon={<Heart className="w-8 h-8" style={{ color: '#9BA097' }} />}
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
              icon={<CheckCircle2 className="w-8 h-8" style={{ color: '#9BA097' }} />}
              title="No completed adoptions yet"
              body="Once a shelter finalises your adoption, your pet companion will appear here."
            />
          ) : (
            <div className="space-y-4">
              <div
                className="rounded-lg border p-5 flex items-center gap-4"
                style={{ background: 'rgba(38,58,50,0.06)', borderColor: 'rgba(38,58,50,0.15)' }}
              >
                <ShieldCheck className="w-8 h-8 shrink-0" style={{ color: '#263A32' }} />
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: '#263A32' }}>Congratulations on your adoption</h4>
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
                    style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
                  >
                    <img
                      src={app.pet?.photos?.[0]}
                      alt={app.pet?.name}
                      className="w-14 h-14 rounded object-cover shrink-0"
                      style={{ border: '1px solid #DDE0D8' }}
                    />
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: '#252825' }}>{app.pet?.name}</h4>
                      <p className="text-xs mt-0.5" style={{ color: '#9BA097' }}>{app.pet?.breed}</p>
                      <span
                        className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded"
                        style={{ background: '#EAECE4', color: '#263A32' }}
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
            style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#E8EBE3' }}>
              <div>
                <h3 className="font-semibold text-base" style={{ color: '#252825', fontFamily: "'Lora', serif" }}>Application details</h3>
                <p className="text-xs mt-0.5" style={{ color: '#9BA097' }}>For {selectedApp.pet?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedApp.status} />
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded transition-colors hover:bg-[#EAECE4]"
                  style={{ color: '#6B7068' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-sm rounded border p-4" style={{ background: '#F7F5EF', borderColor: '#DDE0D8' }}>
              {[
                { label: 'Adopter', value: `${selectedApp.questionnaire?.fullName} (${selectedApp.questionnaire?.phone})` },
                { label: 'Living situation', value: `${selectedApp.questionnaire?.housingType} (${selectedApp.questionnaire?.ownership})` },
                { label: 'Experience', value: selectedApp.questionnaire?.petExperience || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="font-medium text-xs shrink-0" style={{ color: '#9BA097' }}>{label}</span>
                  <span className="text-xs text-right" style={{ color: '#252825' }}>{value}</span>
                </div>
              ))}
              <div>
                <span className="block font-medium text-xs mb-1.5" style={{ color: '#9BA097' }}>Reason for adopting</span>
                <p className="text-xs italic leading-relaxed p-3 rounded border" style={{ background: '#FFFFFF', borderColor: '#DDE0D8', color: '#6B7068' }}>
                  "{selectedApp.questionnaire?.reasonForAdopting}"
                </p>
              </div>
              {selectedApp.shelterNotes && (
                <div className="pt-2.5 border-t" style={{ borderColor: '#E8EBE3' }}>
                  <span className="font-medium text-xs" style={{ color: '#C8795A' }}>Shelter feedback: </span>
                  <span className="text-xs" style={{ color: '#252825' }}>{selectedApp.shelterNotes}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            {selectedApp.timeline && selectedApp.timeline.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#9BA097' }}>Status history</p>
                <div className="space-y-2">
                  {selectedApp.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#263A32' }} />
                      <div>
                        <span className="font-medium" style={{ color: '#252825' }}>{item.status}</span>
                        {' · '}
                        <span style={{ color: '#9BA097' }}>{new Date(item.date).toLocaleDateString()}</span>
                        {item.note && <p className="mt-0.5" style={{ color: '#6B7068' }}>{item.note}</p>}
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
    </div>
  );
};
