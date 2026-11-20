import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    jobId: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    workMode: {
      type: String,
      enum: ['Remote', 'Work-from-home', 'Flexible', 'Onsite', 'Hybrid'],
      default: 'Flexible',
    },
    type: {
      type: String,
      enum: ['Returnship', 'Flexible', 'Part-time', 'Internship', 'Full-time'],
      default: 'Returnship',
    },
    experience: { type: String, default: '3-5 years' },
    breakEligibility: { type: String, default: 'Open to 1+ years break' },
    stipend: { type: String, required: true },
    postedDate: { type: String, default: 'Recently' },
    matchScore: { type: Number, default: 90 },
    tags: [String],
    description: { type: String, required: true },
    eligibility: [String],
    responsibilities: [String],
    perks: [String],
    isSample: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', JobSchema);
export default Job;
