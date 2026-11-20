import mongoose from 'mongoose';

const SkillComparisonItemSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  category: String,
  currentScore: Number,
  requiredScore: Number,
  status: { type: String, enum: ['strong', 'outdated', 'missing'], default: 'strong' },
  note: String,
});

const FlaggedGapSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  type: String,
  severity: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  reason: String,
  action: String,
});

const UpskillingPhaseSchema = new mongoose.Schema({
  phase: String,
  focus: String,
  timeEstimate: String,
  items: [String],
});

const SkillAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetRole: { type: String, required: true },
    breakDuration: { type: String, default: '2 - 4 years' },
    previousSkills: { type: String, required: true },
    matchScore: { type: Number, default: 75 },
    skillsSummary: {
      totalEvaluated: Number,
      strongMatchCount: Number,
      deltaRefreshCount: Number,
      criticalMissingCount: Number,
    },
    skillsComparison: [SkillComparisonItemSchema],
    flaggedGaps: [FlaggedGapSchema],
    recommendedCourses: [
      {
        id: String,
        title: String,
        provider: String,
        duration: String,
        level: String,
        format: String,
        link: String,
      },
    ],
    stepByStepUpskillingPlan: [UpskillingPhaseSchema],
    isDemo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SkillAnalysis = mongoose.model('SkillAnalysis', SkillAnalysisSchema);
export default SkillAnalysis;
