import apiClient from './api';

export const INTERVIEW_ROLES = [
  'Senior Product Manager',
  'Full Stack Software Engineer',
  'Frontend Developer (React)',
  'UX/UI Product Designer',
  'Data Analyst & BI Specialist',
  'Human Resources & Talent Lead',
  'Operations & Project Lead',
];

export const DIFFICULTY_LEVELS = [
  { id: 'warm', label: 'Empathetic / Warm Returner', desc: 'Encouraging, low-stress scenario practice' },
  { id: 'standard', label: 'Standard Corporate Panel', desc: 'Balanced behavioral & technical depth' },
  { id: 'rigorous', label: 'Executive Leadership Panel', desc: 'Challenging multi-stakeholder scenarios' },
];

export const interviewService = {
  /**
   * Starts a new session or generates questions
   */
  async generateQuestions(role = 'Senior Product Manager', difficulty = 'standard') {
    try {
      const response = await apiClient.post('/interview/start', { role, difficulty });
      if (response.data?.success && response.data?.data) {
        return {
          sessionId: response.data.data._id,
          questions: response.data.data.questions,
          demoMode: Boolean(response.data.data.isDemo || response.data.demoMode),
        };
      }
    } catch (error) {
      console.warn('[interviewService.generateQuestions] API error, checking AI questions endpoint:', error.message);
      try {
        const aiResponse = await apiClient.post('/ai/interview-questions', { role, difficulty });
        if (aiResponse.data?.success && aiResponse.data?.data?.questions) {
          return {
            sessionId: `sess_${Date.now()}`,
            questions: aiResponse.data.data.questions,
            demoMode: Boolean(aiResponse.data.demoMode),
          };
        }
      } catch (aiErr) {}
    }

    // Realistic Demo Fallback
    return {
      sessionId: `sess_${Date.now()}`,
      demoMode: true,
      questions: [
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
          category: 'Prioritization Under Constraint',
          question:
            'How do you manage tight deadlines when team bandwidth is limited, and how do you protect team focus without compromising deliverables?',
          contextTip:
            'Highlight ruthless prioritization, transparent async communication, and realistic capacity planning.',
          idealKeywords: ['Ruthless prioritization', 'async communication', 'boundary setting', 'scope management'],
        },
        {
          id: 5,
          category: 'Long-Term Impact & Growth',
          question:
            'Looking ahead at the next 12 to 18 months in this role, what is your approach to onboarding rapidly and driving measurable organizational impact?',
          contextTip:
            'Showcase a structured 30-60-90 day onboarding framework and eagerness to mentor peers.',
          idealKeywords: ['30-60-90 plan', 'early wins', 'listening tour', 'mentorship', 'measurable impact'],
        },
      ],
    };
  },

  /**
   * Evaluates candidate's answer
   */
  async evaluateAnswer({ question, answer, questionIndex = 0, sessionId, role = 'Senior Product Manager', difficulty = 'standard' }) {
    if (sessionId && !sessionId.startsWith('sess_')) {
      try {
        const response = await apiClient.post(`/interview/sessions/${sessionId}/submit-answer`, {
          questionIndex,
          answer,
        });
        if (response.data?.success) {
          return {
            ...response.data.feedback,
            demoMode: Boolean(response.data.session?.isDemo),
          };
        }
      } catch (err) {
        console.warn('[interviewService.evaluateAnswer] Session submit error, trying AI endpoint:', err.message);
      }
    }

    try {
      const aiResponse = await apiClient.post('/ai/evaluate-answer', {
        question,
        answer,
        role,
        difficulty,
      });
      if (aiResponse.data?.success && aiResponse.data?.data) {
        return {
          ...aiResponse.data.data,
          demoMode: Boolean(aiResponse.data.demoMode),
        };
      }
    } catch (err) {}

    // Dynamic scoring calculation fallback
    const length = (answer || '').trim().length;
    const commScore = Math.min(95, Math.max(70, Math.round(75 + length / 35)));
    const relScore = Math.min(96, Math.max(72, Math.round(78 + length / 40)));
    const confScore = Math.min(92, Math.max(68, Math.round(74 + length / 45)));

    return {
      demoMode: true,
      scores: {
        communication: commScore,
        relevance: relScore,
        confidence: confScore,
      },
      strengths: [
        'Dignified, articulate framing of career pause responsibilities.',
        'Good balance of prior foundational depth with recent learning sprints.',
        'High degree of composure and clarity in delivery.',
      ],
      improvements: [
        'Anchor your achievements with specific metrics or quantitative milestones.',
        'Conclude with direct relevance to de-risking hiring managers deliverables.',
      ],
      suggestedAnswer:
        '“During my 3.5-year career pause for family caregiving, I dedicated 8 hours weekly to AI product roadmapping and analytics certifications. Managing complex household operations sharpened my triage, crisis de-escalation, and budget discipline—qualities that directly complement my prior 5+ years of software delivery.”',
    };
  },

  /**
   * Calculates final performance report across all answered scenario questions
   */
  calculateReport(answersHistory = []) {
    if (!answersHistory || answersHistory.length === 0) {
      return {
        overallScore: 85,
        scores: {
          communication: 86,
          relevance: 84,
          confidence: 85,
          technicalAgility: 85,
        },
        summary:
          'Solid returner readiness. You demonstrated executive composure and articulated pause leadership with confidence.',
        strengths: [
          'Unapologetic reframing of career gap into organizational strengths.',
          'High empathy and maturity in resolving cross-functional trade-offs.',
        ],
        growthAreas: [
          'Practice concise 60-second opening elevator pitches.',
          'Reference quantifiable business metrics to reinforce past credibility.',
        ],
      };
    }

    const commScores = answersHistory.map(
      (a) => a.feedback?.scores?.communication || 85
    );
    const relScores = answersHistory.map(
      (a) => a.feedback?.scores?.relevance || 84
    );
    const confScores = answersHistory.map(
      (a) => a.feedback?.scores?.confidence || 82
    );

    const avgComm = Math.round(
      commScores.reduce((sum, s) => sum + s, 0) / commScores.length
    );
    const avgRel = Math.round(
      relScores.reduce((sum, s) => sum + s, 0) / relScores.length
    );
    const avgConf = Math.round(
      confScores.reduce((sum, s) => sum + s, 0) / confScores.length
    );
    const techAgility = Math.round((avgRel + avgConf) / 2);
    const overall = Math.round((avgComm + avgRel + avgConf + techAgility) / 4);

    return {
      overallScore: overall,
      scores: {
        communication: avgComm,
        relevance: avgRel,
        confidence: avgConf,
        technicalAgility: techAgility,
      },
      summary:
        'Strong returner readiness. You demonstrated executive composure, structured thinking, and articulated your pause leadership with pride and precision.',
      strengths: [
        'Dignified framing of career pause responsibilities and leadership transferable skills.',
        'Structured problem breakdown and high stakeholder empathy.',
        'Continuous upskilling demonstrated in modern tooling and frameworks.',
      ],
      growthAreas: [
        'Practice 60-second concise STAR summaries before diving into technical details.',
        'Quantify achievements with business metrics (ARR, efficiency, conversion) where applicable.',
      ],
    };
  },

  /**
   * Fetch past interview sessions
   */
  async getPastSessions() {
    try {
      const response = await apiClient.get('/interview/sessions');
      return response.data?.data || [];
    } catch (err) {
      return [];
    }
  },
};

export default interviewService;
