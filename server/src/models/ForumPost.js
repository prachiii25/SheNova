import mongoose from 'mongoose';

const ForumReplySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const ForumPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    author: { type: String, required: true },
    role: { type: String, default: 'Returner Candidate' },
    avatar: String,
    category: {
      type: String,
      enum: [
        'Career Restart Advice',
        'Interview Preparation',
        'Success & Offer Negotiation',
        'Parenting & Work-Life Balance',
        'Learning & Upskilling Cohorts',
      ],
      default: 'Career Restart Advice',
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    cheers: { type: Number, default: 0 },
    cheeredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [ForumReplySchema],
    isSample: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ForumPost = mongoose.model('ForumPost', ForumPostSchema);
export default ForumPost;
