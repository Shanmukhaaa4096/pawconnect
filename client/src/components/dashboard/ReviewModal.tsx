import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Application } from '../../types';
import { api } from '../../services/api';
import { StarPicker } from '../common/Stars';

export const ReviewModal: React.FC<{ app: Application; onClose: () => void; onDone: (appId: string) => void }> = ({
  app,
  onClose,
  onDone,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shelterId = (app.shelter as any)?._id || (app.shelter as unknown as string);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('Please pick a star rating.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.addShelterReview(shelterId, { applicationId: app._id, rating, comment: comment.trim() });
      onDone(app._id);
    } catch (err: any) {
      setError(err.message || 'Could not save your review.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#3E1F1A]/50 flex items-center justify-center p-4" onMouseDown={onClose}>
      <form
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Review shelter"
        className="bg-[#FCE8D0] w-full max-w-md rounded-3xl border-2 border-[#EBC9A5] p-6 space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#8E3B22]" style={{ fontFamily: 'var(--font-serif)' }}>
              Rate {app.shelter?.organization?.name || app.shelter?.name || 'the shelter'}
            </h3>
            <p className="text-xs text-[#8A5A48] font-medium mt-0.5">How was adopting {app.pet?.name}?</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-[#F8DDBF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <StarPicker value={rating} onChange={setRating} />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          placeholder="Share a few words (optional)"
          className="w-full h-24 px-3 py-2 rounded-xl bg-white border-2 border-[#EBC9A5] text-sm focus:outline-none focus:border-[#C2572F] resize-none"
        />

        {error && <p role="alert" className="text-sm font-bold text-[#B3261E]">{error}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border-2 border-[#EBC9A5] text-sm font-extrabold text-[#8A5A48]">
            Later
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-[#C2572F] hover:bg-[#8E3B22] disabled:opacity-60 text-white text-sm font-extrabold"
          >
            {saving ? 'Sending...' : 'Submit review'}
          </button>
        </div>
      </form>
    </div>
  );
};
