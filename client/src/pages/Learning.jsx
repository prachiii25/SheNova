import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { GraduationCap, Play, Clock, Award, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const Learning = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Generative AI for Product & Operations Leaders',
      instructor: 'Dr. Kavita Sen (Industry Fellow)',
      duration: '3.5 Hours',
      level: 'Modern Refresh',
      progress: 60,
      description: 'Hands-on crash course on prompt engineering, AI agents, and product integration.',
    },
    {
      id: 2,
      title: 'Modern Agile, Jira Cloud & Asynchronous Team Tooling',
      instructor: 'Sneha Patel (VP Product)',
      duration: '2.0 Hours',
      level: 'Tooling Refresh',
      progress: 100,
      description: 'Re-align with remote and hybrid collaboration workflows in 2025/2026.',
    },
    {
      id: 3,
      title: 'Returner Leadership: Negotiation & Salary Parity',
      instructor: 'Meera Rao (Executive Coach)',
      duration: '1.5 Hours',
      level: 'Mindset & Negotiation',
      progress: 0,
      description: 'Tactics to negotiate senior titles and protect against returner wage penalties.',
    },
  ]);

  const handleStart = (title) => {
    toast.success(`Launching sprint: "${title}"!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" size="sm">Bite-Sized Sprints</Badge>
            <Badge variant="demo" size="sm">Sample Curriculum</Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink">
            Learning & Micro-Upskilling Hub
          </h2>
          <p className="text-sm text-ink-muted">
            Designed for 30-minute daily windows so you learn without sacrificing family commitments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} isHoverable className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={course.progress === 100 ? 'success' : 'secondary'} size="sm">
                  {course.level}
                </Badge>
                <span className="text-xs text-ink-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </span>
              </div>
              <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
              <p className="text-xs text-primary-700 font-medium">{course.instructor}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>Progress</span>
                  <span className="font-semibold text-ink">{course.progress}%</span>
                </div>
                <ProgressBar
                  value={course.progress}
                  height="sm"
                  variant={course.progress === 100 ? 'success' : 'primary'}
                />
              </div>
            </CardContent>

            <div className="pt-4 border-t border-surface-border mt-4">
              <Button
                variant={course.progress === 100 ? 'outline' : 'primary'}
                size="sm"
                className="w-full justify-center"
                onClick={() => handleStart(course.title)}
                leftIcon={course.progress === 100 ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Play className="w-4 h-4" />}
              >
                {course.progress === 100 ? 'Review Module' : course.progress > 0 ? 'Resume Sprint' : 'Start Sprint'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Learning;
