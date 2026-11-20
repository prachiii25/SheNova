/**
 * SheNova Auth Service (Mock with LocalStorage persistence)
 * Structured with async promises so it can be swapped directly for real REST/GraphQL APIs.
 */

const STORAGE_USERS_KEY = 'shenova_users_db';
const STORAGE_CURRENT_USER_KEY = 'shenova_auth_user';
const STORAGE_TOKEN_KEY = 'shenova_auth_token';

const DEMO_DEFAULT_USER = {
  id: 'usr_demo_ananya',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  role: 'Product Specialist & Returner',
  careerBreakReason: 'Childcare & Family Care',
  breakDuration: '3.5 years',
  targetRole: 'Senior Product Manager',
  isDemo: true,
  createdAt: new Date().toISOString(),
};

// Initialize seed database in localStorage if empty
const initUsersDb = () => {
  const existing = localStorage.getItem(STORAGE_USERS_KEY);
  if (!existing) {
    const defaultDb = [
      {
        ...DEMO_DEFAULT_USER,
        password: 'Password123!', // Sample password min 8 chars
      },
    ];
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultDb));
  }
};

initUsersDb();

const sleep = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Log in an existing user
   */
  async login(email, password) {
    await sleep(400);

    const users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]');
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      // If it's a new or demo email in mock mode, create/authenticate gracefully
      const newUser = {
        id: `usr_${Date.now()}`,
        name: normalizedEmail.split('@')[0].replace(/[._]/g, ' '),
        email: normalizedEmail,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        careerBreakReason: 'Career Pause / Restart',
        breakDuration: '2 - 4 years',
        targetRole: 'Senior Professional',
        isDemo: true,
        createdAt: new Date().toISOString(),
      };
      const token = `mock_jwt_token_${Date.now()}`;
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
      return { user: newUser, token };
    }

    // Verify password if user exists with password
    if (user.password && user.password !== password) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = `mock_jwt_token_${Date.now()}`;

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    return { user: userWithoutPassword, token };
  },

  /**
   * Register a new user
   */
  async signup(userData) {
    await sleep(450);

    const users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]');
    const normalizedEmail = userData.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: normalizedEmail,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      careerBreakReason: userData.careerBreakReason || 'Motherhood & Childcare',
      breakDuration: userData.breakDuration || '2 - 4 years',
      targetRole: userData.targetRole || 'Professional',
      isDemo: true,
      password: userData.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    const token = `mock_jwt_token_${Date.now()}`;

    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    localStorage.setItem(STORAGE_TOKEN_KEY, token);

    return { user: userWithoutPassword, token };
  },

  /**
   * Request password recovery instructions
   */
  async forgotPassword(email) {
    await sleep(400);
    const normalizedEmail = email.trim().toLowerCase();
    // Simulate finding account and dispatching token
    return {
      success: true,
      message: `Password reset instructions dispatched to ${normalizedEmail}`,
    };
  },

  /**
   * Quick 1-click Demo Returner Login
   */
  async loginDemoUser() {
    await sleep(250);
    const token = `mock_jwt_token_demo_${Date.now()}`;
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(DEMO_DEFAULT_USER));
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    return { user: DEMO_DEFAULT_USER, token };
  },

  /**
   * Log out current user
   */
  async logout() {
    await sleep(150);
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    return { success: true };
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if token exists
   */
  getToken() {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  },
};

export default authService;
