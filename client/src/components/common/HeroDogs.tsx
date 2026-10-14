import React, { useId } from 'react';

/** Flat sticker-style standing dog (faces right). Used mirrored in the landing hero. */

const OUT = '#5A2A22';
const COAT = '#F8D9AE';
const PATCH = '#5A2A22';
const COLLAR = '#E8873F';
const TONGUE = '#F29AA8';

const STYLES = `
@keyframes hdTail { 0%,100% { transform: rotate(-12deg); } 50% { transform: rotate(16deg); } }
@keyframes hdEar { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-9deg); } }
@keyframes hdPant { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.25); } }
@keyframes hdBreathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.018); } }
.hd-tail { animation: hdTail 1s ease-in-out infinite; transform-origin: 46px 88px; }
.hd-ear { animation: hdEar 2.4s ease-in-out infinite; transform-origin: 176px 38px; }
.hd-pant { animation: hdPant .7s ease-in-out infinite; transform-origin: 208px 66px; }
.hd-breathe { animation: hdBreathe 2.4s ease-in-out infinite; transform-origin: 120px 172px; }
@media (prefers-reduced-motion: reduce) { .hd-tail, .hd-ear, .hd-pant, .hd-breathe { animation: none; } }
`;

// Torso + neck + head + snout as one silhouette so nothing floats.
const SILHOUETTE =
  'M38 92 C40 76 60 72 90 72 C120 72 138 74 150 70 C158 66 160 52 164 42 ' +
  'C168 30 184 26 196 32 C204 36 212 44 224 48 C232 51 234 62 226 66 ' +
  'C218 70 206 68 198 66 C190 74 184 84 182 92 C184 108 178 124 164 126 ' +
  'L62 126 C46 126 36 110 38 92 Z';

const Leg: React.FC<{ x: number; line: object }> = ({ x, line }) => (
  <g {...line} fill={COAT}>
    <path d={`M${x - 8} 112 L${x - 7} 164 Q${x - 7} 172 ${x + 1} 172 Q${x + 9} 172 ${x + 8} 164 L${x + 8} 112 Z`} />
  </g>
);

export const HeroDog: React.FC<{ className?: string; flip?: boolean; delay?: string }> = ({
  className = '',
  flip = false,
  delay = '0s',
}) => {
  const clipId = useId();
  const line = { stroke: OUT, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  const anim = { animationDelay: delay };

  return (
    <svg
      viewBox="0 0 240 180"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
      aria-hidden="true"
    >
      <style>{STYLES}</style>
      <defs>
        <clipPath id={clipId}>
          <path d={SILHOUETTE} />
        </clipPath>
      </defs>

      <g className="hd-breathe" style={anim}>
        {/* tail: curls up from the rump */}
        <g className="hd-tail" style={anim} {...line}>
          <path d="M44 92 C22 92 8 70 18 52 C26 64 34 70 52 78 Z" fill={COAT} />
        </g>

        {/* far legs sit behind the body */}
        <Leg x={84} line={line} />
        <Leg x={176} line={line} />
        <Leg x={62} line={line} />
        <Leg x={154} line={line} />

        {/* body + neck + head */}
        <path d={SILHOUETTE} fill={COAT} {...line} />
        <g clipPath={`url(#${clipId})`}>
          <ellipse cx="100" cy="92" rx="24" ry="15" fill={PATCH} />
        </g>
        <path d={SILHOUETTE} fill="none" {...line} />

        {/* hind thigh */}
        <g {...line} fill={COAT}>
          <ellipse cx="66" cy="112" rx="25" ry="20" />
        </g>

        {/* collar */}
        <path d="M156 76 C166 88 180 90 190 80" stroke={COLLAR} strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="175" cy="92" r="5" fill="#F4B400" {...line} strokeWidth="2.5" />

        {/* face */}
        <circle cx="200" cy="44" r="4.2" fill={OUT} />
        <circle cx="201.4" cy="42.6" r="1.3" fill="#FFFFFF" />
        <ellipse cx="229" cy="54" rx="6" ry="5" fill={OUT} />
        <g className="hd-pant" style={anim}>
          <path d="M207 66 C207 77 217 77 217 67 Z" fill={TONGUE} stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
        <path d="M224 63 C216 68 206 66 200 62" stroke={OUT} strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* floppy ear */}
        <g className="hd-ear" style={anim} {...line}>
          <path d="M176 36 C160 38 156 64 166 80 C180 76 190 58 186 40 Z" fill={PATCH} />
        </g>
      </g>
    </svg>
  );
};
