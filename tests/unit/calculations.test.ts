import { describe, expect, it } from "vitest";
import { createDraft, parseDraft, hasWork, type DraftFor } from "../../lib/drafts";
import { calculateWeighted, calculateCosts, calculateRice, numberValue, numericError, rankOptions } from "../../lib/calculations";
import { summarizeDraft } from "../../lib/summary";

describe("numeric input", () => {
  it("preserves the distinction between blank, zero, and invalid input", () => {
    expect(numberValue("")).toBeNull(); expect(numberValue(" ")).toBeNull(); expect(numberValue("0")).toBe(0);
    for (const raw of ["Infinity", "NaN", "0x10", "1,000", "1e900"]) expect(numberValue(raw)).toBeNull();
    expect(numberValue(" .5 ")).toBe(.5); expect(numericError("0", { positive: true })).toContain("greater than zero"); expect(numericError("-1")).toContain("positive");
  });
});
describe("weighted scoring", () => {
  function worksheet() { const draft = createDraft("weighted-scoring") as DraftFor<"weighted-scoring">; draft.criteria = [{ id: "cost", name: "Affordability", weight: "3" }, { id: "quiet", name: "Quiet", weight: "2" }]; draft.options = [{ id: "library", name: "Library", ratings: { cost: "5", quiet: "4" } }, { id: "cafe", name: "Café", ratings: { cost: "3", quiet: "2" } }]; return draft; }
  it("matches independent weighted examples and contribution totals", () => { const result = calculateWeighted(worksheet()); expect(result.ready).toBe(true); expect(result.ranking[0].name).toBe("Library"); expect(result.ranking[0].score).toBeCloseTo(4.6); expect(result.ranking[1].score).toBeCloseTo(2.6); expect(result.options[0].contributions.map((c) => c.points)).toEqual([15, 8]); });
  it("does not compare missing names, scores, or invalid weights", () => { for (const weight of ["0", "6", "", "-1", "2.5"]) { const draft = worksheet(); draft.criteria[0].weight = weight; expect(calculateWeighted(draft).ready).toBe(false); } const draft = worksheet(); delete draft.options[1].ratings.quiet; expect(calculateWeighted(draft).ranking).toEqual([]); });
  it("recognizes ties without changing editable input order", () => { const draft = worksheet(); draft.options[1].ratings = { ...draft.options[0].ratings }; const result = calculateWeighted(draft); expect(result.ranking.map((o) => [o.rank, o.tied])).toEqual([[1, true], [1, true]]); expect(draft.options[0].id).toBe("library"); });
});
describe("cost–benefit comparison", () => {
  function worksheet() { const draft = createDraft("cost-benefit-analysis") as DraftFor<"cost-benefit-analysis">; draft.options.forEach((o, i) => { o.name = `Tool ${i + 1}`; o.items[0].description = "Subscription"; o.items[0].amount = i === 0 ? "240" : "480"; o.items[1].description = "Value of time saved"; o.items[1].amount = i === 0 ? "900" : "1000"; }); return draft; }
  it("computes net benefits for each option", () => { const result = calculateCosts(worksheet()); expect(result.ready).toBe(true); expect(result.ranking.map((o) => o.score)).toEqual([660, 520]); expect(result.options[0].costs).toBe(240); });
  it("allows zero and negative net benefits, but not negative line amounts", () => { const draft = worksheet(); draft.options[0].items[1].amount = "0"; expect(calculateCosts(draft).options[0].score).toBe(-240); draft.options[0].items[0].amount = "-1"; expect(calculateCosts(draft).options[0].score).toBeNull(); });
  it("does not silently turn missing rows into zero or compare missing periods", () => { const draft = worksheet(); draft.options[0].items[1].amount = ""; expect(calculateCosts(draft).ready).toBe(false); expect(calculateCosts(draft).options[0].costs).toBeNull(); draft.period = ""; expect(calculateCosts(draft).ranking).toEqual([]); });
});
describe("RICE scoring", () => {
  function worksheet() { const draft = createDraft("rice-scoring") as DraftFor<"rice-scoring">; draft.options = [{ id: "a", name: "Guide", reach: "1000", impact: "1", confidence: "80", effort: "2", notes: "Research" }, { id: "b", name: "Dashboard", reach: "200", impact: "2", confidence: "50", effort: "2", notes: "" }]; return draft; }
  it("converts percentages once and matches the independent example", () => { const result = calculateRice(worksheet()); expect(result.ready).toBe(true); expect(result.ranking.map((o) => o.score)).toEqual([400, 100]); });
  it("supports zero reach and fractional effort, excludes invalid effort and incomplete rows", () => { const draft = worksheet(); draft.options[0].reach = "0"; draft.options[1].effort = ".5"; expect(calculateRice(draft).ranking.map((o) => o.score)).toEqual([400, 0]); draft.options[0].effort = "0"; const result = calculateRice(draft); expect(result.ready).toBe(false); expect(result.ranking).toHaveLength(1); });
  it("rejects unsupported scales and overflow", () => { const draft = worksheet(); draft.options[0].impact = "4"; expect(calculateRice(draft).options[0].score).toBeNull(); draft.options[0].impact = "3"; draft.options[0].reach = "1" + "0".repeat(308); expect(calculateRice(draft).options[0].score).toBeNull(); });
});
describe("draft integrity and summaries", () => {
  it("rejects malformed, cross-framework, unsupported-version, and duplicate-ID drafts", () => { expect(parseDraft("{broken", "weighted-scoring")).toBeNull(); const draft = createDraft("weighted-scoring") as DraftFor<"weighted-scoring">; expect(parseDraft(JSON.stringify(draft), "rice-scoring")).toBeNull(); expect(parseDraft(JSON.stringify({ ...draft, version: 2 }), "weighted-scoring")).toBeNull(); draft.options[1].id = draft.options[0].id; expect(parseDraft(JSON.stringify(draft), "weighted-scoring")).toBeNull(); });
  it("distinguishes untouched defaults from real work", () => { const draft = createDraft("rice-scoring"); expect(hasWork(draft)).toBe(false); draft.updatedAt = 12; expect(hasWork(draft)).toBe(false); draft.context = "Deciding for my team"; expect(hasWork(draft)).toBe(true); });
  it("includes qualitative entries and conclusions without inventing rankings", () => { const draft = createDraft("ten-ten-ten") as DraftFor<"ten-ten-ten">; draft.title = "Evening course"; draft.options[0].minutes = "Excited"; draft.options[0].years = "New direction"; draft.values = "Family and learning"; draft.decision = "Take one module"; draft.nextStep = "Ask about the timetable"; const summary = summarizeDraft(draft); for (const text of ["Evening course", "Excited", "New direction", "Family and learning", "Take one module", "Ask about the timetable"]) expect(summary).toContain(text); expect(summary).not.toContain("ranking"); });
  it("retains task details and pre-mortem action gaps in summaries", () => { const matrix = createDraft("eisenhower-matrix") as DraftFor<"eisenhower-matrix">; matrix.tasks.push({ id: "task", title: "Strategy", quadrant: "schedule", action: "Write draft", owner: "Alex", date: "2026-10-01" }); expect(summarizeDraft(matrix)).toContain("Date: 2026-10-01"); const risk = createDraft("pre-mortem-analysis") as DraftFor<"pre-mortem-analysis">; risk.risks[0].cause = "Venue cancels"; expect(summarizeDraft(risk)).toContain("Still needs a prevention action"); });
  it("uses competition ranks for ties", () => { expect(rankOptions([{ id: "a", name: "A", score: 3 }, { id: "b", name: "B", score: 3 }, { id: "c", name: "C", score: 1 }]).map((o) => o.rank)).toEqual([1, 1, 3]); });
});
