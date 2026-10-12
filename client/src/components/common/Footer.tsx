import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="mt-auto"
      style={{ background: '#252825', color: '#EAECE4', borderTop: '1px solid rgba(234,236,228,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b" style={{ borderColor: 'rgba(234,236,228,0.1)' }}>

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <ellipse cx="7"  cy="11" rx="3"   ry="4"   fill="#F7F5EF" />
                <ellipse cx="13" cy="7"  rx="3"   ry="4.5" fill="#F7F5EF" />
                <ellipse cx="19" cy="7"  rx="3"   ry="4.5" fill="#F7F5EF" />
                <ellipse cx="25" cy="11" rx="3"   ry="4"   fill="#F7F5EF" />
                <path d="M16 13c-5.5 0-10 4-10 9 0 3.5 3 6 10 6s10-2.5 10-6c0-5-4.5-9-10-9z" fill="#F7F5EF"/>
              </svg>
              <span
                style={{
                  fontFamily: "'Lora', serif",
                  fontWeight: 600,
                  fontSize: '1.0625rem',
                  color: '#F7F5EF',
                  letterSpacing: '-0.01em',
                }}
              >
                PawConnect
              </span>
            </Link>

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(234,236,228,0.6)', maxWidth: '34ch' }}>
              A thoughtful adoption platform connecting animal lovers with verified shelters, foster homes, and rescue organisations.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: '#C8795A' }} />
              <span className="text-xs" style={{ color: 'rgba(234,236,228,0.5)' }}>
                All shelters are independently verified
              </span>
            </div>
          </div>

          {/* Adopt Pets */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#F7F5EF' }}>
              Adopt
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/browse?species=Dog',    label: 'Dogs' },
                { to: '/browse?species=Cat',    label: 'Cats' },
                { to: '/browse?species=Rabbit', label: 'Rabbits & Small Pets' },
                { to: '/browse',                label: 'All Animals' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(234,236,228,0.55)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F7F5EF')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(234,236,228,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organisations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#F7F5EF' }}>
              Organisations
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/shelters',          label: 'Shelter Directory' },
                { to: '/register',          label: 'Register a Shelter' },
                { to: '/dashboard',         label: 'Rescue Portal' },
                { to: '/#how-it-works',     label: 'Adoption Standards' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(234,236,228,0.55)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F7F5EF')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(234,236,228,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#F7F5EF' }}>
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm" style={{ color: 'rgba(234,236,228,0.55)' }}>
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#C8795A' }} />
                <span>care@pawconnect.org</span>
              </li>
              <li className="flex items-start gap-2 text-sm" style={{ color: 'rgba(234,236,228,0.55)' }}>
                <Phone className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#C8795A' }} />
                <span>+1 (800) 555-PAWS</span>
              </li>
              <li className="flex items-start gap-2 text-sm" style={{ color: 'rgba(234,236,228,0.55)' }}>
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#C8795A' }} />
                <span>Austin, Texas & Global</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'rgba(234,236,228,0.35)' }}>
          <p>© {new Date().getFullYear()} PawConnect. Connecting pets with loving homes.</p>
          <p>Built with care for animal welfare.</p>
        </div>
      </div>
    </footer>
  );
};
