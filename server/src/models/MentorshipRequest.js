import mongoose from 'mongoose';

const MentorshipRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mentorName: { type: String, required: true },
    topic: {
      type: String,
      required: true,
      enum: [
        'Resume & Gap Narrative Review',
        'Technical / Coding Whiteboard Prep',
        'Salary Negotiation & Title Protection',
        'Executive Presence & Confidence Coaching',
        'Work-Life Orchestration & Childcare Balance',
      ],
    },
    message: { type: String, required: true },
    preferredTime: { type: String, default: 'Flexible' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const MentorshipRequest = mongoose.model('MentorshipRequest', MentorshipRequestSchema);
export default MentorshipRequest;
