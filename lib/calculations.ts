import type { DraftFor } from "./drafts";

export function numberValue(raw: string): number | null {
  const value = raw.trim();
  if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
export function numericError(raw: string, { positive = false, max }: { positive?: boolean; max?: number } = {}): string | undefined {
  if (!raw.trim()) return undefined;
  const value = numberValue(raw);
  if (value === null) return "Enter a number, such as 250 or 2.5.";
  if (positive ? value <= 0 : value < 0) return positive ? "Enter a number greater than zero." : "Enter zero or a positive number.";
  if (max !== undefined && value > max) return `Enter a number no greater than ${max}.`;
}
export function formatNumber(value: number) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value); }
export function formatMoney(value: number, currency: string) { return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value); }
export const currencies = ["USD", "EUR", "GBP", "GEL", "CAD", "AUD", "INR", "JPY"] as const;

export type ScoredOption = { id: string; name: string; score: number };
export function rankOptions(options: ScoredOption[]) {
  const sorted = [...options].sort((a, b) => b.score - a.score);
  return sorted.map((item) => ({ ...item, rank: sorted.findIndex((other) => Math.abs(other.score - item.score) < 1e-9) + 1, tied: sorted.filter((other) => Math.abs(other.score - item.score) < 1e-9).length > 1 }));
}

export function calculateWeighted(draft: DraftFor<"weighted-scoring">) {
  const validScale = (raw: string) => { const n = numberValue(raw); return n !== null && Number.isInteger(n) && n >= 1 && n <= 5; };
  const criteriaReady = draft.criteria.length > 0 && draft.criteria.every((c) => c.name.trim() && validScale(c.weight));
  const weightSum = draft.criteria.reduce((sum, c) => sum + (numberValue(c.weight) ?? 0), 0);
  const options = draft.options.map((option) => {
    const complete = criteriaReady && !!option.name.trim() && draft.criteria.every((c) => validScale(option.ratings[c.id] ?? ""));
    const contributions = complete ? draft.criteria.map((c) => ({ name: c.name, weight: Number(c.weight), rating: Number(option.ratings[c.id]), points: Number(c.weight) * Number(option.ratings[c.id]), contribution: Number(c.weight) * Number(option.ratings[c.id]) / weightSum })) : [];
    return { id: option.id, name: option.name, score: complete ? contributions.reduce((sum, c) => sum + c.contribution, 0) : null, contributions };
  });
  const ready = options.length >= 2 && options.every((o) => o.score !== null);
  return { ready, weightSum, options, ranking: ready ? rankOptions(options.map((o) => ({ ...o, score: o.score! }))) : [] };
}

export function calculateCosts(draft: DraftFor<"cost-benefit-analysis">) {
  const contextReady = !!draft.period.trim() && currencies.some((currency) => currency === draft.currency);
  const options = draft.options.map((option) => {
    const complete = contextReady && !!option.name.trim() && option.items.length > 0 && option.items.every((item) => item.description.trim() && numberValue(item.amount) !== null && Number(item.amount) >= 0);
    const costs = option.items.filter((i) => i.type === "cost").reduce((sum, i) => sum + (numberValue(i.amount) ?? 0), 0);
    const benefits = option.items.filter((i) => i.type === "benefit").reduce((sum, i) => sum + (numberValue(i.amount) ?? 0), 0);
    const valid = complete && Number.isFinite(costs) && Number.isFinite(benefits) && Number.isFinite(benefits - costs);
    return { id: option.id, name: option.name, costs: valid ? costs : null, benefits: valid ? benefits : null, score: valid ? benefits - costs : null };
  });
  const ready = options.length >= 2 && options.every((o) => o.score !== null);
  return { ready, options, ranking: ready ? rankOptions(options.map((o) => ({ ...o, score: o.score! }))) : [] };
}

export function calculateRice(draft: DraftFor<"rice-scoring">) {
  const options = draft.options.map((option) => {
    const reach = numberValue(option.reach), impact = numberValue(option.impact), confidence = numberValue(option.confidence), effort = numberValue(option.effort);
    const complete = !!draft.period.trim() && !!option.name.trim() && reach !== null && reach >= 0 && impact !== null && [.25, .5, 1, 2, 3].includes(impact) && confidence !== null && [50, 80, 100].includes(confidence) && effort !== null && effort > 0;
    const score = complete ? reach * impact * (confidence / 100) / effort : null;
    return { id: option.id, name: option.name, score: score !== null && Number.isFinite(score) ? score : null };
  });
  const scored = options.filter((option): option is ScoredOption => option.score !== null);
  return { ready: scored.length === options.length && options.length >= 2, options, ranking: rankOptions(scored) };
}
