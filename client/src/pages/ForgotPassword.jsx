import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle2, Sparkles, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { authService } from '../services/authService';
import AuthSidebarPanel from '../components/auth/AuthSidebarPanel';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setError('Please provide your registered email address.');
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailTrimmed)) {
      setError('Please provide a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Password recovery link sent!');
    } catch (err) {
      toast.error('Failed to send recovery email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-surface-border shadow-soft-xl overflow-hidden">
        {/* LEFT COLUMN: Recovery Form */}
        <div className="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  <KeyRound className="w-3.5 h-3.5 text-primary-600 mr-1" />
                  Account Recovery
                </Badge>
                <Badge variant="demo" size="sm">
                  Demo
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
                Reset Your Password
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed">
                Enter your registered email and we'll send you safe instructions to reset your password and return to your workspace.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 bg-secondary/30 rounded-2xl border border-primary-100 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-soft-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-ink">Instructions Dispatched</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    We sent password recovery instructions to <span className="font-semibold text-ink">{email}</span>.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-xs"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Resend link or change email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  error={error}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center text-sm font-semibold shadow-soft-sm"
                  isLoading={isLoading}
                >
                  Send Recovery Link
                </Button>
              </form>
            )}
          </div>

          <div className="pt-8 mt-6 border-t border-surface-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Encouraging Split Panel */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <AuthSidebarPanel
            tag="Safe & Secure"
            quote="Take a breath. Every journey has small pauses—what matters is that you are taking the next step."
            author="SheNova Support"
            role="Here for every step of your restart"
            highlights={[
              'Encrypted, private data storage',
              'Quick recovery flow',
              'Assistance available via hello@shenova.example',
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
