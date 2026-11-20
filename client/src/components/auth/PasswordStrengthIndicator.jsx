import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const getPasswordStrength = (password = '') => {
  if (!password) return { score: 0, label: 'Too short', color: 'bg-surface-border' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (password.length >= 12 && score === 3) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
  if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
  if (score >= 3) return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
};

export const PasswordStrengthIndicator = ({ password = '' }) => {
  const strength = getPasswordStrength(password);

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number or symbol', met: /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password) },
    { label: 'Both uppercase & lowercase letters', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1 animate-fadeIn">
      {/* Strength Bar Segments */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              step <= strength.score ? strength.color : 'bg-surface-border'
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-ink-muted">Password strength:</span>
        <span className={cn('font-bold', strength.text)}>{strength.label}</span>
      </div>

      <div className="space-y-1 pt-0.5">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            {c.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
            )}
            <span className={c.met ? 'text-ink-light font-medium' : 'text-ink-muted'}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
