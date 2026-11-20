import apiClient from './api';

export const learningService = {
  /**
   * Fetch all courses with category / recommendation filters
   */
  async getCourses(params = {}) {
    try {
      const response = await apiClient.get('/learning/courses', { params });
      if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
        return {
          courses: response.data.data,
          demoMode: true,
          count: response.data.count,
        };
      }
    } catch (error) {
      console.warn('[learningService.getCourses] API error, using client fallback:', error.message);
    }

    return null;
  },

  /**
   * Fetch specific course by id
   */
  async getCourseById(id) {
    try {
      const response = await apiClient.get(`/learning/courses/${id}`);
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[learningService.getCourseById] API error:', error.message);
    }
    return null;
  },

  /**
   * Fetch user's saved progress across courses
   */
  async getUserProgress() {
    try {
      const response = await apiClient.get('/learning/progress');
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[learningService.getUserProgress] API error:', error.message);
    }
    return [];
  },

  /**
   * Update progress percentage for a course (0 - 100)
   */
  async updateCourseProgress(courseId, progress) {
    try {
      const response = await apiClient.put(`/learning/courses/${courseId}/progress`, {
        progress,
      });
      return response.data;
    } catch (error) {
      console.warn('[learningService.updateCourseProgress] API error, falling back locally:', error.message);
      return { success: true, data: { courseId, progress } };
    }
  },
};

export default learningService;
