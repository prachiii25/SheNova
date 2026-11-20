/**
 * SheNova Skill Gap Service (Mock with realistic market delta calculation)
 * Structured with clean async signatures for future Express / Gemini API integration.
 */

const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const PRESET_TARGET_ROLES = [
  'Senior Product Manager',
  'Full Stack Software Engineer',
  'Frontend Developer (React/Next)',
  'Data Analyst & BI Specialist',
  'UX/UI Product Designer',
  'Human Resources & Talent Lead',
  'Operations & Project Manager',
  'Digital Marketing & Growth Lead',
];

export const skillGapService = {
  /**
   * Analyzes the gap between prior candidate skills and modern industry expectations.
   * @param {string} targetRole
   * @param {Array<string>|string} previousSkills
   * @param {string} breakDuration
   * @returns {Promise<Object>}
   */
  async analyzeSkills({ targetRole, previousSkills, breakDuration = '2 - 4 years' }) {
    await sleep(600);

    const role = targetRole || 'Senior Product Manager';

    return {
      targetRole: role,
      breakDuration,
      isDemo: true,
      analyzedAt: new Date().toISOString(),
      matchScore: 74,
      skillsSummary: {
        totalEvaluated: 8,
        strongMatchCount: 4,
        deltaRefreshCount: 3,
        criticalMissingCount: 1,
      },
      skillsComparison: [
        {
          skill: 'Product Strategy & Roadmap Formulation',
          category: 'Core Competency',
          currentScore: 92,
          requiredScore: 90,
          status: 'strong',
          note: 'Transferable skill; well retained from prior experience.',
        },
        {
          skill: 'User Discovery & Customer Interviews',
          category: 'Core Competency',
          currentScore: 88,
          requiredScore: 85,
          status: 'strong',
          note: 'High proficiency; empathy honed during caregiving adds depth.',
        },
        {
          skill: 'Agile Ceremonies & Cross-Functional Sync',
          category: 'Core Competency',
          currentScore: 85,
          requiredScore: 85,
          status: 'strong',
          note: 'Strong foundational grasp of Scrum, Sprint Planning, and retros.',
        },
        {
          skill: 'Modern Product Analytics (PostHog / Mixpanel)',
          category: 'Tooling Evolution',
          currentScore: 60,
          requiredScore: 85,
          status: 'outdated',
          note: 'Tools evolved from legacy Google Analytics to event-based tracking.',
        },
        {
          skill: 'Generative AI User Flows & Prompt Architecture',
          category: 'Emerging Requirement',
          currentScore: 45,
          requiredScore: 80,
          status: 'missing',
          note: 'New market standard in 2025/2026. Needs focused 4-hour hands-on sprint.',
        },
        {
          skill: 'Asynchronous Workflow & Jira Cloud / Notion',
          category: 'Collaboration',
          currentScore: 68,
          requiredScore: 85,
          status: 'outdated',
          note: 'Remote and hybrid documentation standards shifted significantly.',
        },
      ],
      flaggedGaps: [
        {
          skill: 'Generative AI Product Workflows',
          type: 'Emerging standard',
          severity: 'High',
          reason: 'Modern job descriptions expect basic fluency in designing AI-augmented features.',
          action: 'Complete 3.5-hour sprint module on prompt flow design.',
        },
        {
          skill: 'Event-Driven Funnel Analytics',
          type: 'Tooling upgrade',
          severity: 'Medium',
          reason: 'Transitioned from pageview tracking to behavioral user cohorts.',
          action: 'Hands-on practice configuring a sample PostHog onboarding funnel.',
        },
        {
          skill: 'Modern Cloud Architecture Basics',
          type: 'Technical refresh',
          severity: 'Low',
          reason: 'Understanding serverless and microservices at a high conversational level.',
          action: 'Review 45-min architecture primer for non-engineers.',
        },
      ],
      recommendedCourses: [
        {
          id: 'c-1',
          title: 'GenAI for Product & Tech Leaders (2026 Edition)',
          provider: 'SheNova Learning Hub',
          duration: '3.5 Hours',
          level: 'High Priority',
          format: 'Self-Paced Interactive',
          link: '/learning',
        },
        {
          id: 'c-2',
          title: 'Modern Event Analytics Crash Sprint (Mixpanel/PostHog)',
          provider: 'SheNova Cohort Labs',
          duration: '2.0 Hours',
          level: 'Medium Priority',
          format: 'Hands-on Sandbox',
          link: '/learning',
        },
        {
          id: 'c-3',
          title: 'Remote Collaboration: Async Jira, Loom & Notion Workspaces',
          provider: 'SheNova Micro-Skills',
          duration: '1.5 Hours',
          level: 'Quick Refresh',
          format: 'Interactive Walkthrough',
          link: '/learning',
        },
      ],
      stepByStepUpskillingPlan: [
        {
          phase: 'Weeks 1 - 2: Core Refresh & Tool Modernization',
          focus: 'Shift from legacy tools to modern cloud platforms',
          timeEstimate: '3 hrs/week',
          items: [
            'Audit modern analytics terminology: DAU/MAU cohorts, event properties, and retention curves.',
            'Practice building sample project board in modern Jira Cloud with sprint workflows.',
            'Document 2 case study examples of past work reframed with modern metrics.',
          ],
        },
        {
          phase: 'Weeks 3 - 4: Emerging GenAI Literacy',
          focus: 'Become confident discussing and utilizing generative AI capabilities',
          timeEstimate: '4 hrs/week',
          items: [
            'Learn prompt structuring patterns and guardrails for customer-facing AI products.',
            'Design a hypothetical feature spec integrating an LLM agent into a familiar product.',
            'Complete SheNova AI interactive sprint quiz with >85% grade.',
          ],
        },
        {
          phase: 'Weeks 5 - 6: Scenario Articulation & Mock Testing',
          focus: 'Speak confidently about tech changes in employer interviews',
          timeEstimate: '3 hrs/week',
          items: [
            'Rehearse answering: "How has technology evolved since you stepped away?"',
            'Conduct AI mock scenario interview focused on technical adaptability.',
            'Include newly acquired modern credentials on resume and LinkedIn profile.',
          ],
        },
      ],
    };
  },
};

export default skillGapService;
