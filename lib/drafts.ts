import { z } from "zod";
import type { FrameworkId } from "./frameworks";

const text = z.string();
const base = { version: z.literal(1), title: text, context: text, decision: text, nextStep: text, updatedAt: z.number().finite().nonnegative() };
const id = z.string().min(1);
export const quadrantKeys = ["do", "schedule", "delegate", "eliminate"] as const;
export const quadrants = {
  do: { name: "Do now", importance: "Important", urgency: "Urgent", hint: "Give these tasks your attention first.", prompt: "Choose the first task you can act on today." },
  schedule: { name: "Schedule", importance: "Important", urgency: "Not urgent", hint: "Make time for what moves you forward.", prompt: "Give each task a date so it has a place in your week." },
  delegate: { name: "Delegate", importance: "Not important", urgency: "Urgent", hint: "Find the right person to take this on.", prompt: "Choose an owner and agree on a next action." },
  eliminate: { name: "Eliminate", importance: "Not important", urgency: "Not urgent", hint: "Let go of work that does not serve your goals.", prompt: "Decide which of these tasks you can stop doing." },
};
const taskSchema = z.object({ id, title: text, quadrant: z.enum(quadrantKeys), action: text, date: text, owner: text });
const criterionSchema = z.object({ id, name: text, weight: text });
const weightedOptionSchema = z.object({ id, name: text, ratings: z.record(text, text) });
const lineSchema = z.object({ id, description: text, type: z.enum(["cost", "benefit"]), amount: text });
const costOptionSchema = z.object({ id, name: text, notes: text, items: z.array(lineSchema) });
const riceOptionSchema = z.object({ id, name: text, reach: text, impact: text, confidence: text, effort: text, notes: text });
const reflectionOptionSchema = z.object({ id, name: text, minutes: text, months: text, years: text });
const riskSchema = z.object({ id, cause: text, warning: text, prevention: text, owner: text });

export const draftSchema = z.discriminatedUnion("frameworkId", [
  z.object({ ...base, frameworkId: z.literal("eisenhower-matrix"), tasks: z.array(taskSchema) }),
  z.object({ ...base, frameworkId: z.literal("weighted-scoring"), criteria: z.array(criterionSchema).min(1), options: z.array(weightedOptionSchema).min(2) }),
  z.object({ ...base, frameworkId: z.literal("cost-benefit-analysis"), currency: text, period: text, options: z.array(costOptionSchema).min(2) }),
  z.object({ ...base, frameworkId: z.literal("rice-scoring"), period: text, options: z.array(riceOptionSchema).min(2) }),
  z.object({ ...base, frameworkId: z.literal("ten-ten-ten"), values: text, options: z.array(reflectionOptionSchema).min(2) }),
  z.object({ ...base, frameworkId: z.literal("pre-mortem-analysis"), horizon: text, failure: text, risks: z.array(riskSchema) }),
]);
export type Draft = z.infer<typeof draftSchema>;
export type DraftFor<T extends FrameworkId> = Extract<Draft, { frameworkId: T }>;
export type Task = z.infer<typeof taskSchema>;
export type CostOption = z.infer<typeof costOptionSchema>;
export type Risk = z.infer<typeof riskSchema>;
export const newId = () => crypto.randomUUID();

export function newCostOption(id: string): CostOption {
  return { id, name: "", notes: "", items: [{ id: `${id}-cost`, description: "", type: "cost", amount: "" }, { id: `${id}-benefit`, description: "", type: "benefit", amount: "" }] };
}

export function createDraft(frameworkId: FrameworkId): Draft {
  const common = { version: 1 as const, title: "", context: "", decision: "", nextStep: "", updatedAt: 0 };
  switch (frameworkId) {
    case "eisenhower-matrix": return { ...common, frameworkId, tasks: [] };
    case "weighted-scoring": return { ...common, frameworkId, criteria: [1, 2, 3].map((i) => ({ id: `criterion-${i}`, name: "", weight: "3" })), options: [1, 2].map((i) => ({ id: `option-${i}`, name: "", ratings: {} })) };
    case "cost-benefit-analysis": return { ...common, frameworkId, currency: "USD", period: "1 year", options: [newCostOption("option-1"), newCostOption("option-2")] };
    case "rice-scoring": return { ...common, frameworkId, period: "Next quarter", options: [1, 2].map((i) => ({ id: `option-${i}`, name: "", reach: "", impact: "", confidence: "", effort: "", notes: "" })) };
    case "ten-ten-ten": return { ...common, frameworkId, values: "", options: [1, 2].map((i) => ({ id: `option-${i}`, name: "", minutes: "", months: "", years: "" })) };
    case "pre-mortem-analysis": return { ...common, frameworkId, horizon: "", failure: "", risks: [{ id: "risk-1", cause: "", warning: "", prevention: "", owner: "" }] };
  }
}

export function hasWork(draft: Draft): boolean {
  return JSON.stringify({ ...draft, updatedAt: 0 }) !== JSON.stringify(createDraft(draft.frameworkId));
}

export function parseDraft(raw: string, frameworkId: FrameworkId): Draft | null {
  try {
    const result = draftSchema.safeParse(JSON.parse(raw));
    if (!result.success || result.data.frameworkId !== frameworkId) return null;
    const draft = result.data;
    const unique = (items: { id: string }[]) => new Set(items.map((item) => item.id)).size === items.length;
    if ("options" in draft && !unique(draft.options)) return null;
    if (draft.frameworkId === "weighted-scoring" && !unique(draft.criteria)) return null;
    if (draft.frameworkId === "cost-benefit-analysis" && draft.options.some((option) => !unique(option.items))) return null;
    if (draft.frameworkId === "eisenhower-matrix" && !unique(draft.tasks)) return null;
    if (draft.frameworkId === "pre-mortem-analysis" && !unique(draft.risks)) return null;
    return draft;
  } catch { return null; }
}
