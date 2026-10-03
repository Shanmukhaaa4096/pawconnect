import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { Pet } from '../../types';
import { StatusBadge } from './Badge';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

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
      alert('Please log in as an adopter to save pets to your favorites list!');
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

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Photo with Overlay Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={mainPhoto}
          alt={pet.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={pet.status} />
        </div>

        {/* Favorite Button (Available for adopters or guests) */}
        {(!user || user.role === 'adopter') && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-md ${
              favorited
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white backdrop-blur-xs'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Species Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs">
            <Sparkles className="w-3 h-3 text-orange-500" />
            {pet.species}
          </span>
        </div>

        {/* Adoption Fee Pill */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-xs">
            {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
          </span>
        </div>
      </div>

      {/* Pet Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {pet.name}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
              {pet.age} {pet.age === 1 ? 'yr' : 'yrs'} ({pet.gender})
            </span>
          </div>

          <p className="text-sm font-medium text-slate-600 line-clamp-1 mb-2">
            {pet.breed}
          </p>

          {/* Location */}
          <div className="flex items-center text-xs text-slate-500 mb-3 gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate">
              {pet.location.city}, {pet.location.state}
            </span>
          </div>

          {/* Temperament Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pet.temperament.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-orange-50 text-orange-700 border border-orange-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <Link
          to={`/pets/${pet._id}`}
          className="w-full mt-2 inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-orange-600 transition-all duration-200 shadow-xs hover:shadow-md group-hover:bg-orange-600"
        >
          View Profile & Adopt
        </Link>
      </div>
    </div>
  );
};
