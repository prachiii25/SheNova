import apiClient from './api';

export const roadmapService = {
  /**
   * Fetch user's active roadmap from backend
   */
  async getUserRoadmap() {
    try {
      const response = await apiClient.get('/roadmap');
      if (response.data?.success && response.data?.data) {
        return {
          ...response.data.data,
          demoMode: Boolean(response.data.data.isDemo || response.data.demoMode),
        };
      }
      return null;
    } catch (error) {
      console.warn('[roadmapService.getUserRoadmap] API error, checking local:', error.message);
      return null;
    }
  },

  async getActiveRoadmap() {
    const existing = await this.getUserRoadmap();
    if (existing) return existing;
    return await this.generateRoadmap({});
  },

  async saveRoadmap(data) {
    try {
      localStorage.setItem('shenova_active_roadmap', JSON.stringify(data));
      return data;
    } catch (e) {
      return data;
    }
  },

  /**
   * Generates a tailored 60-day career restart roadmap based on user intake.
   */
  async generateRoadmap(intakeData) {
    try {
      const response = await apiClient.post('/roadmap/generate', intakeData);
      if (response.data?.success && response.data?.data) {
        return {
          ...response.data.data,
          demoMode: Boolean(response.data.data.isDemo || response.data.demoMode),
        };
      }
    } catch (error) {
      console.warn('[roadmapService.generateRoadmap] API error, falling back to local demo generator:', error.message);
    }

    // Fallback Realistic Demo Roadmap
    const targetRole = intakeData.targetRole || 'Senior Product Specialist';
    const breakDuration = intakeData.breakDuration || '2 - 4 years';
    const workType = intakeData.workType || 'Remote / Flexible';

    return {
      id: `rdmp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDemo: true,
      demoMode: true,
      summary: {
        targetRole,
        breakDuration,
        workType,
        estimatedWeeks: 8,
        weeklyHourCommitment: '6 - 8 hours/week',
        projectedReadinessDate: '8 Weeks from Start',
        matchConfidence: 89,
      },
      learningGoals: [
        'Bridge technology tooling shift from legacy stacks to modern cloud/AI workflows.',
        'Refocus narrative from pause length to transferable executive problem-solving.',
        'Build 2 concrete portfolio artifacts addressing 2025/2026 industry standards.',
        'Complete voice-based scenario rehearsals for tough returner interview questions.',
      ],
      recommendedSkills: [
        { name: 'Generative AI User Flow & Prompt Architecture', priority: 'High', type: 'Emerging' },
        { name: 'Async Collaboration & Modern Jira Cloud', priority: 'Medium', type: 'Tooling Refresh' },
        { name: 'Product Discovery & Metric Instrumentation', priority: 'High', type: 'Core Skill' },
        { name: 'Returner Leadership Narrative & Executive Presence', priority: 'High', type: 'Soft Skill' },
      ],
      suggestedCareerPaths: [
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
      ],
      milestones: [
        {
          id: 1,
          phase: 'Phase 1: Week 1 - 2',
          title: 'Self-Audit & Transferable Competency Mapping',
          status: 'completed',
          targetDate: 'Week 2',
          description:
            'Inventory past professional accomplishments and reframe parenting/caregiving leadership into executive competencies.',
          tasks: [
            { id: 't1', text: 'Document 5 major career achievements and quantified metrics', done: true },
            { id: 't2', text: 'Frame 3 transferable caregiving skills (budget triage, negotiation, crisis management)', done: true },
            { id: 't3', text: 'Define weekly time-blocking boundaries for focused study', done: true },
          ],
        },
        {
          id: 2,
          phase: 'Phase 2: Week 3 - 4',
          title: 'Targeted Skill Delta Refresh (AI & Modern Tooling)',
          status: 'in-progress',
          targetDate: 'Week 4',
          description:
            'Complete hands-on micro-sprints to close specific toolchain gaps since your career pause.',
          tasks: [
            { id: 't4', text: 'Complete Generative AI workflows course on SheNova Learning Hub', done: true },
            { id: 't5', text: 'Build hands-on experiment artifact with modern analytics tool (Mixpanel/PostHog)', done: false },
            { id: 't6', text: 'Familiarize with async collaboration norms (Notion, Loom, Jira Cloud)', done: false },
          ],
        },
        {
          id: 3,
          phase: 'Phase 3: Week 5 - 6',
          title: 'ATS Gap-Friendly Resume & Portfolio Modernization',
          status: 'upcoming',
          targetDate: 'Week 6',
          description:
            'Reconstruct your resume with unapologetic gap framing, modern keywords, and measurable outcomes.',
          tasks: [
            { id: 't7', text: 'Generate AI positive career gap framing statement', done: false },
            { id: 't8', text: 'Format resume using SheNova Modern template and download ATS PDF', done: false },
            { id: 't9', text: 'Publish 1 case study summary to LinkedIn or personal portfolio', done: false },
          ],
        },
        {
          id: 4,
          phase: 'Phase 4: Week 7 - 8',
          title: 'Mock Interview Rehearsal & Returnship Applications',
          status: 'upcoming',
          targetDate: 'Week 8',
          description:
            'Practice tough scenario questions in the voice simulator and begin applying to curated returnship cohorts.',
          tasks: [
            { id: 't10', text: 'Complete 3 full rounds in AI Mock Interview module', done: false },
            { id: 't11', text: 'Schedule a 1-on-1 prep session with a SheNova returner mentor', done: false },
            { id: 't12', text: 'Submit applications to 3 verified returner cohort roles', done: false },
          ],
        },
      ],
    };
  },

  /**
   * Updates milestone completion status on the backend
   */
  async toggleMilestone(milestoneId, completed) {
    try {
      const response = await apiClient.put(`/roadmap/milestones/${milestoneId}`, { completed });
      return response.data?.data;
    } catch (error) {
      console.warn('[roadmapService.toggleMilestone] API error:', error.message);
      return null;
    }
  },
};

export default roadmapService;
