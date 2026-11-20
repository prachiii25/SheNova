/**
 * SheNova Roadmap Service (Mock with realistic sample generator)
 * Structured with clean async signatures for future Express / Gemini API integration.
 */

const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const roadmapService = {
  /**
   * Generates a tailored 60-day career restart roadmap based on user intake.
   * @param {Object} intakeData
   * @returns {Promise<Object>}
   */
  async generateRoadmap(intakeData) {
    await sleep(650);

    const targetRole = intakeData.targetRole || 'Senior Product Specialist';
    const breakDuration = intakeData.breakDuration || '2 - 4 years';
    const workType = intakeData.workType || 'Remote / Flexible';

    return {
      id: `rdmp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDemo: true,
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
          description: 'Catalogue previous achievements and map caregiving/pause leadership into quantified strengths.',
          status: 'completed',
          tasks: [
            { text: 'List top 5 accomplishments from previous career', done: true },
            { text: 'Draft 3-bullet pause explanation focusing on crisis & budget management', done: true },
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
      ],
    };
  },

  /**
   * Retrieves an existing active roadmap or returns fallback demo data.
   */
  async getActiveRoadmap() {
    await sleep(250);
    const saved = localStorage.getItem('shenova_active_roadmap');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Return standard demo roadmap
    return this.generateRoadmap({
      targetRole: 'Senior Product Manager',
      breakDuration: '3.5 years',
      workType: 'Remote / Flexible',
    });
  },

  /**
   * Saves updated roadmap state (e.g. checked milestones) to localStorage.
   */
  async saveRoadmap(roadmapData) {
    localStorage.setItem('shenova_active_roadmap', JSON.stringify(roadmapData));
    return roadmapData;
  },
};

export default roadmapService;
