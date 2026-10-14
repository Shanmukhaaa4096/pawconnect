import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Globe, Phone, ArrowLeft } from 'lucide-react';
import { User, Pet, ShelterReview } from '../types';
import { api } from '../services/api';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Stars } from '../components/common/Stars';

export const ShelterDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shelter, setShelter] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ShelterReview[]>([]);
  const [rating, setRating] = useState({ average: 0, count: 0 });

  useEffect(() => {
    const fetchShelterData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.getShelterById(id);
        setShelter(res.shelter);
        setPets(res.pets || []);
        api
          .getShelterReviews(id)
          .then((r) => {
            setReviews(r.reviews);
            setRating({ average: r.average, count: r.count });
          })
          .catch(() => undefined);
      } catch (err) {
        console.error('Failed to load shelter:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShelterData();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading shelter profile…" />;

  if (!shelter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '1.5rem', color: '#3E1F1A' }}>Shelter not found</h2>
        <Link to="/shelters" className="text-sm font-medium" style={{ color: '#8E3B22' }}>
          Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10" style={{ background: '#FCE8D0' }}>

      {/* Back */}
      <Link
        to="/shelters"
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: '#8A5A48', textDecoration: 'none' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to shelter directory
      </Link>

      {/* Shelter Profile Card */}
      <div
        className="rounded-lg border p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center gap-6"
        style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}
      >
        <img
          src={shelter.avatar || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=250&q=80'}
          alt={shelter.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover shrink-0"
          style={{ border: '1px solid #EBC9A5' }}
        />
        <div className="flex-1 space-y-3">
          {shelter.organization?.verified ? (
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" style={{ color: '#8E3B22' }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#8E3B22' }}>
                Verified animal welfare organisation
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5">
              <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#B99A86' }}>
                Organisation verification pending review
              </span>
            </div>
          )}
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              color: '#3E1F1A',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {shelter.organization?.name || shelter.name}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#8A5A48', maxWidth: '60ch' }}>
            {shelter.organization?.description || shelter.bio}
          </p>

          <div className="flex flex-wrap gap-5 text-xs pt-1" style={{ color: '#B99A86' }}>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" style={{ color: '#C8795A' }} />
              {shelter.location?.city || 'Austin'}, {shelter.location?.state || 'TX'}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" style={{ color: '#C8795A' }} />
              {shelter.phone || '+1 (555) 000-0000'}
            </span>
            {shelter.organization?.website && (
              <a
                href={shelter.organization.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 transition-colors"
                style={{ color: '#B99A86', textDecoration: 'none' }}
              >
                <Globe className="w-4 h-4" style={{ color: '#C8795A' }} />
                {shelter.organization.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Pets Section */}
      <div className="space-y-6">
        <div>
          <p className="section-label">Current residents</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '1.5rem', color: '#3E1F1A' }}>
            Adoptable pets at this shelter
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: '#8A5A48' }}>
            {pets.length} {pets.length === 1 ? 'animal' : 'animals'} currently available
          </p>
        </div>

        {pets.length === 0 ? (
          <div
            className="p-10 text-center rounded-lg border max-w-md"
            style={{ background: '#F8DDBF', borderColor: '#EBC9A5' }}
          >
            <p className="text-sm font-medium" style={{ color: '#8A5A48' }}>
              No pets currently listed by this shelter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label">Adopter feedback</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '1.5rem', color: '#3E1F1A' }}>
              Reviews
            </h2>
          </div>
          {rating.count > 0 && (
            <div className="flex items-center gap-2">
              <Stars value={rating.average} size={20} />
              <span className="text-sm font-black" style={{ color: '#3E1F1A' }}>{rating.average.toFixed(1)}</span>
              <span className="text-xs" style={{ color: '#8A5A48' }}>
                ({rating.count} review{rating.count === 1 ? '' : 's'})
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm" style={{ color: '#8A5A48' }}>
            No reviews yet. Adopters can rate this shelter after an adoption is completed.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <article key={r._id} className="rounded-2xl border-2 bg-white p-5 space-y-2" style={{ borderColor: '#EBC9A5' }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: '#F8DDBF', color: '#8E3B22' }}
                    >
                      {(r.adopter?.name || '?').charAt(0).toUpperCase()}
                    </span>
                    <span className="font-bold text-sm truncate" style={{ color: '#3E1F1A' }}>
                      {r.adopter?.name || 'Adopter'}
                    </span>
                  </div>
                  <Stars value={r.rating} />
                </div>
                {r.comment && <p className="text-sm leading-relaxed" style={{ color: '#8A5A48' }}>{r.comment}</p>}
                <p className="text-[11px]" style={{ color: '#B99A86' }}>
                  {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
