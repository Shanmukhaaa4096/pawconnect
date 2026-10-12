import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading…',
  className = '',
}) => {
  const ringSize = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' }[size];

  return (
    <div className={`flex flex-col items-center justify-center p-10 gap-4 ${className}`}>
      <div
        className={`${ringSize} rounded-full border-2 animate-spin`}
        style={{
          borderColor: '#DDE0D8',
          borderTopColor: '#263A32',
          animationDuration: '0.8s',
        }}
        role="status"
        aria-label={label}
      />
      {label && (
        <p className="text-sm font-medium" style={{ color: '#9BA097', fontFamily: "'Inter', sans-serif" }}>
          {label}
        </p>
      )}
    </div>
  );
};
