import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PawPrint, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const { totalCount } = useCart();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#C96366] text-white flex items-center justify-around shadow-2xl rounded-t-2xl px-2"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            isActive ? 'text-white font-bold scale-110' : 'text-white/70 hover:text-white'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </NavLink>

      <NavLink
        to="/browse"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            isActive ? 'text-white font-bold scale-110' : 'text-white/70 hover:text-white'
          }`
        }
      >
        <PawPrint className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Adopt</span>
      </NavLink>

      <NavLink
        to="/messages"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${
            isActive ? 'text-white font-bold scale-110' : 'text-white/70 hover:text-white'
          }`
        }
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Messages</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${
            isActive ? 'text-white font-bold scale-110' : 'text-white/70 hover:text-white'
          }`
        }
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-white text-[#98494B] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
              {totalCount > 9 ? '9+' : totalCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Shop</span>
      </NavLink>
    </nav>
  );
};
