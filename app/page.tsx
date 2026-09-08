import { FrameworkCatalog } from "@/components/framework-catalog";

export default function Home() {
  return <main id="main" className="site-shell paper-catalog">
    <h1 className="sr-only">Decision frameworks</h1>
    <FrameworkCatalog />
  </main>;
}
