import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCheck2,
  Users2,
  Brain,
  CheckCircle2,
  HeartHandshake,
  Clock,
  Target,
  Mic,
  GraduationCap,
  Users,
  Briefcase,
  Star,
  Quote,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// Scroll animation container variant
const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Custom SVG Illustration representing confident professional women returning to leadership
const HeroIllustration = () => (
  <div className="relative w-full max-w-lg mx-auto lg:max-w-none flex items-center justify-center">
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[440px]">
      {/* Background Soft Glow Orbs */}
      <div className="absolute -top-6 -left-6 w-56 h-56 bg-secondary rounded-full filter blur-3xl opacity-70 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-60 h-60 bg-accent-100 rounded-full filter blur-3xl opacity-60 pointer-events-none" />

      {/* Main SVG Composition */}
      <svg
        viewBox="0 0 540 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-soft-lg select-none"
      >
        <defs>
          <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7041A6" />
            <stop offset="100%" stopColor="#46256C" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F28BA8" />
            <stop offset="100%" stopColor="#DE5681" />
          </linearGradient>
          <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FAF9FC" stopOpacity="0.9" />
          </linearGradient>
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#292536" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Ambient Stage & Pedestal */}
        <ellipse cx="270" cy="355" rx="220" ry="32" fill="#EDE5F7" opacity="0.6" />
        <ellipse cx="270" cy="355" rx="150" ry="18" fill="#DECFF0" opacity="0.5" />

        {/* Background Architectural Growth Arch */}
        <path
          d="M 120 350 A 150 150 0 0 1 420 350"
          stroke="#DECFF0"
          strokeWidth="3"
          strokeDasharray="6 6"
        />

        {/* --- Woman 1 (Left - Tech & Architecture Specialist) --- */}
        <g id="woman-tech">
          {/* Body/Suit */}
          <path d="M 115 350 L 130 260 L 195 260 L 210 350 Z" fill="#46256C" />
          {/* Blazer Lapel */}
          <path d="M 145 260 L 162 315 L 180 260 Z" fill="#FAF9FC" />
          <path d="M 130 260 L 162 320 L 148 350" stroke="#7041A6" strokeWidth="2" fill="none" />
          {/* Neck */}
          <rect x="153" y="235" width="18" height="28" rx="4" fill="#E8B49B" />
          {/* Head & Hair */}
          <ellipse cx="162" cy="210" rx="24" ry="30" fill="#E8B49B" />
          {/* Confident sleek bob hair */}
          <path
            d="M 134 215 C 132 170 192 170 190 215 C 190 240 182 245 182 245 C 182 245 178 200 162 200 C 146 200 142 245 142 245 C 142 245 134 240 134 215 Z"
            fill="#292536"
          />
          {/* Stylish Glasses */}
          <rect x="146" y="206" width="14" height="9" rx="2" stroke="#7041A6" strokeWidth="2" fill="none" />
          <rect x="164" y="206" width="14" height="9" rx="2" stroke="#7041A6" strokeWidth="2" fill="none" />
          <line x1="160" y1="210" x2="164" y2="210" stroke="#7041A6" strokeWidth="2" />
          {/* Tablet/Portfolio in arm */}
          <rect x="180" y="285" width="45" height="32" rx="4" fill="#7041A6" transform="rotate(-15 180 285)" />
          <rect x="183" y="288" width="39" height="26" rx="2" fill="#FAF9FC" transform="rotate(-15 180 285)" />
        </g>

        {/* --- Woman 2 (Center - Empowered Leader & Returner) --- */}
        <g id="woman-leader">
          {/* Main Dress/Blazer */}
          <path d="M 215 350 L 235 230 L 305 230 L 325 350 Z" fill="url(#primaryGrad)" />
          {/* Inner Accent Top */}
          <path d="M 250 230 L 270 285 L 290 230 Z" fill="url(#accentGrad)" />
          {/* Neck */}
          <rect x="260" y="205" width="20" height="28" rx="4" fill="#F0C2A2" />
          {/* Confident Head */}
          <ellipse cx="270" cy="180" rx="26" ry="32" fill="#F0C2A2" />
          {/* Voluminous Hair in High Professional Bun */}
          <circle cx="270" cy="138" r="22" fill="#3D2314" />
          <path
            d="M 240 185 C 238 145 302 145 300 185 C 300 205 295 210 295 210 C 295 210 290 172 270 172 C 250 172 245 210 245 210 C 245 210 240 205 240 185 Z"
            fill="#3D2314"
          />
          {/* Uplifted Smile & Features */}
          <path d="M 264 192 Q 270 197 276 192" stroke="#874D28" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Confident Crossed Arms with Smartwatch */}
          <ellipse cx="270" cy="275" rx="42" ry="14" fill="#5A3289" />
          <rect x="290" y="271" width="8" height="8" rx="2" fill="#F28BA8" />
        </g>

        {/* --- Woman 3 (Right - Creative Product Director) --- */}
        <g id="woman-product">
          {/* Elegant Modern Outfit */}
          <path d="M 330 350 L 345 255 L 415 255 L 430 350 Z" fill="#F28BA8" />
          {/* Blazer Contrast */}
          <path d="M 355 255 L 380 325 L 405 255 Z" fill="#FAF9FC" />
          {/* Neck */}
          <rect x="371" y="230" width="18" height="28" rx="4" fill="#DFA888" />
          {/* Head & Features */}
          <ellipse cx="380" cy="205" rx="24" ry="29" fill="#DFA888" />
          {/* Long flowing wavy hair */}
          <path
            d="M 352 205 C 350 160 410 160 408 205 C 412 250 418 280 405 285 C 395 255 396 195 380 195 C 364 195 365 255 355 285 C 342 280 348 250 352 205 Z"
            fill="#1E1B29"
          />
          {/* Uplifted Raised Hand gesture (Pointing Forward) */}
          <path d="M 405 270 L 440 230 L 452 238 L 420 285 Z" fill="#F28BA8" />
          <circle cx="448" cy="232" r="6" fill="#DFA888" />
        </g>

        {/* --- Floating Interactive Glassmorphism Metric Badges --- */}
        
        {/* Floating Card Top-Left: Career Gap Reframed */}
        <g transform="translate(18, 55)" filter="url(#shadowFilter)">
          <rect width="180" height="58" rx="16" fill="url(#cardGrad)" stroke="#EDE5F7" strokeWidth="1.5" />
          <circle cx="28" cy="29" r="14" fill="#EDE5F7" />
          <path d="M 23 29 L 27 33 L 34 25" stroke="#7041A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="50" y="24" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#7041A6" letterSpacing="0.5">
            PAUSE REFRAMED
          </text>
          <text x="50" y="42" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="13" fontWeight="800" fill="#292536">
            +3.5 Yrs Leadership
          </text>
        </g>

        {/* Floating Card Top-Right: Returnship Match Score */}
        <g transform="translate(340, 75)" filter="url(#shadowFilter)">
          <rect width="182" height="58" rx="16" fill="url(#cardGrad)" stroke="#FDE7EE" strokeWidth="1.5" />
          <circle cx="28" cy="29" r="14" fill="#FDE7EE" />
          <path d="M 28 20 L 28 38 M 22 26 L 28 20 L 34 26" stroke="#DE5681" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="50" y="24" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#DE5681" letterSpacing="0.5">
            RETURNSHIP MATCH
          </text>
          <text x="50" y="42" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="13" fontWeight="800" fill="#292536">
            94% Confidence Fit
          </text>
        </g>

        {/* Floating Card Bottom-Center: Onboarding Cohort Ready */}
        <g transform="translate(160, 310)" filter="url(#shadowFilter)">
          <rect width="220" height="50" rx="14" fill="#FFFFFF" stroke="#DECFF0" strokeWidth="1.5" />
          <circle cx="26" cy="25" r="10" fill="#10B981" />
          <circle cx="26" cy="25" r="5" fill="#FFFFFF" />
          <text x="46" y="22" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="600" fill="#716B87">
            Active Onboarding Cohort
          </text>
          <text x="46" y="38" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight="700" fill="#292536">
            Verified Mentorship Program
          </text>
        </g>

        {/* Floating Starlight Accents */}
        <path d="M 100 135 L 103 145 L 113 148 L 103 151 L 100 161 L 97 151 L 87 148 L 97 145 Z" fill="#F28BA8" opacity="0.8" />
        <path d="M 460 170 L 462 178 L 470 180 L 462 182 L 460 190 L 458 182 L 450 180 L 458 178 Z" fill="#7041A6" opacity="0.7" />
        <circle cx="270" cy="90" r="3" fill="#F28BA8" />
        <circle cx="430" cy="120" r="4" fill="#DECFF0" />
      </svg>
    </div>
  </div>
);

export const Home = () => {
  const navigate = useNavigate();

  // 1. Stats data (clearly labeled as Demo data per user request)
  const stats = [
    { value: '12,400+', label: 'Women Supported', sub: 'Across 14 career domains' },
    { value: '850+', label: 'Vetted Returnships', sub: 'With structured onboarding' },
    { value: '140+', label: 'Focused Micro-Sprints', sub: 'Designed for 30-min windows' },
    { value: '91%', label: 'Confidence Score Gain', sub: 'Post AI scenario practice' },
  ];

  // 2. How it works (4 steps)
  const steps = [
    {
      step: '01',
      title: 'Share Your Story & Pause',
      description: 'Document your prior domain, break duration, and life priorities (motherhood, caregiving, relocation, or wellness) without fear of judgment.',
      icon: HeartHandshake,
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Get Your AI Return Roadmap',
      description: 'Gemini evaluates the delta between when you stepped away and today\'s market to generate a realistic, paced 60-day ramp plan.',
      icon: Compass,
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'Bridge Deltas in Micro-Sprints',
      description: 'Learn modern tools (GenAI, Jira Cloud, modern analytics) and practice voice mock interviews in low-stress, bitesize daily windows.',
      icon: Brain,
      badge: 'Step 3',
    },
    {
      step: '04',
      title: 'Step Into Vetted Returnships',
      description: 'Apply with a gap-celebrating resume directly to verified partner organizations that champion returning women with mentorship.',
      icon: Briefcase,
      badge: 'Step 4',
    },
  ];

  // 3. Features (cards)
  const features = [
    {
      icon: Compass,
      title: 'AI Career Roadmap',
      desc: 'Paced, realistic milestones customized to your prior seniority, exact pause duration, and daily family time budget.',
      link: '/roadmap',
      tag: 'Adaptive AI',
    },
    {
      icon: Target,
      title: 'Skill-Gap Analyzer',
      desc: 'Pinpoints exactly which tools and frameworks evolved while you were away, so you only learn what truly moves the needle.',
      link: '/skill-gap',
      tag: 'Delta Matrix',
    },
    {
      icon: FileCheck2,
      title: 'Break-Friendly Resume Builder',
      desc: 'Reframes your career pause into active leadership, crisis management, and continuous learning that ATS screeners reward.',
      link: '/resume-builder',
      tag: 'ATS Optimized',
    },
    {
      icon: Briefcase,
      title: 'Vetted Returnships & Jobs',
      desc: 'Exclusive access to corporate returnship programs featuring dedicated ramp-up cohorts and executive sponsors.',
      link: '/jobs',
      tag: 'No Break Penalty',
    },
    {
      icon: Mic,
      title: 'AI Confidence Mock Interviews',
      desc: 'Warm, voice-enabled practice sessions to conquer tough returner questions with real-time feedback and metrics.',
      link: '/interview',
      tag: 'Voice & Scenario',
    },
    {
      icon: GraduationCap,
      title: 'Micro-Learning Hub',
      desc: 'Curated 30-minute sprint modules on modern workflows, generative AI tools, and salary negotiation strategies.',
      link: '/learning',
      tag: 'Self-Paced',
    },
    {
      icon: Users,
      title: 'Sisterhood Mentorship',
      desc: 'A supportive, safe circle of fellow returners and senior alumni who share referral links, tips, and daily cheer.',
      link: '/community',
      tag: 'Peer Circle',
    },
  ];

  // 4. Testimonials (Sample profiles per rule)
  const sampleTestimonials = [
    {
      quote: "After a 4-year pause for twins, standard job portals made me feel obsolete. SheNova's roadmap showed me that only 20% of my tech stack changed. Within 8 weeks, I secured a Senior Tech Lead returnship.",
      author: 'Pooja Kulkarni',
      role: 'Senior Tech Lead (Returned 2025)',
      breakInfo: '4-Year Childcare Break',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    {
      quote: "The Break-Friendly Resume Architect changed how I view my gap. I stopped apologizing for caring for my elderly parents and framed it as executive orchestration. The employer loved it.",
      author: 'Meenakshi Iyer',
      role: 'Director of People Operations',
      breakInfo: '3-Year Family Care Break',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    },
    {
      quote: "The mock interview practice was my breakthrough. Being able to rehearse answering 'Explain your 5-year gap' in private until I felt grounded and calm made all the difference.",
      author: 'Shalini Nambiar',
      role: 'Lead UX Researcher',
      breakInfo: '5-Year Motherhood Break',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-20 md:space-y-32 py-6 md:py-12 overflow-hidden">
      {/* SECTION 1: HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex">
              <Badge variant="secondary" size="lg" className="shadow-soft-sm py-1.5 px-3.5">
                <Sparkles className="w-4 h-4 text-primary-600 mr-2" />
                <span className="font-semibold text-primary-900">
                  AI Career Restart Companion for Returning Women
                </span>
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-ink tracking-tight leading-[1.12]"
            >
              Your Career Deserves <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
                Another Beginning.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              A career pause for motherhood, marriage, caregiving, or life reflection is not lost time—it is real-world leadership. SheNova gives you the personalized AI roadmap, modern skill refresh, and verified returnships to step back in with unwavering confidence.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto text-base shadow-soft-md"
              >
                Start Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/jobs')}
                leftIcon={<Briefcase className="w-5 h-5 text-primary-600" />}
                className="w-full sm:w-auto text-base border-primary-200 hover:bg-primary-50"
              >
                Explore Opportunities
              </Button>
            </motion.div>

            {/* Micro-trust indicators */}
            <motion.div
              variants={fadeInUp}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-ink-muted font-medium"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero break-penalty environment
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary-500" />
                Vetted returnship employers
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-accent-500" />
                Sisterhood circle support
              </span>
            </motion.div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-5"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: STATS (Clearly labeled Demo data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeInUp}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-surface-border shadow-soft-md relative"
        >
          {/* Mandatory Demo Data Label */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-6 mb-6 border-b border-surface-border/60">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-bold text-ink uppercase tracking-wider font-heading">
                Platform Impact Benchmark
              </span>
            </div>
            <Badge variant="demo" size="sm">
              Demo data / Benchmark simulation
            </Badge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1.5 text-center sm:text-left">
                <div className="font-heading font-extrabold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-ink font-heading">{stat.label}</div>
                <div className="text-xs text-ink-muted">{stat.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="primary" size="sm">
            Step-by-Step Pathway
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-ink">
            How SheNova Empowers Your Return
          </h2>
          <p className="text-sm sm:text-base text-ink-muted">
            A structured, dignified journey designed around your pace, existing expertise, and personal life schedule.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div key={i} variants={fadeInUp} className="flex">
                <Card isHoverable className="w-full flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
                  <div>
                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary-600 shadow-soft-sm group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-2xl font-black text-primary-300">
                        {st.step}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-ink mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-surface-border/50 flex items-center text-xs font-semibold text-primary-600">
                    <span>{st.badge}</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* SECTION 4: FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <Badge variant="accent" size="sm">
            Complete Career Companion
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-ink">
            Engineered Specifically for Returning Talent
          </h2>
          <p className="text-sm sm:text-base text-ink-muted">
            Generic job boards penalize career gaps. SheNova provides the dedicated toolkit that turns your gap into your greatest competitive advantage.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div key={i} variants={fadeInUp} className="flex">
                <Card
                  isHoverable
                  onClick={() => navigate(feat.link)}
                  className="w-full flex flex-col justify-between cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" size="sm">
                        {feat.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary-700 transition-colors">
                      {feat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs sm:text-sm">
                      {feat.desc}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="justify-between text-xs font-semibold text-primary-600 pt-3">
                    <span>Explore module</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* SECTION 5: TESTIMONIALS (Clearly labeled Sample profiles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary/40 rounded-3xl p-6 sm:p-12 border border-primary-100">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" size="sm">
                Success Journeys
              </Badge>
              <Badge variant="demo" size="sm">
                Sample Profiles
              </Badge>
            </div>
            <h2 className="text-3xl font-heading font-extrabold text-ink">
              Stories from Women Who Restarted
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              Representative examples of women who reframed their career pause and returned to impact.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {sampleTestimonials.map((t, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex">
                <Card className="bg-white flex flex-col justify-between shadow-soft-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-primary-400">
                      <Quote className="w-8 h-8 fill-primary-100 text-primary-400" />
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-ink leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-surface-border flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-200"
                    />
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-ink truncate">
                        {t.author}
                      </h4>
                      <p className="text-[11px] text-primary-700 font-medium truncate">
                        {t.role}
                      </p>
                      <span className="text-[10px] text-ink-subtle block">
                        {t.breakInfo} • <span className="font-mono">Sample</span>
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-r from-primary-800 via-primary-700 to-accent-600 text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-soft-xl"
        >
          {/* Subtle Decorative Background Rings */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border-[20px] border-white/10 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-[20px] border-white/10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6 text-center sm:text-left">
            <Badge variant="accent" size="sm" className="bg-white/20 text-white border-white/30">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-accent-200" />
              Your Career Renaissance Awaits
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
              Ready to Turn Your Career Pause Into Your Greatest Strength?
            </h2>

            <p className="text-primary-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
              Join thousands of returning women reframing their experience, mastering modern skills, and securing high-impact returnships.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                size="lg"
                variant="accent"
                onClick={() => navigate('/signup')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto text-base shadow-soft-lg font-bold"
              >
                Start Your Journey Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/roadmap')}
                className="w-full sm:w-auto text-base text-white border-white/40 hover:bg-white/10 hover:text-white"
              >
                Preview Free Return Roadmap
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
