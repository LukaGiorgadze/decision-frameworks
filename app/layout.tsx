import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Decision Frameworks — A little structure. A clearer decision.", template: "%s | Decision Frameworks" },
  description: "Practical decision-making templates. Compare options, prioritize tasks, and think through your next step. Free to use, with drafts saved in your browser.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
    <SiteHeader />
    {children}
    <footer className="site-shell mt-16 pb-8 no-print"><div className="flex flex-wrap justify-between gap-3 border-t pt-6 text-[13px] text-muted-foreground"><p>A little structure. A clearer decision.</p><p>Made for thinking things through.</p></div></footer>
  </body></html>;
}
