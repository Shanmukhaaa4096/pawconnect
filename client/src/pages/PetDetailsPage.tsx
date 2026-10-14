import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  ShieldCheck,
  Check,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Phone,
  Building2,
  Share2,
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
  <div className="p-3 rounded-2xl bg-[#FDEEEF] border border-[#EAD2D3] text-center">
    <span className="block text-[10px] font-black uppercase tracking-wider text-[#A89898] mb-0.5">
      {label}
    </span>
    <span className="text-xs sm:text-sm font-extrabold text-[#292323]">{value}</span>
  </div>
);

/* Health check pill */
const HealthPill = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
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

  if (loading) return <LoadingSpinner label="Opening pet profile…" />;

  if (!pet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <h2 className="text-2xl font-black text-[#292323]">Pet profile not found</h2>
        <p className="text-sm text-[#736363]">
          This pet may have found their forever home or been unlisted.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C96366] text-white font-bold text-sm shadow hover:bg-[#98494B] transition"
        >
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
    try {
      await toggleFavorite(pet);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMessageShelter = () => {
    if (!user) {
      alert('Please log in to chat with this shelter.');
      navigate('/login');
      return;
    }
    const shelterId = shelter?._id || (pet.shelter as string);
    navigate(`/messages?recipientId=${shelterId}&petId=${pet._id}`);
  };

  const handleApplyClick = () => {
    if (!user) {
      alert('Please sign in to submit an adoption application.');
      navigate('/login');
      return;
    }
    setIsAdoptModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F3E6E6] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#736363] hover:text-[#C96366] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to pet discovery
          </Link>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="p-2 rounded-full bg-white text-[#736363] hover:text-[#C96366] transition shadow-xs"
            title="Share pet profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* ── Screen 6 Main Showcase Layout ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Circular / Rounded Hero Photo Frame */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EAD2D3] shadow-md flex flex-col items-center text-center">
              {/* Circular Pet Photo Hero (Matching Screen 6) */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-[#C96366] shadow-xl bg-[#FDEEEF] mb-4">
                <img
                  src={
                    pet.photos[activePhotoIndex] ||
                    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {pet.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 justify-center max-w-full">
                  {pet.photos.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition ${
                        activePhotoIndex === idx
                          ? 'border-[#C96366] scale-105 shadow'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Pet Title & Basic Info */}
              <h1 className="text-2xl sm:text-3xl font-black text-[#292323] tracking-tight mt-2">
                {pet.name}
              </h1>
              <p className="text-xs font-bold text-[#C96366] uppercase tracking-wider mt-1">
                Age: {pet.age} {pet.age === 1 ? 'Year' : 'Years'} • {pet.breed} • {pet.gender}
              </p>

              {/* Status and Fee Badge */}
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    pet.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#FDEEEF] text-[#98494B]'
                  }`}
                >
                  {pet.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F3E6E6] text-[#292323]">
                  Fee: {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
                </span>
              </div>
            </div>

            {/* Description & Story Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAD2D3] shadow-md space-y-3">
              <h3 className="font-black text-base text-[#292323]">About {pet.name}</h3>
              <p className="text-xs sm:text-sm text-[#736363] leading-relaxed font-medium">
                {pet.description}
              </p>

              {pet.health.medicalHistory && (
                <div className="pt-3 border-t border-[#F4E4E4] space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#A89898]">
                    Medical & Veterinary Records
                  </span>
                  <p className="text-xs text-[#736363] bg-[#FDEEEF] p-3 rounded-xl border border-[#EAD2D3]">
                    {pet.health.medicalHistory}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Attributes, Compatibility, Shelter & Action Buttons */}
          <div className="lg:col-span-6 space-y-4">
            {/* Quick Specs Grid */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAD2D3] shadow-md space-y-5">
              <h3 className="font-black text-base text-[#292323]">Vital Profile</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <AttrCell label="Species" value={pet.species} />
                <AttrCell label="Gender" value={pet.gender} />
                <AttrCell label="Size" value={pet.size} />
                <AttrCell label="Weight" value={pet.weightKg ? `${pet.weightKg} kg` : 'Medium'} />
              </div>

              {/* Health Badges */}
              <div className="pt-2 border-t border-[#F4E4E4] space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#A89898]">
                  Health & Care Verification
                </span>
                <div className="flex flex-wrap gap-2">
                  {pet.health.vaccinated && <HealthPill label="Vaccinated" />}
                  {pet.health.spayedNeutered && <HealthPill label="Spayed / Neutered" />}
                  {pet.health.microchipped && <HealthPill label="Microchipped" />}
                  {pet.goodWith?.children && <HealthPill label="Good with Kids" />}
                  {pet.goodWith?.dogs && <HealthPill label="Dog Friendly" />}
                  {pet.goodWith?.cats && <HealthPill label="Cat Friendly" />}
                </div>
              </div>

              {/* Temperament Tags */}
              {pet.temperament && pet.temperament.length > 0 && (
                <div className="pt-2 border-t border-[#F4E4E4] space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#A89898]">
                    Temperament & Personality
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pet.temperament.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FDEEEF] text-[#C96366] border border-[#EAD2D3]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shelter Provider Card */}
            {shelter && (
              <div className="bg-white rounded-3xl p-5 border border-[#EAD2D3] shadow-md flex items-center gap-4">
                <img
                  src={
                    shelter.avatar ||
                    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={shelter.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[#EAD2D3]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C96366]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C96366]">
                      Certified Shelter
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#292323] truncate">
                    {shelter.organization?.name || shelter.name}
                  </h4>
                  <p className="text-xs text-[#736363] mt-0.5">Rescue Organization</p>
                </div>
                <Link
                  to={`/shelters/${shelter._id}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F3E6E6] text-[#292323] hover:bg-[#C96366] hover:text-white transition shrink-0"
                >
                  View Shelter
                </Link>
              </div>
            )}

            {/* ── Screen 6 Bottom Action Buttons: Heart + ADOPT + Chat ──── */}
            <div className="bg-white rounded-3xl p-5 border border-[#EAD2D3] shadow-md flex items-center gap-3">
              {/* Favorite button */}
              <button
                type="button"
                onClick={handleFavoriteClick}
                className="w-12 h-12 rounded-full border-2 border-[#EAD2D3] hover:border-[#C96366] flex items-center justify-center shrink-0 transition bg-[#FDEEEF]"
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className="w-5 h-5 transition-colors"
                  style={{
                    color: isFav ? '#C96366' : '#736363',
                    fill: isFav ? '#C96366' : 'none',
                  }}
                />
              </button>

              {/* Main Adopt / Order Button */}
              {pet.status === 'Available' ? (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="flex-1 h-12 rounded-full bg-[#C96366] hover:bg-[#98494B] text-white font-black text-sm tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ADOPT {pet.name.toUpperCase()}</span>
                </button>
              ) : (
                <div className="flex-1 h-12 rounded-full bg-gray-200 text-[#736363] font-bold text-xs flex items-center justify-center">
                  Currently {pet.status}
                </div>
              )}

              {/* Message Shelter Button */}
              <button
                type="button"
                onClick={handleMessageShelter}
                className="w-12 h-12 rounded-full bg-[#98494B] hover:bg-[#C96366] text-white flex items-center justify-center shrink-0 transition shadow-md"
                title="Message Shelter Coordinator"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Adoption Questionnaire Modal */}
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
