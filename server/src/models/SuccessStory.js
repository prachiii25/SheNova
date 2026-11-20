import mongoose from 'mongoose';

const SuccessStorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    breakDuration: { type: String, required: true },
    previousRole: { type: String, required: true },
    returnedRole: { type: String, required: true },
    quote: { type: String, required: true },
    advice: { type: String, required: true },
    avatar: String,
    isSample: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SuccessStory = mongoose.model('SuccessStory', SuccessStorySchema);
export default SuccessStory;
