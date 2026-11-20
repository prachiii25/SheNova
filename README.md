# SheNova

> **"New Opportunities. Endless Possibilities."**  
> An AI-powered career restart platform designed specifically for women returning to the workforce after career breaks (motherhood, caregiving, relocation, personal or family reasons).

---

## 🌟 Table of Contents
- [Project Overview](#project-overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Seeding](#database-seeding)
- [API Documentation](#api-documentation)
  - [Authentication & Security](#authentication--security)
  - [Auth Endpoints](#auth-endpoints)
  - [Career Restart Roadmap](#career-restart-roadmap)
  - [Skill-Gap Analysis](#skill-gap-analysis)
  - [Resume Builder](#resume-builder)
  - [Jobs & Applications](#jobs--applications)
  - [AI Mock Interview](#ai-mock-interview)
  - [Learning Hub & Progress](#learning-hub--progress)
  - [Community, Mentors & Forums](#community-mentors--forums)
- [Data Isolation & Sample Data Rules](#data-isolation--sample-data-rules)

---

## 💡 Project Overview
Women returning to work after career breaks face distinct challenges: resume gaps penalized by legacy ATS screeners, confidence erosion, imposter syndrome, and rapid shifts in tooling (like Generative AI).

**SheNova** addresses each phase of the return journey:
1. **Intake & Career Roadmap:** Dynamic multi-step onboarding and personalized 60-day ramp-up timeline.
2. **Skill-Gap Delta Analyzer:** Compares retained skills vs. modern role requirements and prescribes micro-learning sprints.
3. **ATS Gap-Friendly Resume Builder:** Positive reframing of career gaps, transferable parenting/caregiving skills, and live PDF export.
4. **Vetted Returnship & Flexible Job Board:** Curated listings with explicit break eligibility, family-friendly hours, and returner cohorts.
5. **AI Mock Interview Coach:** Real-time conversational question rehearsals, gap-reframing coaching, and scored rubrics.
6. **Learning Hub:** Micro-sprints focused strictly on modern deltas without repetitive basics.
7. **Sisterhood Circle Community:** 1-on-1 mentor matching, discussion threads with cheers, and inspiring peer returner stories.

---

## 🏗 Architecture & Tech Stack

### Frontend (`/client`)
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS with custom SheNova warm lavender/royal purple design system
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **PDF Export:** `html2pdf.js`

### Backend (`/server`)
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database & ODM:** MongoDB with Mongoose
- **Security:** Helmet, CORS, Express-Rate-Limit (150 req/15 min)
- **Authentication:** JWT (JSON Web Tokens) with 30-day expiration + bcryptjs password hashing
- **Data Scoping:** User-isolated queries enforcing `req.user._id` boundary across all write/read operations

---

## 📁 Project Structure

```text
SheNova/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── components/         # Reusable UI primitives (Button, Card, Modal, etc.)
│   │   ├── context/            # AuthContext & global state
│   │   ├── data/               # Sample data files (jobs.js, mockData.js)
│   │   ├── pages/              # Route pages (Dashboard, Roadmap, Jobs, etc.)
│   │   └── services/           # Frontend service modules (auth, roadmap, interview, etc.)
│   └── package.json
├── server/                     # Backend Express + Mongoose API
│   ├── src/
│   │   ├── config/             # MongoDB connection (db.js)
│   │   ├── controllers/        # Route logic & controllers
│   │   ├── middleware/         # Auth (protect/optionalAuth), validation, errorHandler
│   │   ├── models/             # Mongoose Schemas (User, Job, Resume, Interview, etc.)
│   │   ├── routes/             # Express API routes
│   │   ├── seed.js             # Seed script loading demo user & sample datasets
│   │   └── server.js           # Server entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
├── PROJECT_CONTEXT.md          # Architectural source of truth
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v20/v24)
- MongoDB instance (local `mongodb://127.0.0.1:27017` or cloud MongoDB Atlas URI)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Start the server (defaults to port 5001)
npm run dev # or npm start
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Database Seeding
To populate MongoDB with 22 sample jobs, 9 courses, 3 mentor profiles, 3 success stories, and the demo user:
```bash
cd server
npm run seed
```
Demo User Credentials:
- **Email:** `ananya.sharma@example.com`
- **Password:** `Password123!`

---

## 📖 API Documentation

**Base URL:** `http://localhost:5001/api`  
**Authorization Header:** `Authorization: Bearer <JWT_TOKEN>`

### Health Check
- `GET /api/health` — Returns server uptime and operational status.

---

### Authentication & Security (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new user (name, email, password, targetRole) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token (logged in dev mode) |
| `PUT` | `/api/auth/reset-password/:token` | Public | Reset password with token |
| `GET` | `/api/auth/me` | Protected | Fetch authenticated user profile and progress |
| `PUT` | `/api/auth/profile` | Protected | Update profile, career break context & preferences |

---

### Career Restart Roadmap (`/api/roadmap`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/roadmap` | Protected | Fetch user's current personalized roadmap |
| `POST` | `/api/roadmap/generate` | Protected | Intake form submission; generates 60-day roadmap |
| `PUT` | `/api/roadmap/milestones/:id` | Protected | Toggle completion status of a roadmap milestone |

---

### Skill-Gap Analysis (`/api/skill-gap` or `/api/skill-analysis`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skill-analysis` | Protected | Fetch user's skill gap delta report |
| `POST` | `/api/skill-analysis/analyze` | Protected | Run delta analysis comparing target role vs prior skills |

---

### Resume Builder (`/api/resume`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resume` | Protected | Fetch user's active resume and completeness score |
| `PUT` | `/api/resume` | Protected | Upsert resume sections (personal, gap, skills, experience) |
| `POST` | `/api/resume/explain-gap` | Protected | AI assist: returns 3 positive gap framing phrasings |

---

### Jobs & Applications (`/api/jobs`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public / Opt | List jobs with filters (`search`, `workMode`, `type`, `location`) |
| `GET` | `/api/jobs/:id` | Public / Opt | Get specific job details and application/saved status |
| `POST` | `/api/jobs/:id/apply` | Protected | Submit application for a job listing |
| `GET` | `/api/jobs/applications` | Protected | List user's submitted job applications |
| `POST` | `/api/jobs/:id/save` | Protected | Toggle bookmark / saved job |
| `GET` | `/api/jobs/saved` | Protected | List user's bookmarked job listings |

---

### AI Mock Interview (`/api/interview`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/interview/sessions` | Protected | List user's historical interview practice sessions |
| `POST` | `/api/interview/start` | Protected | Start session; generates 5 role-specific questions |
| `GET` | `/api/interview/sessions/:id` | Protected | Fetch specific session details and feedback |
| `POST` | `/api/interview/sessions/:id/submit-answer` | Protected | Submit answer; returns scores, strengths, improved model answer |

---

### Learning Hub & Progress (`/api/learning`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/learning/courses` | Public / Opt | List courses (filterable by `category`, `recommended`) |
| `GET` | `/api/learning/courses/:id` | Public / Opt | Get course details with user's progress |
| `GET` | `/api/learning/progress` | Protected | List all course progress records for user |
| `PUT` | `/api/learning/courses/:id/progress` | Protected | Update course progress percentage (0-100) |

---

### Community, Mentors & Forums (`/api/community`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/community/mentors` | Public / Opt | List returner-friendly mentor profiles |
| `GET` | `/api/community/mentors/:id` | Public / Opt | Fetch mentor bio and availability |
| `POST` | `/api/community/mentorship` | Protected | Submit a 1-on-1 mentorship request |
| `GET` | `/api/community/mentorship/my-requests` | Protected | View user's submitted mentorship requests |
| `GET` | `/api/community/stories` | Public | List verified peer returner success stories |
| `GET` | `/api/community/forums` | Public / Opt | List forum discussion threads |
| `GET` | `/api/community/forums/:id` | Public / Opt | Get discussion thread with replies |
| `POST` | `/api/community/forums` | Protected | Create a new community discussion topic |
| `POST` | `/api/community/forums/:id/reply` | Protected | Add a reply to a discussion thread |
| `POST` | `/api/community/forums/:id/cheer` | Protected | Toggle cheer (like) on a forum thread |

---

## 🔒 Data Isolation & Sample Data Rules

1. **User Scoping:** Every protected endpoint strictly filters queries by `user: req.user._id`. Users cannot view, modify, or delete another user's roadmap, resume, applications, interview sessions, or mentorship requests.
2. **Transparent Sample Data Labeling:**
   - Seeded job listings, sample courses, mentor profiles, and success stories carry `isSample: true` (or `isDemo: true`).
   - Mock companies are explicitly labeled with `(Sample Employer)` or `(Sample Mentor)`.
   - No mock employer is ever marked with a verified employer badge.
3. **Zero Secrets in Source Control:** JWT secret keys, MongoDB URIs, and Gemini API keys are loaded strictly from `.env`.

---

## 📄 License
ISC License — Built for empowering women returning to the workforce.
