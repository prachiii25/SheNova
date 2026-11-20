import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  id: Number,
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  period: { type: String, required: true },
  highlights: { type: String, required: true },
});

const EducationSchema = new mongoose.Schema({
  id: Number,
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, required: true },
  honors: String,
});

const TransferableSkillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One primary resume per returner
      index: true,
    },
    personal: {
      fullName: { type: String, required: true },
      targetTitle: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      location: String,
      linkedin: String,
      website: String,
    },
    summary: { type: String, required: true },
    careerGap: {
      title: { type: String, default: 'Executive Family Leadership & Continuous Upskilling Pause' },
      dates: { type: String, default: '2022 - 2025' },
      reason: { type: String, default: 'Motherhood & Primary Childcare' },
      description: { type: String, required: true },
    },
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [String],
    transferableSkills: [TransferableSkillSchema],
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal'],
      default: 'modern',
    },
    completeness: {
      type: Number,
      default: 85,
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;
