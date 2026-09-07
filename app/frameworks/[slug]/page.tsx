import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { frameworks, getFramework } from "@/lib/frameworks";
import { siteUrl } from "@/lib/site-url";
import { FrameworkIcon } from "@/components/framework-icon";
import { Worksheet } from "@/components/worksheet";
import { BrowserEditingNotice } from "@/components/browser-editing-notice";

export const dynamicParams = false;
export function generateStaticParams() { return frameworks.map((f) => ({ slug: f.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const framework = getFramework(slug);
  if (!framework) return { title: "Framework not found" };
  return { title: `${framework.name} Template`, description: `${framework.description} Fill in a free ${framework.format.toLowerCase()} with clear guidance and automatic browser saving.`, alternates: { canonical: `${siteUrl()}/frameworks/${framework.id}` } };
}
export default async function FrameworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const framework = getFramework(slug);
  if (!framework) notFound();
  return <main id="main" className="site-shell pt-7 sm:pt-9">
    <Link href="/" className="no-print inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={15} />All frameworks</Link>
    <div className="mt-7 flex items-start gap-4"><span className="no-print mt-1 flex size-12 shrink-0 items-center justify-center rounded-lg border bg-secondary text-primary"><FrameworkIcon id={framework.id} size={23} /></span><div><p className="eyebrow mb-2 no-print">{framework.category} <span className="px-1 font-normal">/</span> {framework.format}</p><h1 className="text-[28px] font-semibold leading-tight tracking-[-.04em] sm:text-4xl">{framework.name}</h1><p className="mt-3 text-base text-muted-foreground no-print">{framework.description}</p></div></div>
    <ol className="no-print mt-7 grid gap-4 rounded-lg border bg-secondary/55 p-5 md:grid-cols-3">{framework.instructions.map((instruction, i) => <li key={instruction} className="flex items-start gap-3 text-sm leading-6"><span className="number mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border bg-white text-[11px] text-primary">{i + 1}</span><span>{instruction}</span></li>)}</ol>
    <BrowserEditingNotice />
    <Worksheet key={framework.id} framework={framework} />
    <section className="no-print mt-10 border-t pt-7"><details className="group"><summary className="cursor-pointer text-base font-semibold">See a worked example</summary><div className="mt-5 max-w-3xl rounded-lg border bg-secondary/40 p-5 sm:p-6"><h2 className="font-medium">{framework.example.situation}</h2><ul className="example-list list-disc pl-5 text-sm leading-6 text-muted-foreground">{framework.example.entries.map((entry) => <li key={entry}>{entry}</li>)}</ul><p className="mt-5 border-t pt-4 text-sm leading-6">{framework.example.takeaway}</p><p className="mt-3 text-xs text-muted-foreground">Illustrative example. Your worksheet stays unchanged.</p></div></details>
      <div className="mt-7 max-w-3xl"><h2 className="text-sm font-semibold">Keep in mind</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{framework.limitation}</p><a href={framework.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary underline-offset-4 hover:underline">Learn about the method: {framework.source.title}<ExternalLink size={12} /><span className="sr-only"> (opens in a new tab)</span></a></div>
    </section>
  </main>;
}
