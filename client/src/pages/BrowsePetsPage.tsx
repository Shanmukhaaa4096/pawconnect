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
    <div className="min-h-screen bg-[#F3E6E6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-[#EAD2D3] pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEEEF] text-[#C96366] text-xs font-black uppercase tracking-wider mb-2 border border-[#EAD2D3]">
              <span>Adoption Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#292323] tracking-tight">
              Adoptable Pets
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#736363] font-medium max-w-lg">
              Verified rescue companions waiting for compassionate forever homes.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-[#EAD2D3] bg-white text-xs font-bold text-[#292323] hover:border-[#C96366] transition shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C96366]" />
              Filters
            </button>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#EAD2D3] text-xs shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C96366]" />
              <span className="text-[#A89898] font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-extrabold text-[#292323] focus:outline-none cursor-pointer"
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
                    ? 'bg-[#C96366] text-white shadow-sm'
                    : 'bg-white border border-[#EAD2D3] text-[#736363] hover:border-[#C96366] hover:text-[#C96366]'
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
              className="p-10 sm:p-14 text-center space-y-4 rounded-lg border border-[#DDE0D8] max-w-lg mx-auto"
              style={{ background: '#EAECE4' }}
            >
              {/* Simple paw SVG in lieu of kawaii illustration */}
              <svg
                width="48" height="48" viewBox="0 0 32 32" fill="none"
                xmlns="http://www.w3.org/2000/svg" className="mx-auto opacity-30"
              >
                <ellipse cx="7"  cy="11" rx="3"   ry="4"   fill="#252825" />
                <ellipse cx="13" cy="7"  rx="3"   ry="4.5" fill="#252825" />
                <ellipse cx="19" cy="7"  rx="3"   ry="4.5" fill="#252825" />
                <ellipse cx="25" cy="11" rx="3"   ry="4"   fill="#252825" />
                <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="#252825"/>
              </svg>
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: "'Lora', serif", color: '#252825' }}
              >
                No pets found
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7068', maxWidth: '32ch', margin: '0 auto' }}>
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
