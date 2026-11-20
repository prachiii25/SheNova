# PROJECT_CONTEXT.md

## Overview
**Project Name:** SheNova  
**Tagline:** "New Opportunities. Endless Possibilities."  
**Mission:** An AI-powered career restart platform designed specifically for women returning to the workforce after a career break (due to motherhood, marriage, childcare, caregiving, family, or personal reasons).  
**Tone & Voice:** Empowering, welcoming, professional, and trustworthy. SheNova is not just a job board—it is designed and experienced as a supportive, empathetic career companion.

---

## Brand & Design System

### Color Palette
- **Primary:** `#7041A6` (Warm, empowering royal purple)
- **Secondary:** `#EDE5F7` (Soft lavender tint for cards, tags, and gentle backgrounds)
- **Accent:** `#F28BA8` (Warm rose / coral accent for highlights and primary CTAs)
- **Background:** `#FAF9FC` (Clean, warm off-white canvas)
- **Text:** `#292536` (Deep slate charcoal for accessible, crisp readability)

### Visual Style
- **Aesthetic:** Modern SaaS with high warmth and polish.
- **UI Elements:** Rounded cards (`rounded-2xl` / `rounded-xl`), soft subtle shadows (`shadow-sm`, `shadow-md`), generous whitespace, and minimal elegant gradients.
- **Micro-interactions:** Smooth animations and page transitions powered by Framer Motion.
- **Design Philosophy:** Avoid looking like an impersonal, sterile generic job board. Emphasize guidance, upskilling, mentorship, confidence-building, and verified returnship-friendly opportunities.
- **Responsiveness:** Fully responsive across mobile, tablet, and desktop screens.

---

## Tech Stack

### Frontend
- **Framework & Build:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router (v6+)
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Runtime & Server:** Node.js + Express
- **Database:** MongoDB with Mongoose ODM
- **Authentication & Security:** JSON Web Tokens (JWT) + bcrypt
- **AI Integration:** Google Gemini API (via server-side endpoints)

---

## Project Architecture & Directory Structure
```
SheNova/
├── client/                 # Frontend application (React + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # Reusable UI components & layouts
│   │   ├── context/        # State management / Auth / Toast contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route views & dashboards
│   │   ├── services/       # API integration client
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend application (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/         # DB connection, env configs
│   │   ├── controllers/    # Route controllers & Gemini AI handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── PROJECT_CONTEXT.md      # Source of truth
└── README.md
```

---

## Core Engineering & Product Rules

1. **No Dead Ends:** No non-functional buttons, broken links, or `#` placeholder hrefs. Every interactive element must trigger a real action, navigation, or clear state change.
2. **Transparent Data Labeling:** Any sample, mock, or seeded data must be explicitly labeled as `"Demo data"` or `"Sample"` in the UI.
3. **Employer Integrity:** Never mark unverified or mock companies as verified employers.
4. **Strict Security Boundaries:** API keys (especially Google Gemini API keys and JWT secrets) must strictly reside in backend `.env` files. Never expose secret keys in client-side code or repositories.
5. **Component Reusability & State Quality:**
   - Build modular, cleanly separated reusable components.
   - Comprehensive state handling: explicit loading skeletons/spinners, empty states with friendly guidance, and clear error boundaries.
   - Visual feedback: toast notifications for actions, confirmations, and alerts.
   - Robust form validation with clear, inline helper messages.
