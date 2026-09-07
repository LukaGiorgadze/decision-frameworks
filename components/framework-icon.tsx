import { Grid2X2, Scale, ListOrdered, GitCompareArrows, Telescope, ShieldCheck } from "lucide-react";
import type { FrameworkId } from "@/lib/frameworks";
const icons = { "eisenhower-matrix": Grid2X2, "cost-benefit-analysis": Scale, "weighted-scoring": GitCompareArrows, "rice-scoring": ListOrdered, "ten-ten-ten": Telescope, "pre-mortem-analysis": ShieldCheck };
export function FrameworkIcon({ id, size = 20 }: { id: FrameworkId; size?: number }) { const Icon = icons[id]; return <Icon size={size} strokeWidth={1.65} aria-hidden="true" />; }
