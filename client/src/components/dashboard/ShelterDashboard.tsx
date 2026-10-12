import React, { useState, useEffect } from 'react';
import {
  Plus, PawPrint, FileText, Clock,
  CheckCircle2, Trash2, MessageSquare, X, Building2,
} from 'lucide-react';
import { Pet, Application, PetStatus, ApplicationStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

/* ─── Shared primitives ─────────────────────────────────────── */

const TabBtn = ({
  active, onClick, icon, label, badge,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 py-3 px-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 relative"
    style={{ borderColor: active ? '#263A32' : 'transparent', color: active ? '#263A32' : '#6B7068' }}
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
    style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#9BA097' }}>{label}</span>
      <span style={{ color }}>{icon}</span>
    </div>
    <p className="text-2xl sm:text-3xl font-semibold" style={{ color, fontFamily: "'Lora', serif" }}>{value}</p>
  </div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#9BA097' }}>
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
  const [activeTab, setActiveTab] = useState<'pets' | 'applications'>('pets');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [newPet, setNewPet] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '1',
    gender: 'Male',
    size: 'Medium',
    weightKg: '15',
    health: { vaccinated: true, spayedNeutered: true, specialNeeds: false, microchipped: true },
    temperament: 'Friendly, Playful, Loyal',
    description: '',
    photos: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    adoptionFee: '60',
    city: user?.location?.city || 'Austin',
    state: user?.location?.state || 'TX',
  });

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

  const handleUpdateAppStatus = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      setIsUpdatingStatus(true);
      const res = await api.updateApplicationStatus(appId, newStatus, statusUpdateNote);
      setApplications((prev) => prev.map((a) => (a._id === appId ? res.application : a)));
      setSelectedApplication(null);
      setStatusUpdateNote('');
      fetchData();
    } catch (err: any) {
      alert(`Could not update application: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newPet.name);
      formData.append('species', newPet.species);
      formData.append('breed', newPet.breed);
      formData.append('age', newPet.age);
      formData.append('gender', newPet.gender);
      formData.append('size', newPet.size);
      formData.append('weightKg', newPet.weightKg);
      formData.append('description', newPet.description);
      formData.append('adoptionFee', newPet.adoptionFee);
      formData.append('location', JSON.stringify({ city: newPet.city, state: newPet.state }));
      formData.append('health', JSON.stringify(newPet.health));
      formData.append('temperament', JSON.stringify(newPet.temperament.split(',').map((t) => t.trim()).filter(Boolean)));
      formData.append('photos', JSON.stringify([newPet.photos]));
      await api.createPet(formData);
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(`Failed to create pet listing: ${err.message}`);
    }
  };

  const pendingApps     = applications.filter((a) => a.status === 'Pending');
  const availablePets   = pets.filter((p) => p.status === 'Available');
  const adoptedPets     = pets.filter((p) => p.status === 'Adopted');

  return (
    <div className="space-y-6">

      {/* Profile banner */}
      <div
        className="rounded-lg border p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
        style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded flex items-center justify-center shrink-0"
            style={{ background: '#EAECE4' }}
          >
            <Building2 className="w-6 h-6" style={{ color: '#263A32' }} />
          </div>
          <div>
            <p className="section-label" style={{ margin: 0 }}>Rescue management portal</p>
            <h2 className="text-lg font-semibold mt-0.5" style={{ color: '#252825', fontFamily: "'Lora', serif" }}>
              {user?.organization?.name || user?.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs" style={{ color: '#9BA097' }}>
                {user?.location?.city}, {user?.location?.state} · Licence: {user?.organization?.licenseNumber || 'Active NGO'}
              </p>
              {user?.organization?.verified ? (
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#263A32]/10 text-[#263A32]">
                  Verified
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#9BA097]/15 text-[#6B7068]">
                  Verification Pending
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn-primary shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          <span>List new pet</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard label="Total listed"     value={pets.length}          icon={<PawPrint className="w-4 h-4" />}     color="#252825" />
        <MetricCard label="Available"        value={availablePets.length} icon={<span className="w-2 h-2 rounded-full bg-[#263A32] inline-block animate-pulse" />} color="#263A32" />
        <MetricCard label="Pending requests" value={pendingApps.length}   icon={<Clock className="w-4 h-4" />}        color="#C8795A" />
        <MetricCard label="Adopted"          value={adoptedPets.length}   icon={<CheckCircle2 className="w-4 h-4" />} color="#6B7068" />
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-1 overflow-x-auto pb-px" style={{ borderColor: '#DDE0D8' }}>
        <TabBtn
          active={activeTab === 'pets'}
          onClick={() => setActiveTab('pets')}
          icon={<PawPrint className="w-4 h-4" />}
          label={`Pets (${pets.length})`}
        />
        <TabBtn
          active={activeTab === 'applications'}
          onClick={() => setActiveTab('applications')}
          icon={<FileText className="w-4 h-4" />}
          label={`Applications (${applications.length})`}
          badge={pendingApps.length}
        />
      </div>

      {/* ── TAB 1: PET MANAGEMENT ── */}
      {activeTab === 'pets' && (
        <div>
          {loading ? (
            <LoadingSpinner label="Loading listings…" />
          ) : pets.length === 0 ? (
            <div
              className="p-10 text-center rounded-lg border max-w-md mx-auto"
              style={{ background: '#EAECE4', borderColor: '#DDE0D8' }}
            >
              <PawPrint className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm" style={{ color: '#252825', fontFamily: "'Lora', serif" }}>No pets listed yet</p>
              <p className="text-xs mt-1.5" style={{ color: '#6B7068' }}>Click "List new pet" to add your first companion.</p>
            </div>
          ) : (
            <div
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: '#DDE0D8' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead
                    className="text-[10px] font-semibold uppercase tracking-widest border-b"
                    style={{ background: '#F7F5EF', color: '#9BA097', borderColor: '#DDE0D8' }}
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
                        className="border-b transition-colors hover:bg-[#F7F5EF]"
                        style={{ borderColor: i < pets.length - 1 ? '#E8EBE3' : 'transparent' }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={pet.photos[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=150&q=80'}
                              alt={pet.name}
                              className="w-10 h-10 rounded object-cover shrink-0"
                              style={{ border: '1px solid #DDE0D8' }}
                            />
                            <div>
                              <p className="font-medium text-sm" style={{ color: '#252825' }}>{pet.name}</p>
                              <p className="text-xs" style={{ color: '#9BA097' }}>{pet.location.city}, {pet.location.state}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm" style={{ color: '#6B7068' }}>{pet.species} · {pet.breed}</td>
                        <td className="px-4 py-4 text-xs" style={{ color: '#9BA097' }}>{pet.age} yrs · {pet.gender}</td>
                        <td className="px-4 py-4">
                          <select
                            value={pet.status}
                            onChange={(e) => handlePetStatusChange(pet._id, e.target.value as PetStatus)}
                            className="text-xs font-medium px-2.5 py-1 rounded border cursor-pointer focus:outline-none"
                            style={{
                              background: pet.status === 'Available' ? 'rgba(38,58,50,0.08)' : pet.status === 'Reserved' ? 'rgba(200,121,90,0.08)' : 'rgba(107,112,104,0.08)',
                              color:      pet.status === 'Available' ? '#263A32' : pet.status === 'Reserved' ? '#9B5A3A' : '#6B7068',
                              borderColor: pet.status === 'Available' ? 'rgba(38,58,50,0.2)' : pet.status === 'Reserved' ? 'rgba(200,121,90,0.2)' : 'rgba(107,112,104,0.2)',
                            }}
                          >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Adopted">Adopted</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 text-sm" style={{ color: '#252825' }}>
                          {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeletePet(pet._id)}
                            className="p-2 rounded transition-colors hover:bg-[#EAECE4]"
                            style={{ color: '#9BA097' }}
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
              style={{ background: '#EAECE4', borderColor: '#DDE0D8' }}
            >
              <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm" style={{ color: '#252825', fontFamily: "'Lora', serif" }}>No applications yet</p>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#6B7068' }}>
                Applications from prospective adopters will appear here.
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="rounded-lg border p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={app.pet?.photos?.[0]}
                    alt={app.pet?.name}
                    className="w-14 h-14 rounded object-cover shrink-0"
                    style={{ border: '1px solid #DDE0D8' }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium" style={{ color: '#C8795A' }}>
                        For {app.pet?.name}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                    <h4 className="font-semibold text-sm" style={{ color: '#252825' }}>
                      {app.questionnaire?.fullName || app.adopter?.name}
                    </h4>
                    <p className="text-xs mt-0.5" style={{ color: '#9BA097' }}>
                      {app.questionnaire?.housingType} ({app.questionnaire?.ownership}) · Experience: {app.questionnaire?.petExperience}
                    </p>
                    {app.questionnaire?.reasonForAdopting && (
                      <p className="text-xs mt-2 italic leading-relaxed" style={{ color: '#6B7068', maxWidth: '48ch' }}>
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

      {/* ── REVIEW APPLICATION MODAL ── */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(37,40,37,0.5)' }}>
          <div
            className="w-full max-w-xl rounded-lg border p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
            style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
          >
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: '#E8EBE3' }}>
              <div>
                <p className="section-label" style={{ margin: 0 }}>Adoption review</p>
                <h3 className="font-semibold text-lg mt-0.5" style={{ color: '#252825', fontFamily: "'Lora', serif" }}>
                  {selectedApplication.pet?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 rounded transition-colors hover:bg-[#EAECE4]"
                style={{ color: '#6B7068' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded border p-4 space-y-2.5 text-xs" style={{ background: '#F7F5EF', borderColor: '#DDE0D8' }}>
              {[
                { label: 'Applicant',     value: selectedApplication.questionnaire?.fullName },
                { label: 'Phone',         value: selectedApplication.questionnaire?.phone },
                { label: 'Address',       value: selectedApplication.questionnaire?.address || 'Not provided' },
                { label: 'Household',     value: `${selectedApplication.questionnaire?.housingType} (${selectedApplication.questionnaire?.ownership})` },
                { label: 'Other pets / children', value: `${selectedApplication.questionnaire?.hasOtherPets ? 'Yes' : 'No'} / ${selectedApplication.questionnaire?.hasChildren ? 'Yes' : 'No'}` },
                { label: 'Hours alone daily', value: `${selectedApplication.questionnaire?.hoursAlonePerDay} hours` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="font-medium shrink-0" style={{ color: '#9BA097' }}>{label}</span>
                  <span className="text-right" style={{ color: '#252825' }}>{value}</span>
                </div>
              ))}
              <div>
                <span className="font-medium block mb-1.5" style={{ color: '#9BA097' }}>Reason for adopting</span>
                <p className="text-xs italic leading-relaxed p-3 rounded border" style={{ background: '#FFFFFF', borderColor: '#DDE0D8', color: '#6B7068' }}>
                  "{selectedApplication.questionnaire?.reasonForAdopting}"
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <FieldLabel>Shelter feedback note (shared with adopter)</FieldLabel>
              <textarea
                rows={2}
                value={statusUpdateNote}
                onChange={(e) => setStatusUpdateNote(e.target.value)}
                placeholder="e.g. Approved for home visit — vet reference verified."
                className="editorial-input"
                style={{ height: 'auto', padding: '0.625rem 0.875rem', resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateAppStatus(selectedApplication._id, 'Approved')}
                className="py-2.5 px-3 rounded text-white text-xs font-medium transition-colors disabled:opacity-60"
                style={{ background: '#263A32' }}
              >
                Approve (reserve)
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateAppStatus(selectedApplication._id, 'Completed')}
                className="py-2.5 px-3 rounded text-white text-xs font-medium transition-colors disabled:opacity-60"
                style={{ background: '#4A6659' }}
              >
                Finalise adoption
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateAppStatus(selectedApplication._id, 'Rejected')}
                className="py-2.5 px-3 rounded text-xs font-medium transition-colors disabled:opacity-60 border"
                style={{ background: 'rgba(200,121,90,0.08)', color: '#9B5A3A', borderColor: 'rgba(200,121,90,0.25)' }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD NEW PET MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(37,40,37,0.5)' }}>
          <div
            className="w-full max-w-2xl rounded-lg border p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto"
            style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
          >
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: '#E8EBE3' }}>
              <div>
                <p className="section-label" style={{ margin: 0 }}>New listing</p>
                <h3 className="font-semibold text-xl mt-0.5" style={{ color: '#252825', fontFamily: "'Lora', serif" }}>
                  Add a pet to your shelter
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded transition-colors hover:bg-[#EAECE4]"
                style={{ color: '#6B7068' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Pet name *</FieldLabel>
                  <input type="text" required value={newPet.name} onChange={(e) => setNewPet({ ...newPet, name: e.target.value })} placeholder="e.g. Copper" className="editorial-input" />
                </div>
                <div>
                  <FieldLabel>Species *</FieldLabel>
                  <select value={newPet.species} onChange={(e) => setNewPet({ ...newPet, species: e.target.value })} className="editorial-input cursor-pointer">
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Breed *</FieldLabel>
                  <input type="text" required value={newPet.breed} onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })} placeholder="e.g. Beagle Mix" className="editorial-input" />
                </div>
                <div>
                  <FieldLabel>Age (years) *</FieldLabel>
                  <input type="number" step="0.1" min="0" required value={newPet.age} onChange={(e) => setNewPet({ ...newPet, age: e.target.value })} className="editorial-input" />
                </div>
                <div>
                  <FieldLabel>Gender *</FieldLabel>
                  <select value={newPet.gender} onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })} className="editorial-input cursor-pointer">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Size</FieldLabel>
                  <select value={newPet.size} onChange={(e) => setNewPet({ ...newPet, size: e.target.value })} className="editorial-input cursor-pointer">
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Extra Large">Extra Large</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <input type="text" required value={newPet.city} onChange={(e) => setNewPet({ ...newPet, city: e.target.value })} className="editorial-input" />
                </div>
                <div>
                  <FieldLabel>Adoption fee ($)</FieldLabel>
                  <input type="number" min="0" value={newPet.adoptionFee} onChange={(e) => setNewPet({ ...newPet, adoptionFee: e.target.value })} className="editorial-input" />
                </div>
              </div>

              <div>
                <FieldLabel>Photo URL *</FieldLabel>
                <input type="url" required value={newPet.photos} onChange={(e) => setNewPet({ ...newPet, photos: e.target.value })} placeholder="Paste direct image URL" className="editorial-input" />
              </div>

              <div>
                <FieldLabel>Temperament tags (comma-separated)</FieldLabel>
                <input type="text" value={newPet.temperament} onChange={(e) => setNewPet({ ...newPet, temperament: e.target.value })} placeholder="e.g. Playful, Good with kids, Calm" className="editorial-input" />
              </div>

              <div className="flex flex-wrap gap-5 pt-1">
                {[
                  { key: 'vaccinated',     label: 'Vaccinated' },
                  { key: 'spayedNeutered', label: 'Spayed / Neutered' },
                  { key: 'microchipped',   label: 'Microchipped' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#252825' }}>
                    <input
                      type="checkbox"
                      checked={(newPet.health as any)[key]}
                      onChange={(e) => setNewPet({ ...newPet, health: { ...newPet.health, [key]: e.target.checked } })}
                      className="rounded"
                      style={{ accentColor: '#263A32' }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div>
                <FieldLabel>Pet bio & personality *</FieldLabel>
                <textarea
                  rows={3}
                  required
                  value={newPet.description}
                  onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                  placeholder="Describe personality, habits, history, and ideal home…"
                  className="editorial-input"
                  style={{ height: 'auto', padding: '0.625rem 0.875rem', resize: 'vertical' }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E8EBE3' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
