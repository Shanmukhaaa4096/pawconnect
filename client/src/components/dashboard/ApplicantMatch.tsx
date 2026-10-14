import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Pet, ApplicationQuestionnaire } from '../../types';

type Tone = 'ok' | 'warn' | 'info';
interface Check { tone: Tone; text: string }

/** Plain-language fit check between a pet and an applicant's answers. Advice only, never a decision. */
export const buildChecks = (pet: Pet, q: ApplicationQuestionnaire): Check[] => {
  const out: Check[] = [];
  const gw = pet.goodWith || { children: true, dogs: true, cats: true };

  if (q.hasChildren) {
    out.push(
      gw.children
        ? { tone: 'ok', text: `${pet.name} is listed as good with children.` }
        : { tone: 'warn', text: `Household has children, but ${pet.name} is not listed as good with kids.` }
    );
  }
  if (q.hasOtherPets) {
    out.push(
      gw.dogs || gw.cats
        ? { tone: 'ok', text: `${pet.name} can live with other pets (${[gw.dogs && 'dogs', gw.cats && 'cats'].filter(Boolean).join(', ')}).` }
        : { tone: 'warn', text: `Household has other pets, but ${pet.name} is not listed as good with other animals.` }
    );
  }

  const hours = Number(q.hoursAlonePerDay) || 0;
  if (hours > 8) out.push({ tone: 'warn', text: `Would be alone ${hours} hours a day. That is long for most pets.` });
  else if (hours > 6) out.push({ tone: 'info', text: `Alone ${hours} hours a day. Ask about a plan for breaks.` });
  else out.push({ tone: 'ok', text: `Home most of the day (${hours}h alone).` });

  const big = pet.size === 'Large' || pet.size === 'Extra Large';
  if (big && (q.housingType === 'Apartment' || q.housingType === 'Townhouse/Condo')) {
    out.push({ tone: 'warn', text: `${pet.size} pet in ${q.housingType.toLowerCase()}. Check space and exercise plan.` });
  } else if (q.housingType === 'House with Yard') {
    out.push({ tone: 'ok', text: 'Has a house with a yard.' });
  }

  if (q.ownership === 'Rent') out.push({ tone: 'info', text: 'Renting. Confirm the landlord allows pets.' });

  if (q.petExperience === 'First-time Owner' && (pet.health?.specialNeeds || (pet.temperament || []).some((t) => /energetic|shy|anxious/i.test(t)))) {
    out.push({ tone: 'warn', text: 'First-time owner and this pet may need an experienced hand.' });
  } else if (q.petExperience !== 'First-time Owner') {
    out.push({ tone: 'ok', text: `${q.petExperience}.` });
  }
  return out;
};

export const fitScore = (checks: Check[]): number => {
  const warns = checks.filter((c) => c.tone === 'warn').length;
  const infos = checks.filter((c) => c.tone === 'info').length;
  return Math.max(10, 100 - warns * 25 - infos * 8);
};

const ICON = { ok: CheckCircle2, warn: AlertTriangle, info: Info };
const COLOR = { ok: '#137333', warn: '#B3261E', info: '#8A5A48' };

export const ApplicantMatch: React.FC<{ pet: Pet; questionnaire: ApplicationQuestionnaire }> = ({ pet, questionnaire }) => {
  const checks = buildChecks(pet, questionnaire);
  const score = fitScore(checks);
  const label = score >= 80 ? 'Strong match' : score >= 55 ? 'Worth a chat' : 'Check the concerns';
  const bar = score >= 80 ? '#2E7D32' : score >= 55 ? '#E8873F' : '#B3261E';

  return (
    <div className="rounded-lg border-2 p-4 space-y-3" style={{ background: '#FFFFFF', borderColor: '#4A2218' }}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#8A5A48' }}>Fit check</span>
        <span className="text-xs font-black" style={{ color: bar }}>{label} · {score}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: '#FCE8D0' }} role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-2 rounded-full" style={{ width: `${score}%`, background: bar }} />
      </div>
      <ul className="space-y-1.5">
        {checks.map((c, i) => {
          const Icon = ICON[c.tone];
          return (
            <li key={i} className="flex items-start gap-2 text-xs leading-snug" style={{ color: '#3E1F1A' }}>
              <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: COLOR[c.tone] }} />
              <span>{c.text}</span>
            </li>
          );
        })}
      </ul>
      <p className="text-[10px]" style={{ color: '#B99A86' }}>A guide only. You decide who is right for your pet.</p>
    </div>
  );
};
