import type { MetadataRoute } from "next";
import { frameworks } from "@/lib/frameworks";
import { siteUrl } from "@/lib/site-url";
export default function sitemap(): MetadataRoute.Sitemap { const base = siteUrl(); return [{ url: base, priority: 1 }, ...frameworks.map((f) => ({ url: `${base}/frameworks/${f.id}`, priority: 0.8 }))]; }
