export const marketSnapshots = [
  { label: "Forex Pairs", value: "80+", detail: "Major, minor, and emerging FX access" },
  { label: "Indices", value: "25", detail: "US, EU, and APAC benchmark coverage" },
  { label: "Equities", value: "4,000+", detail: "NYSE, NASDAQ, LSE, and regional venues" },
  { label: "Crypto ETFs", value: "5", detail: "Digital asset products and custody paths" },
  { label: "Sovereign Bonds", value: "12", detail: "Treasury and fixed income workflows" },
  { label: "Commodities", value: "18", detail: "Metals, energy, and macro hedging products" },
];

export const marketAccessMatrix = [
  {
    desk: "Prime FX Desk",
    region: "London / New York",
    latency: "11ms",
    depth: "$740M",
    status: "Live",
    routes: ["Spot FX", "NDF", "Metals"],
  },
  {
    desk: "Equity DMA Hub",
    region: "US / EU / APAC",
    latency: "19ms",
    depth: "4,120 symbols",
    status: "Live",
    routes: ["NYSE", "NASDAQ", "LSE"],
  },
  {
    desk: "Fixed Income Desk",
    region: "Zurich / Singapore",
    latency: "31ms",
    depth: "$2.8B",
    status: "Review",
    routes: ["UST", "Bunds", "Sovereign"],
  },
  {
    desk: "Digital Asset Venue",
    region: "Frankfurt / Tokyo",
    latency: "24ms",
    depth: "$460M",
    status: "Custody Gate",
    routes: ["ETF", "Spot", "Cold Custody"],
  },
];

export const marketSessions = [
  { label: "Asia Open", window: "08:00-15:00 ICT", focus: "JPY, HKEX, regional indices", volume: "Medium" },
  { label: "London Core", window: "14:00-22:00 ICT", focus: "FX majors, metals, bonds", volume: "High" },
  { label: "New York Overlap", window: "19:30-23:30 ICT", focus: "US equities, USD rates, crude", volume: "Peak" },
];

export const analysisItems = [
  { title: "Liquidity Routing", body: "Compare venues by asset focus, execution access, and institutional fit." },
  { title: "Counterparty Review", body: "Shortlist brokers from detail pages and keep candidates locally for review." },
  { title: "Search Intelligence", body: "Use debounced search and broker type filters backed by the API query layer." },
  { title: "Profile Quality", body: "Review website, logo, description, and broker type consistency before submission." },
];

export const brokerSignalScores = [
  { broker: "Blackwood Capital Markets", type: "CFD", liquidity: 96, compliance: 94, execution: 91, fit: "Sovereign wealth desk" },
  { broker: "Vanguard Capital", type: "Stock", liquidity: 89, compliance: 92, execution: 87, fit: "Equity DMA allocation" },
  { broker: "Meridian Bonds", type: "Bond", liquidity: 84, compliance: 96, execution: 82, fit: "Fixed income mandate" },
  { broker: "BlockStream Prime", type: "Crypto", liquidity: 81, compliance: 88, execution: 90, fit: "Digital custody review" },
];

export const analysisPlaybook = [
  { phase: "Screen", metric: "Regulatory status, broker type, public footprint", result: "Remove weak or incomplete counterparties" },
  { phase: "Compare", metric: "Asset coverage, execution path, venue concentration", result: "Rank by desk suitability" },
  { phase: "Shortlist", metric: "Operational fit, contact channel, documentation readiness", result: "Prepare candidates for onboarding" },
];

export const educationItems = [
  {
    title: "CFD",
    body: "Use CFD brokers for leveraged multi-asset exposure and short-term directional strategies.",
    checklist: ["Margin policy", "Negative balance terms", "Liquidity provider disclosure"],
  },
  {
    title: "Bond",
    body: "Use bond desks for sovereign debt, fixed income allocation, and yield-focused workflows.",
    checklist: ["CUSIP/ISIN coverage", "Settlement window", "Primary dealer access"],
  },
  {
    title: "Stock",
    body: "Use stock brokers for listed equities, ETFs, and direct exchange access.",
    checklist: ["DMA venue list", "Corporate actions", "Custody segregation"],
  },
  {
    title: "Crypto",
    body: "Use crypto venues for digital asset execution, custody paths, and ETF-linked products.",
    checklist: ["Cold storage policy", "Travel rule support", "Proof-of-reserves posture"],
  },
];

export const educationModules = [
  { title: "Due Diligence Pack", minutes: "18 min", outcome: "Know which broker documents to collect before submission." },
  { title: "Execution Venue Basics", minutes: "24 min", outcome: "Understand routing, spreads, depth, and slippage trade-offs." },
  { title: "Institutional Custody", minutes: "16 min", outcome: "Review segregation, withdrawal controls, and reporting standards." },
];
