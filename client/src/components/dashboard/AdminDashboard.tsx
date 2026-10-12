import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Sparkles } from 'lucide-react';
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
    return <LoadingSpinner label="Loading platform sanctuary overview..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D2438] via-[#3D3050] to-[#2D2438] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden border-2 border-[#FFC6D9]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6584] to-[#FF8DA1] flex items-center justify-center text-white shadow-md shadow-[#FF6584]/30 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-[#FFC6D9] text-[10px] font-black uppercase tracking-wider mb-1">
              <KawaiiSparkle className="w-3 h-3 text-[#FF6584]" />
              <span>Platform Administration (✿◠‿◠)</span>
            </div>
            <h2 className="text-2xl font-black text-white">PawConnect Admin Portal</h2>
            <p className="text-xs text-[#D8CCE6] font-medium">
              Ecosystem oversight of adoptable friends, certified shelters, and inquiries
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-[#EDFAF4] text-[#059669] border border-[#CFF5E7] self-start sm:self-center shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" />
          Ecosystem Healthy 🐾
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kawaii-card p-5">
          <span className="text-xs font-black uppercase tracking-wider text-[#8E7F9B]">Total Friends</span>
          <p className="text-3xl font-black text-[#493D50] mt-2">{stats?.totalPets || 0}</p>
        </div>

        <div className="kawaii-card p-5">
          <span className="text-xs font-black uppercase tracking-wider text-[#8E7F9B]">Active Applications</span>
          <p className="text-3xl font-black text-[#FF6584] mt-2">{stats?.totalApplications || 0}</p>
        </div>

        <div className="kawaii-card p-5">
          <span className="text-xs font-black uppercase tracking-wider text-[#8E7F9B]">Certified Shelters</span>
          <p className="text-3xl font-black text-[#059669] mt-2">{stats?.totalShelters || 0}</p>
        </div>

        <div className="kawaii-card p-5">
          <span className="text-xs font-black uppercase tracking-wider text-[#8E7F9B]">Successful Adoptions</span>
          <p className="text-3xl font-black text-[#8042C9] mt-2">{stats?.adoptedPets || 0}</p>
        </div>
      </div>

      {/* Platform Health and Verification Note */}
      <div className="kawaii-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#FF6584]" />
          <h3 className="font-black text-[#493D50] text-lg">
            System & Data Integrity
          </h3>
        </div>
        <p className="text-xs text-[#6D5D77] leading-relaxed font-medium">
          PawConnect runs with dual-tier database architecture. Real-time updates, Socket.io subscriptions, and JWT-authenticated roles are active. All shelter registrations undergo verified non-profit license checks.
        </p>
      </div>
    </div>
  );
};
