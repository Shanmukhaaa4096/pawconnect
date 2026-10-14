import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Pet, PetStatus } from '../../types';
import { api } from '../../services/api';

const input =
  'w-full h-10 px-3 rounded-lg bg-white border-2 border-[#EBC9A5] text-sm text-[#3E1F1A] focus:outline-none focus:border-[#C2572F]';

const L: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="block text-[10px] font-black uppercase tracking-widest text-[#8A5A48] mb-1">{label}</span>
    {children}
  </label>
);

export const EditPetModal: React.FC<{ pet: Pet; showRehoming?: boolean; onClose: () => void; onSaved: (pet: Pet) => void }> = ({
  pet,
  showRehoming = false,
  onClose,
  onSaved,
}) => {
  const [f, setF] = useState({
    name: pet.name,
    breed: pet.breed,
    age: String(pet.age),
    adoptionFee: String(pet.adoptionFee ?? 0),
    status: pet.status as PetStatus,
    description: pet.description,
    rehomingReason: pet.rehomingReason || '',
    temperament: (pet.temperament || []).join(', '),
    photo: pet.photos?.[0] || '',
    city: pet.location?.city || '',
    state: pet.location?.state || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.breed.trim()) {
      setError('Name and breed are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await api.updatePet(pet._id, {
        name: f.name.trim(),
        breed: f.breed.trim(),
        age: Number(f.age) || 0,
        adoptionFee: Number(f.adoptionFee) || 0,
        status: f.status,
        description: f.description,
        ...(showRehoming && { rehomingReason: f.rehomingReason }),
        temperament: f.temperament.split(',').map((t) => t.trim()).filter(Boolean),
        photos: f.photo.trim() ? [f.photo.trim(), ...(pet.photos || []).slice(1)] : pet.photos,
        location: { ...pet.location, city: f.city.trim(), state: f.state.trim() },
      });
      onSaved({ ...pet, ...res.pet });
    } catch (err: any) {
      setError(err.message || 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#3E1F1A]/50 flex items-center justify-center p-4" onMouseDown={onClose}>
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${pet.name}`}
        className="bg-[#FCE8D0] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-[#EBC9A5] p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-[#8E3B22]" style={{ fontFamily: 'var(--font-serif)' }}>
            Edit {pet.name}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-[#F8DDBF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <L label="Name"><input className={input} value={f.name} onChange={set('name')} /></L>
          <L label="Breed"><input className={input} value={f.breed} onChange={set('breed')} /></L>
          <L label="Age (years)"><input type="number" min="0" step="0.1" className={input} value={f.age} onChange={set('age')} /></L>
          <L label="Adoption fee ($)"><input type="number" min="0" className={input} value={f.adoptionFee} onChange={set('adoptionFee')} /></L>
          <L label="City"><input className={input} value={f.city} onChange={set('city')} /></L>
          <L label="State"><input className={input} value={f.state} onChange={set('state')} /></L>
        </div>
        <L label="Status">
          <select className={input} value={f.status} onChange={set('status')}>
            <option>Available</option>
            <option>Reserved</option>
            <option>Adopted</option>
          </select>
        </L>
        <L label="Main photo URL"><input className={input} value={f.photo} onChange={set('photo')} /></L>
        <L label="Temperament (comma separated)"><input className={input} value={f.temperament} onChange={set('temperament')} /></L>
        <L label="Description">
          <textarea className={`${input} h-28 py-2 resize-none`} value={f.description} onChange={set('description')} />
        </L>

        {showRehoming && (
          <L label="Why are you rehoming?">
            <textarea className={`${input} h-20 py-2 resize-none`} maxLength={400} value={f.rehomingReason} onChange={set('rehomingReason')} />
          </L>
        )}

        {error && <p role="alert" className="text-sm font-bold text-[#B3261E]">{error}</p>}

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border-2 border-[#EBC9A5] text-sm font-extrabold text-[#8A5A48]">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-[#C2572F] hover:bg-[#8E3B22] disabled:opacity-60 text-white text-sm font-extrabold"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
