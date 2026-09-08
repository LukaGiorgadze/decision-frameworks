import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const handwriting = localFont({ src: "../public/fonts/patrick-hand.ttf", variable: "--font-hand", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Decision Frameworks — A little structure. A clearer decision.", template: "%s | Decision Frameworks" },
  description: "Practical decision-making templates. Compare options, prioritize tasks, and think through your next step. Free to use, with drafts saved in your browser.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={handwriting.variable}><body>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-3">Skip to content</a>
    {children}

  </body></html>;
}
