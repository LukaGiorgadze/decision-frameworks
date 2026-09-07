import { LockKeyhole } from "lucide-react";
import { FrameworkCatalog } from "@/components/framework-catalog";

export default function Home() {
  return <main id="main" className="site-shell pt-12 sm:pt-16">
    <p className="eyebrow mb-3">The framework library</p>
    <h1 className="text-3xl sm:text-[40px] font-semibold leading-tight tracking-[-.045em]">Make room for a clearer decision.</h1>
    <p className="mt-4 max-w-[650px] text-base leading-7 text-muted-foreground">A small collection of practical frameworks to organize your thoughts,<br className="hidden sm:block" /> weigh your options, and decide what comes next.</p>
    <FrameworkCatalog />
    <div className="mt-6 flex items-center gap-2 text-[13px] text-muted-foreground"><LockKeyhole size={14} /><span>No account needed. Your work stays in your browser.</span></div>
  </main>;
}
