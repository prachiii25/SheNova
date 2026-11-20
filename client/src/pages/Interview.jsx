import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Mic,
  MicOff,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Volume2,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  BarChart3,
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
} from '../components/ui';

import {
  interviewService,
  INTERVIEW_ROLES,
  DIFFICULTY_LEVELS,
} from '../services/interviewService';
import { useAuth } from '../hooks/useAuth';

export const Interview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Workflow Phases: 'setup' | 'interview' | 'feedback' | 'report'
  const [phase, setPhase] = useState('setup');

  // Setup Form State
  const [selectedRole, setSelectedRole] = useState(
    user?.targetRole || 'Senior Product Manager'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState('standard');
  const [sessionId, setSessionId] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Interview Questions & Answers
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answersHistory, setAnswersHistory] = useState([]);

  // Timer State (in seconds)
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Loading States
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  // Copied model answer state
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  // Live Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && phase === 'interview') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, phase]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Phase 1 -> 2: Start Interview Session
  const handleStartInterview = async () => {
    setIsGeneratingQuestions(true);
    try {
      const generated = await interviewService.generateQuestions(
        selectedRole,
        selectedDifficulty
      );
      const qList = Array.isArray(generated) ? generated : generated.questions || [];
      setSessionId(generated.sessionId || null);
      setIsDemoMode(Boolean(generated.demoMode));
      setQuestions(qList);
      setCurrentIndex(0);
      setUserAnswer('');
      setAnswersHistory([]);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setPhase('interview');
      toast.success('5 scenario questions generated. You are ready to shine!');
    } catch (err) {
      toast.error('Failed to initialize session. Please try again.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Phase 2 -> 3: Submit Answer & Evaluate
  const handleSubmitAnswer = async (e) => {
    e?.preventDefault();
    if (!userAnswer.trim()) {
      toast.error('Please record or type your answer before submitting.');
      return;
    }

    setIsTimerRunning(false);
    setIsEvaluating(true);
    const currentQ = questions[currentIndex];

    try {
      const feedback = await interviewService.evaluateAnswer({
        question: currentQ.question,
        answer: userAnswer,
        questionIndex: currentIndex,
        sessionId,
        role: selectedRole,
        difficulty: selectedDifficulty,
      });

      if (feedback?.demoMode !== undefined) {
        setIsDemoMode(feedback.demoMode);
      }

      const entry = {
        question: currentQ,
        answer: userAnswer,
        feedback,
        timeTaken: timerSeconds,
      };

      setAnswersHistory((prev) => [...prev, entry]);
      setCurrentFeedback(feedback);
      setPhase('feedback');
      toast.success('Real-time AI evaluation completed!');
    } catch (err) {
      toast.error('Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Phase 3 -> Next Question or Phase 4 (Report)
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setCurrentFeedback(null);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setPhase('interview');
    } else {
      // Finished all 5 questions -> Calculate Final Report
      const historyToUse = answersHistory.length >= questions.length
        ? answersHistory
        : (currentFeedback ? [...answersHistory, { question: currentQ, answer: userAnswer, feedback: currentFeedback }] : answersHistory);
      const report = interviewService.calculateReport(historyToUse);
      setFinalReport(report);
      setPhase('report');
      toast.success('Interview complete! Your report card is ready.');
    }
  };

  // Reset & Practice Again
  const handlePracticeAgain = () => {
    setPhase('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setUserAnswer('');
    setAnswersHistory([]);
    setCurrentFeedback(null);
    setFinalReport(null);
    setTimerSeconds(0);
  };

  // Voice transcript simulation helper
  const handleSimulateVoice = () => {
    const sampleVoiceResponses = [
      'During my 3.5-year career pause for primary childcare, I actively managed family logistics while dedicating 8 hours weekly to modern AI product workflows and analytics certifications. Managing household operations honed my empathy, conflict de-escalation, and budget triage—qualities that directly strengthen my prior 5 years of engineering and product leadership.',
      'To stay ahead of technology evolution, I completed hands-on micro-sprints on Generative AI prompt flows, learned modern event-driven analytics in PostHog, and rebuilt our collaborative workflows in Jira Cloud and Notion.',
      'When engineering and business stakeholders clashed on timeline trade-offs, I scheduled an empathetic discovery session to quantify revenue risks against technical debt, establishing a phased MVP that satisfied both sides.',
    ];

    const randomSample =
      sampleVoiceResponses[currentIndex % sampleVoiceResponses.length];
    setUserAnswer(randomSample);
    toast.success('Voice dictation simulated! Edit or refine before submitting.');
  };

  const handleCopyModelAnswer = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAnswer(true);
    toast.success('Model answer copied to clipboard!');
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const currentQ = questions[currentIndex] || {};

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" size="sm">
              <Mic className="w-3.5 h-3.5 mr-1" />
              AI Mock Interview Gym
            </Badge>
            <Badge variant="demo" size="sm">
              Demo mode • Realistic AI scenario coach
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Return-to-Work Interview Simulator
          </h1>
          <p className="text-sm text-ink-muted">
            Practice answering gap questions and modern technical scenarios in a warm, zero-judgment space.
          </p>
        </div>

        {phase !== 'setup' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePracticeAgain}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Start New Session
          </Button>
        )}
      </div>

      {/* ========================================================= */}
      {/* PHASE 1: SETUP (Role & Difficulty Selection) */}
      {/* ========================================================= */}
      {phase === 'setup' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
          <Card className="border border-surface-border shadow-soft-md">
            <CardHeader className="pb-3 border-b border-surface-border/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <CardTitle className="text-lg">Configure Your Practice Session</CardTitle>
              </div>
              <CardDescription>
                Customize role expectations and interview panel tone before generating questions.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5 space-y-5">
              <Select
                label="Target Job Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                options={INTERVIEW_ROLES}
                helperText="Questions will be calibrated to the specific seniority and technical requirements of this role."
              />

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider font-heading">
                  Panel Tone & Difficulty
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DIFFICULTY_LEVELS.map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                        selectedDifficulty === diff.id
                          ? 'border-primary-600 bg-primary-50/70 shadow-soft-sm'
                          : 'border-surface-border bg-white hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-heading font-bold text-xs text-ink">
                          {diff.label.split(' ')[0]}
                        </span>
                        {selectedDifficulty === diff.id && (
                          <CheckCircle2 className="w-4 h-4 text-primary-600" />
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted leading-relaxed">
                        {diff.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-secondary/40 border border-primary-200/60 rounded-2xl space-y-1.5 text-xs text-primary-900 leading-relaxed">
                <div className="flex items-center gap-2 font-bold font-heading">
                  <ShieldCheck className="w-4 h-4 text-primary-600" />
                  <span>The SheNova Interview Promise</span>
                </div>
                <p>
                  You will never be judged or downgraded for having a career gap. All feedback focuses on highlighting leadership, clarity, and authentic professional confidence.
                </p>
              </div>
            </CardContent>

            <CardFooter className="justify-between pt-3">
              <span className="text-xs text-ink-muted">Generates 5 personalized questions</span>
              <Button
                variant="primary"
                onClick={handleStartInterview}
                isLoading={isGeneratingQuestions}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-soft-sm"
              >
                Generate 5 Practice Questions
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 2: QUESTION & LIVE ANSWER EXPERIENCE */}
      {/* ========================================================= */}
      {phase === 'interview' && questions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
          {/* Progress Header & Timer Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-surface-border shadow-soft-sm">
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="md" className="font-bold">
                Question {currentIndex + 1} of {questions.length}
              </Badge>
              <Badge variant="outline" size="md">
                {currentQ.category}
              </Badge>
            </div>

            {/* Live Stopwatch Timer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-subtle rounded-xl border border-surface-border font-mono text-xs font-bold text-ink">
                <Clock className="w-3.5 h-3.5 text-primary-600" />
                <span>{formatTime(timerSeconds)}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1.5 rounded-lg text-ink-subtle hover:text-ink hover:bg-surface-subtle transition-colors text-xs"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <ProgressBar
            value={((currentIndex + 1) / questions.length) * 100}
            height="sm"
            variant="gradient"
          />

          {/* Question Display Card */}
          <Card className="border border-surface-border shadow-soft-md space-y-4">
            <CardHeader className="pb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-heading text-primary-700">
                Interviewer asks:
              </span>
              <CardTitle className="text-xl sm:text-2xl font-bold text-ink leading-snug pt-1">
                "{currentQ.question}"
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-3.5 bg-primary-50/60 rounded-xl border border-primary-200/60 text-xs text-primary-900 leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Coach Recommendation:</strong> {currentQ.contextTip}
                </span>
              </div>

              <form onSubmit={handleSubmitAnswer} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider font-heading">
                    Your Response
                  </label>
                  <button
                    type="button"
                    onClick={handleSimulateVoice}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 hover:underline"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Simulate Voice Dictation</span>
                  </button>
                </div>

                <Textarea
                  rows={6}
                  placeholder="Speak your mind or type your response here. Aim for positive reframing, metrics, and structured storytelling..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  required
                />

                <div className="flex flex-wrap items-center justify-between text-xs text-ink-muted pt-1">
                  <span>Character count: {userAnswer.length} characters</span>
                  <span>Ideal response length: 150 - 350 characters</span>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setUserAnswer('')}
                  >
                    Clear Text
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isEvaluating}
                    rightIcon={<Sparkles className="w-4 h-4" />}
                    className="font-bold shadow-soft-sm"
                  >
                    Submit & Evaluate Answer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 3: EVALUATION FEEDBACK (After Each Answer) */}
      {/* ========================================================= */}
      {phase === 'feedback' && currentFeedback && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          {/* Question Summary Bar */}
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-soft-sm">
            <span className="text-[11px] font-bold text-primary-700 uppercase tracking-wider block font-heading">
              Feedback for Question {currentIndex + 1} of {questions.length}
            </span>
            <p className="font-heading font-bold text-base text-ink mt-0.5">
              "{currentQ.question}"
            </p>
          </div>

          {/* Feedback Scores Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-surface-border text-center shadow-soft-sm space-y-1">
              <span className="text-xs text-ink-muted font-medium block">Communication</span>
              <span className="text-2xl font-black font-heading text-primary-700">
                {currentFeedback.scores.communication}%
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block">Articulate</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-surface-border text-center shadow-soft-sm space-y-1">
              <span className="text-xs text-ink-muted font-medium block">Relevance</span>
              <span className="text-2xl font-black font-heading text-accent-600">
                {currentFeedback.scores.relevance}%
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block">On Point</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-surface-border text-center shadow-soft-sm space-y-1">
              <span className="text-xs text-ink-muted font-medium block">Confidence</span>
              <span className="text-2xl font-black font-heading text-emerald-600">
                {currentFeedback.scores.confidence}%
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block">Dignified</span>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Strengths Observed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-ink-light">
                  {currentFeedback.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Refinement & Coaching Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-ink-light">
                  {currentFeedback.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Suggested Improved Model Answer */}
          <Card className="border border-primary-200 bg-secondary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <CardTitle className="text-sm text-primary-900">
                    Suggested Improved Model Answer
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyModelAnswer(currentFeedback.suggestedAnswer)}
                  className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1"
                >
                  {copiedAnswer ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Model Answer</span>
                    </>
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-primary-950 italic leading-relaxed">
                {currentFeedback.suggestedAnswer}
              </p>
            </CardContent>
          </Card>

          {/* Navigation to Next Question or Final Report */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-ink-muted">
              {currentIndex + 1 < questions.length
                ? `${questions.length - (currentIndex + 1)} questions remaining in session`
                : 'Final question completed! Ready for report.'}
            </span>

            <Button
              variant="primary"
              size="lg"
              onClick={handleNextQuestion}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold shadow-soft-sm"
            >
              {currentIndex + 1 < questions.length
                ? 'Continue to Next Question'
                : 'Generate Performance Report'}
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 4: FINAL INTERVIEW PERFORMANCE REPORT */}
      {/* ========================================================= */}
      {phase === 'report' && finalReport && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          {/* Executive Score Card */}
          <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-accent-600 rounded-3xl p-6 sm:p-10 text-white shadow-soft-xl text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <Badge variant="accent" size="sm" className="bg-white/20 text-white border-white/30">
                  Full Session Evaluation
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  Interview Readiness Score: {finalReport.overallScore}%
                </h2>
                <p className="text-xs sm:text-sm text-primary-100 max-w-lg leading-relaxed">
                  {finalReport.summary}
                </p>
              </div>

              <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center min-w-[130px]">
                <Award className="w-8 h-8 text-accent-300 mx-auto mb-1" />
                <span className="text-xs font-bold text-primary-100 block">Rating:</span>
                <span className="text-lg font-heading font-black text-white">
                  Returner Ready
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Dimensional Competency Score Chart */}
          <Card className="border border-surface-border">
            <CardHeader className="pb-3 border-b border-surface-border/60">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                <CardTitle className="text-base">Competency Breakdown & Metrics</CardTitle>
              </div>
              <CardDescription>
                Evaluated across all 5 answers submitted during this session
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-heading text-ink">
                  <span>Communication & Narrative Framing</span>
                  <span className="text-primary-700">{finalReport.scores.communication}%</span>
                </div>
                <ProgressBar
                  value={finalReport.scores.communication}
                  height="sm"
                  variant="primary"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-heading text-ink">
                  <span>Answer Relevance & Strategic Substance</span>
                  <span className="text-accent-600">{finalReport.scores.relevance}%</span>
                </div>
                <ProgressBar
                  value={finalReport.scores.relevance}
                  height="sm"
                  variant="accent"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-heading text-ink">
                  <span>Executive Presence & Self-Assurance</span>
                  <span className="text-emerald-600">{finalReport.scores.confidence}%</span>
                </div>
                <ProgressBar
                  value={finalReport.scores.confidence}
                  height="sm"
                  variant="success"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold font-heading text-ink">
                  <span>Technical Agility & 2026 Tool Fluency</span>
                  <span className="text-primary-700">{finalReport.scores.technicalAgility}%</span>
                </div>
                <ProgressBar
                  value={finalReport.scores.technicalAgility}
                  height="sm"
                  variant="gradient"
                />
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Growth Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Observed Core Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-ink-light">
                  {finalReport.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                  <span>Next Recommended Growth Sprints</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-ink-light">
                  {finalReport.growthAreas.map((area, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 mt-1.5" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-white rounded-2xl border border-surface-border shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-bold text-sm text-ink">
                Ready for another practice round?
              </h4>
              <p className="text-xs text-ink-muted">
                Switch difficulty or test an alternate role to broaden your readiness.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/jobs')}
                className="w-full sm:w-auto"
              >
                Browse Returnships
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handlePracticeAgain}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="w-full sm:w-auto font-bold"
              >
                Practice Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
