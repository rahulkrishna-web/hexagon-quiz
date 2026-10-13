export type Option = { label: string; points: number };

export type Question = {
  id: number;
  text: string;
  measures: string;
  options: Option[];
  multi?: boolean;
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How consistently does your manufacturing operation deliver the same quality results, regardless of who performs the task or when?",
    measures: "Process consistency and standardisation",
    options: [
      { label: "Yes - Consistently", points: 10 },
      { label: "Partly — Some variation", points: 5 },
      { label: "No — Significant variation", points: 0 },
    ],
  },
  {
    id: 2,
    text: "How automated are your current manufacturing and inspection processes?",
    measures: "Current automation maturity",
    options: [
      { label: "Mostly manual", points: 0 },
      { label: "Partly automated", points: 5 },
      { label: "Highly automated", points: 10 },
      { label: "A combination of manual and automated processes", points: 7 },
    ],
  },
  {
    id: 3,
    text: "How repetitive and high-volume are your manufacturing processes?",
    measures: "Potential for automation",
    options: [
      { label: "Highly repetitive / high volume", points: 10 },
      { label: "A mix of repetitive and low-volume production", points: 6 },
      { label: "Mostly low-volume / customised / one-off", points: 2 },
    ],
  },
  {
    id: 4,
    text: "How effectively is data captured and connected across your manufacturing processes?",
    measures: "Digital maturity",
    options: [
      { label: "Fully digital and connected", points: 15 },
      { label: "Partly digital — some processes are connected", points: 8 },
      { label: "Mostly manual / disconnected", points: 0 },
    ],
  },
  {
    id: 5,
    text: "Are your current manufacturing or inspection processes limiting productivity or throughput?",
    measures: "Business impact and automation opportunity",
    options: [
      { label: "Yes — significantly", points: 15 },
      { label: "Yes — somewhat", points: 8 },
      { label: "No — not currently", points: 0 },
    ],
  },
  {
    id: 6,
    text: "How dependent are your manufacturing processes on skilled personnel?",
    measures: "Workforce dependency and scalability",
    options: [
      { label: "Low dependency — processes are largely automated", points: 10 },
      { label: "Moderate dependency", points: 5 },
      { label: "High dependency — skilled people are critical to operations", points: 0 },
    ],
  },
  {
    id: 7,
    text: "How easily can you access the information you need to make manufacturing decisions?",
    measures: "Data visibility and connected manufacturing maturity",
    options: [
      { label: "Easily — data is available in real time", points: 10 },
      { label: "Partly — data is available but requires manual effort", points: 5 },
      { label: "With difficulty — information is fragmented or delayed", points: 0 },
    ],
  },
  {
    id: 8,
    text: "Do you have a defined plan or investment timeline to automate your manufacturing operation?",
    measures: "Investment readiness",
    options: [
      { label: "Yes — budget and timeline are in place", points: 10 },
      { label: "We have a plan but budget/ timeline is not yet finalised", points: 7 },
      { label: "We are exploring options", points: 4 },
      { label: "No plans at this stage", points: 0 },
    ],
  },
  {
    id: 9,
    text: "How important is it for you to automate your manufacturing operation?",
    measures: "Strategic importance and urgency",
    options: [
      { label: "Critical — we need to act now", points: 10 },
      { label: "Very important — we are actively evaluating options", points: 7 },
      { label: "Important — we see the opportunity but are not ready yet", points: 4 },
      { label: "Not a priority at this time", points: 0 },
    ],
  },
  {
    id: 10,
    text: "What is your biggest barrier to moving forward with automation?",
    measures: "Primary automation barrier",
    multi: true,
    options: [
      { label: "Unclear ROI / business case", points: 0 },
      { label: "Budget", points: 0 },
      { label: "People / skills", points: 0 },
      { label: "Integration with existing systems", points: 0 },
      { label: "Lack of digital infrastructure", points: 0 },
      { label: "Not sure which solution fits", points: 0 },
      { label: "Others", points: 0 },
    ],
  },
];

export const OTHER_INDEX = 6;

/** Single-choice answers for Q1–Q9 (option index), multi-choice for Q10 (in click order). */
export type Answers = {
  single: Record<number, number>;
  barriers: number[];
  otherText: string;
};

export function countAnswered(a: Answers) {
  return Object.keys(a.single).length + (a.barriers.length > 0 ? 1 : 0);
}

const pts = (a: Answers, q: number) => QUESTIONS[q - 1].options[a.single[q]]?.points ?? 0;

export function score(a: Answers) {
  let total = 0;
  for (let q = 1; q <= 9; q++) total += pts(a, q);
  return total;
}

export type Category = {
  name: string;
  badge: string;
  summary: string;
  nextStep: string;
};

export function category(s: number): Category {
  if (s >= 70)
    return {
      name: "Ready to Automate",
      badge: "Pilot Ready",
      summary: "Your assessment indicates strong potential for automation across your manufacturing operation.",
      nextStep: "Identify your highest-value automation opportunity",
    };
  if (s >= 40)
    return {
      name: "Building Toward Automation",
      badge: "Building Readiness",
      summary:
        "Your operation has clear opportunities for automation, but some factors such as digital maturity, investment, skills or integration may need to be addressed first.",
      nextStep: "Identify the right automation opportunity and build the business case for change",
    };
  return {
    name: "Early Stage",
    badge: "Early Stage",
    summary:
      "Your operation is currently at an early stage of automation readiness. There may still be opportunities to improve productivity and prepare your operation for future automation.",
    nextStep: "Explore where automation could create the greatest impact in your manufacturing operation",
  };
}

type Opportunity = { title: string; body: string; weight: (a: Answers) => number };

// Weight = how strongly the answers point to this opportunity (0–1). Ties keep list order.
const OPPORTUNITIES: Opportunity[] = [
  {
    title: "Increase Productivity",
    body: "Your current processes indicate opportunities to improve throughput and reduce manual intervention.",
    weight: (a) => (pts(a, 5) / 15 + (1 - pts(a, 2) / 10)) / 2,
  },
  {
    title: "Improve Process Consistency",
    body: "Automation can help deliver more consistent manufacturing and quality outcomes.",
    weight: (a) => 1 - pts(a, 1) / 10,
  },
  {
    title: "Improve Data Visibility",
    body: "Greater connectivity and digitalisation can provide faster access to manufacturing information and support better decision-making.",
    weight: (a) => 1 - (pts(a, 4) / 15 + pts(a, 7) / 10) / 2,
  },
  {
    title: "Reduce Skills Dependency",
    body: "Automating skill-intensive tasks can reduce reliance on scarce specialists and make your operation easier to scale.",
    weight: (a) => 1 - pts(a, 6) / 10,
  },
  {
    title: "Scale Repetitive Production",
    body: "Repetitive, high-volume processes are well suited to automation and can deliver faster returns on investment.",
    weight: (a) => pts(a, 3) / 10,
  },
];

export function keyOpportunities(a: Answers) {
  return OPPORTUNITIES.map((o, i) => ({ ...o, w: o.weight(a), i }))
    .sort((x, y) => y.w - x.w || x.i - y.i)
    .slice(0, 3)
    .sort((x, y) => x.i - y.i);
}

const PRIORITY_TEXT = [
  "Your responses indicate that automation is already a strategic priority for your manufacturing operation.",
  "Your responses indicate that automation is high on your agenda and you are actively assessing the options.",
  "Your responses indicate that you recognise the value of automation, but the timing is not yet right.",
  "Your responses indicate that automation is not currently a strategic focus for your manufacturing operation.",
];

export function priority(a: Answers) {
  const i = a.single[9] ?? 0;
  const label = QUESTIONS[8].options[i].label.replace("— we", "— We");
  return { title: label, body: PRIORITY_TEXT[i] };
}

const BARRIER_TEXT = [
  "Your next step should be to quantify the impact of automation on your operation and build a clear, measurable business case for investment.",
  "Your next step should be to identify a focused, high-return automation opportunity that can prove value quickly and fund further investment.",
  "Your next step should be to identify automation solutions that reduce reliance on scarce skills while supporting and upskilling your existing team.",
  "Your next step should be to identify automation solutions that can integrate with your current manufacturing environment while providing a path toward greater connectivity and productivity.",
  "Your next step should be to strengthen your digital foundations so that automation can be connected, measured and scaled across your operation.",
  "Your next step should be to map your processes against proven automation approaches to find the solution that best fits your operation.",
  "Your next step should be to discuss your specific challenges with an automation specialist to define the right path forward.",
];

export function primaryBarrier(a: Answers) {
  const i = a.barriers[0] ?? 0;
  const other = a.otherText.trim();
  const title = i === OTHER_INDEX ? other || "Other" : QUESTIONS[9].options[i].label;
  return { title, body: BARRIER_TEXT[i] };
}

/*
 * Result IDs: the answers are packed into a reversible 7-character code, so the
 * same ID always rebuilds the same report without storing anything.
 *
 * Layout (34 bits): Q1–Q9 option index (2 bits each) | primary barrier (3) |
 * barrier mask (7) | checksum (6). The value is then multiplied by an odd
 * constant mod 2^34 so similar answers don't produce similar-looking IDs.
 */
const BITS = BigInt(34);
const MOD = BigInt(1) << BITS;
const MASK = MOD - BigInt(1);
const MULT = BigInt(0x2f6b3a7d5); // odd → invertible mod 2^34
const ID_LEN = 7;

function modInverse(a: bigint) {
  // Newton iteration for the inverse of an odd number mod 2^k.
  let x = a;
  for (let i = 0; i < 6; i++) x = (x * (BigInt(2) - a * x)) & MASK;
  return x;
}
const MULT_INV = modInverse(MULT);

const checksum = (payload: number) => {
  let h = 0x9e37;
  for (let n = payload; n > 0; n = Math.floor(n / 64)) h = (h * 31 + (n % 64)) % 65521;
  return h % 64;
};

export function isComplete(a: Answers) {
  return QUESTIONS.every((q) => (q.multi ? a.barriers.length > 0 : q.id in a.single));
}

export function encodeResultId(a: Answers): string {
  let payload = 0;
  for (let q = 1; q <= 9; q++) payload = payload * 4 + (a.single[q] ?? 0);
  payload = payload * 8 + (a.barriers[0] ?? 0);
  payload = payload * 128 + a.barriers.reduce((m, b) => m | (1 << b), 0);
  const value = BigInt(payload) * BigInt(64) + BigInt(checksum(payload));
  return ((value * MULT) & MASK).toString(36).padStart(ID_LEN, "0");
}

/** Returns null for anything that isn't a valid result ID. */
export function decodeResultId(id: string, otherText = ""): Answers | null {
  if (!/^[0-9a-z]{7}$/i.test(id)) return null;
  let value = BigInt(0);
  for (const ch of id.toLowerCase()) value = value * BigInt(36) + BigInt(parseInt(ch, 36));
  if (value >= MOD) return null;

  const raw = (value * MULT_INV) & MASK;
  let payload = Number(raw / BigInt(64));
  if (checksum(payload) !== Number(raw % BigInt(64))) return null;

  const mask = payload % 128;
  payload = Math.floor(payload / 128);
  const primary = payload % 8;
  payload = Math.floor(payload / 8);
  if (primary >= QUESTIONS[9].options.length || !(mask & (1 << primary))) return null;

  const single: Record<number, number> = {};
  for (let q = 9; q >= 1; q--) {
    const i = payload % 4;
    if (i >= QUESTIONS[q - 1].options.length) return null;
    single[q] = i;
    payload = Math.floor(payload / 4);
  }

  const barriers = [primary];
  for (let b = 0; b < 7; b++) if (b !== primary && mask & (1 << b)) barriers.push(b);
  return { single, barriers, otherText: barriers.includes(OTHER_INDEX) ? otherText : "" };
}
