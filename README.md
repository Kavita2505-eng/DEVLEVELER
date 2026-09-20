# DevLeveler

AI-powered developer growth and career intelligence platform.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql)](https://www.postgresql.org/)

---

## Product Overview

**DevLeveler** is a telemetry-driven developer analytics and career intelligence platform engineered to benchmark technical capabilities, identify skill gaps, and accelerate software engineering growth.

### The Problem
Traditional resumes and generic GitHub profiles fail to provide actionable feedback on a developer's true readiness for software engineering roles. Early-career and experienced developers often lack clarity on how hiring managers evaluate their projects, what critical technical competencies they are missing, and what structured steps will get them to the next level.

### The Solution
DevLeveler ingests developer data across public code repositories, technical resumes, and portfolio deployments to synthesize an objective **Developer Score**, perform automated ATS resume parsing, audit project architecture, analyze live web portfolios, and generate personalized, step-by-step career roadmaps.

### Who It Is For
- **Software Developers**: Track code velocity, benchmark engineering skills, and follow clear milestones.
- **Job Seekers & Students**: Optimize technical resumes for ATS parsing and prepare for technical and HR interviews.
- **Engineering Leads & Recruiters**: View verified skill distributions, code metrics, and developer readiness reports.

---

## Features

### Developer Intelligence
- Multi-dimensional competency scoring (GitHub velocity, project structure, resume quality, skill mastery, and deployment health).
- Comprehensive intelligence reports synthesizing strengths, weaknesses, role alignment, and prioritized milestones.

### GitHub Intelligence
- Repository health auditing, language breakdown, star/fork telemetry, and commit activity analysis.
- Automatic XP rewards and badges upon syncing active repositories.

### Resume Analysis
- ATS keyword compliance scanning, format diagnostics, and missing skills detection.
- Honest, hiring-manager-grade feedback with bullet-point impact suggestions.

### Portfolio Audit
- Automated evaluation of personal portfolio websites for performance, mobile responsiveness, SEO, UI/UX aesthetics, and accessibility.
- Actionable recommendations to improve employer conversion rates.

### Readiness & Skills
- Role-specific readiness scoring across Entry-Level, Graduate, Frontend, Backend, and Full-Stack tracks.
- Target skill matrix mapping current competencies against industry requirements.

### Career Roadmap
- Dynamic weekly and monthly milestone generator tailored to user goals and current gaps.
- Curated project ideas, architectural patterns, and recommended toolchains.

### Interview Preparation
- Customized technical, HR, and project-based interview simulation questions based on developer profile and target roles.
- Follow-up evaluation prompts and difficulty tuning.

### AI Career Coach
- Interactive multi-turn AI career advisor capable of reviewing decisions, guiding career pivots, and answering architectural queries.

### Projects
- GitHub repository architecture analysis checking folder organization, README documentation, code complexity, scalability, and deployment status.

### Public Developer Profiles
- Shareable public profile (`/u/[username]`) showcasing Developer Score, badges, verified skills, and GitHub metrics to recruiters.

### XP & Achievements
- Gamified leveling system rewarding developers with XP for profile audits, resume optimizations, and milestone completions.
- Unlockable achievement badges commemorating career progression.

### Notifications
- In-app notification center alerting developers of roadmap milestones, score enhancements, and platform updates.

### Admin / Recruiter Features
- Recruiter portal featuring talent search, candidate filtering by developer score and skills, and profile inspection.
- Dedicated admin portal for platform analytics, user management, and system telemetry.

### Billing
- Machined SaaS tier system supporting Free and Pro memberships with automated early adopter provisioning.

---

## Tech Stack

| Category | Technology | Description |
|:---|:---|:---|
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) | App Router architecture, Server Components, Turbopack |
| **UI Library** | [React 19](https://react.dev/) | Concurrent rendering, Server Actions, modern hooks |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety and strict schema validation |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS with native `@theme` tokens |
| **Database** | [PostgreSQL (Neon)](https://neon.tech/) | Serverless cloud relational database |
| **ORM** | [Prisma v6](https://www.prisma.io/) | Type-safe schema definition, migrations, and queries |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) | JWT sessions with Google OAuth, GitHub OAuth, and Credentials |
| **AI Architecture** | Multi-Provider Engine | Modular provider abstraction supporting OpenRouter, OpenAI, and Gemini |
| **Data Validation** | [Zod v4](https://zod.dev/) | Runtime environment validation and schema parsing |
| **Animation & Charts** | [Motion](https://motion.dev/) & [Recharts](https://recharts.org/) | Micro-interactions, transitions, and telemetry data visualization |

---

## Architecture

### High-Level System Flow

```
User Request
     │
     ▼
Next.js App Router (Client & Server Components)
     │
     ├── Server Actions & API Routes
     │        │
     │        ▼
     ├── Business Logic & Rate Limiting (src/lib/)
     │        │
     │        ├── AI Provider Abstraction (OpenRouter / OpenAI / Gemini)
     │        │
     │        └── Prisma ORM Client
     │                 │
     │                 ▼
     └── PostgreSQL Database (Neon)
```

### AI Provider Architecture

DevLeveler decouples business logic from specific AI vendors via a unified provider registry:

```
Application Feature (Resume / Roadmap / Coach / Intelligence)
     │
     ▼
src/lib/ai/index.ts (ai() facade)
     │
     ▼
Provider Registry (src/lib/ai/provider.ts)
     │
     ├── OpenRouterProvider (src/lib/ai/openrouter.ts)
     ├── OpenAIProvider (src/lib/ai/openai.ts)
     └── GeminiProvider (src/lib/ai/gemini.ts)
```

Provider selection is config-driven via environment variables (`AI_PROVIDER`), enabling zero-downtime provider switching without altering business logic.

---

## Project Structure

```
DevLeveler/
├── prisma/
│   ├── schema.prisma           # Prisma data models & relational schema
│   └── seed.ts                 # Database seeding script for development
├── public/                     # Static assets, branding, and images
├── src/
│   ├── actions/                # Next.js Server Actions (mutations & queries)
│   │   ├── admin.ts
│   │   ├── interview.ts
│   │   ├── readiness.ts
│   │   ├── recruiter.ts
│   │   ├── resume.ts
│   │   ├── roadmap.ts
│   │   ├── score.ts
│   │   ├── settings.ts
│   │   └── skills.ts
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, signup, reset password
│   │   ├── (dashboard)/        # Protected dashboard application routes
│   │   │   └── dashboard/
│   │   │       ├── career-coach/
│   │   │       ├── github/
│   │   │       ├── intelligence/
│   │   │       ├── interview/
│   │   │       ├── portfolio/
│   │   │       ├── projects/
│   │   │       ├── readiness/
│   │   │       ├── resume/
│   │   │       ├── roadmap/
│   │   │       ├── settings/
│   │   │       └── skills/
│   │   ├── api/                # Route handlers (auth endpoints)
│   │   ├── u/[username]/       # Public shareable profile pages
│   │   ├── globals.css         # Design tokens and theme system
│   │   └── layout.tsx          # Root HTML layout & fonts
│   ├── components/             # Reusable UI & dashboard components
│   │   ├── dashboard/          # Feature clients, charts, sidebar, header
│   │   ├── landing/            # Marketing & landing page sections
│   │   └── ui/                 # Core primitive components
│   ├── lib/                    # Shared libraries, utilities, and services
│   │   ├── ai/                 # Multi-provider AI engine (OpenRouter, OpenAI, Gemini)
│   │   ├── achievements.ts     # Gamification engine
│   │   ├── env.ts              # Zod environment variable validation
│   │   ├── github.ts           # GitHub REST API client
│   │   ├── prisma.ts           # Global Prisma client singleton
│   │   ├── rate-limit.ts       # In-memory sliding window rate limiter
│   │   └── xp.ts               # Experience points & leveling formulas
│   ├── types/                  # TypeScript interface definitions
│   ├── auth.ts                 # Auth.js / NextAuth v5 configuration
│   └── middleware.ts           # Route protection & session validation
├── .env.example                # Example environment variables template
├── next.config.ts              # Next.js compiler & security configurations
├── package.json                # Project dependencies & scripts
└── tsconfig.json               # TypeScript compiler options
```

---

## Local Development

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **PostgreSQL Database**: A local instance or a free cloud database from [Neon](https://neon.tech).

### 1. Clone the Repository
```bash
git clone https://github.com/kartik-shukla2301-eng/DevLeveler.git
cd DevLeveler
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env.local
```

### 4. Setup Database Schema
Push the Prisma schema to your PostgreSQL database:
```bash
npx prisma db push
```

*(Optional) Seed the database with demo accounts and benchmark metrics:*
```bash
npm run prisma db seed
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Code Verification Commands
```bash
# Type check TypeScript files
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```

---

## Environment Variables

Configure the following variables in your `.env.local` file:

| Variable | Required | Description |
|:---|:---:|:---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (supports Neon connection pooling) |
| `DIRECT_URL` | Optional | Direct connection string for schema migrations |
| `AUTH_SECRET` | Yes | Secret key used to encrypt Auth.js session tokens (`npx auth secret`) |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth Client ID for sign-in functionality |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth Client Secret for sign-in functionality |
| `AI_PROVIDER` | Yes | Selected AI provider: `openrouter`, `openai`, or `gemini` |
| `OPENROUTER_API_KEY` | Conditional | API key for OpenRouter (required if `AI_PROVIDER=openrouter`) |
| `OPENAI_API_KEY` | Conditional | API key for OpenAI (required if `AI_PROVIDER=openai`) |
| `GEMINI_API_KEY` | Conditional | API key for Google Gemini (required if `AI_PROVIDER=gemini`) |
| `AI_MODEL` | Optional | Custom model identifier (e.g., `meta-llama/llama-3.3-70b-instruct`) |
| `GITHUB_TOKEN` | Optional | GitHub Personal Access Token to increase public API rate limits |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical root URL of the deployment (e.g., `http://localhost:3000`) |

---

## Pricing & Membership Tiers

DevLeveler implements a transparent tier structure enforced via database models:

| Tier | Price | Highlights |
|:---|:---|:---|
| **Free** | $0 | Standard developer profile, GitHub telemetry sync, 1 AI resume analysis, 1 roadmap, 1 project audit, and 1 portfolio analysis. |
| **Pro** | $3 / 6 Months | Unlimited AI career coaching, unlimited resume audits, advanced intelligence reports, priority recruiter visibility, and exclusive theme presets. |
| **Founding Developer** | Free Lifetime Pro | Reserved exclusively for the first 5 registered developers on the platform. |

---

## Security

- **Authentication & Sessions**: Built on NextAuth.js v5 using secure JWT cookie tokens and bcrypt password hashing.
- **Role-Based Access Control**: Middleware and layout-level guards protecting Developer, Recruiter, and Admin routes.
- **In-Memory Rate Limiting**: Built-in sliding window rate limiter (`src/lib/rate-limit.ts`) throttling AI calls and authentication endpoints to prevent abuse.
- **Strict Input Validation**: All Server Actions and form submissions are validated using Zod schemas before database execution.
- **AI Prompt Sanitization**: AI responses are stripped of dangerous markdown injections and parsed through fault-tolerant JSON extractors (`extractJSON`).
- **Credential Protection**: Strict `.gitignore` rules prevent accidental commits of `.env` files or API secrets.

---

## Performance

- **Optimized Server Components**: Layouts, dashboards, and profile pages leverage React Server Components for minimal client-side JavaScript overhead.
- **In-Memory AI Caching**: Repeated AI prompt requests within short intervals are cached (`src/lib/ai/cache.ts`) to conserve tokens and reduce latency.
- **Component Memoization**: Complex visual charts and interactive topology components utilize `React.memo` to eliminate unnecessary re-renders.
- **Database Query Deduplication**: Heavy dashboard aggregations use targeted Prisma `select` clauses and parallel `Promise.all` batches.
- **Graceful Error Recovery**: Client-side errors are caught by React Error Boundaries (`ai-error-boundary.tsx`), preventing crashes and providing one-click retry actions.

---

## Roadmap

- [x] **Phase 1: Core Architecture** — Next.js 15, PostgreSQL database, and NextAuth v5 authentication.
- [x] **Phase 2: Analytics Suite** — GitHub sync, ATS resume scanner, and portfolio auditor.
- [x] **Phase 3: AI Intelligence Engine** — Multi-provider AI abstraction, Developer Intelligence Report, and Career Coach.
- [x] **Phase 4: Gamification & Portals** — XP system, achievement unlocks, Recruiter portal, and Admin telemetry.
- [ ] **Phase 5: Automated Email Alerts** — Weekly progress digest and milestone notifications via Resend.
- [ ] **Phase 6: Payment Gateway Integration** — Automated Stripe / Razorpay checkout for Pro memberships.
- [ ] **Phase 7: End-to-End Test Suite** — Comprehensive Playwright and Vitest test coverage.

---

## Contributing

Contributions to DevLeveler are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "feat: describe your change cleanly"
   ```
4. **Verify code quality**:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
5. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** describing the problem solved and test coverage.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Kartik Shukla**  
B.Tech Computer Science & Engineering  

- **GitHub**: [@kartik-shukla2301-eng](https://github.com/kartik-shukla2301-eng)  
- **LinkedIn**: [Kartik Shukla](https://www.linkedin.com/in/kartik-shukla-cse)  
- **Portfolio**: [kartik-portfolio-chi-eight.vercel.app](https://kartik-portfolio-chi-eight.vercel.app)  
- **Email**: [kartikshukla2301@gmail.com](mailto:kartikshukla2301@gmail.com)  

---

Built with Next.js, TypeScript, Prisma and AI.  
© 2026 Kartik Shukla
