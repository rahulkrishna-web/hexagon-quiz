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
      { label: "Yes, consistently", points: 10 },
      { label: "Partly, some variation", points: 5 },
      { label: "No, significant variation", points: 0 },
    ],
  },
  {
    id: 2,
    text: "How automated are your current manufacturing and inspection processes?",
    measures: "Current automation maturity",
    options: [
      { label: "Mostly manual", points: 0 },
      { label: "A combination of manual and automated processes", points: 5 },
      { label: "Highly automated", points: 10 },
    ],
  },
  {
    id: 3,
    text: "What type of production does your company mainly handle?",
    measures: "Potential for automation",
    options: [
      { label: "Mostly high-volume, repetitive production", points: 10 },
      { label: "A mix of high-volume and low-volume production", points: 6 },
      { label: "Mostly small batches or customised products", points: 2 },
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
    text: "Are your current manufacturing or inspection processes slowing down production?",
    measures: "Business impact and automation opportunity",
    options: [
      { label: "Yes — significantly", points: 0 },
      { label: "Yes — somewhat", points: 8 },
      { label: "No — not currently", points: 15 },
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
    text: "Does your company have a plan to invest in automating your manufacturing process?",
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
    text: "What is your biggest challenge for automating your manufacturing process?",
    measures: "Primary automation barrier",
    multi: true,
    options: [
      { label: "Budget", points: 0 },
      { label: "People / skills", points: 0 },
      { label: "Integration with existing systems", points: 0 },
      { label: "Lack of digital infrastructure", points: 0 },
      { label: "Not sure which solution fits", points: 0 },
      { label: "Others", points: 0 },
    ],
  },
];

export const OTHER_INDEX = 5;

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
  nextBody: string;
};

/** Readiness category from the total score (bands from "Automation readiness scoring v1, 21 Oct"). */
export function category(s: number, a?: Answers): Category {
  if (s >= 90) {
    // "Optimise & expand" only when Q2 confirms existing automation; otherwise "Highly ready to automate".
    const hasAutomation = a ? (a.single[2] ?? 0) !== 0 : true;
    return hasAutomation
      ? {
          name: "Optimise & expand",
          badge: "Optimise & expand",
          summary:
            "Your manufacturing operation demonstrates strong operational and digital capabilities. There may be opportunities to improve existing automation, strengthen connectivity and expand automation across other processes.",
          nextStep: "Take your automation performance further",
          nextBody:
            "Identify opportunities to optimise manufacturing performance and expand automation where it can deliver greater value.",
        }
      : {
          name: "Highly ready to automate",
          badge: "Highly ready to automate",
          summary:
            "Your manufacturing operation demonstrates strong operational and digital capabilities, giving you a solid foundation to introduce automation across your processes.",
          nextStep: "Take your automation performance further",
          nextBody:
            "Identify the processes where automation can deliver the greatest value and plan how to introduce it.",
        };
  }
  if (s >= 70)
    return {
      name: "Ready to advance",
      badge: "Ready to advance",
      summary:
        "Your manufacturing operation has a strong foundation for automation, with opportunities to improve productivity, quality and operational efficiency.",
      nextStep: "Identify your highest-value automation opportunity",
      nextBody: "Focus on processes where automation can deliver measurable improvements in productivity, quality and efficiency.",
    };
  if (s >= 40)
    return {
      name: "Building towards automation",
      badge: "Building towards automation",
      summary:
        "Your manufacturing operation shows potential for automation, but some areas may need improvement in process consistency, digital connectivity or investment planning.",
      nextStep: "Build a practical plan for automation",
      nextBody: "Strengthen key operational areas and develop a practical plan for automation.",
    };
  return {
    name: "Early stage",
    badge: "Early stage",
    summary:
      "Your manufacturing operation is at an early stage of automation readiness. Improving process stability, data availability and operational efficiency can help prepare your business for future automation.",
    nextStep: "Prepare your manufacturing operation for automation",
    nextBody: "Focus on strengthening existing processes and identifying suitable automation opportunities.",
  };
}

type Opportunity = { title: string; body: string; weight: (a: Answers) => number };

const q2 = (a: Answers) => a.single[2] ?? 0; // 0 mostly manual, 1 combination, 2 highly automated

// Weight = how strongly the Q1–Q7 answers support this opportunity (0–1). 0 = not supported, never shown.
// Ties keep list order.
const OPPORTUNITIES: Opportunity[] = [
  {
    title: "Increase productivity",
    body: "Improve production output and reduce manual work through automation.",
    weight: (a) => ((1 - pts(a, 5) / 15) + (1 - pts(a, 2) / 10)) / 2,
  },
  {
    title: "Improve process consistency",
    body: "Achieve more consistent manufacturing and inspection results.",
    weight: (a) => 1 - pts(a, 1) / 10,
  },
  {
    title: "Reduce skills dependency",
    body: "Reduce reliance on manual tasks and support more consistent operations.",
    weight: (a) => 1 - pts(a, 6) / 10,
  },
  {
    title: "Improve data visibility",
    body: "Connect manufacturing data to support faster and better-informed decisions.",
    weight: (a) => 1 - pts(a, 7) / 10,
  },
  {
    title: "Improve production capacity",
    body: "Explore automation for high-volume processes to increase output.",
    weight: (a) => (pts(a, 3) / 10) * (pts(a, 5) < 15 ? 1 : 0.6),
  },
  {
    title: "Improve system connectivity",
    body: "Connect machines, measurement systems and manufacturing data for better efficiency.",
    weight: (a) => 1 - pts(a, 4) / 15,
  },
  {
    title: "Optimise existing automation",
    body: "Improve the performance and efficiency of your current automation systems.",
    weight: (a) => (q2(a) === 2 ? 0.9 : q2(a) === 1 ? 0.45 : 0),
  },
  {
    title: "Expand automation",
    body: "Identify additional processes where automation can improve productivity and quality.",
    weight: (a) => (q2(a) === 1 ? 0.5 : q2(a) === 2 ? 0.55 : 0),
  },
];

/** Up to three most relevant opportunities — only ones the answers actually support. */
export function keyOpportunities(a: Answers) {
  const ranked = OPPORTUNITIES.map((o, i) => ({ ...o, w: o.weight(a), i })).sort((x, y) => y.w - x.w || x.i - y.i);
  const supported = ranked.filter((o) => o.w > 0);
  return (supported.length ? supported : ranked).slice(0, 3);
}

// Q9 option order: Critical, Very important, Important (not ready yet), Not a priority.
const PRIORITY = [
  { title: "High priority", body: "Automation is a key focus for improving your manufacturing productivity and quality." },
  {
    title: "Important priority",
    body: "Your company recognises the benefits of automation and is considering opportunities for improvement.",
  },
  { title: "Future opportunity", body: "Automation is an area your company may explore as manufacturing needs develop." },
  { title: "Not an immediate priority", body: "Automation is not currently a key focus for your manufacturing operation." },
];

export function priority(a: Answers) {
  return PRIORITY[a.single[9] ?? 0];
}

// Q10 option order: Budget, People/skills, Integration, Digital infrastructure, Solution fit, Others.
const BARRIERS = [
  {
    title: "Budget",
    body: "Start with a practical automation opportunity that can demonstrate measurable value before expanding investment.",
  },
  { title: "People and skills", body: "Explore automation solutions that simplify operations and support your existing workforce." },
  {
    title: "Integration with existing systems",
    body: "Identify solutions that can work with your current machines, software and manufacturing processes.",
  },
  { title: "Limited digital infrastructure", body: "Strengthen data collection and connectivity to support future automation." },
  { title: "Unsure which solution to choose", body: "Review your manufacturing requirements to identify suitable automation technologies." },
  { title: "Other", body: "Discuss your specific challenges with Hexagon experts to identify a practical way forward." },
];

export function primaryBarrier(a: Answers) {
  const i = a.barriers[0] ?? 0;
  const other = a.otherText.trim();
  const b = BARRIERS[i];
  return { title: i === OTHER_INDEX ? other || b.title : b.title, body: b.body };
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
  for (let b = 0; b < QUESTIONS[9].options.length; b++) if (b !== primary && mask & (1 << b)) barriers.push(b);
  return { single, barriers, otherText: barriers.includes(OTHER_INDEX) ? otherText : "" };
}
