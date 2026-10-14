import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Pet } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

interface PetCardProps {
  pet: Pet;
  onFavoriteClick?: (pet: Pet) => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
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
    <article className="bg-white rounded-2xl border border-[#EAD2D3] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1">
      {/* ── Photo ──────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-[#FDEEEF]">
        <img
          src={mainPhoto}
          alt={`${pet.name} — ${pet.breed}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Species & Status tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
              isAvailable
                ? 'bg-white/95 text-emerald-700'
                : 'bg-white/95 text-[#98494B]'
            }`}
          >
            {pet.status}
          </span>
        </div>

        {/* Favourite button — top right */}
        {(!user || user.role === 'adopter') && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
            className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 bg-white/90 backdrop-blur-sm shadow hover:scale-110 active:scale-95"
          >
            <Heart
              className="w-4 h-4 transition-colors"
              style={{
                color: favorited ? '#C96366' : '#A89898',
                fill: favorited ? '#C96366' : 'none',
              }}
            />
          </button>
        )}
      </div>

      {/* ── Details ────────────────────────────────── */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-extrabold text-base text-[#292323] group-hover:text-[#C96366] transition-colors truncate">
              {pet.name}
            </h3>
            <span className="text-[11px] font-bold text-[#C96366] shrink-0 bg-[#FDEEEF] px-2 py-0.5 rounded-full">
              {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
            </span>
          </div>

          <p className="text-xs text-[#736363] mt-0.5 truncate font-medium">
            {pet.breed} • {pet.gender}
          </p>

          {/* Location */}
          {pet.location?.city && (
            <div className="flex items-center gap-1 text-[11px] text-[#A89898] mt-1.5 font-medium">
              <MapPin className="w-3 h-3 text-[#C96366] shrink-0" />
              <span className="truncate">
                {pet.location.city}
                {pet.location.state ? `, ${pet.location.state}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Card CTA */}
        <div className="pt-2 border-t border-[#F4E4E4] flex items-center justify-between">
          <span className="text-xs font-black text-[#292323]">
            {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free Adoption'}
          </span>

          <Link
            to={`/pets/${pet._id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#C96366] text-white hover:bg-[#98494B] shadow-xs hover:shadow transition"
          >
            <span>Meet {pet.name}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
};
