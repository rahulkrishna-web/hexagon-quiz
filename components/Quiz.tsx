"use client";

import { useState } from "react";
import { QUESTIONS, OTHER_INDEX, countAnswered, type Answers, type Question } from "@/lib/assessment";
import "./quiz.css";

const LETTERS = "ABCDEFG";
const pad = (n: number) => String(n).padStart(2, "0");

function FlowArrow({ first }: { first?: boolean }) {
  return (
    <svg className={`qz-flowArrow ${first ? "qz-flowArrowFirst" : ""}`} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M1.5 8h12.5M8.5 2.5 14 8l-5.5 5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  answers: Answers;
  onChange: (a: Answers) => void;
  onSubmit: () => void;
};

export default function Quiz({ answers, onChange, onSubmit }: Props) {
  const [missing, setMissing] = useState<number | null>(null);
  const answered = countAnswered(answers);

  const isAnswered = (q: Question) => (q.multi ? answers.barriers.length > 0 : q.id in answers.single);

  const pick = (q: Question, i: number) => {
    if (missing === q.id) setMissing(null);
    if (!q.multi) return onChange({ ...answers, single: { ...answers.single, [q.id]: i } });
    const has = answers.barriers.includes(i);
    onChange({ ...answers, barriers: has ? answers.barriers.filter((b) => b !== i) : [...answers.barriers, i] });
  };

  const setOther = (text: string) => {
    const barriers =
      text.trim() && !answers.barriers.includes(OTHER_INDEX) ? [...answers.barriers, OTHER_INDEX] : answers.barriers;
    onChange({ ...answers, otherText: text, barriers });
  };

  const submit = () => {
    const first = QUESTIONS.find((q) => !isAnswered(q));
    if (!first) return onSubmit();
    setMissing(first.id);
    document.getElementById(`q${first.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="qz-page">
      <div className="qz-container">
        <header>
          <p className="qz-eyebrow">Assessment in-progress</p>
          <h1 className="qz-title">Manufacturing Automation Readiness Assessment</h1>
          <p className="qz-lead">
            The Manufacturing Automation Readiness Assessment is designed to help manufacturers understand how ready
            their manufacturing operation is for automation.
          </p>
          <p className="qz-lead">
            The assessment looks beyond individual machines or processes and evaluates the broader factors that
            influence successful automation — including productivity, process consistency, digitalisation, data,
            workforce dependency and investment readiness
          </p>
          <p className="qz-flow">
            Answer 10 questions <FlowArrow /> Get your Automation Readiness Score <FlowArrow /> Identify your key
            opportunities
            <br />
            <FlowArrow first /> Receive a personalised recommendation
          </p>
        </header>

        <div className="qz-progress">
          <div className="qz-progressLabels">
            <span className="qz-progressCount">Question {pad(Math.max(answered, 1))} of 10</span>
            <span className="qz-progressPct">{answered * 10}% Completed</span>
          </div>
          <div className="qz-track">
            <div className="qz-fill" style={{ width: `${answered * 10}%` }} />
          </div>
        </div>

        {QUESTIONS.map((q) => (
          <section key={q.id} id={`q${q.id}`} className="qz-question">
            <div className="qz-qHead">
              <span className="qz-qNum">{pad(q.id)}</span>
              <div>
                <h2 className="qz-qText">{q.text}</h2>
                <p className="qz-measures">Measures: {q.measures}</p>
                {missing === q.id && <p className="qz-missing">Please answer this question to continue.</p>}
              </div>
            </div>

            <div
              role={q.multi ? "group" : "radiogroup"}
              aria-label={q.text}
              className="qz-options"
              data-cols={q.multi ? 2 : q.options.length}
            >
              {q.options.map((o, i) => {
                const checked = q.multi ? answers.barriers.includes(i) : answers.single[q.id] === i;
                const isOther = q.multi && i === OTHER_INDEX;
                return (
                  <div key={i} className={`qz-option ${isOther ? "qz-optionOther" : ""}`} data-checked={checked}>
                    <label className="qz-optionLabel">
                      <input
                        className="qz-input"
                        type={q.multi ? "checkbox" : "radio"}
                        name={`q${q.id}`}
                        checked={checked}
                        onChange={() => pick(q, i)}
                      />
                      <span className="qz-mark" data-type={q.multi ? "checkbox" : "radio"} aria-hidden>
                        {q.multi && (
                          <svg viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6.2 4.9 8.5 9.5 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="qz-letter">{LETTERS[i]}</span>
                      <span className="qz-optText">{o.label}</span>
                    </label>
                    {isOther && (
                      <input
                        className="qz-otherInput"
                        type="text"
                        aria-label="Other barrier"
                        value={answers.otherText}
                        onChange={(e) => setOther(e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <button type="button" className="qz-submit" onClick={submit}>
          <span>View My Readiness Report</span>
          <span className="qz-submitIcon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M2 12h19.5M13.5 4l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </main>
  );
}
