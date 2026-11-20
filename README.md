# SheNova

> **"New Opportunities. Endless Possibilities."**  
> An AI-powered career restart platform designed specifically for women returning to the workforce after career breaks (motherhood, caregiving, relocation, personal or family reasons).

---

## 🌟 Table of Contents
- [Project Overview & Mission](#-project-overview--mission)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Setting Up MongoDB (Local or MongoDB Atlas)](#2-setting-up-mongodb-local-or-mongodb-atlas)
  - [3. Obtaining a Google Gemini API Key](#3-obtaining-a-google-gemini-api-key)
  - [4. Environment Variables Setup](#4-environment-variables-setup)
  - [5. Install Dependencies](#5-install-dependencies)
  - [6. Seed Database](#6-seed-database)
  - [7. Run Application](#7-run-application)
- [Demo Mode & Safety Disclosure](#-demo-mode--safety-disclosure)
- [API Overview](#-api-overview)
- [Security & Accessibility Standards](#-security--accessibility-standards)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)
- [License](#-license)

---

## 💡 Project Overview & Mission

Women returning to work after career pauses face systematic barriers: legacy ATS algorithms penalize multi-year gaps, recruiter bias discounts unpaid family leadership, tooling has shifted rapidly (such as the advent of Generative AI and event-driven product stacks), and confidence erosion or imposter syndrome can feel daunting.

**SheNova** is an empathetic, professional career companion built to transform these hurdles into recognized strengths:
- **Validating Life Leadership:** Reframing childcare, eldercare, and household operations as high-stakes management, crisis triage, and budget negotiation.
- **Precision Upskilling:** Identifying only the specific delta changes in modern tooling rather than asking returners to restart from junior fundamentals.
- **Dignified Returnships:** Partnering with organizations that provide structured onboarding ramps, peer cohorts, flexible hours, and zero gap penalties.

---

## 🚀 Key Features

| Feature | Route | Description |
| :--- | :--- | :--- |
| **Intake & 60-Day Roadmap** | `/roadmap` | 4-step intake wizard evaluating education, prior roles, pause duration, and time budget; generates an interactive 60-day ramp plan with checkable milestone tasks. |
| **Skill-Gap Market Delta Analyzer** | `/skill-gap` | Benchmark comparison between candidate capabilities and 2025/2026 industry standards; flags obsolete tools and prescribes 6-week micro-sprints. |
| **ATS Gap-Friendly Resume Builder** | `/resume-builder` | Two-pane builder with live preview across 3 switchable templates (Modern, Classic, Minimal), AI positive gap reframing modal, live completeness score, and direct client-side PDF export via `html2pdf.js`. |
| **Returnship & Flexible Job Board** | `/jobs` | 22 curated returner-friendly listings with filters (Remote, Flexible, Returnship, Part-time, Experience, Location), bookmarking, detail modal, and application status tracking. |
| **AI Mock Interview Coach** | `/interview` | Generates 5 role-specific scenario questions; features live stopwatch timer, voice dictation simulator, real-time rubric scoring (Communication, Relevance, Confidence), strengths, growth areas, and an exemplary model answer. |
| **Learning Hub** | `/learning` | Categorized micro-sprints (Technology, Communication, Business, Professional Development) with level, duration, and live progress updating. |
| **Sisterhood Circle Community** | `/community` | 3 interconnected tabs: Returner Mentors (with request modal), Discussion Forums (create thread, reply, cheer/like), and verified peer Success Stories. |
| **User Profile & Work-Life Sync** | `/profile` | Personal details, avatar presets, career pause context, and work-life balance schedule preferences. |

---

## 🛠 Tech Stack

### Frontend (`/client`)
- **Core:** React 18+ with Vite
- **Styling:** Tailwind CSS with custom royal purple (`#7041A6`) and warm coral accent (`#F28BA8`) design system
- **Routing & Code-Splitting:** React Router v6 with `React.lazy` and `React.Suspense` route-level chunking
- **HTTP Client:** Axios with centralized request token injection and automatic 401 unauthorized handling
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **PDF Generation:** `html2pdf.js`

### Backend (`/server`)
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database & ODM:** MongoDB with Mongoose
- **Security:** Helmet, CORS, Express-Rate-Limit (150 requests/15 minutes per IP)
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs password hashing
- **Data Scoping:** User-isolated queries enforcing `req.user._id` boundary across all write/read operations
- **AI Integration:** Official Google Gen AI SDK (`@google/genai`) with configurable `GEMINI_MODEL` (default: `gemini-2.5-flash`) and graceful `demoMode: true` fallback

---

## 📁 Folder Structure

```text
SheNova/
├── client/                           # Frontend application (React + Vite)
│   ├── src/
│   │   ├── components/               # UI design system & layout components
│   │   │   ├── auth/                 # Password strength meter, protected routes
│   │   │   ├── layout/               # AppLayout, Navbar, Footer
│   │   │   └── ui/                   # Button, Card, Input, Modal, Tabs, ProgressBar, etc.
│   │   ├── context/                  # AuthContext (JWT session state & reactive broadcasts)
│   │   ├── data/                     # Sample datasets (jobs.js, mockData.js)
│   │   ├── pages/                    # Lazy-loaded page components (Dashboard, Roadmap, etc.)
│   │   ├── services/                 # Axios API services (api, auth, roadmap, interview, etc.)
│   │   └── utils/                    # Styling & classnames helpers
│   ├── .env.example                  # Client environment template
│   └── package.json
├── server/                           # Backend application (Express + MongoDB)
│   ├── src/
│   │   ├── config/                   # MongoDB connection & buffer timeout handling
│   │   ├── controllers/              # Business logic (auth, roadmap, ai, jobs, interview, etc.)
│   │   ├── middleware/               # JWT protect, optionalAuth, validators, errorHandler
│   │   ├── models/                   # Mongoose schemas (User, Job, Resume, Interview, etc.)
│   │   ├── routes/                   # Express REST endpoints
│   │   ├── services/                 # Google Gen AI integration (geminiService.js)
│   │   ├── seed.js                   # Database seed script
│   │   └── server.js                 # Express server entry point
│   ├── services/                     # Direct module export alias for geminiService.js
│   ├── .env.example                  # Server environment template
│   └── package.json
├── PROJECT_CONTEXT.md                # Architectural design and source of truth
├── README.md                         # Comprehensive project documentation
└── package.json                      # Root workspace orchestrator (concurrently)
```

---

## 📋 Prerequisites

Before running SheNova, ensure you have the following installed on your machine:
- **Node.js:** v18.0.0 or higher (tested on Node v20 and v24)
- **npm:** v9.0.0 or higher
- **MongoDB:** Either a local MongoDB instance (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster.
- **Google Gemini API Key:** Optional for demo mode, required for live GenAI calls. Get one free at [Google AI Studio](https://aistudio.google.com/).

---

## 🚀 Step-by-Step Setup Guide

### 1. Clone Repository
```bash
git clone https://github.com/prachi2k/SheNova.git
cd SheNova
```

### 2. Setting Up MongoDB (Local or MongoDB Atlas)

#### Option A: Local MongoDB (macOS / Linux / Windows)
If using macOS with Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```
Your local URI is: `mongodb://127.0.0.1:27017/shenova`

#### Option B: Cloud MongoDB Atlas (Recommended for cloud deployment)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster.
2. In **Database Access**, create a database user (e.g. `shenova_admin`) and save the password.
3. In **Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
4. Click **Connect** → **Drivers** (Node.js) and copy the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/shenova?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials.

### 3. Obtaining a Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account and click **Get API key**.
3. Create a key in a new or existing Google Cloud project and copy the generated key.

### 4. Environment Variables Setup

#### Server Configuration (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```bash
cd server
cp .env.example .env
```
Populate `server/.env`:
```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (Local or Atlas)
MONGO_URI=mongodb://127.0.0.1:27017/shenova

# JWT Authentication
JWT_SECRET=shenova_super_secure_jwt_dev_secret_key_2026_min32chars
JWT_EXPIRES_IN=7d

# Google Gemini API Key & Model Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

#### Client Configuration (`client/.env`)
Create `client/.env` based on `client/.env.example`:
```bash
cd ../client
cp .env.example .env
```
Populate `client/.env`:
```env
# URL where the SheNova Express API server is running
VITE_API_URL=http://localhost:5001/api
```

### 5. Install Dependencies

You can install all dependencies from the root directory with one command:
```bash
cd ..
npm run install:all
```
*Alternatively, install each sub-project manually:*
```bash
npm install                # Root workspace tools (concurrently)
cd server && npm install   # Backend dependencies
cd ../client && npm install # Frontend dependencies
cd ..
```

### 6. Seed Database
Run the seed script to populate sample returnships, courses, mentors, and success stories:
```bash
npm run seed
```
*(Or from `/server`: `cd server && npm run seed`)*

**Default Seeded Demo Account:**
- **Email:** `ananya.sharma@example.com`
- **Password:** `Password123!`

### 7. Run Application

Start both the backend server (port 5001) and frontend client (port 5173) simultaneously:
```bash
npm run dev
```

Open your browser to:
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API Base:** [http://localhost:5001/api](http://localhost:5001/api)
- **Server Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🛡 Demo Mode & Safety Disclosure

SheNova is engineered to be dependable in both production and demonstration environments:

1. **AI Graceful Fallback (`demoMode: true`):**
   - If `GEMINI_API_KEY` is omitted, times out (>15s), or encounters rate-limiting, the backend transparently returns rich, realistic returner data flagged with `"demoMode": true`.
   - The UI surfaces an amber/accent badge (`Demo mode • AI simulation`) so users always know whether they are viewing live generative AI or simulated output.
2. **Database Offline Resilience:**
   - In development mode, if local MongoDB is paused or disconnected, the backend falls back to an in-memory session registry for registration and login so developers are never blocked.
3. **Employer Integrity Guarantee:**
   - Sample listings and companies in `/jobs` are clearly marked with a `Sample listing` badge.
   - In strict compliance with safety rules, **unverified or sample employers are never styled as verified employers**.

---

## 📡 API Overview

**Base URL:** `http://localhost:5001/api`  
**Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new candidate profile |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `POST` | `/api/auth/forgot-password` | Public | Generate reset token (logged to console in dev) |
| `PUT` | `/api/auth/reset-password/:token` | Public | Reset password with token |
| `GET` | `/api/auth/me` | Protected | Fetch authenticated user profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile & career break preferences |

### Career Roadmap (`/api/roadmap`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/roadmap` | Protected | Fetch user's current roadmap |
| `POST` | `/api/roadmap/generate` | Protected | Generate and persist 60-day roadmap |
| `PUT` | `/api/roadmap/milestones/:id` | Protected | Toggle completion of roadmap milestone |

### Skill-Gap Analysis (`/api/skill-analysis`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skill-analysis` | Protected | Retrieve saved skill gap analysis |
| `POST` | `/api/skill-analysis/analyze` | Protected | Run market delta benchmark analysis |

### Resume Builder (`/api/resume`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/resume` | Protected | Retrieve user's active resume and ATS score |
| `PUT` | `/api/resume` | Protected | Upsert resume sections |
| `POST` | `/api/resume/explain-gap` | Protected | Generate 3 positive career gap framings |

### Jobs & Returnships (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public / Opt | List jobs with filters (`type`, `workMode`, `search`) |
| `GET` | `/api/jobs/:id` | Public / Opt | Fetch job listing details |
| `POST` | `/api/jobs/:id/apply` | Protected | Submit application for a listing |
| `GET` | `/api/jobs/applications` | Protected | List user's submitted applications |
| `POST` | `/api/jobs/:id/save` | Protected | Toggle save/bookmark for a job |
| `GET` | `/api/jobs/saved` | Protected | List user's bookmarked jobs |

### AI Mock Interview (`/api/interview`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/interview/sessions` | Protected | Fetch past practice session records |
| `POST` | `/api/interview/start` | Protected | Initialize session with 5 scenario questions |
| `GET` | `/api/interview/sessions/:id` | Protected | Get specific interview session details |
| `POST` | `/api/interview/sessions/:id/submit-answer` | Protected | Evaluate answer and receive rubric feedback |

### Learning Hub (`/api/learning`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/learning/courses` | Public / Opt | List courses (filterable by category) |
| `GET` | `/api/learning/courses/:id` | Public / Opt | Get single course and user progress |
| `GET` | `/api/learning/progress` | Protected | List all course progress records |
| `PUT` | `/api/learning/courses/:id/progress` | Protected | Update course progress percentage |

### Community & Mentors (`/api/community`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/community/mentors` | Public / Opt | List returner mentor directory |
| `POST` | `/api/community/mentorship` | Protected | Request 1-on-1 mentorship session |
| `GET` | `/api/community/mentorship/my-requests` | Protected | View user's submitted mentor requests |
| `GET` | `/api/community/stories` | Public | List verified peer returner stories |
| `GET` | `/api/community/forums` | Public / Opt | List forum discussion threads |
| `POST` | `/api/community/forums` | Protected | Create new discussion topic |
| `POST` | `/api/community/forums/:id/reply` | Protected | Post reply to a discussion thread |
| `POST` | `/api/community/forums/:id/cheer` | Protected | Cheer (like) a discussion thread |

### Google GenAI Engine (`/api/ai/*`)
*Direct Gemini-powered endpoints using `@google/genai`:*
- `POST /api/ai/roadmap`: Generates personalized 60-day roadmap.
- `POST /api/ai/skill-gap`: Runs market delta intelligence comparison.
- `POST /api/ai/improve-resume`: Optimizes bullet points with active metrics.
- `POST /api/ai/explain-gap`: Generates 3 positive career gap framings.
- `POST /api/ai/interview-questions`: Generates 5 scenario questions for target role.
- `POST /api/ai/evaluate-answer`: Evaluates answer on Communication, Relevance, and Confidence.
- `POST /api/ai/recommend-courses`: Recommends targeted modern micro-courses closing identified deltas.

---

## 🔒 Security & Accessibility Standards

### Security
1. **Zero Secret Leakage:** No secret keys reside in frontend code. API calls to Gemini and database credentials are strictly isolated to the Node.js backend.
2. **Git Hygiene:** Root `.gitignore` explicitly excludes all `.env` files, build output (`dist/`), and `node_modules/`.
3. **Data Scoping:** Every user write and read operation strictly filters by `req.user._id` extracted from validated JWT tokens, preventing cross-account data leakage.
4. **Defensive API Guardrails:** Protected with `helmet` HTTP headers, `cors` domain whitelisting, and `express-rate-limit` (150 requests/15 minutes per IP).

### Accessibility & Performance
1. **WCAG AA Color Contrast:** Deep slate text (`#292536`) against pure white (`#FFFFFF`) and warm canvas (`#FAF9FC`) maintains a contrast ratio exceeding 10:1 (surpassing the 4.5:1 requirement).
2. **Accessible Form Controls:** All form inputs, selects, and textareas include associated `label` elements (`htmlFor`/`id`), explicit helper texts, and prominent focus rings (`focus:ring-4 focus:ring-primary-500/10`).
3. **Lazy-Loaded Route Splitting:** All route components are loaded via `React.lazy()` and `React.Suspense`, slashing initial page load bundle size from 1.6MB to 398kB.
4. **Keyboard & Screen Reader Support:** Modals support Escape dismissal and focus trapping; icon-only buttons include descriptive `aria-label` or tooltips.

---

## 🔧 Troubleshooting & FAQs

### 1. Port 5000 Already in Use (`EADDRINUSE`)
- **Reason:** On macOS, the AirPlay Receiver service listens on port 5000 by default.
- **Solution:** SheNova is preconfigured to run on port `5001`. Ensure `PORT=5001` in `server/.env` and `VITE_API_URL=http://localhost:5001/api` in `client/.env`.

### 2. MongoDB Buffering Timeout Error
- **Message:** `Operation users.findOne() buffering timed out after 2500ms`
- **Solution:** Ensure your MongoDB daemon is running locally (`brew services start mongodb-community` or `docker run -d -p 27017:27017 mongo`) or provide a valid MongoDB Atlas connection string in `server/.env`. In development, SheNova's fallback in-memory registry will automatically handle auth requests if the database is temporarily unreachable.

### 3. Gemini API 404 or Invalid Key Error
- **Message:** `API key not valid` or model not found
- **Solution:** Verify your key at [Google AI Studio](https://aistudio.google.com/). Set `GEMINI_API_KEY` in `server/.env`. By default, SheNova uses `gemini-2.5-flash`. You can change this to any model supported by your key using `GEMINI_MODEL=gemini-2.5-flash` in `server/.env`.

### 4. CORS Origin Blocked
- **Message:** `CORS policy: Not allowed by CORS origin access`
- **Solution:** Ensure `CLIENT_URL=http://localhost:5173` is set in `server/.env`. The backend server automatically whitelists `localhost:5173`, `127.0.0.1:5173`, and `localhost:3000`.

---

## 📄 License

This project is licensed under the ISC License. Designed and built to empower women returning to the workforce.
