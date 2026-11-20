import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { devUsers } from '../controllers/authController.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please provide a valid Bearer token.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'shenova_default_dev_secret'
    );

    let user;
    try {
      user = await User.findById(decoded.id);
    } catch (dbErr) {
      if (process.env.NODE_ENV === 'development') {
        user = devUsers.get(decoded.id) || {
          _id: decoded.id || '673e515d6c8b9123456789ab',
          name: 'Ananya Sharma',
          email: 'ananya.sharma@example.com',
          role: decoded.role || 'user',
          careerBreak: { targetRole: 'Senior Product Manager' },
        };
      } else {
        throw dbErr;
      }
    }

    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        user = devUsers.get(decoded.id) || {
          _id: decoded.id || '673e515d6c8b9123456789ab',
          name: 'Ananya Sharma',
          email: 'ananya.sharma@example.com',
          role: decoded.role || 'user',
          careerBreak: { targetRole: 'Senior Product Manager' },
        };
      } else {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token signature invalid or expired.',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'shenova_default_dev_secret'
    );
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Ignore invalid token on optional routes
  }
  next();
};

export default protect;
