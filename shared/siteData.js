/**
 * Realy.si — default site content & DEMO data (shared by server + client).
 *
 * - The server seeds MongoDB from this file (`npm run seed`) and falls back to it
 *   when no database is configured.
 * - The client renders it instantly, then swaps in the live payload from
 *   `GET /api/site` (same shape).
 *
 * Values marked DEMO are illustrative interface values only — they are not real
 * customers, revenue or statistics. Replace them with live company data.
 */
const siteData = {
  links: {
    signup: "https://app.realy.si/signup",
    login: "https://app.realy.si/login",
    app: "https://app.realy.si",
  },

  /* Hero: systems the intelligence core coordinates, in three tiers. DEMO telemetry. */
  systems: [
    { key: "product", name: "Product", tier: "Build", status: "Planning", agents: 6, rate: 38 },
    { key: "market", name: "Market", tier: "Understand", status: "Analyzing", agents: 4, rate: 52 },
    { key: "capital", name: "Capital", tier: "Fund", status: "Optimizing", agents: 3, rate: 17 },
    { key: "engineering", name: "Engineering", tier: "Build", status: "Executing", agents: 9, rate: 64 },
    { key: "marketing", name: "Marketing", tier: "Understand", status: "Executing", agents: 7, rate: 81 },
    { key: "finance", name: "Finance", tier: "Fund", status: "Analyzing", agents: 3, rate: 22 },
    { key: "sales", name: "Sales", tier: "Build", status: "Executing", agents: 6, rate: 57 },
    { key: "operations", name: "Operations", tier: "Understand", status: "Optimizing", agents: 5, rate: 33 },
    { key: "growth", name: "Growth", tier: "Fund", status: "Thinking", agents: 4, rate: 29 },
  ],

  /* Capabilities of the intelligence system. */
  capabilities: [
    { name: "Research", text: "Reads markets, competitors and customers continuously." },
    { name: "Reasoning", text: "Weighs trade-offs and explains every decision it proposes." },
    { name: "Planning", text: "Turns one objective into a sequenced, dependency-aware plan." },
    { name: "Creation", text: "Writes, designs and builds the assets the plan requires." },
    { name: "Execution", text: "Runs the work across every function in parallel." },
    { name: "Monitoring", text: "Watches outcomes, metrics and risks in real time." },
    { name: "Optimization", text: "Learns from results and re-plans without being asked." },
  ],

  /* "Launch my company." → stages → hundreds of tasks (DEMO visualization). */
  decomposition: {
    instruction: "Launch my company.",
    stages: [
      { name: "Strategy", tasks: ["Market thesis", "90-day objectives", "Unit economics"] },
      { name: "Research", tasks: ["Competitor map", "Customer interviews", "Demand signals"] },
      { name: "Brand", tasks: ["Name", "Identity", "Voice"] },
      { name: "Product", tasks: ["Spec", "Roadmap", "Success metrics"] },
      { name: "Engineering", tasks: ["Infrastructure", "MVP build", "Test suite"] },
      { name: "Marketing", tasks: ["Positioning", "Launch content", "Channels"] },
      { name: "Sales", tasks: ["ICP", "Lead lists", "Sequences"] },
      { name: "Operations", tasks: ["Workspace", "Processes", "Formation prep"] },
      { name: "Growth", tasks: ["Experiments", "Funnels", "Retention loops"] },
    ],
    tasksPerStage: 36,
  },

  /* Company intelligence graph: one layer coordinating every system. */
  graph: {
    center: "Realy Intelligence",
    nodes: [
      { key: "strategy", name: "Strategy", text: "Objectives, priorities and trade-offs." },
      { key: "research", name: "Research", text: "Markets, competitors and customers." },
      { key: "product", name: "Product", text: "Specs, roadmap and success metrics." },
      { key: "engineering", name: "Engineering", text: "Architecture, builds and releases." },
      { key: "design", name: "Design", text: "Interfaces, identity and assets." },
      { key: "marketing", name: "Marketing", text: "Positioning, content and campaigns." },
      { key: "sales", name: "Sales", text: "Pipeline, outreach and closing." },
      { key: "finance", name: "Finance", text: "Budget, forecasting and runway." },
      { key: "operations", name: "Operations", text: "Processes, vendors and tooling." },
      { key: "legal", name: "Legal", text: "Drafts and workflows for qualified review." },
      { key: "success", name: "Customer Success", text: "Onboarding, support and retention." },
      { key: "analytics", name: "Analytics", text: "Metrics, attribution and forecasting." },
    ],
    links: [
      ["strategy", "research"], ["strategy", "finance"], ["research", "product"], ["product", "engineering"],
      ["product", "design"], ["design", "marketing"], ["marketing", "sales"], ["sales", "success"],
      ["sales", "finance"], ["finance", "legal"], ["operations", "legal"], ["analytics", "marketing"],
      ["analytics", "product"], ["success", "analytics"], ["operations", "engineering"],
    ],
  },

  /* Digital workforce map. Status cycles are illustrative. */
  workforce: {
    center: "Realy Intelligence",
    executives: ["CEO", "CTO", "CMO", "CFO", "COO"],
    functions: ["Product", "Engineering", "Design", "Research", "Marketing", "Sales", "Finance", "Operations", "Support"],
    statuses: ["Thinking", "Planning", "Executing", "Analyzing", "Optimizing", "Waiting for approval"],
  },

  /* From thought to company: each stage hands an artifact to the next. */
  pipeline: [
    { name: "Idea", out: "One sentence from the founder.", artifact: ["Objective", "Constraints", "Ambition"] },
    { name: "Research", out: "Market map, competitors, demand signals.", artifact: ["Market map", "Competitor set", "Customer segments"] },
    { name: "Validation", out: "Evidence the idea is worth building.", artifact: ["Demand tests", "Pricing signals", "Go / no-go"] },
    { name: "Strategy", out: "Positioning, model, 90-day plan.", artifact: ["Positioning", "Business model", "90-day plan"] },
    { name: "Brand", out: "Name, identity, voice, website.", artifact: ["Name", "Identity system", "Website"] },
    { name: "Company", out: "Entity, documents, operations.", artifact: ["Entity", "Documents", "Operations"] },
    { name: "Product", out: "Spec, design, engineering, QA.", artifact: ["Specification", "Design", "Release"] },
    { name: "Launch", out: "Go-live across every channel.", artifact: ["Launch plan", "Content", "Channels"] },
    { name: "Customers", out: "Pipeline, onboarding, support.", artifact: ["Pipeline", "Onboarding", "Support"] },
    { name: "Growth", out: "Experiments that compound.", artifact: ["Experiments", "Funnels", "Retention"] },
  ],

  /* Existing products: connect sources, then the system takes over. */
  connect: {
    sources: [
      { name: "Website", kind: "Pages, forms, traffic" },
      { name: "App", kind: "Product usage events" },
      { name: "GitHub", kind: "Code and releases" },
      { name: "CRM", kind: "Contacts and deals" },
      { name: "Analytics", kind: "Funnels and cohorts" },
      { name: "Payments", kind: "Revenue and churn" },
      { name: "Database", kind: "Product data" },
      { name: "Marketing", kind: "Campaigns and audiences" },
      { name: "Custom systems", kind: "APIs and webhooks" },
    ],
    flow: [
      { name: "Connect", text: "Link the systems you already run." },
      { name: "Understand", text: "Build a model of the product and the business." },
      { name: "Improve", text: "Ship fixes and features from real usage." },
      { name: "Market", text: "Position and promote what already works." },
      { name: "Sell", text: "Turn interest into pipeline and revenue." },
      { name: "Scale", text: "Compound what moves the numbers." },
    ],
  },

  /* Founder command center (DEMO values). */
  commandCenter: {
    company: "Nova",
    period: "Live · Week 14",
    business: [
      { key: "revenue", label: "Revenue", value: 84200, format: "currency", delta: "+12.4%", series: [22, 26, 25, 31, 34, 33, 41, 46, 44, 52, 58, 61, 67, 72, 79, 84] },
      { key: "mrr", label: "MRR", value: 31600, format: "currency", delta: "+9.8%", series: [12, 13, 14, 14, 16, 17, 19, 20, 21, 23, 24, 26, 27, 29, 30, 31] },
      { key: "customers", label: "Customers", value: 312, format: "number", delta: "+28", series: [120, 132, 140, 151, 166, 180, 194, 205, 221, 238, 250, 262, 277, 289, 301, 312] },
      { key: "pipeline", label: "Pipeline", value: 184000, format: "currency", delta: "+8.1%", series: [90, 96, 101, 99, 112, 118, 121, 130, 138, 141, 150, 158, 166, 171, 179, 184] },
      { key: "cash", label: "Cash", value: 412000, format: "currency", delta: "−2.1%", series: [450, 446, 441, 438, 436, 431, 428, 426, 423, 421, 419, 418, 416, 415, 413, 412] },
      { key: "runway", label: "Runway", value: 19, format: "number", suffix: " mo", delta: "+1 mo", series: [16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19] },
      { key: "growth", label: "Growth", value: 14.2, format: "percent1", delta: "MoM", series: [6, 7, 7, 8, 9, 9, 10, 11, 11, 12, 12, 13, 13, 14, 14, 14] },
      { key: "conversion", label: "Conversion", value: 3.9, format: "percent1", delta: "+0.6 pts", series: [2.4, 2.5, 2.7, 2.6, 2.9, 3.0, 3.1, 3.1, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.8, 3.9] },
    ],
    intelligence: {
      systemIntelligence: 0.87,
      systemHealth: 0.98,
      activeSystems: 14,
      activeAgents: 46,
      objectives: 12,
      autonomousActions: 1842,
      pendingApprovals: 3,
      riskSignals: 2,
      opportunities: 7,
    },
    stream: [
      { fn: "Engineering", text: "Deployed onboarding v2 to production", mode: "auto" },
      { fn: "Sales", text: "Qualified 42 inbound leads", mode: "auto" },
      { fn: "Finance", text: "Q3 budget reallocation prepared", mode: "approval" },
      { fn: "Marketing", text: "Paused underperforming campaign variant", mode: "auto" },
      { fn: "Research", text: "New competitor pricing detected", mode: "signal" },
      { fn: "Legal", text: "Partner agreement drafted for review", mode: "approval" },
      { fn: "Support", text: "Resolved 118 tickets · CSAT 96%", mode: "auto" },
      { fn: "Product", text: "Roadmap re-prioritized from usage data", mode: "auto" },
    ],
  },

  /* Autonomy layers. */
  autonomy: [
    {
      key: "autonomous",
      name: "Autonomous",
      text: "The system executes approved, low-risk work on its own and logs every action.",
      examples: ["Publish scheduled content", "Triage and resolve support", "Ship approved code", "Qualify inbound leads"],
    },
    {
      key: "supervised",
      name: "Supervised",
      text: "The system prepares the decision, shows its reasoning and requests approval.",
      examples: ["Launch a paid campaign", "Send outbound at scale", "Change pricing", "Hire a contractor"],
    },
    {
      key: "founder",
      name: "Founder control",
      text: "Major strategic, legal, financial and ownership decisions remain with the founder.",
      examples: ["Sign contracts", "Move funds", "Raise capital", "Change ownership"],
    },
  ],

  /* Product engineering. Price indicator spans $500 → $100,000+. */
  productEngineering: {
    min: "$500",
    max: "$100,000+",
    types: [
      { name: "Landing Pages", scope: "Conversion-engineered launch pages.", level: 0.04 },
      { name: "Websites", scope: "Multi-page sites with CMS and analytics.", level: 0.12 },
      { name: "SaaS", scope: "Accounts, billing, admin and core product.", level: 0.42 },
      { name: "Mobile Apps", scope: "iOS and Android from one codebase.", level: 0.48 },
      { name: "AI Products", scope: "Models, agents, evaluation and tooling.", level: 0.62 },
      { name: "FinTech", scope: "Ledgers, KYC flows, compliance-ready design.", level: 0.78 },
      { name: "Web3", scope: "Contracts, wallets, on-chain integrations.", level: 0.72 },
      { name: "Enterprise Platforms", scope: "Custom systems at organizational scale.", level: 1 },
    ],
    process: ["Specify", "Architect", "Design", "Engineer", "Verify", "Deploy"],
  },

  /* White-label marketplace (PLACEHOLDER listings until the catalog is connected). */
  marketplace: {
    total: "50+",
    lifecycle: ["Discover", "Select", "Customize", "Brand", "Deploy", "Launch", "Scale"],
    categories: ["FinTech", "Trading", "Web3", "AI", "SaaS", "Gaming", "Marketplace"],
    items: [
      { name: "Neobank Core", category: "FinTech", desc: "Accounts, cards and payments." },
      { name: "Exchange Engine", category: "Trading", desc: "Order book and matching engine." },
      { name: "Token Launchpad", category: "Web3", desc: "Issuance, vesting and claims." },
      { name: "Agent Studio", category: "AI", desc: "Build and deploy autonomous agents." },
      { name: "Subscription Suite", category: "SaaS", desc: "Billing, seats and admin." },
      { name: "Casual Games Hub", category: "Gaming", desc: "Lobby, wallets and leaderboards." },
      { name: "Services Market", category: "Marketplace", desc: "Two-sided booking platform." },
      { name: "Payments Gateway", category: "FinTech", desc: "Checkout and payouts." },
      { name: "Copy Trading", category: "Trading", desc: "Strategy following with risk limits." },
      { name: "Wallet Suite", category: "Web3", desc: "Custodial and self-custody wallets." },
      { name: "Support Intelligence", category: "AI", desc: "Automated customer resolution." },
      { name: "B2B Marketplace", category: "Marketplace", desc: "Catalogs, quotes and orders." },
    ],
  },

  /* Global company infrastructure. Formation runs through licensed local partners. */
  infrastructure: {
    hubs: [
      { id: "us", name: "USA", lat: 39, lon: -98, entity: "Delaware C-Corp or LLC" },
      { id: "uk", name: "UK", lat: 54, lon: -2, entity: "Private limited company (Ltd)" },
      { id: "eu", name: "Europe", lat: 50, lon: 10, entity: "Selected EU jurisdictions" },
      { id: "ae", name: "UAE", lat: 24, lon: 54, entity: "Free zone company (FZ-LLC)" },
      { id: "in", name: "India", lat: 21, lon: 78, entity: "Private limited company (Pvt. Ltd.)" },
      { id: "sg", name: "Singapore", lat: 1.35, lon: 103.8, entity: "Private limited company (Pte. Ltd.)" },
    ],
    workflows: [
      { name: "Company formation", text: "Entity selection, documents and partner-led filing." },
      { name: "Legal workflows", text: "Templates and drafts prepared for qualified review." },
      { name: "Compliance", text: "Calendars, reminders and filing preparation." },
      { name: "Accounting", text: "Bookkeeping structure and reporting set up." },
      { name: "Banking preparation", text: "Documentation prepared for account applications." },
      { name: "Operations", text: "Domain, email, workspace and tooling." },
    ],
  },

  /* Growth engine (marketing → sales). */
  growth: [
    { name: "Market", group: "marketing", text: "Sizes demand and maps segments." },
    { name: "ICP", group: "marketing", text: "Defines who buys, and why." },
    { name: "Research", group: "marketing", text: "Learns what each segment needs." },
    { name: "Content", group: "marketing", text: "Produces content for each segment." },
    { name: "Campaigns", group: "marketing", text: "Runs and tunes campaigns across channels." },
    { name: "Leads", group: "marketing", text: "Captures and enriches every lead." },
    { name: "Qualification", group: "sales", text: "Scores intent and fit continuously." },
    { name: "Outreach", group: "sales", text: "Personalized sequences, at scale." },
    { name: "Sales", group: "sales", text: "Meetings, proposals and follow-ups." },
    { name: "Customers", group: "sales", text: "Onboarding, expansion and retention." },
  ],

  /* Security architecture. Wording describes design principles, not certifications. */
  security: [
    { name: "Encrypted data", text: "Company data is encrypted in transit and at rest." },
    { name: "Secure authentication", text: "Account access protected by modern authentication." },
    { name: "Least-privilege access", text: "Each workflow gets only the permissions it needs." },
    { name: "Auditability", text: "Every autonomous action is logged with its reasoning." },
    { name: "Isolated workspaces", text: "Each company runs in its own workspace." },
    { name: "Controlled autonomy", text: "Founder-only decisions can never execute automatically." },
  ],

  /* Pricing. */
  pricing: [
    { plan: "founder", name: "Founder", price: "$99", period: "/month", blurb: "For a single founder turning an idea into a company.", features: ["Company intelligence core", "Executive workforce", "Founder command center"] },
    { plan: "growth", name: "Growth", price: "$499", period: "/month", blurb: "For companies building, launching and selling.", features: ["Full digital workforce", "Marketing + sales engine", "Supervised autonomy controls"], recommended: true },
    { plan: "scale", name: "Scale", price: "$999", period: "/month", blurb: "For companies operating at speed.", features: ["Higher autonomous capacity", "Multiple products", "Priority support"] },
    { plan: "enterprise", name: "Custom", price: "Custom", period: "", blurb: "For portfolios, studios and groups.", features: ["Multiple companies", "Custom intelligence workflows", "Dedicated team"], cta: "Contact us" },
  ],
};

export default siteData;
