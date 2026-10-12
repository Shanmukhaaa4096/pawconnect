import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      className="min-h-[70vh] flex items-center justify-center px-4 py-16"
      style={{ background: '#F7F5EF' }}
    >
      <div className="max-w-md w-full text-center space-y-6">

        {/* Large typographic 404 */}
        <div>
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 'clamp(5rem, 15vw, 9rem)',
              fontWeight: 600,
              lineHeight: 1,
              color: '#EAECE4',
              letterSpacing: '-0.04em',
            }}
          >
            404
          </p>
        </div>

        <div className="space-y-3">
          <p className="section-label">Page not found</p>
          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 600,
              fontSize: '1.75rem',
              color: '#252825',
              letterSpacing: '-0.02em',
            }}
          >
            This page wandered off
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#6B7068', maxWidth: '36ch', margin: '0 auto' }}>
            It may have found its forever home somewhere else. Let us guide you back.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            style={{ textDecoration: 'none' }}
          >
            <Home className="w-4 h-4" />
            Return home
          </Link>
          <Link
            to="/browse"
            className="btn-secondary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            style={{ textDecoration: 'none' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Browse pets
          </Link>
        </div>
      </div>
    </div>
  );
};
