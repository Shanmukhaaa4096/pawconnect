import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { KawaiiEmptyPet, KawaiiPaw } from '../components/common/KawaiiIcons';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-sm border border-[#EDE6DC] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-4 right-4 text-[#FF7E67]/20">
          <KawaiiPaw className="w-8 h-8" />
        </div>

        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-[#FFF8F6] rounded-3xl border border-[#FFE7E2] shadow-inner">
            <KawaiiEmptyPet className="w-36 h-36" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F6] border border-[#FFE7E2] text-xs font-semibold text-[#FF7E67] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lost & Found Department</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2B2523] tracking-tight font-heading mb-2">
          Page Wandered Off!
        </h1>
        <p className="text-sm text-[#7A6E68] leading-relaxed mb-8 max-w-sm mx-auto">
          Looks like this page got distracted by a ball of yarn and strayed off path. Let's guide you back home safely.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FF7E67] hover:bg-[#F26B53] text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/browse"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FFFDF9] border border-[#EDE6DC] text-[#5C524E] hover:text-[#2B2523] hover:bg-[#FAF7F2] font-semibold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Pets</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

