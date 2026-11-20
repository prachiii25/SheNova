/**
 * SheNova AI Mock Interview Service (Mock with realistic Gemini-style evaluations)
 * Structured with clean async signatures ready for Express / Gemini API integration.
 */

const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

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
   * Generates 5 tailored returner interview questions based on role and difficulty.
   * @param {string} role
   * @param {string} difficulty
   * @returns {Promise<Array>}
   */
  async generateQuestions(role = 'Senior Product Manager', difficulty = 'standard') {
    await sleep(600);

    return [
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
  },

  /**
   * Evaluates candidate response and returns multi-dimensional scoring and feedback.
   * @param {Object} evaluationPayload
   * @returns {Promise<Object>}
   */
  async evaluateAnswer({ question, answer, role, difficulty }) {
    await sleep(750);

    const length = (answer || '').trim().length;

    // Simulate realistic dynamic score based on depth and keywords
    const commScore = Math.min(95, Math.max(70, Math.round(75 + length / 35)));
    const relScore = Math.min(96, Math.max(72, Math.round(78 + length / 40)));
    const confScore = Math.min(92, Math.max(68, Math.round(74 + length / 45)));

    return {
      scores: {
        communication: commScore,
        relevance: relScore,
        confidence: confScore,
        overall: Math.round((commScore + relScore + confScore) / 3),
      },
      strengths: [
        'Clear, dignified tone that reframes pause commitments as active operational leadership.',
        'Good structured flow from previous foundational expertise to recent upskilling initiatives.',
        'Demonstrates genuine self-awareness without apologetic language.',
      ],
      improvements: [
        'Quantify your outcomes whenever possible (e.g., mention specific hour commitments or measurable project results).',
        'Directly bridge your past successes to how they de-risk the hiring manager’s upcoming quarter.',
      ],
      suggestedAnswer:
        '“During my 3.5-year career pause for family caregiving, I maintained dedicated 8-hour weekly learning sprints focused on Generative AI product flows and modern event analytics. Managing multi-stakeholder household operations sharpened my triage, crisis de-escalation, and budget discipline—qualities that directly complement my prior 5+ years of software delivery. I am eager to apply this synthesized perspective to accelerate your team’s 2026 roadmap.”',
    };
  },

  /**
   * Generates final interview report aggregating all questions.
   */
  calculateReport(answersList = []) {
    if (answersList.length === 0) return null;

    const avgComm = Math.round(
      answersList.reduce((acc, curr) => acc + (curr.feedback?.scores?.communication || 80), 0) /
        answersList.length
    );
    const avgRel = Math.round(
      answersList.reduce((acc, curr) => acc + (curr.feedback?.scores?.relevance || 82), 0) /
        answersList.length
    );
    const avgConf = Math.round(
      answersList.reduce((acc, curr) => acc + (curr.feedback?.scores?.confidence || 78), 0) /
        answersList.length
    );
    const overallScore = Math.round((avgComm + avgRel + avgConf) / 3);

    return {
      overallScore,
      scores: {
        communication: avgComm,
        relevance: avgRel,
        confidence: avgConf,
        technicalAgility: Math.round((avgRel + avgConf) / 2),
      },
      summary:
        'Strong returner readiness. You demonstrated executive composure, articulated pause leadership with pride, and conveyed genuine motivation for returnship cohort onboarding.',
      strengths: [
        'Unapologetic reframing of career gap into tangible organizational strengths.',
        'Strong grasp of contemporary collaboration tools and modern technology trends.',
        'High empathy and maturity in handling cross-functional team friction.',
      ],
      growthAreas: [
        'Practice tighter 60-second elevator summaries for the opening question.',
        'Continue referencing specific metrics from your prior experience to establish instant credibility.',
      ],
    };
  },
};

export default interviewService;
