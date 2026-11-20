import Roadmap from '../models/Roadmap.js';
import { isDbConnected, devRoadmaps } from '../utils/devStore.js';

const getDefaultMilestones = () => [
  {
    id: 1,
    phase: 'Phase 1: Week 1 - 2',
    title: 'Self-Audit & Transferable Competency Mapping',
    description: 'Catalogue previous accomplishments and frame caregiving as active leadership.',
    status: 'completed',
    tasks: [
      { text: 'List top 5 accomplishments from previous career', done: true },
      { text: 'Draft 3-bullet pause explanation focusing on crisis triage & budget management', done: true },
      { text: 'Establish weekly 6-hour distraction-free learning window', done: true },
    ],
  },
  {
    id: 2,
    phase: 'Phase 2: Week 3 - 4',
    title: 'Modern Stack Delta Refresh & AI Tooling',
    description: 'Hands-on sprint bridging the gap between past methodologies and 2026 AI-augmented workflows.',
    status: 'in-progress',
    tasks: [
      { text: 'Complete "GenAI for Product & Tech Leaders" micro-course', done: true },
      { text: 'Familiarize with modern analytics (Mixpanel, PostHog, or Supabase)', done: false },
      { text: 'Build 1 practical prompt-flow diagram artifact', done: false },
    ],
  },
  {
    id: 3,
    phase: 'Phase 3: Week 5 - 6',
    title: 'Break-Friendly Resume & Portfolio Architecture',
    description: 'Craft an ATS-optimized functional resume that highlights continuous learning over calendar gaps.',
    status: 'upcoming',
    tasks: [
      { text: 'Generate gap reframing statement with AI Resume Architect', done: false },
      { text: 'Audit resume keyword density against 10 target returnship job descriptions', done: false },
      { text: 'Publish refreshed LinkedIn profile with "Open to Returnships" badge', done: false },
    ],
  },
  {
    id: 4,
    phase: 'Phase 4: Week 7 - 8',
    title: 'AI Mock Interviews & Returnship Placement',
    description: 'Simulate behavioral panels, tackle return-to-work scenario questions, and submit applications.',
    status: 'upcoming',
    tasks: [
      { text: 'Complete 3 AI Voice Mock Interview rounds with >80% confidence score', done: false },
      { text: 'Submit applications to 3 vetted corporate returnship partner listings', done: false },
      { text: 'Connect with a SheNova Sisterhood mentor for warm referral review', done: false },
    ],
  },
];

export const getRoadmap = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const userId = req.user._id?.toString?.() || req.user._id;
      const roadmap = devRoadmaps.get(userId) || null;
      return res.status(200).json({
        success: true,
        data: roadmap,
        demoMode: true,
      });
    }

    const roadmap = await Roadmap.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

    if (!roadmap) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active roadmap found for user.',
      });
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateRoadmap = async (req, res, next) => {
  try {
    const intake = req.body;
    const targetRole = intake.targetRole || req.user.careerBreak?.targetRole || 'Senior Product Specialist';
    const breakDuration = intake.breakDuration || req.user.careerBreak?.duration || '2 - 4 years';
    const workType = intake.preferredWorkType || 'Remote / Flexible Hybrid';

    const defaultMilestones = getDefaultMilestones();

    const learningGoals = [
      'Bridge technology tooling shift from legacy stacks to modern cloud/AI workflows.',
      'Refocus narrative from pause length to transferable executive problem-solving.',
      'Build 2 concrete portfolio artifacts addressing 2026 industry standards.',
      'Complete voice-based scenario rehearsals for tough returner interview questions.',
    ];

    const recommendedSkills = [
      { name: 'Generative AI User Flow & Prompt Architecture', priority: 'High', type: 'Emerging' },
      { name: 'Async Collaboration & Modern Jira Cloud', priority: 'Medium', type: 'Tooling Refresh' },
      { name: 'Product Discovery & Metric Instrumentation', priority: 'High', type: 'Core Skill' },
      { name: 'Returner Leadership Narrative & Executive Presence', priority: 'High', type: 'Soft Skill' },
    ];

    const suggestedCareerPaths = [
      {
        title: `${targetRole} - Returnship Cohort`,
        timeline: 'Month 1 - 6 (Ramp Up)',
        fit: '94% Fit',
        description: 'Supported onboarding track with designated sponsor and gradual ramp in responsibilities.',
      },
      {
        title: `Direct Hire: ${targetRole}`,
        timeline: 'Direct Entry',
        fit: '85% Fit',
        description: 'For returners seeking immediate full-time placement with flexible hybrid options.',
      },
      {
        title: 'Contract-to-Hire Transition Specialist',
        timeline: '3 - 6 Months',
        fit: '88% Fit',
        description: 'Lower initial barrier, offering high hourly flexibility with conversion pathways.',
      },
    ];

    if (!isDbConnected()) {
      const userId = req.user._id?.toString?.() || req.user._id;
      const existing = devRoadmaps.get(userId);
      const roadmap = {
        _id: existing?._id || 'rdm-' + Date.now(),
        user: req.user._id,
        intake,
        summary: {
          targetRole,
          breakDuration,
          workType,
          estimatedWeeks: 8,
          weeklyHourCommitment: intake.weeklyHours || '8 - 10 hours/week',
          projectedReadinessDate: '8 Weeks from Start',
          matchConfidence: 89,
        },
        learningGoals,
        recommendedSkills,
        suggestedCareerPaths,
        milestones: existing?.milestones || defaultMilestones,
        isDemo: true,
        demoMode: true,
        updatedAt: new Date().toISOString(),
      };
      devRoadmaps.set(userId, roadmap);
      return res.status(201).json({
        success: true,
        message: 'Roadmap generated and calibrated successfully',
        data: roadmap,
        demoMode: true,
      });
    }

    let roadmap = await Roadmap.findOne({ user: req.user._id });

    if (roadmap) {
      roadmap.intake = intake;
      roadmap.summary = {
        targetRole,
        breakDuration,
        workType,
        estimatedWeeks: 8,
        weeklyHourCommitment: intake.weeklyHours || '8 - 10 hours/week',
        projectedReadinessDate: '8 Weeks from Start',
        matchConfidence: 89,
      };
      roadmap.learningGoals = learningGoals;
      roadmap.recommendedSkills = recommendedSkills;
      roadmap.suggestedCareerPaths = suggestedCareerPaths;
      if (!roadmap.milestones || roadmap.milestones.length === 0) {
        roadmap.milestones = defaultMilestones;
      }
      await roadmap.save();
    } else {
      roadmap = await Roadmap.create({
        user: req.user._id,
        intake,
        summary: {
          targetRole,
          breakDuration,
          workType,
          estimatedWeeks: 8,
          weeklyHourCommitment: intake.weeklyHours || '8 - 10 hours/week',
          projectedReadinessDate: '8 Weeks from Start',
          matchConfidence: 89,
        },
        learningGoals,
        recommendedSkills,
        suggestedCareerPaths,
        milestones: defaultMilestones,
        isDemo: true,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Roadmap generated and calibrated successfully',
      data: roadmap,
    });
  } catch (err) {
    next(err);
  }
};

export const updateRoadmapTask = async (req, res, next) => {
  try {
    const { milestoneId, taskIndex } = req.body;

    if (!isDbConnected()) {
      const userId = req.user._id?.toString?.() || req.user._id;
      let roadmap = devRoadmaps.get(userId);
      if (!roadmap) {
        roadmap = {
          _id: 'rdm-' + Date.now(),
          user: req.user._id,
          milestones: getDefaultMilestones(),
        };
        devRoadmaps.set(userId, roadmap);
      }
      const milestone = roadmap.milestones.find((m) => m.id === Number(milestoneId));
      if (!milestone || !milestone.tasks[taskIndex]) {
        return res.status(400).json({ success: false, message: 'Invalid milestone or task reference.' });
      }
      milestone.tasks[taskIndex].done = !milestone.tasks[taskIndex].done;
      const allDone = milestone.tasks.every((t) => t.done);
      const someDone = milestone.tasks.some((t) => t.done);
      milestone.status = allDone ? 'completed' : someDone ? 'in-progress' : 'upcoming';

      return res.status(200).json({
        success: true,
        message: 'Task status updated successfully',
        data: roadmap,
        demoMode: true,
      });
    }

    const roadmap = await Roadmap.findOne({ user: req.user._id });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'No roadmap found for user.' });
    }

    const milestone = roadmap.milestones.find((m) => m.id === Number(milestoneId));
    if (!milestone || !milestone.tasks[taskIndex]) {
      return res.status(400).json({ success: false, message: 'Invalid milestone or task reference.' });
    }

    milestone.tasks[taskIndex].done = !milestone.tasks[taskIndex].done;

    const allDone = milestone.tasks.every((t) => t.done);
    const someDone = milestone.tasks.some((t) => t.done);
    milestone.status = allDone ? 'completed' : someDone ? 'in-progress' : 'upcoming';

    await roadmap.save();

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: roadmap,
    });
  } catch (err) {
    next(err);
  }
};
