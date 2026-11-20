import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  GraduationCap,
  Play,
  Clock,
  Award,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Layers,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react';

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  ProgressBar,
  Tabs,
} from '../components/ui';

import { useAuth } from '../hooks/useAuth';
import { learningService } from '../services/learningService';

export const Learning = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Courses state with localStorage persistence
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('shenova_courses_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [
      {
        id: 1,
        title: 'Generative AI for Product & Tech Leaders',
        category: 'Technology',
        level: 'Modern Refresh',
        duration: '3.5 Hours',
        progress: 60,
        provider: 'SheNova Hub (Sample Course)',
        isRecommendedGap: true,
        description:
          'Hands-on micro-sprint covering prompt engineering, agentic UX patterns, and AI evaluation metrics.',
      },
      {
        id: 2,
        title: 'Modern Event Analytics (PostHog & Mixpanel)',
        category: 'Technology',
        level: 'Intermediate',
        duration: '2.5 Hours',
        progress: 25,
        provider: 'SheNova Lab (Sample Course)',
        isRecommendedGap: true,
        description:
          'Move past legacy pageviews to event-driven user funnels, behavioral cohorts, and retention curves.',
      },
      {
        id: 3,
        title: 'Modern Agile, Jira Cloud & Asynchronous Team Tooling',
        category: 'Technology',
        level: 'Beginner Friendly',
        duration: '2.0 Hours',
        progress: 100,
        provider: 'SheNova Hub (Sample Course)',
        isRecommendedGap: false,
        description:
          'Re-align with remote and hybrid collaboration workflows in 2026, using Notion, Jira Cloud, and Loom.',
      },
      {
        id: 4,
        title: 'Returner Leadership: Salary Negotiation & Parity',
        category: 'Professional Development',
        level: 'Executive',
        duration: '1.5 Hours',
        progress: 0,
        provider: 'Executive Mentor Pod (Sample Course)',
        isRecommendedGap: true,
        description:
          'Tactics to negotiate senior returner titles and overcome motherhood penalty salary discounts.',
      },
      {
        id: 5,
        title: 'Empathetic & Decisive Executive Communication',
        category: 'Communication',
        level: 'Beginner Friendly',
        duration: '1.5 Hours',
        progress: 40,
        provider: 'SheNova Communication (Sample Course)',
        isRecommendedGap: false,
        description:
          'Harness deep listening and conflict de-escalation skills gained during caregiving for corporate leadership.',
      },
      {
        id: 6,
        title: 'Business Strategy & Cross-Functional Triage',
        category: 'Business',
        level: 'Intermediate',
        duration: '3.0 Hours',
        progress: 10,
        provider: 'Strategy Fellows (Sample Course)',
        isRecommendedGap: false,
        description:
          'Prioritization frameworks (RICE, Kano) and translating quarterly OKRs into engineering deliverables.',
      },
      {
        id: 7,
        title: 'Overcoming Imposter Syndrome After a Career Pause',
        category: 'Professional Development',
        level: 'Mindset & Confidence',
        duration: '1.0 Hour',
        progress: 80,
        provider: 'Returner Wellness (Sample Course)',
        isRecommendedGap: false,
        description:
          'Psychological tools to anchor your self-worth and enter interviews with unshakeable confidence.',
      },
      {
        id: 8,
        title: 'Async Work Orchestration & Calendar Boundaries',
        category: 'Communication',
        level: 'Beginner Friendly',
        duration: '1.5 Hours',
        progress: 0,
        provider: 'Remote Leaders Pod (Sample Course)',
        isRecommendedGap: false,
        description:
          'Balancing family priorities with corporate delivery through rigorous calendar blocking and async updates.',
      },
      {
        id: 9,
        title: 'Cloud Architecture & Serverless Primer for Leaders',
        category: 'Technology',
        level: 'Intermediate',
        duration: '2.0 Hours',
        progress: 0,
        provider: 'Tech Academy (Sample Course)',
        isRecommendedGap: false,
        description:
          'Non-technical conversational understanding of microservices, serverless, and cloud scalability.',
      },
    ];
  });

  // Load from backend API if available
  useEffect(() => {
    const fetchCoursesFromApi = async () => {
      try {
        const res = await learningService.getCourses();
        if (res?.courses?.length > 0) {
          const mapped = res.courses.map((c) => ({
            id: c.courseId || c.id,
            title: c.title,
            category: c.category,
            level: c.level,
            duration: c.duration,
            progress: c.userProgress || 0,
            provider: c.provider,
            isRecommendedGap: c.isRecommendedGap,
            description: c.description,
          }));
          setCourses(mapped);
          setIsDemoMode(Boolean(res.demoMode));
        }
      } catch (err) {
        console.warn('Learning API fetch error:', err);
      }
    };
    fetchCoursesFromApi();
  }, []);

  // Save progress changes
  useEffect(() => {
    localStorage.setItem('shenova_courses_progress', JSON.stringify(courses));
  }, [courses]);

  // Handle Progress Increment
  const handleUpdateProgress = async (courseId) => {
    let nextProgress = 0;
    let courseTitle = '';

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          nextProgress = Math.min(100, c.progress + 35);
          courseTitle = c.title;
          return { ...c, progress: nextProgress };
        }
        return c;
      })
    );

    if (nextProgress >= 100) {
      toast.success(`🎉 Congratulations! You completed "${courseTitle}"!`);
    } else {
      toast.success(`Progress saved! Advanced to ${nextProgress}%.`);
    }

    try {
      await learningService.updateCourseProgress(courseId, nextProgress);
    } catch (err) {
      // Local state is already updated
    }
  };

  // Beginner-friendly learning tracks
  const learningPaths = [
    {
      title: '14-Day Modern Tech Refresh',
      duration: '2 Weeks • 4 hrs/wk',
      badge: 'Most Popular',
      desc: 'Quick modernization covering generative AI UX, Jira Cloud workflows, and modern analytics.',
      coursesCount: 3,
      trackRole: 'For Tech, Product & Ops Returners',
    },
    {
      title: 'Executive Presence & Confidence Track',
      duration: '10 Days • 3 hrs/wk',
      badge: 'Mindset Focus',
      desc: 'Transformative coaching on gap reframing, imposter syndrome elimination, and salary negotiation.',
      coursesCount: 3,
      trackRole: 'For Senior & Director Level Aspirants',
    },
    {
      title: 'Returner Leadership & Agile Operations',
      duration: '3 Weeks • 3.5 hrs/wk',
      badge: 'Operations Track',
      desc: 'Translating household orchestration into agile sprint velocity and stakeholder alignment.',
      coursesCount: 4,
      trackRole: 'For Operations, HR & Project Leads',
    },
  ];

  // Category filters
  const categories = [
    'All',
    'Technology',
    'Communication',
    'Business',
    'Professional Development',
  ];

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory === 'All') return true;
    return c.category === selectedCategory;
  });

  const recommendedCourses = courses.filter((c) => c.isRecommendedGap);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" size="sm">
              <GraduationCap className="w-3.5 h-3.5 mr-1" />
              Micro-Learning Hub
            </Badge>
            <Badge variant="demo" size="sm">
              Demo mode • Sample Curriculum
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Upskilling Sprints for Returning Talent
          </h1>
          <p className="text-sm text-ink-muted">
            30-minute daily micro-sprints designed around family schedules so you modernize your skill set without burnout.
          </p>
        </div>
      </div>

      {/* SECTION 1: RECOMMENDED FOR YOUR SKILL GAPS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <h2 className="font-heading font-bold text-lg text-ink">
              Recommended for Your Target Skill Gaps
            </h2>
          </div>
          <Badge variant="accent" size="sm">
            Based on Delta Scan
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCourses.map((rc) => (
            <Card
              key={rc.id}
              isHoverable
              className="flex flex-col justify-between border-2 border-primary-200 bg-secondary/15 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {rc.level}
                  </Badge>
                  <span className="text-xs text-ink-muted flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {rc.duration}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-sm text-ink line-clamp-2">
                  {rc.title}
                </h3>

                <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                  {rc.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-primary-200/60 space-y-2">
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>Progress</span>
                  <span className="font-bold text-ink">{rc.progress}%</span>
                </div>
                <ProgressBar
                  value={rc.progress}
                  height="sm"
                  variant={rc.progress === 100 ? 'success' : 'primary'}
                />

                <Button
                  variant={rc.progress === 100 ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full justify-center text-xs mt-1"
                  onClick={() => handleUpdateProgress(rc.id)}
                  leftIcon={
                    rc.progress === 100 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )
                  }
                >
                  {rc.progress === 100
                    ? 'Review Module'
                    : rc.progress > 0
                    ? 'Continue Sprint (+35%)'
                    : 'Start Sprint'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 2: BEGINNER-FRIENDLY LEARNING PATHS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-600" />
            <h2 className="font-heading font-bold text-lg text-ink">
              Structured Returner Learning Tracks
            </h2>
          </div>
          <span className="text-xs text-ink-muted">Guided Cohort Roadmaps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {learningPaths.map((path, idx) => (
            <Card key={idx} isHoverable className="flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" size="sm">
                    {path.badge}
                  </Badge>
                  <span className="text-xs text-primary-700 font-bold font-mono">
                    {path.duration}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-ink">
                  {path.title}
                </h3>

                <p className="text-xs text-ink-muted leading-relaxed">
                  {path.desc}
                </p>

                <div className="p-2 bg-surface-subtle rounded-xl text-[11px] text-ink-light flex items-center justify-between">
                  <span>{path.coursesCount} Micro-Modules</span>
                  <span className="font-semibold text-primary-700">{path.trackRole}</span>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-surface-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-xs"
                  onClick={() => toast.success(`Enrolled in "${path.title}" track!`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Enroll in Track
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 3: ALL MODULES (CATEGORY FILTER TABS) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-soft-sm'
                    : 'text-ink-muted hover:bg-surface-subtle hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-ink-muted">
            Showing <strong>{filteredCourses.length}</strong> self-paced modules
          </span>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((c) => (
            <Card
              key={c.id}
              isHoverable
              className="flex flex-col justify-between border border-surface-border bg-white"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" size="sm">
                    {c.category}
                  </Badge>
                  <span className="text-xs text-ink-muted font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {c.duration}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-sm text-ink line-clamp-2">
                  {c.title}
                </h3>

                <p className="text-xs text-primary-700 font-medium">
                  {c.provider} • <span className="text-ink-subtle">{c.level}</span>
                </p>

                <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">
                  {c.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-surface-border space-y-2">
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>Completion</span>
                  <span className="font-bold text-ink">{c.progress}%</span>
                </div>
                <ProgressBar
                  value={c.progress}
                  height="sm"
                  variant={c.progress === 100 ? 'success' : 'primary'}
                />

                <Button
                  variant={c.progress === 100 ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full justify-center text-xs mt-1"
                  onClick={() => handleUpdateProgress(c.id)}
                  leftIcon={
                    c.progress === 100 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )
                  }
                >
                  {c.progress === 100
                    ? 'Review Again'
                    : c.progress > 0
                    ? 'Continue Sprint (+35%)'
                    : 'Start Module'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* External Reputable Partner Platform Links */}
      <div className="p-4 bg-surface-subtle border border-surface-border rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <span className="font-bold text-ink font-heading block">
            Supplementary Recommended Learning Platforms
          </span>
          <p className="text-ink-muted text-[11px]">
            Certifications from accredited platforms seamlessly integrate into your SheNova returner resume.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://www.coursera.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-700 font-semibold hover:underline"
          >
            <span>Coursera</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.khanacademy.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-700 font-semibold hover:underline"
          >
            <span>Khan Academy</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.linkedin.com/learning"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-700 font-semibold hover:underline"
          >
            <span>LinkedIn Learning</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Learning;
