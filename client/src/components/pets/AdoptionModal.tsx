import React, { useState } from 'react';
import { X, CheckCircle, ChevronRight, ChevronLeft, Heart, ShieldCheck, Home, User, Clock, FileText } from 'lucide-react';
import { Pet, ApplicationQuestionnaire } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface AdoptionModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdoptionModal: React.FC<AdoptionModalProps> = ({
  pet,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ApplicationQuestionnaire>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.location?.address || `${user?.location?.city || ''} ${user?.location?.state || ''}`.trim(),
    housingType: 'House with Yard',
    ownership: 'Own',
    hasOtherPets: false,
    otherPetsDetails: '',
    hasChildren: false,
    childrenAges: '',
    hoursAlonePerDay: 3,
    petExperience: 'Experienced Caretaker',
    reasonForAdopting: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (field: keyof ApplicationQuestionnaire, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        setError('Please provide your full name and phone number.');
        return;
      }
    }
    if (step === 3) {
      if (!formData.reasonForAdopting.trim()) {
        setError('Please write a brief note on why you would love to adopt this pet.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.createApplication({
        petId: pet._id,
        questionnaire: formData,
      });
      setIsCompleted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={pet.photos[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
              alt={pet.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Official Adoption Request
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Apply to Adopt {pet.name}
              </h2>
              <p className="text-xs text-slate-300">
                {pet.breed} • {pet.age} yrs old • {pet.location.city}, {pet.location.state}
              </p>
            </div>
          </div>

          {/* Stepper Header (if not completed) */}
          {!isCompleted && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800 text-xs">
              <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
                <User className="w-4 h-4" /> 1. Contact
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
                <Home className="w-4 h-4" /> 2. Home & Lifestyle
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 3 ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
                <Heart className="w-4 h-4" /> 3. Experience & Care
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 4 ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
                <FileText className="w-4 h-4" /> 4. Review
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          )}

          {isCompleted ? (
            /* Success Screen */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Application Submitted!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-slate-900">{formData.fullName}</span>! Your adoption application for <span className="font-semibold text-slate-900">{pet.name}</span> has been routed to the shelter team. You can monitor the review status directly in your dashboard.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/dashboard?tab=applications"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-500 transition-colors shadow-md shadow-orange-600/20"
                >
                  View in My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* STEP 1: CONTACT INFO */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-600" />
                    Applicant Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="e.g. +1 (555) 000-0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Current Residential Address
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g. 123 Maple Street, Apt 4B, Austin, TX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: LIVING & HOME ENVIRONMENT */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Home className="w-5 h-5 text-orange-600" />
                    Living & Household Environment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Housing Type
                      </label>
                      <select
                        value={formData.housingType}
                        onChange={(e) => handleInputChange('housingType', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <option value="House with Yard">House with Yard</option>
                        <option value="House without Yard">House without Yard</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Townhouse/Condo">Townhouse/Condo</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Home Ownership
                      </label>
                      <select
                        value={formData.ownership}
                        onChange={(e) => handleInputChange('ownership', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <option value="Own">Own Home</option>
                        <option value="Rent">Rent (Pet-friendly lease)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasOtherPets}
                        onChange={(e) => handleInputChange('hasOtherPets', e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                      />
                      <span>Do you currently have other animals/pets at home?</span>
                    </label>
                    {formData.hasOtherPets && (
                      <input
                        type="text"
                        value={formData.otherPetsDetails || ''}
                        onChange={(e) => handleInputChange('otherPetsDetails', e.target.value)}
                        placeholder="Please list breeds, species, and ages of your current pets"
                        className="mt-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasChildren}
                        onChange={(e) => handleInputChange('hasChildren', e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                      />
                      <span>Are there children living in or frequently visiting your household?</span>
                    </label>
                    {formData.hasChildren && (
                      <input
                        type="text"
                        value={formData.childrenAges || ''}
                        onChange={(e) => handleInputChange('childrenAges', e.target.value)}
                        placeholder="Ages of children (e.g. 5 and 9)"
                        className="mt-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: EXPERIENCE & DAILY SCHEDULE */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Routine, Experience & Motivation
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Previous Pet Experience
                      </label>
                      <select
                        value={formData.petExperience}
                        onChange={(e) => handleInputChange('petExperience', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <option value="First-time Owner">First-time Owner</option>
                        <option value="Previous Owner">Previous Pet Owner</option>
                        <option value="Experienced Caretaker">Experienced Caretaker</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Est. Hours Pet Will Be Alone Daily
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={formData.hoursAlonePerDay}
                        onChange={(e) => handleInputChange('hoursAlonePerDay', Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Why do you want to adopt {pet.name}? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.reasonForAdopting}
                      onChange={(e) => handleInputChange('reasonForAdopting', e.target.value)}
                      placeholder={`Tell the shelter about your lifestyle, plans for ${pet.name}, and why you feel you would be a great match...`}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SUBMIT */}
              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-orange-600" />
                    Review Your Application Summary
                  </h4>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Applicant:</span>
                      <span className="font-bold text-slate-800">{formData.fullName} ({formData.phone})</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Residence:</span>
                      <span className="font-bold text-slate-800">{formData.housingType} ({formData.ownership})</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Other Pets / Kids:</span>
                      <span className="font-bold text-slate-800">
                        {formData.hasOtherPets ? 'Yes' : 'No'} / {formData.hasChildren ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-slate-500 font-semibold">Experience Level:</span>
                      <span className="font-bold text-slate-800">{formData.petExperience}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block mb-1">Reason for Adopting:</span>
                      <p className="text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200">
                        "{formData.reasonForAdopting}"
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    By submitting, you certify that all information provided is accurate and agree to allow the shelter coordinator to contact your references and verify lease pet policies.
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
