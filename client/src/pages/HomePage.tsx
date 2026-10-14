import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Dog,
  Cat,
  Bird,
  Rabbit,
  PawPrint,
  Bone,
  ShoppingBag,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { Pet, Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { HeroDog } from '../components/common/HeroDogs';

const serif: React.CSSProperties = { fontFamily: 'var(--font-serif)' };
const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80';

/** Soft paw-print scatter used as section decoration. */
const PawDecor: React.FC<{ className?: string; rotate?: number }> = ({ className = '', rotate = 0 }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 64 64"
    fill="currentColor"
    className={`absolute pointer-events-none ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <path d="M32 29c-8 0-17 8-17 17 0 6 4.5 9.5 9.5 8.5 3-.6 4.8-2 7.5-2s4.5 1.4 7.5 2C44.5 55.5 49 52 49 46c0-9-9-17-17-17z" />
    <ellipse cx="13" cy="29" rx="5" ry="7.2" transform="rotate(-24 13 29)" />
    <ellipse cx="25" cy="16.5" rx="5.5" ry="8.2" transform="rotate(-7 25 16.5)" />
    <ellipse cx="39" cy="16.5" rx="5.5" ry="8.2" transform="rotate(7 39 16.5)" />
    <ellipse cx="51" cy="29" rx="5" ry="7.2" transform="rotate(24 51 29)" />
  </svg>
);

/** Arch-shaped photo frame (rounded top) on an orange backing, like the reference. */
const ArchPhoto: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => (
  <div className={`relative bg-[#DD8B45] rounded-t-[999px] rounded-b-3xl overflow-hidden ${className}`}>
    <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
  </div>
);


/** Ink band of looping phrases. Duplicated content makes the -50% loop seamless. */
const Ticker: React.FC<{ items: string[] }> = ({ items }) => {
  const row = (
    <ul className="flex items-center shrink-0" aria-hidden="true">
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-sm sm:text-base font-black uppercase tracking-[0.18em] text-[#FCE8D0]">{t}</span>
          <PawDecorInline />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee overflow-hidden bg-[#4A2218] border-y-2 border-[#4A2218] py-3 -rotate-1 scale-x-[1.03] shadow-[0_6px_0_#C2572F]" role="marquee" aria-label={items.join(', ')}>
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
};

const PawDecorInline: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-5 h-5 text-[#E8873F]" fill="currentColor" aria-hidden="true">
    <path d="M32 29c-8 0-17 8-17 17 0 6 4.5 9.5 9.5 8.5 3-.6 4.8-2 7.5-2s4.5 1.4 7.5 2C44.5 55.5 49 52 49 46c0-9-9-17-17-17z" />
    <ellipse cx="13" cy="29" rx="5" ry="7.2" transform="rotate(-24 13 29)" />
    <ellipse cx="25" cy="16.5" rx="5.5" ry="8.2" transform="rotate(-7 25 16.5)" />
    <ellipse cx="39" cy="16.5" rx="5.5" ry="8.2" transform="rotate(7 39 16.5)" />
    <ellipse cx="51" cy="29" rx="5" ry="7.2" transform="rotate(24 51 29)" />
  </svg>
);

/** Round "adopt me" sticker with text running around the edge. */
const RoundSticker: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-28 h-28 sm:w-32 sm:h-32 ${className}`} aria-hidden="true">
    <svg viewBox="0 0 120 120" className="absolute inset-0 spin-slow">
      <defs>
        <path id="sticker-circle" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="#E8873F" stroke="#4A2218" strokeWidth="3" />
      <text fontSize="13" fontWeight="800" letterSpacing="3" fill="#4A2218" style={{ fontFamily: 'var(--font-sans)' }}>
        <textPath href="#sticker-circle">ADOPT ME • ADOPT ME • ADOPT ME •</textPath>
      </text>
    </svg>
    <div className="absolute inset-[26%] rounded-full bg-[#FCE8D0] border-2 border-[#4A2218] flex items-center justify-center">
      <PawDecorInline />
    </div>
  </div>
);

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'All', icon: PawPrint },
    { id: 'Dog', label: 'Dogs', icon: Dog },
    { id: 'Cat', label: 'Cats', icon: Cat },
    { id: 'Bird', label: 'Birds', icon: Bird },
    { id: 'Rabbit', label: 'Rabbits', icon: Rabbit },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [petsRes, shopRes] = await Promise.all([
          api.getPets(),
          api.getProducts().catch(() => ({ products: [] })),
        ]);
        setPets(petsRes.pets || []);
        setFeaturedProducts(shopRes.products?.slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedCategory !== 'All') params.append('species', selectedCategory);
    navigate(`/browse?${params.toString()}`);
  };

  const filteredPets = pets.filter((pet) => {
    const matchesCategory = selectedCategory === 'All' || pet.species.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const spotlight = pets.find((p) => p.photos?.length > 0) || null;
  const heroPhoto = pets.find((p) => p.photos?.length > 0)?.photos[0] || FALLBACK_PHOTO;

  return (
    <div id="top" className="min-h-screen bg-[#FCE8D0] text-[#3E1F1A]">
            {/* ─────────────── HERO ─────────────── */}
      <section className="relative overflow-hidden bg-[#C2572F] text-[#FCE8D0] border-b-2 border-[#4A2218]">
        <PawDecor className="w-14 h-14 sm:w-20 sm:h-20 left-4 sm:left-10 top-8 text-[#FCE8D0]" rotate={-12} />
        <PawDecor className="w-14 h-14 sm:w-20 sm:h-20 right-4 sm:right-10 top-8 text-[#FCE8D0]" rotate={12} />

        <div className="relative max-w-6xl mx-auto px-4 pt-14 sm:pt-16 text-center">
          <h1
            className="rise text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-[#F8DDBF]"
            style={{ ...serif, textShadow: '4px 4px 0 #4A2218' }}
          >
            Every paw deserves
            <br />a loving home
          </h1>
          <p className="rise mt-4 max-w-xl mx-auto text-sm sm:text-base text-[#FCE8D0]/90 font-medium" style={{ ["--d" as string]: "0.12s" }}>
            Meet verified shelters, adopt your perfect companion, and order food and treats with doorstep delivery.
          </p>
          <div className="rise mt-6 flex flex-wrap items-center justify-center gap-3" style={{ ["--d" as string]: "0.22s" }}>
            <Link
              to="/browse"
              className="px-7 py-3 rounded-full bg-[#E8873F] text-white text-sm font-extrabold border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#4A2218] active:translate-x-1 active:translate-y-1 active:shadow-none transition inline-flex items-center gap-2"
            >
              <span>Adopt a Pet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="px-7 py-3 rounded-full border-2 border-[#4A2218] bg-[#FCE8D0] text-[#4A2218] text-sm font-extrabold shadow-[4px_4px_0_#4A2218] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#4A2218] active:translate-x-1 active:translate-y-1 active:shadow-none transition inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pet Shop</span>
            </Link>
          </div>
        </div>

        {/* dogs facing each other around an arch photo */}
        <div className="relative max-w-5xl mx-auto px-4 mt-8 pb-6 flex items-end justify-center gap-2 sm:gap-8">
          <div className="from-l w-[34%] max-w-[260px] shrink-0" style={{ ["--d" as string]: "0.3s" }}>
            <HeroDog className="w-full" />
          </div>
          <ArchPhoto
            src={heroPhoto}
            alt="Pet waiting for adoption"
            className="pop w-[30%] max-w-[210px] aspect-[3/4] shrink-0 -mb-6 border-4 border-[#FCE8D0] border-b-0 rounded-b-none"
          />
          <div className="from-r w-[34%] max-w-[260px] shrink-0" style={{ ["--d" as string]: "0.3s" }}>
            <HeroDog className="w-full" flip delay="-0.5s" />
          </div>
        </div>

        {/* scalloped edge into the paper below */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-5 z-20"
          style={{ background: 'radial-gradient(circle at 12px 100%, #FCE8D0 11px, transparent 12px) 0 100% / 24px 20px repeat-x' }}
        />
      </section>

      <div className="pt-10 overflow-hidden">
        <Ticker
          items={[
            "Adopt, don't shop",
            `${pets.length || 10} pets waiting`,
            'Verified shelters',
            'Doorstep delivery',
            'Wet noses, warm homes',
          ]}
        />
      </div>

      {/* ─────────────── SEARCH + CATEGORIES ─────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pet to adopt (e.g. Milo, Golden Retriever)..."
            className="w-full h-13 py-3.5 pl-12 pr-28 rounded-full bg-white border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] text-sm text-[#3E1F1A] placeholder-[#B99A86] focus:outline-none focus:shadow-[6px_6px_0_#C2572F] transition-shadow"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C2572F]" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#C2572F] hover:bg-[#8E3B22] text-white text-xs font-extrabold rounded-full border-2 border-[#4A2218] transition"
          >
            Search
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center justify-center gap-1.5 min-w-[4.75rem] h-20 rounded-2xl border-2 border-[#4A2218] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C2572F] text-white shadow-[0_0_0_#4A2218] translate-x-[3px] translate-y-[3px]'
                    : 'bg-white text-[#4A2218] shadow-[3px_3px_0_#4A2218] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#4A2218] hover:bg-[#F8DDBF]'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-extrabold">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────── SPOTLIGHT PET ─────────────── */}
      {spotlight && (
        <section className="relative bg-[#F8DDBF] mt-12 overflow-hidden border-y-2 border-[#4A2218]">
          <PawDecor className="w-8 h-8 left-[6%] top-10 text-[#E8873F]/70" rotate={-20} />
          <PawDecor className="w-7 h-7 left-[40%] bottom-8 text-[#E8873F]/70" rotate={15} />
          <PawDecor className="w-9 h-9 right-[6%] bottom-10 text-[#E8873F]/70" rotate={20} />
          <Bone aria-hidden="true" className="absolute left-[44%] top-8 w-10 h-10 text-[#B8532C] -rotate-[25deg] hidden sm:block" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-white border-2 border-[#EBC9A5] text-[11px] font-black uppercase tracking-wider text-[#C2572F]">
                Pet of the moment
              </span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-black text-[#8E3B22] leading-tight" style={serif}>
                Meet {spotlight.name}
              </h2>
              <p className="mt-2 text-sm font-bold text-[#8A5A48] flex items-center justify-center md:justify-start gap-1.5">
                <MapPin className="w-4 h-4" />
                {[spotlight.breed, spotlight.location?.city].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-3 text-sm sm:text-base text-[#3E1F1A]/85 leading-relaxed max-w-md mx-auto md:mx-0 line-clamp-4">
                {spotlight.description}
              </p>
              <Link
                to={`/pets/${spotlight._id}`}
                className="mt-6 px-7 py-3 rounded-full bg-[#C2572F] text-white text-sm font-extrabold border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#4A2218] active:translate-x-1 active:translate-y-1 active:shadow-none transition inline-flex items-center gap-2"
              >
                <span>Meet {spotlight.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative reveal">
                <ArchPhoto
                  src={spotlight.photos[0]}
                  alt={spotlight.name}
                  className="w-60 sm:w-72 aspect-[4/5] border-[3px] border-[#4A2218] shadow-[8px_8px_0_#4A2218]"
                />
                <RoundSticker className="absolute -top-6 -right-8 sm:-right-12 rotate-12" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── PETS GRID ─────────────── */}
      <section id="pets" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
        <div className="flex items-end justify-between mb-6 gap-3">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#8E3B22]" style={serif}>
              {selectedCategory === 'All' ? 'Available for adoption' : `${selectedCategory}s near you`}
            </h2>
            <p className="text-xs sm:text-sm text-[#8A5A48] font-medium mt-1">
              {filteredPets.length} loving companions looking for a home
            </p>
          </div>
          <Link
            to="/browse"
            className="shrink-0 text-xs font-extrabold px-4 py-2 rounded-full bg-white border-2 border-[#EBC9A5] text-[#C2572F] hover:bg-[#C2572F] hover:text-white hover:border-[#C2572F] transition inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner label="Finding adoptable pets..." />
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto border-2 border-[#EBC9A5] my-6">
            <div className="w-14 h-14 rounded-full bg-[#FFF3E2] text-[#C2572F] flex items-center justify-center mx-auto mb-3">
              <PawPrint className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-[#3E1F1A]">No pets found</h3>
            <p className="text-xs text-[#8A5A48] mt-1">Try selecting "All" categories or adjusting your search keywords.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="mt-4 px-5 py-2 text-xs font-extrabold bg-[#C2572F] text-white rounded-full hover:bg-[#8E3B22] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-7">
            {filteredPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      {/* ─────────────── SHOP ─────────────── */}
      {featuredProducts.length > 0 && (
        <section id="shop" className="relative bg-[#F8DDBF] overflow-hidden scroll-mt-20 border-y-2 border-[#4A2218]">
          <PawDecor className="w-8 h-8 right-[5%] top-8 text-[#E8873F]/70" rotate={18} />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex items-end justify-between mb-6 gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#C2572F]">Doorstep delivery</span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#8E3B22] mt-1" style={serif}>
                  Pet food & accessories
                </h2>
              </div>
              <Link
                to="/shop"
                className="shrink-0 text-xs font-extrabold text-[#C2572F] hover:text-[#8E3B22] inline-flex items-center gap-1"
              >
                <span>Visit shop</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featuredProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="reveal bg-[#FCE8D0] rounded-2xl p-3 border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] hover:-translate-y-1 hover:shadow-[6px_6px_0_#4A2218] transition flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#FFF3E2] mb-2.5">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover hover:scale-105 transition" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-[#3E1F1A] truncate">{prod.name}</h4>
                    <p className="text-[11px] text-[#8A5A48] mt-0.5">{prod.category}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EBC9A5]">
                      <span className="text-sm font-black text-[#C2572F]">${prod.price.toFixed(2)}</span>
                      <Link
                        to="/shop"
                        className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#C2572F] text-white hover:bg-[#8E3B22] transition"
                      >
                        Buy
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── TWO WAYS IN ─────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="reveal relative rounded-3xl bg-[#F8DDBF] border-2 border-[#4A2218] shadow-[6px_6px_0_#4A2218] p-7 sm:p-9 -rotate-1">
            <span className="inline-block px-3 py-1 rounded-md bg-white border-2 border-[#4A2218] text-[10px] font-black uppercase tracking-widest text-[#C2572F] -rotate-2">
              Looking for a friend?
            </span>
            <h3 className="mt-4 text-3xl font-black text-[#8E3B22]" style={serif}>Adopt a pet</h3>
            <p className="mt-2 text-sm text-[#3E1F1A]/80 max-w-sm">
              Browse animals from verified shelters and caring owners. Apply, chat, and meet before you decide.
            </p>
            <Link
              to="/browse"
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C2572F] text-white text-sm font-extrabold border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#4A2218] active:translate-x-1 active:translate-y-1 active:shadow-none transition"
            >
              <span>Find my match</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="reveal relative rounded-3xl bg-[#FBE3A1] border-2 border-[#4A2218] shadow-[6px_6px_0_#4A2218] p-7 sm:p-9 rotate-1 md:translate-y-4">
            <span className="inline-block px-3 py-1 rounded-md bg-white border-2 border-[#4A2218] text-[10px] font-black uppercase tracking-widest text-[#C2572F] rotate-2">
              Can't keep your pet?
            </span>
            <h3 className="mt-4 text-3xl font-black text-[#8E3B22]" style={serif}>Rehome with care</h3>
            <p className="mt-2 text-sm text-[#3E1F1A]/80 max-w-sm">
              List your pet for free, review every application, and choose the family you trust.
            </p>
            <Link
              to={user?.role === 'owner' ? '/dashboard' : '/register?role=owner'}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A2218] text-[#FCE8D0] text-sm font-extrabold border-2 border-[#4A2218] shadow-[4px_4px_0_#C2572F] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#C2572F] active:translate-x-1 active:translate-y-1 active:shadow-none transition"
            >
              <span>{user?.role === 'owner' ? 'Open my pets' : 'List my pet'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <section id="how" className="relative overflow-hidden bg-[#C2572F] scroll-mt-20 border-t-2 border-[#4A2218]">
        <PawDecor className="w-12 h-12 left-[4%] top-8 text-[#FCE8D0]/25" rotate={-15} />
        <PawDecor className="w-12 h-12 right-[4%] bottom-8 text-[#FCE8D0]/25" rotate={15} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#F8DDBF]">Simple & safe</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#FCE8D0] mt-1" style={serif}>
              How adoption works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Find your pet',
                desc: 'Browse verified shelter animals filtered by species, age, temperament, and compatibility.',
              },
              {
                step: '02',
                title: 'Apply & chat online',
                desc: 'Submit your adoption questionnaire and chat directly with shelter rescue teams in real-time.',
              },
              {
                step: '03',
                title: 'Meet & welcome home',
                desc: 'Complete reference checks, visit for a friendly meet & greet, and welcome your new best friend.',
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`reveal p-6 rounded-3xl bg-[#FCE8D0] border-2 border-[#4A2218] shadow-[6px_6px_0_#4A2218] space-y-2 ${
                  i % 2 === 0 ? '-rotate-1' : 'rotate-1 md:translate-y-4'
                }`}
              >
                <span
                  className="block text-6xl font-black leading-none"
                  style={{ ...serif, color: 'transparent', WebkitTextStroke: '2px #C2572F' }}
                >
                  {s.step}
                </span>
                <h4 className="font-extrabold text-base text-[#3E1F1A]">{s.title}</h4>
                <p className="text-sm text-[#8A5A48] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
