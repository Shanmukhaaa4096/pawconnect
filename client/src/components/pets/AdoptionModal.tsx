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
        setError('Please provide your full name and phone number (｡•́︿•̀｡)');
        return;
      }
    }
    if (step === 3) {
      if (!formData.reasonForAdopting.trim()) {
        setError('Please write a brief note on why you would love to adopt this adorable pet! 🐾');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D2438]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl shadow-2xl border-2 border-[#FFC6D9] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2D2438] via-[#3D3050] to-[#2D2438] text-white p-6 sm:p-7 relative border-b border-[#F0E6F4]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#A89AB8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={pet.photos[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
              alt={pet.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#FFC6D9] shrink-0"
            />
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#FFC6D9] flex items-center gap-1.5">
                <KawaiiPaw className="w-3.5 h-3.5" />
                Adoption Questionnaire
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Apply to Adopt {pet.name}
              </h2>
              <p className="text-xs text-[#D8CCE6]">
                {pet.breed} • {pet.age} yrs old • {pet.location.city}, {pet.location.state}
              </p>
            </div>
          </div>

          {/* Stepper Header (if not completed) */}
          {!isCompleted && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 text-[11px] font-black">
              <span className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#FF8DA1]' : 'text-[#8E7F9B]'}`}>
                <User className="w-3.5 h-3.5" /> 1. Contact
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#FF8DA1]' : 'text-[#8E7F9B]'}`}>
                <Home className="w-3.5 h-3.5" /> 2. Home
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#FF8DA1]' : 'text-[#FF8DA1]'}`}>
                <Heart className="w-3.5 h-3.5" /> 3. Experience
              </span>
              <span className={`flex items-center gap-1.5 ${step >= 4 ? 'text-[#FF8DA1]' : 'text-[#8E7F9B]'}`}>
                <FileText className="w-3.5 h-3.5" /> 4. Review
              </span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 bg-[#FFF9F2]/50">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FFE4EC] border border-[#FFC6D9] text-[#9E3360] text-xs font-black">
              {error}
            </div>
          )}

          {isCompleted ? (
            /* Success Screen with Kawaii Character Illustration */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#EDFAF4] text-[#059669] border border-[#CFF5E7] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-[#493D50]">
                Application Submitted With Love! (✿◠‿◠)
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6B88] max-w-md mx-auto leading-relaxed font-medium">
                Thank you, <span className="font-black text-[#493D50]">{formData.fullName}</span>! Your adoption questionnaire for <span className="font-black text-[#493D50]">{pet.name}</span> has been received by the shelter team. You can monitor the review timeline directly in your dashboard.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/dashboard?tab=applications"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF6584] to-[#FF8DA1] hover:from-[#F24E71] hover:to-[#FF7893] text-white font-black text-xs transition-all shadow-md shadow-[#FF6584]/25"
                >
                  View in My Dashboard
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FAF5EE] text-[#6D5D77] font-black text-xs hover:bg-[#F0E6F4] transition-colors border border-[#F0E6F4]"
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
                  <h4 className="text-base font-black text-[#493D50] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF6584]" />
                    Applicant Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#7A6B88] mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="kawaii-input text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#7A6B88] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="e.g. +1 (555) 000-0000"
                        className="kawaii-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#7A6B88] mb-1">
                      Current Residential Address
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g. 123 Maple Street, Apt 4B, Austin, TX"
                      className="kawaii-input text-xs sm:text-sm"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: LIVING & HOME ENVIRONMENT */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-base font-black text-[#493D50] flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#FF6584]" />
                    Household & Living Space
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#7A6B88] mb-1">
                        Housing Type
                      </label>
                      <select
                        value={formData.housingType}
                        onChange={(e) => handleInputChange('housingType', e.target.value)}
                        className="kawaii-input text-xs sm:text-sm"
                      >
                        <option value="House with Yard">House with Yard</option>
                        <option value="House without Yard">House without Yard</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Townhouse/Condo">Townhouse/Condo</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#7A6B88] mb-1">
                        Home Ownership
                      </label>
                      <select
                        value={formData.ownership}
                        onChange={(e) => handleInputChange('ownership', e.target.value)}
                        className="kawaii-input text-xs sm:text-sm"
                      >
                        <option value="Own">Own Home</option>
                        <option value="Rent">Rent (Pet-friendly lease)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#493D50] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasOtherPets}
                        onChange={(e) => handleInputChange('hasOtherPets', e.target.checked)}
                        className="w-4 h-4 text-[#FF6584] rounded-sm focus:ring-[#FF6584] accent-[#FF6584]"
                      />
                      <span>Do you currently have other animals/pets at home?</span>
                    </label>
                    {formData.hasOtherPets && (
                      <input
                        type="text"
                        value={formData.otherPetsDetails || ''}
                        onChange={(e) => handleInputChange('otherPetsDetails', e.target.value)}
                        placeholder="Please list breeds, species, and ages of your current pets"
                        className="mt-2 kawaii-input text-xs sm:text-sm"
                      />
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#493D50] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasChildren}
                        onChange={(e) => handleInputChange('hasChildren', e.target.checked)}
                        className="w-4 h-4 text-[#FF6584] rounded-sm focus:ring-[#FF6584] accent-[#FF6584]"
                      />
                      <span>Are there children living in or frequently visiting your household?</span>
                    </label>
                    {formData.hasChildren && (
                      <input
                        type="text"
                        value={formData.childrenAges || ''}
                        onChange={(e) => handleInputChange('childrenAges', e.target.value)}
                        placeholder="Ages of children (e.g. 4 and 8)"
                        className="mt-2 kawaii-input text-xs sm:text-sm"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: EXPERIENCE & MOTIVATION */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-base font-black text-[#493D50] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF6584]" />
                    Routine, Experience & Care
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#7A6B88] mb-1">
                        Previous Pet Experience
                      </label>
                      <select
                        value={formData.petExperience}
                        onChange={(e) => handleInputChange('petExperience', e.target.value)}
                        className="kawaii-input text-xs sm:text-sm"
                      >
                        <option value="First-time Owner">First-time Pet Companion</option>
                        <option value="Previous Owner">Previous Pet Parent</option>
                        <option value="Experienced Caretaker">Experienced Caretaker</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-[#7A6B88] mb-1">
                        Est. Hours Pet Will Be Alone Daily
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={formData.hoursAlonePerDay}
                        onChange={(e) => handleInputChange('hoursAlonePerDay', Number(e.target.value))}
                        className="kawaii-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#7A6B88] mb-1">
                      Why do you want to adopt {pet.name}? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.reasonForAdopting}
                      onChange={(e) => handleInputChange('reasonForAdopting', e.target.value)}
                      placeholder={`Tell the shelter about your lifestyle, plans for ${pet.name}, and why you feel you would be a great match...`}
                      className="kawaii-input text-xs sm:text-sm"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & DECLARATION */}
              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-base font-black text-[#493D50] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF6584]" />
                    Review Application Summary
                  </h4>

                  <div className="bg-[#FAF5EE] p-4 rounded-2xl border border-[#F0E6F4] text-xs space-y-2">
                    <div className="flex justify-between border-b border-[#F0E6F4] pb-2">
                      <span className="text-[#8E7F9B] font-bold">Applicant:</span>
                      <span className="font-black text-[#493D50]">{formData.fullName} ({formData.phone})</span>
                    </div>
                    <div className="flex justify-between border-b border-[#F0E6F4] pb-2">
                      <span className="text-[#8E7F9B] font-bold">Living Space:</span>
                      <span className="font-black text-[#493D50]">{formData.housingType} ({formData.ownership})</span>
                    </div>
                    <div className="flex justify-between border-b border-[#F0E6F4] pb-2">
                      <span className="text-[#8E7F9B] font-bold">Pets / Kids:</span>
                      <span className="font-black text-[#493D50]">
                        {formData.hasOtherPets ? 'Yes' : 'No'} / {formData.hasChildren ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#F0E6F4] pb-2">
                      <span className="text-[#8E7F9B] font-bold">Experience Level:</span>
                      <span className="font-black text-[#493D50]">{formData.petExperience}</span>
                    </div>
                    <div>
                      <span className="text-[#8E7F9B] font-bold block mb-1">Reason for Adopting:</span>
                      <p className="text-[#5E5068] italic bg-white p-3 rounded-xl border border-[#F0E6F4]">
                        "{formData.reasonForAdopting}"
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#8E7F9B] leading-relaxed">
                    By submitting, you certify that all information provided is accurate and agree to allow the shelter coordinator to verify veterinary and residential guidelines.
                  </p>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="mt-8 flex items-center justify-between border-t border-[#F0E6F4] pt-5">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="kawaii-btn-secondary py-2.5 px-4 text-xs inline-flex items-center gap-1.5"
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
                    className="kawaii-btn py-2.5 px-6 text-xs inline-flex items-center gap-1.5"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#059669] to-[#10B981] hover:from-[#047857] hover:to-[#059669] text-white text-xs font-black transition-all shadow-md shadow-[#059669]/25 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Confirm & Submit Application 🐾'}
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
