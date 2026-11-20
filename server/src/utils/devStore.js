import mongoose from 'mongoose';

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const devJobs = [
  {
    _id: 'job-101',
    jobId: 'job-101',
    title: 'Lead Product Manager (Returnship Cohort)',
    company: 'InnovateHealth Labs (Sample Employer)',
    location: 'Bengaluru, India',
    workMode: 'Remote',
    type: 'Returnship',
    experience: '5+ years',
    breakEligibility: 'Open to 1+ years career pause',
    stipend: '₹85,000 / month (Converts to ₹24-28 LPA)',
    matchScore: 95,
    tags: ['Returnship Cohort', 'Flexible Hours', 'Executive Mentorship'],
    description:
      'A structured 6-month ramp-up program designed for experienced product leaders returning to work after motherhood, caregiving, or personal breaks. You will partner with senior director mentors and lead our core clinical communication workflows.',
    eligibility: [
      'Minimum 4+ years of previous product management or technical strategy experience.',
      'Career break of 1 year or more due to caregiving, family, or personal reasons.',
      'Demonstrated strategic empathy, user research fluency, and cross-functional leadership.',
    ],
    responsibilities: [
      'Own product roadmap for patient-care team communication platform.',
      'Partner closely with 12 engineers and healthcare UX specialists.',
      'Participate in weekly returner peer circles and executive mentorship sessions.',
    ],
    perks: [
      'Childcare allowance & flexible daily core hours (10 AM - 3 PM window)',
      'Designated senior executive sponsor',
      'High conversion rate to full-time leadership role post 6 months',
    ],
    isSample: true,
  },
  {
    _id: 'job-102',
    jobId: 'job-102',
    title: 'Senior Frontend Engineer - Returner Track',
    company: 'FinSphere Technologies (Sample Employer)',
    location: 'Pune, India',
    workMode: 'Flexible',
    type: 'Returnship',
    experience: '3-5 years',
    breakEligibility: 'Open to 1.5+ years career pause',
    stipend: '₹75,000 / month (Full-time ₹16-20 LPA)',
    matchScore: 92,
    tags: ['Tech Refresh', 'React & TypeScript', '4-Day Week Option'],
    description:
      'We welcome software engineers who took time off for family, health, or parenting. Includes 4 weeks of structured React 19 / Modern Web architecture refresher with zero on-call responsibilities during onboarding.',
    eligibility: [
      'Prior 3+ years experience building web applications in JavaScript / TypeScript / React.',
      'Eagerness to modernize frontend skills with component-driven architecture.',
      'Career gap of 18 months or more.',
    ],
    responsibilities: [
      'Build responsive client portals for cross-border payments.',
      'Participate in weekly pairing sessions with principal frontend architects.',
      'Gradually ramp up to full sprint delivery at a sustainable pace.',
    ],
    perks: [
      'Structured 4-week learning sprint paid at full rate',
      'Optional 4-day condensed work week',
      'Zero evening meetings guarantee',
    ],
    isSample: true,
  },
  {
    _id: 'job-103',
    jobId: 'job-103',
    title: 'Product Operations & Strategy Lead',
    company: 'Nexus ScaleWorks (Sample Employer)',
    location: 'Mumbai / Delhi, India',
    workMode: 'Remote',
    type: 'Flexible',
    experience: '4-7 years',
    breakEligibility: 'Open to all pause durations',
    stipend: '₹18,00,000 - ₹22,00,000 / year',
    matchScore: 89,
    tags: ['Async First', 'Results Over Hours', 'Caregiver Friendly'],
    description:
      'Orchestrate product rollout schedules and cross-department communications. Our culture is strictly asynchronous and output-focused, making it ideal for mothers and caregivers requiring deep schedule flexibility.',
    eligibility: [
      'Background in project/program management, business operations, or product delivery.',
      'Exceptional written documentation and stakeholder empathy.',
      'Comfortable with async tools (Notion, Slack, Loom).',
    ],
    responsibilities: [
      'Maintain quarterly roadmap tracker and executive status digests.',
      'Standardize cross-functional release readiness checklists.',
      'Facilitate async sprint reviews across distributed engineering hubs.',
    ],
    perks: ['100% remote anywhere in India', 'Core hours restricted to 11 AM - 3 PM IST', 'Annual learning and wellness budget of ₹75,000'],
    isSample: true,
  },
];

export const devCourses = [
  {
    _id: 'course-1',
    courseId: 1,
    title: 'Generative AI for Product & Tech Leaders',
    category: 'Technology',
    level: 'Modern Refresh',
    duration: '3.5 Hours',
    provider: 'SheNova Hub (Sample Course)',
    isRecommendedGap: true,
    description:
      'Hands-on micro-sprint covering prompt engineering, agentic UX patterns, and AI evaluation metrics.',
    isSample: true,
  },
  {
    _id: 'course-2',
    courseId: 2,
    title: 'Modern Event Analytics (PostHog & Mixpanel)',
    category: 'Technology',
    level: 'Intermediate',
    duration: '2.5 Hours',
    provider: 'SheNova Lab (Sample Course)',
    isRecommendedGap: true,
    description:
      'Move past legacy pageviews to event-driven user funnels, behavioral cohorts, and retention curves.',
    isSample: true,
  },
  {
    _id: 'course-3',
    courseId: 3,
    title: 'Modern Agile, Jira Cloud & Asynchronous Team Tooling',
    category: 'Technology',
    level: 'Beginner Friendly',
    duration: '2.0 Hours',
    provider: 'SheNova Hub (Sample Course)',
    isRecommendedGap: false,
    description:
      'Re-align with remote and hybrid collaboration workflows in 2026, using Notion, Jira Cloud, and Loom.',
    isSample: true,
  },
  {
    _id: 'course-4',
    courseId: 4,
    title: 'Returner Leadership: Salary Negotiation & Parity',
    category: 'Professional Development',
    level: 'Executive',
    duration: '1.5 Hours',
    provider: 'Executive Mentor Pod (Sample Course)',
    isRecommendedGap: true,
    description:
      'Tactics to negotiate senior returner titles and overcome motherhood penalty salary discounts.',
    isSample: true,
  },
];

export const devMentors = [
  {
    _id: 'm-1',
    mentorId: 'm-1',
    name: 'Dr. Radhika Sen',
    role: 'VP of Product Engineering • Former 4-yr Childcare Pause',
    company: 'HealthScale Global (Sample Mentor)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    expertise: ['Product Roadmapping', 'Overcoming Gap Bias', 'Executive Presence'],
    bio: 'Returned to engineering leadership after a 4-year break raising twins. Passionate about helping women transition into director and VP roles.',
    availability: '2 slots open this month',
    isSample: true,
  },
  {
    _id: 'm-2',
    mentorId: 'm-2',
    name: 'Priyanka Nambiar',
    role: 'Senior Staff Frontend Architect • 3-yr Pause',
    company: 'FinFlow Technologies (Sample Mentor)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    expertise: ['React 19 & Next.js', 'System Architecture', 'Coding Interviews'],
    bio: 'Successfully navigated tech shifts after caregiving. I review code portfolios and conduct technical mock whiteboard reviews.',
    availability: '1 slot open this week',
    isSample: true,
  },
  {
    _id: 'm-3',
    mentorId: 'm-3',
    name: 'Shreya Kulkarni',
    role: 'Director of People & Culture • 5-yr Relocation Break',
    company: 'Apex Venture Partners (Sample Mentor)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    expertise: ['Salary Parity', 'Behavioral Interviews', 'Work-Life Boundaries'],
    bio: 'Advocate for zero-gap-penalty hiring. Specializing in negotiation strategy and returning after international relocation.',
    availability: '3 slots open this month',
    isSample: true,
  },
];

export const devSuccessStories = [
  {
    _id: 'story-1',
    name: 'Nandini Swaminathan',
    breakDuration: '5 Years (Maternity & Eldercare)',
    previousRole: 'Software Engineer (2014 - 2018)',
    returnedRole: 'Senior Cloud DevOps Architect at FinTech Corp',
    quote:
      'When I decided to return after 5 years, every recruiter asked why I stopped coding. SheNova taught me to reframe that time: I did not stop problem solving—I was the primary coordinator of household logistics while upskilling. My returnship welcomed me with open arms.',
    advice:
      'Start with 30-minute daily sprints. Consistency beats intensity when you have family commitments.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    isSample: true,
  },
  {
    _id: 'story-2',
    name: 'Fatima Al-Mansoor',
    breakDuration: '3.5 Years (International Relocation & Childcare)',
    previousRole: 'Digital Marketing Lead (2016 - 2021)',
    returnedRole: 'Director of Growth Marketing at E-Commerce Brand',
    quote:
      'Moving countries with a newborn felt like pressing pause on my identity. Finding a mentor on SheNova who had gone through the exact same journey gave me back my fire. Within 3 months of mock interviews, I signed an offer for an executive position.',
    advice:
      'Never accept a junior title returner penalty. Your maturity is a premium asset.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    isSample: true,
  },
];

export const devForumPosts = [
  {
    _id: 'post-1',
    author: 'Rohini Deshmukh',
    role: 'Returned after 4 yrs • Now Tech Lead at FinTech',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    category: 'Success & Offer Negotiation',
    title: 'Just signed my returnship offer letter! Here is what worked for me',
    content:
      'To any sister reading this who feels invisible after a baby break: your experience is so valuable. During interviews, whenever they asked about my 4-year pause, I spoke about household budget management, crisis triage, and continuous learning. Do not apologize for your break!',
    cheers: 42,
    cheeredBy: [],
    replies: [
      {
        author: 'Ananya Sharma',
        text: 'Needed this encouragement so much today! Did they bring up salary parity or did you have to negotiate firmly?',
        createdAt: new Date().toISOString(),
      },
    ],
    isSample: true,
    createdAt: new Date().toISOString(),
  },
];

export const devMentorshipRequests = [];
export const devSavedJobs = [];
export const devJobApplications = [];
export const devRoadmaps = new Map();
export const devResumes = new Map();
export const devSkillAnalyses = new Map();
export const devCourseProgress = new Map();
export const devInterviewSessions = new Map();
