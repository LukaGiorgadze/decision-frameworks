import { quadrants, quadrantKeys, type Draft } from "./drafts";
import { getFramework } from "./frameworks";
import { calculateCosts, calculateRice, calculateWeighted, currencies, formatMoney, formatNumber } from "./calculations";

export function summarizeDraft(draft: Draft): string {
  const lines = [getFramework(draft.frameworkId)!.name, "", `Decision: ${draft.title || "Untitled decision"}`];
  if (draft.context) lines.push(`Context: ${draft.context}`);
  lines.push("");
  switch (draft.frameworkId) {
    case "eisenhower-matrix":
      for (const key of quadrantKeys) {
        lines.push(`${quadrants[key].name} — ${quadrants[key].importance}, ${quadrants[key].urgency}`);
        const tasks = draft.tasks.filter((task) => task.quadrant === key);
        if (!tasks.length) lines.push("No tasks entered.");
        for (const task of tasks) { lines.push(`• ${task.title || "Untitled task"}`); if (task.action) lines.push(`  Next action: ${task.action}`); if (task.date) lines.push(`  Date: ${task.date}`); if (task.owner) lines.push(`  Owner: ${task.owner}`); }
        lines.push("");
      }
      break;
    case "weighted-scoring": {
      const result = calculateWeighted(draft);
      lines.push("Criteria (weights 1–5):", ...draft.criteria.map((c) => `• ${c.name || "Unnamed criterion"}: ${c.weight}`), "");
      draft.options.forEach((option, i) => { lines.push(option.name || `Option ${i + 1}`); draft.criteria.forEach((c) => lines.push(`• ${c.name || "Unnamed criterion"}: rating ${option.ratings[c.id] || "not entered"}`)); lines.push(""); });
      lines.push("Weighted comparison:", ...result.ranking.map((o) => `${o.rank}. ${o.name}: ${formatNumber(o.score)} / 5${o.tied ? " (tied)" : ""}`));
      if (!result.ready) lines.push("Incomplete — complete all criteria, names, and ratings before comparing.");
      lines.push("Formula: sum of (weight × rating) ÷ sum of weights.");
      break;
    }
    case "cost-benefit-analysis": {
      lines.push(`Currency: ${draft.currency}`, `Evaluation period: ${draft.period || "Not entered"}`, "");
      const result = calculateCosts(draft);
      const money = (v: number) => formatMoney(v, currencies.some((c) => c === draft.currency) ? draft.currency : "USD");
      draft.options.forEach((option, i) => { lines.push(option.name || `Option ${i + 1}`); option.items.forEach((item) => lines.push(`• ${item.type === "cost" ? "Cost" : "Benefit"}: ${item.description || "No description"} — ${item.amount || "not entered"} ${draft.currency}`)); if (option.notes) lines.push(`Nonmonetary considerations: ${option.notes}`); const calculated = result.options[i]; lines.push(calculated.score === null ? "Totals: incomplete" : `Costs: ${money(calculated.costs!)}; benefits: ${money(calculated.benefits!)}; net benefit: ${money(calculated.score)}`, ""); });
      if (!result.ready) lines.push("Comparison incomplete. Blank amounts are not treated as zero.");
      lines.push("Simplified, undiscounted estimates. Net benefit = total benefits − total costs.");
      break;
    }
    case "rice-scoring": {
      lines.push(`Reach period: ${draft.period || "Not entered"}`, "");
      draft.options.forEach((o, i) => { lines.push(o.name || `Idea ${i + 1}`, `Reach: ${o.reach || "not entered"}; impact: ${o.impact || "not entered"}; confidence: ${o.confidence ? `${o.confidence}%` : "not entered"}; effort: ${o.effort || "not entered"} person-months`); if (o.notes) lines.push(`Evidence and dependencies: ${o.notes}`); lines.push(""); });
      const result = calculateRice(draft);
      lines.push(result.ready ? "RICE ranking:" : "Provisional RICE ranking (incomplete ideas excluded):", ...result.ranking.map((o) => `${o.rank}. ${o.name}: ${formatNumber(o.score)}${o.tied ? " (tied)" : ""}`), "Formula: reach × impact × (confidence / 100) ÷ effort.");
      break;
    }
    case "ten-ten-ten":
      draft.options.forEach((o, i) => lines.push(o.name || `Option ${i + 1}`, `10 minutes: ${o.minutes || "Not entered"}`, `10 months: ${o.months || "Not entered"}`, `10 years: ${o.years || "Not entered"}`, ""));
      lines.push(`Values and priorities: ${draft.values || "Not entered"}`);
      break;
    case "pre-mortem-analysis":
      lines.push(`Looking back from: ${draft.horizon || "Not entered"}`, `Failure scenario: ${draft.failure || "Not entered"}`, "");
      draft.risks.forEach((r, i) => lines.push(`Risk ${i + 1}: ${r.cause || "Not entered"}`, `Early warning: ${r.warning || "Not entered"}`, `Prevention: ${r.prevention || "Still needs a prevention action"}`, `Owner: ${r.owner || "Not assigned"}`, ""));
      break;
  }
  lines.push("", `My decision: ${draft.decision || "Not entered"}`, `Next step: ${draft.nextStep || "Not entered"}`, "", getFramework(draft.frameworkId)!.limitation);
  return lines.join("\n");
}
