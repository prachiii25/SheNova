import mongoose from 'mongoose';
import {
  sampleJobs,
  sampleCourses,
  sampleMentors,
  sampleSuccessStories,
} from './seedData.js';

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const devJobs = sampleJobs.map((j) => ({
  ...j,
  _id: j.jobId,
}));

export const devCourses = sampleCourses.map((c) => ({
  ...c,
  _id: 'course-' + c.courseId,
}));

export const devMentors = sampleMentors.map((m) => ({
  ...m,
  _id: m.mentorId,
}));

export const devSuccessStories = sampleSuccessStories.map((s, idx) => ({
  ...s,
  _id: 'story-' + (idx + 1),
}));

export const devForumPosts = [
  {
    _id: 'post-1',
    author: 'Rohini Deshmukh',
    role: 'Returned after 4 yrs • Now Tech Lead at FinTech',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    category: 'Success & Offer Negotiation',
    title: 'Just signed my returnship offer letter! Here is what worked for me',
    content:
      'To any sister reading this who feels invisible after a baby break: your experience is so valuable. During interviews, whenever they asked about my 4-year pause, I spoke about household budget management, crisis triage, and continuous learning. Do not apologize for your break!',
    cheers: 42,
    cheeredBy: [],
    replies: [
      {
        author: 'Ananya Sharma',
        text: 'Needed this encouragement so much today! Did they bring up salary parity or did you have to negotiate firmly?',
        createdAt: new Date().toISOString(),
      },
    ],
    isSample: true,
    createdAt: new Date().toISOString(),
  },
];

export const devMentorshipRequests = [];
export const devSavedJobs = [];
export const devJobApplications = [];
export const devRoadmaps = new Map();
export const devResumes = new Map();
export const devSkillAnalyses = new Map();
export const devCourseProgress = new Map();
export const devInterviewSessions = new Map();
