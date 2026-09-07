"use client";

import { useState } from "react";
import { Check, Copy, LockKeyhole, Printer, RotateCcw } from "lucide-react";
import type { Framework } from "@/lib/frameworks";
import { hasWork } from "@/lib/drafts";
import { summarizeDraft } from "@/lib/summary";
import { useDraft } from "@/hooks/use-draft";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Field } from "./worksheets/fields";
import { Eisenhower } from "./worksheets/eisenhower";
import { Weighted } from "./worksheets/weighted";
import { CostBenefit } from "./worksheets/cost-benefit";
import { Rice } from "./worksheets/rice";
import { TenTenTen } from "./worksheets/ten-ten-ten";
import { PreMortem } from "./worksheets/pre-mortem";

export function Worksheet({ framework }: { framework: Framework }) {
  const { draft, status, update, reset } = useDraft(framework.id);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [copiedSummary, setCopiedSummary] = useState("");
  const summary = summarizeDraft(draft);
  const saveLabel = { loading: "Opening your worksheet…", ready: "Changes save in this browser", saved: "Saved in this browser", unavailable: "Could not save in this browser", corrupt: "Existing draft could not be read", conflict: "Another tab has changed this draft" }[status];
  const saveProblem = ["unavailable", "corrupt", "conflict"].includes(status);
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopiedSummary(summary); setCopyStatus("copied"); }
    catch { setCopyStatus("manual"); }
  }
  return <>
    <div className="screen-only">
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y py-3"><p className="flex items-center gap-2 text-xs text-muted-foreground" role="status" aria-live="polite">{status === "saved" ? <Check size={14} className="text-primary" /> : <LockKeyhole size={14} />}{saveLabel}</p><div className="flex flex-wrap gap-1"><Button variant="ghost" size="sm" onClick={copy} disabled={status === "loading"}><Copy size={14} />{copyStatus === "copied" && copiedSummary === summary ? "Copied" : "Copy summary"}</Button><Button variant="ghost" size="sm" onClick={() => window.print()} disabled={status === "loading"}><Printer size={14} />Print</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-muted-foreground" disabled={status === "loading" || (!hasWork(draft) && !saveProblem)}><RotateCcw size={14} />Start over</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Start a fresh worksheet?</AlertDialogTitle><AlertDialogDescription>This removes this framework’s saved draft from this browser. Copy or print your work first if you want to keep it.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep my work</AlertDialogCancel><AlertDialogAction onClick={() => { reset(); setCopyStatus("idle"); }}>Start over</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></div>
      {saveProblem && <div className="mt-4 rounded-md border border-[#d3ddec] bg-secondary p-4 text-sm" role="alert"><p className="font-medium">{saveLabel}</p><p className="mt-1 text-muted-foreground">{status === "corrupt" ? "The existing saved data has been kept untouched. You can edit and copy this worksheet, or start over to replace that saved data." : status === "conflict" ? "Your edits are still shown here. Copy them before reloading to see the version saved by the other tab." : "Your edits are still available on this page. Copy or print them before leaving. Saving may be blocked or your browser storage may be full."}</p></div>}
      {copyStatus === "manual" && <div className="mt-4 rounded-md border p-4"><label htmlFor="manual-copy" className="field-label">Copy your summary manually</label><p className="mb-3 text-sm text-muted-foreground">Clipboard access is unavailable. Select the text below and copy it.</p><Textarea id="manual-copy" readOnly value={summary} className="h-48" onFocus={(e) => e.target.select()} /></div>}
      <fieldset disabled={status === "loading"} className="min-w-0 border-0 p-0">
        <legend className="sr-only">{framework.name} worksheet</legend>
        <div className="mt-7 grid gap-5 md:grid-cols-2"><Field label={framework.id === "pre-mortem-analysis" ? "What is your plan?" : "What are you deciding?"} value={draft.title} onChange={(title) => update({ ...draft, title })} placeholder={framework.id === "eisenhower-matrix" ? "e.g. What should I focus on this week?" : "Give your decision a short title"} /><Field label="Context (optional)" value={draft.context} onChange={(context) => update({ ...draft, context })} placeholder="Anything worth keeping in mind" /></div>
        {draft.frameworkId === "eisenhower-matrix" && <Eisenhower draft={draft} onChange={update} />}
        {draft.frameworkId === "weighted-scoring" && <Weighted draft={draft} onChange={update} />}
        {draft.frameworkId === "cost-benefit-analysis" && <CostBenefit draft={draft} onChange={update} />}
        {draft.frameworkId === "rice-scoring" && <Rice draft={draft} onChange={update} />}
        {draft.frameworkId === "ten-ten-ten" && <TenTenTen draft={draft} onChange={update} />}
        {draft.frameworkId === "pre-mortem-analysis" && <PreMortem draft={draft} onChange={update} />}
        <section className="mt-8 border-t pt-7"><h2 className="section-title mb-2">Bring it to a decision</h2><p className="mb-5 text-sm text-muted-foreground">Capture where you have landed and one concrete thing to do next.</p><div className="grid gap-5 md:grid-cols-2"><Field multiline label="My decision" value={draft.decision} onChange={(decision) => update({ ...draft, decision })} placeholder="What will you do, and why?" /><Field multiline label="Next step" value={draft.nextStep} onChange={(nextStep) => update({ ...draft, nextStep })} placeholder="An action you can take from here" /></div></section>
      </fieldset>
      <p className="mt-5 text-xs leading-5 text-muted-foreground">One draft per framework, saved only in this browser. Drafts do not sync across devices and are removed when you clear this site’s data.</p>
    </div>
    <div className="print-only"><pre className="print-summary">{summary}</pre></div>
  </>;
}
