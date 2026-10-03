import React from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdopterDashboard } from '../components/dashboard/AdopterDashboard';
import { ShelterDashboard } from '../components/dashboard/ShelterDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || undefined;

  if (loading) {
    return <LoadingSpinner label="Authenticating session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {user.role === 'adopter' && <AdopterDashboard initialTab={currentTab} />}
      {user.role === 'shelter' && <ShelterDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </div>
  );
};
