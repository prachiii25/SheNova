import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: Number,
  category: String,
  question: { type: String, required: true },
  contextTip: String,
  idealKeywords: [String],
});

const AnswerRecordSchema = new mongoose.Schema({
  question: QuestionSchema,
  answer: { type: String, required: true },
  feedback: {
    scores: {
      communication: Number,
      relevance: Number,
      confidence: Number,
      overall: Number,
    },
    strengths: [String],
    improvements: [String],
    suggestedAnswer: String,
  },
  timeTaken: Number,
});

const InterviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['warm', 'standard', 'rigorous'],
      default: 'standard',
    },
    questions: [QuestionSchema],
    answersHistory: [AnswerRecordSchema],
    report: {
      overallScore: Number,
      scores: {
        communication: Number,
        relevance: Number,
        confidence: Number,
        technicalAgility: Number,
      },
      summary: String,
      strengths: [String],
      growthAreas: [String],
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
    isDemo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const InterviewSession = mongoose.model('InterviewSession', InterviewSessionSchema);
export default InterviewSession;
