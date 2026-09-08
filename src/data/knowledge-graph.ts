// Mock knowledge-graph + chat data for the Chat & Knowledge Graph workspace.
// Frontend-only; replace with fabric API calls later.

export type NodeKind =
  | "entity"
  | "ownership"
  | "financial"
  | "policy"
  | "risk"
  | "document"
  | "agent";

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  x: number;
  y: number;
  detail: string;
  facts: { label: string; value: string }[];
}

export interface GraphLink {
  from: string;
  to: string;
  label: string;
  emphasis?: "guarantee" | "normal";
}

export const nodeKindMeta: Record<NodeKind, { label: string; token: string }> = {
  entity: { label: "Borrower / entity", token: "var(--graph-entity)" },
  ownership: { label: "Ownership structure", token: "var(--graph-ownership)" },
  financial: { label: "Financial metrics", token: "var(--graph-financial)" },
  policy: { label: "Policy rules", token: "var(--graph-policy)" },
  risk: { label: "Risk factors", token: "var(--graph-risk)" },
  document: { label: "Documents", token: "var(--graph-document)" },
  agent: { label: "Approvers / agents", token: "var(--graph-agent)" },
};

export const graphNodes: GraphNode[] = [
  {
    id: "borrower",
    label: "XYZ Manufacturing LLC",
    kind: "entity",
    x: 330,
    y: 275,
    detail: "Delaware corporation established 2004. Precision metal fabrication, NAICS 332710.",
    facts: [
      { label: "Legal form", value: "Delaware LLC" },
      { label: "Established", value: "2004" },
      { label: "Facility", value: "$12.5M revolving line" },
      { label: "Risk rating", value: "5B — Moderate" },
    ],
  },
  {
    id: "abc",
    label: "ABC Capital Partners",
    kind: "ownership",
    x: 130,
    y: 130,
    detail: "Private equity sponsor holding a 60% controlling stake with board representation.",
    facts: [
      { label: "Ownership", value: "60%" },
      { label: "Type", value: "PE sponsor" },
      { label: "Rights", value: "Board seats, approval on major transactions" },
    ],
  },
  {
    id: "founder",
    label: "John Smith (Founder)",
    kind: "ownership",
    x: 330,
    y: 85,
    detail: "Founder and active CEO, retains a 25% stake and day-to-day operating control.",
    facts: [
      { label: "Ownership", value: "25%" },
      { label: "Role", value: "CEO, primary decision maker" },
      { label: "Tenure", value: "22 years" },
    ],
  },
  {
    id: "institutional",
    label: "Institutional Investors",
    kind: "ownership",
    x: 545,
    y: 130,
    detail: "Passive institutional block of 15%, no control rights, no board representation.",
    facts: [
      { label: "Ownership", value: "15%" },
      { label: "Control", value: "None — passive" },
    ],
  },
  {
    id: "guarantee",
    label: "Parent Guarantee",
    kind: "ownership",
    x: 150,
    y: 265,
    detail: "Unconditional parent guarantee from ABC Capital Partners covering the full facility.",
    facts: [
      { label: "Guarantor", value: "ABC Capital Partners" },
      { label: "Coverage", value: "100% of facility" },
      { label: "Type", value: "Unconditional and continuing" },
    ],
  },
  {
    id: "revenue",
    label: "Revenue $84.2M",
    kind: "financial",
    x: 560,
    y: 275,
    detail: "FY2025 audited revenue, up 6.1% year over year.",
    facts: [
      { label: "FY2025", value: "$84.2M" },
      { label: "YoY", value: "+6.1%" },
    ],
  },
  {
    id: "ebitda",
    label: "EBITDA $11.6M",
    kind: "financial",
    x: 585,
    y: 385,
    detail: "Normalized EBITDA after owner-compensation add-backs; margin 13.8%.",
    facts: [
      { label: "Normalized", value: "$11.6M" },
      { label: "Margin", value: "13.8%" },
    ],
  },
  {
    id: "leverage",
    label: "Leverage 3.4x",
    kind: "financial",
    x: 455,
    y: 430,
    detail: "Total funded debt / EBITDA of 3.4x, inside the 3.75x policy ceiling.",
    facts: [
      { label: "Current", value: "3.4x" },
      { label: "Policy limit", value: "3.75x" },
    ],
  },
  {
    id: "dscr",
    label: "DSCR ≥ 1.25x",
    kind: "policy",
    x: 215,
    y: 420,
    detail: "Commercial policy CP-104 minimum debt service coverage. Current DSCR 1.31x — pass.",
    facts: [
      { label: "Rule", value: "CP-104" },
      { label: "Observed", value: "1.31x" },
      { label: "Result", value: "Pass" },
    ],
  },
  {
    id: "levpolicy",
    label: "Leverage ≤ 3.75x",
    kind: "policy",
    x: 95,
    y: 375,
    detail: "Policy CP-118 leverage ceiling for sponsor-owned manufacturers.",
    facts: [
      { label: "Rule", value: "CP-118" },
      { label: "Result", value: "Pass with watch" },
    ],
  },
  {
    id: "guarpolicy",
    label: "Guarantee requirement",
    kind: "policy",
    x: 60,
    y: 215,
    detail: "Policy CP-091 requires a sponsor or parent guarantee where control ownership exceeds 50%.",
    facts: [
      { label: "Rule", value: "CP-091" },
      { label: "Trigger", value: "Ownership > 50%" },
      { label: "Result", value: "Satisfied" },
    ],
  },
  {
    id: "equitypolicy",
    label: "Sponsor equity ≥ 25%",
    kind: "policy",
    x: 60,
    y: 100,
    detail: "Policy CP-093 minimum retained sponsor equity. Satisfied at 60%.",
    facts: [
      { label: "Rule", value: "CP-093" },
      { label: "Result", value: "Satisfied" },
    ],
  },
  {
    id: "industryrisk",
    label: "Industry cyclicality",
    kind: "risk",
    x: 330,
    y: 470,
    detail: "Fabricated metals demand is tied to capex cycles; historical peak-to-trough revenue swing 18%.",
    facts: [
      { label: "Severity", value: "Moderate" },
      { label: "Driver", value: "Capex sensitivity" },
    ],
  },
  {
    id: "concentration",
    label: "Customer concentration",
    kind: "risk",
    x: 200,
    y: 505,
    detail: "Top three customers represent 41% of FY2025 revenue.",
    facts: [
      { label: "Severity", value: "Elevated" },
      { label: "Top 3", value: "41% of revenue" },
    ],
  },
  {
    id: "keyman",
    label: "Key-man risk",
    kind: "risk",
    x: 460,
    y: 505,
    detail: "Founder John Smith holds most customer relationships; no formal succession plan on file.",
    facts: [
      { label: "Severity", value: "Moderate" },
      { label: "Mitigant", value: "Key-man life policy assigned" },
    ],
  },
  {
    id: "financials",
    label: "FY2025 audited financials",
    kind: "document",
    x: 620,
    y: 200,
    detail: "Audited statements from Harlan & Reese LLP, unqualified opinion, received 12 Aug 2026.",
    facts: [
      { label: "Auditor", value: "Harlan & Reese LLP" },
      { label: "Extraction", value: "98% confidence" },
    ],
  },
  {
    id: "opagreement",
    label: "Operating agreement",
    kind: "document",
    x: 190,
    y: 40,
    detail: "Amended and restated LLC operating agreement evidencing the 60/25/15 ownership split.",
    facts: [
      { label: "Version", value: "A&R 2023" },
      { label: "Extraction", value: "95% confidence" },
    ],
  },
  {
    id: "ubodoc",
    label: "UBO declaration",
    kind: "document",
    x: 470,
    y: 40,
    detail: "Beneficial ownership certification supporting KYC screening of all >25% holders.",
    facts: [
      { label: "Status", value: "Verified" },
      { label: "Screening", value: "Clear" },
    ],
  },
  {
    id: "analyst",
    label: "Credit analyst — D. Okafor",
    kind: "agent",
    x: 620,
    y: 470,
    detail: "Owns spreading review and the recommendation memo for this credit.",
    facts: [
      { label: "Role", value: "Credit analyst" },
      { label: "Status", value: "In review" },
    ],
  },
  {
    id: "underwriter",
    label: "Underwriter — M. Alvarez",
    kind: "agent",
    x: 620,
    y: 90,
    detail: "Delegated authority holder for facilities up to $15M.",
    facts: [
      { label: "Role", value: "Senior underwriter" },
      { label: "Authority", value: "Up to $15M" },
    ],
  },
];

export const graphLinks: GraphLink[] = [
  { from: "abc", to: "borrower", label: "60% ownership" },
  { from: "founder", to: "borrower", label: "25% ownership" },
  { from: "institutional", to: "borrower", label: "15% ownership" },
  { from: "abc", to: "guarantee", label: "provides", emphasis: "guarantee" },
  { from: "guarantee", to: "borrower", label: "secures facility", emphasis: "guarantee" },
  { from: "guarpolicy", to: "guarantee", label: "requires" },
  { from: "equitypolicy", to: "abc", label: "tests equity" },
  { from: "opagreement", to: "abc", label: "evidences" },
  { from: "opagreement", to: "founder", label: "evidences" },
  { from: "ubodoc", to: "founder", label: "verifies UBO" },
  { from: "ubodoc", to: "institutional", label: "verifies UBO" },
  { from: "borrower", to: "revenue", label: "reports" },
  { from: "borrower", to: "ebitda", label: "reports" },
  { from: "ebitda", to: "leverage", label: "denominator" },
  { from: "leverage", to: "levpolicy", label: "tested by" },
  { from: "ebitda", to: "dscr", label: "tested by" },
  { from: "financials", to: "revenue", label: "source" },
  { from: "financials", to: "ebitda", label: "source" },
  { from: "borrower", to: "industryrisk", label: "exposed to" },
  { from: "borrower", to: "concentration", label: "exposed to" },
  { from: "founder", to: "keyman", label: "drives" },
  { from: "analyst", to: "borrower", label: "reviews" },
  { from: "underwriter", to: "borrower", label: "approves" },
];

export interface ChatAnswer {
  question: string;
  answer: string;
  detail: string;
  highlight: string[];
}

export const suggestedQuestions: string[] = [
  "What is the borrower's ownership structure?",
  "Who are the guarantors on this facility?",
  "What are the key policy requirements for this credit?",
  "Is there a parent company guarantee?",
  "Who is the primary decision maker at the borrower?",
  "What is the borrower's industry classification?",
  "Are there any related party transactions?",
  "What covenant requirements apply to this credit?",
  "Who is the relationship manager for this borrower?",
  "What is the borrower's payment history?",
];

const ownershipAnswer =
  "The borrower is XYZ Manufacturing LLC, a Delaware corporation established in 2004. The ownership structure consists of: 60% stake held by ABC Capital Partners (PE firm), 25% held by the founder John Smith (still active in management), and 15% held by institutional investors. ABC Capital Partners has board representation and approval rights on major transactions. The borrower also has a parent guarantee from ABC Capital Partners on the facility.";

export const chatAnswers: ChatAnswer[] = [
  {
    question: "What is the borrower's ownership structure and who are the key shareholders?",
    answer: ownershipAnswer,
    detail:
      "Evidence: A&R operating agreement (2023) §3.1 capitalization table; UBO declaration verified 14 Aug 2026; sponsor guarantee agreement §2. Policy CP-091 (guarantee where control ownership > 50%) and CP-093 (sponsor equity ≥ 25%) are both satisfied. No holder below the 25% UBO screening threshold requires further diligence.",
    highlight: [
      "borrower",
      "abc",
      "founder",
      "institutional",
      "guarantee",
      "guarpolicy",
      "equitypolicy",
      "opagreement",
      "ubodoc",
    ],
  },
  {
    question: "What is the borrower's ownership structure?",
    answer: ownershipAnswer,
    detail:
      "Ownership split of 60 / 25 / 15 is evidenced by the amended operating agreement and confirmed against the UBO declaration. ABC Capital Partners holds control rights; the founder retains operating control.",
    highlight: ["borrower", "abc", "founder", "institutional", "opagreement", "ubodoc", "equitypolicy"],
  },
  {
    question: "Who are the guarantors on this facility?",
    answer:
      "ABC Capital Partners provides an unconditional and continuing parent guarantee covering 100% of the $12.5M facility. No personal guarantee is held from the founder; policy CP-091 is satisfied through the sponsor guarantee alone.",
    detail:
      "Guarantee agreement dated 03 Jul 2026, §2 (unconditional), §5 (continuing until facility termination). Sponsor financial capacity confirmed from the fund's latest LP report.",
    highlight: ["guarantee", "abc", "borrower", "guarpolicy"],
  },
  {
    question: "Is there a parent company guarantee?",
    answer:
      "Yes. ABC Capital Partners, the 60% controlling sponsor, guarantees the full facility. The guarantee is unconditional, continuing, and required under policy CP-091 because control ownership exceeds 50%.",
    detail: "The guarantee is booked as a credit enhancement and is reflected in the recommendation memo conditions.",
    highlight: ["guarantee", "abc", "guarpolicy", "borrower"],
  },
  {
    question: "What are the key policy requirements for this credit?",
    answer:
      "Four policy rules drive this credit: CP-104 minimum DSCR of 1.25x (observed 1.31x — pass), CP-118 leverage ceiling of 3.75x (observed 3.4x — pass with watch), CP-091 sponsor guarantee where control ownership exceeds 50% (satisfied), and CP-093 minimum sponsor equity of 25% (satisfied at 60%).",
    detail:
      "Deterministic engine evaluated 18 rules; 4 are material to the decision, 1 carries a watch flag on leverage headroom of 0.35x.",
    highlight: ["dscr", "levpolicy", "guarpolicy", "equitypolicy", "leverage", "borrower"],
  },
  {
    question: "What covenant requirements apply to this credit?",
    answer:
      "Proposed covenants: minimum DSCR of 1.25x tested quarterly, maximum total leverage of 3.75x stepping to 3.50x after four quarters, a $1.5M annual capex limit, and a distribution block while leverage exceeds 3.25x.",
    detail: "Covenant package mirrors the sponsor's other bank facilities; tested on consolidated borrower financials.",
    highlight: ["dscr", "levpolicy", "leverage", "ebitda", "borrower"],
  },
  {
    question: "Who is the primary decision maker at the borrower?",
    answer:
      "John Smith, founder and CEO, is the primary decision maker for day-to-day operations and holds 25% of the equity. Major transactions — new debt, M&A, distributions — additionally require ABC Capital Partners board approval.",
    detail: "Key-man risk is flagged: the founder holds most top-customer relationships and no succession plan is on file.",
    highlight: ["founder", "abc", "borrower", "keyman"],
  },
  {
    question: "What is the borrower's industry classification?",
    answer:
      "NAICS 332710 — Machine Shops, within fabricated metal product manufacturing. The industry carries moderate cyclicality with an 18% historical peak-to-trough revenue swing tied to customer capex cycles.",
    detail: "Industry risk grade 4 of 7 on the internal scale; sector outlook stable with margin pressure from input costs.",
    highlight: ["borrower", "industryrisk", "revenue"],
  },
  {
    question: "Are there any related party transactions?",
    answer:
      "Two disclosed related-party items: a $0.4M annual management fee paid to ABC Capital Partners, and a facility lease from an entity controlled by John Smith at $0.6M per year. Both are add-backs reviewed in the spread and confirmed at market terms.",
    detail: "Related-party disclosures taken from FY2025 audited financials, Note 14.",
    highlight: ["abc", "founder", "borrower", "ebitda", "financials"],
  },
  {
    question: "Who is the relationship manager for this borrower?",
    answer:
      "The relationship is managed by the commercial middle-market team, with D. Okafor as credit analyst and M. Alvarez as the delegated underwriter for facilities up to $15M.",
    detail: "Case ownership and hand-offs are recorded in the audit trail with actor attribution.",
    highlight: ["analyst", "underwriter", "borrower"],
  },
  {
    question: "What is the borrower's payment history?",
    answer:
      "36 months of clean internal payment history — no delinquencies over 10 days, no covenant breaches, and no overdrafts on the operating account. External bureau shows one 30-day trade line in 2023, since cured.",
    detail: "Payment behaviour supports the 5B risk rating; no adverse trend in the last four quarters.",
    highlight: ["borrower", "analyst", "revenue"],
  },
];

export const seedMessages = [
  {
    id: "m1",
    role: "assistant" as const,
    text: "I have the full credit file loaded for XYZ Manufacturing LLC — spreads, policy results, KYC and documents. Ask me anything and I'll cite the evidence and highlight it on the graph.",
    time: "09:12",
  },
  {
    id: "m2",
    role: "user" as const,
    text: "What is the borrower's ownership structure and who are the key shareholders?",
    time: "09:13",
  },
  {
    id: "m3",
    role: "assistant" as const,
    text: ownershipAnswer,
    detail: chatAnswers[0]!.detail,
    time: "09:13",
    highlight: chatAnswers[0]!.highlight,
  },
];
