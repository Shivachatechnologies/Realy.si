/**
 * Realy.si — default site content & DEMO data (shared by server + client).
 *
 * The server seeds MongoDB from this file (`npm run seed`) and falls back to it
 * when no database is configured. The client renders it instantly while the
 * live payload loads from `GET /api/site`.
 *
 * Values marked DEMO are illustrative UI values only — not real customers,
 * revenue or statistics.
 */
const siteData = {
  links: {
    signup: "https://app.realy.si/signup",
    login: "https://app.realy.si/login",
  },

  /* ---------------------------------------------------------------- Hero */
  // DEMO — hero command-center visual.
  hero: {
    company: "Nova AI",
    launchProgress: 68,
    agents: [
      { role: "AI CEO", status: "Working", tone: "live" },
      { role: "AI CTO", status: "Building", tone: "live" },
      { role: "AI CMO", status: "Optimizing", tone: "live" },
      { role: "AI Sales", status: "42 leads", tone: "info" },
    ],
  },

  /* ------------------------------------------------------- Command center */
  // DEMO — every view in the dashboard section. `metrics[].value` is numeric
  // so it can count up; `format` controls display.
  dashboard: {
    company: "Nova AI",
    views: [
      {
        id: "company",
        label: "Company",
        title: "Company overview",
        subtitle: "Week 14 · Launch phase",
        metrics: [
          { label: "Revenue", value: 84200, format: "currency", delta: "+12.4%" },
          { label: "Pipeline", value: 184000, format: "currency", delta: "+8.1%" },
          { label: "Leads", value: 1284, format: "number", delta: "+214" },
          { label: "Product", value: 68, format: "percent", delta: "to launch" },
          { label: "AI Team", value: 12, format: "number", suffix: " active", delta: "4 depts" },
        ],
        series: [22, 26, 25, 31, 34, 33, 41, 46, 44, 52, 58, 61, 67, 72, 79, 84],
        seriesLabel: "Revenue, last 16 weeks",
        rows: [
          { who: "AI CEO", what: "Approved Q3 launch plan", meta: "2m ago", tone: "live" },
          { who: "AI CTO", what: "Deployed onboarding v2 to staging", meta: "14m ago", tone: "live" },
          { who: "AI CMO", what: "Launched 3 campaign variants", meta: "38m ago", tone: "info" },
          { who: "AI Sales", what: "Qualified 42 new leads", meta: "1h ago", tone: "info" },
        ],
      },
      {
        id: "revenue",
        label: "Revenue",
        title: "Revenue",
        subtitle: "Recognized + recurring",
        metrics: [
          { label: "MRR", value: 84200, format: "currency", delta: "+12.4%" },
          { label: "Customers", value: 312, format: "number", delta: "+28" },
          { label: "ARPA", value: 270, format: "currency", delta: "+3.2%" },
          { label: "Churn", value: 1.8, format: "percent1", delta: "−0.4 pts" },
        ],
        series: [40, 42, 45, 44, 49, 53, 55, 58, 63, 66, 70, 74, 76, 79, 82, 84],
        seriesLabel: "MRR, last 16 weeks",
        rows: [
          { who: "Growth plan", what: "184 subscriptions", meta: "$49,600", tone: "info" },
          { who: "Founder plan", what: "121 subscriptions", meta: "$24,100", tone: "info" },
          { who: "Enterprise", what: "7 contracts", meta: "$10,500", tone: "info" },
        ],
      },
      {
        id: "projects",
        label: "Projects",
        title: "Projects",
        subtitle: "6 active · 2 awaiting approval",
        metrics: [
          { label: "Active", value: 6, format: "number", delta: "on track" },
          { label: "Shipped", value: 24, format: "number", delta: "this quarter" },
          { label: "Awaiting you", value: 2, format: "number", delta: "approvals" },
        ],
        rows: [
          { who: "Public launch", what: "Landing, pricing, docs", meta: "68%", tone: "live" },
          { who: "Mobile app", what: "iOS + Android beta", meta: "41%", tone: "live" },
          { who: "Partner program", what: "Terms, portal, outreach", meta: "Review", tone: "warn" },
          { who: "SOC 2 readiness", what: "Policies + controls", meta: "22%", tone: "info" },
        ],
      },
      {
        id: "team",
        label: "AI Team",
        title: "AI Team",
        subtitle: "12 agents across 4 departments",
        metrics: [
          { label: "Active agents", value: 12, format: "number", delta: "all healthy" },
          { label: "Tasks today", value: 186, format: "number", delta: "+31" },
          { label: "Auto-approved", value: 74, format: "percent", delta: "of tasks" },
        ],
        rows: [
          { who: "AI CEO", what: "Strategy & prioritization", meta: "Working", tone: "live" },
          { who: "AI CTO", what: "Engineering · 4 agents", meta: "Building", tone: "live" },
          { who: "AI CMO", what: "Marketing · 3 agents", meta: "Optimizing", tone: "live" },
          { who: "AI Sales", what: "Sales · 3 agents", meta: "Prospecting", tone: "info" },
        ],
      },
      {
        id: "products",
        label: "Products",
        title: "Products",
        subtitle: "2 live · 1 in development",
        metrics: [
          { label: "Live products", value: 2, format: "number", delta: "healthy" },
          { label: "Uptime", value: 99.9, format: "percent1", delta: "30 days" },
          { label: "Releases", value: 18, format: "number", delta: "this month" },
        ],
        rows: [
          { who: "Nova Web", what: "SaaS · v2.4.1", meta: "Live", tone: "live" },
          { who: "Nova API", what: "Platform · v1.9.0", meta: "Live", tone: "live" },
          { who: "Nova Mobile", what: "iOS + Android", meta: "Beta", tone: "warn" },
        ],
      },
      {
        id: "marketing",
        label: "Marketing",
        title: "Marketing",
        subtitle: "5 campaigns running",
        metrics: [
          { label: "Visitors", value: 48210, format: "number", delta: "+18%" },
          { label: "Signups", value: 1932, format: "number", delta: "+22%" },
          { label: "CAC", value: 41, format: "currency", delta: "−9%" },
        ],
        series: [12, 14, 13, 17, 19, 22, 21, 26, 29, 31, 30, 35, 38, 41, 45, 48],
        seriesLabel: "Visitors (k), last 16 weeks",
        rows: [
          { who: "Launch week", what: "Email + social", meta: "Running", tone: "live" },
          { who: "SEO cluster", what: "24 articles", meta: "Publishing", tone: "live" },
          { who: "Paid search", what: "3 variants", meta: "Testing", tone: "info" },
        ],
      },
      {
        id: "sales",
        label: "Sales",
        title: "Sales",
        subtitle: "Pipeline by stage",
        metrics: [
          { label: "Pipeline", value: 184000, format: "currency", delta: "+8.1%" },
          { label: "Leads", value: 1284, format: "number", delta: "+214" },
          { label: "Win rate", value: 23, format: "percent", delta: "+2 pts" },
        ],
        rows: [
          { who: "Qualified", what: "86 deals", meta: "$92,000", tone: "info" },
          { who: "Proposal", what: "31 deals", meta: "$58,000", tone: "live" },
          { who: "Negotiation", what: "9 deals", meta: "$34,000", tone: "warn" },
        ],
      },
      {
        id: "tasks",
        label: "Tasks",
        title: "Tasks",
        subtitle: "Today",
        metrics: [
          { label: "Completed", value: 138, format: "number", delta: "by AI team" },
          { label: "In progress", value: 46, format: "number", delta: "on schedule" },
          { label: "Need approval", value: 2, format: "number", delta: "founder" },
        ],
        rows: [
          { who: "Approve", what: "Partner agreement draft", meta: "Founder", tone: "warn" },
          { who: "Approve", what: "Q3 marketing budget", meta: "Founder", tone: "warn" },
          { who: "Done", what: "Investor update drafted", meta: "AI CEO", tone: "live" },
          { who: "Done", what: "Bug triage · 17 issues", meta: "AI CTO", tone: "live" },
        ],
      },
    ],
  },

  /* ------------------------------------------------------- Company setup */
  // Entity types are general examples. Final structure is confirmed with
  // licensed local partners.
  jurisdictions: [
    { id: "us", name: "USA", entity: "Delaware C-Corp or LLC", note: "Common choice for venture-backed startups." },
    { id: "uk", name: "UK", entity: "Private limited company (Ltd)", note: "Registered with Companies House." },
    { id: "ae", name: "UAE", entity: "Free zone company (FZ-LLC)", note: "Free zone selected for your activity." },
    { id: "sg", name: "Singapore", entity: "Private limited company (Pte. Ltd.)", note: "Registered with ACRA." },
    { id: "in", name: "India", entity: "Private limited company (Pvt. Ltd.)", note: "Registered with the MCA." },
    { id: "more", name: "More", entity: "Additional jurisdictions", note: "Coverage expands through our partner network." },
  ],

  /* ------------------------------------------------- Product development */
  products: [
    { name: "Landing Page", scope: "A single, conversion-focused page." },
    { name: "Website", scope: "Multi-page site with CMS." },
    { name: "MVP", scope: "Core product, auth, payments." },
    { name: "Mobile App", scope: "iOS and Android, one codebase." },
    { name: "AI SaaS", scope: "Models, agents, billing, admin." },
    { name: "FinTech", scope: "Ledgers, KYC flows, compliance-ready." },
    { name: "Enterprise", scope: "Custom platforms at scale." },
  ],

  /* ---------------------------------------------- White-label marketplace */
  // PLACEHOLDER listings — generic names until the real catalog is connected.
  marketplace: {
    total: "50+",
    categories: ["FinTech", "Trading", "Web3", "AI", "SaaS", "Gaming", "Marketplace"],
    items: [
      { name: "Neobank Core", category: "FinTech", desc: "Accounts, cards and payments." },
      { name: "Exchange Engine", category: "Trading", desc: "Order book and matching engine." },
      { name: "Token Launchpad", category: "Web3", desc: "Issuance, vesting and claims." },
      { name: "Agent Studio", category: "AI", desc: "Build and deploy AI agents." },
      { name: "Subscription Suite", category: "SaaS", desc: "Billing, seats and admin." },
      { name: "Casual Games Hub", category: "Gaming", desc: "Lobby, wallets and leaderboards." },
      { name: "Services Market", category: "Marketplace", desc: "Two-sided booking platform." },
      { name: "Payments Gateway", category: "FinTech", desc: "Checkout and payouts." },
      { name: "Copy Trading", category: "Trading", desc: "Strategy following and risk limits." },
      { name: "Wallet Suite", category: "Web3", desc: "Custodial and self-custody wallets." },
      { name: "AI Support Desk", category: "AI", desc: "Automated customer support." },
      { name: "B2B Marketplace", category: "Marketplace", desc: "Catalogs, quotes and orders." },
    ],
  },

  /* ---------------------------------------------------------- AI employees */
  org: {
    command: "Launch my company.",
    ceo: { role: "AI CEO", task: "Plans the launch" },
    executives: [
      { role: "AI COO", task: "Operations" },
      { role: "AI CTO", task: "Technology" },
      { role: "AI CFO", task: "Finance" },
      { role: "AI CMO", task: "Growth" },
    ],
    departments: [
      { name: "Research", task: "Market map ready" },
      { name: "Brand", task: "Identity drafted" },
      { name: "Product", task: "Spec v1 written" },
      { name: "Engineering", task: "Repo scaffolded" },
      { name: "Marketing", task: "Launch plan set" },
      { name: "Sales", task: "ICP + sequences" },
    ],
  },

  /* --------------------------------------------------------------- Pricing */
  pricing: [
    {
      name: "Founder",
      price: "$99",
      period: "/month",
      blurb: "For a single founder starting out.",
      features: ["Core AI executive team", "Company blueprint", "Command center"],
      plan: "founder",
    },
    {
      name: "Growth",
      price: "$499",
      period: "/month",
      blurb: "For companies building and launching.",
      features: ["Full AI department team", "Marketing & sales agents", "Approval workflows"],
      plan: "growth",
      recommended: true,
    },
    {
      name: "Scale",
      price: "$999",
      period: "/month",
      blurb: "For companies running at speed.",
      features: ["Higher task capacity", "Multiple products", "Priority support"],
      plan: "scale",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      blurb: "For portfolios, studios and groups.",
      features: ["Multiple companies", "Custom agents", "Dedicated team"],
      plan: "enterprise",
      cta: "Talk to us",
    },
  ],
};

export default siteData;
