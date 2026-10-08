/**
 * Public routes + SEO metadata. Used by the React router (titles, nav) and by
 * the build-time prerender step (per-route HTML, Open Graph, sitemap.xml).
 */
export const SITE_URL = "https://realy.si";
export const SITE_NAME = "Realy";

const routes = [
  {
    path: "/",
    nav: null,
    title: "Realy — Build your company with superintelligence",
    description:
      "Realy is the company intelligence platform. One intelligence layer coordinates product, engineering, marketing, sales, finance and operations — an entire digital workforce for one founder.",
  },
  { path: "/platform", nav: "Platform", title: "Platform — The intelligence layer for companies", description: "The architecture behind Realy: one intelligence core, an orchestration layer, a digital workforce and the founder command center." },
  { path: "/superintelligence", nav: "Superintelligence", title: "Superintelligence — Not an assistant. An intelligence system.", description: "Realy researches, reasons, plans, creates, executes, monitors and optimizes. One instruction becomes hundreds of coordinated actions." },
  { path: "/ai-employees", nav: "Workforce", title: "Digital Workforce — A living organization", description: "Executives and functions operating as one digital organization around the Realy intelligence core, with live status and founder approval." },
  { path: "/company", nav: "Company", title: "From thought to company", description: "Idea, research, strategy, brand, company, product, launch, customers, growth — one continuous system pipeline." },
  { path: "/product-development", nav: "Build", title: "Product engineering — If it doesn't exist, build it", description: "Landing pages to enterprise platforms. Product engineering from $500 to $100,000+." },
  { path: "/marketplace", nav: "Marketplace", title: "Marketplace — 50+ ready-to-launch products", description: "Discover, customize, brand, deploy, launch and scale white-label software from the Realy marketplace." },
  { path: "/marketing", nav: "Marketing", title: "Marketing intelligence — The growth engine", description: "From market and ICP to content, campaigns and leads — marketing run as one connected intelligence system." },
  { path: "/sales", nav: "Sales", title: "Sales intelligence — From lead to customer", description: "Qualification, outreach, sales and customers — a sales system that never stops working the pipeline." },
  { path: "/company-setup", nav: "Company Setup", title: "Company setup — From digital idea to real company", description: "Company formation, legal workflows, compliance, accounting, banking preparation and operations across the USA, UK, UAE, Singapore, India and Europe." },
  { path: "/pricing", nav: "Pricing", title: "Pricing", description: "Founder $99, Growth $499, Scale $999 per month, and Enterprise." },
  { path: "/security", nav: "Security", title: "Security & control", description: "How Realy keeps founders in control: approval gates, action logs, scoped access and founder-only decisions." },
  { path: "/resources", nav: "Resources", title: "Resources", description: "Guides, documentation and playbooks for building companies with Realy." },
  { path: "/about", nav: "About", title: "About", description: "Realy is building the operating system for the next generation of companies." },
];

/** Full document title: the home title stands alone, sub-pages get the brand suffix. */
export const fullTitle = (r) => (r.path === "/" ? r.title : `${r.title} — ${SITE_NAME}`);

export default routes;
