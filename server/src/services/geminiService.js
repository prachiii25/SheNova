import { GoogleGenAI } from '@google/genai';

/**
 * Gemini Service using the official @google/genai SDK.
 * Reads GEMINI_API_KEY strictly from process.env.
 * Model is configurable via process.env.GEMINI_MODEL (defaults to 'gemini-2.5-flash').
 * In case of missing API key, network failure, timeout, or JSON parse error,
 * graceful fallback responses are returned with `demoMode: true`.
 */

const DEFAULT_MODEL = 'gemini-2.5-flash';
const REQUEST_TIMEOUT_MS = 15000;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    return null;
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
};

/**
 * Clean and safely parse JSON strings from model outputs.
 */
const safeJsonParse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return null;

  try {
    // 1. Direct parse attempt
    return JSON.parse(rawText.trim());
  } catch (e1) {
    try {
      // 2. Remove markdown code fence blocks ```json ... ``` or ``` ... ```
      let cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();

      // 3. Find outermost brackets
      const firstCurly = cleaned.indexOf('{');
      const lastCurly = cleaned.lastIndexOf('}');
      const firstSquare = cleaned.indexOf('[');
      const lastSquare = cleaned.lastIndexOf(']');

      if (firstCurly !== -1 && lastCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
        cleaned = cleaned.substring(firstCurly, lastCurly + 1);
      } else if (firstSquare !== -1 && lastSquare !== -1) {
        cleaned = cleaned.substring(firstSquare, lastSquare + 1);
      }

      return JSON.parse(cleaned);
    } catch (e2) {
      console.warn('[Gemini Service] Failed to parse model JSON output:', rawText.substring(0, 200));
      return null;
    }
  }
};

/**
 * Execute call to Gemini with timeout safety
 */
const callGeminiWithTimeout = async (prompt, systemInstruction = '') => {
  const ai = getGeminiClient();
  if (!ai) {
    return null;
  }

  const modelName = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Gemini API call timed out after ${REQUEST_TIMEOUT_MS}ms`)), REQUEST_TIMEOUT_MS)
  );

  const requestConfig = {
    responseMimeType: 'application/json',
  };

  if (systemInstruction) {
    requestConfig.systemInstruction = systemInstruction;
  }

  const apiPromise = ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: requestConfig,
  });

  const response = await Promise.race([apiPromise, timeoutPromise]);
  return response.text;
};

// =========================================================================
// 1. GENERATE CAREER RESTART ROADMAP
// =========================================================================

export const generateRoadmap = async (data = {}) => {
  const {
    education = 'Bachelors in Computer Science / Business',
    previousExperience = '5 years',
    previousRole = 'Product Manager',
    breakDuration = '3 years',
    breakReason = 'Motherhood & Childcare',
    careerInterests = 'Product Management & AI',
    preferredWorkType = 'Remote / Flexible',
    weeklyHours = 10,
  } = data;

  try {
    const prompt = `
You are an expert career transition advisor specializing in helping women return to the workforce after a career pause.
Generate a comprehensive, encouraging, and structured 60-day Career Restart Roadmap in JSON format based on the following candidate context:

- Education: ${education}
- Previous Experience: ${previousExperience}
- Previous Job Role: ${previousRole}
- Career Break Duration: ${breakDuration} (${breakReason})
- Target Career Interests: ${careerInterests}
- Preferred Work Arrangement: ${preferredWorkType}
- Weekly Time Budget: ${weeklyHours} hours/week

Return ONLY a valid JSON object matching this exact schema:
{
  "targetRole": "Role title",
  "readinessScore": 75,
  "estimatedDays": 60,
  "weeklyTimeCommitment": "${weeklyHours} hrs/week",
  "careerTrajectory": {
    "recommendedFocus": "Short 1-sentence focus",
    "suggestedJobTitles": ["Title 1", "Title 2", "Title 3"]
  },
  "learningGoals": [
    "Goal 1",
    "Goal 2",
    "Goal 3"
  ],
  "recommendedSkills": [
    { "name": "Skill 1", "category": "Emerging / Refresh", "importance": "High" },
    { "name": "Skill 2", "category": "Tooling", "importance": "High" },
    { "name": "Skill 3", "category": "Leadership", "importance": "Medium" }
  ],
  "milestones": [
    {
      "id": 1,
      "title": "Phase 1 Title",
      "targetDay": "Day 1-15",
      "status": "completed",
      "description": "Milestone description",
      "tasks": ["Task 1", "Task 2"]
    },
    {
      "id": 2,
      "title": "Phase 2 Title",
      "targetDay": "Day 16-30",
      "status": "in-progress",
      "description": "Milestone description",
      "tasks": ["Task 1", "Task 2"]
    },
    {
      "id": 3,
      "title": "Phase 3 Title",
      "targetDay": "Day 31-45",
      "status": "upcoming",
      "description": "Milestone description",
      "tasks": ["Task 1", "Task 2"]
    },
    {
      "id": 4,
      "title": "Phase 4 Title",
      "targetDay": "Day 46-60",
      "status": "upcoming",
      "description": "Milestone description",
      "tasks": ["Task 1", "Task 2"]
    }
  ]
}
`;

    const rawResult = await callGeminiWithTimeout(prompt);
    const parsed = safeJsonParse(rawResult);

    if (parsed && parsed.milestones && Array.isArray(parsed.milestones)) {
      return {
        success: true,
        demoMode: false,
        data: parsed,
      };
    }
  } catch (err) {
    console.warn('[Gemini Service] generateRoadmap error, falling back to demo mode:', err.message);
  }

  // Realistic Demo Mode Fallback
  return {
    success: true,
    demoMode: true,
    data: {
      targetRole: previousRole.includes('Engineer') ? 'Senior Frontend Engineer' : 'Senior Product Manager',
      readinessScore: 78,
      estimatedDays: 60,
      weeklyTimeCommitment: `${weeklyHours || 10} hrs/week`,
      careerTrajectory: {
        recommendedFocus: 'Bridge foundational domain strength with modern AI toolchains and agile async workflows.',
        suggestedJobTitles: [
          'Senior Product Lead (Returnship Cohort)',
          'Product Operations Manager (Remote)',
          'Technical Strategy Specialist',
        ],
      },
      learningGoals: [
        'Audit previous core capabilities and build a positive gap reframing narrative.',
        'Master current generative AI product frameworks and modern user analytics stacks.',
        'Produce an ATS-friendly returner resume highlighting family leadership competencies.',
        'Complete 3 AI scenario mock interviews before applying to partner returnships.',
      ],
      recommendedSkills: [
        { name: 'Generative AI Workflows & Prompting', category: 'Emerging', importance: 'High' },
        { name: 'Modern Analytics (PostHog & Mixpanel)', category: 'Core Refresh', importance: 'High' },
        { name: 'Async Collaboration (Jira Cloud, Notion)', category: 'Tooling', importance: 'Medium' },
        { name: 'Executive Gap Reframing & Negotiation', category: 'Leadership', importance: 'High' },
      ],
      milestones: [
        {
          id: 1,
          title: 'Career Pause Self-Audit & Competency Mapping',
          targetDay: 'Day 1 - 14',
          status: 'completed',
          description: 'Document 5+ years prior experience, inventory evergreen skills, and articulate pause narrative.',
          tasks: [
            'Catalog 6 retained core competencies and past wins',
            'Frame childcare and caregiving leadership achievements',
            'Set up designated 8-10 hrs/week learning time blocks',
          ],
        },
        {
          id: 2,
          title: 'Modern Tooling & Skill Delta Micro-Sprints',
          targetDay: 'Day 15 - 30',
          status: 'in-progress',
          description: 'Complete hands-on micro-courses closing technical and tooling shifts since career break.',
          tasks: [
            'Complete GenAI for Product Leaders course on SheNova',
            'Refresh event-driven analytics metrics and OKR frameworks',
            'Build one end-to-end sample case study or portfolio brief',
          ],
        },
        {
          id: 3,
          title: 'ATS-Friendly Returner Resume & Gap Statement',
          targetDay: 'Day 31 - 45',
          status: 'upcoming',
          description: 'Format two-pane ATS resume with unapologetic gap explanation and transferable skills.',
          tasks: [
            'Generate 3 positive gap framing phrasings with SheNova AI',
            'Quantify household budget and crisis triage under transferable leadership',
            'Export PDF and test keyword compatibility against target returnships',
          ],
        },
        {
          id: 4,
          title: 'Mock Behavioral Interviews & Cohort Applications',
          targetDay: 'Day 46 - 60',
          status: 'upcoming',
          description: 'Rehearse return-to-work scenarios, establish mentor rapport, and submit applications.',
          tasks: [
            'Complete 3 sessions on AI Mock Interview module',
            'Connect with 1 Sisterhood Circle returner mentor',
            'Apply to 3 vetted returnship cohort listings on SheNova Jobs',
          ],
        },
      ],
    },
  };
};

// =========================================================================
// 2. ANALYZE SKILL-GAP DELTA
// =========================================================================

export const analyzeSkillGap = async (data = {}) => {
  const { targetRole = 'Senior Product Manager', previousSkills = [], experienceLevel = 'Mid-to-Senior' } = data;

  try {
    const prompt = `
You are an AI workforce skills intelligence specialist.
Analyze the skill gap for a professional returning to work after a career pause.

Target Role: ${targetRole}
Candidate Prior Skills: ${Array.isArray(previousSkills) ? previousSkills.join(', ') : previousSkills}
Experience Level: ${experienceLevel}

Compare prior capabilities with contemporary (2025/2026) employer expectations for this role.
Return ONLY a valid JSON object matching this schema:
{
  "targetRole": "${targetRole}",
  "overallMatchScore": 72,
  "currentSkills": [
    { "name": "Skill Name", "level": 85, "category": "Core Retained" }
  ],
  "requiredSkills": [
    { "name": "Skill Name", "requiredLevel": 90, "currentLevel": 50, "status": "Needs Refresh" }
  ],
  "missingOrOutdatedSkills": [
    { "name": "Skill Name", "reason": "Why this evolved or is missing", "urgency": "High" }
  ],
  "recommendedCourses": [
    { "title": "Course Title", "duration": "2.5 Hours", "platform": "SheNova Hub", "focus": "What it teaches" }
  ],
  "upskillingPlan": [
    { "week": "Week 1-2", "title": "Sprint Title", "milestone": "Deliverable" }
  ]
}
`;

    const rawResult = await callGeminiWithTimeout(prompt);
    const parsed = safeJsonParse(rawResult);

    if (parsed && parsed.currentSkills && parsed.requiredSkills) {
      return {
        success: true,
        demoMode: false,
        data: parsed,
      };
    }
  } catch (err) {
    console.warn('[Gemini Service] analyzeSkillGap error, falling back to demo mode:', err.message);
  }

  // Realistic Demo Mode Fallback
  return {
    success: true,
    demoMode: true,
    data: {
      targetRole,
      overallMatchScore: 74,
      currentSkills: [
        { name: 'Product Roadmapping & Vision', level: 90, category: 'Core Retained' },
        { name: 'Cross-Functional Stakeholder Alignment', level: 88, category: 'Leadership' },
        { name: 'User Research & Customer Empathy', level: 85, category: 'Core Retained' },
        { name: 'Agile & Scrum Methodologies', level: 80, category: 'Methodology' },
      ],
      requiredSkills: [
        { name: 'Generative AI & LLM UX Patterns', requiredLevel: 85, currentLevel: 35, status: 'Needs Fast-Track' },
        { name: 'Modern Product Analytics (PostHog / Mixpanel)', requiredLevel: 80, currentLevel: 45, status: 'Needs Refresh' },
        { name: 'Async Tooling & Jira Cloud Automations', requiredLevel: 85, currentLevel: 65, status: 'Minor Gap' },
        { name: 'Data Storytelling & SQL Aggregations', requiredLevel: 75, currentLevel: 55, status: 'Needs Refresh' },
      ],
      missingOrOutdatedSkills: [
        {
          name: 'Generative AI Product Workflows',
          reason: 'Workflows shifted toward agentic UX, prompt evaluations, and AI feature instrumentation.',
          urgency: 'High',
        },
        {
          name: 'Modern Cloud Analytics Stacks',
          reason: 'Shift from legacy pageviews to event-driven product metrics and cohort retention curves.',
          urgency: 'Medium',
        },
      ],
      recommendedCourses: [
        {
          title: 'Generative AI for Product & Tech Leaders',
          duration: '3.5 Hours',
          platform: 'SheNova Learning Hub',
          focus: 'Prompt engineering, UX patterns, and AI evaluation metrics.',
        },
        {
          title: 'Modern Event Analytics (PostHog & Mixpanel)',
          duration: '2.5 Hours',
          platform: 'SheNova Lab',
          focus: 'Funnels, behavioral cohorts, and product health dashboards.',
        },
      ],
      upskillingPlan: [
        { week: 'Week 1-2', title: 'AI Foundations & Terminology', milestone: 'Evaluate 2 AI products and write specs' },
        { week: 'Week 3-4', title: 'Analytics & Event Tracking', milestone: 'Build retention cohort analysis' },
        { week: 'Week 5-6', title: 'Executive Presentation & Case Study', milestone: 'Publish interactive portfolio brief' },
      ],
    },
  };
};

// =========================================================================
// 3. IMPROVE RESUME
// =========================================================================

export const improveResume = async (data = {}) => {
  const { summary = '', experience = [], skills = [], targetRole = 'Senior Product Manager' } = data;

  try {
    const prompt = `
You are an expert executive resume writer and returnship coach.
Review and optimize the candidate's resume for an ATS screen and hiring managers who value maturity and non-linear experience.

Target Role: ${targetRole}
Current Summary: ${summary}
Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}
Experience Snippets: ${JSON.stringify(experience)}

Return ONLY a valid JSON object matching this schema:
{
  "improvedSummary": "Polished high-impact professional summary",
  "bulletImprovements": [
    {
      "original": "Original point or placeholder",
      "improved": "Action-verb driven, quantified result-oriented bullet",
      "rationale": "Why this is stronger for ATS"
    }
  ],
  "atsKeywordsToAdd": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "scoreImprovement": {
    "before": 70,
    "after": 92
  },
  "actionableTips": [
    "Tip 1",
    "Tip 2"
  ]
}
`;

    const rawResult = await callGeminiWithTimeout(prompt);
    const parsed = safeJsonParse(rawResult);

    if (parsed && parsed.improvedSummary) {
      return {
        success: true,
        demoMode: false,
        data: parsed,
      };
    }
  } catch (err) {
    console.warn('[Gemini Service] improveResume error, falling back to demo mode:', err.message);
  }

  // Realistic Demo Mode Fallback
  return {
    success: true,
    demoMode: true,
    data: {
      improvedSummary:
        'Strategic product leader with 5+ years driving digital products and a purposeful career pause dedicated to family caregiving and continuous AI upskilling. Proven track record unifying engineering and business stakeholders, paired with hands-on fluency in generative AI workflows and modern event analytics.',
      bulletImprovements: [
        {
          original: 'Managed product roadmaps and talked to customers.',
          improved:
            'Spearheaded multi-quarter product roadmaps for enterprise SaaS, partnering with 12 engineers and increasing customer retention by 22% through structured user interview sprints.',
          rationale: 'Replaces passive verbs with active leadership phrasing and concrete business metrics.',
        },
        {
          original: 'Took a break for childcare.',
          improved:
            'Directed complex household logistics, budget triage, and family operations while completing 60+ hours of modern AI product strategy and analytics certifications.',
          rationale: 'Positions the career break as active management and demonstrable continuous learning.',
        },
      ],
      atsKeywordsToAdd: ['Generative AI', 'Mixpanel', 'Cross-Functional Leadership', 'Cohort Retention', 'OKR Planning'],
      scoreImprovement: {
        before: 75,
        after: 92,
      },
      actionableTips: [
        'Add quantitative outcome metrics to your previous software delivery roles.',
        'List your recent SheNova upskilling sprints under a dedicated "Continuous Learning & Certifications" header.',
      ],
    },
  };
};

// =========================================================================
// 4. EXPLAIN CAREER GAP POSITIVELY
// =========================================================================

export const explainCareerGap = async (data = {}) => {
  const {
    reason = 'Motherhood & Childcare',
    duration = '3.5 years',
    targetRole = 'Senior Product Manager',
    priorRole = 'Product Manager',
    activities = 'Continuous learning, community volunteering, budget management',
  } = data;

  try {
    const prompt = `
You are an expert career transition advocate specializing in helping women articulate career pauses with dignity, confidence, and authority.

Candidate Context:
- Reason for Pause: ${reason}
- Duration of Pause: ${duration}
- Prior Role: ${priorRole}
- Target Role: ${targetRole}
- Activities During Pause: ${activities}

Provide 3 distinct, empowering, and positive ways to frame this career gap for a resume summary and interview introduction:
1. Executive & Strategic
2. Direct, Confident & Authentic
3. Growth & Continuous Learning Oriented

Return ONLY a valid JSON object matching this schema:
{
  "phrasings": [
    {
      "style": "Executive & Strategic",
      "text": "Statement text",
      "bestFor": "Leadership or senior returnship applications"
    },
    {
      "style": "Direct & Authentic",
      "text": "Statement text",
      "bestFor": "Conversational recruiter screening calls"
    },
    {
      "style": "Growth & Upskilling Oriented",
      "text": "Statement text",
      "bestFor": "Technical or fast-evolving roles"
    }
  ],
  "interviewTip": "Advice on body language and vocal confidence when delivering this narrative"
}
`;

    const rawResult = await callGeminiWithTimeout(prompt);
    const parsed = safeJsonParse(rawResult);

    if (parsed && Array.isArray(parsed.phrasings) && parsed.phrasings.length > 0) {
      return {
        success: true,
        demoMode: false,
        data: parsed,
      };
    }
  } catch (err) {
    console.warn('[Gemini Service] explainCareerGap error, falling back to demo mode:', err.message);
  }

  // Realistic Demo Mode Fallback
  return {
    success: true,
    demoMode: true,
    data: {
      phrasings: [
        {
          style: 'Executive & Strategic',
          text: `“Following 5+ years of delivering software products, I took an intentional ${duration} career pause dedicated to family caregiving. Managing multi-stakeholder household operations sharpened my crisis de-escalation, rapid triage, and budget discipline—qualities that directly enrich my executive leadership.”`,
          bestFor: 'Executive summaries, director-level returnships, and formal cover letters',
        },
        {
          style: 'Direct & Authentic',
          text: `“I stepped away from full-time tech for ${duration} to care for my young family. During this pause, I maintained professional momentum through self-paced learning in AI product roadmapping and community advisory roles. I am energized and fully equipped to bring this refreshed focus to ${targetRole} challenges.”`,
          bestFor: 'Recruiter phone screens and initial hiring manager introductions',
        },
        {
          style: 'Growth & Upskilling Oriented',
          text: `“Over the past ${duration}, I balanced primary childcare responsibilities with targeted upskilling in modern generative AI and analytics stacks. This deliberate pause provided valuable perspective, allowing me to return with updated technical agility and sharpened prioritization.”`,
          bestFor: 'Tech-forward startups and innovation returnship cohorts',
        },
      ],
      interviewTip:
        'Deliver your explanation with pride and unbroken eye contact. Never apologize for caring for family—frame your career pause as a chapter of life leadership that enhances your professional maturity.',
    },
  };
};

// =========================================================================
// 5. GENERATE INTERVIEW QUESTIONS
// =========================================================================

export const generateInterviewQuestions = async (data = {}) => {
  const { role = 'Senior Product Manager', difficulty = 'Medium', focusArea = 'Career Gap & Technical Leadership' } = data;

  try {
    const prompt = `
Generate 5 realistic, empathetic, yet rigorous behavioral and scenario interview questions for a professional returning to work after a career pause.

Target Role: ${role}
Difficulty Level: ${difficulty}
Focus Area: ${focusArea}

Questions should evaluate:
1. Positive career gap reframing
2. Adaptability to tooling shifts (GenAI / cloud)
3. Cross-functional leadership and conflict resolution
4. Prioritization under constraint
5. Strategic long-term vision

Return ONLY a valid JSON object matching this schema:
{
  "role": "${role}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "category": "Career Gap Reframing",
      "question": "Question text",
      "contextTip": "Why recruiters ask this and what good looks like",
      "idealKeywords": ["keyword1", "keyword2"]
    }
  ]
}
`;

    const rawResult = await callGeminiWithTimeout(prompt);
    const parsed = safeJsonParse(rawResult);

    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length >= 3) {
      return {
        success: true,
        demoMode: false,
        data: parsed,
      };
    }
  } catch (err) {
    console.warn('[Gemini Service] generateInterviewQuestions error, falling back to demo mode:', err.message);
  }

  // Realistic Demo Mode Fallback
  return {
    success: true,
    demoMode: true,
    data: {
      role,
      difficulty,
      questions: [
        {
          id: 1,
          category: 'Career Gap Reframing',
          question:
            'Could you walk us through your career pause and how you maintained professional momentum and transferable leadership during this time?',
          contextTip: 'Recruiters look for self-assurance, positive framing, and quantifiable self-directed learning.',
          idealKeywords: ['resilience', 'continuous learning', 'triage', 'upskilling', 'family leadership'],
        },
        {
          id: 2,
          category: 'Technological & Tooling Agility',
          question:
            'Tools and workflows evolved rapidly in recent years. How have you updated your fluency with generative AI, modern cloud platforms, or current analytics stacks?',
          contextTip: 'Cite specific hands-on sprints, courses, or micro-projects completed on SheNova or independently.',
          idealKeywords: ['GenAI', 'automation', 'hands-on', 'modern workflows', 'agility'],
        },
        {
          id: 3,
          category: 'Cross-Functional Stakeholder Alignment',
          question:
            'Describe a situation where engineering, design, and business leadership had competing priorities. How did you negotiate alignment and drive execution?',
          contextTip: 'Demonstrate structured decision frameworks and empathetic negotiation honed through real-world life experience.',
          idealKeywords: ['prioritization', 'trade-offs', 'data-driven', 'consensus', 'clear communication'],
        },
        {
          id: 4,
          category: 'Prioritization Under Constraint',
          question:
            'How do you manage tight deadlines when team bandwidth is limited, and how do you protect team focus without compromising deliverables?',
          contextTip: 'Highlight ruthless prioritization, transparent async communication, and realistic capacity planning.',
          idealKeywords: ['Ruthless prioritization', 'async communication', 'boundary setting', 'scope management'],
        },
        {
          id: 5,
          category: 'Long-Term Impact & Growth',
          question:
            'Looking ahead at the next 12 to 18 months in this role, what is your approach to onboarding rapidly and driving measurable organizational impact?',
          contextTip: 'Showcase a structured 30-60-90 day onboarding framework and eagerness to mentor peers.',
          idealKeywords: ['30-60-90 plan', 'early wins', 'listening tour', 'mentorship', 'measurable impact'],
        },
      ],
    },
  };
};

// =========================================================================
// 6. EVALUATE INTERVIEW ANSWER
// =========================================================================

export const evaluateAnswer = async (data = {}) => {
  const { question = '', answer = '', role = 'Senior Product Manager', difficulty = 'Medium' } = data;

  try {
    const prompt = `
You are an expert executive interview coach on SheNova, evaluating a candidate returning to work after a career break.
Evaluate their answer objectively, constructively, and encouragingly.

Role: ${role}
Question: ${question}
Candidate's Answer: "${answer}"

Score the answer from 0 to 100 on Communication, Relevance, and Confidence.
Identify 2-3 specific strengths, 1-2 concrete growth areas, and provide an improved model answer.

Return ONLY a valid JSON object matching this schema:
{
  "scores": {
    "communication": 85,
    "relevance": 88,
    "confidence": 82
  },
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],
  "suggestedAnswer": "An exemplary, dignified, and metric-backed model response"
}
`;

    const rawResult = await callGeminiWithTimeout(prompt);
    const parsed = safeJsonParse(rawResult);

    if (parsed && parsed.scores && parsed.suggestedAnswer) {
      return {
        success: true,
        demoMode: false,
        data: parsed,
      };
    }
  } catch (err) {
    console.warn('[Gemini Service] evaluateAnswer error, falling back to demo mode:', err.message);
  }

  // Realistic Demo Mode Fallback
  const ansLen = (answer || '').trim().length;
  const comm = Math.min(96, Math.max(72, Math.round(75 + ansLen / 35)));
  const rel = Math.min(95, Math.max(70, Math.round(76 + ansLen / 40)));
  const conf = Math.min(92, Math.max(68, Math.round(72 + ansLen / 45)));

  return {
    success: true,
    demoMode: true,
    data: {
      scores: {
        communication: comm,
        relevance: rel,
        confidence: conf,
      },
      strengths: [
        'Dignified, articulate framing of career pause responsibilities.',
        'Good balance of prior foundational depth with recent learning sprints.',
        'High degree of composure and clarity in delivery.',
      ],
      improvements: [
        'Anchor your achievements with specific metrics or quantitative milestones.',
        'Conclude with direct relevance to de-risking hiring managers deliverables.',
      ],
      suggestedAnswer:
        '“During my 3.5-year career pause for family caregiving, I dedicated 8 hours weekly to AI product roadmapping and analytics certifications. Managing complex household operations sharpened my triage, crisis de-escalation, and budget discipline—qualities that directly complement my prior 5+ years of software delivery.”',
    },
  };
};

// =========================================================================
// 7. RECOMMEND COURSES
// =========================================================================

export const recommendCourses = async (data = {}) => {
  const { targetRole = 'Senior Product Manager', missingSkills = [], currentLevel = 'Intermediate' } = data;

  try {
    const prompt = `
Recommend 3-5 high-impact, modern micro-courses for a professional returning after a career break.

Target Role: ${targetRole}
Current Level: ${currentLevel}
Skills Needing Modernization: ${Array.isArray(missingSkills) ? missingSkills.join(', ') : missingSkills}

Courses should focus specifically on modern shifts (Generative AI, modern event metrics, agile async workflows) so the candidate avoids wasting time re-learning basics.

Return ONLY a valid JSON object matching this schema:
{
  "targetRole": "${targetRole}",
  "recommendations": [
    {
      "courseId": 1,
      "title": "Course Title",
      "category": "Technology / Communication / Business / Professional Development",
      "level": "Modern Refresh",
      "duration": "2.5 Hours",
      "reason": "Why this closes the candidate gap",
      "focusKeywords": ["Keyword 1", "Keyword 2"]
    }
  ]
}
`;

    const rawResult = await callGeminiWithTimeout(prompt);
    const parsed = safeJsonParse(rawResult);

    if (parsed && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
      return {
        success: true,
        demoMode: false,
        data: parsed,
      };
    }
  } catch (err) {
    console.warn('[Gemini Service] recommendCourses error, falling back to demo mode:', err.message);
  }

  // Realistic Demo Mode Fallback
  return {
    success: true,
    demoMode: true,
    data: {
      targetRole,
      recommendations: [
        {
          courseId: 1,
          title: 'Generative AI for Product & Tech Leaders',
          category: 'Technology',
          level: 'Modern Refresh',
          duration: '3.5 Hours',
          reason: 'Bridges legacy software workflows with 2026 generative AI agent and prompt UX patterns.',
          focusKeywords: ['GenAI', 'Prompt Engineering', 'AI Metrics'],
        },
        {
          courseId: 2,
          title: 'Modern Event Analytics (PostHog & Mixpanel)',
          category: 'Technology',
          level: 'Intermediate',
          duration: '2.5 Hours',
          reason: 'Modernizes analytics from legacy pageviews to behavioral funnels and cohort retention.',
          focusKeywords: ['Mixpanel', 'Funnels', 'Retention'],
        },
        {
          courseId: 4,
          title: 'Returner Leadership: Salary Negotiation & Parity',
          category: 'Professional Development',
          level: 'Executive',
          duration: '1.5 Hours',
          reason: 'Equips returners to negotiate market-rate senior titles and avoid motherhood penalty discounts.',
          focusKeywords: ['Salary Parity', 'Title Protection', 'Executive Presence'],
        },
      ],
    },
  };
};

export default {
  generateRoadmap,
  analyzeSkillGap,
  improveResume,
  explainCareerGap,
  generateInterviewQuestions,
  evaluateAnswer,
  recommendCourses,
};
