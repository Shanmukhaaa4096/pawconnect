import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    adopter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
      default: 'Pending',
    },
    questionnaire: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: '' },
      housingType: {
        type: String,
        enum: ['Apartment', 'House with Yard', 'House without Yard', 'Townhouse/Condo', 'Other'],
        default: 'Apartment',
      },
      ownership: {
        type: String,
        enum: ['Own', 'Rent'],
        default: 'Rent',
      },
      hasOtherPets: { type: Boolean, default: false },
      otherPetsDetails: { type: String, default: '' },
      hasChildren: { type: Boolean, default: false },
      childrenAges: { type: String, default: '' },
      hoursAlonePerDay: { type: Number, default: 4 },
      petExperience: {
        type: String,
        enum: ['First-time Owner', 'Previous Owner', 'Experienced Caretaker'],
        default: 'Experienced Caretaker',
      },
      reasonForAdopting: { type: String, required: true },
    },
    shelterNotes: {
      type: String,
      default: '',
    },
    timeline: [
      {
        status: { type: String, required: true },
        date: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
