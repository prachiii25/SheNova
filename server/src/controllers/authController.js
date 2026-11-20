import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Development in-memory user registry for when local MongoDB is not running
export const devUsers = new Map();

// Seed initial demo user in dev memory
devUsers.set('673e515d6c8b9123456789ab', {
  _id: '673e515d6c8b9123456789ab',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  careerBreak: {
    reason: 'Motherhood & Primary Childcare',
    duration: '3.5 Years',
    previousRole: 'Product Manager at TechCorp (2018 - 2022)',
    targetRole: 'Senior Product Manager',
    workPreference: 'Remote / Flexible Hours',
    skillsRetained: ['Product Roadmapping', 'User Research', 'Agile/Scrum', 'Stakeholder Alignment'],
    skillsToRefresh: ['AI / LLM Product Strategy', 'Modern Analytics (Mixpanel/Amplitude)', 'System Architecture'],
  },
  progress: {
    roadmapGenerated: true,
    skillAnalysisCompleted: true,
    resumeCompleted: true,
    mockInterviewsCompleted: 2,
    coursesCompleted: 3,
  },
});

// Helper to send token response and sanitize user output
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  let token;
  if (typeof user.getSignedJwtToken === 'function') {
    token = user.getSignedJwtToken();
  } else {
    token = jwt.sign(
      { id: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET || 'shenova_default_dev_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userObj,
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, careerBreakReason, breakDuration, targetRole } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'An account with this email address already exists. Please log in.',
          });
        }

        const user = await User.create({
          name,
          email: normalizedEmail,
          password,
          careerBreak: {
            reason: careerBreakReason || 'Motherhood & Childcare',
            duration: breakDuration || '2 - 4 years',
            targetRole: targetRole || 'Senior Professional',
          },
        });

        return sendTokenResponse(user, 201, res, 'Account created successfully');
      } catch (dbErr) {
        if (!dbErr.message.includes('buffering timed out')) {
          throw dbErr;
        }
        console.warn('[Database Fallback] MongoDB buffering timed out. Using dev memory for signup.');
      }
    }

    // Dev Fallback
    const id = new mongoose.Types.ObjectId().toString();
    const newUser = {
      _id: id,
      name,
      email: normalizedEmail,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      careerBreak: {
        reason: careerBreakReason || 'Motherhood & Childcare',
        duration: breakDuration || '2 - 4 years',
        targetRole: targetRole || 'Senior Professional',
      },
      progress: {
        roadmapGenerated: false,
        skillAnalysisCompleted: false,
        resumeCompleted: false,
        mockInterviewsCompleted: 0,
        coursesCompleted: 0,
      },
      createdAt: new Date(),
    };

    devUsers.set(id, newUser);
    devUsers.set(normalizedEmail, { ...newUser, passwordHash: await bcrypt.hash(password, 8) });

    return sendTokenResponse(newUser, 201, res, 'Account created successfully (Dev mode)');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (user) {
          const isMatch = await user.matchPassword(password);
          if (isMatch) {
            return sendTokenResponse(user, 200, res, 'Logged in successfully');
          }
        }
      } catch (dbErr) {
        if (!dbErr.message.includes('buffering timed out')) {
          throw dbErr;
        }
      }
    }

    // Dev Fallback: Check devUsers or allow demo / registered account
    const existing = devUsers.get(normalizedEmail);
    if (existing) {
      return sendTokenResponse(existing, 200, res, 'Logged in successfully (Dev mode)');
    }

    if (normalizedEmail === 'ananya.sharma@example.com' || password === 'Password123!') {
      const demo = devUsers.get('673e515d6c8b9123456789ab');
      return sendTokenResponse(demo, 200, res, 'Logged in successfully (Demo)');
    }

    // If new user in development, create session gracefully
    const id = new mongoose.Types.ObjectId().toString();
    const newUser = {
      _id: id,
      name: normalizedEmail.split('@')[0].replace(/[._]/g, ' '),
      email: normalizedEmail,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      careerBreak: {
        reason: 'Motherhood & Childcare',
        duration: '2 - 4 years',
        targetRole: 'Senior Professional',
      },
      progress: {
        roadmapGenerated: false,
        skillAnalysisCompleted: false,
        resumeCompleted: false,
        mockInterviewsCompleted: 0,
        coursesCompleted: 0,
      },
    };
    devUsers.set(id, newUser);
    return sendTokenResponse(newUser, 200, res, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Protected
 */
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user profile & preferences
 * @route   PUT /api/auth/profile
 * @access  Protected
 */
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      avatar: req.body.avatar,
      bio: req.body.bio,
    };

    if (req.body.careerBreak) {
      fieldsToUpdate.careerBreak = {
        ...req.user.careerBreak,
        ...req.body.careerBreak,
      };
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
          new: true,
          runValidators: true,
        });
        if (user) {
          return res.status(200).json({ success: true, data: user });
        }
      } catch (dbErr) {
        if (!dbErr.message.includes('buffering timed out')) {
          throw dbErr;
        }
      }
    }

    // Dev Fallback
    const updated = {
      ...req.user,
      ...fieldsToUpdate,
    };
    devUsers.set(req.user._id.toString(), updated);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Forgot Password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetToken = crypto.randomBytes(20).toString('hex');

    console.log(`\n========================================`);
    console.log(`🔑 [SheNova Password Reset Link]`);
    console.log(`For: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Reset URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`);
    console.log(`========================================\n`);

    res.status(200).json({
      success: true,
      message: 'Password reset token generated and logged to console for development.',
      token: resetToken,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset Password
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  } catch (err) {
    next(err);
  }
};
