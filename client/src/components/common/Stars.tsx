import React from 'react';
import { Star } from 'lucide-react';

/** Read-only star row. Supports halves visually by rounding to nearest whole star. */
export const Stars: React.FC<{ value: number; size?: number }> = ({ value, size = 16 }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        style={{ width: size, height: size }}
        fill={n <= Math.round(value) ? '#E8873F' : 'none'}
        color={n <= Math.round(value) ? '#E8873F' : '#EBC9A5'}
      />
    ))}
  </span>
);

/** Clickable star picker. */
export const StarPicker: React.FC<{ value: number; onChange: (n: number) => void }> = ({ value, onChange }) => (
  <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        role="radio"
        aria-checked={value === n}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
        onClick={() => onChange(n)}
        className="p-0.5 transition-transform hover:scale-110"
      >
        <Star
          className="w-8 h-8"
          fill={n <= value ? '#E8873F' : 'none'}
          color={n <= value ? '#E8873F' : '#EBC9A5'}
        />
      </button>
    ))}
  </div>
);
