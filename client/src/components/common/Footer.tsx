import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Award, Mail, Phone, MapPin } from 'lucide-react';
import { KawaiiPaw, KawaiiSparkle } from './KawaiiIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2B2523] text-[#EDE6DC] border-t border-[#3D3531] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3D3531]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#FF7E67] flex items-center justify-center text-white shadow-md shadow-[#FF7E67]/30">
                <KawaiiPaw size={22} fill="#FFFFFF" />
              </div>
              <span className="text-2xl font-black font-display text-white tracking-tight">
                Paw<span className="text-[#FF9B8A]">Connect</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#C9BFB5] max-w-sm leading-relaxed">
              A thoughtful, Japanese-inspired adoption platform bridging loving adopters with verified animal welfare shelters, foster homes, and NGOs. Every pet deserves a warm home.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#B3A89E] pt-2">
              <span className="flex items-center gap-1.5 bg-[#38302D] px-2.5 py-1 rounded-full border border-[#4A413D]">
                <Shield className="w-3.5 h-3.5 text-[#54B499]" /> 100% Certified Rescues
              </span>
              <span className="flex items-center gap-1.5 bg-[#38302D] px-2.5 py-1 rounded-full border border-[#4A413D]">
                <Award className="w-3.5 h-3.5 text-[#FFB088]" /> Transparent Care
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-display flex items-center gap-1.5">
              <span>Adopt Pets</span>
              <KawaiiSparkle size={10} fill="#FF9B8A" />
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#C9BFB5]">
              <li>
                <Link to="/browse?species=Dog" className="hover:text-[#FF9B8A] transition-colors">
                  Dogs & Puppies
                </Link>
              </li>
              <li>
                <Link to="/browse?species=Cat" className="hover:text-[#FF9B8A] transition-colors">
                  Cats & Kittens
                </Link>
              </li>
              <li>
                <Link to="/browse?species=Rabbit" className="hover:text-[#FF9B8A] transition-colors">
                  Rabbits & Small Pets
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-[#FF9B8A] transition-colors">
                  All Adoptable Friends
                </Link>
              </li>
            </ul>
          </div>

          {/* For Shelters */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-display flex items-center gap-1.5">
              <span>Organizations</span>
              <KawaiiSparkle size={10} fill="#FF9B8A" />
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#C9BFB5]">
              <li>
                <Link to="/shelters" className="hover:text-[#FF9B8A] transition-colors">
                  Shelter Directory
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FF9B8A] transition-colors">
                  Register Shelter / NGO
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#FF9B8A] transition-colors">
                  Rescue Portal
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-[#FF9B8A] transition-colors">
                  Adoption Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-display">
              Contact & Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C9BFB5]">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF9B8A] shrink-0" />
                <span>care@pawconnect.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF9B8A] shrink-0" />
                <span>+1 (800) 555-PAWS</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF9B8A] shrink-0" />
                <span>Austin, Texas & Global Rescues</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A89D93] gap-4">
          <p>© {new Date().getFullYear()} PawConnect. Crafted with warmth and compassion.</p>
          <div className="flex items-center gap-1.5">
            <span>Every adoption brings joy</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6584] fill-current inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
