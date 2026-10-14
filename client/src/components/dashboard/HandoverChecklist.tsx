import React, { useState } from 'react';
import { Check, CalendarDays } from 'lucide-react';
import { Application, ApplicationHandover } from '../../types';
import { api } from '../../services/api';

const STEPS: { key: 'meetGreet' | 'homeCheck' | 'vetRecords' | 'agreement'; label: string; hint: string }[] = [
  { key: 'meetGreet', label: 'Meet & greet done', hint: 'Adopter and pet met in person' },
  { key: 'homeCheck', label: 'Home check or video tour', hint: 'You are comfortable with their home' },
  { key: 'vetRecords', label: 'Vet records shared', hint: 'Vaccination card and health notes handed over' },
  { key: 'agreement', label: 'Adoption agreement signed', hint: 'Both sides agree on care and return terms' },
];

const toInputDate = (iso?: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');

export const HandoverChecklist: React.FC<{
  app: Application;
  canEdit?: boolean;
  onSaved?: (app: Application) => void;
}> = ({ app, canEdit = false, onSaved }) => {
  const [handover, setHandover] = useState<ApplicationHandover>(app.handover || {});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const done = STEPS.filter((s) => handover[s.key]).length;

  const save = async (patch: Partial<ApplicationHandover>) => {
    const prev = handover;
    setHandover({ ...handover, ...patch }); // optimistic
    setError(null);
    setBusy(true);
    try {
      const res = await api.updateHandover(app._id, patch);
      setHandover(res.application.handover || {});
      onSaved?.({ ...app, ...res.application, pet: app.pet, shelter: app.shelter, adopter: app.adopter });
    } catch (err: any) {
      setHandover(prev);
      setError(err.message || 'Could not save');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border-2 p-4 space-y-3" style={{ background: '#FFFFFF', borderColor: '#4A2218' }}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8A5A48' }}>Handover checklist</span>
        <span className="text-xs font-black" style={{ color: '#C2572F' }}>{done}/{STEPS.length} done</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: '#FCE8D0' }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${(done / STEPS.length) * 100}%`, background: '#C2572F' }} />
      </div>

      <ul className="space-y-2">
        {STEPS.map((s) => {
          const on = Boolean(handover[s.key]);
          return (
            <li key={s.key}>
              <button
                type="button"
                disabled={!canEdit || busy}
                onClick={() => save({ [s.key]: !on })}
                aria-pressed={on}
                className="w-full flex items-start gap-3 text-left disabled:cursor-default"
              >
                <span
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition"
                  style={{ borderColor: '#4A2218', background: on ? '#C2572F' : '#FFFFFF' }}
                >
                  {on && <Check className="w-3.5 h-3.5 text-white" />}
                </span>
                <span>
                  <span className="block text-xs font-bold" style={{ color: '#3E1F1A' }}>{s.label}</span>
                  <span className="block text-[11px]" style={{ color: '#8A5A48' }}>{s.hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-2 pt-1">
        <CalendarDays className="w-4 h-4" style={{ color: '#C2572F' }} />
        {canEdit ? (
          <label className="flex items-center gap-2 text-xs font-bold" style={{ color: '#3E1F1A' }}>
            Handover date
            <input
              type="date"
              disabled={busy}
              value={toInputDate(handover.handoverDate)}
              onChange={(e) => save({ handoverDate: e.target.value || null })}
              className="h-8 px-2 rounded-md border-2 text-xs"
              style={{ borderColor: '#4A2218' }}
            />
          </label>
        ) : (
          <span className="text-xs font-bold" style={{ color: '#3E1F1A' }}>
            {handover.handoverDate
              ? `Handover planned for ${new Date(handover.handoverDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}`
              : 'Handover date not set yet'}
          </span>
        )}
      </div>
      {error && <p role="alert" className="text-xs font-bold" style={{ color: '#B3261E' }}>{error}</p>}
    </div>
  );
};
