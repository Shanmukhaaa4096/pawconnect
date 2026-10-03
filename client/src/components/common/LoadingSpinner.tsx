import React from 'react';
import { KawaiiPaw } from './KawaiiIcons';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Fetching with care...',
  className = '',
}) => {
  const pawSizes = {
    sm: 18,
    md: 26,
    lg: 38,
  }[size];

  const ringSizes = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center p-8 gap-3.5 ${className}`}>
      <div className={`relative ${ringSizes} flex items-center justify-center`}>
        {/* Soft rotating outer halo */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFC7BC] animate-spin duration-1000" />
        {/* Cute center paw print with subtle bounce */}
        <div className="animate-pulse">
          <KawaiiPaw size={pawSizes} fill="#FF7E67" />
        </div>
      </div>
      {label && (
        <p className="text-xs font-bold text-[#7A6E65] tracking-wide font-display">
          {label}
        </p>
      )}
    </div>
  );
};
