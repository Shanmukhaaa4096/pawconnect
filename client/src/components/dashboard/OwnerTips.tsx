import React from 'react';
import { ShieldCheck } from 'lucide-react';

const TIPS = [
  { t: 'Meet in a public place first', d: 'Introduce the pet to the adopter somewhere neutral before any home visit.' },
  { t: 'Ask questions, trust your gut', d: 'Check the fit result on each application, then ask about routine, vet and plans.' },
  { t: 'Never rush or take money upfront', d: 'A small rehoming fee is fine. Be wary of pressure, odd payment requests or no questions asked.' },
  { t: 'Put it in writing', d: 'Share vet records and sign a short agreement. Use the handover checklist to track it.' },
];

export const OwnerTips: React.FC = () => (
  <section className="rounded-2xl border-2 p-5 sm:p-6" style={{ background: '#FBE3A1', borderColor: '#4A2218', boxShadow: '4px 4px 0 #4A2218' }}>
    <div className="flex items-center gap-2 mb-3">
      <ShieldCheck className="w-5 h-5" style={{ color: '#4A2218' }} />
      <h3 className="font-black text-base" style={{ color: '#4A2218', fontFamily: 'var(--font-serif)' }}>Safe rehoming tips</h3>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {TIPS.map((x, i) => (
        <div key={x.t}>
          <span className="text-2xl font-black leading-none" style={{ fontFamily: 'var(--font-serif)', color: 'transparent', WebkitTextStroke: '1.5px #4A2218' }}>
            {i + 1}
          </span>
          <p className="text-xs font-black mt-1" style={{ color: '#4A2218' }}>{x.t}</p>
          <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#5A3A2E' }}>{x.d}</p>
        </div>
      ))}
    </div>
  </section>
);
