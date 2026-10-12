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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ background: '#F7F5EF' }}>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-[#DDE0D8] pb-7 mb-8">
        <div>
          <p className="section-label">Adoption directory</p>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 600,
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: '#252825',
              letterSpacing: '-0.02em',
            }}
          >
            Adoptable pets
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#6B7068', maxWidth: '44ch' }}>
            Verified companions looking for loving, permanent homes.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded border border-[#DDE0D8] bg-white text-sm font-medium text-[#252825] hover:border-[#263A32] hover:bg-[#EAECE4] transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" style={{ color: '#6B7068' }} />
            Filters
          </button>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded border border-[#DDE0D8] text-sm">
            <ArrowUpDown className="w-3.5 h-3.5" style={{ color: '#9BA097' }} />
            <span style={{ color: '#9BA097', fontWeight: 500 }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              style={{ color: '#252825' }}
            >
              <option value="newest">Newest</option>
              <option value="age">Youngest first</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>
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
  );
};
