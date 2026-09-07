export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (!configured) return "http://localhost:3000";
  const url = new URL(configured.startsWith("http") ? configured : `https://${configured}`);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("The site URL must use HTTP or HTTPS.");
  return url.origin;
}
