import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
        <PawPrint className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500">
        Oops! Looks like this page wandered off like an adventurous puppy.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
};
