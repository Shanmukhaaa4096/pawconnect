import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { api } from '../../services/api';
import { ApplicantMatch } from './ApplicantMatch';
import { HandoverChecklist } from './HandoverChecklist';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#B99A86' }}>
    {children}
  </label>
);

/**
 * Review an adoption application: details, fit check, handover checklist, decision buttons.
 * `onChanged(app, closed)` fires after a decision (closed=true) or a handover save (closed=false).
 */
export const ApplicationReviewModal: React.FC<{
  app: Application;
  noteLabel?: string;
  onClose: () => void;
  onChanged: (app: Application, closed: boolean) => void;
}> = ({ app, noteLabel = 'Shelter feedback note (shared with adopter)', onClose, onChanged }) => {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const decide = async (status: ApplicationStatus) => {
    try {
      setBusy(true);
      const res = await api.updateApplicationStatus(app._id, status, note);
      onChanged({ ...app, ...res.application, pet: app.pet, adopter: app.adopter, shelter: app.shelter }, true);
      onClose();
    } catch (err: any) {
      alert(`Could not update application: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(37,40,37,0.5)' }}>
          <div
            className="w-full max-w-xl rounded-lg border p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
            style={{ background: '#FFFFFF', borderColor: '#EBC9A5' }}
          >
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: '#F8DDBF' }}>
              <div>
                <p className="section-label" style={{ margin: 0 }}>Adoption review</p>
                <h3 className="font-semibold text-lg mt-0.5" style={{ color: '#3E1F1A', fontFamily: "'Fraunces', serif" }}>
                  {app.pet?.name}
                </h3>
              </div>
              <button
                onClick={() => onClose()}
                className="p-1.5 rounded transition-colors hover:bg-[#F8DDBF]"
                style={{ color: '#8A5A48' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded border p-4 space-y-2.5 text-xs" style={{ background: '#FCE8D0', borderColor: '#EBC9A5' }}>
              {[
                { label: 'Applicant',     value: app.questionnaire?.fullName },
                { label: 'Phone',         value: app.questionnaire?.phone },
                { label: 'Address',       value: app.questionnaire?.address || 'Not provided' },
                { label: 'Household',     value: `${app.questionnaire?.housingType} (${app.questionnaire?.ownership})` },
                { label: 'Other pets / children', value: `${app.questionnaire?.hasOtherPets ? 'Yes' : 'No'} / ${app.questionnaire?.hasChildren ? 'Yes' : 'No'}` },
                { label: 'Hours alone daily', value: `${app.questionnaire?.hoursAlonePerDay} hours` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="font-medium shrink-0" style={{ color: '#B99A86' }}>{label}</span>
                  <span className="text-right" style={{ color: '#3E1F1A' }}>{value}</span>
                </div>
              ))}
              <div>
                <span className="font-medium block mb-1.5" style={{ color: '#B99A86' }}>Reason for adopting</span>
                <p className="text-xs italic leading-relaxed p-3 rounded border" style={{ background: '#FFFFFF', borderColor: '#EBC9A5', color: '#8A5A48' }}>
                  "{app.questionnaire?.reasonForAdopting}"
                </p>
              </div>
            </div>

            {app.pet && app.questionnaire && (
              <ApplicantMatch pet={app.pet} questionnaire={app.questionnaire} />
            )}

            {['Approved', 'Completed'].includes(app.status) && (
              <HandoverChecklist
                key={app._id}
                app={app}
                canEdit
                onSaved={(a) => onChanged({ ...app, handover: a.handover }, false)}
              />
            )}

            {/* Notes */}
            <div>
              <FieldLabel>{noteLabel}</FieldLabel>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Approved for home visit — vet reference verified."
                className="editorial-input"
                style={{ height: 'auto', padding: '0.625rem 0.875rem', resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => decide('Approved')}
                className="py-2.5 px-3 rounded text-white text-xs font-medium transition-colors disabled:opacity-60"
                style={{ background: '#8E3B22' }}
              >
                Approve (reserve)
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => decide('Completed')}
                className="py-2.5 px-3 rounded text-white text-xs font-medium transition-colors disabled:opacity-60"
                style={{ background: '#4A6659' }}
              >
                Finalise adoption
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => decide('Rejected')}
                className="py-2.5 px-3 rounded text-xs font-medium transition-colors disabled:opacity-60 border"
                style={{ background: 'rgba(200,121,90,0.08)', color: '#9B5A3A', borderColor: 'rgba(200,121,90,0.25)' }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
  );
};
