import React from 'react';
import { PetStatus, ApplicationStatus } from '../../types';

interface BadgeProps {
  status: PetStatus | ApplicationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getStyles = () => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'Reserved':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      case 'Adopted':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20';
      case 'Pending':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      case 'Completed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-3.5 py-1.5 text-sm font-semibold';
      case 'md':
      default:
        return 'px-2.5 py-1 text-xs font-medium';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ring-inset shadow-xs ${getStyles()} ${getSize()} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ['Available', 'Approved', 'Completed'].includes(status)
            ? 'bg-emerald-500'
            : ['Reserved', 'Pending'].includes(status)
            ? 'bg-amber-500 animate-pulse'
            : status === 'Adopted'
            ? 'bg-purple-500'
            : status === 'Rejected'
            ? 'bg-rose-500'
            : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};
