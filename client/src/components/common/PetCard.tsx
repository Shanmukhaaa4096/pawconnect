import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import { Pet } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

interface PetCardProps {
  pet: Pet;
  onFavoriteClick?: (pet: Pet) => void;
}

/* Derive a concise status label + style for editorial badge */
function getStatusStyle(status: string): { label: string; bg: string; color: string } {
  switch (status) {
    case 'Available':
      return { label: 'Available',  bg: 'rgba(38,58,50,0.10)', color: '#263A32' };
    case 'Reserved':
      return { label: 'Reserved',   bg: 'rgba(200,121,90,0.12)', color: '#9B5A3A' };
    case 'Adopted':
      return { label: 'Adopted',    bg: 'rgba(107,112,104,0.12)', color: '#6B7068' };
    case 'Pending':
      return { label: 'Pending',    bg: 'rgba(200,121,90,0.08)', color: '#9B5A3A' };
    default:
      return { label: status,       bg: 'rgba(107,112,104,0.10)', color: '#6B7068' };
  }
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

  const { label: statusLabel, bg: statusBg, color: statusColor } = getStatusStyle(pet.status);

  return (
    <article className="pet-card group flex flex-col">

      {/* ── Photo ──────────────────────────────────── */}
      <div className="pet-card-img">
        <img
          src={mainPhoto}
          alt={`${pet.name} — ${pet.breed}`}
          loading="lazy"
        />

        {/* Status badge — top left, minimal */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium"
            style={{ background: statusBg, color: statusColor, fontFamily: "'Inter', sans-serif" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: statusColor }}
            />
            {statusLabel}
          </span>
        </div>

        {/* Favourite button — top right */}
        {(!user || user.role === 'adopter') && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
            className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200"
            style={{
              background: favorited ? '#263A32' : 'rgba(255,255,255,0.9)',
              color: favorited ? '#FFFFFF' : '#9BA097',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Heart
              className="w-4 h-4"
              style={{ fill: favorited ? 'currentColor' : 'none' }}
            />
          </button>
        )}
      </div>

      {/* ── Details ────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-4 pt-4 gap-3">

        {/* Name + breed row */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-[1.0625rem] font-semibold leading-snug transition-colors group-hover:text-[#263A32] line-clamp-1"
              style={{ color: '#252825', fontFamily: "'Inter', sans-serif" }}
            >
              {pet.name}
            </h3>
            <span
              className="text-[11px] font-medium shrink-0 pt-0.5"
              style={{ color: '#9BA097' }}
            >
              {pet.age}&nbsp;{pet.age === 1 ? 'yr' : 'yrs'} · {pet.gender}
            </span>
          </div>
          <p className="text-sm mt-0.5 line-clamp-1" style={{ color: '#9BA097' }}>
            {pet.breed}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9BA097' }}>
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#C8795A' }} />
          <span className="truncate">{pet.location.city}, {pet.location.state}</span>
        </div>

        {/* Temperament tags — max 3, restrained styling */}
        {pet.temperament && pet.temperament.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pet.temperament.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-medium"
                style={{ background: '#EAECE4', color: '#6B7068' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#E8EBE3]">
          <Link
            to={`/pets/${pet._id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#263A32]"
            style={{ color: '#263A32', textDecoration: 'none' }}
          >
            <span>Meet {pet.name}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span className="text-xs font-medium" style={{ color: '#9BA097' }}>
            {pet.adoptionFee ? `$${pet.adoptionFee}` : 'Free'}
          </span>
        </div>
      </div>
    </article>
  );
};
