import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PawPrint,
  Clock,
  Building2,
  Smile,
  Quote,
} from 'lucide-react';
import { Pet } from '../types';
import { api } from '../services/api';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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
    { label: 'Dogs & Pups', species: 'Dog', icon: '🐶', count: '6+ Available' },
    { label: 'Cats & Kittens', species: 'Cat', icon: '🐱', count: '4+ Available' },
    { label: 'Rabbits & Small', species: 'Rabbit', icon: '🐰', count: '2+ Available' },
    { label: 'Birds', species: 'Bird', icon: '🦜', count: '1+ Available' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-orange-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Trusted by 50+ Certified Shelters & Rescues
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Find Your <span className="text-orange-600">Forever Friend</span> & Change a Life
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with verified animal shelters, foster parents, and welfare NGOs. Browse vetted profiles, submit digital applications, and chat in real-time.
              </p>

              {/* Dynamic Search Box */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-slate-200/80 max-w-2xl mx-auto lg:mx-0 grid grid-cols-1 sm:grid-cols-12 gap-3"
              >
                <div className="sm:col-span-5 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <PawPrint className="w-5 h-5 text-orange-500 shrink-0" />
                  <select
                    value={searchSpecies}
                    onChange={(e) => setSearchSpecies(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="All">All Pet Types</option>
                    <option value="Dog">Dogs & Puppies</option>
                    <option value="Cat">Cats & Kittens</option>
                    <option value="Rabbit">Rabbits</option>
                    <option value="Bird">Birds</option>
                  </select>
                </div>

                <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="City or state..."
                    className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="sm:col-span-3 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all shadow-md shadow-orange-600/25"
                >
                  <Search className="w-4 h-4" />
                  Search Pets
                </button>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-600 pt-1">
                <span className="font-semibold">Popular searches:</span>
                <Link to="/browse?species=Dog&ageGroup=Baby" className="hover:text-orange-600 underline">
                  Puppies
                </Link>
                <span>•</span>
                <Link to="/browse?species=Cat" className="hover:text-orange-600 underline">
                  Indoor Cats
                </Link>
                <span>•</span>
                <Link to="/browse?gender=Female" className="hover:text-orange-600 underline">
                  Hypoallergenic
                </Link>
              </div>
            </div>

            {/* Right Hero Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                    alt="Two happy rescue dogs running together"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500 text-[11px] font-bold uppercase tracking-wider mb-2">
                      Success Story
                    </span>
                    <p className="font-extrabold text-lg leading-snug">
                      "Milo and Luna found their forever homes in under 48 hours with PawConnect."
                    </p>
                  </div>
                </div>

                {/* Floating Metric Card 1 */}
                <div className="absolute -top-4 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-slate-900 block leading-none">1,240+</span>
                    <span className="text-[11px] text-slate-600 font-semibold">Happy Adoptions</span>
                  </div>
                </div>

                {/* Floating Metric Card 2 */}
                <div className="absolute -bottom-4 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-slate-900 block leading-none">100% Verified</span>
                    <span className="text-[11px] text-slate-600 font-semibold">Licensed Rescues</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PET CATEGORIES ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/browse?species=${cat.species}`}
              className="group p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-4"
            >
              <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-slate-600 font-medium">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ADOPTABLE PETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Meet the Residents
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Adoptable Pets
            </h2>
            <p className="text-sm text-slate-600">
              These loving companions are vaccinated, vet-checked, and waiting for their forever homes.
            </p>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 group"
          >
            <span>View All Adoptable Pets</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching adoptable pets..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS PROCESS SECTION */}
      <section id="how-it-works" className="bg-slate-900 text-white py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How Adoption Works on PawConnect
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            We streamline the adoption journey so you spend less time filling duplicate paperwork and more time bonding with your new pet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4 text-center sm:text-left relative">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
              1
            </div>
            <h3 className="text-xl font-bold text-white">Find Your Match</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use our filters for species, breed, temperament, and location to discover pets matching your home and activity level.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4 text-center sm:text-left relative">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
              2
            </div>
            <h3 className="text-xl font-bold text-white">Apply & Chat</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Submit our standardized online adoption questionnaire and communicate directly with the shelter in our real-time messaging system.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4 text-center sm:text-left relative">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-orange-600/30">
              3
            </div>
            <h3 className="text-xl font-bold text-white">Meet & Finalize</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Schedule an in-person or virtual meet & greet. Once approved, welcome your new best friend home forever!
            </p>
          </div>
        </div>
      </section>

      {/* SHELTER HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              For Shelters, Rescues & NGOs
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Are you an animal shelter or rescue organization?
            </h3>
            <p className="text-sm text-orange-50 leading-relaxed">
              Join PawConnect for free. List adoptable animals, manage applicant screening questionnaires, and communicate seamlessly in one unified portal.
            </p>
          </div>
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-lg shrink-0"
          >
            Register Your Shelter
          </Link>
        </div>
      </section>
    </div>
  );
};
