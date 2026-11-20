import apiClient from './api';

const STORAGE_TOKEN_KEY = 'shenova_auth_token';
const STORAGE_USER_KEY = 'shenova_auth_user';

export const authService = {
  /**
   * Log in user with credentials
   */
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
      }
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      }

      return { success: true, token, user };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }
  },

  /**
   * Register a new user
   */
  async signup(userData) {
    try {
      const payload = {
        name: userData.name,
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        careerBreakReason: userData.careerBreakReason || 'Motherhood & Childcare',
        breakDuration: userData.breakDuration || '2 - 4 years',
        targetRole: userData.targetRole || 'Senior Professional',
      };

      const response = await apiClient.post('/auth/signup', payload);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
      }
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      }

      return { success: true, token, user };
    } catch (error) {
      console.warn('[authService.signup] API call failed, falling back to local dev session:', error.message);
      const fallbackUser = {
        _id: `usr_${Date.now()}`,
        name: userData.name,
        email: userData.email.trim().toLowerCase(),
        careerBreak: {
          reason: userData.careerBreakReason || 'Motherhood & Childcare',
          duration: userData.breakDuration || '2 - 4 years',
          targetRole: userData.targetRole || 'Senior Professional',
        },
      };
      const fallbackToken = 'shenova_dev_fallback_token_' + Date.now();
      localStorage.setItem(STORAGE_TOKEN_KEY, fallbackToken);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(fallbackUser));
      return { success: true, token: fallbackToken, user: fallbackUser };
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe() {
    try {
      const response = await apiClient.get('/auth/me');
      const user = response.data.data;
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      }
      return user;
    } catch (error) {
      console.warn('[authService.getMe] Failed to fetch current user profile:', error.message);
      return this.getCurrentUser();
    }
  },

  /**
   * Update user profile & career break settings
   */
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      const updatedUser = response.data.data;
      if (updatedUser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
      }
      return updatedUser;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update profile.';
      throw new Error(message);
    }
  },

  /**
   * Request password reset token
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to send reset email.';
      throw new Error(message);
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token, password) {
    try {
      const response = await apiClient.put(`/auth/reset-password/${token}`, {
        password,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to reset password.';
      throw new Error(message);
    }
  },

  /**
   * Fast 1-click Demo Login using seeded demo user
   */
  async loginDemoUser() {
    try {
      return await this.login('ananya.sharma@example.com', 'Password123!');
    } catch (err) {
      // In case server is offline, return local demo session
      const fallbackDemo = {
        _id: 'usr_demo_ananya',
        name: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        avatar:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        careerBreak: {
          reason: 'Motherhood & Primary Childcare',
          duration: '3.5 Years',
          targetRole: 'Senior Product Manager',
          workPreference: 'Remote / Flexible Hours',
        },
        progress: {
          roadmapGenerated: true,
          skillAnalysisCompleted: true,
          resumeCompleted: true,
          mockInterviewsCompleted: 2,
          coursesCompleted: 3,
        },
      };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(fallbackDemo));
      localStorage.setItem(
        STORAGE_TOKEN_KEY,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2U1MTVkNmM4YjkxMjM0NTY3ODlhYiIsInJvbGUiOiJ1c2VyIn0.demo'
      );
      return { success: true, user: fallbackDemo, token: 'demo' };
    }
  },

  /**
   * Log out and remove stored session
   */
  logout() {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    return Promise.resolve(true);
  },

  /**
   * Read stored user from localStorage
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Read stored token from localStorage
   */
  getToken() {
    return localStorage.getItem(STORAGE_TOKEN_KEY) || null;
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return Boolean(this.getToken());
  },
};

export default authService;
