import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const MilestoneSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  phase: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'in-progress', 'completed'],
    default: 'upcoming',
  },
  tasks: [TaskSchema],
});

const RoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    intake: {
      highestDegree: String,
      fieldOfStudy: String,
      gradYear: String,
      previousJobRole: String,
      yearsOfExperience: String,
      previousIndustry: String,
      breakDuration: String,
      breakReason: String,
      pauseActivities: String,
      targetRole: String,
      preferredWorkType: String,
      weeklyHours: String,
    },
    summary: {
      targetRole: String,
      breakDuration: String,
      workType: String,
      estimatedWeeks: { type: Number, default: 8 },
      weeklyHourCommitment: { type: String, default: '6 - 8 hours/week' },
      projectedReadinessDate: String,
      matchConfidence: { type: Number, default: 85 },
    },
    learningGoals: [String],
    recommendedSkills: [
      {
        name: String,
        priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
        type: String,
      },
    ],
    suggestedCareerPaths: [
      {
        title: String,
        timeline: String,
        fit: String,
        description: String,
      },
    ],
    milestones: [MilestoneSchema],
    isDemo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model('Roadmap', RoadmapSchema);
export default Roadmap;
