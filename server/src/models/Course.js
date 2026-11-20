import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    courseId: { type: Number, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Technology', 'Communication', 'Business', 'Professional Development'],
      required: true,
    },
    level: { type: String, default: 'Beginner Friendly' },
    duration: { type: String, required: true },
    provider: { type: String, default: 'SheNova Learning Hub' },
    isRecommendedGap: { type: Boolean, default: false },
    description: { type: String, required: true },
    isSample: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', CourseSchema);
export default Course;
