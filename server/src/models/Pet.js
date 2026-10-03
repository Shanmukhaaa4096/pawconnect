import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'],
      default: 'Dog',
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number, // in years (decimals allowed, e.g. 0.5 for 6 months)
      required: true,
    },
    ageGroup: {
      type: String,
      enum: ['Baby', 'Young', 'Adult', 'Senior'],
      default: 'Young',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Medium',
    },
    weightKg: {
      type: Number,
      default: 0,
    },
    health: {
      vaccinated: { type: Boolean, default: true },
      spayedNeutered: { type: Boolean, default: true },
      specialNeeds: { type: Boolean, default: false },
      medicalHistory: { type: String, default: 'Up to date with regular veterinary checkups.' },
      microchipped: { type: Boolean, default: true },
    },
    temperament: {
      type: [String],
      default: ['Friendly', 'Playful'],
    },
    goodWith: {
      children: { type: Boolean, default: true },
      dogs: { type: Boolean, default: true },
      cats: { type: Boolean, default: false },
    },
    description: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      required: true,
      default: [],
    },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Adopted'],
      default: 'Available',
    },
    adoptionFee: {
      type: Number,
      default: 50,
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-assign ageGroup before saving if not explicitly set
petSchema.pre('save', function (next) {
  if (this.age !== undefined) {
    if (this.age < 1) this.ageGroup = 'Baby';
    else if (this.age < 3) this.ageGroup = 'Young';
    else if (this.age < 8) this.ageGroup = 'Adult';
    else this.ageGroup = 'Senior';
  }
  next();
});

const Pet = mongoose.model('Pet', petSchema);
export default Pet;
