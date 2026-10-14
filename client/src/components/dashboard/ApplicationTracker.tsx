import React from 'react';
import { Check, X } from 'lucide-react';
import { Application } from '../../types';

const STEPS = ['Submitted', 'In review', 'Decision', 'Adopted'];

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

/** Step-by-step progress for one adoption application. */
export const ApplicationTracker: React.FC<{ app: Application }> = ({ app }) => {
  if (app.status === 'Withdrawn') {
    return (
      <p className="w-full mt-4 text-[11px] text-center font-bold" style={{ color: '#8A5A48' }}>
        You withdrew this application{app.timeline?.length ? ` on ${fmt(app.timeline[app.timeline.length - 1].date)}` : ''}.
      </p>
    );
  }

  const rejected = app.status === 'Rejected';
  const done =
    app.status === 'Pending' ? 1 : app.status === 'Approved' ? 3 : app.status === 'Completed' ? 4 : 2;

  const when = (status: string) => app.timeline?.find((t) => t.status === status)?.date;
  const dates = [
    app.createdAt,
    undefined,
    when('Approved') || when('Rejected'),
    when('Completed'),
  ];
  const last = app.timeline?.[app.timeline.length - 1];

  return (
    <div className="w-full mt-4">
      <ol className="flex items-start">
        {STEPS.map((label, i) => {
          const isDone = i < done;
          const isFail = rejected && i === 2;
          const isActive = !isDone && !isFail && i === done && !rejected;
          const lineDone = i < done - 1;
          return (
            <li key={label} className="flex-1 flex flex-col items-center relative min-w-0">
              {i > 0 && (
                <span
                  className="absolute top-3 right-1/2 w-full h-0.5 -z-0"
                  style={{ background: lineDone || (rejected && i === 2) ? '#C2572F' : '#EBC9A5' }}
                />
              )}
              <span
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                  isActive ? 'animate-pulse' : ''
                }`}
                style={{
                  background: isFail ? '#B3261E' : isDone ? '#C2572F' : '#FFFFFF',
                  borderColor: isFail ? '#B3261E' : isDone || isActive ? '#C2572F' : '#EBC9A5',
                  color: isDone || isFail ? '#FFFFFF' : '#C2572F',
                }}
              >
                {isFail ? <X className="w-3 h-3" /> : isDone ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span
                className="mt-1.5 text-[11px] font-bold text-center leading-tight"
                style={{ color: isFail ? '#B3261E' : isDone || isActive ? '#3E1F1A' : '#B99A86' }}
              >
                {isFail ? 'Declined' : label}
              </span>
              <span className="text-[10px]" style={{ color: '#B99A86' }}>{fmt(dates[i])}</span>
            </li>
          );
        })}
      </ol>
      {last?.note && (
        <p className="mt-3 text-[11px] text-center" style={{ color: '#8A5A48' }}>
          Latest: {last.note}
        </p>
      )}
    </div>
  );
};
