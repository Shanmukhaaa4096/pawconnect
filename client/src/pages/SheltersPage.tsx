import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, MapPin, Globe, Phone, ArrowRight } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SheltersPage: React.FC = () => {
  const [shelters, setShelters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        setLoading(true);
        const res = await api.getShelters();
        setShelters(res.shelters || []);
      } catch (err) {
        console.error('Failed to load shelters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShelters();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
          Partner Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Verified Rescue Shelters & NGOs
        </h1>
        <p className="text-sm text-slate-600">
          Every organization on PawConnect is verified for non-profit license credentials and compassionate welfare standards.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading partner rescue shelters..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {shelters.map((shelter) => (
            <div
              key={shelter._id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={
                      shelter.avatar ||
                      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={shelter.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-500/20 shrink-0"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                      <ShieldCheck className="w-3 h-3" /> Certified 501(c)(3)
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                      {shelter.organization?.name || shelter.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      {shelter.location?.city || 'Austin'}, {shelter.location?.state || 'TX'}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {shelter.organization?.description ||
                    shelter.bio ||
                    'Dedicated to rescuing, rehabilitating, and finding responsible forever families for abandoned and vulnerable animals.'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>{shelter.phone || '+1 (555) 000-0000'}</span>
                  </div>
                  {shelter.organization?.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-orange-600" />
                      <span className="truncate max-w-[180px]">{shelter.organization.website}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  License: {shelter.organization?.licenseNumber || 'Active NGO'}
                </span>
                <Link
                  to={`/shelters/${shelter._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 text-orange-700 font-bold text-xs hover:bg-orange-100 transition-colors"
                >
                  <span>View Shelter Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
