import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pills', // 'pills' | 'underline'
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center',
        variant === 'pills'
          ? 'bg-surface-subtle p-1.5 rounded-2xl border border-surface-border w-fit gap-1'
          : 'border-b border-surface-border gap-6 w-full',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative pb-3 text-sm font-semibold transition-colors flex items-center gap-2 outline-none font-heading',
                isActive ? 'text-primary-600' : 'text-ink-muted hover:text-ink'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count !== 'undefined' && (
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-sans',
                    isActive ? 'bg-primary-100 text-primary-700' : 'bg-surface-subtle text-ink-muted'
                  )}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeUnderlineTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 outline-none font-heading z-10 select-none',
              isActive ? 'text-primary-700' : 'text-ink-muted hover:text-ink hover:bg-white/40'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activePillTab"
                className="absolute inset-0 bg-white rounded-xl shadow-soft-sm border border-surface-border/50 -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count !== 'undefined' && (
              <span
                className={cn(
                  'text-[11px] px-1.5 py-0.5 rounded-full font-sans font-medium',
                  isActive ? 'bg-primary-50 text-primary-700' : 'bg-surface-border/70 text-ink-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
