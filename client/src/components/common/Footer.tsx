import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Heart, Shield, Award, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30">
                <PawPrint className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Paw<span className="text-orange-500">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              PawConnect is a mission-driven digital pet adoption platform dedicated to uniting homeless and rescued animals with loving families across verified shelters and animal welfare NGOs.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" /> Verified Rescues
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-orange-400" /> Transparent Process
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Adopt</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/browse?species=Dog" className="hover:text-orange-400 transition-colors">
                  Adopt Dogs & Puppies
                </Link>
              </li>
              <li>
                <Link to="/browse?species=Cat" className="hover:text-orange-400 transition-colors">
                  Adopt Cats & Kittens
                </Link>
              </li>
              <li>
                <Link to="/browse?species=Rabbit" className="hover:text-orange-400 transition-colors">
                  Adopt Small Animals
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-orange-400 transition-colors">
                  All Adoptable Pets
                </Link>
              </li>
            </ul>
          </div>

          {/* For Shelters */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Organizations</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/shelters" className="hover:text-orange-400 transition-colors">
                  Shelter Directory
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-orange-400 transition-colors">
                  Register Your NGO/Shelter
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-400 transition-colors">
                  Shelter Management Portal
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-orange-400 transition-colors">
                  Verification Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>support@pawconnect.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>+1 (800) 555-PAWS</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Austin, Texas & Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} PawConnect. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for animals everywhere</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
