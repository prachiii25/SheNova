import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import AuthSidebarPanel from '../components/auth/AuthSidebarPanel';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Target destination after login (default to /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const newErrors = {};
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
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
      await login(email, password);
      toast.success('Welcome back to SheNova! Redirecting to dashboard...');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      setErrors((prev) => ({ ...prev, general: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsDemoLoading(true);
    try {
      await loginDemo();
      toast.success('Signed in as Ananya Sharma (Demo Profile)');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Could not activate demo profile.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-surface-border shadow-soft-xl overflow-hidden">
        {/* LEFT COLUMN: Form Side */}
        <div className="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  <Sparkles className="w-3.5 h-3.5 text-primary-600 mr-1" />
                  Returner Portal
                </Badge>
                <Badge variant="demo" size="sm">
                  Sample Auth
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
                Welcome Back, Sister
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed">
                Log in to resume your career restart roadmap, review applications, and access practice interview rounds.
              </p>
            </div>

            {errors.general && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                error={errors.email}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
                <div className="flex justify-end pt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center text-sm font-semibold shadow-soft-sm"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-ink-muted uppercase tracking-wider font-semibold font-heading">
                  Quick Access
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full justify-center border border-primary-200/80 hover:bg-secondary-hover"
              onClick={handleQuickDemo}
              isLoading={isDemoLoading}
              leftIcon={<Sparkles className="w-4 h-4 text-primary-600" />}
            >
              Sign In with 1-Click Demo Profile
            </Button>
          </div>

          <div className="pt-8 mt-6 border-t border-surface-border text-center">
            <p className="text-xs sm:text-sm text-ink-muted">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-primary-600 font-bold hover:underline">
                Start your journey free
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Inspiring Split Panel */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <AuthSidebarPanel
            tag="Return with Dignity"
            quote="You did not step backwards; you paused to build resilience, perspective, and patience that make you a ten-times better leader."
            author="SheNova Mentorship Council"
            role="Guiding career restart journeys"
            highlights={[
              'Structured 60-day adaptive roadmap',
              'Break-friendly resume templates with zero gap bias',
              'AI confidence interview simulator',
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
