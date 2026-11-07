"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import HexIcon from "./HexIcon";
import { category, keyOpportunities, primaryBarrier, priority, score, type Answers } from "@/lib/assessment";
import "./results.css";

const RING_R = 140.5;
const RING_C = 2 * Math.PI * RING_R;
const COUNT_MS = 1600;

const pad = (n: number) => String(n).padStart(2, "0");

export default function Results({ answers }: { answers: Answers }) {
  const total = score(answers);
  const cat = category(total, answers);
  const opportunities = keyOpportunities(answers);
  const prio = priority(answers);
  const barrier = primaryBarrier(answers);

  // Captured once on mount so the date stays stable across re-renders.
  const [date] = useState(() =>
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
  );

  // Always open the report at the top, whatever the quiz scroll position was.
  // Repeated on the next frame to win over late scroll anchoring / smooth scrolls.
  useLayoutEffect(() => {
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    const id = requestAnimationFrame(toTop);
    return () => cancelAnimationFrame(id);
  }, []);

  // "Request a consultation": show the thank-you note and let the landing page (parent window) know,
  // so it can pass the request on to Hexagon's sales team.
  const [discussed, setDiscussed] = useState(false);
  const discuss = () => {
    setDiscussed(true);
    try {
      window.parent?.postMessage(
        { type: "hx-quiz-discuss", score: total, category: cat.name, barrier: barrier.title, priority: prio.title },
        "*",
      );
    } catch {}
  };

  // One tween drives both the ring and the count-up number so they stay in sync.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(total));
      return () => cancelAnimationFrame(id);
    }
    let id = 0;
    let start: number | undefined;
    const tick = (now: number) => {
      start ??= now;
      const t = Math.min((now - start) / COUNT_MS, 1);
      setShown(total * (1 - (1 - t) ** 5)); // easeOutQuint
      if (t < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [total]);

  return (
    <main className="rp-page">
      <Image
        className="rp-hero"
        src="/results/hero.png"
        alt=""
        width={1281}
        height={402}
        loading="eager"
        fetchPriority="high"
      />
      <div className="rp-container">
        <p className="rp-eyebrow">Assessment complete</p>
        <h1 className="rp-title">
          Your manufacturing
          <br /> automation readiness
        </h1>

        <div className="rp-overview">
          <div>
            <div className="rp-progressLabels">
              <span className="rp-progressCount">10 of 10 questions answered</span>
              <span className="rp-progressMeta">Report generated</span>
            </div>
            <div className="rp-track" />

            <section className="rp-scoreCard">
              <div className="rp-ring">
                <svg viewBox="0 0 310 310" aria-hidden>
                  <circle cx="155" cy="155" r={RING_R} className="rp-ringTrack" />
                  <circle
                    cx="155"
                    cy="155"
                    r={RING_R}
                    className="rp-ringValue"
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_C * (1 - shown / 100)}
                  />
                </svg>
                <div className="rp-ringLabel">
                  <span className="rp-score">{Math.round(shown)}</span>
                  <span className="rp-outOf">Out of 100</span>
                </div>
              </div>
              <span className="rp-pill">{cat.badge}</span>
              <h2 className="rp-category">{cat.name}</h2>
              <p className="rp-summary">{cat.summary}</p>
              {discussed ? (
                <div className="rp-thanks" role="status">
                  <p className="rp-thanksTitle">Thank you for completing the assessment!</p>
                  <p className="rp-thanksBody">Our team will review your responses and get in touch with you shortly.</p>
                </div>
              ) : (
                <button type="button" className="rp-discuss" onClick={discuss}>
                  <span>Request a consultation</span>
                  <span className="rp-discussIcon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M2 12h19.5M13.5 4l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              )}
            </section>
          </div>

          <section>
            <h3 className="rp-label">Your key opportunities</h3>
            <div className="rp-opportunities">
              {opportunities.map((o, i) => (
                <article key={o.title} className="rp-opportunity">
                  <div>
                    <h4 className="rp-oppTitle">
                      <span>{pad(i + 1)}.</span>
                      {o.title}
                    </h4>
                    <p className="rp-oppBody">{o.body}</p>
                  </div>
                  <HexIcon index={i} className="rp-oppIcon" />
                </article>
              ))}
            </div>
          </section>
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
            <Image className="rp-cardImage" src="/results/priority.jpg" alt="" width={1330} height={840} />
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
            <Image className="rp-cardImage" src="/results/barrier.jpg" alt="" width={1280} height={808} />
          </article>
        </div>

        <section className="rp-next">
          <h3 className="rp-label">Recommended Next Step</h3>
          <p className="rp-nextTitle">{cat.nextStep}</p>
          <p className="rp-nextBody">{cat.nextBody}</p>
          <a className="rp-cta" href="#">
            <span>Explore automation opportunities</span>
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
