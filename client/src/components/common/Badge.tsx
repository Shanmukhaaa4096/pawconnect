import React from 'react';
import { PetStatus, ApplicationStatus } from '../../types';

interface BadgeProps {
  status: PetStatus | ApplicationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getStyles = (): { bg: string; color: string; dot: string } => {
    switch (status) {
      case 'Available':
        return { bg: 'rgba(38,58,50,0.10)',   color: '#8E3B22', dot: '#8E3B22' };
      case 'Reserved':
        return { bg: 'rgba(200,121,90,0.12)', color: '#9B5A3A', dot: '#C8795A' };
      case 'Adopted':
        return { bg: 'rgba(107,112,104,0.12)', color: '#8A5A48', dot: '#B99A86' };
      case 'Pending':
        return { bg: 'rgba(200,121,90,0.08)', color: '#9B5A3A', dot: '#C8795A' };
      case 'Approved':
        return { bg: 'rgba(38,58,50,0.10)',   color: '#8E3B22', dot: '#8E3B22' };
      case 'Rejected':
        return { bg: 'rgba(180,50,50,0.08)',  color: '#8B3232', dot: '#B05050' };
      case 'Withdrawn':
        return { bg: 'rgba(107,112,104,0.10)', color: '#8A5A48', dot: '#B99A86' };
      case 'Completed':
        return { bg: 'rgba(107,112,104,0.12)', color: '#8A5A48', dot: '#B99A86' };
      default:
        return { bg: 'rgba(107,112,104,0.10)', color: '#8A5A48', dot: '#B99A86' };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-0.5 text-[11px]';
      case 'lg': return 'px-3 py-1 text-xs';
      default:   return 'px-2.5 py-0.5 text-xs';
    }
  };

  const { bg, color, dot } = getStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium ${getSizeClasses()} ${className}`}
      style={{
        background: bg,
        color,
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: dot }}
      />
      <span>{status}</span>
    </span>
  );
};
