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
        return 'bg-[#EEF8F5] text-[#1C6C57] border-[#D1EFE6] shadow-xs';
      case 'Reserved':
        return 'bg-[#FFF6EC] text-[#965B20] border-[#FCE2C6] shadow-xs';
      case 'Adopted':
        return 'bg-[#F2F1FD] text-[#4844B3] border-[#DFDCFB] shadow-xs';
      case 'Pending':
        return 'bg-[#EFF6FF] text-[#1E5699] border-[#D6E6FD] shadow-xs';
      case 'Approved':
        return 'bg-[#EEF8F5] text-[#1C6C57] border-[#D1EFE6] shadow-xs';
      case 'Rejected':
        return 'bg-[#FFF0F2] text-[#A62639] border-[#FDD5DC] shadow-xs';
      case 'Completed':
        return 'bg-[#F4F1FD] text-[#5540B6] border-[#E1DBFB] shadow-xs';
      default:
        return 'bg-[#F6F2EC] text-[#63574D] border-[#E8DFC2] shadow-xs';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'Available':
      case 'Approved':
        return 'bg-[#3EB897]';
      case 'Reserved':
      case 'Pending':
        return 'bg-[#F59E0B] animate-pulse';
      case 'Adopted':
      case 'Completed':
        return 'bg-[#8B89E8]';
      case 'Rejected':
        return 'bg-[#F43F5E]';
      default:
        return 'bg-[#A89F91]';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-0.5 text-[11px] font-bold';
      case 'lg':
        return 'px-3.5 py-1.5 text-xs font-extrabold';
      case 'md':
      default:
        return 'px-3 py-1 text-xs font-bold';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 ${getStyles()} ${getSize()} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getDotColor()}`} />
      <span className="tracking-tight">{status}</span>
    </span>
  );
};
