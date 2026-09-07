**Decision Frameworks — implementation plan**

Planning only. Implementation has not started. The six-framework selection and details below are proposed defaults; browser saving, no accounts, no AI, and a first release of five or six frameworks are confirmed user choices.

**1. Product goal and scope**

Build a simple website where people choose a decision framework, fill in its template, and use clear explanations and results to decide their next step. The framework directory is the main experience.

Use two page types: the directory at `/` and individual templates at `/frameworks/[slug]`. Start with six working frameworks. Assume English, general personal and work decisions, and the working name “Decision Frameworks.”

Keep interaction limited to useful controls: searching, filtering, editing, adding or removing entries, and copying or printing work. Use no animations, transitions, drag-and-drop, or multi-step onboarding.

**2. Initial framework catalog**

| Framework | Best for | Editable template | Result or guidance |
| --- | --- | --- | --- |
| Eisenhower Matrix | Prioritizing tasks | Four quadrants with task entries | Actions grouped into do now, schedule, delegate, and eliminate |
| Weighted Scoring Model | Comparing several options | Options, criteria, weights, and ratings | Weighted scores, ranking, ties, and criterion contributions |
| Cost–Benefit Analysis | Comparing estimated costs and benefits | Options with monetary cost/benefit line items and qualitative notes | Totals and net benefit for a shared period |
| RICE Scoring | Prioritizing projects or features | Reach, impact, confidence, and effort for each idea | Ranked RICE scores and visible assumptions |
| 10–10–10 Rule | Considering short- and long-term consequences | Options with reflections at three time horizons | Side-by-side consequences and a user-written conclusion |
| Pre-mortem Analysis | Identifying risks before committing | Failure scenario, possible causes, warning signs, and prevention actions | Risks and concrete actions to address them |

**3. Directory page**

Start with a compact header, the title “Decision-making frameworks,” and one sentence explaining how to use the site. Place the directory immediately below; avoid a large hero section.

Use a table on desktop with columns for framework, “Use this when…,” category, and an “Open template” link. Framework names also link to their templates. Alphabetical order is the default. Display all six without pagination.

Provide a search field matching names and descriptions, plus a single category filter: All, Prioritize, Compare options, Think long term, and Assess risks. Show a useful empty state with a clear-filters action. On small screens, display the same information as compact stacked rows with visible labels.

If a framework has a saved draft, show a subtle “Draft saved” indicator on its row. Keep the directory readable without browser storage or JavaScript; search and draft indicators progressively enhance it.

**4. Shared framework page**

Present content in this order:

1. Back link to all frameworks, framework name, and a one-sentence purpose.
2. A short “When to use it” explanation and up to three instructions.
3. A decision title and optional context field.
4. The editable template, which occupies most of the page.
5. Results or reflection prompts, followed by “My decision” and “Next step” fields.
6. A worked example and a brief explanation of the method and its limitations, with source attribution.

Use visible field labels, concise hints, readable error messages, and add/remove buttons where entries repeat. Keep examples separate from the user's draft. Numerical results update when their required inputs are valid; reflective templates organize the user's writing and provide predefined prompts.

Place a quiet save-status message near the template. Include Copy summary, Print, and Start over actions. Copy and print include the user's entries, calculated results, conclusion, and next step. Print uses the browser's print dialog and supports its Save as PDF option. Start over requires confirmation when a draft contains user work.

If JavaScript is unavailable, show the framework explanation and a short notice that editing requires JavaScript.

**5. Template rules**

| Template | Implementation requirements |
| --- | --- |
| Eisenhower | Columns are Urgent and Not urgent; rows are Important and Not important. Users add tasks directly to a quadrant. Each task has a title, optional next action, and optional date or owner. A simple select can move a task. Show task counts and quadrant-specific prompts, such as choosing a date for scheduled work. Importance and urgency are assigned by the user. |
| Weighted Scoring | Start with two blank options and three editable criteria. Use positive importance weights from 1–5 and desirability ratings from 1–5. Explain that 5 always means more desirable, including for cost or difficulty. Compute the sum of weight × rating divided by the sum of weights, producing a score from 1–5. Require complete named options and criteria before comparing all options. Show ties and contributions; never label the highest score as objectively correct. |
| Cost–Benefit | Start with two options and allow more. Set one currency and one evaluation period for the whole worksheet. Each line item has a description, Cost or Benefit type, and a nonnegative amount covering that period. Compute total benefits minus total costs per option. Display nonmonetary considerations separately. Label this as a simplified, undiscounted comparison; do not mix currencies, automatically monetize notes, or treat blank amounts as zero. |
| RICE | Set a common reach period. For each idea, collect nonnegative reach, impact from 0.25/0.5/1/2/3, confidence from 50%/80%/100%, and positive effort in person-months. Use reach × impact × (confidence / 100) ÷ effort. Show incomplete rows without scores, identify ties, and label rankings provisional while rows are incomplete. Keep notes for evidence and dependencies. |
| 10–10–10 | Start with two options and allow more. For each option, collect anticipated consequences and feelings after 10 minutes, 10 months, and 10 years. Add a shared prompt about values and priorities. Display the answers together; the user writes their preferred option and next step. Do not generate a winner or numeric score. |
| Pre-mortem | Ask the user to describe their plan, choose a future point, and imagine that the plan has failed. Each row captures a possible cause, early warning sign, prevention action, and optional owner. Summarize the entered actions and highlight missing prevention steps. Do not infer risk probabilities from free text. |

These worksheets are product adaptations. The weighted approach follows [ASQ's decision matrix guidance](https://asq.org/quality-resources/decision-matrix). RICE factors, scales, and formula follow [Intercom's explanation](https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/). The reflective methods follow [Suzy Welch's explanation of 10–10–10](https://www.linkedin.com/posts/suzywelch_today-a-widely-shared-social-media-post-activity-7128833711290118145-S2f1) and [Gary Klein's pre-mortem method](https://www.gary-klein.com/premortem). Quadrant actions follow the [Eisenhower Matrix explanation](https://www.eisenhower.me/). Write original instructions and examples for this website.

**6. Browser saving**

For this release, retain one current draft per framework in `localStorage`. A draft includes its framework ID, data-format version, title, context, entries, conclusion, next step, and last-saved time. Multiple named decisions per framework can be added later.

Restore an existing draft before enabling autosave so an empty initial state cannot overwrite it. Preserve incomplete and invalid input as draft text; validation controls calculations, not whether work is saved. Save edits promptly and preserve pending edits before navigation. Show “Saved in this browser” only after a successful write.

Handle unavailable storage, failed writes, and malformed saved data without crashing or silently clearing existing work. Editing should remain usable with an honest “Could not save in this browser” message and copy/print actions. Validate stored data and version its format for future changes.

Explain briefly that drafts stay in this browser, do not sync across devices, and can disappear if site data is cleared. Storage is scoped to the site's origin, so deployment previews and the production domain have separate drafts. This behavior follows the [browser localStorage model](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Keep decision content in the browser; no content analytics, database, authentication, or AI service is needed for this scope.

**7. Visual and accessibility requirements**

Use a white background, near-black text, one muted blue primary color, and neutral gray secondary surfaces. Apply light borders, modest corner rounding, a single readable sans-serif font, and consistent spacing. Use restrained buttons and visible keyboard focus. Disable default component animations and transitions.

The catalog should be easy to scan, and the template should be comfortable to fill. Keep instructional text narrow enough to read and allow worksheets more width. Stack Eisenhower quadrants on phones while retaining both axis labels. Convert wide scoring inputs into per-option groups on narrow screens; preserve a readable comparison summary.

Use semantic tables where appropriate, associated form labels, keyboard-accessible controls, sufficient contrast, and accessible validation messages. Never rely on color alone to convey categories or results. Avoid moving editable rows while someone types; display rankings separately.

**8. Technical approach**

Use Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui. Resolve the latest mutually compatible stable package versions when implementation starts and commit the lockfile. Follow the official [Next.js setup](https://nextjs.org/docs/app/getting-started/installation), [Tailwind integration](https://tailwindcss.com/docs/installation/framework-guides/nextjs), and [shadcn Next.js installation](https://ui.shadcn.com/docs/installation/next).

Render the directory and framework explanations as static/server-rendered content. Use client components for the editable worksheets, search/filter controls, results, and browser storage.

Keep framework metadata and editorial content in a typed catalog. Each framework has its own input model, validator, calculation or summary function, and template component. Share ordinary controls, the page layout, saving, copying, and printing. Avoid building a general-purpose visual form builder for six templates.

Plan for Vercel deployment and Cloudflare DNS with DNS-only records for the application hostname. Vercel advises against a reverse proxy in front of its hosting; see its [Cloudflare guidance](https://vercel.com/kb/guide/cloudflare-with-vercel). Domain setup is a deployment-stage task.

Give every framework a stable descriptive URL, unique page title and description, and inclusion in a sitemap. Unknown slugs return a proper not-found page.

**9. Build sequence and completion checks**

| Phase | Deliverable | Completion check |
| --- | --- | --- |
| 1. Content and foundation | Six framework definitions, original instructions and worked examples, project setup, and shared visual styles | Each template has an explicit input/output specification; package compatibility is verified |
| 2. Catalog and first template | Responsive directory, search/filter, framework layout, and Eisenhower Matrix | Users can find the framework, fill all quadrants, leave the page, and return to restored work |
| 3. Quantitative templates | Weighted Scoring, Cost–Benefit, and RICE | Independently calculated examples match; missing inputs, zero values, invalid effort, weights, and ties behave correctly |
| 4. Reflective templates and utilities | 10–10–10, Pre-mortem, copy summary, and print layout | Guidance reflects entered information; examples never overwrite drafts; printed work remains readable |
| 5. Validation and release preparation | Complete local build and a deployable release | Type checks, lint, and production build pass; key browser flows and responsive layouts are verified |

Use focused automated tests for numerical calculations and draft persistence, plus a browser flow covering directory → edit → refresh → navigate away and back → reset. Verify invalid and unavailable storage, keyboard use, direct framework links, mobile layouts, copying, and print preview. Do not add tests that merely duplicate static copy or styling.

The local implementation is complete when all six templates work end to end, drafts survive refresh and navigation, results are explainable, and both page types work on desktop and mobile without animation. A live release additionally requires successful Vercel deployment and verification of the intended domain; do not claim deployment if hosting access or domain configuration is still outstanding.

**10. Expansion after the first release**

Preserve the remaining requested frameworks in the backlog: Expected Value, Opportunity Cost, ICE Scoring, Pareto Principle, Decision Tree Analysis, Regret Minimization, Second-Order Thinking, Inversion, First-Principles Thinking, Satisficing, MECE Structuring, Simplified Cynefin, and Hard Choices Model.

Before adding each one, define its inputs, suitable layout, guidance, and source-backed interpretation. Methods with multiple variants, especially Hard Choices and simplified Cynefin, need an explicit selected interpretation. Keep unfinished templates out of the live directory.

**Ready-to-use implementation goal**

Build the Decision Frameworks website described in this plan using compatible stable Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui. Deliver the prominent framework directory and individual pages for Eisenhower Matrix, Weighted Scoring Model, Cost–Benefit Analysis, RICE Scoring, 10–10–10 Rule, and Pre-mortem Analysis. Support one automatically saved browser draft per framework, clear built-in calculations or reflection guidance, copying and printing, accessible mobile layouts, and a simple interface without animation. Complete the defined validation checks and prepare the site for Vercel with Cloudflare DNS. Use the plan's template rules and scope as the implementation specification.
