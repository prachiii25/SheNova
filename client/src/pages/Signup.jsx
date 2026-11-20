import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Briefcase,
  Clock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import AuthSidebarPanel from '../components/auth/AuthSidebarPanel';
import PasswordStrengthIndicator, { getPasswordStrength } from '../components/auth/PasswordStrengthIndicator';

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    breakReason: 'Motherhood & Childcare',
    breakDuration: '2 - 4 years',
    targetRole: 'Product & Tech Operations',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailTrimmed)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        careerBreakReason: formData.breakReason,
        breakDuration: formData.breakDuration,
        targetRole: formData.targetRole,
      });
      toast.success('Account created! Welcome to SheNova.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
      setErrors((prev) => ({ ...prev, general: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-surface-border shadow-soft-xl overflow-hidden">
        {/* LEFT COLUMN: Registration Form */}
        <div className="lg:col-span-7 xl:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  <Heart className="w-3.5 h-3.5 mr-1" />
                  Your Story Matters
                </Badge>
                <Badge variant="demo" size="sm">
                  Sample Signup
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
                Begin Your Career Restart
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed">
                Create your SheNova account to generate your tailored AI return plan, access returnships, and connect with mentors.
              </p>
            </div>

            {errors.general && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Radhika Sharma"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                error={errors.name}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="radhika@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Career Break Context"
                  value={formData.breakReason}
                  onChange={(e) => setFormData({ ...formData, breakReason: e.target.value })}
                  options={[
                    { value: 'Motherhood & Childcare', label: 'Motherhood & Childcare' },
                    { value: 'Marriage & Relocation', label: 'Marriage & Relocation' },
                    { value: 'Elder Care & Family Care', label: 'Elder Care / Family Care' },
                    { value: 'Personal Health & Recovery', label: 'Health / Personal Pause' },
                    { value: 'Career Transition / Upskilling', label: 'Career Transition / Upskilling' },
                  ]}
                />

                <Select
                  label="Pause Duration"
                  value={formData.breakDuration}
                  onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })}
                  options={[
                    { value: 'Under 1 year', label: 'Under 1 year' },
                    { value: '1 - 2 years', label: '1 - 2 years' },
                    { value: '2 - 4 years', label: '2 - 4 years' },
                    { value: '5+ years', label: '5+ years' },
                  ]}
                />
              </div>

              {/* Password with Strength Indicator */}
              <div className="space-y-1">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  error={errors.password}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-ink-subtle hover:text-ink focus:outline-none p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                />
                <PasswordStrengthIndicator password={formData.password} />
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
                error={errors.confirmPassword}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-ink-subtle hover:text-ink focus:outline-none p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center text-sm font-semibold shadow-soft-sm"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create My Returner Account
                </Button>
              </div>
            </form>
          </div>

          <div className="pt-8 mt-6 border-t border-surface-border text-center">
            <p className="text-xs sm:text-sm text-ink-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Inspiring Split Panel */}
        <div className="lg:col-span-5 xl:col-span-6 flex">
          <AuthSidebarPanel
            tag="A Community That Understands"
            quote="No matter how long your pause lasted, your intellect, passion, and ambition remain intact. We bridge the gap back to work."
            author="SheNova Returner Collective"
            role="Empowering mothers & caregivers across India & globally"
            highlights={[
              'Personalized 60-day roadmap based on your pause duration',
              'Break-friendly resume generator with executive reframing',
              'Direct connection to corporate returnship cohorts',
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
