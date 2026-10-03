import React, { useState, useEffect } from 'react';
import {
  Plus,
  PawPrint,
  FileText,
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  MessageSquare,
  X,
  Upload,
  Sparkles,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { Pet, Application, PetStatus, ApplicationStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export const ShelterDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pets' | 'applications'>('pets');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // New Pet Form State
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

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle pet status change
  const handlePetStatusChange = async (petId: string, newStatus: PetStatus) => {
    try {
      await api.updatePetStatus(petId, newStatus);
      setPets((prev) =>
        prev.map((p) => (p._id === petId ? { ...p, status: newStatus } : p))
      );
    } catch (err: any) {
      alert(`Could not update pet status: ${err.message}`);
    }
  };

  // Handle pet delete
  const handleDeletePet = async (petId: string) => {
    if (!window.confirm('Are you sure you want to remove this pet listing?')) return;
    try {
      await api.deletePet(petId);
      setPets((prev) => prev.filter((p) => p._id !== petId));
    } catch (err: any) {
      alert(`Failed to delete pet: ${err.message}`);
    }
  };

  // Handle application status update
  const handleUpdateAppStatus = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      setIsUpdatingStatus(true);
      const res = await api.updateApplicationStatus(appId, newStatus, statusUpdateNote);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? res.application : a))
      );
      setSelectedApplication(null);
      setStatusUpdateNote('');
      // Refresh pets in case pet status transitioned to Reserved or Adopted
      fetchData();
    } catch (err: any) {
      alert(`Could not update application: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Create Pet submission
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
      formData.append(
        'temperament',
        JSON.stringify(newPet.temperament.split(',').map((t) => t.trim()).filter(Boolean))
      );
      formData.append('photos', JSON.stringify([newPet.photos]));

      await api.createPet(formData);
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(`Failed to create pet listing: ${err.message}`);
    }
  };

  const pendingApps = applications.filter((a) => a.status === 'Pending');
  const availablePets = pets.filter((p) => p.status === 'Available');
  const adoptedPets = pets.filter((p) => p.status === 'Adopted');

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Shelter Management Console
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {user?.organization?.name || user?.name}
            </h2>
            <p className="text-xs text-slate-500">
              {user?.location?.city}, {user?.location?.state} • License: {user?.organization?.licenseNumber || 'Active NGO'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all shadow-md shadow-orange-600/20"
        >
          <Plus className="w-5 h-5" />
          List New Pet
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Listed</span>
            <PawPrint className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{pets.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Available</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{availablePets.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{pendingApps.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Forever Homes</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2">{adoptedPets.length}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('pets')}
          className={`flex items-center gap-2 py-3 border-b-2 font-bold text-sm transition-colors ${
            activeTab === 'pets'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <PawPrint className="w-4 h-4" />
          <span>Managed Pets ({pets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 py-3 border-b-2 font-bold text-sm transition-colors relative ${
            activeTab === 'applications'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Adoption Applications ({applications.length})</span>
          {pendingApps.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
              {pendingApps.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PET MANAGEMENT */}
      {activeTab === 'pets' && (
        <div className="space-y-4">
          {loading ? (
            <LoadingSpinner label="Loading shelter listings..." />
          ) : pets.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <PawPrint className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Pets Listed Yet</h3>
              <p className="text-xs text-slate-500">
                Click "List New Pet" to showcase animals currently sheltered at your organization.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Pet</th>
                      <th className="px-4 py-4">Species & Breed</th>
                      <th className="px-4 py-4">Age / Gender</th>
                      <th className="px-4 py-4">Current Status</th>
                      <th className="px-4 py-4">Fee</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pets.map((pet) => (
                      <tr key={pet._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={pet.photos[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=150&q=80'}
                            alt={pet.name}
                            className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{pet.name}</p>
                            <p className="text-xs text-slate-500">
                              {pet.location.city}, {pet.location.state}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-700">
                          {pet.species} • {pet.breed}
                        </td>
                        <td className="px-4 py-4 text-slate-600 text-xs">
                          {pet.age} yrs • {pet.gender}
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={pet.status}
                            onChange={(e) =>
                              handlePetStatusChange(pet._id, e.target.value as PetStatus)
                            }
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                              pet.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : pet.status === 'Reserved'
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-purple-50 text-purple-700 border-purple-300'
                            }`}
                          >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Adopted">Adopted</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-800">
                          {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeletePet(pet._id)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete Pet Listing"
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

      {/* TAB 2: APPLICATIONS REVIEW */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No Applications Received</h3>
              <p className="text-xs text-slate-500">
                When prospective adopters apply for your listed pets, their questionnaires will appear here for review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={app.pet?.photos?.[0]}
                      alt={app.pet?.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                          Application for {app.pet?.name}
                        </span>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {app.questionnaire?.fullName || app.adopter?.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">
                        {app.questionnaire?.housingType} ({app.questionnaire?.ownership}) • Experience: {app.questionnaire?.petExperience}
                      </p>
                      <p className="text-xs italic text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                        "{app.questionnaire?.reasonForAdopting}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    >
                      Review & Decide
                    </button>
                    <button
                      onClick={() => navigate(`/messages`)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message Adopter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* REVIEW & DECIDE APPLICATION MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Adoption Review
                </span>
                <h3 className="font-extrabold text-slate-900 text-xl">
                  {selectedApplication.pet?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Applicant:</span>
                <span className="font-bold text-slate-900">{selectedApplication.questionnaire?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Phone:</span>
                <span className="font-bold text-slate-900">{selectedApplication.questionnaire?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Address:</span>
                <span className="font-bold text-slate-900">{selectedApplication.questionnaire?.address || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Household:</span>
                <span className="font-bold text-slate-900">
                  {selectedApplication.questionnaire?.housingType} ({selectedApplication.questionnaire?.ownership})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Other Pets / Kids:</span>
                <span className="font-bold text-slate-900">
                  {selectedApplication.questionnaire?.hasOtherPets ? 'Yes' : 'No'} / {selectedApplication.questionnaire?.hasChildren ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Hours alone daily:</span>
                <span className="font-bold text-slate-900">{selectedApplication.questionnaire?.hoursAlonePerDay} hours</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Reason for Adopting:</span>
                <p className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 italic">
                  "{selectedApplication.questionnaire?.reasonForAdopting}"
                </p>
              </div>
            </div>

            {/* Notes / Feedback */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Shelter Feedback / Reference Note (Shared with Adopter)
              </label>
              <textarea
                rows={2}
                value={statusUpdateNote}
                onChange={(e) => setStatusUpdateNote(e.target.value)}
                placeholder="e.g. Approved for home visit! Vet reference verified."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateAppStatus(selectedApplication._id, 'Approved')}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                Approve (Reserve Pet)
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateAppStatus(selectedApplication._id, 'Completed')}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
              >
                Finalize Adoption
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateAppStatus(selectedApplication._id, 'Rejected')}
                className="py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PET MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Rescue Listing
                </span>
                <h3 className="font-black text-slate-900 text-2xl">Add New Pet to Shelter</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                    placeholder="e.g. Copper"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Species *
                  </label>
                  <select
                    value={newPet.species}
                    onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  >
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Breed *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                    placeholder="e.g. Beagle Mix"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={newPet.gender}
                    onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Size
                  </label>
                  <select
                    value={newPet.size}
                    onChange={(e) => setNewPet({ ...newPet, size: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Extra Large">Extra Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={newPet.city}
                    onChange={(e) => setNewPet({ ...newPet, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Adoption Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPet.adoptionFee}
                    onChange={(e) => setNewPet({ ...newPet, adoptionFee: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Photo URL *
                </label>
                <input
                  type="url"
                  required
                  value={newPet.photos}
                  onChange={(e) => setNewPet({ ...newPet, photos: e.target.value })}
                  placeholder="Paste direct image URL from Unsplash or Cloudinary"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              {/* Temperament */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Temperament Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPet.temperament}
                  onChange={(e) => setNewPet({ ...newPet, temperament: e.target.value })}
                  placeholder="e.g. Playful, Good with Kids, Energetic, Calm"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              {/* Health Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPet.health.vaccinated}
                    onChange={(e) =>
                      setNewPet({
                        ...newPet,
                        health: { ...newPet.health, vaccinated: e.target.checked },
                      })
                    }
                    className="rounded text-orange-600"
                  />
                  Vaccinated
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPet.health.spayedNeutered}
                    onChange={(e) =>
                      setNewPet({
                        ...newPet,
                        health: { ...newPet.health, spayedNeutered: e.target.checked },
                      })
                    }
                    className="rounded text-orange-600"
                  />
                  Spayed / Neutered
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPet.health.microchipped}
                    onChange={(e) =>
                      setNewPet({
                        ...newPet,
                        health: { ...newPet.health, microchipped: e.target.checked },
                      })
                    }
                    className="rounded text-orange-600"
                  />
                  Microchipped
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pet Bio & Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newPet.description}
                  onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                  placeholder="Describe pet personality, habits, history, and ideal home environment..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20"
                >
                  Publish Pet Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
