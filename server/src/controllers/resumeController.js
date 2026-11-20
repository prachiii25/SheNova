import Resume from '../models/Resume.js';
import User from '../models/User.js';

export const getResume = async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      // Create sensible default for candidate
      resume = await Resume.create({
        user: req.user._id,
        personal: {
          fullName: req.user.name,
          targetTitle: req.user.careerBreak?.targetRole || 'Senior Product Manager',
          email: req.user.email,
          phone: req.user.phone || '+91 98765 43210',
          location: req.user.location || 'Bengaluru, India (Open to Remote / Hybrid)',
          linkedin: 'linkedin.com/in/returner-profile',
          website: '',
        },
        summary:
          'Strategic professional with 5+ years of prior software delivery experience, returning to the workforce with honed executive resilience and updated expertise in modern digital workflows.',
        careerGap: {
          title: 'Executive Family Leadership & Continuous Upskilling Pause',
          dates: '2022 - 2025',
          reason: req.user.careerBreak?.reason || 'Motherhood & Childcare',
          description:
            'Orchestrated complex family logistics while maintaining dedicated weekly sprints in modern AI product strategy and analytics.',
        },
        experience: [
          {
            id: 1,
            role: 'Product Specialist',
            company: 'TechCorp Solutions',
            location: 'Bengaluru, India',
            period: '2018 - 2022',
            highlights:
              '• Spearheaded cross-functional delivery for flagship enterprise platform.\n• Decreased user churn by 18% through customer discovery interviews.\n• Orchestrated agile sprint cycles and quarterly release milestones.',
          },
        ],
        education: [
          {
            id: 1,
            degree: "Bachelor's Degree in Engineering / Technology",
            institution: 'Premier Institute',
            year: '2016',
            honors: 'First Class with Distinction',
          },
        ],
        skills: [
          'Product Strategy',
          'Generative AI UX Flows',
          'Roadmapping',
          'User Research',
          'Agile/Scrum',
          'Jira Cloud',
          'Mixpanel / PostHog',
        ],
        transferableSkills: [
          {
            title: 'Household Resource & Budget Management',
            desc: 'Managed annual allocation and vendor negotiation.',
          },
        ],
        template: 'modern',
        completeness: 85,
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateResume = async (req, res, next) => {
  try {
    const resumeData = req.body;

    let resume = await Resume.findOne({ user: req.user._id });

    if (resume) {
      Object.assign(resume, resumeData);
      await resume.save();
    } else {
      resume = await Resume.create({
        ...resumeData,
        user: req.user._id,
      });
    }

    // Sync completeness to user profile progress
    if (resume.completeness) {
      await User.findByIdAndUpdate(req.user._id, {
        'progress.resumeCompletion': resume.completeness,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume saved and synced successfully',
      data: resume,
    });
  } catch (err) {
    next(err);
  }
};
