**Decision Frameworks**

A small library of editable decision-making templates, built with Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui.

The first release includes Eisenhower Matrix, Weighted Scoring Model, Cost–Benefit Analysis, RICE Scoring, 10–10–10 Rule, and Pre-mortem Analysis. The home page is the searchable, filterable directory. Each framework has its own worksheet, worked example, and method explanation.

**Run locally**

Use Node.js 22 or newer and npm. Install with `npm ci`, then run `npm run dev`. The default preview is http://127.0.0.1:3000.

**Check the project**

- `npm run typecheck` — TypeScript checks.
- `npm run lint` — Next.js, React, and accessibility lint rules.
- `npm test` — Calculation, data validation, summary, and persistence tests.
- `npm run test:e2e` — Browser workflows, using an already-running local server and Google Chrome.
- `npm run build` — Production build.

Browser tests use isolated contexts and do not modify an existing browser profile's drafts. Set `TEST_BASE_URL` to test another running deployment. Google Chrome must be installed for the configured browser-test channel.

**Data and template behavior**

One draft per framework is stored in `localStorage`, under `decision-frameworks:v1:<framework-id>`. Inputs remain local to the browser. There is no account system, database, AI service, or content analytics. Clearing the site's browser data removes its drafts; different origins, browsers, and devices have independent drafts.

Writes happen synchronously when editing, after the stored draft has been loaded. Malformed existing data is preserved until an explicit reset. A storage failure keeps the current edits in memory and offers copying or printing. A stale tab cannot silently overwrite another tab's saved version.

The numerical models are independent functions in `lib/calculations.ts`. Blank inputs never become zero by default. Cost–Benefit is a simplified comparison over one period and currency, without discounting. Reflective templates do not assign scores or infer answers.

**Deployment**

The project is configured for Vercel. Deploy with the Vercel dashboard or CLI after authenticating to the intended account. The checked-in `vercel.json` uses `npm ci` and `npm run build`.

Set `NEXT_PUBLIC_SITE_URL` to the canonical production URL when attaching a custom domain. Otherwise, metadata uses Vercel's supplied deployment/production hostname; local development falls back to localhost. Configure the domain's Vercel-provided DNS records in Cloudflare as DNS-only. A custom domain is not assumed or purchased by this project.

**Project layout**

- `app/` — Directory, framework routes, metadata, and global styles.
- `components/worksheets/` — Six framework-specific editors and shared controls.
- `components/ui/` — shadcn/ui primitives.
- `lib/frameworks.ts` — Catalog and original editorial content.
- `lib/drafts.ts`, `lib/draft-store.ts` — Draft schemas and persistence.
- `lib/calculations.ts`, `lib/summary.ts` — Calculations and copy/print summaries.
- `tests/` — Unit and browser checks.
- `PLAN.md` — Product specification and remaining-framework backlog.

Production hosting is intended for Vercel. The Sites design workflow informed the implementation, while the requested standard Next.js/Vercel stack takes precedence over the Sites-specific starter and deployment service. No AI or agent-facing integration is included in this first release.
