import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Pet } from '../types';
import { api } from '../services/api';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MaskedHeading } from '../components/common/MaskedHeading';

/* ─── Hero image (editorial photography generated asset) ─── */
const HERO_IMG = 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=1000&q=85';

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
    { label: 'Dogs',    species: 'Dog',    desc: 'Loyal companions' },
    { label: 'Cats',    species: 'Cat',    desc: 'Independent spirits' },
    { label: 'Rabbits', species: 'Rabbit', desc: 'Gentle & curious' },
    { label: 'Birds',   species: 'Bird',   desc: 'Vibrant personalities' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Find your match',
      desc: 'Filter by species, temperament, activity level, and distance to find a pet suited to your lifestyle.',
    },
    {
      num: '02',
      title: 'Apply & connect',
      desc: 'Submit a simple questionnaire and chat directly with shelter volunteers in real time.',
    },
    {
      num: '03',
      title: 'Welcome them home',
      desc: 'Schedule a meet and greet. When approved, celebrate your new family member.',
    },
  ];

  return (
    <div>

      {/* ─────────────────────────────────────────────────
          HERO — editorial split layout
      ───────────────────────────────────────────────── */}
      <section style={{ background: '#F7F5EF' }} className="pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left — copy & search */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-8">

              {/* Eyebrow */}
              <p className="section-label">Pet Adoption Platform</p>

              {/* Headline with MaskedHeading */}
              <div className="max-w-[14ch]">
                <MaskedHeading
                  text="Find Your Forever Friend"
                  tag="h1"
                  mediaType="image"
                  src="/hero-dog.jpg"
                  reveal="rise"
                  trigger="view"
                  align="left"
                  weight={700}
                  duration={0.9}
                  stagger={0.06}
                  parallax={0}
                  drift={0}
                  fillScale={1.2}
                  brightness={0.9}
                  saturation={0.9}
                  tracking={-0.02}
                  lineHeight={1.08}
                  textScale={0.088}
                  className="masked-heading--responsive"
                  style={{
                    fontFamily: "'Lora', serif",
                    color: '#252825',
                  }}
                />
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.65,
                  color: '#6B7068',
                  maxWidth: '42ch',
                }}
              >
                Connect with verified shelters and ethical rescues. Browse
                thoughtfully vetted profiles, submit adoption requests, and chat
                directly with care teams.
              </p>

              {/* Search form */}
              <form
                id="pet-search-form"
                onSubmit={handleHeroSearch}
                className="space-y-3"
              >
                <div
                  className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-lg border border-[#DDE0D8] bg-white"
                  style={{ boxShadow: '0 1px 4px rgba(37,40,37,0.06)' }}
                >
                  {/* Species selector */}
                  <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded border border-[#E8EBE3] bg-[#F7F5EF]">
                    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
                      <ellipse cx="7"  cy="11" rx="3"   ry="4"   fill="#263A32" />
                      <ellipse cx="13" cy="7"  rx="3"   ry="4.5" fill="#263A32" />
                      <ellipse cx="19" cy="7"  rx="3"   ry="4.5" fill="#263A32" />
                      <ellipse cx="25" cy="11" rx="3"   ry="4"   fill="#263A32" />
                      <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="#263A32"/>
                    </svg>
                    <select
                      id="search-species"
                      value={searchSpecies}
                      onChange={(e) => setSearchSpecies(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                      style={{ color: '#252825' }}
                    >
                      <option value="All">All pet types</option>
                      <option value="Dog">Dogs</option>
                      <option value="Cat">Cats</option>
                      <option value="Rabbit">Rabbits</option>
                      <option value="Bird">Birds</option>
                    </select>
                  </div>

                  {/* Location field */}
                  <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded border border-[#E8EBE3] bg-[#F7F5EF]">
                    <MapPin className="w-4 h-4 shrink-0" style={{ color: '#9BA097' }} />
                    <input
                      id="search-location"
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="City or state"
                      className="w-full bg-transparent text-sm focus:outline-none"
                      style={{ color: '#252825' }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    id="search-submit-btn"
                    className="btn-primary shrink-0 sm:px-6"
                    style={{ height: '2.625rem', borderRadius: '0.375rem' }}
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>

                {/* Quick filters */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span style={{ color: '#9BA097', fontWeight: 500 }}>Browse:</span>
                  {[
                    { to: '/browse?species=Dog&ageGroup=Baby', label: 'Puppies' },
                    { to: '/browse?species=Cat',               label: 'Cats' },
                    { to: '/browse?gender=Female',             label: 'Female pets' },
                    { to: '/browse',                           label: 'All animals' },
                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="px-3 py-1 rounded-full border border-[#DDE0D8] font-medium transition-colors hover:border-[#263A32] hover:text-[#263A32]"
                      style={{ color: '#6B7068', background: 'white' }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </form>

              {/* Trust indicator — inline, understated */}
              <div className="flex items-center gap-2 pt-1">
                <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: '#263A32' }} />
                <p className="text-xs" style={{ color: '#6B7068' }}>
                  Every shelter is verified and ethically accredited before listing.
                </p>
              </div>
            </div>

            {/* Right — editorial photography */}
            <div className="lg:col-span-6 xl:col-span-7 relative">
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: '0.75rem',
                  aspectRatio: '4/5',
                  maxHeight: '640px',
                  background: '#EAECE4',
                }}
              >
                <img
                  src={HERO_IMG}
                  alt="Golden retriever dog sitting calmly in a warm, naturally lit room"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
                {/* Minimal, tasteful caption strip at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-5 py-4"
                  style={{ background: 'linear-gradient(to top, rgba(37,40,37,0.55) 0%, transparent 100%)' }}
                >
                  <p className="text-white text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Partnered with verified shelters across the country
                  </p>
                </div>
              </div>

              {/* Accent line decoration */}
              <div
                className="absolute -bottom-4 -right-4 -z-10 hidden lg:block"
                style={{
                  width: '60%',
                  height: '60%',
                  border: '1px solid #DDE0D8',
                  borderRadius: '0.75rem',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          PET CATEGORIES — understated grid
      ───────────────────────────────────────────────── */}
      <section className="py-14" style={{ background: '#EAECE4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="section-label">Browse by type</p>
              <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: '#252825' }}>
                Who are you looking for?
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.species}
                to={`/browse?species=${cat.species}`}
                className="group block bg-white rounded-lg border border-[#DDE0D8] p-5 transition-all hover:border-[#263A32] hover:shadow-md"
                style={{ textDecoration: 'none' }}
              >
                <h3 className="font-semibold text-base mb-1 transition-colors group-hover:text-[#263A32]" style={{ color: '#252825' }}>
                  {cat.label}
                </h3>
                <p className="text-sm" style={{ color: '#9BA097' }}>{cat.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-medium text-[#263A32] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Browse all</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          FEATURED PETS
      ───────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#F7F5EF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="section-label">Available now</p>
              <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: '#252825' }}>
                Adoptable pets
              </h2>
              <p className="mt-2 text-sm" style={{ color: '#6B7068', maxWidth: '44ch' }}>
                Vetted, vaccinated companions waiting for a permanent home.
              </p>
            </div>
            <Link
              to="/browse"
              className="btn-ghost shrink-0"
              style={{ textDecoration: 'none' }}
            >
              <span>See all pets</span>
              <ArrowRight className="w-4 h-4 arrow" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading available pets…" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featuredPets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          HOW IT WORKS — dark forest section
      ───────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-16 sm:py-20"
        style={{ background: '#263A32' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <p className="section-label" style={{ color: '#C8795A' }}>The process</p>
            <h2
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 600,
                color: '#F7F5EF',
                lineHeight: 1.15,
              }}
            >
              Adoption made simple
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(247,245,239,0.65)', maxWidth: '42ch' }}>
              We streamline the journey so you spend less time on paperwork and more time bonding with your companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map(({ num, title, desc }) => (
              <div
                key={num}
                className="border-t pt-6"
                style={{ borderColor: 'rgba(247,245,239,0.15)' }}
              >
                <span
                  className="block text-5xl font-light mb-4"
                  style={{
                    fontFamily: "'Lora', serif",
                    color: '#C8795A',
                    lineHeight: 1,
                    fontStyle: 'italic',
                  }}
                >
                  {num}
                </span>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#F7F5EF', fontFamily: "'Inter', sans-serif" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(247,245,239,0.6)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          SHELTER CTA — clean, restrained
      ───────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#F7F5EF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-8 sm:px-12 py-10 rounded-lg border border-[#DDE0D8]"
            style={{ background: '#EAECE4' }}
          >
            <div className="max-w-xl space-y-3">
              <p className="section-label">For organisations</p>
              <h3
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  fontWeight: 600,
                  color: '#252825',
                  lineHeight: 1.2,
                }}
              >
                Are you a licensed shelter or rescue organisation?
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7068' }}>
                Join PawConnect at no cost. List your animals, manage applicant
                screening, and communicate seamlessly through a unified portal.
              </p>
            </div>

            <Link
              to="/register"
              className="btn-primary shrink-0"
              style={{ textDecoration: 'none' }}
            >
              <span>Register your shelter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
