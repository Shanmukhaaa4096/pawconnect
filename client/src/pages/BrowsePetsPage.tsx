import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PawPrint, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Pet, PetFilterOptions } from '../types';
import { api } from '../services/api';
import { PetFilters } from '../components/pets/PetFilters';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const BrowsePetsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<PetFilterOptions>({
    species: searchParams.get('species') || '',
    breed: searchParams.get('breed') || '',
    ageGroup: searchParams.get('ageGroup') || '',
    status: searchParams.get('status') || '',
    gender: searchParams.get('gender') || '',
    size: searchParams.get('size') || '',
    location: searchParams.get('location') || '',
    search: searchParams.get('search') || '',
  });

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'age' | 'name'>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL search params
  useEffect(() => {
    setFilters({
      species: searchParams.get('species') || '',
      breed: searchParams.get('breed') || '',
      ageGroup: searchParams.get('ageGroup') || '',
      status: searchParams.get('status') || '',
      gender: searchParams.get('gender') || '',
      size: searchParams.get('size') || '',
      location: searchParams.get('location') || '',
      search: searchParams.get('search') || '',
    });
  }, [searchParams]);

  // Fetch pets whenever filters change
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const res = await api.getPets(filters);
        let list = res.pets || [];

        // Client sorting
        if (sortBy === 'age') {
          list = [...list].sort((a, b) => a.age - b.age);
        } else if (sortBy === 'name') {
          list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        }

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

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Adoption Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find Adoptable Pets
          </h1>
          <p className="text-sm text-slate-500">
            Showing verified rescues available for adoption and foster care.
          </p>
        </div>

        {/* Controls: Mobile filter trigger + Sort */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Listed</option>
              <option value="age">Age (Youngest First)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Pet Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
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
          <div className="lg:hidden col-span-1 mb-6">
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

        {/* Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <LoadingSpinner label="Searching adoptable pets..." />
          ) : pets.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <PawPrint className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Pets Match Your Criteria</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try loosening your filters or searching a broader city/state radius to see more lovely companions.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-600/20"
              >
                Clear All Filters
              </button>
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
    </div>
  );
};
