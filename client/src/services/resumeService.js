import apiClient from './api';

export const resumeService = {
  /**
   * Fetch active resume for user
   */
  async getResume() {
    try {
      const response = await apiClient.get('/resume');
      if (response.data?.success && response.data?.data) {
        return {
          ...response.data.data,
          demoMode: Boolean(response.data.demoMode),
        };
      }
      return null;
    } catch (error) {
      console.warn('[resumeService.getResume] API error:', error.message);
      return null;
    }
  },

  /**
   * Save / Upsert resume
   */
  async saveResume(resumeData) {
    try {
      const response = await apiClient.put('/resume', resumeData);
      return response.data?.data;
    } catch (error) {
      console.warn('[resumeService.saveResume] API error, saving locally:', error.message);
      localStorage.setItem('shenova_saved_resume', JSON.stringify(resumeData));
      return resumeData;
    }
  },

  /**
   * Explain career gap positively via Gemini AI or backend
   */
  async explainCareerGap(context) {
    try {
      // First try Gemini AI endpoint
      const response = await apiClient.post('/ai/explain-gap', context);
      if (response.data?.success && response.data?.data) {
        return {
          phrasings: response.data.data.phrasings,
          demoMode: Boolean(response.data.demoMode),
          interviewTip: response.data.data.interviewTip,
        };
      }
    } catch (error) {
      try {
        // Fallback to resume controller endpoint
        const fallback = await apiClient.post('/resume/explain-gap', context);
        if (fallback.data?.success) {
          return {
            phrasings: fallback.data.phrasings,
            demoMode: true,
          };
        }
      } catch (e2) {}
    }

    // Default returner phrasings
    const duration = context?.duration || '3.5 years';
    return {
      demoMode: true,
      phrasings: [
        {
          style: 'Executive & Strategic',
          text: `“Following 5+ years of delivering software products, I took an intentional ${duration} career pause dedicated to family caregiving. Managing multi-stakeholder household operations sharpened my crisis de-escalation, rapid triage, and budget discipline—qualities that directly enrich my executive leadership.”`,
          bestFor: 'Executive summaries, director-level returnships, and formal cover letters',
        },
        {
          style: 'Direct & Authentic',
          text: `“I stepped away from full-time tech for ${duration} to care for my young family. During this pause, I maintained professional momentum through self-paced learning in AI product roadmapping and community advisory roles. I am energized and fully equipped to bring this refreshed focus to returner challenges.”`,
          bestFor: 'Recruiter phone screens and initial hiring manager introductions',
        },
        {
          style: 'Growth & Upskilling Oriented',
          text: `“Over the past ${duration}, I balanced primary childcare responsibilities with targeted upskilling in modern generative AI and analytics stacks. This deliberate pause provided valuable perspective, allowing me to return with updated technical agility and sharpened prioritization.”`,
          bestFor: 'Tech-forward startups and innovation returnship cohorts',
        },
      ],
    };
  },

  /**
   * Optimize resume bullets via AI
   */
  async improveResume(resumeSnippet) {
    try {
      const response = await apiClient.post('/ai/improve-resume', resumeSnippet);
      return response.data;
    } catch (error) {
      return {
        demoMode: true,
        data: {
          improvedSummary: 'Optimized returner summary highlighting transferrable leadership.',
        },
      };
    }
  },
};

export default resumeService;
