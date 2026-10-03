import React, { useState } from 'react';
import { X, CheckCircle, ChevronRight, ChevronLeft, Heart, ShieldCheck, Home, User, Clock, FileText } from 'lucide-react';
import { Pet, ApplicationQuestionnaire } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { KawaiiPaw, KawaiiSparkle } from '../common/KawaiiIcons';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2B2523]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EDE6DC] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#2B2523] text-white p-6 sm:p-7 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#A89D93] hover:text-white hover:bg-[#3D3531] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={pet.photos[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
              alt={pet.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#FF7E67]/40 shrink-0"
            />
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF9B8A] font-display flex items-center gap-1">
                <KawaiiPaw size={13} fill="#FF9B8A" />
                Adoption Questionnaire
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                Apply to Adopt {pet.name}
              </h2>
              <p className="text-xs text-[#C9BFB5]">
                {pet.breed} • {pet.age} yrs old • {pet.location.city}, {pet.location.state}
              </p>
            </div>
          </div>

          {/* Stepper Header (if not completed) */}
          {!isCompleted && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#3D3531] text-[11px] font-bold">
              <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#FF9B8A]' : 'text-[#7D7268]'}`}>
                <User className="w-3.5 h-3.5" /> 1. Contact
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#FF9B8A]' : 'text-[#7D7268]'}`}>
                <Home className="w-3.5 h-3.5" /> 2. Home
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#FF9B8A]' : 'text-[#7D7268]'}`}>
                <Heart className="w-3.5 h-3.5" /> 3. Experience
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 4 ? 'text-[#FF9B8A]' : 'text-[#7D7268]'}`}>
                <FileText className="w-3.5 h-3.5" /> 4. Review
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FFF0F2] border border-[#FDD5DC] text-[#A62639] text-xs font-bold">
              {error}
            </div>
          )}

          {isCompleted ? (
            /* Success Screen with Kawaii Character Illustration */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#EEF8F5] text-[#1C6C57] border border-[#D1EFE6] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black font-display text-[#2B2523]">
                Application Submitted With Care!
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6159] max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-extrabold text-[#2B2523]">{formData.fullName}</span>! Your adoption questionnaire for <span className="font-extrabold text-[#2B2523]">{pet.name}</span> has been received by the shelter team. You can monitor the review timeline directly in your dashboard.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/dashboard?tab=applications"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FF7E67] hover:bg-[#F26850] text-white font-extrabold text-xs transition-all shadow-md shadow-[#FF7E67]/25"
                >
                  View in My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FAF7F2] text-[#594E46] font-extrabold text-xs hover:bg-[#F2ECE3] transition-colors border border-[#E5DCD0]"
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
                  <h4 className="text-base font-extrabold text-[#2B2523] font-display flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF7E67]" />
                    Applicant Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1 font-display">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1 font-display">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="e.g. +1 (555) 000-0000"
                        className="w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1 font-display">
                      Current Residential Address
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g. 123 Maple Street, Apt 4B, Austin, TX"
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: LIVING & HOME ENVIRONMENT */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-[#2B2523] font-display flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#FF7E67]" />
                    Household & Living Space
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1 font-display">
                        Housing Type
                      </label>
                      <select
                        value={formData.housingType}
                        onChange={(e) => handleInputChange('housingType', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523]"
                      >
                        <option value="House with Yard">House with Yard</option>
                        <option value="House without Yard">House without Yard</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Townhouse/Condo">Townhouse/Condo</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1 font-display">
                        Home Ownership
                      </label>
                      <select
                        value={formData.ownership}
                        onChange={(e) => handleInputChange('ownership', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67] text-[#2B2523]"
                      >
                        <option value="Own">Own Home</option>
                        <option value="Rent">Rent (Pet-friendly lease)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#423730] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasOtherPets}
                        onChange={(e) => handleInputChange('hasOtherPets', e.target.checked)}
                        className="w-4 h-4 text-[#FF7E67] rounded-sm focus:ring-[#FF7E67]"
                      />
                      <span>Do you currently have other animals/pets at home?</span>
                    </label>
                    {formData.hasOtherPets && (
                      <input
                        type="text"
                        value={formData.otherPetsDetails || ''}
                        onChange={(e) => handleInputChange('otherPetsDetails', e.target.value)}
                        placeholder="Please list breeds, species, and ages of your current pets"
                        className="mt-2 w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67]"
                      />
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#423730] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasChildren}
                        onChange={(e) => handleInputChange('hasChildren', e.target.checked)}
                        className="w-4 h-4 text-[#FF7E67] rounded-sm focus:ring-[#FF7E67]"
                      />
                      <span>Are there children living in or frequently visiting your household?</span>
                    </label>
                    {formData.hasChildren && (
                      <input
                        type="text"
                        value={formData.childrenAges || ''}
                        onChange={(e) => handleInputChange('childrenAges', e.target.value)}
                        placeholder="Ages of children (e.g. 4 and 8)"
                        className="mt-2 w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67]"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: EXPERIENCE & MOTIVATION */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-[#2B2523] font-display flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF7E67]" />
                    Routine, Experience & Care
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1 font-display">
                        Previous Pet Experience
                      </label>
                      <select
                        value={formData.petExperience}
                        onChange={(e) => handleInputChange('petExperience', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67]"
                      >
                        <option value="First-time Owner">First-time Pet Companion</option>
                        <option value="Previous Owner">Previous Pet Parent</option>
                        <option value="Experienced Caretaker">Experienced Caretaker</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1 font-display">
                        Est. Hours Pet Will Be Alone Daily
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={formData.hoursAlonePerDay}
                        onChange={(e) => handleInputChange('hoursAlonePerDay', Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#73675F] mb-1 font-display">
                      Why do you want to adopt {pet.name}? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.reasonForAdopting}
                      onChange={(e) => handleInputChange('reasonForAdopting', e.target.value)}
                      placeholder={`Tell the shelter about your lifestyle, plans for ${pet.name}, and why you feel you would be a great match...`}
                      className="w-full px-4 py-2.5 rounded-2xl border border-[#E5DCD0] bg-[#FAF7F2] text-xs sm:text-sm focus:ring-2 focus:ring-[#FF7E67]/20 focus:border-[#FF7E67]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & DECLARATION */}
              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-base font-extrabold text-[#2B2523] font-display flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF7E67]" />
                    Review Application Summary
                  </h4>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DE] text-xs space-y-2">
                    <div className="flex justify-between border-b border-[#E5DCD0]/60 pb-2">
                      <span className="text-[#80746A] font-bold">Applicant:</span>
                      <span className="font-extrabold text-[#2B2523]">{formData.fullName} ({formData.phone})</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E5DCD0]/60 pb-2">
                      <span className="text-[#80746A] font-bold">Living Space:</span>
                      <span className="font-extrabold text-[#2B2523]">{formData.housingType} ({formData.ownership})</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E5DCD0]/60 pb-2">
                      <span className="text-[#80746A] font-bold">Pets / Kids:</span>
                      <span className="font-extrabold text-[#2B2523]">
                        {formData.hasOtherPets ? 'Yes' : 'No'} / {formData.hasChildren ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#E5DCD0]/60 pb-2">
                      <span className="text-[#80746A] font-bold">Experience Level:</span>
                      <span className="font-extrabold text-[#2B2523]">{formData.petExperience}</span>
                    </div>
                    <div>
                      <span className="text-[#80746A] font-bold block mb-1">Reason for Adopting:</span>
                      <p className="text-[#4A3F35] italic bg-white p-2.5 rounded-xl border border-[#E5DCD0]">
                        "{formData.reasonForAdopting}"
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#80746A] leading-relaxed">
                    By submitting, you certify that all information provided is accurate and agree to allow the shelter coordinator to verify veterinary and residential guidelines.
                  </p>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="mt-8 flex items-center justify-between border-t border-[#F4EFE8] pt-5">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-[#E0D7CC] text-xs font-bold text-[#594E46] hover:bg-[#FAF7F2] transition-colors"
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
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#FF7E67] hover:bg-[#F26850] text-white text-xs font-bold transition-all shadow-md shadow-[#FF7E67]/25"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-7 py-3 rounded-2xl bg-[#54B499] hover:bg-[#439C83] text-white text-xs font-bold transition-all shadow-md shadow-[#54B499]/25 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Confirm & Submit Application'}
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
