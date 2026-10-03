import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { KawaiiPaw, KawaiiSparkle } from '../common/KawaiiIcons';

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
    return <LoadingSpinner label="Loading platform overview..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#2B2523] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FF7E67] flex items-center justify-center text-white shadow-md shadow-[#FF7E67]/30 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[#FFD8CF] text-[10px] font-black uppercase tracking-wider mb-1">
              <KawaiiSparkle className="w-3 h-3 text-[#FF7E67]" />
              <span>Platform Administration</span>
            </div>
            <h2 className="text-2xl font-black text-white">PawConnect Admin Portal</h2>
            <p className="text-xs text-[#D5CEC8] font-medium">
              Ecosystem oversight of adoptable friends, certified shelters, and inquiries
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#EEF8F5] text-[#1C6C57] border border-[#CCE8DF] self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-[#1C6C57] animate-ping" />
          Ecosystem Healthy
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#EDE6DC] shadow-xs">
          <span className="text-xs font-black uppercase tracking-wider text-[#7A6E68]">Total Friends</span>
          <p className="text-3xl font-black text-[#2B2523] mt-2">{stats?.totalPets || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EDE6DC] shadow-xs">
          <span className="text-xs font-black uppercase tracking-wider text-[#7A6E68]">Active Applications</span>
          <p className="text-3xl font-black text-[#FF7E67] mt-2">{stats?.totalApplications || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EDE6DC] shadow-xs">
          <span className="text-xs font-black uppercase tracking-wider text-[#7A6E68]">Certified Shelters</span>
          <p className="text-3xl font-black text-[#1C6C57] mt-2">{stats?.totalShelters || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EDE6DC] shadow-xs">
          <span className="text-xs font-black uppercase tracking-wider text-[#7A6E68]">Successful Adoptions</span>
          <p className="text-3xl font-black text-[#4844B3] mt-2">{stats?.adoptedPets || 0}</p>
        </div>
      </div>

      {/* Platform Health and Verification Note */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE6DC] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#FF7E67]" />
          <h3 className="font-black text-[#2B2523] text-lg">
            System & Data Integrity
          </h3>
        </div>
        <p className="text-xs text-[#5C524E] leading-relaxed font-normal">
          PawConnect runs with dual-tier database architecture. Real-time updates, Socket.io subscriptions, and JWT-authenticated roles are active. All shelter registrations undergo verified non-profit license checks.
        </p>
      </div>
    </div>
  );
};

