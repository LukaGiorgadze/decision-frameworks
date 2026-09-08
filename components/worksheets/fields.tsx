"use client";
import { useId, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";

type FieldProps = { label: string; displayLabel?: string; hideLabel?: boolean; value: string; onChange: (value: string) => void; placeholder?: string; hint?: string; error?: string; className?: string; };
export function Field({ label, displayLabel, hideLabel, value, onChange, placeholder, hint, error, className = "", multiline = false, inputMode, type = "text" }: FieldProps & { multiline?: boolean; inputMode?: "decimal" | "numeric"; type?: "text" | "date" }) {
  const id = useId();
  const control = { id, value, "aria-label": displayLabel ? label : undefined, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value), placeholder, "aria-invalid": !!error, "aria-describedby": error || hint ? `${id}-hint` : undefined, className: "w-full text-base md:text-base shadow-none" };
  return <div className={`min-w-0 ${className}`}><Label htmlFor={id} className={hideLabel ? "sr-only" : "mb-2 block text-sm font-medium leading-5"}>{displayLabel || label}</Label>{multiline ? <Textarea {...control} className={`${control.className} min-h-24 resize-y leading-6`} /> : <Input {...control} type={type} inputMode={inputMode} className={`${control.className} h-10`} />}{(error || hint) && <p id={`${id}-hint`} className={error ? "input-error" : "mt-2 text-xs leading-5 text-muted-foreground"}>{error || hint}</p>}</div>;
}
export function SelectField({ label, displayLabel, hideLabel, value, onChange, children, hint, className = "" }: Omit<FieldProps, "placeholder" | "error"> & { children: ReactNode }) {
  const id = useId();
  return <div className={`min-w-0 [&_[data-slot=native-select-wrapper]]:w-full ${className}`}><Label htmlFor={id} className={hideLabel ? "sr-only" : "mb-2 block text-sm font-medium leading-5"}>{displayLabel || label}</Label><NativeSelect id={id} aria-label={displayLabel ? label : undefined} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={hint ? `${id}-hint` : undefined} className="h-10 w-full text-sm shadow-none">{children}</NativeSelect>{hint && <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-muted-foreground">{hint}</p>}</div>;
}
export function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) { return <Button type="button" variant="ghost" className="text-primary h-auto min-h-9 max-w-full whitespace-normal py-2 text-left shadow-none" onClick={onClick}><Plus size={15} />{children}</Button>; }
export function RemoveButton({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) { return <Button type="button" variant="ghost" size="icon-sm" aria-label={label} title={label} disabled={disabled} onClick={onClick} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></Button>; }
export function SectionHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) { return <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 className="section-title">{title}</h2>{description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>}</div>{action}</div>; }
export function ResultBox({ title = "What this tells you", children }: { title?: string; children: ReactNode }) { return <section className="paper-note mt-10 p-5 sm:p-6" aria-label={title}><h2 className="section-title mb-3">{title}</h2>{children}</section>; }
