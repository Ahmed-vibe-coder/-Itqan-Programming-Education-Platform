# Architectural Decision Records (ADR) — نواة كود (nawa-code)

## ADR 001: Modular Monolith with Lovable Cloud / Supabase
- **Status**: Accepted
- **Context**: The platform requires a single-teacher scalable architecture without microservice complexity.
- **Decision**: Use React (Vite + TypeScript) with Lovable Cloud / Supabase backend (PostgreSQL + RLS + Edge Functions).

## ADR 002: LTR Code Blocks in RTL Pages
- **Status**: Accepted
- **Context**: Arabic programming students learn standard HTML, CSS, and JS syntax while reading Arabic explanations.
- **Decision**: Main application wrapper uses `dir="rtl"` with Alexandria font, while code inputs, editors, and snippets strictly use `dir="ltr"` with JetBrains Mono.

## ADR 003: Sandboxed Iframe for Playground
- **Status**: Accepted
- **Context**: Executing untrusted student JavaScript inside the main web application DOM poses critical security vulnerabilities (JWT token theft, DOM pollution).
- **Decision**: Run output in an iframe with `sandbox="allow-scripts"` (without `allow-same-origin`) and CSP protections.

## ADR 004: Strict Server-Side Mastery & Unlocking
- **Status**: Accepted
- **Context**: Students must not be able to bypass lesson prerequisites by manipulating client-side state or local storage.
- **Decision**: Lesson progression states and unlocks are evaluated and persisted exclusively through Supabase RLS and server Edge Functions.
