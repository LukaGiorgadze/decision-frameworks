import Link from "next/link";
import { Files } from "lucide-react";

export function SiteHeader() {
  return <header>
    <div className="site-shell flex h-16 items-center justify-between gap-6">
      <Link href="/" className="paper-brand flex items-center gap-2.5 text-[16px] font-semibold tracking-tight" aria-label="Decision Frameworks home">
        <span className="flex size-8 items-center justify-center text-primary"><Files size={18} strokeWidth={1.7} /></span>
        <span>Decision<span className="font-normal text-muted-foreground"> Frameworks</span></span>
      </Link>
      <Link href="/" className="hidden text-sm font-medium text-primary sm:block">Frameworks</Link>
    </div>
  </header>;
}
