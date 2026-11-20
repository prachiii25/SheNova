import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema(
  {
    mentorId: { type: String, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    avatar: String,
    expertise: [String],
    bio: { type: String, required: true },
    availability: { type: String, default: 'Available for sessions' },
    isSample: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Mentor = mongoose.model('Mentor', MentorSchema);
export default Mentor;
