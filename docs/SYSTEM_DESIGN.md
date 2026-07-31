# System Design — نواة كود (nawa-code)

## 1. High-Level Architecture

`nawa-code` is built as a **Modular Monolith** running on Vite + React + TypeScript in the frontend and Lovable Cloud (Supabase PostgreSQL + RLS + Authentication + Edge Functions) in the backend.

```
+-----------------------------------------------------------------------+
|                           React App (RTL)                             |
|                                                                       |
|  +--------------------+  +--------------------+  +-----------------+  |
|  |   Auth & Shell     |  |   Learning Engine  |  |  Teacher CMS    |  |
|  +--------------------+  +--------------------+  +-----------------+  |
|  | Playground Sandbox |  | Assessment Engine  |  | Analytics/Gamif |  |
|  +--------------------+  +--------------------+  +-----------------+  |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                       Lovable Cloud / Supabase                        |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |           PostgreSQL Database (Tables & Constraints)            |  |
|  +-----------------------------------------------------------------+  |
|  |               Row Level Security (RLS) Policies                 |  |
|  +-----------------------------------------------------------------+  |
|  |                    Supabase Auth System                         |  |
|  +-----------------------------------------------------------------+  |
|  |                        Edge Functions                           |  |
|  |  - initialize-owner         - submit-mastery-answer             |  |
|  |  - start-assessment-attempt - submit-assessment-attempt         |  |
|  |  - finalize-manual-grading  - generate-ai-content               |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

## 2. Directory Structure Conventions

```
src/
  app/
    router/        # Route definitions & guards
    providers/     # Auth, Theme, Toast providers
    guards/        # Role-based route guards
    layouts/       # Public, Student, Teacher layouts
  features/
    auth/          # Login, Setup, Register flows
    dashboard/     # Student & Teacher dashboards
    courses/       # Course catalog & roadmap
    lessons/       # Block renderer, lesson workspace, mastery gate
    playground/    # HTML/CSS/JS sandbox runner
    assessments/   # Exam execution, results, manual grading queue
    progress/      # Progress calculation & roadmap states
    gamification/  # XP, Streaks, Achievements, Leaderboard
    analytics/     # Teacher & Student performance insights
    notifications/ # Announcement & notification system
    certificates/  # Certificate eligibility & template system (flagged)
    teacher/       # Student management, Group management, Content builder
  components/
    ui/            # Reusable design system primitives (Buttons, Cards, Modals)
    shared/        # Brand logo, Navbars, Header, ThemeToggle
  services/        # Supabase API clients & domain services
  hooks/           # Custom React hooks (useAuth, useTheme, etc.)
  lib/             # Utilities, validation schemas, formatters
  types/           # Shared TypeScript interfaces & DB types
  styles/          # Custom CSS tokens and global styling
  tests/           # Automated component & unit tests
```

## 3. Data Flow & Security Rules
- **Authentication**: Managed via Supabase Auth.
- **Authorization**: Server-enforced via PostgreSQL Row Level Security (RLS) policies based on `user_roles`.
- **Stateless Client**: State is hydrated directly from PostgreSQL queries via Supabase JS client.
- **Authoritative Calculations**: Mastery scoring, exam evaluation, XP assignment, and lesson unlocking are executed exclusively server-side via Edge Functions or Security Definer Database Triggers/Functions.
