import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Pet } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

interface PetCardProps {
  pet: Pet;
  onFavoriteClick?: (pet: Pet) => void;
  /** Show the favourite heart and the "Meet" link (other pages). Landing page turns this off. */
  showActions?: boolean;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, showActions = true }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const favorited = isFavorite(pet._id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const mainPhoto =
    pet.photos && pet.photos.length > 0
      ? pet.photos[0]
      : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80';

  const isAvailable = pet.status === 'Available';

  return (
    <article className="bg-white rounded-2xl border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] hover:shadow-[7px_7px_0_#4A2218] hover:-translate-x-0.5 hover:-translate-y-1 hover:-rotate-[0.6deg] transition-all duration-200 overflow-hidden flex flex-col group">
      {/* ── Photo ──────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-[#FFF3E2] border-b-2 border-[#4A2218]">
        <img
          src={mainPhoto}
          alt={`${pet.name} — ${pet.breed}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Species & Status tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border-2 border-[#4A2218] -rotate-3 shadow-[2px_2px_0_#4A2218] ${
              isAvailable
                ? 'bg-[#BFE3C0] text-[#14532D]'
                : pet.status === 'Reserved'
                  ? 'bg-[#FBE3A1] text-[#7A4B00]'
                  : 'bg-[#EBC9A5] text-[#4A2218]'
            }`}
          >
            {pet.status}
          </span>
        </div>

        {/* Favourite button — top right */}
        {showActions && (!user || user.role === 'adopter') && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
            className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 bg-white border-2 border-[#4A2218] shadow-[2px_2px_0_#4A2218] hover:scale-110 active:scale-95"
          >
            <Heart
              className="w-4 h-4 transition-colors"
              style={{
                color: favorited ? '#C2572F' : '#B99A86',
                fill: favorited ? '#C2572F' : 'none',
              }}
            />
          </button>
        )}
      </div>

      {/* ── Details ────────────────────────────────── */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-extrabold text-base text-[#3E1F1A] group-hover:text-[#C2572F] transition-colors truncate">
              {pet.name}
            </h3>
            <span className="text-[11px] font-bold text-[#C2572F] shrink-0 bg-[#FFF3E2] px-2 py-0.5 rounded-full">
              {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
            </span>
          </div>

          <p className="text-xs text-[#8A5A48] mt-0.5 truncate font-medium">
            {pet.breed} • {pet.gender}
          </p>

          {typeof pet.shelter === 'object' && pet.shelter?.role === 'owner' && (
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-[#FBE3A1] border border-[#4A2218] text-[9px] font-black uppercase tracking-wider text-[#4A2218]">
              Rehomed by owner
            </span>
          )}

          {/* Location */}
          {pet.location?.city && (
            <div className="flex items-center gap-1 text-[11px] text-[#B99A86] mt-1.5 font-medium">
              <MapPin className="w-3 h-3 text-[#C2572F] shrink-0" />
              <span className="truncate">
                {pet.location.city}
                {pet.location.state ? `, ${pet.location.state}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Card CTA */}
        <div className="pt-2 border-t border-[#F3DCC0] flex items-center justify-between">
          <span className="text-xs font-black text-[#3E1F1A]">
            {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free Adoption'}
          </span>

          {showActions && (


          <Link
            to={`/pets/${pet._id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold bg-[#C2572F] text-white border-2 border-[#4A2218] shadow-[2px_2px_0_#4A2218] hover:shadow-[3px_3px_0_#4A2218] hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition"
          >
            <span>Meet {pet.name}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>


          )}
        </div>
      </div>
    </article>
  );
};
