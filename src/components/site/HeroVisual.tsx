import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

const FLOW = [
  "Business",
  "Digital Presence",
  "Visibility",
  "Visitors",
  "Leads",
  "Customers",
  "Revenue",
  "Growth",
];

function Fallback2D({ label = "Loading your digital ecosystem…" }: { label?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-border aurora">
      <div className="absolute inset-0 grid-backdrop opacity-60" aria-hidden="true" />
      <svg viewBox="0 0 400 400" className="h-full w-full max-h-[420px]" role="img" aria-label={label}>
        <defs>
          <radialGradient id="dd-core" cx="50%" cy="50%">
            <stop offset="0%" stopColor="oklch(0.9 0.12 200)" />
            <stop offset="100%" stopColor="oklch(0.5 0.12 260)" />
          </radialGradient>
        </defs>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = 200 + Math.cos(angle) * 135;
          const y = 200 + Math.sin(angle) * 135;
          return (
            <g key={i}>
              <line
                x1={200}
                y1={200}
                x2={x}
                y2={y}
                stroke="oklch(0.79 0.15 205 / 45%)"
                strokeWidth="1.2"
                strokeDasharray="6 8"
                style={{ animation: `dd-pulse-line 3.2s ${i * 0.25}s linear infinite` }}
              />
              <circle cx={x} cy={y} r="9" fill="oklch(0.79 0.15 205 / 85%)" />
            </g>
          );
        })}
        <circle cx="200" cy="200" r="42" fill="url(#dd-core)" opacity="0.9" />
        <rect x="176" y="188" width="48" height="26" rx="4" fill="oklch(0.16 0.02 264)" />
      </svg>
      <p className="absolute bottom-4 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function SceneGate() {
  const [state, setState] = useState<"checking" | "on" | "off">("checking");
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.matchMedia("(max-width: 900px)").matches;
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    setCompact(smallScreen || lowCores);
    if (reduced || !supportsWebGL()) {
      setState("off");
      return;
    }
    setState("on");
  }, []);

  if (state !== "on") {
    return <Fallback2D label={state === "checking" ? "Preparing visual…" : "Digital growth ecosystem"} />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border">
      <Suspense fallback={<Fallback2D />}>
        <HeroScene compact={compact} />
      </Suspense>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-1.5 bg-gradient-to-t from-background to-transparent p-4">
        {FLOW.map((step, i) => (
          <span key={step} className="chip !py-1 !text-[10px]">
            {i > 0 && <span aria-hidden="true">→</span>}
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div className="h-[340px] w-full sm:h-[420px] lg:h-[520px]">
      <ClientOnly fallback={<Fallback2D label="Digital growth ecosystem" />}>
        <SceneGate />
      </ClientOnly>
    </div>
  );
}
