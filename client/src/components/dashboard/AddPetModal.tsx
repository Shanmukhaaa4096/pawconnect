import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#B99A86' }}>
    {children}
  </label>
);

/** Create-listing form shared by shelters and individual owners. */
export const AddPetModal: React.FC<{ isOwner?: boolean; onClose: () => void; onCreated: () => void }> = ({
  isOwner = false,
  onClose,
  onCreated,
}) => {
  const { user } = useAuth();

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
    rehomingReason: '',
    photos: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    adoptionFee: '60',
    city: user?.location?.city || 'Austin',
    state: user?.location?.state || 'TX',
  });

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
      if (isOwner) formData.append('rehomingReason', newPet.rehomingReason);
      formData.append('adoptionFee', newPet.adoptionFee);
      formData.append('location', JSON.stringify({ city: newPet.city, state: newPet.state }));
      formData.append('health', JSON.stringify(newPet.health));
      formData.append('temperament', JSON.stringify(newPet.temperament.split(',').map((t) => t.trim()).filter(Boolean)));
      formData.append('photos', JSON.stringify([newPet.photos]));
      await api.createPet(formData);
      onClose();
      onCreated();
    } catch (err: any) {
      alert(`Failed to create pet listing: ${err.message}`);
    }
  };

  return (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(37,40,37,0.5)' }}>
          <div
            className="w-full max-w-2xl rounded-lg border p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto"
            style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}
          >
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: '#F8DDBF' }}>
              <div>
                <p className="section-label" style={{ margin: 0 }}>New listing</p>
                <h3 className="font-semibold text-xl mt-0.5" style={{ color: '#3E1F1A', fontFamily: "'Fraunces', serif" }}>
                  {isOwner ? 'List your pet for adoption' : 'Add a pet to your shelter'}
                </h3>
              </div>
              <button
                onClick={() => onClose()}
                className="p-1.5 rounded transition-colors hover:bg-[#F8DDBF]"
                style={{ color: '#8A5A48' }}
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
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#3E1F1A' }}>
                    <input
                      type="checkbox"
                      checked={(newPet.health as any)[key]}
                      onChange={(e) => setNewPet({ ...newPet, health: { ...newPet.health, [key]: e.target.checked } })}
                      className="rounded"
                      style={{ accentColor: '#8E3B22' }}
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

              {isOwner && (
                <div>
                  <FieldLabel>Why are you rehoming? (shown on the listing)</FieldLabel>
                  <textarea
                    rows={2}
                    maxLength={400}
                    value={newPet.rehomingReason}
                    onChange={(e) => setNewPet({ ...newPet, rehomingReason: e.target.value })}
                    placeholder="e.g. Moving abroad and cannot take her with me."
                    className="editorial-input"
                    style={{ height: 'auto', padding: '0.625rem 0.875rem', resize: 'vertical' }}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: '#F8DDBF' }}>
                <button type="button" onClick={() => onClose()} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Publish listing
                </button>
              </div>
            </form>
          </div>
        </div>
  );
};
