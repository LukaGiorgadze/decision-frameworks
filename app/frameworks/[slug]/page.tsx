import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { frameworks, getFramework } from "@/lib/frameworks";
import { siteUrl } from "@/lib/site-url";
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
  return <main id="main" className="site-shell paper-sheet">
    <h1 className="sr-only print:not-sr-only">{framework.name}</h1>
    <BrowserEditingNotice />
    <Worksheet key={framework.id} framework={framework} />
    <details className="no-print my-8 pt-5 text-sm"><summary className="cursor-pointer text-muted-foreground">How to use this framework</summary>
      <div className="mt-5 max-w-3xl space-y-5 leading-6">
        <ol className="list-decimal space-y-2 pl-5">{framework.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
        <div className="rounded-lg bg-secondary p-5"><h2 className="font-semibold">Example</h2><p className="mt-2">{framework.example.situation}</p><ul className="example-list list-disc pl-5 text-muted-foreground">{framework.example.entries.map((entry) => <li key={entry}>{entry}</li>)}</ul><p className="mt-3">{framework.example.takeaway}</p></div>
        <p className="text-muted-foreground">{framework.limitation}</p>
        <a href={framework.source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">{framework.source.title}<ExternalLink size={12} /><span className="sr-only"> (opens in a new tab)</span></a>
      </div>
    </details>
  </main>;
}
