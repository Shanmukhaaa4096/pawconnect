import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  Building2,
  Calendar,
  Check,
  X as XIcon,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { Pet, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { StatusBadge } from '../components/common/Badge';
import { AdoptionModal } from '../components/pets/AdoptionModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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
        <h2 className="text-2xl font-bold text-slate-900">Pet Profile Not Found</h2>
        <p className="text-slate-500">The pet you are looking for may have been adopted or unlisted.</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Pets
        </Link>
      </div>

      {/* Main Grid: Gallery on left, Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT: PHOTO GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full bg-slate-100 rounded-3xl overflow-hidden shadow-md border border-slate-200">
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
              className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-md ${
                isFav
                  ? 'bg-rose-500 text-white scale-110'
                  : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white backdrop-blur-xs'
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
                      ? 'border-orange-600 ring-2 ring-orange-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* About description card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900">About {pet.name}</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {pet.description}
            </p>

            {/* Health & Medical History */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Medical & Veterinary Records
              </h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {pet.health.medicalHistory || 'Up-to-date with vaccinations and routine examinations.'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: PET ATTRIBUTES & ADOPTION ACTIONS */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Info Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{pet.name}</h1>
                <span className="text-xl font-black text-orange-600">
                  {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
                </span>
              </div>
              <p className="text-base font-semibold text-slate-600 mt-1">{pet.breed}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>
                  {pet.location.city}, {pet.location.state}
                </span>
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Age
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {pet.age} {pet.age === 1 ? 'Year' : 'Years'} ({pet.ageGroup})
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Gender
                </span>
                <span className="font-extrabold text-slate-900 text-sm">{pet.gender}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Size
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {pet.size} {pet.weightKg ? `(${pet.weightKg} kg)` : ''}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Species
                </span>
                <span className="font-extrabold text-slate-900 text-sm">{pet.species}</span>
              </div>
            </div>

            {/* Health & Compatibility Badges */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Health & Good Habits
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {pet.health.vaccinated && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Vaccinated
                  </span>
                )}
                {pet.health.spayedNeutered && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Spayed / Neutered
                  </span>
                )}
                {pet.health.microchipped && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Microchipped
                  </span>
                )}
                {pet.goodWith?.children && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    <Check className="w-3.5 h-3.5" /> Good with Kids
                  </span>
                )}
                {pet.goodWith?.dogs && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                    <Check className="w-3.5 h-3.5" /> Dog Friendly
                  </span>
                )}
                {pet.goodWith?.cats && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-200">
                    <Check className="w-3.5 h-3.5" /> Cat Friendly
                  </span>
                )}
              </div>
            </div>

            {/* Temperament */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Temperament & Personality
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {pet.temperament.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200"
                  >
                    {t}
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
                  className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-base transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Apply to Adopt {pet.name}
                </button>
              ) : (
                <div className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 text-slate-500 text-center font-bold text-sm">
                  This pet is currently {pet.status.toLowerCase()}
                </div>
              )}

              <button
                type="button"
                onClick={handleMessageShelter}
                className="w-full py-3.5 px-6 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-orange-600" />
                Message Shelter Directly
              </button>
            </div>
          </div>

          {/* Shelter Card */}
          {shelter && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4">
              <img
                src={
                  shelter.avatar ||
                  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'
                }
                alt={shelter.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-500/20 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Certified Shelter
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base truncate">
                  {shelter.organization?.name || shelter.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {shelter.location?.city || 'Austin'}, {shelter.location?.state || 'TX'}
                </p>
              </div>

              <Link
                to={`/shelters/${shelter._id}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors shrink-0"
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
