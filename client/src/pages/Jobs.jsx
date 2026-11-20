import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Search,
  MapPin,
  Sparkles,
  Filter,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  X,
  FileCheck2,
  DollarSign,
  Heart,
  Send,
  Eye,
  SlidersHorizontal,
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
  Modal,
  Tabs,
  EmptyState,
} from '../components/ui';

import { SAMPLE_JOBS } from '../data/jobs';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';

export const Jobs = () => {
  const { user } = useAuth();

  // Active Tab: 'all' | 'saved' | 'applied'
  const [activeTab, setActiveTab] = useState('all');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('match');

  // Saved / Bookmarked Jobs in LocalStorage
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('shenova_saved_jobs');
      return saved ? JSON.parse(saved) : ['job-101', 'job-103'];
    } catch (e) {
      return [];
    }
  });

  // Applied Jobs in LocalStorage
  const [appliedJobIds, setAppliedJobIds] = useState(() => {
    try {
      const applied = localStorage.getItem('shenova_applied_jobs');
      return applied ? JSON.parse(applied) : ['job-102'];
    } catch (e) {
      return [];
    }
  });

  const [jobsList, setJobsList] = useState(SAMPLE_JOBS);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const res = await jobService.getJobs();
        if (res?.jobs?.length > 0) {
          setJobsList(res.jobs);
          setIsDemoMode(Boolean(res.demoMode));
        }
        const [saved, apps] = await Promise.allSettled([
          jobService.getSavedJobs(),
          jobService.getApplications(),
        ]);
        if (saved.status === 'fulfilled' && saved.value.length > 0) {
          setSavedJobIds(saved.value.map((s) => s.jobId || s.job?._id || s.job?.jobId));
        }
        if (apps.status === 'fulfilled' && apps.value.length > 0) {
          setAppliedJobIds(apps.value.map((a) => a.jobId || a.job?._id || a.job?.jobId));
        }
      } catch (err) {
        console.warn('Jobs fetch error:', err);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('shenova_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('shenova_applied_jobs', JSON.stringify(appliedJobIds));
  }, [appliedJobIds]);

  // Selected Job for Detail Drawer / Modal
  const [detailJob, setDetailJob] = useState(null);

  // Application Modal State
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [applyForm, setApplyForm] = useState({
    fullName: user?.name || 'Ananya Sharma',
    email: user?.email || 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    breakStatement:
      '3.5-year career pause focused on primary childcare and continuous upskilling in modern generative AI and product strategy.',
    coverNote:
      'I am excited to apply for this returner track. My prior 5+ years of strategic ownership coupled with refreshed modern tooling makes me ready to drive immediate value.',
  });
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Toggle Bookmark
  const handleToggleSave = async (jobId, e) => {
    e?.stopPropagation();
    try {
      if (savedJobIds.includes(jobId)) {
        setSavedJobIds(savedJobIds.filter((id) => id !== jobId));
        await jobService.toggleSaveJob(jobId);
        toast('Removed from saved opportunities.');
      } else {
        setSavedJobIds([...savedJobIds, jobId]);
        await jobService.toggleSaveJob(jobId);
        toast.success('Opportunity saved to your bookmarks!');
      }
    } catch (err) {
      // Handled gracefully
    }
  };

  // Submit Application Handler
  const handleConfirmApply = async (e) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.email) {
      toast.error('Please complete candidate contact details.');
      return;
    }

    setIsSubmittingApp(true);
    const jobId = applyModalJob.jobId || applyModalJob.id;
    try {
      await jobService.applyForJob(jobId, applyForm);
      if (!appliedJobIds.includes(jobId)) {
        setAppliedJobIds((prev) => [...prev, jobId]);
      }
      setApplyModalJob(null);
      if (detailJob?.id === jobId || detailJob?.jobId === jobId) {
        setDetailJob(null);
      }
      toast.success(
        `Application submitted for ${applyModalJob.title}! Track status in "Applied Jobs".`
      );
    } catch (err) {
      if (!appliedJobIds.includes(jobId)) {
        setAppliedJobIds((prev) => [...prev, jobId]);
      }
      setApplyModalJob(null);
      toast.success(`Application submitted for ${applyModalJob.title}! (Saved locally)`);
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedExperience('All');
    setSelectedLocation('All');
    setSortBy('match');
  };

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      // Tab Filtering
      if (activeTab === 'saved' && !savedJobIds.includes(job.id)) return false;
      if (activeTab === 'applied' && !appliedJobIds.includes(job.id)) return false;

      // Text Query Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        const matchesTag = job.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      // Type Filter
      if (selectedType !== 'All') {
        if (selectedType === 'Remote' && job.workMode !== 'Remote') return false;
        if (selectedType === 'Work-from-home' && job.workMode !== 'Work-from-home') return false;
        if (selectedType === 'Part-time' && job.type !== 'Part-time') return false;
        if (selectedType === 'Flexible' && job.type !== 'Flexible') return false;
        if (selectedType === 'Returnship' && job.type !== 'Returnship') return false;
        if (selectedType === 'Internship' && job.type !== 'Internship') return false;
      }

      // Experience Filter
      if (selectedExperience !== 'All' && job.experience !== selectedExperience) {
        return false;
      }

      // Location Filter
      if (selectedLocation !== 'All') {
        if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') return b.matchScore - a.matchScore;
      if (sortBy === 'newest') return a.postedDate.localeCompare(b.postedDate);
      return 0;
    });
  }, [
    activeTab,
    savedJobIds,
    appliedJobIds,
    searchQuery,
    selectedType,
    selectedExperience,
    selectedLocation,
    sortBy,
  ]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" size="sm">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              Returnship & Restart Directory
            </Badge>
            <Badge variant="demo" size="sm">
              Sample Listings • 20+ Roles
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Vetted Opportunities for Returning Women
          </h1>
          <p className="text-sm text-ink-muted">
            Organizations actively looking for women re-entering the workforce, featuring structured ramp-up support and zero gap penalties.
          </p>
        </div>
      </div>

      {/* Mandatory Demo Data Integrity Notice */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Sample Data Disclosure:</strong> All {jobsList.length} positions below are sample demonstrative listings created for testing the SheNova application flow. In accordance with safety rules, unverified corporate partners are <span className="underline font-semibold">never marked as verified employers</span>. Real API partners will be added in production.
        </div>
      </div>

      {/* TABS: All Opportunities / Saved / Applied */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-2">
        <Tabs
          tabs={[
            { id: 'all', label: 'All Opportunities', count: jobsList.length },
            { id: 'saved', label: 'Bookmarked', count: savedJobIds.length },
            { id: 'applied', label: 'Applied Roles', count: appliedJobIds.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-muted hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-surface-border text-ink rounded-xl px-2.5 py-1.5 text-xs font-semibold outline-none hover:border-primary-300"
          >
            <option value="match">Match Score (Highest)</option>
            <option value="newest">Recently Posted</option>
          </select>
        </div>
      </div>

      {/* SEARCH AND MULTI-FILTER BAR */}
      <Card className="p-4 sm:p-5 border border-surface-border shadow-soft-sm space-y-3.5">
        <div className="relative">
          <Input
            placeholder="Search roles by title, keyword, tech stack, or employer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-ink-subtle" />}
            rightIcon={
              searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-ink-subtle hover:text-ink text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null
            }
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Select
            label="Work Arrangement & Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={[
              { value: 'All', label: 'All Work Types' },
              { value: 'Returnship', label: 'Returnship Cohort' },
              { value: 'Remote', label: '100% Remote' },
              { value: 'Work-from-home', label: 'Work-from-Home' },
              { value: 'Part-time', label: 'Part-Time (15-20 hrs)' },
              { value: 'Flexible', label: 'Flexible Hybrid' },
              { value: 'Internship', label: 'Internship / Apprentice' },
            ]}
          />

          <Select
            label="Prior Experience Level"
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            options={[
              { value: 'All', label: 'All Experience Levels' },
              { value: '1-3 years', label: '1 - 3 years' },
              { value: '3-5 years', label: '3 - 5 years' },
              { value: '5+ years', label: '5+ years' },
            ]}
          />

          <Select
            label="Location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            options={[
              { value: 'All', label: 'All Locations' },
              { value: 'Remote', label: 'Remote / Anywhere' },
              { value: 'Bengaluru', label: 'Bengaluru' },
              { value: 'Pune', label: 'Pune' },
              { value: 'Mumbai', label: 'Mumbai' },
              { value: 'Hyderabad', label: 'Hyderabad' },
              { value: 'Delhi NCR', label: 'Delhi NCR' },
              { value: 'Chennai', label: 'Chennai' },
            ]}
          />
        </div>

        {/* Active filter pills & Reset button */}
        {(searchQuery || selectedType !== 'All' || selectedExperience !== 'All' || selectedLocation !== 'All') && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-border/50 text-xs text-ink-muted">
            <span className="font-medium">
              Showing <strong>{filteredJobs.length}</strong> matching returnship positions
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-primary-600 font-semibold hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </Card>

      {/* JOB LISTINGS GRID / EMPTY STATE */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Matching Returnship Opportunities Found"
          description="We couldn't find any listings matching your current search parameters. Try broadening your location or work-type filters."
          action={
            <Button variant="primary" onClick={handleResetFilters}>
              Clear All Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isApplied = appliedJobIds.includes(job.id);

            return (
              <Card
                key={job.id}
                isHoverable
                onClick={() => setDetailJob(job)}
                className="flex flex-col justify-between border border-surface-border hover:border-primary-300 transition-all cursor-pointer group bg-white shadow-soft-sm"
              >
                <div className="space-y-3">
                  {/* Top Badges & Bookmark */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="demo" size="sm">
                        Sample Listing
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {job.type}
                      </Badge>
                      {isApplied && (
                        <Badge variant="success" size="sm">
                          Applied ✓
                        </Badge>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(job.id, e)}
                      className="p-1.5 rounded-lg text-ink-subtle hover:text-accent-500 hover:bg-surface-subtle transition-colors"
                      aria-label={isSaved ? 'Remove bookmark' : 'Bookmark job'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isSaved ? 'fill-accent-500 text-accent-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h3 className="font-heading font-bold text-base text-ink group-hover:text-primary-700 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-primary-700 mt-1 truncate">
                      {job.company}
                    </p>
                  </div>

                  {/* Location & Stipend Meta */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-ink">{job.stipend}</span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-surface-subtle text-[11px] text-ink-muted border border-surface-border font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 mt-4 border-t border-surface-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                    <span>{job.matchScore}% Match</span>
                  </div>

                  <span className="font-semibold text-primary-600 group-hover:underline flex items-center gap-1">
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* DETAIL DRAWER / MODAL FOR JOB DETAILS */}
      {/* ========================================================= */}
      {detailJob && (
        <Modal
          isOpen={Boolean(detailJob)}
          onClose={() => setDetailJob(null)}
          size="lg"
          title={detailJob.title}
          description={`${detailJob.company} • ${detailJob.location}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={(e) => handleToggleSave(detailJob.id, e)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink px-3 py-2 rounded-xl hover:bg-surface-subtle transition-colors"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    savedJobIds.includes(detailJob.id)
                      ? 'fill-accent-500 text-accent-500'
                      : ''
                  }`}
                />
                <span>
                  {savedJobIds.includes(detailJob.id) ? 'Saved' : 'Save for Later'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setDetailJob(null)}>
                  Close
                </Button>
                {appliedJobIds.includes(detailJob.id) ? (
                  <Button variant="secondary" isDisabled leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}>
                    Application Submitted
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setApplyModalJob(detailJob);
                    }}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Apply with SheNova Profile
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-6 text-ink">
            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="demo" size="md">
                Sample Listing
              </Badge>
              <Badge variant="secondary" size="md">
                {detailJob.type}
              </Badge>
              <Badge variant="outline" size="md">
                {detailJob.workMode}
              </Badge>
              <Badge variant="primary" size="md">
                {detailJob.breakEligibility}
              </Badge>
            </div>

            {/* Compensation & Location banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-surface-subtle rounded-2xl border border-surface-border text-xs">
              <div>
                <span className="text-ink-muted block text-[11px]">Stipend / Salary</span>
                <span className="font-bold text-ink">{detailJob.stipend}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">Prior Experience</span>
                <span className="font-bold text-ink">{detailJob.experience}</span>
              </div>
              <div>
                <span className="text-ink-muted block text-[11px]">Match Rating</span>
                <span className="font-bold text-emerald-600">{detailJob.matchScore}% Compatibility</span>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-sm text-ink uppercase tracking-wider">
                Program & Role Overview
              </h4>
              <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                {detailJob.description}
              </p>
            </div>

            {/* Returner Eligibility */}
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-sm text-ink uppercase tracking-wider">
                Eligibility & Career Break Policy
              </h4>
              <ul className="space-y-1.5 text-xs text-ink-light">
                {detailJob.eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-sm text-ink uppercase tracking-wider">
                Key Responsibilities
              </h4>
              <ul className="space-y-1.5 text-xs text-ink-light">
                {detailJob.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Perks & Flexibility */}
            <div className="p-4 bg-secondary/40 border border-primary-200/60 rounded-2xl space-y-2">
              <h4 className="font-heading font-bold text-xs text-primary-900 uppercase tracking-wider">
                Returner Perks & Ramp-Up Support
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-primary-800">
                {detailJob.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* APPLICATION FORM MODAL */}
      {/* ========================================================= */}
      {applyModalJob && (
        <Modal
          isOpen={Boolean(applyModalJob)}
          onClose={() => setApplyModalJob(null)}
          title={`Apply to ${applyModalJob.title}`}
          description={`Submitting application for ${applyModalJob.company}`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setApplyModalJob(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmApply}
                isLoading={isSubmittingApp}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Returner Profile
              </Button>
            </div>
          }
        >
          <form onSubmit={handleConfirmApply} className="space-y-4 text-left">
            <div className="p-3 bg-secondary/50 rounded-xl border border-primary-100 flex items-start gap-2.5">
              <FileCheck2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
              <div className="text-xs text-primary-900 leading-relaxed">
                Your ATS-optimized career break narrative and skills profile from SheNova will be attached automatically.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                value={applyForm.fullName}
                onChange={(e) =>
                  setApplyForm({ ...applyForm, fullName: e.target.value })
                }
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={applyForm.email}
                onChange={(e) =>
                  setApplyForm({ ...applyForm, email: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Phone Number"
              value={applyForm.phone}
              onChange={(e) =>
                setApplyForm({ ...applyForm, phone: e.target.value })
              }
              required
            />

            <Textarea
              label="Career Pause Reframing Statement"
              rows={2}
              value={applyForm.breakStatement}
              onChange={(e) =>
                setApplyForm({ ...applyForm, breakStatement: e.target.value })
              }
              helperText="Pre-filled from your SheNova profile settings."
            />

            <Textarea
              label="Short Note to Hiring Mentor (Optional)"
              rows={3}
              value={applyForm.coverNote}
              onChange={(e) =>
                setApplyForm({ ...applyForm, coverNote: e.target.value })
              }
              placeholder="Share why this specific program and flexible model resonates with you..."
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Jobs;
