import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
  Heart,
  MessageSquare,
  Sparkles,
  Plus,
  Calendar,
  Send,
  Star,
  Quote,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Filter,
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
} from '../components/ui';

import { useAuth } from '../hooks/useAuth';

export const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('mentors');

  // =========================================================
  // 1. MENTORS STATE & MENTORSHIP REQUEST MODAL
  // =========================================================
  const sampleMentors = [
    {
      id: 'm-1',
      name: 'Dr. Radhika Sen',
      role: 'VP of Product Engineering • Former 4-yr Childcare Pause',
      company: 'HealthScale Global (Sample Mentor)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      expertise: ['Product Roadmapping', 'Overcoming Gap Bias', 'Executive Presence'],
      bio: 'Returned to engineering leadership after a 4-year break raising twins. Passionate about helping women transition into director and VP roles.',
      availability: '2 slots open this month',
    },
    {
      id: 'm-2',
      name: 'Priyanka Nambiar',
      role: 'Senior Staff Frontend Architect • 3-yr Pause',
      company: 'FinFlow Technologies (Sample Mentor)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      expertise: ['React 19 & Next.js', 'System Architecture', 'Coding Interviews'],
      bio: 'Successfully navigated tech shifts after caregiving. I review code portfolios and conduct technical mock whiteboard reviews.',
      availability: '1 slot open this week',
    },
    {
      id: 'm-3',
      name: 'Shreya Kulkarni',
      role: 'Director of People & Culture • 5-yr Relocation Break',
      company: 'Apex Venture Partners (Sample Mentor)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      expertise: ['Salary Parity', 'Behavioral Interviews', 'Work-Life Boundaries'],
      bio: 'Advocate for zero-gap-penalty hiring. Specializing in negotiation strategy and returning after international relocation.',
      availability: '3 slots open this month',
    },
  ];

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorshipForm, setMentorshipForm] = useState({
    topic: 'Resume & Gap Narrative Review',
    message:
      'Hi, I am returning after a 3.5-year childcare pause and would love guidance on modernizing my portfolio and tackling executive interviews.',
    preferredTime: 'Weekday mornings (10 AM - 12 PM)',
  });
  const [isSubmittingMentorship, setIsSubmittingMentorship] = useState(false);

  // Stored Mentorship Requests
  const [sentRequests, setSentRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('shenova_mentorship_requests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSendMentorshipRequest = (e) => {
    e.preventDefault();
    setIsSubmittingMentorship(true);
    setTimeout(() => {
      const newReq = {
        id: Date.now(),
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        topic: mentorshipForm.topic,
        sentAt: new Date().toLocaleDateString(),
      };
      const updated = [...sentRequests, newReq];
      setSentRequests(updated);
      localStorage.setItem('shenova_mentorship_requests', JSON.stringify(updated));
      setIsSubmittingMentorship(false);
      setSelectedMentor(null);
      toast.success(`Mentorship request sent to ${selectedMentor.name}!`);
    }, 600);
  };

  // =========================================================
  // 2. FORUMS STATE, CREATE POST & THREAD REPLIES
  // =========================================================
  const [forumPosts, setForumPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('shenova_forum_posts');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [
      {
        id: 1,
        author: 'Rohini Deshmukh',
        role: 'Returned after 4 yrs • Now Tech Lead at FinTech',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        category: 'Success & Offer Negotiation',
        time: '2 hours ago',
        title: 'Just signed my returnship offer letter! Here is what worked for me',
        content:
          'To any sister reading this who feels invisible after a baby break: your experience is so valuable. During interviews, whenever they asked about my 4-year pause, I spoke about household budget management, crisis triage, and continuous learning. Do not apologize for your break!',
        cheers: 42,
        hasCheered: false,
        replies: [
          {
            id: 101,
            author: 'Ananya Sharma (You)',
            time: '1 hour ago',
            text: 'Needed this encouragement so much today! Did they bring up salary parity or did you have to negotiate firmly?',
          },
          {
            id: 102,
            author: 'Rohini Deshmukh',
            time: '45 mins ago',
            text: 'I used the SheNova salary negotiation guide! Anchored at market rate for my seniority rather than accepting an entry returner discount.',
          },
        ],
      },
      {
        id: 2,
        author: 'Sunita Menon',
        role: 'Returner Candidate • 3 yrs Childcare Break',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
        category: 'Interview Preparation',
        time: 'Yesterday',
        title: 'Has anyone used the AI Mock Interview voice simulator?',
        content:
          'Practicing with the AI voice module really calmed my interview nerves. Repeating my career break story aloud until it sounded natural and proud made a massive difference. Highly recommend trying at least 2 sessions!',
        cheers: 28,
        hasCheered: true,
        replies: [
          {
            id: 201,
            author: 'Pooja K.',
            time: 'Yesterday',
            text: 'Agreed! Hearing the AI model answers gave me great phrasing for explaining my 5-year break.',
          },
        ],
      },
    ];
  });

  // Save forum posts
  useEffect(() => {
    localStorage.setItem('shenova_forum_posts', JSON.stringify(forumPosts));
  }, [forumPosts]);

  // Create Post Modal State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Career Restart Advice',
    content: '',
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please enter both title and content.');
      return;
    }

    const created = {
      id: Date.now(),
      author: user?.name || 'Ananya Sharma',
      role: `${user?.targetRole || 'Returner Specialist'} (You)`,
      avatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      category: newPost.category,
      time: 'Just now',
      title: newPost.title,
      content: newPost.content,
      cheers: 1,
      hasCheered: true,
      replies: [],
    };

    setForumPosts([created, ...forumPosts]);
    setNewPost({ title: '', category: 'Career Restart Advice', content: '' });
    setIsPostModalOpen(false);
    toast.success('Your thread has been posted to the Sisterhood Circle!');
  };

  const handleToggleCheer = (postId) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const cheered = !p.hasCheered;
          toast.success(cheered ? 'Cheer sent! ❤️' : 'Cheer removed');
          return {
            ...p,
            cheers: cheered ? p.cheers + 1 : p.cheers - 1,
            hasCheered: cheered,
          };
        }
        return p;
      })
    );
  };

  // Reply State
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleAddReply = (postId) => {
    if (!replyText.trim()) return;

    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newReply = {
            id: Date.now(),
            author: `${user?.name || 'Ananya Sharma'} (You)`,
            time: 'Just now',
            text: replyText.trim(),
          };
          return { ...p, replies: [...p.replies, newReply] };
        }
        return p;
      })
    );
    setReplyText('');
    setActiveReplyPostId(null);
    toast.success('Reply added to discussion!');
  };

  // =========================================================
  // 3. SUCCESS STORIES DATA
  // =========================================================
  const sampleStories = [
    {
      id: 's-1',
      name: 'Nandini Swaminathan',
      breakDuration: '5 Years (Maternity & Eldercare)',
      previousRole: 'Software Engineer (2014 - 2018)',
      returnedRole: 'Senior Cloud DevOps Architect at FinTech Corp',
      quote:
        'When I decided to return after 5 years, every recruiter asked why I stopped coding. SheNova taught me to reframe that time: I did not stop problem solving—I was the primary coordinator of household logistics while upskilling. My returnship welcomed me with open arms.',
      advice:
        'Start with 30-minute daily sprints. Consistency beats intensity when you have family commitments.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 's-2',
      name: 'Fatima Al-Mansoor',
      breakDuration: '3.5 Years (International Relocation & Childcare)',
      previousRole: 'Digital Marketing Lead (2016 - 2021)',
      returnedRole: 'Director of Growth Marketing at E-Commerce Brand',
      quote:
        'Moving countries with a newborn felt like pressing pause on my identity. Finding a mentor on SheNova who had gone through the exact same journey gave me back my fire. Within 3 months of mock interviews, I signed an offer for an executive position.',
      advice:
        'Never accept a junior title returner penalty. Your maturity is a premium asset.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 's-3',
      name: 'Deepa Narayanan',
      breakDuration: '4 Years (Full-Time Motherhood)',
      previousRole: 'QA Analyst (2015 - 2019)',
      returnedRole: 'Lead SDET & Automation Engineer at HealthTech',
      quote:
        'I thought my automation skills were obsolete. The SheNova delta analyzer showed me I only needed to learn Cypress and Playwright. The gap was just 3 weeks of practice.',
      advice:
        'Do not relearn what you already know. Focus strictly on the delta changes in modern tooling.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" size="sm">
              <Users className="w-3.5 h-3.5 mr-1" />
              Sisterhood Circle
            </Badge>
            <Badge variant="demo" size="sm">
              Demo mode • Peer & Mentor Network
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-ink tracking-tight">
            Community, Mentors & Stories
          </h1>
          <p className="text-sm text-ink-muted">
            Connect with senior returner alumni who walked this path before, ask advice, and share real-world wins.
          </p>
        </div>

        {activeTab === 'forums' && (
          <Button
            variant="primary"
            onClick={() => setIsPostModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Start a Discussion
          </Button>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="border-b border-surface-border">
        <Tabs
          tabs={[
            { id: 'mentors', label: 'Verified Mentors', count: sampleMentors.length },
            { id: 'forums', label: 'Sisterhood Discussions', count: forumPosts.length },
            { id: 'stories', label: 'Returner Success Stories', count: sampleStories.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MENTORS & MENTORSHIP REQUEST */}
      {/* ========================================================= */}
      {activeTab === 'mentors' && (
        <div className="space-y-6 animate-fadeIn">
          {sentRequests.length > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  You have <strong>{sentRequests.length} active mentorship request</strong> submitted. Mentors typically respond within 48 hours.
                </span>
              </div>
              <Badge variant="success" size="sm">
                Tracked in Demo
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleMentors.map((mentor) => {
              const hasRequested = sentRequests.some((r) => r.mentorId === mentor.id);

              return (
                <Card
                  key={mentor.id}
                  isHoverable
                  className="flex flex-col justify-between border border-surface-border bg-white shadow-soft-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-heading font-bold text-base text-ink truncate">
                            {mentor.name}
                          </h3>
                          <Badge variant="demo" size="sm">
                            Sample
                          </Badge>
                        </div>
                        <p className="text-xs text-primary-700 font-semibold leading-tight mt-0.5">
                          {mentor.role}
                        </p>
                        <span className="text-[11px] text-ink-muted block mt-0.5">
                          {mentor.company}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                      "{mentor.bio}"
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-ink uppercase tracking-wider block font-heading">
                        Areas of Mentorship:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((exp, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-secondary text-primary-800 text-[11px] font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-surface-border flex items-center justify-between">
                    <span className="text-[11px] text-ink-subtle flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mentor.availability}
                    </span>

                    {hasRequested ? (
                      <Badge variant="success" size="sm">
                        Request Pending ✓
                      </Badge>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedMentor(mentor)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Request Mentorship
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FORUMS & DISCUSSIONS */}
      {/* ========================================================= */}
      {activeTab === 'forums' && (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
          {/* Post list */}
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <Card key={post.id} className="border border-surface-border bg-white shadow-soft-sm">
                <div className="space-y-3">
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100"
                      />
                      <div>
                        <h4 className="font-heading font-bold text-sm text-ink">{post.author}</h4>
                        <p className="text-[11px] text-ink-muted">{post.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-ink-subtle">{post.time}</span>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h3 className="font-heading font-bold text-base text-ink mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions Strip */}
                  <div className="flex items-center gap-6 pt-3 border-t border-surface-border/60 text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleCheer(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.hasCheered ? 'text-accent-600 font-bold' : 'text-ink-muted hover:text-accent-500'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.hasCheered ? 'fill-accent-500 text-accent-500' : ''
                        }`}
                      />
                      <span>{post.cheers} Cheers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveReplyPostId(
                          activeReplyPostId === post.id ? null : post.id
                        )
                      }
                      className="flex items-center gap-1.5 text-ink-muted hover:text-primary-600 transition-colors font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.replies?.length || 0} Responses</span>
                    </button>
                  </div>

                  {/* Thread Replies List */}
                  {post.replies?.length > 0 && (
                    <div className="pt-2 pl-4 sm:pl-6 border-l-2 border-primary-100 space-y-2 mt-2">
                      {post.replies.map((rep) => (
                        <div key={rep.id} className="p-2.5 rounded-xl bg-surface-subtle text-xs space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <strong className="text-primary-900 font-heading">{rep.author}</strong>
                            <span className="text-ink-subtle">{rep.time}</span>
                          </div>
                          <p className="text-ink-light leading-relaxed">{rep.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Form */}
                  {activeReplyPostId === post.id && (
                    <div className="pt-2 flex gap-2 animate-fadeIn">
                      <Input
                        placeholder="Write a supportive reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="text-xs"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddReply(post.id)}
                        rightIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: RETURNER SUCCESS STORIES */}
      {/* ========================================================= */}
      {activeTab === 'stories' && (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
          <div className="p-4 bg-secondary/30 rounded-2xl border border-primary-100 flex items-center justify-between text-xs text-primary-900">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-primary-600" />
              Every story below illustrates real-world strategies for reframing career gaps.
            </span>
            <Badge variant="demo" size="sm">
              Sample Profiles
            </Badge>
          </div>

          <div className="space-y-6">
            {sampleStories.map((story) => (
              <Card key={story.id} className="p-6 sm:p-8 border border-surface-border bg-white shadow-soft-sm">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-lg text-ink">
                            {story.name}
                          </h3>
                          <Badge variant="demo" size="sm">Sample</Badge>
                        </div>
                        <p className="text-xs font-bold text-emerald-600 font-heading">
                          Returned As: {story.returnedRole}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <Badge variant="secondary" size="md">
                        {story.breakDuration}
                      </Badge>
                      <span className="text-[11px] text-ink-muted block mt-1">
                        Prior: {story.previousRole}
                      </span>
                    </div>
                  </div>

                  {/* Story Quote */}
                  <div className="relative pl-6 border-l-4 border-primary-500 py-1 space-y-2">
                    <Quote className="w-5 h-5 text-primary-400 opacity-60 absolute -left-3 top-0" />
                    <p className="text-xs sm:text-sm text-ink leading-relaxed italic">
                      "{story.quote}"
                    </p>
                  </div>

                  {/* Key Advice */}
                  <div className="p-3.5 bg-surface-subtle rounded-xl text-xs text-ink-light flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-ink">Takeaway Tip:</strong> {story.advice}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: REQUEST MENTORSHIP */}
      {/* ========================================================= */}
      {selectedMentor && (
        <Modal
          isOpen={Boolean(selectedMentor)}
          onClose={() => setSelectedMentor(null)}
          title={`Request 1-on-1 Mentorship`}
          description={`Connect with ${selectedMentor.name} (${selectedMentor.role})`}
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setSelectedMentor(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSendMentorshipRequest}
                isLoading={isSubmittingMentorship}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Request
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSendMentorshipRequest} className="space-y-4 text-left">
            <div className="p-3 bg-secondary/50 rounded-xl text-xs text-primary-900 leading-relaxed">
              SheNova mentors are vetted executive women dedicated to providing compassionate, high-impact guidance for returning talent.
            </div>

            <Select
              label="Primary Mentorship Focus"
              value={mentorshipForm.topic}
              onChange={(e) =>
                setMentorshipForm({ ...mentorshipForm, topic: e.target.value })
              }
              options={[
                'Resume & Gap Narrative Review',
                'Technical / Coding Whiteboard Prep',
                'Salary Negotiation & Title Protection',
                'Executive Presence & Confidence Coaching',
                'Work-Life Orchestration & Childcare Balance',
              ]}
            />

            <Textarea
              label="Introduction & What You Seek Guidance On"
              rows={4}
              value={mentorshipForm.message}
              onChange={(e) =>
                setMentorshipForm({ ...mentorshipForm, message: e.target.value })
              }
              helperText="Share your target role, pause length, and 1 or 2 specific questions."
            />

            <Input
              label="Your Preferred Weekly Availability"
              value={mentorshipForm.preferredTime}
              onChange={(e) =>
                setMentorshipForm({ ...mentorshipForm, preferredTime: e.target.value })
              }
            />
          </form>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE FORUM DISCUSSION POST */}
      {/* ========================================================= */}
      {isPostModalOpen && (
        <Modal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          title="Start a Community Discussion"
          description="Ask for advice, share a personal milestone, or cheer on your peers."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setIsPostModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreatePost}>
                Post Discussion
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreatePost} className="space-y-4 text-left">
            <Input
              label="Discussion Title"
              placeholder="e.g. How did you answer salary expectations for returnships?"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />

            <Select
              label="Category"
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              options={[
                'Career Restart Advice',
                'Interview Preparation',
                'Success & Offer Negotiation',
                'Parenting & Work-Life Balance',
                'Learning & Upskilling Cohorts',
              ]}
            />

            <Textarea
              label="Discussion Content"
              rows={5}
              placeholder="Share your thoughts, experiences, or specific questions with the sisterhood..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              required
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Community;
