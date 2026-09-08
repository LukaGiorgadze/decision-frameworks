**Release validation — September 8, 2026**

The first release implements the six-framework scope in `PLAN.md`.

| Requirement | Evidence |
| --- | --- |
| Prominent framework directory | Searchable, category-filtered card grid at `/` (three columns on desktop, two on tablet, one on mobile); all six templates link directly to their pages; alphabetical ordering |
| Two page types | Directory and statically generated `/frameworks/[slug]` pages; unknown slugs return 404 |
| Six functional templates | Eisenhower, Weighted Scoring, Cost–Benefit, RICE, 10–10–10, and Pre-mortem have framework-specific inputs, original examples, guidance, conclusions, and next steps |
| Correct quantitative behavior | Independent example calculations, blanks vs. zero, invalid amounts and effort, rating scales, incomplete comparisons, and ties are covered by unit tests and browser workflows |
| Browser saving | Immediate persistence, reload/navigation restoration, draft isolation, reset confirmation, malformed data preservation, unavailable storage, failed-write recovery, and conflicting tabs are covered |
| Qualitative guidance | Reflection and risk templates keep user-entered information and provide predefined prompts, without invented scores or AI output |
| Copy and print | Summaries contain entries, results, conclusions, and next steps; clipboard success/failure, stale copied-state handling, print action invocation, and print-only content are covered |
| Responsive, accessible interface | All routes checked at 390px without document overflow; keyboard skip navigation, labeled inputs, no-JavaScript content, and representative 200% text-size layouts checked |
| No animation | Browser checks verify no active animations on the directory or any framework route |
| Metadata and sources | Unique page titles, descriptions, sitemap, robots file, framework links, and source attributions included |
| Requested stack | Next.js 16.3.4, React 19.2.8, Tailwind CSS 4.3.3, and shadcn/ui controls generated with CLI 4.21.0; npm lockfile checked in |
| Release readiness | TypeScript, ESLint, 22 unit tests, 14 browser tests, and the optimized Next.js build pass; production dependencies report zero known vulnerabilities in npm audit |

The initial production build was also tested against a separate `next start` server: all 12 workflows then present passed. Subsequent copy-status and enlarged-text refinements were verified by the expanded 14-test suite and a successful rebuild.

Visual review covered the directory and Eisenhower working surface. An additional warning in the user's normal Chrome profile came from a browser extension adding a body attribute before hydration; isolated test contexts did not reproduce it. No application hydration suppression was added.

Deployment uses standard Next.js on Vercel. A custom Cloudflare domain has not been selected. Deployment details will be added once a live release is verified.

**UI simplification — September 8, 2026**

Replaced the directory table with large cards, shortened descriptions and field labels, removed repeated instructional and footer copy, and moved method instructions/examples and optional notes behind native disclosure controls. Existing draft formats and calculations are unchanged. The 14 browser workflows pass with the updated disclosure controls, alongside type checking, lint, and the production build.

The subsequent visual refinement removes nested panel borders, uses soft filled controls with visible focus states, and separates options with whitespace. Reflection, scoring, risk, and matrix pages share this treatment; catalog cards retain their three-column desktop layout with borderless backgrounds. The existing 14 browser workflows, type checking, lint, and production build pass.

**Paper design:** Warm textured surfaces, ivory cards/sheets, serif typography, ruled fields, quiet controls, and a matching paper dialog replace the application styling. All 14 browser checks pass (the enlarged-text check was rerun after correcting heading wrapping); lint, TypeScript, and the production build pass. Existing saved data and calculation logic remain unchanged.

**Hand-drawn reference update:** Added a locally hosted, SIL OFL licensed Patrick Hand font and six original SVG framework sketches. The catalog now starts with search and filters, without a hero or global header; worksheet titles are accessible/print-only and breadcrumbs are removed. All 14 browser checks pass (print verification rerun after correcting a print selector), alongside lint, TypeScript, and the production build.

**Worksheet refinements:** Back navigation replaces save status; draft badges, card arrows, and the storage footer are removed. All input names now have underlines, and help/supporting text is larger. Browser autosaving remains verified. All 14 browser tests, lint, and the production build pass.
