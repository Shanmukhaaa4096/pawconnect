import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  ShieldCheck,
  Check,
  MessageSquare,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Pet, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { StatusBadge } from '../components/common/Badge';
import { AdoptionModal } from '../components/pets/AdoptionModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { KawaiiPaw, KawaiiSparkle } from '../components/common/KawaiiIcons';

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

  if (loading) {
    return <LoadingSpinner label="Loading companion profile..." />;
  }

  if (!pet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-[#2B2523]">Pet Profile Not Found</h2>
        <p className="text-[#7A6E68]">The pet you are looking for may have found their forever home or been unlisted.</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#FF7E67] hover:bg-[#F26B53] text-white font-extrabold text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Other Pets
        </Link>
      </div>
    );
  }

  const shelter = pet.shelter as User;
  const isFav = isFavorite(pet._id);

  const handleFavoriteClick = async () => {
    if (!user) {
      alert('Please log in as an adopter to save pets to your favorites!');
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
      alert('Please log in to chat directly with this pet shelter!');
      navigate('/login');
      return;
    }
    const shelterId = shelter?._id || (pet.shelter as string);
    navigate(`/messages?recipientId=${shelterId}&petId=${pet._id}`);
  };

  const handleApplyClick = () => {
    if (!user) {
      alert('Please sign in or create an adopter account to submit an adoption application!');
      navigate('/login');
      return;
    }
    setIsAdoptModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EDE6DC] text-xs font-extrabold text-[#5C524E] hover:text-[#FF7E67] hover:border-[#FF7E67] transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Pets
        </Link>
      </div>

      {/* Main Grid: Gallery on left, Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT: PHOTO GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full bg-[#FFF6EC] rounded-[2rem] overflow-hidden shadow-sm border border-[#EDE6DC]">
            <img
              src={
                pet.photos[activePhotoIndex] ||
                'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80'
              }
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <StatusBadge status={pet.status} size="lg" />
            </div>

            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-4 right-4 p-3 rounded-2xl transition-all shadow-md active:scale-90 ${
                isFav
                  ? 'bg-[#FF7E67] text-white scale-105'
                  : 'bg-white/90 text-[#5C524E] hover:text-[#FF7E67] hover:bg-white backdrop-blur-xs'
              }`}
              title={isFav ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {pet.photos.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {pet.photos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activePhotoIndex === idx
                      ? 'border-[#FF7E67] ring-2 ring-[#FF7E67]/25'
                      : 'border-[#EDE6DC] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* About description card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE6DC] shadow-xs space-y-5">
            <div className="flex items-center gap-2">
              <KawaiiPaw className="w-5 h-5 text-[#FF7E67]" />
              <h3 className="text-xl font-black text-[#2B2523]">Meet {pet.name}</h3>
            </div>
            <p className="text-[#5C524E] text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
              {pet.description}
            </p>

            {/* Health & Medical History */}
            <div className="pt-4 border-t border-[#EDE6DC] space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#A49B95]">
                Medical & Veterinary Records
              </h4>
              <p className="text-xs text-[#5C524E] bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE6DC] leading-relaxed">
                {pet.health.medicalHistory || 'Up-to-date with essential vaccinations and gentle routine examinations.'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: PET ATTRIBUTES & ADOPTION ACTIONS */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Info Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE6DC] shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-3xl sm:text-4xl font-black text-[#2B2523] tracking-tight">{pet.name}</h1>
                <span className="text-xl font-black text-[#FF7E67] px-3 py-1 bg-[#FFF2EE] rounded-full border border-[#FCD7CE]">
                  {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
                </span>
              </div>
              <p className="text-base font-bold text-[#5C524E] mt-1">{pet.breed}</p>
              <div className="flex items-center gap-1.5 text-xs text-[#7A6E68] mt-2 font-medium">
                <MapPin className="w-4 h-4 text-[#FF7E67]" />
                <span>
                  {pet.location.city}, {pet.location.state}
                </span>
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE6DC]">
                <span className="text-[#A49B95] font-black block uppercase tracking-wider text-[10px]">
                  Age
                </span>
                <span className="font-extrabold text-[#2B2523] text-sm">
                  {pet.age} {pet.age === 1 ? 'Year' : 'Years'} ({pet.ageGroup})
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE6DC]">
                <span className="text-[#A49B95] font-black block uppercase tracking-wider text-[10px]">
                  Gender
                </span>
                <span className="font-extrabold text-[#2B2523] text-sm">{pet.gender}</span>
              </div>

              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE6DC]">
                <span className="text-[#A49B95] font-black block uppercase tracking-wider text-[10px]">
                  Size
                </span>
                <span className="font-extrabold text-[#2B2523] text-sm">
                  {pet.size} {pet.weightKg ? `(${pet.weightKg} kg)` : ''}
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EDE6DC]">
                <span className="text-[#A49B95] font-black block uppercase tracking-wider text-[10px]">
                  Species
                </span>
                <span className="font-extrabold text-[#2B2523] text-sm">{pet.species}</span>
              </div>
            </div>

            {/* Health & Compatibility Badges */}
            <div className="space-y-3 pt-2 border-t border-[#EDE6DC]">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#A49B95]">
                Health & Good Habits
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {pet.health.vaccinated && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F5] text-[#1C6C57] font-bold border border-[#CCE8DF]">
                    <Check className="w-3.5 h-3.5" /> Vaccinated
                  </span>
                )}
                {pet.health.spayedNeutered && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F5] text-[#1C6C57] font-bold border border-[#CCE8DF]">
                    <Check className="w-3.5 h-3.5" /> Spayed / Neutered
                  </span>
                )}
                {pet.health.microchipped && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F5] text-[#1C6C57] font-bold border border-[#CCE8DF]">
                    <Check className="w-3.5 h-3.5" /> Microchipped
                  </span>
                )}
                {pet.goodWith?.children && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F1FD] text-[#4844B3] font-bold border border-[#DFDCF7]">
                    <Check className="w-3.5 h-3.5" /> Good with Kids
                  </span>
                )}
                {pet.goodWith?.dogs && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F1FD] text-[#4844B3] font-bold border border-[#DFDCF7]">
                    <Check className="w-3.5 h-3.5" /> Dog Friendly
                  </span>
                )}
                {pet.goodWith?.cats && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F1FD] text-[#4844B3] font-bold border border-[#DFDCF7]">
                    <Check className="w-3.5 h-3.5" /> Cat Friendly
                  </span>
                )}
              </div>
            </div>

            {/* Temperament */}
            <div className="space-y-2 pt-2 border-t border-[#EDE6DC]">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#A49B95]">
                Temperament & Personality
              </h4>
              <div className="flex flex-wrap gap-2">
                {pet.temperament.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF6EC] text-[#965B20] border border-[#F8E2CA]"
                  >
                    🐾 {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="pt-4 space-y-3">
              {pet.status === 'Available' ? (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="w-full py-4 px-6 rounded-2xl bg-[#FF7E67] hover:bg-[#F26B53] text-white font-black text-base transition-all shadow-md shadow-[#FF7E67]/25 flex items-center justify-center gap-2 active:scale-98"
                >
                  <KawaiiSparkle className="w-5 h-5 text-white" />
                  Apply to Adopt {pet.name}
                </button>
              ) : (
                <div className="w-full py-3.5 px-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE6DC] text-[#7A6E68] text-center font-bold text-sm">
                  This pet is currently {pet.status.toLowerCase()}
                </div>
              )}

              <button
                type="button"
                onClick={handleMessageShelter}
                className="w-full py-3.5 px-6 rounded-2xl border border-[#EDE6DC] hover:border-[#FF7E67] bg-white text-[#2B2523] font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-98"
              >
                <MessageSquare className="w-4 h-4 text-[#FF7E67]" />
                Message Shelter Directly
              </button>
            </div>
          </div>

          {/* Shelter Card */}
          {shelter && (
            <div className="bg-white rounded-3xl p-6 border border-[#EDE6DC] shadow-xs flex items-center gap-4">
              <img
                src={
                  shelter.avatar ||
                  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'
                }
                alt={shelter.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#FF7E67]/20 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1C6C57] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Certified Shelter
                  </span>
                </div>
                <h4 className="font-black text-[#2B2523] text-base truncate">
                  {shelter.organization?.name || shelter.name}
                </h4>
                <p className="text-xs text-[#7A6E68] font-medium">
                  {shelter.location?.city || 'Austin'}, {shelter.location?.state || 'TX'}
                </p>
              </div>

              <Link
                to={`/shelters/${shelter._id}`}
                className="px-4 py-2 rounded-2xl text-xs font-black bg-[#FAF7F2] hover:bg-[#FFF2EE] hover:text-[#FF7E67] text-[#2B2523] border border-[#EDE6DC] transition-all shrink-0"
              >
                Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Adoption Modal */}
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

