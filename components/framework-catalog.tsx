"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, frameworks, type Category } from "@/lib/frameworks";
import { savedDraftIds } from "@/lib/draft-store";
import { FrameworkIcon } from "./framework-icon";
import { BrowserEditingNotice } from "./browser-editing-notice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback); window.addEventListener("focus", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("focus", callback); };
};
const getSaved = () => { try { return JSON.stringify(savedDraftIds(window.localStorage, frameworks.map((f) => f.id))); } catch { return "[]"; } };
const getServerSaved = () => "[]";

export function FrameworkCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All frameworks");
  const saved: string[] = JSON.parse(useSyncExternalStore(subscribe, getSaved, getServerSaved));
  const normalized = query.toLowerCase().trim().replaceAll("–", "-");
  const filtered = frameworks.filter((f) => (category === "All frameworks" || f.category === category) && `${f.name} ${f.description} ${f.category}`.toLowerCase().replaceAll("–", "-").includes(normalized));
  return <section className="mt-10" aria-label="Framework directory">
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <h2 className="section-title">Find a framework <span className="ml-2 rounded border px-1.5 py-0.5 align-middle text-xs font-normal text-muted-foreground">06</span></h2>
      <div className="relative sm:w-[290px]"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" aria-hidden="true" /><Input className="h-10 pl-10 pr-10 text-sm shadow-none" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search frameworks" placeholder="Search frameworks…" />{query && <Button size="icon-sm" variant="ghost" className="absolute right-1 top-1" aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></Button>}</div>
    </div>
    <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter frameworks by category">
      {categories.map((item) => <Button key={item} variant={category === item ? "default" : "ghost"} className={category === item ? "h-9 bg-primary text-white shadow-none" : "h-9 text-muted-foreground"} aria-pressed={category === item} onClick={() => setCategory(item)}>{item === "All frameworks" && <SlidersHorizontal size={14} />}{item}</Button>)}
    </div>
    <BrowserEditingNotice directory />
    <div className="overflow-hidden rounded-lg border">
      <Table className="catalog-table">
        <TableHeader className="hidden bg-secondary/70 md:table-header-group"><TableRow className="hover:bg-transparent"><TableHead className="w-[34%] py-3 pl-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Framework</TableHead><TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Use this when…</TableHead><TableHead className="w-[155px] text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</TableHead><TableHead className="w-14"><span className="sr-only">Open template</span></TableHead></TableRow></TableHeader>
        <TableBody>{filtered.map((framework) => <TableRow key={framework.id} className="group relative grid grid-cols-[1fr_auto] gap-x-3 px-4 py-5 hover:bg-secondary/40 md:table-row md:p-0">
          <TableCell className="col-span-2 border-0 p-0 md:py-6 md:pl-5 md:pr-4"><div className="flex items-center gap-3.5"><span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-[#e0e6ef] bg-[#f5f7fb] text-primary"><FrameworkIcon id={framework.id} /></span><div><Link className="text-[15px] font-semibold tracking-tight hover:text-primary focus-visible:outline-offset-2" href={`/frameworks/${framework.id}`}>{framework.name}</Link><p className="mt-1 text-xs text-muted-foreground">{framework.format}{saved.includes(framework.id) && <span className="ml-2 text-primary">· Draft saved</span>}</p></div></div></TableCell>
          <TableCell className="col-span-2 mt-3 whitespace-normal border-0 p-0 text-sm leading-6 text-muted-foreground md:m-0 md:max-w-[320px] md:px-4 md:py-5">{framework.description}</TableCell>
          <TableCell className="mt-3 border-0 p-0 md:m-0 md:px-4 md:py-5"><span className="inline-flex rounded border bg-white px-2 py-0.5 text-xs text-muted-foreground">{framework.category}</span></TableCell>
          <TableCell className="mt-3 border-0 p-0 text-right md:m-0 md:py-5 md:pr-4"><Button variant="ghost" size="icon-sm" asChild><Link href={`/frameworks/${framework.id}`} aria-label={`Open ${framework.name} template`}><ArrowUpRight size={17} className="text-muted-foreground" /></Link></Button></TableCell>
        </TableRow>)}</TableBody>
      </Table>
      {filtered.length === 0 && <div className="px-5 py-14 text-center"><Search size={22} className="mx-auto mb-3 text-muted-foreground" /><h3 className="font-semibold">No frameworks found</h3><p className="mt-1 text-sm text-muted-foreground">Try another search or choose a different category.</p><Button variant="outline" className="mt-5" onClick={() => { setQuery(""); setCategory("All frameworks"); }}>Clear filters</Button></div>}
    </div>
    <p className="mt-3 text-xs text-muted-foreground" role="status" aria-live="polite">Showing {filtered.length} of {frameworks.length} frameworks</p>
  </section>;
}
