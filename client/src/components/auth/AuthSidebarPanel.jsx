import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Quote, ShieldCheck, Heart, Award, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const AuthSidebarPanel = ({
  tag = 'Empowered Restart',
  quote = 'A career break is not a void. It is a period of real-life leadership.',
  author = 'SheNova Philosophy',
  role = 'Empowering 12,000+ returning women',
  highlights = [
    'No break-penalty environment',
    'Personalized AI 60-day roadmaps',
    'Vetted returnships with dedicated mentors',
  ],
}) => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white overflow-hidden rounded-3xl m-3 select-none">
      {/* Decorative Orbs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-600/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-accent-300 shadow-soft-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white block">
              SheNova
            </span>
            <span className="text-[10px] text-primary-200 font-semibold tracking-wider uppercase block -mt-0.5">
              New Opportunities. Endless Possibilities.
            </span>
          </div>
        </div>

        <Badge variant="accent" size="sm" className="bg-white/15 text-accent-100 border-white/20">
          {tag}
        </Badge>
      </div>

      {/* Middle Quote & Encouragement */}
      <div className="relative z-10 space-y-6 my-auto max-w-lg">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-accent-300">
          <Quote className="w-6 h-6 fill-accent-300/30" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-snug">
          "{quote}"
        </h3>

        <div className="space-y-1">
          <p className="font-heading font-bold text-sm text-accent-200">{author}</p>
          <p className="text-xs text-primary-200">{role}</p>
        </div>

        {/* Highlight Bullets */}
        <div className="pt-6 border-t border-white/15 space-y-2.5">
          {highlights.map((h, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-primary-100 font-medium">
              <CheckCircle2 className="w-4 h-4 text-accent-400 shrink-0" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Trust Badge */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-primary-200">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-accent-300" />
          Safe, supportive sisterhood
        </span>
        <span className="font-mono text-[11px] text-primary-300">Demo Prototype</span>
      </div>
    </div>
  );
};

export default AuthSidebarPanel;
