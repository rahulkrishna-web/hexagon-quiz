"use client";

import { useEffect, useState } from "react";
import { category, keyOpportunities, primaryBarrier, priority, score, type Answers } from "@/lib/assessment";
import "./results.css";

const RING_R = 114;
const RING_C = 2 * Math.PI * RING_R;

const pad = (n: number) => String(n).padStart(2, "0");

export default function Results({ answers, resultId }: { answers: Answers; resultId: string }) {
  const total = score(answers);
  const cat = category(total);
  const opportunities = keyOpportunities(answers);
  const prio = priority(answers);
  const barrier = primaryBarrier(answers);

  // Captured once on mount so the date stays stable across re-renders.
  const [date] = useState(() =>
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
  );

  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(total));
    return () => cancelAnimationFrame(id);
  }, [total]);

  return (
    <main className="rp-page">
      <div className="rp-container">
        <p className="rp-eyebrow">Assessment complete</p>
        <h1 className="rp-title">Real-Time Customer Report</h1>
        <p className="rp-subtitle">Your Manufacturing Automation Readiness</p>

        <div className="rp-progressLabels">
          <span className="rp-progressCount">10 of 10 questions answered</span>
          <span className="rp-progressMeta">Report generated</span>
        </div>
        <div className="rp-track" />

        <section className="rp-scoreCard">
          <div className="rp-ring">
            <svg viewBox="0 0 250 250" aria-hidden>
              <circle cx="125" cy="125" r={RING_R} className="rp-ringTrack" />
              <circle
                cx="125"
                cy="125"
                r={RING_R}
                className="rp-ringValue"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - shown / 100)}
              />
            </svg>
            <div className="rp-ringLabel">
              <span className="rp-score">{total}</span>
              <span className="rp-outOf">Out of 100</span>
            </div>
          </div>
          <div>
            <span className="rp-pill">{cat.badge}</span>
            <h2 className="rp-category">{cat.name}</h2>
            <p className="rp-summary">{cat.summary}</p>
          </div>
        </section>

        <div className="rp-sectionHead">
          <h3 className="rp-label">Key Opportunities</h3>
          <span className="rp-assessmentId">Assessment ID · MARA-{resultId.toUpperCase()}</span>
        </div>
        <div className="rp-opportunities">
          {opportunities.map((o, i) => (
            <article key={o.title} className="rp-opportunity">
              <h4 className="rp-oppTitle">
                <span>{pad(i + 1)}</span>
                {o.title}
              </h4>
              <div className="rp-oppBody">
                <p>{o.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="rp-cards">
          <article className="rp-card">
            <div className="rp-cardHead">
              <h3 className="rp-label">Automation Priority</h3>
              <span className="rp-cardIcon" aria-hidden>
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <path d="M16 4.5 29 27H3L16 4.5Z" />
                  <path d="M16 13v7" strokeLinecap="round" />
                  <circle cx="16" cy="23.4" r="0.6" fill="currentColor" />
                </svg>
              </span>
            </div>
            <p className="rp-cardTitle">{prio.title}</p>
            <p className="rp-cardBody">{prio.body}</p>
          </article>

          <article className="rp-card">
            <div className="rp-cardHead">
              <h3 className="rp-label">Your Primary Barrier</h3>
              <span className="rp-cardIcon" aria-hidden>
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
                  <rect x="3.5" y="9" width="25" height="7" />
                  <path d="M8.5 9 3.5 16M15 9l-5 7M21.5 9l-5 7M28 9.5 23 16" />
                  <path d="M7 16v10M25 16v10M7 6v3M25 6v3M4.5 26h5M22.5 26h5" />
                </svg>
              </span>
            </div>
            <p className="rp-cardTitle">{barrier.title}</p>
            <p className="rp-cardBody">{barrier.body}</p>
          </article>
        </div>

        <section className="rp-next">
          <h3 className="rp-label">Recommended Next Step</h3>
          <p className="rp-nextTitle">{cat.nextStep}</p>
          <a className="rp-cta" href="#">
            <span>Explore Automation Opportunities</span>
            <span className="rp-ctaIcon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M2 12h19.5M13.5 4l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </section>

        <footer className="rp-footer">
          <span>Generated {date} · Manufacturing Automation Readiness Assessment</span>
          <span>Your responses are confidential</span>
        </footer>
      </div>
    </main>
  );
}
