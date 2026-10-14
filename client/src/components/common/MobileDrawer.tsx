import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  PawPrint,
  PlusCircle,
  Heart,
  MessageCircle,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Settings,
  Shield,
  Building2,
  LogIn,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout, lazyLogin } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel (matching Screen 3 coral drawer) */}
      <div className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-[#98494B] text-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Top Header / Profile Info */}
        <div className="p-6 border-b border-white/15 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {user ? (
            <div className="flex items-center gap-3.5 mt-2">
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/60 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#98494B] rounded-full" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-base text-white truncate">{user.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/80 font-medium">Active Status</span>
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-white/20 text-white/90">
                  {user.role}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-2 text-white font-black text-lg tracking-tight">
                <PawPrint className="w-6 h-6 text-[#F7DADA]" />
                <span>PawConnect</span>
              </div>
              <p className="text-xs text-white/80">Welcome! Sign in to adopt, message, and favorite pets.</p>
              <div className="pt-1 space-y-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await lazyLogin('adopter');
                      onClose();
                      navigate('/browse');
                    } catch (err: any) {
                      alert(`Lazy login failed: ${err.message}`);
                    }
                  }}
                  className="w-full py-2.5 px-3 text-center text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-[#292323] rounded-full shadow hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>⚡ 1-Tap Lazy Login</span>
                </button>
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex-1 py-2 text-center text-xs font-bold bg-white text-[#98494B] rounded-full shadow hover:bg-white/90 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="flex-1 py-2 text-center text-xs font-bold border border-white/50 text-white rounded-full hover:bg-white/10 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items (matching Screen 3 labels) */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          <Link
            to="/browse"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium text-sm"
          >
            <PawPrint className="w-5 h-5 text-[#F7DADA]" />
            <span>Adoption</span>
          </Link>

          {user && (user.role === 'shelter' || user.role === 'admin') ? (
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium text-sm"
            >
              <PlusCircle className="w-5 h-5 text-[#F7DADA]" />
              <span>Add Pet</span>
            </Link>
          ) : null}

          <Link
            to="/favorites"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium text-sm"
          >
            <div className="flex items-center gap-3.5">
              <Heart className="w-5 h-5 text-[#F7DADA]" />
              <span>Favourites</span>
            </div>
            {favorites.length > 0 && (
              <span className="text-xs bg-white text-[#98494B] font-bold px-2 py-0.5 rounded-full">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            to="/messages"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium text-sm"
          >
            <MessageCircle className="w-5 h-5 text-[#F7DADA]" />
            <span>Messages</span>
          </Link>

          <Link
            to="/shop"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium text-sm"
          >
            <ShoppingBag className="w-5 h-5 text-[#F7DADA]" />
            <span>Buy (Pet Shop)</span>
          </Link>

          <Link
            to="/shelters"
            onClick={onClose}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium text-sm"
          >
            <Building2 className="w-5 h-5 text-[#F7DADA]" />
            <span>Rescue Shelters</span>
          </Link>

          {user && (
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium text-sm"
            >
              <UserIcon className="w-5 h-5 text-[#F7DADA]" />
              <span>Profile & Applications</span>
            </Link>
          )}
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/15">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition font-medium text-sm"
            >
              <LogOut className="w-5 h-5 text-[#F7DADA]" />
              <span>Settings / Log out</span>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-[#98494B] font-bold rounded-xl shadow text-sm hover:bg-white/90 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
