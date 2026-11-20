import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password hash in queries by default
    },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Open to Remote / Hybrid',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: 'Returning professional reframing career pause into leadership.',
    },
    role: {
      type: String,
      enum: ['returner', 'mentor', 'admin'],
      default: 'returner',
    },
    // Career Break Profile
    careerBreak: {
      duration: {
        type: String,
        default: '2 - 4 years',
      },
      reason: {
        type: String,
        default: 'Motherhood & Childcare',
      },
      priorRole: {
        type: String,
        default: '',
      },
      targetRole: {
        type: String,
        default: 'Senior Professional',
      },
      preferredWorkType: {
        type: String,
        default: 'Remote / Flexible Hybrid',
      },
      weeklyHours: {
        type: String,
        default: '8 - 10 hours/week',
      },
    },
    // Progress Metrics
    progress: {
      readinessScore: {
        type: Number,
        default: 75,
        min: 0,
        max: 100,
      },
      resumeCompletion: {
        type: Number,
        default: 80,
        min: 0,
        max: 100,
      },
      mockInterviewsCompleted: {
        type: Number,
        default: 0,
      },
      completedMilestones: {
        type: [String],
        default: ['Self-Audit & Skills Inventory'],
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'shenova_default_dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate random token
  const resetToken = crypto.randomBytes(24).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (30 minutes)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model('User', UserSchema);
export default User;
