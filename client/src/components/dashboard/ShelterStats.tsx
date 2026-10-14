import React from 'react';
import { Eye, FileText, Percent, Heart } from 'lucide-react';
import { Pet, Application } from '../../types';

const Card: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="rounded-lg border p-5" style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#B99A86' }}>{label}</span>
      <span style={{ color: '#C2572F' }}>{icon}</span>
    </div>
    <p className="text-2xl sm:text-3xl font-black" style={{ color: '#8E3B22', fontFamily: 'var(--font-serif)' }}>{value}</p>
  </div>
);

const Bars: React.FC<{ title: string; rows: { label: string; value: number; color?: string }[] }> = ({ title, rows }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="rounded-lg border p-5" style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}>
      <h4 className="font-black text-sm mb-4" style={{ color: '#3E1F1A' }}>{title}</h4>
      {rows.length === 0 ? (
        <p className="text-xs" style={{ color: '#B99A86' }}>Nothing to show yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#8A5A48' }}>
                <span className="font-bold truncate pr-2">{r.label}</span>
                <span className="font-black" style={{ color: '#3E1F1A' }}>{r.value}</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: '#FCE8D0' }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${(r.value / max) * 100}%`, background: r.color || '#C2572F' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ShelterStats: React.FC<{ pets: Pet[]; applications: Application[] }> = ({ pets, applications }) => {
  const totalViews = pets.reduce((n, p) => n + (p.viewsCount || 0), 0);
  const count = (s: string) => applications.filter((a) => a.status === s).length;
  const decided = applications.length - count('Pending');
  const approvalRate = decided ? Math.round(((count('Approved') + count('Completed')) / decided) * 100) : 0;
  const adopted = pets.filter((p) => p.status === 'Adopted').length;
  const adoptionRate = pets.length ? Math.round((adopted / pets.length) * 100) : 0;

  const topViewed = [...pets]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 5)
    .map((p) => ({ label: p.name, value: p.viewsCount || 0 }));

  const appsPerPet = pets
    .map((p) => ({
      label: p.name,
      value: applications.filter((a) => (a.pet?._id || (a.pet as unknown as string)) === p._id).length,
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Profile views" value={totalViews} icon={<Eye className="w-4 h-4" />} />
        <Card label="Applications" value={applications.length} icon={<FileText className="w-4 h-4" />} />
        <Card label="Approval rate" value={`${approvalRate}%`} icon={<Percent className="w-4 h-4" />} />
        <Card label="Adoption rate" value={`${adoptionRate}%`} icon={<Heart className="w-4 h-4" />} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Bars
          title="Application pipeline"
          rows={[
            { label: 'Pending', value: count('Pending'), color: '#E8873F' },
            { label: 'Approved', value: count('Approved'), color: '#C2572F' },
            { label: 'Completed', value: count('Completed'), color: '#8E3B22' },
            { label: 'Rejected', value: count('Rejected'), color: '#B99A86' },
          ]}
        />
        <Bars
          title="Pets by status"
          rows={[
            { label: 'Available', value: pets.filter((p) => p.status === 'Available').length },
            { label: 'Reserved', value: pets.filter((p) => p.status === 'Reserved').length, color: '#E8873F' },
            { label: 'Adopted', value: adopted, color: '#8E3B22' },
          ]}
        />
        <Bars title="Most viewed pets" rows={topViewed} />
        <Bars title="Most requested pets" rows={appsPerPet} />
      </div>
    </div>
  );
};
