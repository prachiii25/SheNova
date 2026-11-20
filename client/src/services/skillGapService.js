import apiClient from './api';

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
   * Fetch saved skill analysis for the authenticated user
   */
  async getAnalysis() {
    try {
      const response = await apiClient.get('/skill-analysis');
      if (response.data?.success && response.data?.data) {
        return {
          ...response.data.data,
          demoMode: Boolean(response.data.data.isDemo || response.data.demoMode),
        };
      }
      return null;
    } catch (error) {
      console.warn('[skillGapService.getAnalysis] API error:', error.message);
      return null;
    }
  },

  /**
   * Analyzes the gap between prior candidate skills and modern industry expectations.
   */
  async analyzeSkills({ targetRole, previousSkills, breakDuration = '2 - 4 years' }) {
    const role = targetRole || 'Senior Product Manager';

    try {
      const response = await apiClient.post('/skill-analysis/analyze', {
        targetRole: role,
        previousSkills: Array.isArray(previousSkills)
          ? previousSkills
          : previousSkills.split(',').map((s) => s.trim()),
        breakDuration,
      });

      if (response.data?.success && response.data?.data) {
        return {
          ...response.data.data,
          demoMode: Boolean(response.data.data.isDemo || response.data.demoMode),
        };
      }
    } catch (error) {
      console.warn('[skillGapService.analyzeSkills] API error, falling back to local analysis:', error.message);
    }

    // Realistic Demo Mode Fallback
    return {
      targetRole: role,
      breakDuration,
      isDemo: true,
      demoMode: true,
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
          skill: 'Cross-Functional Stakeholder Alignment',
          category: 'Core Competency',
          currentScore: 95,
          requiredScore: 85,
          status: 'strong',
          note: 'Negotiation and crisis triage from family operations enhance this significantly.',
        },
        {
          skill: 'Agile Ceremonies & Sprint Planning',
          category: 'Methodology',
          currentScore: 82,
          requiredScore: 80,
          status: 'strong',
          note: 'Foundations are solid; just needs modern Jira Cloud familiarity.',
        },
        {
          skill: 'Generative AI & LLM UX Workflows',
          category: 'Emerging Tech Shift',
          currentScore: 35,
          requiredScore: 85,
          status: 'critical',
          note: 'Major shift since 2023. Fast-track with SheNova GenAI micro-sprint.',
        },
        {
          skill: 'Modern Product Analytics (PostHog & Mixpanel)',
          category: 'Tooling Refresh',
          currentScore: 50,
          requiredScore: 80,
          status: 'refresh',
          note: 'Industry moved from pageviews to event-driven user funnels and retention cohorts.',
        },
        {
          skill: 'Async Remote Collaboration (Notion & Loom)',
          category: 'Tooling Refresh',
          currentScore: 65,
          requiredScore: 85,
          status: 'refresh',
          note: 'High async documentation standard in 2026 returner roles.',
        },
        {
          skill: 'Data Storytelling & Executive Dashboards',
          category: 'Leadership Delivery',
          currentScore: 68,
          requiredScore: 80,
          status: 'refresh',
          note: 'Focus on connecting team sprint velocity to executive business OKRs.',
        },
      ],
      flaggedGaps: [
        {
          skill: 'Waterfall Planning to Automated Jira Product Discovery',
          type: 'Tooling Shift',
          severity: 'High',
          reason: 'Modern product teams use live experiment boards rather than static documentation.',
          action: 'Recommended: Complete Async Tooling sprint on SheNova Hub',
        },
        {
          skill: 'Legacy Pageview Analytics to Event-Driven Behavioral Tracking',
          type: 'Methodology Shift',
          severity: 'High',
          reason: 'Employers now expect cohort retention and activation milestone measurement.',
          action: 'Recommended: Complete PostHog & Mixpanel lab module',
        },
      ],
      flaggedOutdatedSkills: [
        {
          legacy: 'Waterfall Stage-Gate Planning / Manual Gantt tracking',
          modernReplacement: 'Continuous Discovery & Automated Jira Product Discovery',
          reason: 'Modern product teams use live experiment boards rather than static documentation.',
        },
        {
          legacy: 'Basic Google Analytics Universal (Pageview metrics)',
          modernReplacement: 'Event-driven behavioral analytics (Mixpanel / PostHog)',
          reason: 'Employers now expect cohort retention and activation milestone measurement.',
        },
      ],
      recommendedCourses: [
        {
          id: 1,
          title: 'Generative AI for Product & Tech Leaders',
          duration: '3.5 Hours',
          category: 'Technology',
          focus: 'Prompt engineering, UX patterns, and AI evaluation metrics.',
          provider: 'SheNova Learning Hub',
          level: 'High Priority',
          format: 'Self-Paced Micro-Sprint',
          route: '/learning',
        },
        {
          id: 2,
          title: 'Modern Event Analytics (PostHog & Mixpanel)',
          duration: '2.5 Hours',
          category: 'Technology',
          focus: 'Funnels, behavioral cohorts, and product health dashboards.',
          provider: 'SheNova Lab',
          level: 'High Priority',
          format: 'Interactive Hands-On Lab',
          route: '/learning',
        },
        {
          id: 3,
          title: 'Returner Leadership: Salary Negotiation & Parity',
          duration: '1.5 Hours',
          category: 'Professional Development',
          focus: 'Tactics to negotiate senior returner titles and overcome motherhood penalty discounts.',
          provider: 'Executive Mentor Pod',
          level: 'Recommended',
          format: 'Masterclass Brief',
          route: '/learning',
        },
      ],
      stepByStepUpskillingPlan: [
        {
          phase: 'Phase 1: AI Prompt & UX Frameworks',
          timeEstimate: 'Week 1 - 2',
          focus: 'AI Fluency & Terminology',
          items: [
            'Complete GenAI for Leaders sprint on SheNova',
            'Write 2 product requirement specs utilizing prompt engineering',
            'Benchmark competitive AI user experience patterns',
          ],
        },
        {
          phase: 'Phase 2: Event Analytics & Retention Metrics',
          timeEstimate: 'Week 3 - 4',
          focus: 'Behavioral Cohorts & OKRs',
          items: [
            'Instrument custom event tracking in sample app',
            'Analyze weekly retention cohorts and drop-off funnels',
            'Translate retention improvements into executive ARR metrics',
          ],
        },
        {
          phase: 'Phase 3: Async Leadership & Portfolio Brief',
          timeEstimate: 'Week 5 - 6',
          focus: 'Executive Delivery & Case Study',
          items: [
            'Publish 1 comprehensive case study document on Notion/LinkedIn',
            'Rehearse technical roadmap trade-off scenarios in AI Mock Interview',
            'Review portfolio with SheNova returner mentor',
          ],
        },
      ],
      upskillingPlan: [
        {
          week: 'Week 1 - 2',
          title: 'AI Product Strategy & Prompt Patterns',
          hours: '8 hrs total',
          milestone: 'Complete GenAI micro-sprint and evaluate 2 AI product flows',
          completed: true,
        },
        {
          week: 'Week 3 - 4',
          title: 'Event-Driven Metrics & Retention Cohorts',
          hours: '6 hrs total',
          milestone: 'Build a sample retention funnel in PostHog/Mixpanel',
          completed: false,
        },
        {
          week: 'Week 5 - 6',
          title: 'Async Work Orchestration & Portfolio Showcase',
          hours: '6 hrs total',
          milestone: 'Publish 1 documented case study to GitHub/LinkedIn',
          completed: false,
        },
      ],
    };
  },
};

export default skillGapService;
