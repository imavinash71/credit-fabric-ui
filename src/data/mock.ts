// Mock data for the Apexon Credit Intelligence Fabric — Phase 1 commercial underwriting MVP.
// Frontend-only; replace with API calls later.

export type CaseStage =
  | "Intake"
  | "Spreading"
  | "Policy & KYC"
  | "Analyst Review"
  | "Credit Officer"
  | "Decided";

export type RiskBand = "Low" | "Moderate" | "Elevated" | "High";

export interface CreditCase {
  id: string;
  borrower: string;
  industry: string;
  naics: string;
  facility: string;
  amount: number;
  currency: string;
  stage: CaseStage;
  risk: RiskBand;
  riskRating: string;
  analyst: string;
  relationshipManager: string;
  submitted: string;
  slaDueDays: number;
  completeness: number;
  exceptions: number;
  region: string;
  purpose: string;
  existingExposure: number;
  tenorMonths: number;
  pricing: string;
  collateral: string;
}

export const cases: CreditCase[] = [
  {
    id: "CC-2026-0481",
    borrower: "Meridian Fabrication Group, Inc.",
    industry: "Metal Fabrication",
    naics: "332710",
    facility: "Revolving line of credit",
    amount: 8500000,
    currency: "USD",
    stage: "Analyst Review",
    risk: "Moderate",
    riskRating: "5 / Pass",
    analyst: "D. Okafor",
    relationshipManager: "S. Bellamy",
    submitted: "2026-08-14",
    slaDueDays: 2,
    completeness: 92,
    exceptions: 2,
    region: "Midwest",
    purpose: "Working capital and seasonal inventory build",
    existingExposure: 4200000,
    tenorMonths: 24,
    pricing: "SOFR + 275 bps",
    collateral: "Blanket lien on A/R and inventory",
  },
  {
    id: "CC-2026-0477",
    borrower: "Harbor Point Logistics LLC",
    industry: "Freight Trucking",
    naics: "484121",
    facility: "Equipment term loan",
    amount: 3250000,
    currency: "USD",
    stage: "Policy & KYC",
    risk: "Elevated",
    riskRating: "6 / Watch",
    analyst: "M. Castellanos",
    relationshipManager: "P. Nguyen",
    submitted: "2026-08-18",
    slaDueDays: 1,
    completeness: 78,
    exceptions: 3,
    region: "Gulf Coast",
    purpose: "Fleet replacement — 22 tractors",
    existingExposure: 1150000,
    tenorMonths: 60,
    pricing: "Fixed 7.85%",
    collateral: "Titled equipment, 80% advance",
  },
  {
    id: "CC-2026-0489",
    borrower: "Calder & Roe Specialty Foods",
    industry: "Food Manufacturing",
    naics: "311999",
    facility: "Revolver increase",
    amount: 5000000,
    currency: "USD",
    stage: "Spreading",
    risk: "Low",
    riskRating: "4 / Pass",
    analyst: "D. Okafor",
    relationshipManager: "R. Adeyemi",
    submitted: "2026-08-22",
    slaDueDays: 4,
    completeness: 64,
    exceptions: 0,
    region: "Northeast",
    purpose: "Increase from $3.0MM to $5.0MM",
    existingExposure: 3000000,
    tenorMonths: 12,
    pricing: "SOFR + 240 bps",
    collateral: "A/R and inventory",
  },
  {
    id: "CC-2026-0492",
    borrower: "Northwind Renewables Holdings",
    industry: "Power Generation",
    naics: "221114",
    facility: "Project term loan",
    amount: 21000000,
    currency: "USD",
    stage: "Intake",
    risk: "Elevated",
    riskRating: "Unrated",
    analyst: "Unassigned",
    relationshipManager: "K. Duarte",
    submitted: "2026-08-27",
    slaDueDays: 6,
    completeness: 31,
    exceptions: 1,
    region: "Pacific NW",
    purpose: "Construction take-out for 40MW solar portfolio",
    existingExposure: 0,
    tenorMonths: 84,
    pricing: "SOFR + 325 bps",
    collateral: "Project assets and PPA assignment",
  },
  {
    id: "CC-2026-0463",
    borrower: "Vantage Clinical Partners, PC",
    industry: "Ambulatory Health Care",
    naics: "621111",
    facility: "CRE owner-occupied mortgage",
    amount: 6750000,
    currency: "USD",
    stage: "Credit Officer",
    risk: "Low",
    riskRating: "3 / Pass",
    analyst: "L. Petrov",
    relationshipManager: "S. Bellamy",
    submitted: "2026-08-06",
    slaDueDays: 0,
    completeness: 100,
    exceptions: 1,
    region: "Southeast",
    purpose: "Refinance of medical office building",
    existingExposure: 900000,
    tenorMonths: 120,
    pricing: "Fixed 6.95%",
    collateral: "First mortgage, 68% LTV",
  },
  {
    id: "CC-2026-0455",
    borrower: "Ashcroft Industrial Supply Co.",
    industry: "Wholesale Distribution",
    naics: "423840",
    facility: "Revolving line of credit",
    amount: 4000000,
    currency: "USD",
    stage: "Decided",
    risk: "Moderate",
    riskRating: "5 / Pass",
    analyst: "M. Castellanos",
    relationshipManager: "P. Nguyen",
    submitted: "2026-07-29",
    slaDueDays: 0,
    completeness: 100,
    exceptions: 0,
    region: "Midwest",
    purpose: "Annual renewal",
    existingExposure: 4000000,
    tenorMonths: 12,
    pricing: "SOFR + 260 bps",
    collateral: "A/R and inventory",
  },
];

export const primaryCaseId = "CC-2026-0481";

export function getCase(id: string) {
  return cases.find((c) => c.id === id) ?? cases[0];
}

/* ---------------------------------- KPIs --------------------------------- */

export const portfolioKpis = [
  { label: "Active cases", value: "128", delta: "+12 this week", tone: "neutral" as const },
  { label: "Avg. cycle time", value: "6.4 d", delta: "-1.2 d vs. Q2", tone: "positive" as const },
  { label: "Policy exceptions open", value: "17", delta: "+3 this week", tone: "negative" as const },
  { label: "Exposure in pipeline", value: "$248.6M", delta: "42 obligors", tone: "neutral" as const },
];

export const stageDistribution = [
  { stage: "Intake", count: 24 },
  { stage: "Spreading", count: 31 },
  { stage: "Policy & KYC", count: 26 },
  { stage: "Analyst Review", count: 22 },
  { stage: "Credit Officer", count: 14 },
  { stage: "Decided", count: 11 },
];

export const cycleTrend = [
  { month: "Mar", days: 9.1, volume: 88 },
  { month: "Apr", days: 8.6, volume: 94 },
  { month: "May", days: 8.0, volume: 101 },
  { month: "Jun", days: 7.4, volume: 112 },
  { month: "Jul", days: 6.9, volume: 119 },
  { month: "Aug", days: 6.4, volume: 128 },
];

export const engineHealth = [
  { engine: "Knowledge Intelligence", detail: "7 domains · policy manual v14.2 indexed", status: "Operational" },
  { engine: "Deterministic Intelligence", detail: "Spread engine · GAAP mapping 2026.1", status: "Operational" },
  { engine: "Cognitive Intelligence", detail: "3 MVP agents active (Financial, Policy, KYC)", status: "Operational" },
  { engine: "Workflow Intelligence", detail: "Single approval path · audit trail on", status: "Operational" },
];

export const alerts = [
  {
    id: "AL-1",
    severity: "high" as const,
    title: "DSCR below policy floor",
    body: "Harbor Point Logistics DSCR 1.08x vs. 1.20x minimum for equipment term facilities.",
    case: "CC-2026-0477",
  },
  {
    id: "AL-2",
    severity: "medium" as const,
    title: "UBO chain incomplete",
    body: "Northwind Renewables — two intermediate holdcos unresolved above 25% threshold.",
    case: "CC-2026-0492",
  },
  {
    id: "AL-3",
    severity: "medium" as const,
    title: "Stale financials",
    body: "Meridian Fabrication interim statements are 142 days old; policy requires ≤120 days.",
    case: "CC-2026-0481",
  },
  {
    id: "AL-4",
    severity: "low" as const,
    title: "KYC refresh due",
    body: "Calder & Roe periodic refresh due in 21 days.",
    case: "CC-2026-0489",
  },
];

/* -------------------------------- Documents ------------------------------- */

export type DocStatus = "Extracted" | "In review" | "Needs attention" | "Missing" | "Queued";

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  period: string;
  source: string;
  pages: number;
  received: string;
  status: DocStatus;
  confidence: number;
  fields: number;
  flagged: number;
}

export const documents: CaseDocument[] = [
  {
    id: "DOC-8841",
    name: "MFG_FY2025_Audited_Financials.pdf",
    type: "Audited financial statements",
    period: "FY2025",
    source: "Borrower portal",
    pages: 48,
    received: "2026-08-14",
    status: "Extracted",
    confidence: 97,
    fields: 214,
    flagged: 2,
  },
  {
    id: "DOC-8842",
    name: "MFG_FY2024_Audited_Financials.pdf",
    type: "Audited financial statements",
    period: "FY2024",
    source: "Document repository",
    pages: 45,
    received: "2026-08-14",
    status: "Extracted",
    confidence: 98,
    fields: 209,
    flagged: 0,
  },
  {
    id: "DOC-8843",
    name: "MFG_Interim_Q1_2026.xlsx",
    type: "Interim financials",
    period: "Q1 2026",
    source: "Email — RM forward",
    pages: 6,
    received: "2026-08-15",
    status: "Needs attention",
    confidence: 71,
    fields: 88,
    flagged: 7,
  },
  {
    id: "DOC-8844",
    name: "Form1120_2025_Meridian.pdf",
    type: "Corporate tax return",
    period: "TY2025",
    source: "Borrower portal",
    pages: 32,
    received: "2026-08-16",
    status: "Extracted",
    confidence: 94,
    fields: 143,
    flagged: 1,
  },
  {
    id: "DOC-8845",
    name: "Bank_Statements_Feb-Jul_2026.pdf",
    type: "Bank statements",
    period: "Feb–Jul 2026",
    source: "Core banking",
    pages: 74,
    received: "2026-08-16",
    status: "In review",
    confidence: 89,
    fields: 1120,
    flagged: 4,
  },
  {
    id: "DOC-8846",
    name: "AR_Aging_Jul2026.csv",
    type: "A/R aging",
    period: "Jul 2026",
    source: "Borrower portal",
    pages: 3,
    received: "2026-08-17",
    status: "Extracted",
    confidence: 99,
    fields: 412,
    flagged: 0,
  },
  {
    id: "DOC-8847",
    name: "Org_Chart_Ownership.pdf",
    type: "Ownership / org chart",
    period: "Current",
    source: "KYC platform",
    pages: 4,
    received: "2026-08-18",
    status: "In review",
    confidence: 82,
    fields: 36,
    flagged: 2,
  },
  {
    id: "DOC-8848",
    name: "Personal financial statement — J. Meridian",
    type: "Guarantor PFS",
    period: "2026",
    source: "—",
    pages: 0,
    received: "—",
    status: "Missing",
    confidence: 0,
    fields: 0,
    flagged: 0,
  },
  {
    id: "DOC-8849",
    name: "Insurance certificate — property & casualty",
    type: "Insurance",
    period: "2026–2027",
    source: "—",
    pages: 0,
    received: "—",
    status: "Queued",
    confidence: 0,
    fields: 0,
    flagged: 0,
  },
];

export interface ExtractedField {
  label: string;
  value: string;
  page: number;
  confidence: number;
  status: "accepted" | "review" | "corrected";
  note?: string;
}

export const extractedFields: ExtractedField[] = [
  { label: "Total revenue", value: "$62,480,000", page: 12, confidence: 99, status: "accepted" },
  { label: "Cost of goods sold", value: "$47,109,000", page: 12, confidence: 98, status: "accepted" },
  { label: "EBITDA", value: "$6,214,000", page: 13, confidence: 96, status: "accepted" },
  { label: "Interest expense", value: "$1,042,000", page: 14, confidence: 95, status: "accepted" },
  {
    label: "Depreciation & amortization",
    value: "$2,180,000",
    page: 14,
    confidence: 74,
    status: "review",
    note: "Footnote 7 splits D&A across COGS and SG&A; allocation needs confirmation.",
  },
  { label: "Total current assets", value: "$28,940,000", page: 9, confidence: 99, status: "accepted" },
  { label: "Total current liabilities", value: "$16,205,000", page: 10, confidence: 99, status: "accepted" },
  {
    label: "Long-term debt",
    value: "$14,860,000",
    page: 10,
    confidence: 68,
    status: "corrected",
    note: "Extracted $12,860,000; analyst corrected to include $2.0MM subordinated note (Note 11).",
  },
  { label: "Total equity", value: "$19,412,000", page: 10, confidence: 97, status: "accepted" },
  { label: "Operating cash flow", value: "$5,038,000", page: 16, confidence: 93, status: "accepted" },
];

/* ------------------------------- Spreading -------------------------------- */

export interface SpreadRow {
  label: string;
  fy2023: number;
  fy2024: number;
  fy2025: number;
  ttm: number;
  emphasis?: boolean;
  indent?: boolean;
}

export const incomeStatement: SpreadRow[] = [
  { label: "Revenue", fy2023: 51200000, fy2024: 57340000, fy2025: 62480000, ttm: 64110000, emphasis: true },
  { label: "Cost of goods sold", fy2023: 38150000, fy2024: 42760000, fy2025: 47109000, ttm: 48930000, indent: true },
  { label: "Gross profit", fy2023: 13050000, fy2024: 14580000, fy2025: 15371000, ttm: 15180000, emphasis: true },
  { label: "Selling, general & admin", fy2023: 8420000, fy2024: 9130000, fy2025: 9157000, ttm: 9420000, indent: true },
  { label: "EBITDA", fy2023: 5730000, fy2024: 6210000, fy2025: 6214000, ttm: 5980000, emphasis: true },
  { label: "Depreciation & amortization", fy2023: 1840000, fy2024: 2020000, fy2025: 2180000, ttm: 2240000, indent: true },
  { label: "Interest expense", fy2023: 690000, fy2024: 845000, fy2025: 1042000, ttm: 1188000, indent: true },
  { label: "Pre-tax income", fy2023: 3200000, fy2024: 3345000, fy2025: 2992000, ttm: 2552000 },
  { label: "Net income", fy2023: 2464000, fy2024: 2576000, fy2025: 2304000, ttm: 1965000, emphasis: true },
];

export const balanceSheet: SpreadRow[] = [
  { label: "Cash & equivalents", fy2023: 3120000, fy2024: 2640000, fy2025: 2180000, ttm: 1940000, indent: true },
  { label: "Accounts receivable", fy2023: 9840000, fy2024: 11260000, fy2025: 13120000, ttm: 13910000, indent: true },
  { label: "Inventory", fy2023: 9410000, fy2024: 10980000, fy2025: 12480000, ttm: 13260000, indent: true },
  { label: "Total current assets", fy2023: 23310000, fy2024: 25840000, fy2025: 28940000, ttm: 30240000, emphasis: true },
  { label: "Net fixed assets", fy2023: 14200000, fy2024: 15310000, fy2025: 16040000, ttm: 16220000, indent: true },
  { label: "Total assets", fy2023: 38810000, fy2024: 42350000, fy2025: 46180000, ttm: 47640000, emphasis: true },
  { label: "Accounts payable", fy2023: 7120000, fy2024: 8340000, fy2025: 9410000, ttm: 10120000, indent: true },
  { label: "Revolver outstanding", fy2023: 3800000, fy2024: 4600000, fy2025: 5200000, ttm: 5800000, indent: true },
  { label: "Total current liabilities", fy2023: 12240000, fy2024: 14180000, fy2025: 16205000, ttm: 17410000, emphasis: true },
  { label: "Long-term debt", fy2023: 11200000, fy2024: 12940000, fy2025: 14860000, ttm: 15020000, indent: true },
  { label: "Total equity", fy2023: 15370000, fy2024: 15230000, fy2025: 19412000, ttm: 19860000, emphasis: true },
];

export interface RatioRow {
  name: string;
  fy2023: string;
  fy2024: string;
  fy2025: string;
  ttm: string;
  policy: string;
  status: "pass" | "watch" | "fail";
  formula: string;
}

export const ratios: RatioRow[] = [
  {
    name: "Debt service coverage (DSCR)",
    fy2023: "1.94x",
    fy2024: "1.71x",
    fy2025: "1.42x",
    ttm: "1.28x",
    policy: "≥ 1.25x",
    status: "watch",
    formula: "(EBITDA − unfunded capex) ÷ (interest + current maturities of LTD)",
  },
  {
    name: "Total debt / EBITDA",
    fy2023: "2.62x",
    fy2024: "2.83x",
    fy2025: "3.23x",
    ttm: "3.48x",
    policy: "≤ 3.50x",
    status: "watch",
    formula: "(Revolver + LTD) ÷ EBITDA",
  },
  {
    name: "Current ratio",
    fy2023: "1.90x",
    fy2024: "1.82x",
    fy2025: "1.79x",
    ttm: "1.74x",
    policy: "≥ 1.25x",
    status: "pass",
    formula: "Total current assets ÷ total current liabilities",
  },
  {
    name: "Debt / tangible net worth",
    fy2023: "1.53x",
    fy2024: "1.78x",
    fy2025: "1.60x",
    ttm: "1.65x",
    policy: "≤ 2.50x",
    status: "pass",
    formula: "Total liabilities ÷ (equity − intangibles)",
  },
  {
    name: "Gross margin",
    fy2023: "25.5%",
    fy2024: "25.4%",
    fy2025: "24.6%",
    ttm: "23.7%",
    policy: "Peer 24.1%",
    status: "watch",
    formula: "Gross profit ÷ revenue",
  },
  {
    name: "Days sales outstanding",
    fy2023: "70 d",
    fy2024: "72 d",
    fy2025: "77 d",
    ttm: "79 d",
    policy: "≤ 75 d",
    status: "fail",
    formula: "(A/R ÷ revenue) × 365",
  },
  {
    name: "Inventory turns",
    fy2023: "4.05x",
    fy2024: "3.89x",
    fy2025: "3.77x",
    ttm: "3.69x",
    policy: "Peer 4.20x",
    status: "watch",
    formula: "COGS ÷ average inventory",
  },
];

export const ratioTrend = [
  { period: "FY2023", dscr: 1.94, leverage: 2.62 },
  { period: "FY2024", dscr: 1.71, leverage: 2.83 },
  { period: "FY2025", dscr: 1.42, leverage: 3.23 },
  { period: "TTM", dscr: 1.28, leverage: 3.48 },
];

/* ----------------------------- Policy and KYC ----------------------------- */

export interface PolicyCheck {
  id: string;
  rule: string;
  reference: string;
  requirement: string;
  observed: string;
  result: "Pass" | "Exception" | "Fail" | "Manual";
}

export const policyChecks: PolicyCheck[] = [
  {
    id: "CP-101",
    rule: "Minimum DSCR — C&I revolving",
    reference: "Credit Policy §4.2.1",
    requirement: "≥ 1.25x on TTM basis",
    observed: "1.28x TTM",
    result: "Pass",
  },
  {
    id: "CP-104",
    rule: "Maximum total leverage",
    reference: "Credit Policy §4.2.4",
    requirement: "≤ 3.50x total debt / EBITDA",
    observed: "3.48x TTM",
    result: "Pass",
  },
  {
    id: "CP-118",
    rule: "Financial statement currency",
    reference: "Credit Policy §3.6",
    requirement: "Interim statements ≤ 120 days old",
    observed: "142 days (Q1 2026)",
    result: "Exception",
  },
  {
    id: "CP-133",
    rule: "Borrowing base advance rate",
    reference: "Credit Policy §6.1",
    requirement: "≤ 80% eligible A/R, ≤ 50% inventory",
    observed: "78% A/R, 45% inventory",
    result: "Pass",
  },
  {
    id: "CP-141",
    rule: "Single obligor concentration",
    reference: "Risk Appetite Statement §2.3",
    requirement: "≤ 1.5% of Tier 1 capital",
    observed: "0.94% post-approval",
    result: "Pass",
  },
  {
    id: "CP-152",
    rule: "Guarantor support",
    reference: "Credit Policy §5.4",
    requirement: "PFS on file for guarantors ≥ 20% ownership",
    observed: "PFS missing — J. Meridian (54%)",
    result: "Exception",
  },
  {
    id: "CP-160",
    rule: "Industry concentration — metal fabrication",
    reference: "Risk Appetite Statement §3.1",
    requirement: "≤ 6.0% of C&I portfolio",
    observed: "5.4% post-approval",
    result: "Pass",
  },
  {
    id: "CP-171",
    rule: "Delegated approval authority",
    reference: "Approval Matrix v9",
    requirement: "> $5.0MM requires Credit Officer II",
    observed: "$8.5MM — routed to Credit Officer II",
    result: "Manual",
  },
];

export interface KycCheck {
  id: string;
  check: string;
  detail: string;
  result: "Clear" | "Attention" | "Pending";
  refreshed: string;
}

export const kycChecks: KycCheck[] = [
  { id: "KYC-01", check: "Entity verification", detail: "Delaware corp, good standing, EIN verified", result: "Clear", refreshed: "2026-08-15" },
  { id: "KYC-02", check: "Beneficial ownership (UBO ≥ 25%)", detail: "2 of 2 UBOs identified and verified", result: "Clear", refreshed: "2026-08-15" },
  { id: "KYC-03", check: "Sanctions screening (OFAC/EU/UN)", detail: "No matches across entity, UBOs, directors", result: "Clear", refreshed: "2026-08-19" },
  { id: "KYC-04", check: "PEP screening", detail: "One potential match — J. Meridian, pending adjudication", result: "Attention", refreshed: "2026-08-19" },
  { id: "KYC-05", check: "Adverse media", detail: "2 low-relevance articles reviewed and cleared", result: "Clear", refreshed: "2026-08-19" },
  { id: "KYC-06", check: "AML risk rating", detail: "Medium — domestic manufacturer, cash-light", result: "Clear", refreshed: "2026-08-15" },
  { id: "KYC-07", check: "CIP documentation", detail: "Formation docs, operating agreement, ID for control persons", result: "Clear", refreshed: "2026-08-15" },
  { id: "KYC-08", check: "Periodic refresh cadence", detail: "Next refresh due 2027-08-15", result: "Pending", refreshed: "—" },
];

export interface UboNode {
  name: string;
  role: string;
  ownership: string;
  jurisdiction: string;
  level: number;
  flag?: string;
}

export const uboChain: UboNode[] = [
  { name: "Meridian Fabrication Group, Inc.", role: "Borrower", ownership: "—", jurisdiction: "Delaware, US", level: 0 },
  { name: "Meridian Holdings LLC", role: "Parent", ownership: "100%", jurisdiction: "Delaware, US", level: 1 },
  { name: "James Meridian", role: "Ultimate beneficial owner", ownership: "54%", jurisdiction: "US", level: 2, flag: "PEP potential match" },
  { name: "Anne-Marie Roth", role: "Ultimate beneficial owner", ownership: "31%", jurisdiction: "US", level: 2 },
  { name: "Employee Ownership Trust", role: "Minority holder", ownership: "15%", jurisdiction: "US", level: 2 },
];

/* --------------------------------- Agents --------------------------------- */

export interface AgentInsight {
  id: string;
  agent: "Financial agent" | "Credit policy agent" | "Compliance / KYC agent";
  headline: string;
  severity: "info" | "watch" | "critical";
  narrative: string;
  evidence: string[];
  confidence: number;
  generated: string;
}

export const agentInsights: AgentInsight[] = [
  {
    id: "AG-01",
    agent: "Financial agent",
    headline: "Margin compression is volume-driven, not pricing-driven",
    severity: "watch",
    narrative:
      "Revenue grew 9.0% in FY2025 while gross margin fell 80 bps to 24.6% and a further 90 bps on a TTM basis. Input cost pass-through lagged by roughly one quarter: steel cost per ton rose 11% while realized price per unit rose 6%. EBITDA is flat in absolute terms despite top-line growth, which is why leverage moved from 2.83x to 3.48x without new term debt.",
    evidence: [
      "Spread: Gross margin FY2024 25.4% → TTM 23.7%",
      "Spread: EBITDA $6.21MM FY2025 → $5.98MM TTM",
      "DOC-8841 p.13 — management discussion of raw material costs",
      "Benchmark: peer gross margin 24.1% (NAICS 332710)",
    ],
    confidence: 91,
    generated: "2026-08-20 09:14",
  },
  {
    id: "AG-02",
    agent: "Financial agent",
    headline: "Working capital absorbing cash faster than revenue growth",
    severity: "watch",
    narrative:
      "DSO extended from 72 to 79 days and inventory turns slowed from 3.89x to 3.69x. Combined, the working capital build consumed approximately $2.4MM of operating cash flow over the TTM period, which explains the $600K revolver increase despite positive net income. The requested line increase is consistent with this trend rather than with distress, but the borrowing base should be re-tested against the July A/R aging.",
    evidence: [
      "DOC-8846 — A/R aging Jul 2026, 11.2% over 90 days",
      "Spread: A/R $13.12MM → $13.91MM TTM",
      "Spread: Revolver outstanding $5.20MM → $5.80MM",
    ],
    confidence: 88,
    generated: "2026-08-20 09:14",
  },
  {
    id: "AG-03",
    agent: "Credit policy agent",
    headline: "Two policy exceptions require credit officer sign-off",
    severity: "critical",
    narrative:
      "CP-118 (statement currency) and CP-152 (guarantor PFS) are both open. Neither is a hard stop under the approval matrix, but both must be documented as exceptions with mitigants before the file leaves analyst review. Six comparable exceptions were granted for CP-118 in the last 12 months, all with a condition requiring updated interims within 30 days of closing.",
    evidence: [
      "Credit Policy §3.6 — interim statements ≤ 120 days",
      "Credit Policy §5.4 — guarantor PFS requirement",
      "Exception history: 6 CP-118 approvals in trailing 12 months",
      "Approval Matrix v9 — $8.5MM requires Credit Officer II",
    ],
    confidence: 96,
    generated: "2026-08-20 09:16",
  },
  {
    id: "AG-04",
    agent: "Credit policy agent",
    headline: "All quantitative thresholds are within appetite, with limited headroom",
    severity: "info",
    narrative:
      "DSCR of 1.28x clears the 1.25x floor by 3 bps of coverage and leverage of 3.48x clears the 3.50x ceiling by 0.02x. Both are within policy but leave effectively no cushion; a 5% EBITDA decline would breach both. Recommend a financial covenant package tested quarterly rather than annually.",
    evidence: [
      "Credit Policy §4.2.1 — minimum DSCR 1.25x",
      "Credit Policy §4.2.4 — maximum leverage 3.50x",
      "Sensitivity: −5% EBITDA → DSCR 1.21x, leverage 3.66x",
    ],
    confidence: 93,
    generated: "2026-08-20 09:16",
  },
  {
    id: "AG-05",
    agent: "Compliance / KYC agent",
    headline: "Ownership chain fully resolved; one PEP match pending adjudication",
    severity: "watch",
    narrative:
      "The ownership chain resolves cleanly to two natural persons above the 25% threshold through a single Delaware holding company. Sanctions and adverse media screening are clear. A potential PEP match on James Meridian relates to a state-level advisory board appointment in 2019; this appears to be a name-and-jurisdiction match requiring analyst adjudication rather than a true positive.",
    evidence: [
      "DOC-8847 — ownership / org chart",
      "KYC-02 — 2 of 2 UBOs verified",
      "KYC-04 — PEP potential match, unresolved",
      "FIBO entity-ownership model applied to holdco chain",
    ],
    confidence: 87,
    generated: "2026-08-20 09:18",
  },
  {
    id: "AG-06",
    agent: "Compliance / KYC agent",
    headline: "Missing documentation blocks file completeness",
    severity: "watch",
    narrative:
      "Guarantor personal financial statement and the 2026–2027 property & casualty insurance certificate are outstanding. The PFS is also the trigger for policy exception CP-152; obtaining it resolves both the compliance gap and one of the two open exceptions.",
    evidence: ["DOC-8848 — Guarantor PFS, status Missing", "DOC-8849 — Insurance certificate, status Queued", "Credit Policy §5.4"],
    confidence: 94,
    generated: "2026-08-20 09:18",
  },
];

export const agentRoster = [
  { name: "Financial agent", status: "Active", scope: "Spread narrative, ratio movement, benchmark context" },
  { name: "Credit policy agent", status: "Active", scope: "Policy, risk appetite, approval matrix, exception history" },
  { name: "Compliance / KYC agent", status: "Active", scope: "KYC/AML completeness, UBO chain, screening" },
  { name: "Collateral agent", status: "Phase 2", scope: "Out of MVP scope" },
  { name: "Covenant agent", status: "Phase 2", scope: "Out of MVP scope" },
  { name: "Industry / benchmark agent", status: "Phase 2", scope: "Out of MVP scope" },
  { name: "Relationship agent", status: "Phase 3", scope: "Out of MVP scope" },
];

/* -------------------------------- Decision -------------------------------- */

export const recommendation = {
  outcome: "Approve with conditions",
  confidence: 84,
  riskRating: "5 / Pass",
  structure: "$8.5MM revolving line of credit, 24-month tenor, SOFR + 275 bps",
  rationale:
    "Meridian is a profitable, growing manufacturer with adequate but tightening coverage. Margin compression is explainable and cyclical rather than structural, and the requested increase funds a working capital build consistent with revenue growth. Coverage and leverage clear policy with minimal headroom, which argues for a tighter covenant package and quarterly monitoring rather than declination.",
  strengths: [
    "22% revenue growth over two years with positive net income in every period",
    "Ownership chain fully resolved; sanctions and adverse media clear",
    "Collateral coverage 1.42x on eligible borrowing base",
    "14-year relationship, no past dues or prior exceptions",
  ],
  concerns: [
    "TTM DSCR of 1.28x leaves 3 bps of headroom over the policy floor",
    "Leverage at 3.48x against a 3.50x ceiling",
    "DSO at 79 days exceeds the 75-day policy guideline",
    "Two open policy exceptions pending credit officer sign-off",
  ],
  conditions: [
    "Updated interim financial statements within 30 days of closing (resolves CP-118)",
    "Guarantor personal financial statement for J. Meridian prior to funding (resolves CP-152)",
    "Quarterly financial covenants: minimum DSCR 1.20x, maximum leverage 3.75x",
    "Monthly borrowing base certificate with A/R aging",
    "Adjudicate PEP potential match (KYC-04) prior to funding",
  ],
};

export const approvalChain = [
  { role: "Credit analyst", name: "D. Okafor", status: "Completed", date: "2026-08-20", note: "Recommendation prepared" },
  { role: "Credit officer II", name: "R. Vasquez", status: "In progress", date: "—", note: "Pending review of two exceptions" },
  { role: "Funding & booking", name: "Operations", status: "Not started", date: "—", note: "Awaiting approval" },
];

/* ------------------------------- Audit trail ------------------------------- */

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: "Human" | "Engine" | "Agent" | "System";
  action: string;
  detail: string;
  engine: string;
  hash: string;
}

export const auditTrail: AuditEntry[] = [
  {
    id: "EV-0001",
    timestamp: "2026-08-14 08:41:12",
    actor: "S. Bellamy",
    actorType: "Human",
    action: "Case created",
    detail: "CC-2026-0481 opened for Meridian Fabrication Group, Inc. — $8.5MM revolving line",
    engine: "Workflow Intelligence",
    hash: "0x7ac1…9f2b",
  },
  {
    id: "EV-0002",
    timestamp: "2026-08-14 08:52:03",
    actor: "Intake service",
    actorType: "System",
    action: "Documents ingested",
    detail: "2 documents received from borrower portal (DOC-8841, DOC-8842)",
    engine: "Workflow Intelligence",
    hash: "0x3d90…1c47",
  },
  {
    id: "EV-0003",
    timestamp: "2026-08-14 09:06:55",
    actor: "Extraction pipeline",
    actorType: "Engine",
    action: "Extraction completed",
    detail: "214 fields extracted from DOC-8841 at 97% mean confidence; 2 fields flagged for review",
    engine: "Knowledge Intelligence",
    hash: "0xb112…88ea",
  },
  {
    id: "EV-0004",
    timestamp: "2026-08-16 11:22:40",
    actor: "Spread engine",
    actorType: "Engine",
    action: "Financial spread generated",
    detail: "FY2023–FY2025 and TTM spread produced under GAAP mapping 2026.1",
    engine: "Deterministic Intelligence",
    hash: "0x51fe…4d03",
  },
  {
    id: "EV-0005",
    timestamp: "2026-08-16 11:22:41",
    actor: "Ratio engine",
    actorType: "Engine",
    action: "Ratios calculated",
    detail: "7 ratios computed; DSCR 1.28x, total leverage 3.48x, DSO 79 days",
    engine: "Deterministic Intelligence",
    hash: "0x51fe…4d04",
  },
  {
    id: "EV-0006",
    timestamp: "2026-08-18 14:03:19",
    actor: "D. Okafor",
    actorType: "Human",
    action: "Extracted value corrected",
    detail: "Long-term debt changed from $12,860,000 to $14,860,000 — subordinated note per Note 11",
    engine: "Knowledge Intelligence",
    hash: "0x9ce2…7710",
  },
  {
    id: "EV-0007",
    timestamp: "2026-08-18 14:03:22",
    actor: "Ratio engine",
    actorType: "Engine",
    action: "Ratios recalculated",
    detail: "Leverage restated 3.05x → 3.48x following long-term debt correction",
    engine: "Deterministic Intelligence",
    hash: "0x9ce2…7711",
  },
  {
    id: "EV-0008",
    timestamp: "2026-08-19 07:45:08",
    actor: "Policy rules engine",
    actorType: "Engine",
    action: "Policy evaluation run",
    detail: "8 rules evaluated against Credit Policy v14.2 — 5 pass, 2 exceptions, 1 manual",
    engine: "Deterministic Intelligence",
    hash: "0x2a7d…b591",
  },
  {
    id: "EV-0009",
    timestamp: "2026-08-19 08:12:44",
    actor: "Compliance / KYC agent",
    actorType: "Agent",
    action: "KYC assessment produced",
    detail: "UBO chain resolved to 2 natural persons; 1 PEP potential match raised for adjudication",
    engine: "Cognitive Intelligence",
    hash: "0xf034…2266",
  },
  {
    id: "EV-0010",
    timestamp: "2026-08-20 09:14:02",
    actor: "Financial agent",
    actorType: "Agent",
    action: "Insight generated",
    detail: "Margin compression attributed to input cost pass-through lag — confidence 91%",
    engine: "Cognitive Intelligence",
    hash: "0x6b8c…0d19",
  },
  {
    id: "EV-0011",
    timestamp: "2026-08-20 09:16:37",
    actor: "Credit policy agent",
    actorType: "Agent",
    action: "Insight generated",
    detail: "Two open exceptions summarised with 12-month exception precedent — confidence 96%",
    engine: "Cognitive Intelligence",
    hash: "0x6b8c…0d20",
  },
  {
    id: "EV-0012",
    timestamp: "2026-08-20 15:31:50",
    actor: "D. Okafor",
    actorType: "Human",
    action: "Recommendation submitted",
    detail: "Approve with conditions — 5 conditions attached; routed to Credit Officer II",
    engine: "Workflow Intelligence",
    hash: "0xdd41…c802",
  },
  {
    id: "EV-0013",
    timestamp: "2026-08-21 08:02:11",
    actor: "Routing service",
    actorType: "System",
    action: "Approval routed",
    detail: "Assigned to R. Vasquez under Approval Matrix v9 (> $5.0MM, Credit Officer II)",
    engine: "Workflow Intelligence",
    hash: "0x08fa…5b3e",
  },
];

/* -------------------------------- Utilities ------------------------------- */

export function currency(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}
