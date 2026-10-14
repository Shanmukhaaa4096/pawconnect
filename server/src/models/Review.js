import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    adopter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ application: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
