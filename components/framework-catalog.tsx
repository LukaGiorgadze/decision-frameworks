"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { categories, frameworks, type Category } from "@/lib/frameworks";
import { FrameworkSketch } from "./framework-sketch";
import { BrowserEditingNotice } from "./browser-editing-notice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FrameworkCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All frameworks");
  const normalized = query.toLowerCase().trim().replaceAll("–", "-");
  const filtered = frameworks.filter((f) => (category === "All frameworks" || f.category === category) && `${f.name} ${f.description} ${f.category}`.toLowerCase().replaceAll("–", "-").includes(normalized));
  return <section aria-label="Framework directory">
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <h2 className="sr-only">Frameworks</h2>
      <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" aria-hidden="true" /><Input className="h-10 pl-10 pr-10 text-sm shadow-none" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search frameworks" placeholder="Search frameworks…" />{query && <Button size="icon-sm" variant="ghost" className="absolute right-1 top-1" aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></Button>}</div>
    </div>
    <div className="paper-filters mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter frameworks by category">
      {categories.map((item) => <Button key={item} variant={category === item ? "default" : "ghost"} className={category === item ? "h-9 bg-primary text-white shadow-none" : "h-9 text-muted-foreground"} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</Button>)}
    </div>
    <BrowserEditingNotice directory />
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((framework) => <Link key={framework.id} href={`/frameworks/${framework.id}`} aria-label={framework.name} className="framework-card group flex min-h-[280px] flex-col p-7 focus-visible:outline-offset-4">
        <FrameworkSketch id={framework.id} />
        <h3 className="text-lg font-semibold tracking-tight">{framework.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{framework.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-6 text-xs text-muted-foreground paper-card-footer"><span>{framework.category}</span></div>
      </Link>)}
      {filtered.length === 0 && <div className="col-span-full rounded-xl bg-secondary px-5 py-14 text-center"><Search size={22} className="mx-auto mb-3 text-muted-foreground" /><h3 className="font-semibold">No frameworks found</h3><Button variant="outline" className="mt-5" onClick={() => { setQuery(""); setCategory("All frameworks"); }}>Clear filters</Button></div>}
    </div>
    <p className="sr-only" role="status" aria-live="polite">Showing {filtered.length} of {frameworks.length} frameworks</p>
  </section>;
}
