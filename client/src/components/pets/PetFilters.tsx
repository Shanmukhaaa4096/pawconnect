import React from 'react';
import { Search, RotateCcw, MapPin } from 'lucide-react';
import { PetFilterOptions } from '../../types';

interface PetFiltersProps {
  filters: PetFilterOptions;
  onChange: (newFilters: PetFilterOptions) => void;
  onReset: () => void;
  totalCount: number;
}

/* Shared label style */
const FilterLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label
    className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5"
    style={{ color: '#9BA097', fontFamily: "'Inter', sans-serif" }}
  >
    {children}
  </label>
);

export const PetFilters: React.FC<PetFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
}) => {
  const speciesList = ['All', 'Dog', 'Cat', 'Rabbit', 'Bird', 'Other'];
  const ageGroups   = ['All', 'Baby', 'Young', 'Adult', 'Senior'];
  const statuses    = ['All', 'Available', 'Reserved', 'Adopted'];
  const genders     = ['All', 'Male', 'Female'];
  const sizes       = ['All', 'Small', 'Medium', 'Large', 'Extra Large'];

  const handleChange = (key: keyof PetFilterOptions, value: string) => {
    onChange({ ...filters, [key]: value === 'All' ? '' : value });
  };

  /* Pill button factory */
  const FilterPill = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1 text-xs font-medium rounded border transition-all"
      style={{
        background:   selected ? '#263A32' : '#FFFFFF',
        color:        selected ? '#F7F5EF' : '#6B7068',
        borderColor:  selected ? '#263A32' : '#DDE0D8',
        fontFamily:   "'Inter', sans-serif",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="rounded-lg border p-5 space-y-5"
      style={{ background: '#FFFFFF', borderColor: '#DDE0D8' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: '#E8EBE3' }}>
        <h3 className="font-semibold text-sm" style={{ color: '#252825' }}>Filters</h3>
        <span
          className="text-[11px] font-medium px-2.5 py-0.5 rounded"
          style={{ background: '#EAECE4', color: '#263A32' }}
        >
          {totalCount} {totalCount === 1 ? 'pet' : 'pets'}
        </span>
      </div>

      {/* Keyword Search */}
      <div>
        <FilterLabel>Keyword</FilterLabel>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9BA097' }} />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Name, breed…"
            className="editorial-input pl-9"
            style={{ height: '2.5rem', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <FilterLabel>Location</FilterLabel>
        <div className="relative">
          <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9BA097' }} />
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City or state…"
            className="editorial-input pl-9"
            style={{ height: '2.5rem', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Pet Type */}
      <div>
        <FilterLabel>Pet type</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {speciesList.map((sp) => (
            <FilterPill
              key={sp}
              label={sp}
              selected={(!filters.species && sp === 'All') || filters.species === sp}
              onClick={() => handleChange('species', sp)}
            />
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <FilterLabel>Availability</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((st) => (
            <FilterPill
              key={st}
              label={st}
              selected={(!filters.status && st === 'All') || filters.status === st}
              onClick={() => handleChange('status', st)}
            />
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <FilterLabel>Age stage</FilterLabel>
        <div className="flex flex-wrap gap-1.5">
          {ageGroups.map((age) => (
            <FilterPill
              key={age}
              label={age}
              selected={(!filters.ageGroup && age === 'All') || filters.ageGroup === age}
              onClick={() => handleChange('ageGroup', age)}
            />
          ))}
        </div>
      </div>

      {/* Gender + Size */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FilterLabel>Gender</FilterLabel>
          <select
            value={filters.gender || 'All'}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="editorial-input"
            style={{ height: '2.5rem', fontSize: '0.8125rem', paddingLeft: '0.75rem' }}
          >
            {genders.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <FilterLabel>Size</FilterLabel>
          <select
            value={filters.size || 'All'}
            onChange={(e) => handleChange('size', e.target.value)}
            className="editorial-input"
            style={{ height: '2.5rem', fontSize: '0.8125rem', paddingLeft: '0.75rem' }}
          >
            {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Breed */}
      <div>
        <FilterLabel>Breed</FilterLabel>
        <input
          type="text"
          value={filters.breed || ''}
          onChange={(e) => handleChange('breed', e.target.value)}
          placeholder="e.g. Golden Retriever…"
          className="editorial-input"
          style={{ height: '2.5rem', fontSize: '0.875rem' }}
        />
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded border transition-colors hover:bg-[#EAECE4]"
        style={{ color: '#6B7068', borderColor: '#DDE0D8' }}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset filters
      </button>
    </div>
  );
};
