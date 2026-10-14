import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Globe, Phone, ArrowRight } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ background: '#FCE8D0' }}>

      {/* Page Header */}
      <div className="max-w-2xl mb-12">
        <p className="section-label">Partner organisations</p>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            color: '#3E1F1A',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          Verified shelters & rescues
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: '#8A5A48', maxWidth: '50ch' }}>
          Every organisation on PawConnect is independently verified for non-profit credentials and compassionate animal welfare standards.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading partner shelters…" />
      ) : shelters.length === 0 ? (
        <div
          className="p-10 text-center rounded-lg border max-w-md mx-auto"
          style={{ background: '#F8DDBF', borderColor: '#EBC9A5' }}
        >
          <p className="text-sm font-medium" style={{ color: '#8A5A48' }}>No shelters listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {shelters.map((shelter) => (
            <div
              key={shelter._id}
              className="editorial-card p-6 sm:p-7 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-start gap-4">
                  <img
                    src={shelter.avatar || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
                    alt={shelter.name}
                    className="w-14 h-14 rounded object-cover shrink-0"
                    style={{ border: '1px solid #EBC9A5' }}
                  />
                  <div className="flex-1 min-w-0">
                    {shelter.organization?.verified ? (
                      <div className="inline-flex items-center gap-1.5 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#8E3B22' }} />
                        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#8E3B22' }}>
                          Verified Partner
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#B99A86' }}>
                          Verification Pending
                        </span>
                      </div>
                    )}
                    <h3
                      className="font-semibold text-base leading-tight"
                      style={{ fontFamily: "'Fraunces', serif", color: '#3E1F1A' }}
                    >
                      {shelter.organization?.name || shelter.name}
                    </h3>
                    <p className="flex items-center gap-1 mt-1 text-xs" style={{ color: '#B99A86' }}>
                      <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#C8795A' }} />
                      {shelter.location?.city || 'Austin'}, {shelter.location?.state || 'TX'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: '#8A5A48' }}>
                  {shelter.organization?.description || shelter.bio ||
                    'Dedicated to rescuing, rehabilitating, and finding responsible forever families for abandoned and vulnerable animals.'}
                </p>

                {/* Contact */}
                <div className="pt-3 border-t flex flex-wrap gap-4 text-xs" style={{ borderColor: '#F8DDBF', color: '#B99A86' }}>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" style={{ color: '#C8795A' }} />
                    <span>{shelter.phone || '+1 (555) 000-0000'}</span>
                  </div>
                  {shelter.organization?.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" style={{ color: '#C8795A' }} />
                      <span className="truncate max-w-[200px]">{shelter.organization.website}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer row */}
              <div
                className="pt-5 mt-5 border-t flex items-center justify-between"
                style={{ borderColor: '#F8DDBF' }}
              >
                <span className="text-xs" style={{ color: '#B99A86' }}>
                  Licence: {shelter.organization?.licenseNumber || 'Active NGO'}
                </span>
                <Link
                  to={`/shelters/${shelter._id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  style={{ color: '#8E3B22', textDecoration: 'none' }}
                >
                  View profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
