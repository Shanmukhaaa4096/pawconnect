import React from 'react';
import { Search, RotateCcw, Filter, MapPin } from 'lucide-react';
import { PetFilterOptions } from '../../types';

interface PetFiltersProps {
  filters: PetFilterOptions;
  onChange: (newFilters: PetFilterOptions) => void;
  onReset: () => void;
  totalCount: number;
}

export const PetFilters: React.FC<PetFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
}) => {
  const speciesList = ['All', 'Dog', 'Cat', 'Rabbit', 'Bird', 'Other'];
  const ageGroups = ['All', 'Baby', 'Young', 'Adult', 'Senior'];
  const statuses = ['All', 'Available', 'Reserved', 'Adopted'];
  const genders = ['All', 'Male', 'Female'];
  const sizes = ['All', 'Small', 'Medium', 'Large', 'Extra Large'];

  const handleChange = (key: keyof PetFilterOptions, value: string) => {
    onChange({
      ...filters,
      [key]: value === 'All' ? '' : value,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-slate-900 text-base">Search & Filter</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
          {totalCount} {totalCount === 1 ? 'Pet' : 'Pets'} Found
        </span>
      </div>

      {/* Keyword Search Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by name, breed, keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Location (City or State)
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Austin, Seattle, TX..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Species Chips */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Pet Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {speciesList.map((sp) => {
            const isSelected = (!filters.species && sp === 'All') || filters.species === sp;
            return (
              <button
                key={sp}
                type="button"
                onClick={() => handleChange('species', sp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Status */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Availability Status
        </label>
        <div className="grid grid-cols-2 gap-2">
          {statuses.map((st) => {
            const isSelected = (!filters.status && st === 'All') || filters.status === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => handleChange('status', st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-center border transition-all ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-500/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Age Group */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Age Stage
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ageGroups.map((age) => {
            const isSelected = (!filters.ageGroup && age === 'All') || filters.ageGroup === age;
            return (
              <button
                key={age}
                type="button"
                onClick={() => handleChange('ageGroup', age)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {age}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender & Size Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Gender
          </label>
          <select
            value={filters.gender || 'All'}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Size
          </label>
          <select
            value={filters.size || 'All'}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Breed Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Breed
        </label>
        <input
          type="text"
          value={filters.breed || ''}
          onChange={(e) => handleChange('breed', e.target.value)}
          placeholder="e.g. Golden Retriever, Husky, Siamese..."
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset All Filters
      </button>
    </div>
  );
};
