import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Pet, PetFilterOptions } from '../types';
import { api } from '../services/api';
import { PetFilters } from '../components/pets/PetFilters';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const BrowsePetsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<PetFilterOptions>({
    species:  searchParams.get('species')  || '',
    breed:    searchParams.get('breed')    || '',
    ageGroup: searchParams.get('ageGroup') || '',
    status:   searchParams.get('status')   || '',
    gender:   searchParams.get('gender')   || '',
    size:     searchParams.get('size')     || '',
    location: searchParams.get('location') || '',
    search:   searchParams.get('search')   || '',
  });

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'age' | 'name'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setFilters({
      species:  searchParams.get('species')  || '',
      breed:    searchParams.get('breed')    || '',
      ageGroup: searchParams.get('ageGroup') || '',
      status:   searchParams.get('status')   || '',
      gender:   searchParams.get('gender')   || '',
      size:     searchParams.get('size')     || '',
      location: searchParams.get('location') || '',
      search:   searchParams.get('search')   || '',
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const res = await api.getPets(filters);
        let list = res.pets || [];
        if (sortBy === 'age')  list = [...list].sort((a, b) => a.age - b.age);
        if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        setPets(list);
      } catch (err) {
        console.error('Failed to fetch pets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: PetFilterOptions) => {
    const nextParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) nextParams.set(key, val);
    });
    setSearchParams(nextParams);
  };

  const handleReset = () => setSearchParams(new URLSearchParams());

  return (
    <div className="min-h-screen bg-[#FCE8D0] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-[#EBC9A5] pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E2] text-[#C2572F] text-xs font-black uppercase tracking-wider mb-2 border border-[#EBC9A5]">
              <span>Adoption Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3E1F1A] tracking-tight">
              Adoptable Pets
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#8A5A48] font-medium max-w-lg">
              Verified rescue companions waiting for compassionate forever homes.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-[#EBC9A5] bg-white text-xs font-bold text-[#3E1F1A] hover:border-[#C2572F] transition shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C2572F]" />
              Filters
            </button>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#EBC9A5] text-xs shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C2572F]" />
              <span className="text-[#B99A86] font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-extrabold text-[#3E1F1A] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Listed</option>
                <option value="age">Youngest First</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
          {['', 'Dog', 'Cat', 'Bird', 'Rabbit'].map((sp) => {
            const isSelected = (filters.species || '') === sp;
            const label = sp === '' ? '🐾 All Pets' : sp === 'Dog' ? '🐶 Dogs' : sp === 'Cat' ? '🐱 Cats' : sp === 'Bird' ? '🦜 Birds' : '🐰 Rabbits';
            return (
              <button
                key={sp}
                onClick={() => handleFilterChange({ ...filters, species: sp })}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition shrink-0 ${
                  isSelected
                    ? 'bg-[#C2572F] text-white shadow-sm'
                    : 'bg-white border border-[#EBC9A5] text-[#8A5A48] hover:border-[#C2572F] hover:text-[#C2572F]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

      {/* Grid: Sidebar + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <PetFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            totalCount={pets.length}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-2 animate-fade-up">
            <PetFilters
              filters={filters}
              onChange={(f) => {
                handleFilterChange(f);
                setMobileFilterOpen(false);
              }}
              onReset={handleReset}
              totalCount={pets.length}
            />
          </div>
        )}

        {/* Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner label="Loading available pets…" />
          ) : pets.length === 0 ? (
            <div
              className="p-10 sm:p-14 text-center space-y-4 rounded-lg border border-[#EBC9A5] max-w-lg mx-auto"
              style={{ background: '#F8DDBF' }}
            >
              {/* Simple paw SVG in lieu of kawaii illustration */}
              <svg
                width="48" height="48" viewBox="0 0 32 32" fill="none"
                xmlns="http://www.w3.org/2000/svg" className="mx-auto opacity-30"
              >
                <ellipse cx="7"  cy="11" rx="3"   ry="4"   fill="#3E1F1A" />
                <ellipse cx="13" cy="7"  rx="3"   ry="4.5" fill="#3E1F1A" />
                <ellipse cx="19" cy="7"  rx="3"   ry="4.5" fill="#3E1F1A" />
                <ellipse cx="25" cy="11" rx="3"   ry="4"   fill="#3E1F1A" />
                <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="#3E1F1A"/>
              </svg>
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: "'Fraunces', serif", color: '#3E1F1A' }}
              >
                No pets found
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#8A5A48', maxWidth: '32ch', margin: '0 auto' }}>
                Try clearing species or expanding your location to see more results.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="btn-primary"
                style={{ marginTop: '0.5rem' }}
              >
                Clear all filters
              </button>
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
    </div>
  </div>
);
};
