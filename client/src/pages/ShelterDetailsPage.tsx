import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, ShieldCheck, MapPin, Globe, Phone, ArrowLeft, PawPrint } from 'lucide-react';
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

  if (loading) {
    return <LoadingSpinner label="Loading shelter profile..." />;
  }

  if (!shelter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Shelter Not Found</h2>
        <Link to="/shelters" className="text-orange-600 font-bold hover:underline">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <Link
        to="/shelters"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shelters Directory
      </Link>

      {/* Shelter Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center gap-6">
        <img
          src={
            shelter.avatar ||
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=250&q=80'
          }
          alt={shelter.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-orange-500/20 shrink-0"
        />
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Animal Welfare Organization
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {shelter.organization?.name || shelter.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {shelter.organization?.description || shelter.bio}
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-600" />
              {shelter.location?.city || 'Austin'}, {shelter.location?.state || 'TX'}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-orange-600" />
              {shelter.phone || '+1 (555) 000-0000'}
            </span>
            {shelter.organization?.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-orange-600" />
                <a
                  href={shelter.organization.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline text-orange-600"
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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Adoptable Pets at this Shelter
            </h2>
            <p className="text-xs text-slate-500">
              {pets.length} {pets.length === 1 ? 'animal' : 'animals'} currently housed or fostered
            </p>
          </div>
        </div>

        {pets.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <PawPrint className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No pets currently listed by this shelter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
