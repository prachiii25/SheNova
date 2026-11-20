import apiClient from './api';
import { SAMPLE_JOBS } from '../data/jobs';

export const jobService = {
  /**
   * Fetch all job listings with filters
   */
  async getJobs(filters = {}) {
    try {
      const response = await apiClient.get('/jobs', { params: filters });
      if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
        return {
          jobs: response.data.data,
          demoMode: Boolean(response.data.demoMode || true), // Sample listings flag
          count: response.data.count,
        };
      }
    } catch (error) {
      console.warn('[jobService.getJobs] API error, falling back to client sample dataset:', error.message);
    }

    // Client fallback to SAMPLE_JOBS
    let filtered = [...SAMPLE_JOBS];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (filters.type && filters.type !== 'All') {
      filtered = filtered.filter((j) => j.type.toLowerCase().includes(filters.type.toLowerCase()));
    }
    if (filters.workMode && filters.workMode !== 'All') {
      filtered = filtered.filter((j) => j.workMode.toLowerCase() === filters.workMode.toLowerCase());
    }

    return {
      jobs: filtered,
      demoMode: true,
      count: filtered.length,
    };
  },

  /**
   * Fetch a single job by id
   */
  async getJobById(id) {
    try {
      const response = await apiClient.get(`/jobs/${id}`);
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[jobService.getJobById] API error, checking client SAMPLE_JOBS:', error.message);
    }
    return SAMPLE_JOBS.find((j) => (j.jobId || j.id) === id) || null;
  },

  /**
   * Submit application for a job
   */
  async applyForJob(jobId, applicationData) {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Application failed.';
      throw new Error(message);
    }
  },

  /**
   * Get user's submitted applications
   */
  async getApplications() {
    try {
      const response = await apiClient.get('/jobs/applications');
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[jobService.getApplications] API error:', error.message);
    }
    return [];
  },

  /**
   * Toggle save/bookmark job
   */
  async toggleSaveJob(jobId) {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Could not bookmark job.';
      throw new Error(message);
    }
  },

  /**
   * Get user's saved/bookmarked jobs
   */
  async getSavedJobs() {
    try {
      const response = await apiClient.get('/jobs/saved');
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[jobService.getSavedJobs] API error:', error.message);
    }
    return [];
  },
};

export default jobService;
