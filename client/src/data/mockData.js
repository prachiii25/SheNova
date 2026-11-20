/**
 * Sample / Demo Data for SheNova Platform
 * NOTE: All data here is strictly for demonstration purposes.
 * Real employer data will be connected via vetted API endpoints.
 */

export const DEMO_USER = {
  id: 'usr_demo_101',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  title: 'Senior Product Lead Aspirant',
  careerBreak: {
    duration: '3.5 Years',
    reason: 'Motherhood & Primary Childcare',
    priorRole: 'Product Manager at TechCorp (2018 - 2022)',
    skillsRetained: ['Product Roadmapping', 'User Research', 'Agile/Scrum', 'Stakeholder Alignment'],
    skillsToRefresh: ['AI / LLM Product Strategy', 'Modern Analytics (Mixpanel/Amplitude)', 'System Architecture'],
  },
  readinessScore: 78,
  confidenceScore: 84,
  resumeCompletion: 85,
};

export const DEMO_ROADMAP_MILESTONES = [
  {
    id: 1,
    title: 'Self-Audit & Skills Inventory',
    status: 'completed',
    description: 'Documented 6 core product competencies and identified 3 refresh areas.',
    estimatedHours: '4 hrs',
  },
  {
    id: 2,
    title: 'AI Product Strategy Refresh',
    status: 'in-progress',
    description: 'Complete hands-on sprint on designing generative AI user flows & metrics.',
    estimatedHours: '12 hrs',
  },
  {
    id: 3,
    title: 'Returnship-Optimized Resume',
    status: 'upcoming',
    description: 'Frame career pause as active personal leadership with quantified milestones.',
    estimatedHours: '3 hrs',
  },
  {
    id: 4,
    title: 'Mock Behavioral & Scenario Interview',
    status: 'upcoming',
    description: 'Practice answering return-to-work questions with empathetic AI interviewer.',
    estimatedHours: '5 hrs',
  },
];

export const DEMO_CAREER_PROGRESS_STEPS = [
  {
    step: 1,
    id: 'audit',
    name: 'Self-Audit & Pause Intake',
    status: 'completed',
    date: 'Completed Oct 14',
    desc: 'Documented 5 years prior experience & 3.5-year childcare leadership narrative.',
  },
  {
    step: 2,
    id: 'roadmap',
    name: 'AI Return Roadmap',
    status: 'completed',
    date: 'Completed Oct 28',
    desc: 'Calibrated 60-day personalized ramp plan with 8 hours/week time budget.',
  },
  {
    step: 3,
    id: 'refresh',
    name: 'Skill Delta Refresh',
    status: 'in-progress',
    date: 'Active • 70% finished',
    desc: 'Currently completing GenAI Product Strategy and Modern Jira Tooling micro-sprints.',
  },
  {
    step: 4,
    id: 'resume',
    name: 'ATS Gap-Friendly Resume',
    status: 'in-progress',
    date: '85% Complete',
    desc: 'Resume statement framed; awaiting final certification credential tags.',
  },
  {
    step: 5,
    id: 'interviews',
    name: 'AI Mock Interviews & Returnships',
    status: 'upcoming',
    date: 'Target Nov 25',
    desc: 'Complete 3 voice scenario rehearsals before applying to cohort partner roles.',
  },
];

export const DEMO_RESUME_METRICS = {
  overallScore: 85,
  status: 'Ready for Review',
  sections: [
    { name: 'Contact & Portfolio Links', score: 100, completed: true },
    { name: 'Prior Core Experience', score: 100, completed: true },
    { name: 'Career Break Reframing Statement', score: 90, completed: true },
    { name: 'Modern Keyword Matching (AI/Cloud)', score: 75, completed: false },
    { name: 'Refresher Certifications', score: 65, completed: false },
  ],
  tips: 'Adding 1 more generative AI tool tag will raise ATS match score to 92%.',
};

export const DEMO_SKILL_PROGRESS = [
  {
    id: 'skill-1',
    name: 'Generative AI UX & Workflows',
    category: 'Emerging Skill',
    progress: 72,
    hoursInvested: '6.5 hrs',
    target: '8 hrs',
    status: 'In Progress',
  },
  {
    id: 'skill-2',
    name: 'Modern Agile & Jira Cloud Tooling',
    category: 'Tooling Refresh',
    progress: 90,
    hoursInvested: '4 hrs',
    target: '4.5 hrs',
    status: 'Almost Complete',
  },
  {
    id: 'skill-3',
    name: 'Product Analytics (Mixpanel / PostHog)',
    category: 'Core Competency Refresh',
    progress: 60,
    hoursInvested: '3.5 hrs',
    target: '6 hrs',
    status: 'In Progress',
  },
  {
    id: 'skill-4',
    name: 'Stakeholder Alignment & Negotiation',
    category: 'Retained Leadership',
    progress: 95,
    hoursInvested: '5 hrs',
    target: '5 hrs',
    status: 'Mastered',
  },
];

export const DEMO_UPCOMING_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Voice Practice: "Explaining Your Career Gap"',
    type: 'AI Mock Interview',
    time: 'Today • Flexible 15 mins',
    badge: 'High Priority',
    route: '/interview',
  },
  {
    id: 'act-2',
    title: 'Sprint 3: AI Product Metrics & User Flows',
    type: 'Micro-Learning',
    time: 'Tomorrow • 30 mins',
    badge: 'In Progress',
    route: '/learning',
  },
  {
    id: 'act-3',
    title: 'Sisterhood Cohort: Live Returner Q&A Session',
    type: 'Community Circle',
    time: 'Saturday, 11:00 AM IST',
    badge: 'Peer Group',
    route: '/community',
  },
];

export const DEMO_JOBS = [
  {
    id: 'job-1',
    title: 'Lead Product Manager (Returnship Cohort)',
    company: 'InnovateHealth Labs (Sample Employer)',
    location: 'Remote / Bengaluru, India',
    type: 'Returnship (6 Months to Full-Time)',
    stipend: '₹85,000 / month',
    breakFriendly: true,
    description: 'Structured 6-month ramp-up program with designated executive mentorship, flexible hours, and childcare allowance.',
    tags: ['Returnship Cohort', 'Flexible Hours', 'Mentorship Included'],
  },
  {
    id: 'job-2',
    title: 'Full Stack Engineer - Returner Track',
    company: 'FinSphere Technologies (Sample Employer)',
    location: 'Hybrid / Pune, India',
    type: 'Full-time with Onboarding Cohort',
    stipend: '₹14-18 LPA',
    breakFriendly: true,
    description: 'Welcoming engineers returning after 1+ years break. 4 weeks dedicated upskilling cohort provided with flexible start dates.',
    tags: ['Upskilling Cohort', 'Parent Support Network', 'Hybrid'],
  },
  {
    id: 'job-3',
    title: 'Product Operations & Strategy Lead',
    company: 'Nexus ScaleWorks (Sample Employer)',
    location: 'Remote / Mumbai or Delhi, India',
    type: 'Returner Friendly Full-Time',
    stipend: '₹16-22 LPA',
    breakFriendly: true,
    description: 'Dedicated team championing parents and caregivers. Focus on cross-team communication and strategic roadmap alignment.',
    tags: ['Remote First', 'Family-Friendly Hours', 'Returner Welcome'],
  },
];
