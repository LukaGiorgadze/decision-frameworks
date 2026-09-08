"use client";
import { type DraftFor, newId } from "@/lib/drafts";
import { Field, AddButton, RemoveButton, SectionHeading } from "./fields";

export function TenTenTen({ draft, onChange }: { draft: DraftFor<"ten-ten-ten">; onChange: (draft: DraftFor<"ten-ten-ten">) => void }) {
  const horizons = [{ key: "minutes", name: "10 minutes", hint: "The immediate feelings and consequences." }, { key: "months", name: "10 months", hint: "How might everyday life have changed?" }, { key: "years", name: "10 years", hint: "What might this mean for the life you want?" }] as const;
  return <section className="worksheet-section">
    <SectionHeading title="Options" description="How would each choice feel over time?" action={<AddButton onClick={() => onChange({ ...draft, options: [...draft.options, { id: newId(), name: "", minutes: "", months: "", years: "" }] })}>Add option</AddButton>} />
    <div className="space-y-10">{draft.options.map((option, index) => <section key={option.id} className="worksheet-panel" aria-label={`Reflection option ${index + 1}`}><div className="mb-5 flex items-end gap-4"><Field className="grow worksheet-title" label={`Option ${index + 1} name`} displayLabel={`Option ${index + 1}`} value={option.name} onChange={(name) => onChange({ ...draft, options: draft.options.map((o) => o.id === option.id ? { ...o, name } : o) })} placeholder="What could you choose?" /><RemoveButton label={`Remove option ${index + 1}`} disabled={draft.options.length <= 2} onClick={() => onChange({ ...draft, options: draft.options.filter((o) => o.id !== option.id) })} /></div><div className="grid gap-5 md:grid-cols-3">{horizons.map((horizon) => <div key={horizon.key} className="min-w-0"><Field multiline label={`Option ${index + 1}: ${horizon.name}`} displayLabel={horizon.name} value={option[horizon.key]} onChange={(value) => onChange({ ...draft, options: draft.options.map((o) => o.id === option.id ? { ...o, [horizon.key]: value } : o) })} placeholder={horizon.hint} /></div>)}</div></section>)}</div>
    <div className="mt-6"><Field multiline label="Which values and priorities matter here?" value={draft.values} onChange={(values) => onChange({ ...draft, values })} placeholder="Family, learning, stability…" /></div>
    <p className="mt-5 text-sm text-muted-foreground">Which option fits your values beyond the short term?</p>
  </section>;
}
