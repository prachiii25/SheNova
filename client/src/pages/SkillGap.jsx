import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
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
  Select,
  Textarea,
  Input,
} from '../components/ui';

import { skillGapService, PRESET_TARGET_ROLES } from '../services/skillGapService';
import { useAuth } from '../hooks/useAuth';

export const SkillGap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [selectedRole, setSelectedRole] = useState(user?.targetRole || 'Senior Product Manager');
  const [enteredSkills, setEnteredSkills] = useState(
    'Product Roadmapping, Agile/Scrum, User Discovery, Jira, Google Analytics, Wireframing, Stakeholder Presentations'
  );
  const [breakDuration, setBreakDuration] = useState(user?.breakDuration || '3.5 years');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Initial load: Run benchmark delta analysis
  useEffect(() => {
    const fetchInitialAnalysis = async () => {
      try {
        const res = await skillGapService.analyzeSkills({
          targetRole: selectedRole,
          previousSkills: enteredSkills,
          breakDuration,
        });
        setAnalysisResult(res);
      } catch (err) {
        console.warn('Error fetching initial skill gap analysis:', err);
      }
    };
    fetchInitialAnalysis();
  }, []);

  const handleRunAnalysis = async (e) => {
    e?.preventDefault();
    if (!enteredSkills.trim()) {
      toast.error('Please enter at least a few of your prior skills.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await skillGapService.analyzeSkills({
        targetRole: selectedRole,
        previousSkills: enteredSkills,
        breakDuration,
      });
      setAnalysisResult(res);
      toast.success(`Skill gap re-indexed against 2026 standards for "${selectedRole}"!`);
    } catch (err) {
      toast.error('Failed to analyze skills. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" size="sm">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Market Delta Engine
            </Badge>
            <Badge variant="demo" size="sm">
              Demo mode • Realistic delta calculations
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Skill-Gap Analyzer
          </h1>
          <p className="text-sm text-ink-muted">
            Pinpoints exactly what changed in your domain while you were away, so you only learn what truly matters.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleRunAnalysis}
          isLoading={isAnalyzing}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Re-Analyze Delta
        </Button>
      </div>

      {/* SECTION 1: TARGET ROLE & PREVIOUS SKILLS CONFIGURATION CARD */}
      <Card className="border border-surface-border shadow-soft-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Role & Background Configuration</CardTitle>
              <CardDescription>Select your desired return role and review prior competencies</CardDescription>
            </div>
            <span className="text-xs text-ink-muted">Adaptive Matrix</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Target Role to Analyze"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              options={PRESET_TARGET_ROLES}
            />

            <Select
              label="Career Break Length"
              value={breakDuration}
              onChange={(e) => setBreakDuration(e.target.value)}
              options={['Under 1 year', '1 - 2 years', '2 - 4 years', '5+ years']}
            />
          </div>

          <Textarea
            label="Your Prior Skills & Tools"
            rows={2}
            value={enteredSkills}
            onChange={(e) => setEnteredSkills(e.target.value)}
            helperText="Separate with commas. The AI assesses retained strengths versus tools that evolved."
          />
        </CardContent>
        <CardFooter className="justify-between pt-2">
          <span className="text-xs text-ink-muted">
            💡 <strong>Insight:</strong> Over 65% of your core foundational knowledge remains intact.
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRunAnalysis}
            isLoading={isAnalyzing}
          >
            Run Delta Scan
          </Button>
        </CardFooter>
      </Card>

      {/* SECTION 2: ANALYSIS RESULTS */}
      {analysisResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Match Score Banner */}
          <div className="bg-gradient-to-r from-primary-800 via-primary-700 to-accent-600 rounded-3xl p-6 sm:p-8 text-white shadow-soft-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <Badge variant="accent" size="sm" className="bg-white/20 text-white border-white/30">
                  Target Fit Index
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  {analysisResult.matchScore}% Immediate Readiness for {analysisResult.targetRole}
                </h2>
                <p className="text-xs sm:text-sm text-primary-100 leading-relaxed">
                  You possess {analysisResult.skillsSummary.strongMatchCount} high-retention competencies. You only need to bridge <strong>{analysisResult.skillsSummary.deltaRefreshCount} evolved tools</strong> and <strong>{analysisResult.skillsSummary.criticalMissingCount} emerging standard</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/learning')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Upskilling Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Current vs. Required Skills Progress Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-7 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Current vs. Required Skills Comparison</CardTitle>
                    <CardDescription>Progress bars calibrate retained ability against 2026 returnship baselines</CardDescription>
                  </div>
                  <Badge variant="demo" size="sm">Demo Data</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {(analysisResult.skillsComparison || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-ink">{item.skill}</span>
                        <Badge
                          variant={
                            item.status === 'strong'
                              ? 'success'
                              : item.status === 'outdated'
                              ? 'warning'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {item.status === 'strong'
                            ? 'Retained Strong'
                            : item.status === 'outdated'
                            ? 'Tooling Evolved'
                            : 'Emerging Gap'}
                        </Badge>
                      </div>
                      <span className="text-ink-muted font-mono font-medium">
                        Current: {item.currentScore}% • Target: {item.requiredScore}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <ProgressBar
                        value={item.currentScore}
                        height="sm"
                        variant={item.status === 'strong' ? 'success' : item.status === 'outdated' ? 'primary' : 'accent'}
                      />
                    </div>

                    <p className="text-[11px] text-ink-muted leading-relaxed">{item.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Flagged Missing / Outdated Skills */}
            <Card className="lg:col-span-5 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle>Flagged Tooling Shifts</CardTitle>
                    <Badge variant="accent" size="sm">Actionable</Badge>
                  </div>
                </div>
                <CardDescription>What changed while you were on career pause</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3.5">
                {(analysisResult.flaggedGaps || analysisResult.flaggedOutdatedSkills || []).map((gap, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-surface-border bg-white shadow-soft-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-xs text-ink">{gap.skill || gap.legacy}</span>
                      <Badge
                        variant={gap.severity === 'High' ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        {gap.type || 'Tooling Shift'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-ink-muted leading-relaxed">{gap.reason}</p>
                    <div className="pt-2 border-t border-surface-border/50 text-[11px] text-primary-700 font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-accent-500" />
                      <span>{gap.action || gap.modernReplacement || 'Updated standard in 2026'}</span>
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="justify-between pt-2">
                <span className="text-xs text-ink-muted">All courses available in SheNova Hub</span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}>
                  Browse All Hub Sprints
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* SECTION 3: RECOMMENDED COURSES & MICRO-SPRINTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-ink">
                  Targeted Delta Upskilling Sprints
                </h3>
                <p className="text-xs text-ink-muted">
                  Bite-sized modules (1 - 3 hours) designed to bridge specific flagged items without overload
                </p>
              </div>
              <Badge variant="secondary" size="sm">3 Recommended</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(analysisResult.recommendedCourses || []).map((course, idx) => (
                <Card key={course.id || idx} isHoverable className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" size="sm">
                        {course.duration || '2.0 Hours'}
                      </Badge>
                      <Badge
                        variant={(course.level || '').includes('High') ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        {course.level || 'Recommended'}
                      </Badge>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-ink">{course.title}</h4>
                    <p className="text-xs text-primary-700 font-medium">{course.provider || 'SheNova Hub'}</p>
                    <span className="text-[11px] text-ink-muted block">{course.format || course.focus || 'Micro-Sprint'}</span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-surface-border/60">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-center text-xs"
                      onClick={() => {
                        toast.success(`Launching sprint: ${course.title}`);
                        navigate('/learning');
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Start Sprint
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* SECTION 4: STEP-BY-STEP UPSKILLING PLAN */}
          <Card className="border border-surface-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Step-by-Step 6-Week Upskilling Roadmap</CardTitle>
                  <CardDescription>Paced sequence focusing on high-ROI skills first</CardDescription>
                </div>
                <Badge variant="primary" size="sm">Structured Sequence</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(analysisResult.stepByStepUpskillingPlan || analysisResult.upskillingPlan || []).map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-surface-subtle border border-surface-border flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 font-heading">
                          Phase {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-ink-muted">{phase.timeEstimate || phase.week || phase.hours}</span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-ink">{phase.phase || phase.title}</h4>
                      <p className="text-xs text-primary-800 font-medium">{phase.focus || phase.milestone}</p>

                      <ul className="space-y-1.5 pt-2 text-xs text-ink-light">
                        {(phase.items || (phase.milestone ? [phase.milestone] : [])).map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SkillGap;
