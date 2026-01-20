---
name: frontend-expert-review
description: Expert-level frontend code review workflow focusing on maintainability, security, performance, and accessibility. Use when reviewing frontend diffs, PRs, components, SPAs, UI logic, or framework-specific code (React/Next.js, Vue, Svelte, Angular, etc.) and when producing structured findings with severity, file/line references, and actionable recommendations.
---

# Frontend Expert Review

## Overview
Provide an expert-grade frontend review with findings prioritized by maintainability, then security, then performance and accessibility (equal weight). Keep feedback precise, actionable, and grounded in file/line evidence.

## Workflow

### 1) Confirm scope and context
- Identify the target files, user flows, and environments (SSR/CSR, mobile/desktop, browser support, i18n, theming).
- Note constraints and missing context; ask focused questions when assumptions would materially affect the review.

### 2) Load the correct references
- Always read `references/general.md` for cross-cutting checks.
- For framework-specific guidance, read the matching file:
  - React: `references/react.md`
  - Next.js: `references/next.md`
  - Vue: `references/vue.md`
  - Svelte: `references/svelte.md`
  - Angular: `references/angular.md`
- If Next.js is involved, also read `references/react.md` (Next.js reviews are React reviews too).
- If React/Next.js is involved, also read `.codex/skills/vercel-react-best-practices/SKILL.md` and apply its guidance. Treat it as a performance-oriented sub-skill and merge the outputs into one coherent review (do not duplicate findings).

### 3) Review in priority order
1. **Maintainability**: architecture, boundaries, state/data flow clarity, naming, consistency, typing, error handling, testability.
2. **Security**: XSS/injection risk, unsafe DOM APIs, auth/session handling in client code, secrets exposure, dependency risk.
3. **Performance & Accessibility (equal)**: bundle impact, rendering costs, hydration, caching, interaction latency; semantics, keyboard, focus management, ARIA, contrast.

### 4) Record each finding with evidence
For every issue, include:
- Severity (Critical/High/Medium/Low)
- Category (Maintainability/Security/Performance/Accessibility)
- Location (file path + line)
- Rationale and risk
- Specific fix or alternative approach

### 5) Close the loop
- Recommend tests or checks that would prevent regressions (unit/e2e/a11y/perf). If no tests are appropriate, say so explicitly.
- If uncertainty remains, list questions and assumptions separately.

## Output format
Use this format unless the user requests otherwise:

Findings
- [Severity][Category] `path:line` — issue summary. Evidence/risk. Recommendation.

Questions / Assumptions
- ...

Suggested tests or checks
- ...

## References
- `references/general.md` (always)
- Framework-specific references in `references/`
