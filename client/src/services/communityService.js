import apiClient from './api';

export const communityService = {
  // --- MENTORS ---

  async getMentors(params = {}) {
    try {
      const response = await apiClient.get('/community/mentors', { params });
      if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[communityService.getMentors] API error:', error.message);
    }
    return null;
  },

  async requestMentorship(requestData) {
    try {
      const response = await apiClient.post('/community/mentorship', requestData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Mentorship request failed.';
      throw new Error(message);
    }
  },

  async getMyMentorshipRequests() {
    try {
      const response = await apiClient.get('/community/mentorship/my-requests');
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[communityService.getMyMentorshipRequests] API error:', error.message);
    }
    return [];
  },

  // --- SUCCESS STORIES ---

  async getSuccessStories() {
    try {
      const response = await apiClient.get('/community/stories');
      if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[communityService.getSuccessStories] API error:', error.message);
    }
    return null;
  },

  // --- FORUMS ---

  async getForumPosts(params = {}) {
    try {
      const response = await apiClient.get('/community/forums', { params });
      if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[communityService.getForumPosts] API error:', error.message);
    }
    return null;
  },

  async getForumPostById(id) {
    try {
      const response = await apiClient.get(`/community/forums/${id}`);
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      console.warn('[communityService.getForumPostById] API error:', error.message);
    }
    return null;
  },

  async createForumPost(postData) {
    try {
      const response = await apiClient.post('/community/forums', postData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create post.';
      throw new Error(message);
    }
  },

  async replyToForumPost(postId, text) {
    try {
      const response = await apiClient.post(`/community/forums/${postId}/reply`, { text });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to submit reply.';
      throw new Error(message);
    }
  },

  async cheerForumPost(postId) {
    try {
      const response = await apiClient.post(`/community/forums/${postId}/cheer`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to cheer post.';
      throw new Error(message);
    }
  },
};

export default communityService;
