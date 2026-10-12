import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, MapPin, ShieldCheck, Check, MessageSquare, ArrowLeft,
} from 'lucide-react';
import { Pet, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { StatusBadge } from '../components/common/Badge';
import { AdoptionModal } from '../components/pets/AdoptionModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

/* Attribute cell */
const AttrCell = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3.5 rounded border" style={{ background: '#F7F5EF', borderColor: '#DDE0D8' }}>
    <span className="block text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9BA097' }}>
      {label}
    </span>
    <span className="text-sm font-medium" style={{ color: '#252825' }}>{value}</span>
  </div>
);

/* Health check pill */
const HealthPill = ({ label }: { label: string }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium"
    style={{ background: 'rgba(38,58,50,0.10)', color: '#263A32' }}
  >
    <Check className="w-3 h-3" />
    {label}
  </span>
);

export const PetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.getPetById(id);
        setPet(res.pet);
      } catch (err) {
        console.error('Failed to load pet:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading pet profile…" />;

  if (!pet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.5rem', color: '#252825' }}>
          Pet profile not found
        </h2>
        <p className="text-sm" style={{ color: '#6B7068' }}>
          This pet may have found their forever home or been unlisted.
        </p>
        <Link to="/browse" className="btn-primary inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <ArrowLeft className="w-4 h-4" />
          Browse other pets
        </Link>
      </div>
    );
  }

  const shelter = pet.shelter as User;
  const isFav = isFavorite(pet._id);

  const handleFavoriteClick = async () => {
    if (!user) {
      alert('Please log in as an adopter to save pets to your favourites list.');
      return;
    }
    try { await toggleFavorite(pet); } catch (err: any) { alert(err.message); }
  };

  const handleMessageShelter = () => {
    if (!user) { alert('Please log in to chat with this shelter.'); navigate('/login'); return; }
    const shelterId = shelter?._id || (pet.shelter as string);
    navigate(`/messages?recipientId=${shelterId}&petId=${pet._id}`);
  };

  const handleApplyClick = () => {
    if (!user) { alert('Please sign in to submit an adoption application.'); navigate('/login'); return; }
    setIsAdoptModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ background: '#F7F5EF' }}>

      {/* Back */}
      <div className="mb-8">
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: '#6B7068', textDecoration: 'none' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all pets
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* LEFT: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main photo */}
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: '0.75rem', aspectRatio: '4/3', background: '#EAECE4' }}
          >
            <img
              src={pet.photos[activePhotoIndex] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80'}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3.5 left-3.5">
              <StatusBadge status={pet.status} size="lg" />
            </div>
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3.5 right-3.5 p-2.5 rounded-full transition-all"
              style={{
                background: isFav ? '#263A32' : 'rgba(255,255,255,0.92)',
                color: isFav ? '#FFFFFF' : '#9BA097',
                backdropFilter: 'blur(4px)',
              }}
              title={isFav ? 'Remove from favourites' : 'Save to favourites'}
            >
              <Heart className="w-4.5 h-4.5" style={{ width: '1.125rem', height: '1.125rem', fill: isFav ? 'currentColor' : 'none' }} />
            </button>
          </div>

          {/* Thumbnails */}
          {pet.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {pet.photos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className="w-20 h-20 rounded overflow-hidden border-2 shrink-0 transition-all"
                  style={{
                    borderColor: activePhotoIndex === idx ? '#263A32' : '#DDE0D8',
                    opacity: activePhotoIndex === idx ? 1 : 0.65,
                  }}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* About / Description */}
          <div
            className="rounded-lg border p-6 sm:p-8 space-y-5"
            style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
          >
            <h3 style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: '1.25rem', color: '#252825' }}>
              About {pet.name}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7068' }}>
              {pet.description}
            </p>

            {pet.health.medicalHistory && (
              <div className="pt-4 border-t space-y-2" style={{ borderColor: '#E8EBE3' }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#9BA097' }}>
                  Medical & veterinary records
                </p>
                <p
                  className="text-sm p-4 rounded border leading-relaxed"
                  style={{ background: '#F7F5EF', borderColor: '#DDE0D8', color: '#6B7068' }}
                >
                  {pet.health.medicalHistory}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Details & actions */}
        <div className="lg:col-span-5 space-y-5">

          {/* Main info */}
          <div
            className="rounded-lg border p-6 sm:p-7 space-y-5"
            style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1
                  style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: 'clamp(1.625rem, 4vw, 2.25rem)', color: '#252825', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                >
                  {pet.name}
                </h1>
                <span
                  className="shrink-0 px-3 py-1 rounded text-sm font-semibold"
                  style={{ background: '#EAECE4', color: '#263A32' }}
                >
                  {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: '#9BA097' }}>{pet.breed}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: '#9BA097' }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: '#C8795A' }} />
                <span>{pet.location.city}, {pet.location.state}</span>
              </div>
            </div>

            {/* Attributes grid */}
            <div className="grid grid-cols-2 gap-2">
              <AttrCell label="Age" value={`${pet.age} ${pet.age === 1 ? 'year' : 'years'} (${pet.ageGroup})`} />
              <AttrCell label="Gender" value={pet.gender} />
              <AttrCell label="Size" value={`${pet.size}${pet.weightKg ? ` · ${pet.weightKg} kg` : ''}`} />
              <AttrCell label="Species" value={pet.species} />
            </div>

            {/* Health badges */}
            <div className="pt-1 border-t space-y-2.5" style={{ borderColor: '#E8EBE3' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#9BA097' }}>Health & compatibility</p>
              <div className="flex flex-wrap gap-1.5">
                {pet.health.vaccinated       && <HealthPill label="Vaccinated" />}
                {pet.health.spayedNeutered   && <HealthPill label="Spayed / Neutered" />}
                {pet.health.microchipped     && <HealthPill label="Microchipped" />}
                {pet.goodWith?.children      && <HealthPill label="Good with kids" />}
                {pet.goodWith?.dogs          && <HealthPill label="Dog-friendly" />}
                {pet.goodWith?.cats          && <HealthPill label="Cat-friendly" />}
              </div>
            </div>

            {/* Temperament */}
            <div className="pt-1 border-t space-y-2.5" style={{ borderColor: '#E8EBE3' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#9BA097' }}>Temperament</p>
              <div className="flex flex-wrap gap-1.5">
                {pet.temperament.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded text-xs font-medium"
                    style={{ background: '#EAECE4', color: '#6B7068' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 space-y-2.5">
              {pet.status === 'Available' ? (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="btn-primary w-full text-sm"
                  style={{ height: '3rem' }}
                >
                  Apply to adopt {pet.name}
                </button>
              ) : (
                <div
                  className="w-full py-3 px-4 rounded text-sm text-center"
                  style={{ background: '#EAECE4', color: '#6B7068', border: '1px solid #DDE0D8' }}
                >
                  This pet is currently {pet.status.toLowerCase()}
                </div>
              )}
              <button
                type="button"
                onClick={handleMessageShelter}
                className="btn-secondary w-full text-sm"
                style={{ height: '3rem' }}
              >
                <MessageSquare className="w-4 h-4" />
                Message shelter
              </button>
            </div>
          </div>

          {/* Shelter card */}
          {shelter && (
            <div
              className="rounded-lg border p-4 flex items-center gap-4"
              style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
            >
              <img
                src={shelter.avatar || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
                alt={shelter.name}
                className="w-14 h-14 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#263A32' }} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#263A32' }}>
                    Certified shelter
                  </span>
                </div>
                <h4 className="font-semibold text-sm truncate" style={{ color: '#252825' }}>
                  {shelter.organization?.name || shelter.name}
                </h4>
                <p className="text-xs mt-0.5" style={{ color: '#9BA097' }}>
                  {shelter.location?.city || 'Austin'}, {shelter.location?.state || 'TX'}
                </p>
              </div>
              <Link
                to={`/shelters/${shelter._id}`}
                className="btn-secondary text-xs shrink-0"
                style={{ textDecoration: 'none', height: '2.25rem', padding: '0 0.875rem', fontSize: '0.8125rem' }}
              >
                Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {isAdoptModalOpen && (
        <AdoptionModal
          pet={pet}
          isOpen={isAdoptModalOpen}
          onClose={() => setIsAdoptModalOpen(false)}
        />
      )}
    </div>
  );
};
