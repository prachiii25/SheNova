import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mic, MicOff, Sparkles, Play, CheckCircle2, RotateCcw, Volume2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Textarea';

export const Interview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  const questions = [
    {
      id: 1,
      category: 'Break Framing',
      question: 'How do you describe your 3-year career break and what skills did you actively maintain during this period?',
      recommendedFocus: 'Highlight organization, empathy, resilience, and your continuous self-directed learning.',
    },
    {
      id: 2,
      category: 'Technical Agility',
      question: 'How have you brought yourself up to speed with generative AI tools and modern cloud environments since your pause?',
      recommendedFocus: 'Mention specific hands-on projects, sprints, and certifications completed in SheNova.',
    },
  ];

  const currentQ = questions[currentQuestionIndex];

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Microphone active. Simulating voice transcription...');
      setTimeout(() => {
        setUserAnswer(
          'During my career pause, I managed complex multi-stakeholder family coordination while dedicating 8 hours weekly to AI-augmented product roadmapping and modern analytics sprints on SheNova.'
        );
      }, 1500);
    } else {
      setIsRecording(false);
      toast('Recording stopped.');
    }
  };

  const handleEvaluate = () => {
    if (!userAnswer.trim()) {
      toast.error('Please record or type an answer first.');
      return;
    }
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setAiFeedback({
        confidenceScore: 90,
        strengths: ['Clear positive reframing', 'Quantified weekly learning commitment', 'Proactive mention of modern tools'],
        coachingTip: 'Excellent delivery. You can also mention how your empathy and patience make you a stronger team mentor.',
      });
      toast.success('AI feedback generated!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">Confidence Gym</Badge>
            <Badge variant="demo" size="sm">Sample Simulator</Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink">
            AI Return-to-Work Mock Interview
          </h2>
          <p className="text-sm text-ink-muted">
            Practice answering career break questions in a warm, zero-judgment environment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" size="sm">
                Question {currentQuestionIndex + 1} of {questions.length} • {currentQ.category}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
                  setAiFeedback(null);
                  setUserAnswer('');
                }}
              >
                Next Question
              </Button>
            </div>
            <CardTitle className="text-lg sm:text-xl text-ink leading-snug pt-2">
              "{currentQ.question}"
            </CardTitle>
            <CardDescription>
              💡 Recommended focus: {currentQ.recommendedFocus}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              label="Your Response"
              rows={5}
              placeholder="Speak using the microphone button or type your practice answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button
                variant={isRecording ? 'danger' : 'outline'}
                onClick={handleToggleRecord}
                leftIcon={isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              >
                {isRecording ? 'Stop Recording' : 'Record Answer (Voice)'}
              </Button>

              <Button
                variant="primary"
                onClick={handleEvaluate}
                isLoading={isEvaluating}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Evaluate with AI
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Feedback Panel */}
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>AI Confidence Evaluation</CardTitle>
            <CardDescription>Objective feedback on tone and impact</CardDescription>
          </CardHeader>
          <CardContent>
            {aiFeedback ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-xs font-semibold text-emerald-800">Confidence Metric</span>
                  <span className="text-lg font-bold text-emerald-700 font-heading">
                    {aiFeedback.confidenceScore}%
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                    Key Strengths
                  </span>
                  {aiFeedback.strengths.map((str, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-ink-light">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-secondary/50 rounded-xl border border-primary-100">
                  <span className="text-xs font-bold text-primary-800 block mb-1">Coaching Tip:</span>
                  <p className="text-xs text-ink-light leading-relaxed">{aiFeedback.coachingTip}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-ink-muted text-xs space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-primary-400 opacity-70" />
                <p>Record or submit your answer to view real-time coaching metrics.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;
