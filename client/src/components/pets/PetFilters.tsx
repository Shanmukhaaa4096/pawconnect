import React from 'react';
import { Search, RotateCcw, Filter, MapPin } from 'lucide-react';
import { PetFilterOptions } from '../../types';
import { KawaiiPaw, KawaiiSparkle } from '../common/KawaiiIcons';

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
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE6DC] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F4EFE8] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FFF0ED] text-[#FF7E67] flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-[#2B2523] text-base font-display">
            Filter Companions
          </h3>
        </div>
        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFF0ED] text-[#B54A34] border border-[#FFE0D7]">
          {totalCount} {totalCount === 1 ? 'Pet' : 'Pets'}
        </span>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1.5 font-display">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#A89D93] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by name, breed, keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523] transition-all"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1.5 font-display">
          Location (City or State)
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-[#FF7E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Austin, Seattle, WA..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DCD0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523] transition-all"
          />
        </div>
      </div>

      {/* Pet Type Chips */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-2 font-display flex items-center gap-1">
          <span>Pet Type</span>
          <KawaiiSparkle size={11} fill="#FF7E67" />
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
                    ? 'bg-[#FF7E67] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#5C5248] hover:bg-[#F2ECE3] border border-[#EBE3D8]'
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
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-2 font-display">
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
                    ? 'bg-[#FFF0ED] border-[#FF7E67] text-[#B54A34] ring-2 ring-[#FF7E67]/10'
                    : 'bg-[#FAF7F2] border-[#EDE6DC] text-[#594E46] hover:bg-[#F2ECE3]'
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
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-2 font-display">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#2B2523] text-white'
                    : 'bg-[#FAF7F2] text-[#5C5248] hover:bg-[#F2ECE3] border border-[#EBE3D8]'
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
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1.5 font-display">
            Gender
          </label>
          <select
            value={filters.gender || 'All'}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-[#FAF7F2] border border-[#E5DCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523]"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1.5 font-display">
            Size
          </label>
          <select
            value={filters.size || 'All'}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-[#FAF7F2] border border-[#E5DCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523]"
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
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1.5 font-display">
          Breed Keyword
        </label>
        <input
          type="text"
          value={filters.breed || ''}
          onChange={(e) => handleChange('breed', e.target.value)}
          placeholder="e.g. Golden Retriever, Lop, Husky..."
          className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523]"
        />
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-extrabold text-[#5C5248] bg-[#FAF7F2] hover:bg-[#F2ECE3] transition-colors border border-[#E0D7CC]"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset All Filters
      </button>
    </div>
  );
};
