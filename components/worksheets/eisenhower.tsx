"use client";
import { CalendarDays, CircleCheck, CircleSlash, UserRound } from "lucide-react";
import { type DraftFor, newId, quadrantKeys, quadrants, type Task } from "@/lib/drafts";
import { Field, SelectField, AddButton, RemoveButton, SectionHeading } from "./fields";

const icons = { do: CircleCheck, schedule: CalendarDays, delegate: UserRound, eliminate: CircleSlash };
export function Eisenhower({ draft, onChange }: { draft: DraftFor<"eisenhower-matrix">; onChange: (draft: DraftFor<"eisenhower-matrix">) => void }) {
  const edit = (id: string, patch: Partial<Task>) => onChange({ ...draft, tasks: draft.tasks.map((task) => task.id === id ? { ...task, ...patch } : task) });
  return <section className="worksheet-section">
    <SectionHeading title="Tasks" />
    <div className="mb-3 hidden grid-cols-2 gap-5 pl-9 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid"><span>Urgent</span><span>Not urgent</span></div>
    <div className="relative md:pl-9"><span className="absolute left-0 top-[15%] hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:block [writing-mode:vertical-rl]">Important</span><span className="absolute left-0 top-[65%] hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground md:block [writing-mode:vertical-rl]">Not important</span>
      <div className="grid gap-4 md:grid-cols-2">{quadrantKeys.map((key) => {
        const quadrant = quadrants[key]; const Icon = icons[key]; const tasks = draft.tasks.filter((task) => task.quadrant === key);
        return <section key={key} aria-label={`${quadrant.name} quadrant`} className={`paper-quadrant flex min-h-[235px] flex-col ${key === "do" ? "bg-[#f0f4fc]" : "bg-secondary"}`}>
          <div className="px-5 pt-5 pb-0"><div className="flex items-center justify-between"><h3 className={`flex items-center gap-2 text-base font-semibold ${key === "do" ? "text-primary" : ""}`}><Icon size={17} strokeWidth={1.6} />{quadrant.name}</h3></div><p className="mt-1 text-xs text-muted-foreground">{quadrant.importance} · {quadrant.urgency}</p></div>
          <div className="flex grow flex-col p-5"><div className="space-y-4">{tasks.map((task, i) => <div key={task.id} className="paper-task p-3.5"><div className="mb-2 flex items-center justify-between"><span className="text-xs text-muted-foreground">Task</span><RemoveButton label={`Remove ${task.title || `task ${i + 1}`} from ${quadrant.name}`} onClick={() => onChange({ ...draft, tasks: draft.tasks.filter((t) => t.id !== task.id) })} /></div><Field label="Task" hideLabel value={task.title} onChange={(title) => edit(task.id, { title })} placeholder="What needs to get done?" /><details className="mt-3 text-sm"><summary className="cursor-pointer text-muted-foreground">Details</summary><div className="mt-3"><Field label="Next action (optional)" value={task.action} onChange={(action) => edit(task.id, { action })} placeholder="The smallest useful step" /></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Date (optional)" type="date" value={task.date} onChange={(date) => edit(task.id, { date })} /><Field label="Owner (optional)" value={task.owner} onChange={(owner) => edit(task.id, { owner })} placeholder="Who will do this?" /></div><div className="mt-3"><SelectField label="Move to quadrant" value={task.quadrant} onChange={(quadrant) => edit(task.id, { quadrant: quadrant as Task["quadrant"] })}>{quadrantKeys.map((q) => <option key={q} value={q}>{quadrants[q].name}</option>)}</SelectField></div></details></div>)}</div><div className="mt-auto pt-4"><AddButton onClick={() => onChange({ ...draft, tasks: [...draft.tasks, { id: newId(), title: "", action: "", date: "", owner: "", quadrant: key }] })}>Add task to {quadrant.name.toLowerCase()}</AddButton></div></div>
        </section>;
      })}</div>
    </div>

  </section>;
}
