import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Dog,
  Cat,
  Bird,
  Rabbit,
  PawPrint,
  Heart,
  ShoppingBag,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Pet, Product } from '../types';
import { api } from '../services/api';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories matching Screens 4 & 5 in reference mockup
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

  return (
    <div className="min-h-screen bg-[#F3E6E6] text-[#292323] pb-12">
      {/* ─────────────────────────────────────────────────
          TOP SEARCH BAR (Matches Screens 4 & 5)
      ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pet to adopt (e.g. Milo, Golden Retriever)..."
            className="w-full h-12 pl-12 pr-28 rounded-full bg-white border border-[#EAD2D3] text-sm text-[#292323] placeholder-[#A89898] shadow-sm focus:outline-none focus:border-[#C96366] focus:ring-2 focus:ring-[#C96366]/20 transition"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C96366]" />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#C96366] hover:bg-[#98494B] text-white text-xs font-bold rounded-full shadow transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* ─────────────────────────────────────────────────
          COMMUNITY HERO BANNER (Matches Screens 4 & 5)
      ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#C96366] to-[#98494B] text-white p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-lg space-y-3 z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-[11px] font-black uppercase tracking-wider text-white">
              🐾 Verified Rescue Network
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Join Our Animal Lovers Community
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              Connect with verified no-kill shelters, find your perfect companion, and order nutritious food and accessories with fast doorstep delivery.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                to="/browse"
                className="px-6 py-2.5 rounded-full bg-white text-[#98494B] text-xs font-extrabold shadow hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                <span>Adopt a Pet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold border border-white/40 transition inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pet Shop</span>
              </Link>
            </div>
          </div>

          {/* Banner Photo */}
          <div className="relative shrink-0 w-48 sm:w-64 aspect-4/3 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80"
              alt="Happy girl with cute puppy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          CATEGORY PILLS (Matches Screens 4 & 5)
      ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#292323] flex items-center gap-2">
            <span>Pet Categories</span>
          </h2>
          <Link
            to="/browse"
            className="text-xs font-bold text-[#C96366] hover:text-[#98494B] flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center justify-center gap-1.5 min-w-[4.75rem] h-20 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-[#C96366] text-white border-[#C96366] shadow-md scale-105'
                    : 'bg-white text-[#736363] border-[#EAD2D3] hover:border-[#C96366] hover:text-[#C96366]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F3E6E6] text-[#C96366]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          PETS GRID (Matches Screens 4 & 5)
      ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#292323]">
              {selectedCategory === 'All' ? 'Available for Adoption' : `${selectedCategory}s Near You`}
            </h2>
            <p className="text-xs text-[#736363] font-medium mt-0.5">
              Showing {filteredPets.length} loving companions looking for a home
            </p>
          </div>

          <Link
            to="/browse"
            className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-white border border-[#EAD2D3] text-[#C96366] hover:bg-[#C96366] hover:text-white transition shadow-2xs"
          >
            Filter & Sort
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner label="Finding adoptable pets..." />
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto border border-[#EAD2D3] shadow-sm my-6">
            <div className="w-14 h-14 rounded-full bg-[#FDEEEF] text-[#C96366] flex items-center justify-center mx-auto mb-3">
              <PawPrint className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-[#292323]">No pets found</h3>
            <p className="text-xs text-[#736363] mt-1">
              Try selecting "All" categories or adjusting your search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="mt-4 px-5 py-2 text-xs font-extrabold bg-[#C96366] text-white rounded-full shadow hover:bg-[#98494B] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredPets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────
          PET SUPPLIES & FOOD HIGHLIGHT (Screens 8 & 9)
      ───────────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C96366] bg-white px-2.5 py-0.5 rounded-full border border-[#EAD2D3]">
                Doorstep Delivery
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#292323] mt-1">
                Pet Food & Accessories
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#C96366] hover:text-[#98494B] flex items-center gap-1"
            >
              <span>Visit Shop</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredProducts.map((prod) => (
              <div
                key={prod._id}
                className="bg-white rounded-2xl p-3 border border-[#EAD2D3] shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-[#FDEEEF] mb-2.5">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#292323] truncate">{prod.name}</h4>
                  <p className="text-[11px] text-[#736363] mt-0.5">{prod.category}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F4E4E4]">
                    <span className="text-xs font-black text-[#C96366]">${prod.price.toFixed(2)}</span>
                    <Link
                      to="/shop"
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FDEEEF] text-[#C96366] hover:bg-[#C96366] hover:text-white transition"
                    >
                      Buy
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          HOW ADOPTION WORKS
      ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAD2D3] shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#C96366]">Simple & Safe</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#292323] mt-1">How Adoption Works on PawConnect</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Find Your Pet',
                desc: 'Browse verified shelter animals filtered by species, age, temperament, and compatibility.',
              },
              {
                step: '02',
                title: 'Apply & Chat Online',
                desc: 'Submit your adoption questionnaire and chat directly with shelter rescue teams in real-time.',
              },
              {
                step: '03',
                title: 'Meet & Welcome Home',
                desc: 'Complete reference checks, visit for a friendly meet & greet, and welcome your new best friend.',
              },
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-2xl bg-[#F3E6E6]/60 border border-[#EAD2D3] space-y-2">
                <span className="text-2xl font-black text-[#C96366]">{s.step}</span>
                <h4 className="font-extrabold text-sm text-[#292323]">{s.title}</h4>
                <p className="text-xs text-[#736363] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
