import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidateDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      breakStatement: String,
      coverNote: String,
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'interview_scheduled', 'accepted', 'declined'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

// Prevent duplicate application to same job by same user
JobApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

export const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);
export default JobApplication;
