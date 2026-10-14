import React from 'react';

/**
 * Flat "sticker" style animals for the page-transition runner.
 * Rules: one thick dark outline, three flat fills per animal (coat / dark / belly), tiny pink accent,
 * no gradients, no highlights. Side view facing right. Keyframes prefixed `sp-`.
 */

interface Palette {
  coat: string;
  dark: string; // far legs, ears, tail tip
  belly: string; // muzzle, paws, cheeks
}

const OUT = '#3B2A2A';
const PINK = '#F29AA8';
const SW = 3;

const outline = {
  stroke: OUT,
  strokeWidth: SW,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

const STYLES = `
@keyframes spLegA { 0%,100% { transform: rotate(-30deg); } 50% { transform: rotate(30deg); } }
@keyframes spLegB { 0%,100% { transform: rotate(30deg); } 50% { transform: rotate(-30deg); } }
@keyframes spScurryA { 0%,100% { transform: rotate(-38deg); } 50% { transform: rotate(38deg); } }
@keyframes spScurryB { 0%,100% { transform: rotate(38deg); } 50% { transform: rotate(-38deg); } }
@keyframes spBob {
  0%,100% { transform: translateY(0) rotate(-1deg); }
  25% { transform: translateY(-3px) rotate(0.5deg); }
  50% { transform: translateY(0) rotate(1.5deg); }
  75% { transform: translateY(-2.5px) rotate(0deg); }
}
@keyframes spHamBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2.5px); } }
@keyframes spHop {
  0%   { transform: translateY(0) scale(1.06, 0.92); }
  18%  { transform: translateY(0) scale(0.95, 1.07); }
  45%  { transform: translateY(-26px) rotate(-6deg) scale(0.97, 1.04); }
  68%  { transform: translateY(-14px) rotate(5deg); }
  88%  { transform: translateY(0) scale(1.07, 0.9); }
  100% { transform: translateY(0) scale(1.06, 0.92); }
}
@keyframes spHind { 0%,100% { transform: rotate(-4deg); } 22% { transform: rotate(8deg); } 48% { transform: rotate(42deg); } 75% { transform: rotate(-14deg); } }
@keyframes spFore { 0%,100% { transform: rotate(14deg); } 45% { transform: rotate(-55deg); } 80% { transform: rotate(-20deg); } }
@keyframes spEar { 0%,100% { transform: rotate(8deg); } 50% { transform: rotate(-22deg); } }
@keyframes spTail { 0%,100% { transform: rotate(-14deg); } 50% { transform: rotate(18deg); } }
@keyframes spTongue { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.2); } }
@keyframes spShadow { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(.8); } }
@keyframes spShadowHop { 0%,100% { transform: scaleX(1.05); } 45% { transform: scaleX(.6); } }
@keyframes spLeap { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-12px); } 70% { transform: translateY(0); } }
.sp-leg-a { animation: spLegA .5s ease-in-out infinite; transform-origin: 0 0; }
.sp-leg-b { animation: spLegB .5s ease-in-out infinite; transform-origin: 0 0; }
.sp-scurry-a { animation: spScurryA .22s linear infinite; transform-origin: 0 0; }
.sp-scurry-b { animation: spScurryB .22s linear infinite; transform-origin: 0 0; }
.sp-bob { animation: spBob .5s ease-in-out infinite; transform-origin: 60px 60px; }
.sp-ham-bob { animation: spHamBob .22s ease-in-out infinite; }
.sp-hop { animation: spHop 1s cubic-bezier(.35,.1,.4,1) infinite; transform-origin: 62px 92px; }
.sp-hind { animation: spHind 1s ease-in-out infinite; transform-origin: 0 0; }
.sp-fore { animation: spFore 1s ease-in-out infinite; transform-origin: 0 0; }
.sp-ear { animation: spEar .5s ease-in-out infinite; transform-origin: 0 0; }
.sp-ear-hop { animation: spEar 1s ease-in-out infinite; transform-origin: 0 0; }
.sp-tail { animation: spTail .35s ease-in-out infinite; transform-origin: 0 0; }
.sp-tail-slow { animation: spTail .7s ease-in-out infinite; transform-origin: 0 0; }
.sp-tongue { animation: spTongue .5s ease-in-out infinite; transform-origin: 0 0; }
.sp-shadow { animation: spShadow .5s ease-in-out infinite; transform-origin: 60px 80px; }
.sp-shadow-hop { animation: spShadowHop 1s ease-in-out infinite; transform-origin: 62px 92px; }
.sp-leap { animation: spLeap 1.7s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  [class^="sp-"], [class*=" sp-"] { animation: none !important; }
}
`;

const d = (delay: string): React.CSSProperties => ({ animationDelay: delay });

const Leg: React.FC<{
  x: number;
  y: number;
  s?: number;
  cls: string;
  fill: string;
  paw: string;
  delay: string;
}> = ({ x, y, s = 1, cls, fill, paw, delay }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} {...outline}>
    <g className={cls} style={d(delay)}>
      <rect x="-4.5" y="0" width="9" height="23" rx="4.5" fill={fill} />
      <ellipse cx="1" cy="23.5" rx="5.5" ry="3.2" fill={paw} />
    </g>
  </g>
);

const Eye: React.FC<{ x: number; y: number }> = ({ x, y }) => <circle cx={x} cy={y} r="2.8" fill={OUT} />;

/* ───────────────────────── DOGS & CATS (same body) ───────────────────────── */

const GOLDEN: Palette = { coat: '#E6A455', dark: '#B5722C', belly: '#FFF1D6' };
const COLLIE: Palette = { coat: '#433A3A', dark: '#2A2323', belly: '#FFFFFF' };
const TABBY: Palette = { coat: '#EE9A4A', dark: '#B96A25', belly: '#FFF0D8' };
const GREY_CAT: Palette = { coat: '#8E94A3', dark: '#5F6573', belly: '#F2F2F2' };

const Quad: React.FC<{ kind: 'dog' | 'cat'; p: Palette; title: string; delay: string }> = ({
  kind,
  p,
  title,
  delay,
}) => {
  const dog = kind === 'dog';
  return (
    <svg viewBox="0 0 130 90" width="140" height="97" role="img" aria-label={title} style={{ overflow: 'visible' }}>
      <ellipse className="sp-shadow" cx="62" cy="85" rx="38" ry="3.5" fill={OUT} opacity="0.15" style={d(delay)} />
      <g className="sp-bob" style={d(delay)}>
        <Leg x={40} y={56} cls="sp-leg-b" fill={p.dark} paw={p.dark} delay={delay} />
        <Leg x={88} y={56} cls="sp-leg-a" fill={p.dark} paw={p.dark} delay={delay} />

        {/* tail */}
        <g transform="translate(28 44)" {...outline}>
          <g className={dog ? 'sp-tail' : 'sp-tail-slow'} style={d(delay)}>
            {dog ? (
              <path d="M2 3 C-9 0 -16 -10 -14 -22 C-7 -20 -1 -12 5 -6 Z" fill={p.coat} />
            ) : (
              <path d="M2 4 C-16 2 -25 -14 -19 -32 C-14 -36 -9 -32 -11 -27 C-15 -16 -9 -8 5 -6 Z" fill={p.dark} />
            )}
          </g>
        </g>

        {/* body */}
        <g {...outline}>
          <ellipse cx="58" cy="48" rx="34" ry="19" fill={p.coat} />
        </g>
        <ellipse cx="62" cy="58" rx="22" ry="6.5" fill={p.belly} />

        {/* head */}
        <g {...outline}>
          {!dog && (
            <>
              <path d="M91 27 L90 10 L102 21 Z" fill={p.coat} />
              <path d="M103 21 L113 10 L113 28 Z" fill={p.coat} />
            </>
          )}
          <circle cx="99" cy="38" r="14" fill={p.coat} />
          <ellipse cx={dog ? 111 : 109} cy="43" rx={dog ? 10 : 7.5} ry={dog ? 7 : 5.5} fill={p.belly} />
          <circle cx={dog ? 119 : 114} cy={dog ? 40 : 40.5} r="2.6" fill={dog ? OUT : PINK} />
          {dog && (
            <g transform="translate(110 47)">
              <g className="sp-tongue" style={d(delay)}>
                <path d="M-3 0 C-3 8 4 8 4 0 Z" fill={PINK} />
              </g>
            </g>
          )}
        </g>
        <Eye x={104} y={34} />
        {dog && (
          <g transform="translate(93 28)" {...outline}>
            <g className="sp-ear" style={d(delay)}>
              <path d="M0 0 C-8 2 -10 14 -4 21 C3 19 7 9 5 0 Z" fill={p.dark} />
            </g>
          </g>
        )}

        <Leg x={47} y={57} cls="sp-leg-a" fill={p.coat} paw={p.belly} delay={delay} />
        <Leg x={82} y={57} cls="sp-leg-b" fill={p.coat} paw={p.belly} delay={delay} />
      </g>
    </svg>
  );
};

const Duo: React.FC<{ gap?: number; children: React.ReactNode }> = ({ gap = 6, children }) => (
  <div className="relative flex items-end" style={{ gap }}>
    <style>{STYLES}</style>
    {children}
  </div>
);

export const DogDuo: React.FC = () => (
  <Duo>
    <div className="sp-leap">
      <Quad kind="dog" p={COLLIE} title="Collie pup running" delay="-0.2s" />
    </div>
    <Quad kind="dog" p={GOLDEN} title="Golden pup running" delay="0s" />
  </Duo>
);

export const CatDuo: React.FC = () => (
  <Duo>
    <div className="sp-leap">
      <Quad kind="cat" p={GREY_CAT} title="Grey kitten running" delay="-0.18s" />
    </div>
    <Quad kind="cat" p={TABBY} title="Tabby kitten running" delay="0s" />
  </Duo>
);

/* ───────────────────────── HAMSTERS ───────────────────────── */

const GOLD_HAM: Palette = { coat: '#EBB872', dark: '#B98445', belly: '#FFF3DE' };
const GREY_HAM: Palette = { coat: '#A3A3AE', dark: '#72727E', belly: '#F5F3F3' };

const Hamster: React.FC<{ p: Palette; title: string; delay: string }> = ({ p, title, delay }) => (
  <svg viewBox="0 0 110 80" width="108" height="79" role="img" aria-label={title} style={{ overflow: 'visible' }}>
    <ellipse className="sp-shadow" cx="54" cy="76" rx="32" ry="3" fill={OUT} opacity="0.15" style={d(delay)} />
    <g className="sp-ham-bob" style={d(delay)}>
      <Leg x={40} y={60} s={0.5} cls="sp-scurry-b" fill={p.dark} paw={p.dark} delay={delay} />
      <Leg x={74} y={60} s={0.5} cls="sp-scurry-a" fill={p.dark} paw={p.dark} delay={delay} />
      <g {...outline}>
        <circle cx="16" cy="50" r="4" fill={p.coat} />
        <ellipse cx="48" cy="46" rx="32" ry="22" fill={p.coat} />
      </g>
      <ellipse cx="54" cy="56" rx="21" ry="8" fill={p.belly} />
      <g {...outline}>
        <circle cx="70" cy="30" r="6.5" fill={p.dark} />
        <ellipse cx="80" cy="46" rx="19" ry="17" fill={p.coat} />
        <ellipse cx="88" cy="54" rx="12" ry="10" fill={p.belly} />
      </g>
      <circle cx="70" cy="30.5" r="3" fill={PINK} />
      <Eye x={86} y={41} />
      <circle cx="98" cy="47" r="2.6" fill={PINK} stroke={OUT} strokeWidth="1.5" />
      <Leg x={47} y={62} s={0.5} cls="sp-scurry-a" fill={p.coat} paw={p.belly} delay={delay} />
      <Leg x={80} y={62} s={0.5} cls="sp-scurry-b" fill={p.coat} paw={p.belly} delay={delay} />
    </g>
  </svg>
);

export const HamsterDuo: React.FC = () => (
  <Duo gap={8}>
    <Hamster p={GREY_HAM} title="Grey hamster scurrying" delay="-0.08s" />
    <Hamster p={GOLD_HAM} title="Golden hamster scurrying" delay="0s" />
  </Duo>
);

/* ───────────────────────── RABBITS ───────────────────────── */

const BROWN_BUN: Palette = { coat: '#B98150', dark: '#865632', belly: '#FBEBD6' };
const GREY_BUN: Palette = { coat: '#BDB9C2', dark: '#8C8892', belly: '#FFFFFF' };

const Rabbit: React.FC<{ p: Palette; title: string; delay: string }> = ({ p, title, delay }) => (
  <svg viewBox="0 0 130 100" width="132" height="102" role="img" aria-label={title} style={{ overflow: 'visible' }}>
    <ellipse className="sp-shadow-hop" cx="62" cy="94" rx="36" ry="3.5" fill={OUT} opacity="0.15" style={d(delay)} />
    <g className="sp-hop" style={d(delay)}>
      <g {...outline}>
        <circle cx="24" cy="66" r="7.5" fill={p.belly} />
      </g>

      {/* far ear */}
      <g transform="translate(95 44)" {...outline}>
        <g className="sp-ear-hop" style={d(`calc(${delay} + .05s)`)}>
          <ellipse cx="-2" cy="-17" rx="5" ry="16" fill={p.dark} transform="rotate(-18)" />
        </g>
      </g>

      <g {...outline}>
        <ellipse cx="58" cy="68" rx="32" ry="20" fill={p.coat} />
      </g>
      <ellipse cx="64" cy="77" rx="22" ry="6" fill={p.belly} />

      {/* hind leg */}
      <g transform="translate(42 72)" {...outline}>
        <g className="sp-hind" style={d(delay)}>
          <ellipse cx="0" cy="0" rx="15" ry="12" fill={p.coat} />
          <ellipse cx="12" cy="11" rx="15" ry="4.5" fill={p.belly} />
        </g>
      </g>

      {/* head */}
      <g {...outline}>
        <ellipse cx="98" cy="54" rx="14" ry="12.5" fill={p.coat} />
        <ellipse cx="110" cy="58" rx="8.5" ry="7" fill={p.belly} />
      </g>
      <circle cx="116" cy="55" r="2.4" fill={PINK} stroke={OUT} strokeWidth="1.5" />
      <Eye x={103} y={49} />

      {/* near ear */}
      <g transform="translate(94 45)" {...outline}>
        <g className="sp-ear-hop" style={d(delay)}>
          <ellipse cx="-2" cy="-18" rx="5.5" ry="17" fill={p.coat} transform="rotate(-14)" />
          <ellipse cx="-2" cy="-18" rx="2.5" ry="11" fill={PINK} stroke="none" transform="rotate(-14)" />
        </g>
      </g>

      {/* fore paw */}
      <g transform="translate(88 76)" {...outline}>
        <g className="sp-fore" style={d(delay)}>
          <rect x="-4" y="0" width="8" height="15" rx="4" fill={p.coat} />
          <ellipse cx="0.5" cy="16" rx="5" ry="3" fill={p.belly} />
        </g>
      </g>
    </g>
  </svg>
);

export const RabbitDuo: React.FC = () => (
  <Duo>
    <Rabbit p={BROWN_BUN} title="Brown bunny hopping" delay="-0.45s" />
    <Rabbit p={GREY_BUN} title="Grey bunny hopping" delay="0s" />
  </Duo>
);
