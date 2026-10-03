import React, { useState, useEffect } from 'react';
import { ShieldCheck, PawPrint, Users, Building2, FileText, CheckCircle2, Database } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.getPlatformStats();
        setStats(res.stats);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading admin system overview..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Platform Administration
            </span>
            <h2 className="text-2xl font-black text-white">PawConnect Admin Portal</h2>
            <p className="text-xs text-slate-300">
              Complete oversight of pet listings, verified shelters, and adoption requests
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          System Normal
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pets Listed</span>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats?.totalPets || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Applications</span>
          <p className="text-3xl font-black text-orange-600 mt-2">{stats?.totalApplications || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Shelters</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">{stats?.totalShelters || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Successful Adoptions</span>
          <p className="text-3xl font-black text-indigo-600 mt-2">{stats?.adoptedPets || 0}</p>
        </div>
      </div>

      {/* Platform Health and Verification Note */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-600" />
          System & Data Synchronization
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          PawConnect runs with dual-tier database architecture. Real-time updates, Socket.io subscriptions, and JWT-authenticated roles are active. All shelter registrations undergo verified non-profit license checks.
        </p>
      </div>
    </div>
  );
};
