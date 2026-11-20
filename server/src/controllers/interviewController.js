import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.js';

export const getMyInterviewSessions = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (err) {
    next(err);
  }
};

export const startInterviewSession = async (req, res, next) => {
  try {
    const { role, difficulty } = req.body;
    const targetRole = role || req.user.careerBreak?.targetRole || 'Senior Product Manager';

    const sampleQuestions = [
      {
        id: 1,
        category: 'Career Gap Reframing',
        question:
          'Could you tell us about your career pause and how you maintained professional momentum and transferable leadership during this time?',
        contextTip:
          'Recruiters look for self-assurance, positive framing, and quantifiable self-directed learning.',
        idealKeywords: ['resilience', 'triage', 'continuous learning', 'upskilling', 'family leadership'],
      },
      {
        id: 2,
        category: 'Technological & Tooling Agility',
        question:
          'Tools and workflows evolved rapidly in recent years. How have you updated your fluency with generative AI, modern cloud platforms, or current analytics stacks?',
        contextTip:
          'Cite specific hands-on sprints, courses, or micro-projects completed on SheNova or independently.',
        idealKeywords: ['GenAI', 'automation', 'hands-on', 'modern workflows', 'agility'],
      },
      {
        id: 3,
        category: 'Cross-Functional Stakeholder Alignment',
        question:
          'Describe a situation where engineering, design, and business leadership had competing priorities. How did you negotiate alignment and drive execution?',
        contextTip:
          'Demonstrate structured decision frameworks and empathetic negotiation honed through real-world life experience.',
        idealKeywords: ['prioritization', 'trade-offs', 'data-driven', 'consensus', 'clear communication'],
      },
      {
        id: 4,
        category: 'Work-Life Prioritization & Resilience',
        question:
          'Returning to the workforce requires orchestrating professional deliverables alongside personal commitments. How do you structure your focus and boundaries to prevent burnout?',
        contextTip:
          'Highlight asynchronous efficiency, calendar blocking, and proactive team communication.',
        idealKeywords: ['asynchronous', 'boundaries', 'calendar blocking', 'proactive', 'ownership'],
      },
      {
        id: 5,
        category: 'Strategic Vision & Impact',
        question:
          'In your first 90 days in this returnship role, how will you identify high-leverage opportunities to deliver value while getting up to speed with the team?',
        contextTip:
          'Show a humble yet proactive 30-60-90 day orientation plan: Listen, Learn, Align, Deliver.',
        idealKeywords: ['listen first', 'quick wins', 'stakeholder interviews', 'metrics', 'collaboration'],
      },
    ];

    const session = await InterviewSession.create({
      user: req.user._id,
      role: targetRole,
      difficulty: difficulty || 'standard',
      questions: sampleQuestions,
      answersHistory: [],
      status: 'in-progress',
      isDemo: true,
    });

    res.status(201).json({
      success: true,
      message: 'Interview session initialized with 5 scenario questions',
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answer, timeTaken } = req.body;
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const question = session.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ success: false, message: 'Invalid question index.' });
    }

    const length = (answer || '').trim().length;
    const commScore = Math.min(95, Math.max(70, Math.round(75 + length / 35)));
    const relScore = Math.min(96, Math.max(72, Math.round(78 + length / 40)));
    const confScore = Math.min(92, Math.max(68, Math.round(74 + length / 45)));

    const feedback = {
      scores: {
        communication: commScore,
        relevance: relScore,
        confidence: confScore,
        overall: Math.round((commScore + relScore + confScore) / 3),
      },
      strengths: [
        'Dignified and articulate framing of career pause responsibilities.',
        'Good balance of prior foundational depth with recent learning sprints.',
        'High degree of self-assurance and clarity in delivery.',
      ],
      improvements: [
        'Anchor your achievements with specific metrics or quantitative milestones.',
        'Conclude with direct relevance to de-risking hiring managers deliverables.',
      ],
      suggestedAnswer:
        '“During my 3.5-year career pause for family caregiving, I dedicated 8 hours weekly to AI product roadmapping and analytics certifications. Managing complex household operations sharpened my triage, crisis de-escalation, and budget discipline—qualities that directly complement my prior 5+ years of software delivery.”',
    };

    session.answersHistory.push({
      question,
      answer,
      feedback,
      timeTaken: timeTaken || 45,
    });

    // Check if session completed (5 answers)
    if (session.answersHistory.length >= session.questions.length) {
      session.status = 'completed';

      const avgComm = Math.round(
        session.answersHistory.reduce((a, c) => a + c.feedback.scores.communication, 0) /
          session.answersHistory.length
      );
      const avgRel = Math.round(
        session.answersHistory.reduce((a, c) => a + c.feedback.scores.relevance, 0) /
          session.answersHistory.length
      );
      const avgConf = Math.round(
        session.answersHistory.reduce((a, c) => a + c.feedback.scores.confidence, 0) /
          session.answersHistory.length
      );

      session.report = {
        overallScore: Math.round((avgComm + avgRel + avgConf) / 3),
        scores: {
          communication: avgComm,
          relevance: avgRel,
          confidence: avgConf,
          technicalAgility: Math.round((avgRel + avgConf) / 2),
        },
        summary:
          'Strong returner readiness. You demonstrated executive composure and articulated pause leadership with pride.',
        strengths: [
          'Unapologetic reframing of career gap into organizational strengths.',
          'High empathy and maturity in resolving cross-functional trade-offs.',
        ],
        growthAreas: [
          'Practice concise 60-second opening elevator pitches.',
          'Reference quantifiable business metrics to reinforce past credibility.',
        ],
      };

      // Increment user mock interviews completed count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'progress.mockInterviewsCompleted': 1 },
      });
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully',
      feedback,
      session,
    });
  } catch (err) {
    next(err);
  }
};

export const getInterviewSessionById = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    res.status(200).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
};
