import mongoose from 'mongoose';

const CourseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

CourseProgressSchema.index({ user: 1, courseId: 1 }, { unique: true });

export const CourseProgress = mongoose.model('CourseProgress', CourseProgressSchema);
export default CourseProgress;
