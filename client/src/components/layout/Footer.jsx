import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, HelpCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-soft-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-ink">
                SheNova
              </span>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
              Empowering women returning to work after motherhood, caregiving, or personal life breaks. Your career pause wasn't time lost—it's leadership gained.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <Badge variant="demo" size="sm">
                Demo Prototype Preview
              </Badge>
              <span className="text-xs text-ink-subtle flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-primary-500" />
                Verified returnship ecosystem
              </span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-ink uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li>
                <Link to="/roadmap" className="hover:text-primary-600 transition-colors">
                  AI Career Roadmap
                </Link>
              </li>
              <li>
                <Link to="/skill-gap" className="hover:text-primary-600 transition-colors">
                  Skill Gap Analyzer
                </Link>
              </li>
              <li>
                <Link to="/resume-builder" className="hover:text-primary-600 transition-colors">
                  Gap-Friendly Resume
                </Link>
              </li>
              <li>
                <Link to="/interview" className="hover:text-primary-600 transition-colors">
                  AI Confidence Interview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Opportunities */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-ink uppercase tracking-wider">
              Opportunities
            </h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li>
                <Link to="/jobs" className="hover:text-primary-600 transition-colors">
                  Returnship Programs
                </Link>
              </li>
              <li>
                <Link to="/learning" className="hover:text-primary-600 transition-colors">
                  Learning & Cohorts
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-primary-600 transition-colors">
                  Sisterhood Circle
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-600 transition-colors">
                  Member Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Company */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-ink uppercase tracking-wider">
              Trust & Support
            </h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li>
                <Link to="/profile" className="hover:text-primary-600 transition-colors">
                  Account Preferences
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-600 transition-colors">
                  Member Portal
                </Link>
              </li>
              <li>
                <span className="text-ink-subtle flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <a href="mailto:hello@shenova.example" className="hover:text-primary-600 transition-colors">
                    hello@shenova.example
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-4">
          <p>© {new Date().getFullYear()} SheNova Inc. Designed with care for returning women.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-accent-500 fill-accent-500" /> for your return to leadership.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
