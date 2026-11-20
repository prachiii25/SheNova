import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import {
  FileText,
  Sparkles,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Heart,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Eye,
  Edit,
  RotateCcw,
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
  Textarea,
  ProgressBar,
  Tabs,
  Modal,
} from '../components/ui';

import { useAuth } from '../hooks/useAuth';
import { resumeService } from '../services/resumeService';

export const ResumeBuilder = () => {
  const { user } = useAuth();
  const previewRef = useRef(null);

  // Mobile View Toggle: 'edit' or 'preview'
  const [mobileTab, setMobileTab] = useState('edit');

  // Template Style: 'modern' | 'classic' | 'minimal'
  const [template, setTemplate] = useState('modern');

  // AI Modal for Gap Reframing
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiGapLoading, setAiGapLoading] = useState(false);
  const [aiGapDemoMode, setAiGapDemoMode] = useState(true);
  const [fetchedGapPhrasings, setFetchedGapPhrasings] = useState([]);

  // Resume Form State
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('shenova_resume_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      personal: {
        fullName: user?.name || 'Ananya Sharma',
        targetTitle: user?.targetRole || 'Senior Product Manager',
        email: user?.email || 'ananya.sharma@example.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, India (Open to Remote / Hybrid)',
        linkedin: 'linkedin.com/in/ananya-sharma-returner',
        website: 'ananyasharma.framer.website',
      },
      summary:
        'Strategic product leader with 5+ years of prior enterprise SaaS experience, returning with honed resilience, multi-stakeholder negotiation, and refreshed expertise in Generative AI product flows and modern event analytics.',
      careerGap: {
        title: 'Executive Family Leadership & Continuous Upskilling Pause',
        dates: '2022 - 2025 (3.5 Years)',
        reason: 'Motherhood & Primary Childcare',
        description:
          'Orchestrated complex family logistics and household budget triage while committing 8 hours weekly to AI-augmented product roadmapping, modern analytics certifications, and SheNova returner sprints.',
      },
      experience: [
        {
          id: 1,
          role: 'Product Manager',
          company: 'CloudSphere Tech Solutions',
          location: 'Bengaluru, India',
          period: '2018 - 2022',
          highlights:
            '• Led cross-functional team of 14 engineers and designers to launch automated billing platform, driving $2.4M ARR.\n• Decreased user churn by 18% through customer discovery interviews and revised onboarding funnels.\n• Orchestrated agile sprint cycles, backlog triage, and executive quarterly business reviews.',
        },
        {
          id: 2,
          role: 'Associate Product Specialist',
          company: 'Nexus Digital Systems',
          location: 'Pune, India',
          period: '2016 - 2018',
          highlights:
            '• Authored PRDs and user stories for core payment gateway integration across 6 regional currencies.\n• Spearheaded competitor benchmarking and quantitative usage reports for senior leadership.',
        },
      ],
      education: [
        {
          id: 1,
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'Visvesvaraya Technological University',
          year: '2012 - 2016',
          honors: 'First Class with Distinction (GPA: 3.8/4.0)',
        },
      ],
      skills: [
        'Product Strategy',
        'Generative AI UX Flows',
        'Roadmapping',
        'User Research',
        'Agile/Scrum',
        'Jira Cloud',
        'Mixpanel / PostHog',
        'Stakeholder Alignment',
      ],
      transferableSkills: [
        {
          title: 'Household Resource & Budget Management',
          desc: 'Managed annual allocation, emergency contingency planning, and vendor negotiations.',
        },
        {
          title: 'School Board Volunteer & Event Lead',
          desc: 'Coordinated 30+ volunteers for community STEM workshops, driving 100% participation.',
        },
      ],
    };
  });

  // Calculate Resume Completeness Percentage
  const calculateCompleteness = () => {
    let score = 0;
    if (resumeData.personal.fullName && resumeData.personal.email) score += 20;
    if (resumeData.summary.length > 30) score += 20;
    if (resumeData.careerGap.description.length > 20) score += 20;
    if (resumeData.experience.length > 0) score += 20;
    if (resumeData.skills.length >= 4) score += 10;
    if (resumeData.education.length > 0) score += 10;
    return score;
  };

  const completeness = calculateCompleteness();

  // Persist to localStorage and sync with dashboard
  useEffect(() => {
    localStorage.setItem('shenova_resume_data', JSON.stringify(resumeData));
    localStorage.setItem('shenova_resume_completion', completeness.toString());
  }, [resumeData, completeness]);

  // Load saved resume from backend on mount if present
  useEffect(() => {
    const fetchSavedResume = async () => {
      try {
        const saved = await resumeService.getResume();
        if (saved && saved.personal) {
          setResumeData(saved);
        }
      } catch (err) {}
    };
    fetchSavedResume();
  }, []);

  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      await resumeService.saveResume({
        ...resumeData,
        completeness,
      });
      toast.success('Resume saved to your SheNova account!');
    } catch (err) {
      toast.error('Failed to save resume. Saved to local storage.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenGapModal = async () => {
    setIsGapModalOpen(true);
    setAiGapLoading(true);
    try {
      const res = await resumeService.explainCareerGap({
        reason: resumeData.careerGap?.reason || user?.careerBreakReason || 'Childcare',
        duration: resumeData.careerGap?.dates || user?.breakDuration || '3.5 years',
        priorRole: resumeData.experience?.[0]?.role || 'Professional',
        targetRole: resumeData.personal?.targetTitle || 'Senior Role',
      });
      if (res?.phrasings) {
        setFetchedGapPhrasings(res.phrasings);
        setAiGapDemoMode(Boolean(res.demoMode));
      }
    } catch (err) {
      console.warn('AI Gap fetch error:', err);
    } finally {
      setAiGapLoading(false);
    }
  };

  // AI Gap Sample Phrasings
  const gapPhrasings = [
    {
      title: 'Executive & Family Leadership Reframing',
      text: 'Orchestrated complex multi-stakeholder family and household logistics while maintaining dedicated weekly sprints in modern AI product strategy and analytics.',
      badge: 'Executive Framing',
    },
    {
      title: 'Intentional Pause & Continuous Learning',
      text: 'Took an intentional career pause dedicated to primary caregiving and high-intensity self-directed upskilling, mastering next-generation workflow tools and cloud collaboration platforms.',
      badge: 'Learning Focus',
    },
    {
      title: 'Operational Resilience & Adaptability',
      text: 'Exercised round-the-clock priority triage, budget management, and adaptability during a personal family care commitment, emerging with honed empathy and sharpened operational focus.',
      badge: 'Resilience Focus',
    },
  ];

  const handleApplyGapPhrasing = (text) => {
    setResumeData((prev) => ({
      ...prev,
      careerGap: { ...prev.careerGap, description: text },
    }));
    setIsGapModalOpen(false);
    toast.success('Career gap statement updated with executive reframing!');
  };

  // PDF Download Handler via html2pdf.js
  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    setIsDownloading(true);
    const toastId = toast.loading('Rendering ATS-optimized PDF document...');

    try {
      const opt = {
        margin: [0.35, 0.35, 0.35, 0.35],
        filename: `SheNova_Resume_${resumeData.personal.fullName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      await html2pdf().set(opt).from(previewRef.current).save();
      toast.success('Resume downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Could not generate PDF. Opening print dialog...', { id: toastId });
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper to add skill
  const [newSkillText, setNewSkillText] = useState('');
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    if (!resumeData.skills.includes(newSkillText.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkillText.trim()],
      });
      setNewSkillText('');
      toast.success('Skill added!');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s !== skillToRemove),
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="primary" size="sm">
              <FileText className="w-3.5 h-3.5 mr-1" />
              Break-Friendly Resume Architect
            </Badge>
            <Badge variant="demo" size="sm">
              ATS-Optimized Preview
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Resume Builder & Live Preview
          </h1>
          <p className="text-sm text-ink-muted">
            Frames career pauses as active leadership and highlights transferable life competencies.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 mr-2 bg-surface-card px-3 py-1.5 rounded-xl border border-surface-border">
            <span className="text-xs text-ink-muted">Completeness:</span>
            <span className="text-xs font-bold font-heading text-emerald-600">
              {completeness}%
            </span>
          </div>

          <Button
            variant="outline"
            onClick={handleSaveResume}
            isLoading={isSaving}
            className="shadow-soft-sm font-semibold"
          >
            Save Resume
          </Button>

          <Button
            variant="primary"
            onClick={handleDownloadPDF}
            isLoading={isDownloading}
            leftIcon={<Download className="w-4 h-4" />}
            className="shadow-soft-sm font-semibold"
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible only on small screens) */}
      <div className="lg:hidden flex items-center justify-center p-1 bg-surface-subtle rounded-2xl border border-surface-border">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'edit'
              ? 'bg-white text-primary-700 shadow-soft-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Form</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'bg-white text-primary-700 shadow-soft-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview ({template})</span>
        </button>
      </div>

      {/* TWO-PANE LAYOUT: FORM (LEFT) + LIVE PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT PANE: EDIT FORM */}
        {/* ========================================================= */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            mobileTab === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* 1. Personal Details */}
          <Card>
            <CardHeader className="pb-3 border-b border-surface-border/60">
              <CardTitle className="text-base">1. Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  value={resumeData.personal.fullName}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personal: { ...resumeData.personal, fullName: e.target.value },
                    })
                  }
                />
                <Input
                  label="Target Job Title"
                  value={resumeData.personal.targetTitle}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personal: { ...resumeData.personal, targetTitle: e.target.value },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email Address"
                  type="email"
                  value={resumeData.personal.email}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personal: { ...resumeData.personal, email: e.target.value },
                    })
                  }
                />
                <Input
                  label="Phone Number"
                  value={resumeData.personal.phone}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personal: { ...resumeData.personal, phone: e.target.value },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Location & Flexibility"
                  value={resumeData.personal.location}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personal: { ...resumeData.personal, location: e.target.value },
                    })
                  }
                />
                <Input
                  label="LinkedIn Profile URL"
                  value={resumeData.personal.linkedin}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      personal: { ...resumeData.personal, linkedin: e.target.value },
                    })
                  }
                />
              </div>

              <Textarea
                label="Executive Returner Summary"
                rows={3}
                value={resumeData.summary}
                onChange={(e) =>
                  setResumeData({ ...resumeData, summary: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* 2. Career Gap Section (Hero Reframing) */}
          <Card className="border-2 border-primary-300 bg-secondary/15">
            <CardHeader className="pb-3 border-b border-primary-200/60">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  <CardTitle className="text-base text-primary-900">
                    2. Career Pause (Reframed with Dignity)
                  </CardTitle>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenGapModal}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Explain My Gap Positively
                </Button>
              </div>
              <CardDescription>
                Directly articulates leadership, caregiving, and upskilling during your leave.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Section Title on Resume"
                  value={resumeData.careerGap.title}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      careerGap: { ...resumeData.careerGap, title: e.target.value },
                    })
                  }
                />
                <Input
                  label="Pause Duration & Dates"
                  value={resumeData.careerGap.dates}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      careerGap: { ...resumeData.careerGap, dates: e.target.value },
                    })
                  }
                />
              </div>

              <Textarea
                label="Positive Reframing Statement"
                rows={3}
                value={resumeData.careerGap.description}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    careerGap: { ...resumeData.careerGap, description: e.target.value },
                  })
                }
                helperText="Tip: Focus on prioritization, crisis resolution, and continuous technical curiosity."
              />
            </CardContent>
          </Card>

          {/* 3. Work Experience */}
          <Card>
            <CardHeader className="pb-3 border-b border-surface-border/60">
              <CardTitle className="text-base">3. Prior Work Experience</CardTitle>
              <CardDescription>Document previous accomplishments and metric impact</CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {resumeData.experience.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary-700 font-heading">
                      Role #{idx + 1}
                    </span>
                    {resumeData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setResumeData({
                            ...resumeData,
                            experience: resumeData.experience.filter((e) => e.id !== exp.id),
                          })
                        }
                        className="text-ink-subtle hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Input
                      label="Job Title"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = resumeData.experience.map((item) =>
                          item.id === exp.id ? { ...item, role: e.target.value } : item
                        );
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                    />
                    <Input
                      label="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = resumeData.experience.map((item) =>
                          item.id === exp.id ? { ...item, company: e.target.value } : item
                        );
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                    />
                  </div>

                  <Input
                    label="Employment Period"
                    placeholder="e.g. 2018 - 2022"
                    value={exp.period}
                    onChange={(e) => {
                      const updated = resumeData.experience.map((item) =>
                        item.id === exp.id ? { ...item, period: e.target.value } : item
                      );
                      setResumeData({ ...resumeData, experience: updated });
                    }}
                  />

                  <Textarea
                    label="Key Achievements & Metrics (Bullet Points)"
                    rows={3}
                    value={exp.highlights}
                    onChange={(e) => {
                      const updated = resumeData.experience.map((item) =>
                        item.id === exp.id ? { ...item, highlights: e.target.value } : item
                      );
                      setResumeData({ ...resumeData, experience: updated });
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 4. Skills & Tools */}
          <Card>
            <CardHeader className="pb-3 border-b border-surface-border/60">
              <CardTitle className="text-base">4. Core & Refreshed Skills</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <Input
                  placeholder="Add a skill or modern tool (e.g. Supabase, Prompt Design)..."
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                />
                <Button type="submit" variant="secondary" size="md">
                  Add
                </Button>
              </form>

              <div className="flex flex-wrap gap-2 pt-1">
                {resumeData.skills.map((skill, sIdx) => (
                  <Badge
                    key={sIdx}
                    variant="primary"
                    size="md"
                    className="cursor-pointer hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 group transition-all"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] text-ink-subtle group-hover:text-rose-600 ml-1">
                      ×
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 5. Transferable Skills (Caregiving & Community Leadership) */}
          <Card>
            <CardHeader className="pb-3 border-b border-surface-border/60">
              <CardTitle className="text-base">
                5. Transferable Pause Competencies
              </CardTitle>
              <CardDescription>
                Volunteering, household operations, or community projects
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {resumeData.transferableSkills.map((ts, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-2"
                >
                  <Input
                    label="Competency / Initiative"
                    value={ts.title}
                    onChange={(e) => {
                      const updated = [...resumeData.transferableSkills];
                      updated[idx].title = e.target.value;
                      setResumeData({ ...resumeData, transferableSkills: updated });
                    }}
                  />
                  <Textarea
                    label="Context & Impact"
                    rows={2}
                    value={ts.desc}
                    onChange={(e) => {
                      const updated = [...resumeData.transferableSkills];
                      updated[idx].desc = e.target.value;
                      setResumeData({ ...resumeData, transferableSkills: updated });
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 6. Education */}
          <Card>
            <CardHeader className="pb-3 border-b border-surface-border/60">
              <CardTitle className="text-base">6. Education & Academic Background</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {resumeData.education.map((edu, idx) => (
                <div key={edu.id} className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Degree & Major"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].degree = e.target.value;
                        setResumeData({ ...resumeData, education: updated });
                      }}
                    />
                    <Input
                      label="Institution / University"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...resumeData.education];
                        updated[idx].institution = e.target.value;
                        setResumeData({ ...resumeData, education: updated });
                      }}
                    />
                  </div>
                  <Input
                    label="Graduation Year & Honors"
                    value={edu.year}
                    onChange={(e) => {
                      const updated = [...resumeData.education];
                      updated[idx].year = e.target.value;
                      setResumeData({ ...resumeData, education: updated });
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANE: LIVE PREVIEW & TEMPLATE SWITCHER */}
        {/* ========================================================= */}
        <div
          className={`lg:col-span-6 sticky top-20 space-y-4 ${
            mobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Template Switcher Tabs */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-surface-border shadow-soft-sm">
            <span className="text-xs font-bold font-heading text-ink uppercase tracking-wider pl-2">
              Template:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'modern', label: 'Modern (SheNova)' },
                { id: 'classic', label: 'Classic Corporate' },
                { id: 'minimal', label: 'Minimalist Clean' },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setTemplate(tmpl.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    template === tmpl.id
                      ? 'bg-primary-600 text-white shadow-soft-sm'
                      : 'text-ink-muted hover:bg-surface-subtle'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resume Preview Canvas Paper */}
          <div className="bg-surface-subtle p-3 sm:p-5 rounded-3xl border border-surface-border overflow-x-auto shadow-inner">
            <div
              ref={previewRef}
              id="resume-preview-container"
              className="bg-white text-ink shadow-soft-xl rounded-2xl mx-auto transition-all p-8 sm:p-10 min-h-[850px] max-w-[680px] text-left select-text"
              style={{ fontFamily: template === 'classic' ? 'Georgia, serif' : 'Inter, sans-serif' }}
            >
              {/* ---------------------------------------------------- */}
              {/* TEMPLATE 1: MODERN (Brand Colors & Two Column Accents) */}
              {/* ---------------------------------------------------- */}
              {template === 'modern' && (
                <div className="space-y-6 text-ink">
                  {/* Header */}
                  <div className="border-b-2 border-primary-100 pb-4">
                    <h2 className="font-heading text-2xl font-black text-primary-800 tracking-tight">
                      {resumeData.personal.fullName}
                    </h2>
                    <p className="text-sm font-bold text-accent-600 tracking-wide mt-0.5">
                      {resumeData.personal.targetTitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted pt-2">
                      {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                      {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
                      {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
                      {resumeData.personal.linkedin && <span>• {resumeData.personal.linkedin}</span>}
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-primary-700 mb-1.5">
                      Executive Returner Summary
                    </h3>
                    <p className="text-xs leading-relaxed text-ink-light">
                      {resumeData.summary}
                    </p>
                  </div>

                  {/* Reframed Career Pause Highlight */}
                  <div className="p-3.5 bg-primary-50/70 border-l-4 border-primary-600 rounded-r-xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-primary-900">
                      <span>{resumeData.careerGap.title}</span>
                      <span className="text-primary-700 font-mono text-[11px]">
                        {resumeData.careerGap.dates}
                      </span>
                    </div>
                    <p className="text-xs text-primary-800 leading-relaxed">
                      {resumeData.careerGap.description}
                    </p>
                  </div>

                  {/* Prior Experience */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-primary-700 border-b border-surface-border pb-1">
                      Professional Experience
                    </h3>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs font-bold text-ink">
                          <span>
                            {exp.role} • <span className="text-primary-700">{exp.company}</span>
                          </span>
                          <span className="text-ink-muted font-normal text-[11px]">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-light whitespace-pre-line leading-relaxed pl-2 border-l border-primary-100">
                          {exp.highlights}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Transferable Skills & Leadership */}
                  {resumeData.transferableSkills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-primary-700 border-b border-surface-border pb-1">
                        Transferable Caregiving & Community Leadership
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {resumeData.transferableSkills.map((ts, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-surface-subtle text-[11px]">
                            <strong className="block text-ink">{ts.title}</strong>
                            <span className="text-ink-muted">{ts.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Grid */}
                  <div>
                    <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-primary-700 border-b border-surface-border pb-1 mb-2">
                      Core & Refreshed Modern Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {resumeData.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-secondary text-primary-800 font-medium text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xs font-bold font-heading uppercase tracking-wider text-primary-700 border-b border-surface-border pb-1 mb-1">
                      Education & Certifications
                    </h3>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="text-xs flex justify-between items-baseline pt-1">
                        <div>
                          <strong className="text-ink">{edu.degree}</strong> •{' '}
                          <span className="text-ink-muted">{edu.institution}</span>
                        </div>
                        <span className="text-ink-subtle text-[11px]">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TEMPLATE 2: CLASSIC CORPORATE (Serif, Timeless) */}
              {/* ---------------------------------------------------- */}
              {template === 'classic' && (
                <div className="space-y-5 text-gray-900 leading-normal">
                  <div className="text-center border-b-2 border-gray-800 pb-3 space-y-1">
                    <h2 className="text-2xl font-bold tracking-normal uppercase">
                      {resumeData.personal.fullName}
                    </h2>
                    <p className="text-xs italic text-gray-700 font-medium">
                      {resumeData.personal.targetTitle}
                    </p>
                    <p className="text-[11px] text-gray-600">
                      {resumeData.personal.email} | {resumeData.personal.phone} | {resumeData.personal.location}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-gray-900">
                      Professional Overview
                    </h3>
                    <p className="text-[11px] leading-relaxed text-gray-800">{resumeData.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-gray-900">
                      Leadership & Career Pause Reframing
                    </h3>
                    <div className="text-[11px]">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{resumeData.careerGap.title}</span>
                        <span>{resumeData.careerGap.dates}</span>
                      </div>
                      <p className="text-gray-700 italic pt-0.5">{resumeData.careerGap.description}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-2 text-gray-900">
                      Work Experience
                    </h3>
                    <div className="space-y-3">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="text-[11px]">
                          <div className="flex justify-between font-bold text-gray-900">
                            <span>{exp.role}, {exp.company}</span>
                            <span>{exp.period}</span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line pt-0.5 leading-relaxed">
                            {exp.highlights}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-gray-900">
                      Key Competencies
                    </h3>
                    <p className="text-[11px] text-gray-800">
                      {resumeData.skills.join(' • ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1 text-gray-900">
                      Education
                    </h3>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="text-[11px] flex justify-between">
                        <span>{edu.degree}, {edu.institution}</span>
                        <span>{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TEMPLATE 3: MINIMALIST CLEAN (Spacious, Modern Sans) */}
              {/* ---------------------------------------------------- */}
              {template === 'minimal' && (
                <div className="space-y-6 text-ink">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-ink-muted block">
                      CURRICULUM VITAE
                    </span>
                    <h2 className="text-2xl font-extrabold tracking-tight text-ink mt-0.5">
                      {resumeData.personal.fullName}
                    </h2>
                    <p className="text-xs font-semibold text-primary-600">
                      {resumeData.personal.targetTitle}
                    </p>
                    <div className="text-[11px] text-ink-muted flex flex-wrap gap-x-3 pt-1">
                      <span>{resumeData.personal.email}</span>
                      <span>{resumeData.personal.location}</span>
                    </div>
                  </div>

                  <div className="text-xs leading-relaxed text-ink-light border-l-2 border-surface-border pl-3">
                    {resumeData.summary}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">
                      CAREER PAUSE
                    </span>
                    <div className="text-xs">
                      <div className="flex justify-between font-bold text-ink">
                        <span>{resumeData.careerGap.title}</span>
                        <span className="font-mono text-[10px] text-ink-muted">{resumeData.careerGap.dates}</span>
                      </div>
                      <p className="text-xs text-ink-muted mt-1 leading-relaxed">{resumeData.careerGap.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">
                      EXPERIENCE
                    </span>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-ink">
                          <span>{exp.role} / {exp.company}</span>
                          <span className="font-mono text-[10px] text-ink-muted">{exp.period}</span>
                        </div>
                        <p className="text-[11px] text-ink-light whitespace-pre-line leading-relaxed">
                          {exp.highlights}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">
                      SKILLS
                    </span>
                    <p className="text-xs text-ink-light font-medium">
                      {resumeData.skills.join(', ')}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">
                      EDUCATION
                    </span>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="text-xs flex justify-between">
                        <span>{edu.degree} — {edu.institution}</span>
                        <span className="font-mono text-[10px] text-ink-muted">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: EXPLAIN MY GAP POSITIVELY (AI Generator Sample Phrasings) */}
      <Modal
        isOpen={isGapModalOpen}
        onClose={() => setIsGapModalOpen(false)}
        title="AI Career Gap Reframing Engine"
        description="Select an empowering phrasing tailored for forward-thinking returnship recruiters."
        footer={
          <Button variant="ghost" onClick={() => setIsGapModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3">
          {aiGapDemoMode && (
            <div className="mb-2">
              <Badge variant="demo" size="sm">
                Demo mode • AI positive phrasing
              </Badge>
            </div>
          )}
          {aiGapLoading ? (
            <div className="py-8 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500 animate-spin" />
              <span>Generating positive gap statements with AI...</span>
            </div>
          ) : (
            (fetchedGapPhrasings.length > 0 ? fetchedGapPhrasings : gapPhrasings).map((gp, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-surface-border hover:border-primary-400 hover:bg-primary-50/30 transition-all space-y-2 cursor-pointer group"
                onClick={() => handleApplyGapPhrasing(gp.text)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-ink group-hover:text-primary-700">
                    {gp.title || gp.style}
                  </span>
                  <Badge variant="primary" size="sm">
                    {gp.badge || gp.style || 'AI Phrasing'}
                  </Badge>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">"{gp.text}"</p>
                <div className="flex justify-end pt-1">
                  <span className="text-xs font-bold text-primary-600 group-hover:underline">
                    Apply This Statement →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ResumeBuilder;
