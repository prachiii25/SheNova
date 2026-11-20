import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Job from './models/Job.js';
import Course from './models/Course.js';
import Mentor from './models/Mentor.js';
import SuccessStory from './models/SuccessStory.js';
import ForumPost from './models/ForumPost.js';
import {
  sampleJobs,
  sampleCourses,
  sampleMentors,
  sampleSuccessStories,
} from './utils/seedData.js';

dotenv.config();

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shenova';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    console.log('MongoDB Connected successfully.');

    // 1. Seed / Upsert Demo User
    const demoEmail = 'ananya.sharma@example.com';
    let user = await User.findOne({ email: demoEmail });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    if (!user) {
      user = await User.create({
        name: 'Ananya Sharma',
        email: demoEmail,
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        careerBreak: {
          duration: '3.5 Years',
          reason: 'Motherhood & Primary Childcare',
          previousRole: 'Product Manager at TechCorp (2018 - 2022)',
          targetRole: 'Senior Product Manager',
          workPreference: 'Remote / Flexible Hours',
          skillsRetained: ['Product Roadmapping', 'User Research', 'Agile/Scrum', 'Stakeholder Alignment'],
          skillsToRefresh: ['AI / LLM Product Strategy', 'Modern Analytics (Mixpanel/Amplitude)', 'System Architecture'],
        },
        progress: {
          roadmapGenerated: true,
          skillAnalysisCompleted: true,
          resumeCompleted: true,
          mockInterviewsCompleted: 2,
          coursesCompleted: 3,
        },
      });
      console.log(`✅ Demo user created: ${demoEmail}`);
    } else {
      user.password = hashedPassword;
      await user.save();
      console.log(`✅ Demo user refreshed: ${demoEmail}`);
    }

    // 2. Seed Jobs (22 listings, flagged as sample data)
    await Job.deleteMany({ isSample: true });
    await Job.insertMany(sampleJobs);
    console.log(`✅ Seeded ${sampleJobs.length} sample job listings (isSample: true)`);

    // 3. Seed Courses (9 listings, flagged as sample data)
    await Course.deleteMany({ isSample: true });
    await Course.insertMany(sampleCourses);
    console.log(`✅ Seeded ${sampleCourses.length} sample courses (isSample: true)`);

    // 4. Seed Mentors (3 profiles, flagged as sample data)
    await Mentor.deleteMany({ isSample: true });
    await Mentor.insertMany(sampleMentors);
    console.log(`✅ Seeded ${sampleMentors.length} sample mentor profiles (isSample: true)`);

    // 5. Seed Success Stories (3 stories, flagged as sample data)
    await SuccessStory.deleteMany({ isSample: true });
    await SuccessStory.insertMany(sampleSuccessStories);
    console.log(`✅ Seeded ${sampleSuccessStories.length} sample success stories (isSample: true)`);

    // 6. Seed Sample Forum Post if none exists
    const forumCount = await ForumPost.countDocuments();
    if (forumCount === 0) {
      await ForumPost.create({
        user: user._id,
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
            user: user._id,
            author: 'Ananya Sharma',
            text: 'Needed this encouragement so much today! Did they bring up salary parity or did you have to negotiate firmly?',
          },
        ],
        isSample: true,
      });
      console.log('✅ Seeded sample forum discussion');
    }

    console.log('\n🎉 [Seed Completed] All sample data successfully loaded into SheNova DB.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    console.warn('\n👉 To seed local MongoDB, ensure your MongoDB server is active:');
    console.warn('   - macOS Homebrew: brew services start mongodb-community');
    console.warn('   - Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.warn('   - Cloud Atlas: set MONGO_URI in server/.env\n');
    process.exit(1);
  }
}

seedDatabase();
