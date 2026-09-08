import type { FrameworkId } from "@/lib/frameworks";

const drawings: Record<FrameworkId, React.ReactNode> = {
  "ten-ten-ten": <>
    <path d="M24 72 Q120 69 258 72 M247 65l12 7-12 7" />
    {[52, 139, 226].map((x, i) => <g key={x}><ellipse cx={x} cy="45" rx="20" ry="21" /><path d={`M${x} 31v15l${[9, -10, 9][i]} ${[6, 6, -10][i]}`} /><path d={`M${x} 68v9`} /></g>)}
    <text x="34" y="100">10 min</text><text x="114" y="100">10 months</text><text x="207" y="100">10 years</text>
  </>,
  "cost-benefit-analysis": <>
    <path d="M143 22l-1 77 M119 103q23-10 48 0 M78 37q58-13 131-4 M83 37l-24 41 49 1-25-42 M199 35l-24 40 48 1-24-41 M58 79q25 26 51 0 M174 77q25 27 50-1" />
    <circle cx="142" cy="25" r="5" /><path d="M74 86l10 8m-6-10 12 10 M190 84l9 9m-4-12 13 10" />
    <text x="39" y="26">costs</text><text x="199" y="23">benefits</text>
  </>,
  "eisenhower-matrix": <>
    <path d="M65 20l155 2-2 89-155-2 2-89 M142 22l-1 87 M64 65l155 1 M83 42l8 8 15-18 M174 42h21m-10-10 1 23 M82 86l25 1m-8-7 8 7-8 7 M177 82l18 15m-18 0 17-15" />
    <path opacity=".35" d="M67 17l151 3 M61 23l-1 86 M78 35l-5 19m9-21-5 23" />
  </>,
  "weighted-scoring": <>
    <path d="M40 24l202-1-1 87-201 1 0-88 M41 46l200 1 M41 69l201-1 M41 90l200 1 M116 24l-1 85 M157 24l-1 85 M199 24l-1 84" />
    <path d="M54 35l44 1 M54 58l35-1 M54 80l43 0 M54 101l29-1" />
    <text x="129" y="62">4</text><text x="171" y="62">5</text><text x="213" y="62">3</text><text x="129" y="85">3</text><text x="171" y="85">4</text><text x="213" y="85">5</text><text x="129" y="106">5</text><text x="171" y="106">3</text><text x="213" y="106">4</text>
  </>,
  "rice-scoring": <>
    <path d="M48 18l1 88 202-1 M72 102l1-36 32 1-1 36 M129 103l1-59 31 1-1 58 M186 103l1-82 33 1-1 80 M73 50l56-24 42-8m-10-4 10 4-6 10" />
    <path opacity=".4" d="M78 72l20 24m-20-14 14 16 M136 51l18 24m-18-13 18 25m-18-12 17 23 M193 28l20 25m-20-13 20 26m-20-13 20 26m-20-14 20 26m-20-12 15 21" />
  </>,
  "pre-mortem-analysis": <>
    <path d="M138 16l-46 83 97 1-51-84 M137 45l1 25 M137 80l1 2 M41 98l26-26 14 8 M198 72l17-15 25 23 M63 33l17 8m-5-21 8 12 M201 28l-16 10m21 9-18-2" />
    <path opacity=".35" d="M133 23l-44 77 98 3 M99 87l5 8m0-17 8 17m-1-29 15 28" />
  </>,
};

export function FrameworkSketch({ id }: { id: FrameworkId }) {
  return <svg className="framework-sketch" viewBox="0 0 280 125" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[id]}</svg>;
}
