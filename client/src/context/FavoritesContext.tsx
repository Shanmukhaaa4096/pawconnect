import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pet } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Pet[];
  loading: boolean;
  isFavorite: (petId: string) => boolean;
  toggleFavorite: (pet: Pet) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshFavorites = async () => {
    if (!user || user.role !== 'adopter') {
      setFavorites([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.getFavorites();
      setFavorites(res.favorites || []);
    } catch (err) {
      console.warn('Could not load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'adopter') {
      refreshFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const isFavorite = (petId: string): boolean => {
    return favorites.some((f) => f._id.toString() === petId.toString());
  };

  const toggleFavorite = async (pet: Pet): Promise<boolean> => {
    if (!user) {
      throw new Error('Please login to save favorite pets');
    }

    // Optimistic UI update
    const currentlyFav = isFavorite(pet._id);
    if (currentlyFav) {
      setFavorites((prev) => prev.filter((p) => p._id.toString() !== pet._id.toString()));
    } else {
      setFavorites((prev) => [pet, ...prev]);
    }

    try {
      const res = await api.toggleFavorite(pet._id);
      return res.isFavorite;
    } catch (err) {
      // Revert if failed
      refreshFavorites();
      throw err;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
