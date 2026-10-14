import React, { useState, useEffect } from 'react';
import {
  Plus, PawPrint, FileText, Clock,
  CheckCircle2, Trash2, MessageSquare, X, BarChart3, Pencil, Star, ShieldCheck,
} from 'lucide-react';
import { Pet, Application, PetStatus, ApplicationStatus, ShelterReview } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ShelterStats } from './ShelterStats';
import { EditPetModal } from './EditPetModal';
import { ApplicationReviewModal } from './ApplicationReviewModal';
import { AddPetModal } from './AddPetModal';
import { DashboardShell } from './DashboardShell';
import { useDashTab, useConsumeNewParam } from './useDashTab';
import { Stars } from '../common/Stars';
import { useNavigate } from 'react-router-dom';

/* ─── Shared primitives ─────────────────────────────────────── */

const TabBtn = ({
  active, onClick, icon, label, badge,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 relative"
    style={{ borderColor: active ? '#8E3B22' : 'transparent', color: active ? '#8E3B22' : '#8A5A48' }}
  >
    {icon}
    <span>{label}</span>
    {badge != null && badge > 0 && (
      <span
        className="px-2 py-0.5 rounded text-[10px] font-semibold"
        style={{ background: 'rgba(200,121,90,0.12)', color: '#C8795A' }}
      >
        {badge}
      </span>
    )}
  </button>
);

const MetricCard = ({
  label, value, icon, color,
}: { label: string; value: number | string; icon: React.ReactNode; color: string }) => (
  <div
    className="rounded-lg border p-5"
    style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#B99A86' }}>{label}</span>
      <span style={{ color }}>{icon}</span>
    </div>
    <p className="text-2xl sm:text-3xl font-semibold" style={{ color, fontFamily: "'Fraunces', serif" }}>{value}</p>
  </div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#B99A86' }}>
    {children}
  </label>
);

/* ─── Main Component ────────────────────────────────────────── */

export const ShelterDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useDashTab(['pets', 'applications', 'reviews', 'stats'] as const, 'pets');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const newParam = useConsumeNewParam(() => setIsAddModalOpen(true));
  useEffect(() => { if (newParam.wants) newParam.consume(); }, [newParam.wants]);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [reviews, setReviews] = useState<ShelterReview[]>([]);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsRes, appsRes] = await Promise.all([
        api.getPets({ shelterId: user?._id }),
        api.getShelterApplications(),
      ]);
      setPets(petsRes.pets || []);
      setApplications(appsRes.applications || []);
    } catch (err) {
      console.error('Failed to load shelter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    api.getShelterReviews(user._id).then((r) => {
      setReviews(r.reviews);
      setRating({ average: r.average, count: r.count });
    }).catch(() => undefined);
  }, [user?._id]);

  const handlePetStatusChange = async (petId: string, newStatus: PetStatus) => {
    try {
      await api.updatePetStatus(petId, newStatus);
      setPets((prev) => prev.map((p) => (p._id === petId ? { ...p, status: newStatus } : p)));
    } catch (err: any) {
      alert(`Could not update pet status: ${err.message}`);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!window.confirm('Remove this pet listing?')) return;
    try {
      await api.deletePet(petId);
      setPets((prev) => prev.filter((p) => p._id !== petId));
    } catch (err: any) {
      alert(`Failed to delete pet: ${err.message}`);
    }
  };

  const pendingApps     = applications.filter((a) => a.status === 'Pending');
  const availablePets   = pets.filter((p) => p.status === 'Available');
  const adoptedPets     = pets.filter((p) => p.status === 'Adopted');

  const orgName = user?.organization?.name || user?.name;
  const verified = Boolean(user?.organization?.verified);

  return (
    <DashboardShell
      role="shelter"
      active={activeTab}
      onChange={(id) => setActiveTab(id as typeof activeTab)}
      title={orgName || 'Your shelter'}
      subtitle={`${[user?.location?.city, user?.location?.state].filter(Boolean).join(', ') || 'Rescue desk'} · Licence ${user?.organization?.licenseNumber || 'not provided'}`}
      actions={
        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          <span>List new pet</span>
        </button>
      }
      nav={[
        { id: 'pets', label: 'Listings', icon: <PawPrint className="w-4 h-4" />, badge: pets.length },
        { id: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" />, badge: pendingApps.length },
        { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" />, badge: rating.count },
        { id: 'stats', label: 'Insights', icon: <BarChart3 className="w-4 h-4" /> },
      ]}
    >
      {/* Verification status */}
      <div
        className="rounded-2xl border-2 px-4 py-3 flex items-center gap-3 text-sm font-bold"
        style={{
          background: verified ? '#E6F4EA' : '#FEF1DC',
          color: verified ? '#137333' : '#7A4B00',
          borderColor: '#4A2218',
        }}
      >
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <span>
          {verified
            ? 'Verified shelter. A badge shows on your listings and profile.'
            : 'Verification pending. An admin will review your licence. Complete your profile to speed this up.'}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard label="Total listed"     value={pets.length}          icon={<PawPrint className="w-4 h-4" />}     color="#3E1F1A" />
        <MetricCard label="Available"        value={availablePets.length} icon={<span className="w-2 h-2 rounded-full bg-[#8E3B22] inline-block animate-pulse" />} color="#8E3B22" />
        <MetricCard label="Pending requests" value={pendingApps.length}   icon={<Clock className="w-4 h-4" />}        color="#C8795A" />
        <MetricCard label="Adopted"          value={adoptedPets.length}   icon={<CheckCircle2 className="w-4 h-4" />} color="#8A5A48" />
      </div>

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {rating.count > 0 ? (
              <>
                <Stars value={rating.average} size={22} />
                <span className="text-2xl font-black" style={{ color: '#8E3B22', fontFamily: 'var(--font-serif)' }}>{rating.average.toFixed(1)}</span>
                <span className="text-sm" style={{ color: '#8A5A48' }}>from {rating.count} review{rating.count === 1 ? '' : 's'}</span>
              </>
            ) : (
              <p className="text-sm" style={{ color: '#8A5A48' }}>No reviews yet. Adopters can rate you once an adoption is completed.</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <article key={r._id} className="rounded-2xl border-2 bg-white p-5 space-y-2" style={{ borderColor: '#4A2218', boxShadow: '3px 3px 0 #4A2218' }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-sm" style={{ color: '#3E1F1A' }}>{r.adopter?.name || 'Adopter'}</span>
                  <Stars value={r.rating} />
                </div>
                {r.comment && <p className="text-sm" style={{ color: '#8A5A48' }}>{r.comment}</p>}
                <p className="text-[11px]" style={{ color: '#B99A86' }}>{new Date(r.createdAt).toLocaleDateString()}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && <ShelterStats pets={pets} applications={applications} />}

      {/* ── TAB 1: PET MANAGEMENT ── */}
      {activeTab === 'pets' && (
        <div>
          {loading ? (
            <LoadingSpinner label="Loading listings…" />
          ) : pets.length === 0 ? (
            <div
              className="p-10 text-center rounded-lg border max-w-md mx-auto"
              style={{ background: '#F8DDBF', borderColor: '#EBC9A5' }}
            >
              <PawPrint className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm" style={{ color: '#3E1F1A', fontFamily: "'Fraunces', serif" }}>No pets listed yet</p>
              <p className="text-xs mt-1.5" style={{ color: '#8A5A48' }}>Click "List new pet" to add your first companion.</p>
            </div>
          ) : (
            <div
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: '#EBC9A5' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead
                    className="text-[10px] font-semibold uppercase tracking-widest border-b"
                    style={{ background: '#FCE8D0', color: '#B99A86', borderColor: '#EBC9A5' }}
                  >
                    <tr>
                      <th className="px-6 py-3.5">Pet</th>
                      <th className="px-4 py-3.5">Species & Breed</th>
                      <th className="px-4 py-3.5">Age / Gender</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Fee</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((pet, i) => (
                      <tr
                        key={pet._id}
                        className="border-b transition-colors hover:bg-[#FCE8D0]"
                        style={{ borderColor: i < pets.length - 1 ? '#F8DDBF' : 'transparent' }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={pet.photos[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=150&q=80'}
                              alt={pet.name}
                              className="w-10 h-10 rounded object-cover shrink-0"
                              style={{ border: '1px solid #EBC9A5' }}
                            />
                            <div>
                              <p className="font-medium text-sm" style={{ color: '#3E1F1A' }}>{pet.name}</p>
                              <p className="text-xs" style={{ color: '#B99A86' }}>{pet.location.city}, {pet.location.state}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm" style={{ color: '#8A5A48' }}>{pet.species} · {pet.breed}</td>
                        <td className="px-4 py-4 text-xs" style={{ color: '#B99A86' }}>{pet.age} yrs · {pet.gender}</td>
                        <td className="px-4 py-4">
                          <select
                            value={pet.status}
                            onChange={(e) => handlePetStatusChange(pet._id, e.target.value as PetStatus)}
                            className="text-xs font-medium px-2.5 py-1 rounded border cursor-pointer focus:outline-none"
                            style={{
                              background: pet.status === 'Available' ? 'rgba(38,58,50,0.08)' : pet.status === 'Reserved' ? 'rgba(200,121,90,0.08)' : 'rgba(107,112,104,0.08)',
                              color:      pet.status === 'Available' ? '#8E3B22' : pet.status === 'Reserved' ? '#9B5A3A' : '#8A5A48',
                              borderColor: pet.status === 'Available' ? 'rgba(38,58,50,0.2)' : pet.status === 'Reserved' ? 'rgba(200,121,90,0.2)' : 'rgba(107,112,104,0.2)',
                            }}
                          >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Adopted">Adopted</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 text-sm" style={{ color: '#3E1F1A' }}>
                          {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setEditingPet(pet)}
                            className="p-2 rounded transition-colors hover:bg-[#F8DDBF]"
                            style={{ color: '#8A5A48' }}
                            title="Edit listing"
                            aria-label={`Edit ${pet.name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePet(pet._id)}
                            className="p-2 rounded transition-colors hover:bg-[#F8DDBF]"
                            style={{ color: '#B99A86' }}
                            title="Remove listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: APPLICATIONS ── */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div
              className="p-10 text-center rounded-lg border max-w-md mx-auto"
              style={{ background: '#F8DDBF', borderColor: '#EBC9A5' }}
            >
              <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm" style={{ color: '#3E1F1A', fontFamily: "'Fraunces', serif" }}>No applications yet</p>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#8A5A48' }}>
                Applications from prospective adopters will appear here.
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="rounded-lg border p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={app.pet?.photos?.[0]}
                    alt={app.pet?.name}
                    className="w-14 h-14 rounded object-cover shrink-0"
                    style={{ border: '1px solid #EBC9A5' }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium" style={{ color: '#C8795A' }}>
                        For {app.pet?.name}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                    <h4 className="font-semibold text-sm" style={{ color: '#3E1F1A' }}>
                      {app.questionnaire?.fullName || app.adopter?.name}
                    </h4>
                    <p className="text-xs mt-0.5" style={{ color: '#B99A86' }}>
                      {app.questionnaire?.housingType} ({app.questionnaire?.ownership}) · Experience: {app.questionnaire?.petExperience}
                    </p>
                    {app.questionnaire?.reasonForAdopting && (
                      <p className="text-xs mt-2 italic leading-relaxed" style={{ color: '#8A5A48', maxWidth: '48ch' }}>
                        "{app.questionnaire.reasonForAdopting}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="btn-primary text-xs"
                    style={{ height: '2.25rem', padding: '0 0.875rem' }}
                  >
                    Review & decide
                  </button>
                  <button
                    onClick={() => navigate('/messages')}
                    className="btn-secondary text-xs inline-flex items-center gap-1.5"
                    style={{ height: '2.25rem', padding: '0 0.875rem' }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedApplication && (
        <ApplicationReviewModal
          key={selectedApplication._id}
          app={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onChanged={(updated, closed) => {
            setApplications((prev) => prev.map((x) => (x._id === updated._id ? { ...x, ...updated } : x)));
            if (closed) fetchData();
            else setSelectedApplication(updated);
          }}
        />
      )}

      {isAddModalOpen && (
        <AddPetModal onClose={() => setIsAddModalOpen(false)} onCreated={fetchData} />
      )}

      {editingPet && (
        <EditPetModal
          pet={editingPet}
          onClose={() => setEditingPet(null)}
          onSaved={(updated) => {
            setPets((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
            setEditingPet(null);
          }}
        />
      )}
    </DashboardShell>
  );
};
