import Course from '../models/Course.js';
import CourseProgress from '../models/CourseProgress.js';
import User from '../models/User.js';
import { isDbConnected, devCourses, devCourseProgress } from '../utils/devStore.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const { category, recommended } = req.query;

    if (!isDbConnected()) {
      let courses = [...devCourses];
      if (category && category !== 'All') {
        courses = courses.filter((c) => c.category === category);
      }
      if (recommended === 'true') {
        courses = courses.filter((c) => c.isRecommendedGap);
      }

      const userId = req.user?._id?.toString?.() || req.user?._id;
      const userProgress = userId ? (devCourseProgress.get(userId) || {}) : {};

      const enriched = courses.map((c) => ({
        ...c,
        userProgress: userProgress[c.courseId]?.progress || 0,
        isCompleted: userProgress[c.courseId]?.completed || false,
      }));

      return res.status(200).json({
        success: true,
        count: enriched.length,
        data: enriched,
        demoMode: true,
      });
    }

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (recommended === 'true') {
      filter.isRecommendedGap = true;
    }

    const courses = await Course.find(filter).sort({ courseId: 1 });

    let userProgressMap = {};
    if (req.user) {
      const userProgress = await CourseProgress.find({ user: req.user._id });
      userProgress.forEach((p) => {
        userProgressMap[p.courseId] = {
          progress: p.progress,
          completed: p.completed,
          lastAccessed: p.lastAccessed,
        };
      });
    }

    const enrichedCourses = courses.map((course) => {
      const prog = userProgressMap[course.courseId];
      return {
        ...course.toObject(),
        userProgress: prog ? prog.progress : 0,
        isCompleted: prog ? prog.completed : false,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedCourses.length,
      data: enrichedCourses,
    });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);

    if (!isDbConnected()) {
      const course = devCourses.find((c) => c.courseId === courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found.' });
      }
      const userId = req.user?._id?.toString?.() || req.user?._id;
      const userProgress = userId ? (devCourseProgress.get(userId) || {}) : {};
      return res.status(200).json({
        success: true,
        data: {
          ...course,
          userProgress: userProgress[courseId]?.progress || 0,
          isCompleted: userProgress[courseId]?.completed || false,
        },
        demoMode: true,
      });
    }

    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    let userProgress = 0;
    let isCompleted = false;

    if (req.user) {
      const prog = await CourseProgress.findOne({ user: req.user._id, courseId });
      if (prog) {
        userProgress = prog.progress;
        isCompleted = prog.completed;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        userProgress,
        isCompleted,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserProgress = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const userId = req.user._id?.toString?.() || req.user._id;
      const userProgress = devCourseProgress.get(userId) || {};
      const list = Object.values(userProgress);
      return res.status(200).json({
        success: true,
        count: list.length,
        data: list,
        demoMode: true,
      });
    }

    const progressList = await CourseProgress.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      count: progressList.length,
      data: progressList,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCourseProgress = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);
    const { progress } = req.body;

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number between 0 and 100.',
      });
    }

    const completed = progress === 100;

    if (!isDbConnected()) {
      const userId = req.user._id?.toString?.() || req.user._id;
      if (!devCourseProgress.has(userId)) {
        devCourseProgress.set(userId, {});
      }
      const userProgMap = devCourseProgress.get(userId);
      const updated = {
        courseId,
        progress,
        completed,
        lastAccessed: new Date().toISOString(),
      };
      userProgMap[courseId] = updated;

      return res.status(200).json({
        success: true,
        message: 'Course progress updated successfully',
        data: updated,
        demoMode: true,
      });
    }

    const updated = await CourseProgress.findOneAndUpdate(
      { user: req.user._id, courseId },
      {
        progress,
        completed,
        lastAccessed: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const completedCount = await CourseProgress.countDocuments({
      user: req.user._id,
      completed: true,
    });

    await User.findByIdAndUpdate(req.user._id, {
      'progress.coursesCompleted': completedCount,
    });

    res.status(200).json({
      success: true,
      message: 'Course progress updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
