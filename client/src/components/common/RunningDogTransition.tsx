import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, Play, ChevronUp, Check, Gauge } from 'lucide-react';
import { DogDuo, CatDuo, HamsterDuo, RabbitDuo } from './StickerPets';

export type CompanionAnimal = 'dog' | 'cat' | 'hamster' | 'rabbit';
export type RunnerSpeed = 'extra-slow' | 'slow' | 'normal' | 'fast';

interface CompanionOption {
  id: CompanionAnimal;
  emoji: string;
  name: string;
  tagline: string;
  badge: string;
}

interface SpeedOption {
  id: RunnerSpeed;
  label: string;
  seconds: string;
  emoji: string;
  durationMs: number;
  runClass: string;
  progressClass: string;
}

const COMPANION_OPTIONS: CompanionOption[] = [
  {
    id: 'dog',
    emoji: '🐶',
    name: 'Playful Puppies',
    tagline: 'Two pups wrestling & play-fighting',
    badge: 'Popular',
  },
  {
    id: 'cat',
    emoji: '🐱',
    name: 'Playful Kittens',
    tagline: 'Two cats pouncing & batting yarn',
    badge: 'Cute',
  },
  {
    id: 'hamster',
    emoji: '🐹',
    name: 'Rolling Hamsters',
    tagline: 'Chubby hamsters tumbling for seeds',
    badge: 'Chonky',
  },
  {
    id: 'rabbit',
    emoji: '🐰',
    name: 'Bouncing Bunnies',
    tagline: 'Lop bunnies doing binkies & chasing carrots',
    badge: 'Bouncy',
  },
];

const SPEED_OPTIONS: SpeedOption[] = [
  {
    id: 'extra-slow',
    label: 'Ultra Chill',
    seconds: '12s',
    emoji: '🦥',
    durationMs: 12000,
    runClass: 'animate-run-across-extra-slow',
    progressClass: 'animate-page-progress-extra-slow',
  },
  {
    id: 'slow',
    label: 'Slow Stroll',
    seconds: '8.5s',
    emoji: '🐢',
    durationMs: 8500,
    runClass: 'animate-run-across-slow',
    progressClass: 'animate-page-progress-slow',
  },
  {
    id: 'normal',
    label: 'Gentle Trot',
    seconds: '5.0s',
    emoji: '🐾',
    durationMs: 5000,
    runClass: 'animate-run-across-normal',
    progressClass: 'animate-page-progress-normal',
  },
  {
    id: 'fast',
    label: 'Brisk',
    seconds: '3.0s',
    emoji: '⚡',
    durationMs: 3000,
    runClass: 'animate-run-across-fast',
    progressClass: 'animate-page-progress-fast',
  },
];

export const RunningDogTransition: React.FC = () => {
  const location = useLocation();

  // Selected animal (persisted)
  const [selectedAnimal, setSelectedAnimal] = useState<CompanionAnimal>(() => {
    const saved = localStorage.getItem('pawconnect_runner_animal') as CompanionAnimal;
    return ['dog', 'cat', 'hamster', 'rabbit'].includes(saved) ? saved : 'dog';
  });

  // Selected speed (persisted, defaults to 'slow' 8.5s)
  const [selectedSpeed, setSelectedSpeed] = useState<RunnerSpeed>(() => {
    const saved = localStorage.getItem('pawconnect_runner_speed') as RunnerSpeed;
    return ['extra-slow', 'slow', 'normal', 'fast'].includes(saved) ? saved : 'slow';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSpeedOption = SPEED_OPTIONS.find((s) => s.id === selectedSpeed) || SPEED_OPTIONS[0];

  // Trigger animation function
  const triggerTransition = (speedOverride?: RunnerSpeed) => {
    const activeSpeed = SPEED_OPTIONS.find((s) => s.id === (speedOverride || selectedSpeed)) || currentSpeedOption;

    setTransitionKey((k) => k + 1);
    setIsTransitioning(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Keep overlay active for duration of animation + small buffer
    timerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, activeSpeed.durationMs + 100);
  };

  // Trigger on route change
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      triggerTransition();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [location.pathname]);

  // Handle animal change
  const handleSelectAnimal = (animalId: CompanionAnimal) => {
    setSelectedAnimal(animalId);
    localStorage.setItem('pawconnect_runner_animal', animalId);
    triggerTransition();
  };

  // Handle speed change
  const handleSelectSpeed = (speedId: RunnerSpeed) => {
    setSelectedSpeed(speedId);
    localStorage.setItem('pawconnect_runner_speed', speedId);
    triggerTransition(speedId);
  };

  const currentOption = COMPANION_OPTIONS.find((c) => c.id === selectedAnimal) || COMPANION_OPTIONS[0];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. RUNNING & PLAY-FIGHTING TRANSITION OVERLAY
          ───────────────────────────────────────────────────────────── */}
      {isTransitioning && (
        <div
          key={transitionKey}
          aria-hidden="true"
          className="fixed inset-x-0 bottom-16 md:bottom-20 pointer-events-none z-[99999] overflow-visible select-none h-32"
        >
          {/* Top Progress Bar matching speed */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-[#F8DDBF]/60 z-[99999]">
            <div
              className={`h-full bg-gradient-to-r from-[#C2572F] via-[#E88B52] via-[#F4B400] to-[#FF8B8B] shadow-[0_0_8px_rgba(194,87,47,0.8)] ${currentSpeedOption.progressClass}`}
            />
          </div>

          {/* Floating Subtle Ground Runner Track */}
          <div className="absolute inset-x-0 bottom-1 h-[2px] bg-gradient-to-r from-transparent via-[#C2572F]/25 to-transparent" />

          {/* Runner Container: Moves from left (-300px) to right (100vw + 240px) at the chosen slow pace (4.8s by default) */}
          <div
            className={`absolute left-0 bottom-1 ${currentSpeedOption.runClass} flex items-end transform scale-[0.68] md:scale-[0.8] origin-bottom`}
          >
            {/* Trailing comic dust and sparkles */}
            <div className="relative flex items-center pr-2 -mb-1 opacity-80">
              <span className="inline-block w-3 h-3 rounded-full bg-[#EBC9A5] animate-pulse" />
              <span className="inline-block w-4 h-4 rounded-full bg-[#F8DDBF] -ml-1.5 animate-pulse" />
              <span className="text-xs ml-0.5 select-none transform -rotate-12">🐾</span>
              <span className="text-[11px] ml-1 text-[#C2572F] animate-bounce select-none">✨</span>
              <span className="text-xs ml-1 select-none">🐾</span>
            </div>

            {/* ── PAIR 1: GALLOPING DOGS ── */}
            {selectedAnimal === 'dog' && <DogDuo />}

            {/* ── CAT / HAMSTER / RABBIT DUOS ── */}
            {selectedAnimal === 'cat' && <CatDuo />}
            {selectedAnimal === 'hamster' && <HamsterDuo />}
            {selectedAnimal === 'rabbit' && <RabbitDuo />}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING KAWAII COMPANION SELECTOR PILL & MODAL
          ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-20 right-3 md:bottom-6 md:right-6 z-[90] flex flex-col items-end">
        {/* Expanded Animal & Speed Selector Popover */}
        {isPickerOpen && (
          <div className="mb-3 w-84 max-w-[calc(100vw-2rem)] bg-white rounded-3xl p-5 border-2 border-[#EBC9A5] shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F3DCC0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F8DDBF] flex items-center justify-center text-sm shadow-xs">
                  🐾
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#3E1F1A] leading-none">Page Companions</h4>
                  <p className="text-[11px] text-[#8A5A48] mt-0.5">Select duo & pace for page transitions</p>
                </div>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1 rounded-full text-[#8A5A48] hover:text-[#3E1F1A] hover:bg-[#FCE8D0] transition"
                aria-label="Close picker"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Animal Selection List */}
            <div className="mt-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#B99A86] px-1">
                Choose Companion Duo
              </span>
              {COMPANION_OPTIONS.map((opt) => {
                const isSelected = selectedAnimal === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectAnimal(opt.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-[#FFF3E2] border-[#C2572F] shadow-sm'
                        : 'bg-white border-[#EBC9A5] hover:bg-[#FCE8D0]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#EBC9A5] flex items-center justify-center text-lg shadow-xs">
                        {opt.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-[#3E1F1A]">{opt.name}</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-[#F8DDBF] text-[#8E3B22] text-[9px] font-black">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8A5A48] leading-tight mt-0.5">{opt.tagline}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#C2572F] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Speed Selector (Slow / Normal / Fast) */}
            <div className="mt-3 pt-3 border-t border-[#F3DCC0]">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#B99A86] flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-[#C2572F]" />
                  Animation Speed
                </span>
                <span className="text-[10px] font-bold text-[#C2572F]">
                  {currentSpeedOption.seconds}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {SPEED_OPTIONS.map((spd) => {
                  const isSpeedActive = selectedSpeed === spd.id;
                  return (
                    <button
                      key={spd.id}
                      onClick={() => handleSelectSpeed(spd.id)}
                      className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl border text-center transition ${
                        isSpeedActive
                          ? 'bg-[#C2572F] text-white border-[#8E3B22] shadow-sm font-black'
                          : 'bg-white border-[#EBC9A5] text-[#3E1F1A] hover:bg-[#FCE8D0]'
                      }`}
                    >
                      <span className="text-sm">{spd.emoji}</span>
                      <span className="text-[10px] font-black mt-0.5 leading-tight">{spd.label.split(' ')[0]}</span>
                      <span
                        className={`text-[9px] ${
                          isSpeedActive ? 'text-white/80' : 'text-[#8A5A48]'
                        }`}
                      >
                        {spd.seconds}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar: Test / Replay Animation */}
            <div className="mt-4 pt-3 border-t border-[#F3DCC0] flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#8A5A48] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C2572F]" />
                Auto-saves preference
              </span>
              <button
                onClick={() => triggerTransition()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C2572F] text-white text-xs font-black shadow hover:bg-[#8E3B22] transition active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Test Run ({currentSpeedOption.seconds})</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Toggle Pill Button */}
        <button
          onClick={() => setIsPickerOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 hover:bg-white text-[#3E1F1A] border-2 border-[#EBC9A5] shadow-lg hover:shadow-xl hover:border-[#C2572F] transition-all transform hover:scale-105 active:scale-95 backdrop-blur-md"
          title="Click to customize page transition companion and speed"
        >
          <span className="text-base">{currentOption.emoji}</span>
          <span className="text-xs font-black text-[#3E1F1A] hidden sm:inline">
            Companion: <span className="text-[#C2572F]">{currentOption.name.split(' ')[1] || currentOption.name}</span>
            <span className="text-[10px] font-bold text-[#8A5A48] ml-1">({currentSpeedOption.seconds})</span>
          </span>
          <span className="text-xs font-black text-[#C2572F] sm:hidden">
            {currentOption.name.split(' ')[1] || currentOption.name} ({currentSpeedOption.seconds})
          </span>
          <ChevronUp
            className={`w-3.5 h-3.5 text-[#8A5A48] transition-transform ${isPickerOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </>
  );
};

export default RunningDogTransition;
