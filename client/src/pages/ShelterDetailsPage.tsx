import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Globe, Phone, ArrowLeft } from 'lucide-react';
import { User, Pet } from '../types';
import { api } from '../services/api';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ShelterDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shelter, setShelter] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelterData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.getShelterById(id);
        setShelter(res.shelter);
        setPets(res.pets || []);
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
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.5rem', color: '#252825' }}>Shelter not found</h2>
        <Link to="/shelters" className="text-sm font-medium" style={{ color: '#263A32' }}>
          Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10" style={{ background: '#F7F5EF' }}>

      {/* Back */}
      <Link
        to="/shelters"
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: '#6B7068', textDecoration: 'none' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to shelter directory
      </Link>

      {/* Shelter Profile Card */}
      <div
        className="rounded-lg border p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center gap-6"
        style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
      >
        <img
          src={shelter.avatar || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=250&q=80'}
          alt={shelter.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover shrink-0"
          style={{ border: '1px solid #DDE0D8' }}
        />
        <div className="flex-1 space-y-3">
          {shelter.organization?.verified ? (
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" style={{ color: '#263A32' }} />
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#263A32' }}>
                Verified animal welfare organisation
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5">
              <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#9BA097' }}>
                Organisation verification pending review
              </span>
            </div>
          )}
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 600,
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              color: '#252825',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {shelter.organization?.name || shelter.name}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7068', maxWidth: '60ch' }}>
            {shelter.organization?.description || shelter.bio}
          </p>

          <div className="flex flex-wrap gap-5 text-xs pt-1" style={{ color: '#9BA097' }}>
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
                style={{ color: '#9BA097', textDecoration: 'none' }}
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
          <h2 style={{ fontFamily: "'Lora', serif", fontWeight: 600, fontSize: '1.5rem', color: '#252825' }}>
            Adoptable pets at this shelter
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: '#6B7068' }}>
            {pets.length} {pets.length === 1 ? 'animal' : 'animals'} currently available
          </p>
        </div>

        {pets.length === 0 ? (
          <div
            className="p-10 text-center rounded-lg border max-w-md"
            style={{ background: '#EAECE4', borderColor: '#DDE0D8' }}
          >
            <p className="text-sm font-medium" style={{ color: '#6B7068' }}>
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
    </div>
  );
};
