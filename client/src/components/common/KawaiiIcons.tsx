import React from 'react';

export const KawaiiPaw: React.FC<{ className?: string; size?: number; fill?: string }> = ({
  className = '',
  size = 20,
  fill = '#FF7E67',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block ${className}`}
  >
    <ellipse cx="6" cy="9.5" rx="2" ry="2.8" fill={fill} />
    <ellipse cx="10.5" cy="6.5" rx="2" ry="3" fill={fill} />
    <ellipse cx="15.5" cy="6.5" rx="2" ry="3" fill={fill} />
    <ellipse cx="20" cy="9.5" rx="2" ry="2.8" fill={fill} />
    <path
      d="M13 11.2c-3.2 0-6.2 2.2-6.2 5.5 0 2.2 1.8 3.8 6.2 3.8s6.2-1.6 6.2-3.8c0-3.3-3-5.5-6.2-5.5z"
      fill={fill}
    />
  </svg>
);

export const KawaiiSparkle: React.FC<{ className?: string; size?: number; fill?: string }> = ({
  className = '',
  size = 16,
  fill = '#FFB088',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 inline-block ${className}`}
  >
    <path
      d="M8 0C8 4.418 4.418 8 0 8C4.418 8 8 11.582 8 16C8 11.582 11.582 8 16 8C11.582 8 8 4.418 8 0Z"
      fill={fill}
    />
  </svg>
);

export const KawaiiEmptyPet: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mx-auto ${className}`}
  >
    {/* Soft cloud backdrop */}
    <ellipse cx="60" cy="92" rx="46" ry="12" fill="#EFE8DE" />
    {/* Sleeping pup body */}
    <path
      d="M34 82C34 68 45 56 60 56C75 56 86 68 86 82C86 84 84 86 82 86H38C36 86 34 84 34 82Z"
      fill="#FCE8D3"
    />
    {/* Head */}
    <circle cx="48" cy="62" r="16" fill="#FCE8D3" />
    {/* Floppy ear */}
    <path
      d="M36 54C33 58 31 66 33 72C34 74 38 74 39 70C41 64 40 56 36 54Z"
      fill="#E5B98A"
    />
    {/* Happy sleepy eyes */}
    <path
      d="M42 63C43 61 46 61 47 63"
      stroke="#594433"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M51 63C52 61 55 61 56 63"
      stroke="#594433"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Cute nose */}
    <ellipse cx="48.5" cy="67" rx="2" ry="1.5" fill="#FF7E67" />
    {/* Rosy cheeks */}
    <circle cx="39" cy="66" r="3" fill="#FFC9C0" opacity="0.8" />
    <circle cx="58" cy="66" r="3" fill="#FFC9C0" opacity="0.8" />
    {/* Little tail */}
    <path
      d="M84 76C89 74 94 77 92 82C90 85 86 83 84 80"
      stroke="#E5B98A"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Floating tiny Zzz */}
    <text x="74" y="44" fill="#9C9188" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
      z
    </text>
    <text x="83" y="36" fill="#9C9188" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
      z
    </text>
  </svg>
);
