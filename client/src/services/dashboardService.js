import apiClient from './api';
import { roadmapService } from './roadmapService';
import { resumeService } from './resumeService';
import { jobService } from './jobService';
import {
  DEMO_CAREER_PROGRESS_STEPS,
  DEMO_RESUME_METRICS,
  DEMO_SKILL_PROGRESS,
  DEMO_UPCOMING_ACTIVITIES,
  DEMO_JOBS,
} from '../data/mockData';

export const dashboardService = {
  /**
   * Fetch aggregated dashboard state for authenticated user
   */
  async getDashboardData() {
    let roadmapData = null;
    let resumeData = null;
    let recommendedJobs = null;

    try {
      const [roadmapRes, resumeRes, jobsRes] = await Promise.allSettled([
        roadmapService.getUserRoadmap(),
        resumeService.getResume(),
        jobService.getJobs({ limit: 3 }),
      ]);

      if (roadmapRes.status === 'fulfilled') {
        roadmapData = roadmapRes.value;
      }
      if (resumeRes.status === 'fulfilled') {
        resumeData = resumeRes.value;
      }
      if (jobsRes.status === 'fulfilled' && jobsRes.value?.jobs) {
        recommendedJobs = jobsRes.value.jobs.slice(0, 3);
      }
    } catch (err) {
      console.warn('[dashboardService.getDashboardData] Error loading subservices:', err.message);
    }

    return {
      roadmap: roadmapData,
      resume: resumeData || DEMO_RESUME_METRICS,
      recommendedJobs: recommendedJobs || DEMO_JOBS,
      skillProgress: DEMO_SKILL_PROGRESS,
      upcomingActivities: DEMO_UPCOMING_ACTIVITIES,
      careerProgressSteps: roadmapData?.milestones
        ? roadmapData.milestones.map((m, idx) => ({
            step: idx + 1,
            id: `step-${m.id}`,
            name: m.title,
            status: m.status,
            date: m.targetDate || `Week ${idx * 2 + 1}`,
            desc: m.description,
          }))
        : DEMO_CAREER_PROGRESS_STEPS,
    };
  },
};

export default dashboardService;
