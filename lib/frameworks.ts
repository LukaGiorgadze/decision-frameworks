export const categories = ["All frameworks", "Prioritize", "Compare options", "Think long term", "Assess risks"] as const;
export type Category = (typeof categories)[number];
export type FrameworkId = "cost-benefit-analysis" | "eisenhower-matrix" | "pre-mortem-analysis" | "rice-scoring" | "ten-ten-ten" | "weighted-scoring";
export type Framework = {
  id: FrameworkId;
  name: string;
  description: string;
  category: Category;
  format: string;
  instructions: string[];
  limitation: string;
  source: { title: string; url: string };
  example: { situation: string; entries: string[]; takeaway: string };
};

const catalog: Framework[] = [
  {
    id: "cost-benefit-analysis", name: "Cost–Benefit Analysis", category: "Compare options", format: "Comparison table",
    description: "Weigh what each option will cost against what you expect to gain.",
    instructions: ["Choose a shared currency and evaluation period.", "List the costs and benefits of each option over that whole period.", "Compare net benefits alongside the things money cannot measure."],
    limitation: "This is a simplified, undiscounted comparison of your estimates. Nonmonetary effects, timing, and uncertainty still matter.",
    source: { title: "UK Government: the Green Book", url: "https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government" },
    example: { situation: "Choose a scheduling tool for the next year.", entries: ["Tool A: $240 subscription cost; $900 estimated value of time saved. Net benefit: $660.", "Tool B: $480 subscription cost; $1,000 estimated value of time saved. Net benefit: $520.", "Qualitative consideration: Tool B works with the team's existing calendar."], takeaway: "Tool A has a $140 higher estimated net benefit. Decide whether Tool B's integration is worth that difference." },
  },
  {
    id: "eisenhower-matrix", name: "Eisenhower Matrix", category: "Prioritize", format: "2 × 2 matrix",
    description: "Separate what needs your attention now from what can wait.",
    instructions: ["Important tasks support your goals; urgent tasks need attention soon.", "Add each task to the quadrant that fits it best.", "Give scheduled tasks a date and delegated tasks an owner."],
    limitation: "You decide what is important and urgent. Revisit the matrix as deadlines, priorities, and circumstances change.",
    source: { title: "The Eisenhower Matrix", url: "https://www.eisenhower.me/" },
    example: { situation: "Make space for the important work in your week.", entries: ["Do now: resolve a customer issue due today.", "Schedule: draft next quarter's strategy on Friday.", "Delegate: ask Alex to arrange the team meeting.", "Eliminate: stop checking an unused dashboard every morning."], takeaway: "Handle today's issue, then protect time for the strategy work before it becomes urgent." },
  },
  {
    id: "pre-mortem-analysis", name: "Pre-mortem Analysis", category: "Assess risks", format: "Risk worksheet",
    description: "Imagine a plan has failed, then work backward to prevent it.",
    instructions: ["Describe your plan and a future point when you will assess it.", "Imagine it has failed. Write down the possible reasons why.", "Identify warning signs and an action to prevent each failure."],
    limitation: "This worksheet helps you surface possible risks. It does not estimate their probability or guarantee that every risk is covered.",
    source: { title: "Gary Klein: the pre-mortem method", url: "https://www.gary-klein.com/premortem" },
    example: { situation: "Imagine your community workshop has failed three months from now.", entries: ["Cause: too few registrations. Warning sign: fewer than 10 sign-ups two weeks out. Action: invite partner communities. Owner: Maya.", "Cause: the venue cancels. Warning sign: no written confirmation. Action: confirm the booking and reserve a backup. Owner: Leo."], takeaway: "Confirm the venue this week and set a date to review registrations." },
  },
  {
    id: "rice-scoring", name: "RICE Scoring", category: "Prioritize", format: "Scoring table",
    description: "Rank ideas by reach, impact, confidence, and the effort involved.",
    instructions: ["Choose one period for estimating reach across all ideas.", "Estimate impact, confidence, and effort in person-months.", "Compare scores, then consider dependencies and the evidence behind your estimates."],
    limitation: "Scores are estimates, not commitments. A lower-scoring idea may be a dependency or meet an essential requirement.",
    source: { title: "Intercom: the RICE framework", url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/" },
    example: { situation: "Choose between two product improvements for the next quarter.", entries: ["Onboarding guide: reach 1,000 × impact 1 × confidence 80% ÷ effort 2 = 400.", "Reporting dashboard: reach 200 × impact 2 × confidence 50% ÷ effort 2 = 100."], takeaway: "The guide ranks higher with these estimates. Check whether the reach numbers and confidence levels have supporting evidence." },
  },
  {
    id: "ten-ten-ten", name: "10–10–10 Rule", category: "Think long term", format: "Reflection worksheet",
    description: "Consider how a choice will feel in 10 minutes, 10 months, and 10 years.",
    instructions: ["Write down the options you are considering.", "Explore each option's consequences and your feelings at all three time horizons.", "Compare those reflections with your values and choose a next step."],
    limitation: "Long-term reflections are possibilities, not predictions. Use them to clarify what matters to you, rather than to assign a score.",
    source: { title: "Suzy Welch on 10–10–10", url: "https://www.linkedin.com/posts/suzywelch_today-a-widely-shared-social-media-post-activity-7128833711290118145-S2f1" },
    example: { situation: "Decide whether to take on an evening course.", entries: ["Take the course: in 10 minutes, excited but nervous; in 10 months, new skills and less free time; in 10 years, a possible new direction.", "Wait: in 10 minutes, relieved; in 10 months, more evenings with family; in 10 years, the question may still be open."], takeaway: "Reflect on which choice fits your current priorities. A useful next step is to ask about the weekly time commitment." },
  },
  {
    id: "weighted-scoring", name: "Weighted Scoring Model", category: "Compare options", format: "Scoring table",
    description: "Compare your options against the criteria that matter most to you.",
    instructions: ["Name your options and the criteria you care about.", "Weight each criterion from 1 to 5, then rate each option from 1 to 5.", "A higher rating always means more desirable. Compare the weighted scores and trade-offs."],
    limitation: "Your weights and ratings shape the ranking. The highest score supports discussion; it does not make the decision for you.",
    source: { title: "ASQ: decision matrices", url: "https://asq.org/quality-resources/decision-matrix" },
    example: { situation: "Choose a workspace using affordability (weight 3) and quiet (weight 2).", entries: ["Library: affordability 5, quiet 4. Weighted score: (3 × 5 + 2 × 4) ÷ 5 = 4.6.", "Café: affordability 3, quiet 2. Weighted score: (3 × 3 + 2 × 2) ÷ 5 = 2.6."], takeaway: "The library leads on these criteria. Add any missing consideration, such as opening hours, before committing." },
  },
];

export const frameworks = [...catalog].sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
export function getFramework(id: string) { return frameworks.find((framework) => framework.id === id); }
