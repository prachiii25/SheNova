import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  FileText,
  Briefcase,
  Mic,
  GraduationCap,
  Users,
  User,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  BookOpen,
  Award,
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
  Modal,
  Skeleton,
  EmptyState,
} from '../components/ui';

// Context & Data
import { useAuth } from '../hooks/useAuth';
import {
  DEMO_USER,
  DEMO_CAREER_PROGRESS_STEPS,
  DEMO_RESUME_METRICS,
  DEMO_SKILL_PROGRESS,
  DEMO_UPCOMING_ACTIVITIES,
  DEMO_JOBS,
} from '../data/mockData';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State to support skeleton loading and empty state toggles
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUserView, setIsNewUserView] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [readinessScore, setReadinessScore] = useState(DEMO_USER.readinessScore || 78);

  // Simulate smooth initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleSimulateCheckin = (delta) => {
    setReadinessScore((prev) => Math.min(100, prev + delta));
    setIsCheckinModalOpen(false);
    toast.success(`Confidence logged! Readiness calibrated to ${Math.min(100, readinessScore + delta)}%.`);
  };

  // Quick Access Tiles Configuration
  const quickAccessTiles = [
    {
      title: 'Career Roadmap',
      desc: 'Paced 60-day plan',
      icon: Target,
      path: '/roadmap',
      color: 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white',
    },
    {
      title: 'Skill Gap Analyzer',
      desc: 'Market delta scanner',
      icon: TrendingUp,
      path: '/skill-gap',
      color: 'bg-accent-50 text-accent-600 group-hover:bg-accent-500 group-hover:text-white',
    },
    {
      title: 'Resume Builder',
      desc: 'ATS gap-friendly',
      icon: FileText,
      path: '/resume-builder',
      color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
      title: 'Returnship Jobs',
      desc: '3 active matches',
      icon: Briefcase,
      path: '/jobs',
      color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
    },
    {
      title: 'AI Mock Interview',
      desc: 'Practice gap questions',
      icon: Mic,
      path: '/interview',
      color: 'bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white',
    },
    {
      title: 'Learning Hub',
      desc: '30-min micro sprints',
      icon: GraduationCap,
      path: '/learning',
      color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
    },
    {
      title: 'Sisterhood Circle',
      desc: 'Peer community',
      icon: Users,
      path: '/community',
      color: 'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white',
    },
    {
      title: 'My Profile',
      desc: 'Account preferences',
      icon: User,
      path: '/profile',
      color: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    },
  ];

  // 1. SKELETON LOADING VIEW
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fadeIn" aria-busy="true" aria-label="Loading dashboard data">
        <div className="bg-white rounded-3xl p-8 border border-surface-border shadow-soft-sm space-y-4">
          <Skeleton variant="title" width="40%" height={32} />
          <Skeleton variant="text" width="60%" height={18} />
          <div className="pt-2 flex gap-3">
            <Skeleton width={140} height={40} rounded="rounded-xl" />
            <Skeleton width={140} height={40} rounded="rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton variant="card" height={220} />
            <Skeleton variant="card" height={260} />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton variant="card" height={220} />
            <Skeleton variant="card" height={260} />
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY STATE VIEW (For brand new users who haven't generated a plan yet)
  if (isNewUserView) {
    return (
      <div className="space-y-6 py-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div>
            <h2 className="text-2xl font-heading font-extrabold text-ink">Welcome to SheNova</h2>
            <p className="text-sm text-ink-muted">Previewing state for brand new returner accounts</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNewUserView(false)}
            leftIcon={<Eye className="w-4 h-4" />}
          >
            Switch to Active Returner View
          </Button>
        </div>

        <EmptyState
          icon={Target}
          title="Your Career Restart Plan is Ready to Generate"
          description="You haven't generated your personalized 60-day roadmap yet. Tell us your previous domain and career pause details to get started."
          isDemo={true}
          action={
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/roadmap')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Generate My 60-Day Return Roadmap
            </Button>
          }
        />
      </div>
    );
  }

  // 3. FULL POPULATED DASHBOARD VIEW
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Controls Bar: View mode toggle & Demo indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Badge variant="demo" size="sm">
            Demo data active
          </Badge>
          <span className="text-ink-muted hidden sm:inline">
            Personalized for {user?.name || DEMO_USER.name} • {user?.careerBreakReason || DEMO_USER.careerBreak.reason}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNewUserView(true)}
            className="text-[11px] font-semibold text-primary-700 hover:text-primary-800 bg-secondary px-2.5 py-1 rounded-lg border border-primary-200 transition-colors"
          >
            Test New User Empty State
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
            className="text-[11px] text-ink-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-surface-subtle transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Reload Skeletons
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO WELCOME BANNER */}
      <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-accent-600 rounded-3xl p-6 sm:p-8 text-white shadow-soft-lg relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm" className="bg-white/20 text-white border-white/30 font-semibold">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Active Returner Track
              </Badge>
              <span className="text-xs text-primary-100 font-medium">
                Targeting: <strong className="text-white">{user?.targetRole || DEMO_USER.title}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || DEMO_USER.name}!
            </h1>

            <p className="text-primary-100 text-xs sm:text-sm leading-relaxed">
              Your {user?.breakDuration || DEMO_USER.careerBreak.duration} career pause is an asset of executive resilience. You are currently <strong>78% ready</strong> to step back into senior leadership returnships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsCheckinModalOpen(true)}
              leftIcon={<Sparkles className="w-4 h-4 text-primary-600" />}
              className="shadow-soft-sm font-semibold"
            >
              Weekly Confidence Check-in
            </Button>
          </div>
        </div>
      </div>

      {/* SECTION 2: CAREER RESTART PROGRESS STEPPER & RING CHART */}
      <Card className="border border-surface-border shadow-soft-sm overflow-hidden">
        <CardHeader className="border-b border-surface-border/60 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Career Restart Milestone Stepper</CardTitle>
                <Badge variant="demo" size="sm">Sample Track</Badge>
              </div>
              <CardDescription>
                Your structured 5-phase pathway from career pause to high-impact returnship placement.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 pt-2 sm:pt-0">
              <span className="text-xs text-ink-muted">Overall Readiness:</span>
              <Badge variant="primary" size="lg" className="font-extrabold text-sm">
                {readinessScore}%
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Circular Ring Chart */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-surface-subtle/50 rounded-2xl border border-surface-border text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Ring Meter */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="#EDE5F7"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="#7041A6"
                    strokeWidth="10"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * readinessScore) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-heading font-extrabold text-2xl text-ink">
                    {readinessScore}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
                    Readiness
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <span className="text-xs font-bold text-ink font-heading block">
                  Phase 3 of 5 In Progress
                </span>
                <p className="text-[11px] text-ink-muted max-w-[200px]">
                  Estimated 12 days to full returnship readiness
                </p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="lg:col-span-8 space-y-3">
              {DEMO_CAREER_PROGRESS_STEPS.map((st, idx) => (
                <div
                  key={st.id}
                  className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all ${
                    st.status === 'in-progress'
                      ? 'bg-primary-50/50 border-primary-200'
                      : st.status === 'completed'
                      ? 'bg-surface-subtle/30 border-surface-border'
                      : 'bg-white border-surface-border/60 opacity-70'
                  }`}
                >
                  <div className="mt-0.5">
                    {st.status === 'completed' ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-soft-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : st.status === 'in-progress' ? (
                      <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-soft-sm animate-pulse">
                        <span className="text-xs font-bold">{st.step}</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-surface-border text-ink-muted flex items-center justify-center text-xs font-semibold">
                        {st.step}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading font-bold text-sm text-ink truncate">
                        {st.name}
                      </h4>
                      <Badge
                        variant={
                          st.status === 'completed'
                            ? 'success'
                            : st.status === 'in-progress'
                            ? 'primary'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {st.date}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed mt-0.5">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: RESUME HEALTH & SKILL PROGRESS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Resume Completion Card */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gap-Friendly Resume Health</CardTitle>
                <CardDescription>Calibrated against top returnship ATS screeners</CardDescription>
              </div>
              <Badge variant="success" size="md">
                {DEMO_RESUME_METRICS.overallScore}% ATS Score
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ProgressBar
              value={DEMO_RESUME_METRICS.overallScore}
              height="md"
              variant="gradient"
              showLabel={true}
              label="Overall Resume Completeness"
              labelPosition="top"
            />

            <div className="space-y-2 pt-2">
              {DEMO_RESUME_METRICS.sections.map((sec, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-surface-subtle border border-surface-border text-xs"
                >
                  <div className="flex items-center gap-2">
                    {sec.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-medium text-ink">{sec.name}</span>
                  </div>
                  <span className="font-semibold text-ink-muted">{sec.score}%</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-secondary/50 rounded-xl border border-primary-100 text-xs text-primary-900 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
              <span>{DEMO_RESUME_METRICS.tips}</span>
            </div>
          </CardContent>

          <CardFooter className="justify-between pt-3">
            <span className="text-xs text-ink-muted">Format: Returnship Leadership Focus</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/resume-builder')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Resume Builder
            </Button>
          </CardFooter>
        </Card>

        {/* Right: Skill Development Progress Bars */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Skill Delta Refresh</CardTitle>
                <CardDescription>Track learning sprints bridging modern workflow shifts</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/skill-gap')}
                className="text-primary-700"
              >
                View Skill Matrix
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {DEMO_SKILL_PROGRESS.map((skill) => (
              <div key={skill.id} className="space-y-1.5 p-3 rounded-xl bg-surface-subtle border border-surface-border">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink font-heading">{skill.name}</span>
                    <Badge variant="outline" size="sm">
                      {skill.category}
                    </Badge>
                  </div>
                  <span className="text-ink-muted font-mono">
                    {skill.hoursInvested} / {skill.target}
                  </span>
                </div>

                <ProgressBar
                  value={skill.progress}
                  height="sm"
                  variant={skill.progress >= 90 ? 'success' : 'primary'}
                />

                <div className="flex justify-between items-center text-[11px] text-ink-muted pt-0.5">
                  <span>Status: <strong className="text-ink font-semibold">{skill.status}</strong></span>
                  <span className="font-bold text-primary-700">{skill.progress}% Rebuilt</span>
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="justify-between pt-3">
            <span className="text-xs text-ink-muted">Next recommended sprint: GenAI User Flow Patterns (30m)</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/learning')}
            >
              Start Next Sprint
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* SECTION 4: UPCOMING LEARNING ACTIVITIES & RECOMMENDED JOBS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Learning & Activities */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Activities</CardTitle>
              <Badge variant="accent" size="sm">This Week</Badge>
            </div>
            <CardDescription>Paced micro-commitments suited for busy days</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {DEMO_UPCOMING_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                onClick={() => navigate(act.route)}
                className="p-3.5 rounded-xl border border-surface-border hover:border-primary-200 hover:bg-primary-50/40 cursor-pointer transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" size="sm">
                    {act.type}
                  </Badge>
                  <span className="text-[11px] text-ink-subtle">{act.time}</span>
                </div>
                <h4 className="font-heading font-bold text-xs text-ink">{act.title}</h4>
                <div className="flex items-center justify-between text-xs text-primary-600 font-semibold pt-1">
                  <span>Begin activity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="justify-between pt-2">
            <span className="text-xs text-ink-muted">Sisterhood community active</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/community')}>
              Join Circle
            </Button>
          </CardFooter>
        </Card>

        {/* Right: Recommended Returnship Jobs (3 Cards linking to /jobs) */}
        <Card className="lg:col-span-8 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Recommended Returnship Programs</CardTitle>
                  <Badge variant="demo" size="sm">Sample Roles</Badge>
                </div>
                <CardDescription>Verified corporate partners actively seeking women returning to work</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/jobs')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All Jobs
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DEMO_JOBS.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate('/jobs')}
                  className="p-4 rounded-2xl border border-surface-border hover:border-primary-300 hover:shadow-soft-md transition-all bg-white flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <Badge variant="secondary" size="sm" className="text-[10px]">
                        {job.type.includes('Returnship') ? 'Returnship' : 'Returner Friendly'}
                      </Badge>
                      <Badge variant="demo" size="sm">Sample</Badge>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-ink group-hover:text-primary-700 transition-colors line-clamp-2">
                      {job.title}
                    </h4>

                    <p className="text-xs font-semibold text-primary-700 truncate">
                      {job.company}
                    </p>

                    <p className="text-[11px] text-ink-muted line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-surface-border/60 space-y-2">
                    <div className="flex items-center justify-between text-xs text-ink font-bold">
                      <span>{job.stipend}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-primary-600 font-semibold group-hover:underline">
                      <span>Review & Apply</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="justify-between pt-2">
            <span className="text-xs text-ink-muted">
              🛡️ Never marking unverified employers. All listings tagged Sample for demonstration.
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* SECTION 5: QUICK-ACCESS TILES TO ALL SHE NOVA FEATURES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-ink">SheNova Companion Suite</h3>
            <p className="text-xs text-ink-muted">Direct shortcuts to every module in your career restart workspace</p>
          </div>
          <Badge variant="secondary" size="sm">8 Working Modules</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
          {quickAccessTiles.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => navigate(tile.path)}
                className="p-4 rounded-2xl bg-white border border-surface-border hover:border-primary-300 hover:shadow-soft-md transition-all text-left flex flex-col justify-between group h-28"
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${tile.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-subtle group-hover:text-primary-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-ink group-hover:text-primary-700 transition-colors truncate">
                    {tile.title}
                  </h4>
                  <p className="text-[11px] text-ink-muted truncate">{tile.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* WEEKLY CONFIDENCE CHECK-IN MODAL */}
      <Modal
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        title="Weekly Returner Confidence Check-in"
        description="A moment of self-reflection to calibrate your pacing without stress."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCheckinModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSimulateCheckin(3)}>
              Log Steady & Update
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm text-ink">
          <p className="leading-relaxed">
            How balanced did your week feel between family responsibilities and learning sprints?
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleSimulateCheckin(1)}
              className="p-3 rounded-xl border border-surface-border hover:border-primary-400 hover:bg-primary-50 text-center transition-colors space-y-1"
            >
              <span className="text-xl block">🌱</span>
              <span className="font-heading font-bold text-xs block text-ink">Pacing Slow</span>
              <span className="text-[10px] text-ink-muted block">Life was busy</span>
            </button>

            <button
              type="button"
              onClick={() => handleSimulateCheckin(3)}
              className="p-3 rounded-xl border-2 border-primary-500 bg-primary-50/50 text-center transition-colors space-y-1"
            >
              <span className="text-xl block">⚡</span>
              <span className="font-heading font-bold text-xs block text-primary-800">Steady Progress</span>
              <span className="text-[10px] text-primary-700 block">Completed 2 sprints</span>
            </button>

            <button
              type="button"
              onClick={() => handleSimulateCheckin(5)}
              className="p-3 rounded-xl border border-surface-border hover:border-primary-400 hover:bg-primary-50 text-center transition-colors space-y-1"
            >
              <span className="text-xl block">🚀</span>
              <span className="font-heading font-bold text-xs block text-ink">Empowered & Ready</span>
              <span className="text-[10px] text-ink-muted block">Ready for interviews</span>
            </button>
          </div>

          <div className="p-3 bg-secondary/50 rounded-xl text-xs text-primary-900 border border-primary-100 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <span>
              Checking in updates your readiness index and adjusts suggested daily micro-learning duration automatically.
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
