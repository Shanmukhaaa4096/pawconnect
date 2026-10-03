import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Heart,
  ShieldCheck,
  ArrowRight,
  PawPrint,
  Sparkles,
} from 'lucide-react';
import { Pet } from '../types';
import { api } from '../services/api';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { KawaiiPaw, KawaiiSparkle } from '../components/common/KawaiiIcons';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpecies, setSearchSpecies] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await api.getPets();
        setFeaturedPets(res.pets.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchSpecies !== 'All') params.append('species', searchSpecies);
    if (searchLocation.trim()) params.append('location', searchLocation.trim());
    navigate(`/browse?${params.toString()}`);
  };

  const categories = [
    { label: 'Dogs & Pups', species: 'Dog', icon: '🐶', count: '6+ Available', bg: 'bg-[#FFF6EC]', border: 'border-[#F8E2CA]' },
    { label: 'Cats & Kittens', species: 'Cat', icon: '🐱', count: '4+ Available', bg: 'bg-[#F2F1FD]', border: 'border-[#DFDCF7]' },
    { label: 'Rabbits & Small', species: 'Rabbit', icon: '🐰', count: '2+ Available', bg: 'bg-[#EEF8F5]', border: 'border-[#CCE8DF]' },
    { label: 'Birds & Others', species: 'Bird', icon: '🦜', count: '1+ Available', bg: 'bg-[#FFF2EE]', border: 'border-[#FCD7CE]' },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-14 lg:pt-14 lg:pb-20">
        {/* Subtle decorative background blur blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 flex justify-between opacity-70">
          <div className="w-72 h-72 rounded-full bg-[#FF7E67]/10 blur-3xl" />
          <div className="w-80 h-80 rounded-full bg-[#82C341]/10 blur-3xl" />
          <div className="w-72 h-72 rounded-full bg-[#7C69EF]/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Kawaii Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF6EC] border border-[#F8E2CA] text-[#965B20] text-xs font-bold tracking-wide shadow-xs">
                <KawaiiSparkle className="w-4 h-4 text-[#FF7E67]" />
                <span>Trusted by 50+ Certified Shelters & Rescues</span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#FF7E67]" />
                <span className="hidden sm:inline-block text-[#2B2523]/70 font-semibold">100% Ethical</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2B2523] tracking-tight leading-[1.12]">
                Find Your <span className="relative inline-block text-[#FF7E67]">
                  Forever Friend
                  <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-[#FFD8CF] -z-10 fill-current opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="transparent" />
                  </svg>
                </span> & Bring Warmth Home.
              </h1>

              <p className="text-base sm:text-lg text-[#5C524E] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connect directly with verified animal shelters and ethical rescues. Browse vetted profiles, submit digital adoption requests, and chat happily in real-time.
              </p>

              {/* Kawaii Search Box */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white p-3 sm:p-4 rounded-3xl shadow-sm border border-[#EDE6DC] max-w-2xl mx-auto lg:mx-0 grid grid-cols-1 sm:grid-cols-12 gap-3 focus-within:border-[#FF7E67]/50 focus-within:shadow-md transition-all"
              >
                <div className="sm:col-span-5 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF7F2] rounded-2xl border border-[#EDE6DC]/80">
                  <KawaiiPaw className="w-5 h-5 text-[#FF7E67] shrink-0" />
                  <select
                    value={searchSpecies}
                    onChange={(e) => setSearchSpecies(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-[#2B2523] focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Pet Types</option>
                    <option value="Dog">Dogs & Puppies 🐶</option>
                    <option value="Cat">Cats & Kittens 🐱</option>
                    <option value="Rabbit">Rabbits 🐰</option>
                    <option value="Bird">Birds 🦜</option>
                  </select>
                </div>

                <div className="sm:col-span-4 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FAF7F2] rounded-2xl border border-[#EDE6DC]/80">
                  <MapPin className="w-4 h-4 text-[#FF7E67] shrink-0" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="City or state..."
                    className="w-full bg-transparent text-sm font-semibold text-[#2B2523] placeholder-[#A49B95] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="sm:col-span-3 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FF7E67] hover:bg-[#F26B53] text-white font-extrabold text-sm transition-all shadow-md shadow-[#FF7E67]/25 active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Pets</span>
                </button>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-[#7A6E68] pt-1">
                <span className="font-bold text-[#2B2523]">Quick searches:</span>
                <Link to="/browse?species=Dog&ageGroup=Baby" className="px-2.5 py-1 rounded-full bg-white border border-[#EDE6DC] hover:border-[#FF7E67] hover:text-[#FF7E67] transition-all">
                  🐾 Puppies
                </Link>
                <Link to="/browse?species=Cat" className="px-2.5 py-1 rounded-full bg-white border border-[#EDE6DC] hover:border-[#FF7E67] hover:text-[#FF7E67] transition-all">
                  🐾 Gentle Cats
                </Link>
                <Link to="/browse?gender=Female" className="px-2.5 py-1 rounded-full bg-white border border-[#EDE6DC] hover:border-[#FF7E67] hover:text-[#FF7E67] transition-all">
                  🐾 Female Pets
                </Link>
              </div>
            </div>

            {/* Right Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Soft backdrop frame */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-white aspect-4/5 bg-[#FFF6EC]">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                    alt="Two happy rescue dogs running together"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2523]/70 via-transparent to-transparent" />
                  
                  {/* Floating Story caption */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C6C57] text-[11px] font-black uppercase tracking-wider">
                      <KawaiiSparkle className="w-3 h-3 text-white" />
                      Success Story
                    </span>
                    <p className="font-extrabold text-lg leading-snug">
                      "Milo and Luna found their forever humans in under 48 hours via PawConnect."
                    </p>
                  </div>
                </div>

                {/* Floating Metric Badge 1 */}
                <div className="absolute -top-4 -left-6 bg-white p-3.5 rounded-2xl shadow-md border border-[#EDE6DC] flex items-center gap-3 hidden sm:flex animate-float">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF2EE] text-[#FF7E67] flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5 fill-[#FF7E67]" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#2B2523] block leading-none">1,240+</span>
                    <span className="text-[11px] text-[#7A6E68] font-bold">Happy Adoptions</span>
                  </div>
                </div>

                {/* Floating Metric Badge 2 */}
                <div className="absolute -bottom-4 -right-6 bg-white p-3.5 rounded-2xl shadow-md border border-[#EDE6DC] flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF8F5] text-[#1C6C57] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-[#2B2523] block leading-none">100% Verified</span>
                    <span className="text-[11px] text-[#7A6E68] font-bold">Licensed Rescues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PET CATEGORIES ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/browse?species=${cat.species}`}
              className={`group p-5 rounded-3xl ${cat.bg} border ${cat.border} shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-4`}
            >
              <span className="text-3xl sm:text-4xl group-hover:scale-115 transition-transform duration-300">
                {cat.icon}
              </span>
              <div>
                <h3 className="font-extrabold text-[#2B2523] text-sm sm:text-base group-hover:text-[#FF7E67] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-[#7A6E68] font-semibold">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ADOPTABLE PETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF2EE] text-[#FF7E67] text-xs font-black uppercase tracking-wider mb-2">
              <KawaiiPaw className="w-3.5 h-3.5" />
              <span>Meet the Residents</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B2523] tracking-tight">
              Featured Adoptable Pets
            </h2>
            <p className="text-sm text-[#7A6E68] mt-1 font-medium">
              Loving companions vetted, vaccinated, and hoping to share their hearts with you.
            </p>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#FF7E67] hover:text-[#F26B53] group"
          >
            <span>Browse All Friends</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching adoptable friends..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {featuredPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS PROCESS SECTION */}
      <section id="how-it-works" className="bg-[#2B2523] text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#FF7E67]/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#82C341]/10 blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFD8CF] text-xs font-black uppercase tracking-wider">
            <KawaiiSparkle className="w-3 h-3 text-[#FF7E67]" />
            <span>Simple & Gentle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How Adoption Works on PawConnect
          </h2>
          <p className="text-sm sm:text-base text-[#D5CEC8] max-w-2xl mx-auto leading-relaxed">
            We streamline the adoption journey so you spend less time wrestling paperwork and more time bonding with your new companion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="bg-white/5 hover:bg-white/10 p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 text-center sm:text-left relative transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#FF7E67] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#FF7E67]/30 group-hover:scale-105 transition-transform">
              1
            </div>
            <h3 className="text-xl font-black text-white">Find Your Match</h3>
            <p className="text-xs sm:text-sm text-[#D5CEC8] leading-relaxed">
              Filter by species, temperament, activity level, and distance to discover wonderful pets suited for your lifestyle.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 hover:bg-white/10 p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 text-center sm:text-left relative transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#FFB800] text-[#2B2523] font-black text-xl flex items-center justify-center shadow-md shadow-[#FFB800]/30 group-hover:scale-105 transition-transform">
              2
            </div>
            <h3 className="text-xl font-black text-white">Apply & Chat</h3>
            <p className="text-xs sm:text-sm text-[#D5CEC8] leading-relaxed">
              Submit our friendly digital questionnaire and chat directly with shelter volunteers in real-time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 hover:bg-white/10 p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 text-center sm:text-left relative transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#82C341] text-[#2B2523] font-black text-xl flex items-center justify-center shadow-md shadow-[#82C341]/30 group-hover:scale-105 transition-transform">
              3
            </div>
            <h3 className="text-xl font-black text-white">Meet & Welcome</h3>
            <p className="text-xs sm:text-sm text-[#D5CEC8] leading-relaxed">
              Schedule an in-person or virtual meet & greet. When finalized, celebrate your new friend coming home!
            </p>
          </div>
        </div>
      </section>

      {/* SHELTER HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF6EC] border border-[#F8E2CA] rounded-3xl p-8 sm:p-12 text-[#2B2523] shadow-xs flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EDE6DC] text-[#965B20] text-xs font-black uppercase tracking-wider">
              <PawPrint className="w-3.5 h-3.5 text-[#FF7E67]" />
              <span>For Shelters, Rescues & NGOs</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2B2523] tracking-tight">
              Are you a licensed animal shelter or welfare rescue?
            </h3>
            <p className="text-sm text-[#5C524E] leading-relaxed font-normal">
              Join PawConnect for free. List adoptable animals, streamline applicant screening questionnaires, and communicate seamlessly in one unified portal.
            </p>
          </div>
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-2xl bg-[#2B2523] hover:bg-[#3D3532] text-white font-extrabold text-sm transition-all shadow-md active:scale-98 shrink-0 flex items-center gap-2"
          >
            <span>Register Your Shelter</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

