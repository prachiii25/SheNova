import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Target,
  Briefcase,
  GraduationCap,
  Heart,
  Layers,
  TrendingUp,
  RefreshCw,
  Edit3,
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
  Input,
  Select,
  Textarea,
  ProgressBar,
  Spinner,
} from '../components/ui';

import { roadmapService } from '../services/roadmapService';
import { useAuth } from '../hooks/useAuth';

export const Roadmap = () => {
  const { user } = useAuth();

  // Mode: 'form' (intake wizard) | 'timeline' (generated roadmap)
  const [viewMode, setViewMode] = useState('timeline');
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Education
    highestDegree: "Bachelor's Degree",
    fieldOfStudy: 'Computer Science / Engineering',
    gradYear: '2016',
    // Step 2: Prior Experience
    previousJobRole: 'Product Manager',
    yearsOfExperience: '5 years',
    previousIndustry: 'FinTech / SaaS Software',
    // Step 3: Career Break
    breakDuration: user?.breakDuration || '3.5 years',
    breakReason: user?.careerBreakReason || 'Motherhood & Childcare',
    pauseActivities: 'Primary childcare management, self-paced learning in AI tools',
    // Step 4: Aspirations & Preferences
    targetRole: user?.targetRole || 'Senior Product Manager',
    preferredWorkType: 'Remote / Flexible Hybrid',
    weeklyHours: '8 - 10 hours/week',
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch initial active roadmap on mount
  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const data = await roadmapService.getActiveRoadmap();
        setRoadmapData(data);
      } catch (err) {
        console.warn('Error loading active roadmap:', err);
      }
    };
    loadRoadmap();
  }, []);

  // Step Validation
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.highestDegree) errors.highestDegree = 'Degree is required.';
      if (!formData.fieldOfStudy.trim()) errors.fieldOfStudy = 'Field of study is required.';
    } else if (step === 2) {
      if (!formData.previousJobRole.trim()) errors.previousJobRole = 'Previous role is required.';
      if (!formData.yearsOfExperience) errors.yearsOfExperience = 'Years of experience is required.';
    } else if (step === 3) {
      if (!formData.breakDuration) errors.breakDuration = 'Break duration is required.';
      if (!formData.breakReason) errors.breakReason = 'Reason for pause is required.';
    } else if (step === 4) {
      if (!formData.targetRole.trim()) errors.targetRole = 'Target role is required.';
      if (!formData.preferredWorkType) errors.preferredWorkType = 'Preferred work type is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
    } else {
      toast.error('Please complete the required fields in this step.');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitIntake = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await roadmapService.generateRoadmap(formData);
      setRoadmapData(generated);
      await roadmapService.saveRoadmap(generated);
      setViewMode('timeline');
      toast.success('Your 60-day AI Return Roadmap has been generated!');
    } catch (err) {
      toast.error('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle subtask completion
  const handleToggleTask = (milestoneId, taskIdx) => {
    if (!roadmapData) return;

    const updatedMilestones = roadmapData.milestones.map((m) => {
      if (m.id === milestoneId) {
        const updatedTasks = m.tasks.map((t, idx) =>
          idx === taskIdx ? { ...t, done: !t.done } : t
        );
        const allDone = updatedTasks.every((t) => t.done);
        const someDone = updatedTasks.some((t) => t.done);

        return {
          ...m,
          tasks: updatedTasks,
          status: allDone ? 'completed' : someDone ? 'in-progress' : 'upcoming',
        };
      }
      return m;
    });

    const updatedRoadmap = { ...roadmapData, milestones: updatedMilestones };
    setRoadmapData(updatedRoadmap);
    roadmapService.saveRoadmap(updatedRoadmap);
    roadmapService.toggleMilestone(milestoneId, updatedMilestones.find(m => m.id === milestoneId)?.status === 'completed');
    toast.success('Roadmap milestone task updated!');
  };

  // Calculate overall task progress
  const allTasks = roadmapData?.milestones?.flatMap((m) => m.tasks) || [];
  const completedTasks = allTasks.filter((t) => t.done).length;
  const progressPercentage = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">
              <Compass className="w-3.5 h-3.5 mr-1" />
              AI Adaptive Engine
            </Badge>
            <Badge variant="demo" size="sm">
              Demo mode • Realistic sample output
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Career Restart Roadmap
          </h1>
          <p className="text-sm text-ink-muted">
            Personalized 60-day ramp calibrated to your career break duration and target leadership goals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {viewMode === 'timeline' ? (
            <Button
              variant="outline"
              onClick={() => {
                setViewMode('form');
                setCurrentStep(1);
              }}
              leftIcon={<Edit3 className="w-4 h-4 text-primary-600" />}
            >
              Edit Intake & Recalibrate
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setViewMode('timeline')}
            >
              Cancel & View Timeline
            </Button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: MULTI-STEP INTAKE FORM */}
      {/* ============================================================ */}
      {viewMode === 'form' && (
        <Card className="max-w-3xl mx-auto border border-surface-border shadow-soft-md">
          {/* Stepper Header */}
          <div className="p-6 border-b border-surface-border bg-surface-subtle/50 rounded-t-2xl">
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-ink-muted uppercase tracking-wider font-heading">
              <span>Step {currentStep} of 4</span>
              <span>
                {currentStep === 1 && 'Academic Foundation'}
                {currentStep === 2 && 'Prior Career Track'}
                {currentStep === 3 && 'Career Break Context'}
                {currentStep === 4 && 'Target Direction'}
              </span>
            </div>
            <ProgressBar value={(currentStep / 4) * 100} height="sm" variant="gradient" />
          </div>

          <form onSubmit={handleSubmitIntake} className="p-6 sm:p-8 space-y-6">
            {/* STEP 1: EDUCATION */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1 mb-2">
                  <h3 className="font-heading font-bold text-lg text-ink">
                    Education & Credentials
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Your degrees provide foundational depth that never expires.
                  </p>
                </div>

                <Select
                  label="Highest Degree Earned"
                  value={formData.highestDegree}
                  onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })}
                  options={[
                    "Bachelor's Degree",
                    "Master's / Post-Graduate Degree",
                    'Doctorate / Ph.D.',
                    'Diploma / Professional Certificate',
                  ]}
                  error={formErrors.highestDegree}
                  required
                />

                <Input
                  label="Field of Study / Major"
                  placeholder="e.g. Computer Science, Business Administration, Economics"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  error={formErrors.fieldOfStudy}
                  required
                />

                <Input
                  label="Graduation Year"
                  type="number"
                  placeholder="e.g. 2016"
                  value={formData.gradYear}
                  onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                />
              </div>
            )}

            {/* STEP 2: PREVIOUS EXPERIENCE */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1 mb-2">
                  <h3 className="font-heading font-bold text-lg text-ink">
                    Previous Career Experience
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Tell us where you excelled before your pause so we map retained leadership.
                  </p>
                </div>

                <Input
                  label="Previous Job Role / Title"
                  placeholder="e.g. Product Manager, Senior QA Engineer, Financial Analyst"
                  value={formData.previousJobRole}
                  onChange={(e) => setFormData({ ...formData, previousJobRole: e.target.value })}
                  error={formErrors.previousJobRole}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Years of Experience (Pre-Break)"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    options={['1 - 2 years', '3 - 5 years', '6 - 9 years', '10+ years']}
                    error={formErrors.yearsOfExperience}
                    required
                  />

                  <Input
                    label="Industry / Domain"
                    placeholder="e.g. FinTech, Healthcare, E-Commerce"
                    value={formData.previousIndustry}
                    onChange={(e) => setFormData({ ...formData, previousIndustry: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: CAREER BREAK CONTEXT */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1 mb-2">
                  <h3 className="font-heading font-bold text-lg text-ink">
                    Career Pause Circumstances
                  </h3>
                  <p className="text-xs text-ink-muted">
                    In SheNova, your pause is validated with dignity—never penalized.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Duration of Career Break"
                    value={formData.breakDuration}
                    onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })}
                    options={['Under 1 year', '1 - 2 years', '2 - 4 years', '5+ years']}
                    error={formErrors.breakDuration}
                    required
                  />

                  <Select
                    label="Primary Context for Pause"
                    value={formData.breakReason}
                    onChange={(e) => setFormData({ ...formData, breakReason: e.target.value })}
                    options={[
                      'Motherhood & Childcare',
                      'Marriage & Relocation',
                      'Elder Care & Family Support',
                      'Health & Personal Recovery',
                      'Career Pivot & Upskilling',
                    ]}
                    error={formErrors.breakReason}
                    required
                  />
                </div>

                <Textarea
                  label="Any learning, volunteer or leadership during pause"
                  placeholder="e.g. Managed household budget, self-taught Python, school board volunteer..."
                  value={formData.pauseActivities}
                  onChange={(e) => setFormData({ ...formData, pauseActivities: e.target.value })}
                  helperText="These real-world responsibilities highlight resilience and priority management."
                />
              </div>
            )}

            {/* STEP 4: TARGET GOALS & PREFERENCES */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1 mb-2">
                  <h3 className="font-heading font-bold text-lg text-ink">
                    Target Direction & Work Preferences
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Customize your schedule so your return path harmonizes with your life.
                  </p>
                </div>

                <Input
                  label="Target Return Role"
                  placeholder="e.g. Senior Product Manager, Technical Lead, Operations Lead"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  error={formErrors.targetRole}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Preferred Work Type"
                    value={formData.preferredWorkType}
                    onChange={(e) => setFormData({ ...formData, preferredWorkType: e.target.value })}
                    options={[
                      'Remote / Flexible Hybrid',
                      'Returnship Cohort (6 Months Ramp)',
                      'Full-Time On-Site / Hybrid',
                      'Part-Time / High Flexibility',
                    ]}
                    required
                  />

                  <Select
                    label="Available Learning Hours"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                    options={[
                      '4 - 6 hours/week (Gentle pace)',
                      '8 - 10 hours/week (Recommended)',
                      '12+ hours/week (Accelerated)',
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-surface-border flex items-center justify-between">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Step {currentStep + 1}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isGenerating}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                  className="font-bold shadow-soft-md"
                >
                  Generate AI Return Roadmap
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: INTERACTIVE ROADMAP TIMELINE */}
      {/* ============================================================ */}
      {viewMode === 'timeline' && roadmapData && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Strip */}
          <Card className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 text-white rounded-3xl p-6 sm:p-8 border-none shadow-soft-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent" size="sm" className="bg-white/20 text-white border-white/30">
                    60-Day Return Plan
                  </Badge>
                  <span className="text-xs text-primary-200">
                    Target: <strong className="text-white">{roadmapData.summary.targetRole}</strong>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  Your Return-to-Work Roadmap
                </h2>
                <p className="text-xs sm:text-sm text-primary-100 leading-relaxed max-w-xl">
                  Calibrated for {roadmapData.summary.breakDuration} pause duration • {roadmapData.summary.weeklyHourCommitment} • {roadmapData.summary.workType}.
                </p>
              </div>

              {/* Progress Ring Stat */}
              <div className="md:col-span-4 flex flex-col items-center sm:items-end justify-center">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center w-full sm:w-auto">
                  <span className="text-[11px] uppercase tracking-wider text-primary-200 font-bold block">
                    Milestone Completion
                  </span>
                  <div className="text-3xl font-heading font-black text-white mt-0.5">
                    {progressPercentage}%
                  </div>
                  <span className="text-[11px] text-accent-300 block">
                    {completedTasks} of {allTasks.length} action items done
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Section: Learning Goals & Recommended Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Learning Goals */}
            <Card className="lg:col-span-6 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Core Learning Objectives</CardTitle>
                  <Badge variant="demo" size="sm">Sample Goals</Badge>
                </div>
                <CardDescription>Target milestones to attain full returnship readiness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {roadmapData.learningGoals.map((goal, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-subtle border border-surface-border text-xs leading-relaxed text-ink"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>{goal}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Skills */}
            <Card className="lg:col-span-6 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recommended Modern Skills</CardTitle>
                  <Badge variant="accent" size="sm">Priority Delta</Badge>
                </div>
                <CardDescription>Tools and competencies prioritized by returnship recruiters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {roadmapData.recommendedSkills.map((sk, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-surface-border bg-white text-xs"
                  >
                    <div className="flex items-center gap-2 font-medium text-ink">
                      <Target className="w-4 h-4 text-primary-600" />
                      <span>{sk.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {sk.type}
                      </Badge>
                      <Badge
                        variant={sk.priority === 'High' ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        {sk.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Section: Suggested Career Pathways */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-ink">
                Suggested Career Return Pathways
              </h3>
              <Badge variant="demo" size="sm">Market Benchmarks</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadmapData.suggestedCareerPaths.map((cp, idx) => (
                <Card key={idx} isHoverable className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" size="sm">
                        {cp.timeline}
                      </Badge>
                      <span className="text-xs font-bold text-emerald-600 font-heading">
                        {cp.fit}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-ink">{cp.title}</h4>
                    <p className="text-xs text-ink-muted leading-relaxed">{cp.description}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-surface-border/60">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-primary-600 justify-start px-0 hover:bg-transparent"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Explore Roles
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section: Interactive 4-Phase Timeline with Checkable Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-ink">
                  Interactive 60-Day Milestones
                </h3>
                <p className="text-xs text-ink-muted">
                  Click the checkboxes as you complete items to advance your readiness percentage.
                </p>
              </div>
              <Badge variant="primary" size="md">
                Phase {roadmapData.milestones.filter((m) => m.status === 'completed').length + 1} Active
              </Badge>
            </div>

            <div className="space-y-6">
              {roadmapData.milestones.map((milestone) => (
                <Card
                  key={milestone.id}
                  className={`border transition-all ${
                    milestone.status === 'completed'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : milestone.status === 'in-progress'
                      ? 'border-primary-300 shadow-soft-sm'
                      : 'border-surface-border'
                  }`}
                >
                  <CardHeader className="pb-3 border-b border-surface-border/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider font-heading text-primary-700">
                            {milestone.phase}
                          </span>
                          <Badge
                            variant={
                              milestone.status === 'completed'
                                ? 'success'
                                : milestone.status === 'in-progress'
                                ? 'primary'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      </div>
                      <span className="text-xs text-ink-muted">{milestone.description}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-2.5">
                    {milestone.tasks.map((task, tIdx) => (
                      <div
                        key={tIdx}
                        onClick={() => handleToggleTask(milestone.id, tIdx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          task.done
                            ? 'bg-white border-emerald-200 text-ink-muted'
                            : 'bg-white border-surface-border hover:border-primary-300 hover:bg-primary-50/20 text-ink'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-ink-subtle"
                          aria-label={task.done ? 'Mark incomplete' : 'Mark done'}
                        >
                          {task.done ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-surface-border hover:border-primary-500" />
                          )}
                        </button>
                        <span
                          className={`text-xs sm:text-sm leading-relaxed ${
                            task.done ? 'line-through text-ink-muted' : 'font-medium'
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
