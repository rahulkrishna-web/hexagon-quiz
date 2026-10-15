"use client";

import { useEffect, useRef } from "react";

/*
 * The three animated "Hex Shape" icons from hexagon.com's icon banner, inlined
 * so their stroke animation can be started when they scroll into view.
 */

const GREY = "#595C65";
const SW = 2.84706;

const BOTTOM = "M54.5 122.344V92.4844H108.219L54.5 122.344Z";
const SQUARE = "M54.7617 61.957L108.5 31.457V92.457H54.7617V61.957Z";
const SMALL = "M2 92.137V31.457L37 92.137H2Z";
const BIG = "M54.6706 1.45703L2 31.3511L54.6706 122.457V1.45703Z";

type Variant = {
  shapes: { d: string; sw?: number }[];
  /** Full-length path drawn underneath the animated dash. */
  under: { d: string; color: string; sw?: number };
  /** Dashed path whose offset animates from → to. */
  over: { d: string; color: string; sw?: number; len: number; from: number; to: number };
  delay: number;
};

const VARIANTS: Variant[] = [
  // Blue big triangle: a grey dash slides off to reveal it.
  {
    shapes: [{ d: BOTTOM }, { d: SQUARE }, { d: SMALL, sw: 2.90476 }],
    under: { d: BIG, color: "#01ADFF" },
    over: { d: BIG, color: GREY, len: 370, from: 0, to: 370 },
    delay: 0,
  },
  // Cyan small triangle draws in.
  {
    shapes: [{ d: BOTTOM }, { d: SQUARE }, { d: BIG }],
    under: { d: SMALL, color: GREY, sw: 2.90476 },
    over: { d: "M2 31.457L37 92.137V92.137H2Z", color: "#7DFFFC", sw: 2.90476, len: 370, from: 370, to: 0 },
    delay: 0.7,
  },
  // Lime square draws in.
  {
    shapes: [{ d: BOTTOM }, { d: SMALL }, { d: BIG }],
    under: { d: SQUARE, color: GREY, sw: 2.96 },
    over: { d: SQUARE, color: "#DFF73F", sw: 2.96, len: 360, from: 360, to: 0 },
    delay: 1.1,
  },
];

export default function HexIcon({ index, className }: { index: number; className?: string }) {
  const v = VARIANTS[index % VARIANTS.length];
  const ref = useRef<SVGAnimateElement>(null);

  useEffect(() => {
    const anim = ref.current;
    const svg = anim?.ownerSVGElement;
    if (!anim || !svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      anim.parentElement?.setAttribute("stroke-dashoffset", String(v.over.to));
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        anim.beginElementAt(v.delay);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, [v]);

  return (
    <svg className={className} viewBox="0 0 110 124" fill="none" strokeLinejoin="round" aria-hidden>
      {v.shapes.map((s) => (
        <path key={s.d} d={s.d} stroke={GREY} strokeWidth={s.sw ?? SW} />
      ))}
      <path d={v.under.d} stroke={v.under.color} strokeWidth={v.under.sw ?? SW} />
      <path
        d={v.over.d}
        stroke={v.over.color}
        strokeWidth={v.over.sw ?? SW}
        strokeLinecap="round"
        strokeDasharray={v.over.len}
        strokeDashoffset={v.over.from}
      >
        <animate
          ref={ref}
          attributeName="stroke-dashoffset"
          from={v.over.from}
          to={v.over.to}
          dur="1.2s"
          begin="indefinite"
          fill="freeze"
        />
      </path>
    </svg>
  );
}
