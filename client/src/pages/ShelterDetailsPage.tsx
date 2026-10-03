import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Globe, Phone, ArrowLeft } from 'lucide-react';
import { User, Pet } from '../types';
import { api } from '../services/api';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { KawaiiPaw, KawaiiEmptyPet } from '../components/common/KawaiiIcons';

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

  if (loading) {
    return <LoadingSpinner label="Loading shelter profile..." />;
  }

  if (!shelter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-[#2B2523]">Shelter Not Found</h2>
        <Link to="/shelters" className="text-[#FF7E67] font-extrabold hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <Link
        to="/shelters"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EDE6DC] text-xs font-extrabold text-[#5C524E] hover:text-[#FF7E67] hover:border-[#FF7E67] transition-all shadow-2xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Shelters Directory
      </Link>

      {/* Shelter Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE6DC] shadow-xs flex flex-col md:flex-row items-start md:items-center gap-6">
        <img
          src={
            shelter.avatar ||
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=250&q=80'
          }
          alt={shelter.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-[#FF7E67]/20 shrink-0"
        />
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#EEF8F5] text-[#1C6C57] border border-[#CCE8DF]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Animal Welfare Organization
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B2523]">
            {shelter.organization?.name || shelter.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C524E] leading-relaxed max-w-3xl font-normal">
            {shelter.organization?.description || shelter.bio}
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-[#7A6E68] pt-2">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-[#FF7E67]" />
              {shelter.location?.city || 'Austin'}, {shelter.location?.state || 'TX'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-4 h-4 text-[#FF7E67]" />
              {shelter.phone || '+1 (555) 000-0000'}
            </span>
            {shelter.organization?.website && (
              <span className="flex items-center gap-1.5 font-medium">
                <Globe className="w-4 h-4 text-[#FF7E67]" />
                <a
                  href={shelter.organization.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-[#FF7E67] font-semibold"
                >
                  {shelter.organization.website}
                </a>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Shelter's Listed Pets */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2EE] text-[#FF7E67] text-xs font-black uppercase tracking-wider mb-2">
              <KawaiiPaw className="w-3.5 h-3.5" />
              <span>Current Residents</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2B2523]">
              Adoptable Pets at this Shelter
            </h2>
            <p className="text-xs text-[#7A6E68] font-medium mt-0.5">
              {pets.length} {pets.length === 1 ? 'animal' : 'animals'} currently housed or fostered
            </p>
          </div>
        </div>

        {pets.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#EDE6DC] shadow-xs space-y-4 max-w-lg mx-auto">
            <KawaiiEmptyPet className="w-44 h-36 mx-auto" />
            <p className="text-sm font-black text-[#2B2523]">No pets currently listed by this shelter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

