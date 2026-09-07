import Link from "next/link";
import { PanelsTopLeft } from "lucide-react";

export function SiteHeader() {
  return <header className="border-b border-border">
    <div className="site-shell flex h-[76px] items-center justify-between gap-6">
      <Link href="/" className="flex items-center gap-2.5 text-[16px] font-semibold tracking-tight" aria-label="Decision Frameworks home">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-white"><PanelsTopLeft size={18} strokeWidth={1.7} /></span>
        <span>Decision<span className="font-normal text-muted-foreground"> Frameworks</span></span>
      </Link>
      <Link href="/" className="hidden text-sm font-medium text-primary sm:block">Framework library</Link>
    </div>
  </header>;
}
