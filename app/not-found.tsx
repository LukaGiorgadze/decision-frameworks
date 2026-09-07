import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main id="main" className="site-shell py-20"><p className="eyebrow mb-3">Page not found</p><h1 className="text-3xl font-semibold tracking-tight">Let’s find the right framework.</h1><p className="mt-4 text-muted-foreground">This page is not in the library. Browse the available templates to get started.</p><Button asChild className="mt-7"><Link href="/">Back to all frameworks</Link></Button></main>; }
