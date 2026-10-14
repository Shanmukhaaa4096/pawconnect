import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const PRINT_COUNT = 6;
const CYCLE_S = 3;
const STEP_S = 0.38;

const STYLES = `
@keyframes pcPrintStep {
  0%   { opacity: 0; transform: scale(0.7); }
  8%   { opacity: 0.92; transform: scale(1.06); }
  14%  { opacity: 0.85; transform: scale(1); }
  62%  { opacity: 0.55; transform: scale(1); }
  85%  { opacity: 0; transform: scale(1); }
  100% { opacity: 0; transform: scale(1); }
}
@keyframes pcLabelPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
@keyframes pcDots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}
.pc-dots::after { content: ''; animation: pcDots 1.4s steps(1, end) infinite; }
@media (prefers-reduced-motion: reduce) {
  .pc-print { animation: none !important; opacity: 0.7 !important; }
  .pc-label { animation: none !important; }
  .pc-dots::after { animation: none; content: '...'; }
}
`;

/** One realistic paw print: large metacarpal pad + 4 toe pads, pointing up. */
const PawPrint: React.FC = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
    <defs>
      <radialGradient id="pcPawInk" cx="50%" cy="55%" r="60%">
        <stop offset="0%" stopColor="#4A382C" />
        <stop offset="100%" stopColor="#2E221A" />
      </radialGradient>
    </defs>
    <g fill="url(#pcPawInk)">
      {/* main pad: wide, three-lobed bottom like a real dog pad */}
      <path d="M32 29c-8 0-17 8-17 17 0 6 4.5 9.5 9.5 8.5 3-.6 4.8-2 7.5-2s4.5 1.4 7.5 2C44.5 55.5 49 52 49 46c0-9-9-17-17-17z" />
      {/* toes */}
      <ellipse cx="13" cy="29" rx="5" ry="7.2" transform="rotate(-24 13 29)" />
      <ellipse cx="25" cy="16.5" rx="5.5" ry="8.2" transform="rotate(-7 25 16.5)" />
      <ellipse cx="39" cy="16.5" rx="5.5" ry="8.2" transform="rotate(7 39 16.5)" />
      <ellipse cx="51" cy="29" rx="5" ry="7.2" transform="rotate(24 51 29)" />
    </g>
  </svg>
);

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading…',
  className = '',
}) => {
  const printPx = { sm: 32, md: 52, lg: 76 }[size];
  const stride = printPx * 1.15;
  const zig = printPx * 0.38;
  // Strip trailing ellipsis; animated dots replace it.
  const text = label.replace(/(…|\.{2,})\s*$/, '');

  return (
    <div className={`flex flex-col items-center justify-center p-10 gap-4 ${className}`}>
      <style>{STYLES}</style>
      <div
        role="status"
        aria-label={label}
        className="relative"
        style={{ width: stride * PRINT_COUNT + printPx, height: printPx * 1.9 }}
      >
        {Array.from({ length: PRINT_COUNT }, (_, i) => {
          const left = i % 2 === 0;
          return (
            <span
              key={i}
              className="pc-print absolute block"
              style={{
                width: printPx,
                height: printPx,
                left: i * stride,
                top: left ? printPx * 0.45 - zig : printPx * 0.45 + zig,
                opacity: 0,
                animation: `pcPrintStep ${CYCLE_S}s ease-out infinite`,
                animationDelay: `${i * STEP_S}s`,
              }}
            >
              {/* paws point right (direction of travel), tilted per step */}
              <span
                className="block"
                style={{ width: '100%', height: '100%', transform: `rotate(${90 + (left ? -8 : 8)}deg)` }}
              >
                <PawPrint />
              </span>
            </span>
          );
        })}
      </div>
      {label && (
        <p
          className="pc-label text-sm font-medium"
          style={{
            color: '#7C8178',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            animation: 'pcLabelPulse 1.6s ease-in-out infinite',
          }}
        >
          {text}
          <span className="pc-dots" aria-hidden="true" />
        </p>
      )}
    </div>
  );
};
