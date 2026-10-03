import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { Pet } from '../../types';
import { StatusBadge } from './Badge';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { KawaiiPaw, KawaiiSparkle } from './KawaiiIcons';

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
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#EDE6DC] shadow-xs hover:shadow-xl hover:shadow-[#4A3728]/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      {/* Photo Frame */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#F6F1EA]">
        <img
          src={mainPhoto}
          alt={pet.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5">
          <StatusBadge status={pet.status} size="sm" />
        </div>

        {/* Favorite Heart Button */}
        {(!user || user.role === 'adopter') && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`absolute top-3.5 right-3.5 p-2.5 rounded-full transition-all duration-200 shadow-sm backdrop-blur-xs ${
              favorited
                ? 'bg-[#FF6584] text-white scale-110 shadow-[#FF6584]/30'
                : 'bg-white/95 text-[#6E6359] hover:text-[#FF6584] hover:bg-white hover:scale-105'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Bottom Pet Type & Adoption Fee Pills */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#3D352E] backdrop-blur-xs shadow-xs border border-white/60">
            <KawaiiPaw size={12} fill="#FF7E67" />
            <span>{pet.species}</span>
          </span>
        </div>

        <div className="absolute bottom-3 right-3.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#2B2523]/85 text-[#FFF9F2] backdrop-blur-xs shadow-xs">
            {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
          </span>
        </div>
      </div>

      {/* Pet Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-extrabold text-[#2B2523] font-display group-hover:text-[#FF7E67] transition-colors line-clamp-1">
              {pet.name}
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F5EFEB] text-[#5C5248] shrink-0 border border-[#EBE3D8]">
              {pet.age} {pet.age === 1 ? 'yr' : 'yrs'} • {pet.gender}
            </span>
          </div>

          <p className="text-xs font-semibold text-[#6E6359] line-clamp-1 mb-2.5">
            {pet.breed}
          </p>

          {/* Location with cute soft icon */}
          <div className="flex items-center text-xs text-[#8A7D73] mb-3.5 gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF7E67] shrink-0" />
            <span className="truncate">
              {pet.location.city}, {pet.location.state}
            </span>
          </div>

          {/* Temperament Tags in soft warm pastel */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {pet.temperament.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FFF2EE] text-[#B54A34] border border-[#FFDEC9]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/pets/${pet._id}`}
          className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-2xl text-xs font-extrabold text-white bg-[#2B2523] group-hover:bg-[#FF7E67] transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-[#FF7E67]/25"
        >
          <span>Meet {pet.name}</span>
          <KawaiiSparkle size={13} fill="#FFFFFF" className="ml-1.5 opacity-80" />
        </Link>
      </div>
    </div>
  );
};
