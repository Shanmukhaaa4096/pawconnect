import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, PawPrint, ArrowRight, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { PetCard } from '../components/common/PetCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();

  return (
    <div className="min-h-screen bg-[#FCE8D0] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E2] text-[#C2572F] text-xs font-black uppercase tracking-wider mb-2 border border-[#EBC9A5]">
              <Heart className="w-3.5 h-3.5 fill-[#C2572F]" />
              <span>Saved Companions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3E1F1A] tracking-tight">
              Your Favourites
            </h1>
            <p className="text-xs sm:text-sm text-[#8A5A48] mt-1 font-medium">
              Pets you have bookmarked for adoption inquiry and updates.
            </p>
          </div>

          <Link
            to="/browse"
            className="px-5 py-2 rounded-full bg-white border border-[#EBC9A5] text-[#3E1F1A] hover:text-[#C2572F] text-xs font-extrabold shadow-xs transition inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover more pets</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner label="Loading your saved favourites..." />
          </div>
        ) : !user ? (
          <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] my-8">
            <div className="w-16 h-16 rounded-full bg-[#FFF3E2] text-[#C2572F] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 fill-[#C2572F]" />
            </div>
            <h3 className="font-black text-lg text-[#3E1F1A]">Sign in to view favourites</h3>
            <p className="text-xs text-[#8A5A48] mt-1.5 font-medium">
              Create an adopter account to save and track adoptable pets across devices.
            </p>
            <div className="mt-5 flex gap-3 justify-center">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-full bg-[#C2572F] text-white text-xs font-extrabold shadow hover:bg-[#8E3B22] transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full bg-white border border-[#EBC9A5] text-[#3E1F1A] text-xs font-extrabold hover:bg-gray-50 transition"
              >
                Register
              </Link>
            </div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border-2 border-[#4A2218] shadow-[4px_4px_0_#4A2218] my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFF3E2] text-[#C2572F] flex items-center justify-center mx-auto">
              <PawPrint className="w-8 h-8" />
            </div>
            <h3 className="font-black text-lg text-[#3E1F1A]">No favourites saved yet</h3>
            <p className="text-xs text-[#8A5A48] leading-relaxed font-medium">
              Browse dogs, cats, rabbits, and other pets and tap the heart icon on any card to save them here!
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C2572F] text-white text-xs font-extrabold shadow hover:bg-[#8E3B22] transition"
            >
              <span>Explore Pets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
