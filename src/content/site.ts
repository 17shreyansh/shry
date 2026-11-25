/**
 * Single source of truth for business details and featured work.
 *
 * IMPORTANT: only put VERIFIED information here. Anything left empty is hidden
 * from the UI rather than faked:
 *  - email / phone / location / socials: shown in the footer and on /contact when set.
 *  - projects[].url / image: live link and real screenshot. Empty = no link, illustrative preview is used.
 *
 * The contact form posts to /api/contact. Set SMTP_* vars (see .env.example) to receive enquiries.
 */
export const SITE = {
  name: "SHRY",
  url: "https://shry.in",
  tagline: "Websites, software and AI automation for growing businesses.",
  description: "SHRY builds business websites, custom software, web apps and AI automations — with integrations and ongoing technical support for growing businesses across India.",
  email: "shreyansh@shry.in",
  phone: "+91 7017828192",
  location: "",
  reach: "Working with businesses across India.",
  socials: [] as { label: string; href: string }[],
};

/** Sectors of past client work. Edit to match what you are happy to publish. */
export const SECTORS = ["Real estate", "Student accommodation", "Construction & building materials", "SaaS", "Industrial B2B", "Diagnostics", "Hospitality"];

export type Project = {
  id: string; // also the URL slug: /work/<id>
  name: string;
  kind: string;
  platform: string;
  /** Short one-liner used on cards and in meta descriptions. */
  product: string;
  problem: string;
  contribution: string;
  role: string[];
  url?: string; // live link, when available
  image?: string; // real screenshot path in /public, when available
  highlights?: string[]; // optional bullet points; section hidden when empty
  variant: "dashboard" | "catalogue";
  /** Related service slugs for cross-linking. */
  relatedServices?: ("build" | "connect" | "operate")[];
  /** Who the product is for / belongs to (client or company). */
  client?: string;
  /**
   * When the product is owned by another company (not SHRY), credit it clearly.
   * The UI then labels the contribution as personal work by the founder.
   */
  ownedBy?: { name: string; href?: string; note: string };
  /** Label for the "what we did" row. Defaults to "What SHRY did". */
  contributionLabel?: string;
  /** Extra outbound links: app stores, live demo, etc. */
  links?: { label: string; href: string }[];
  /** Key facts shown as large figures. Only verifiable product facts. */
  stats?: { value: string; label: string }[];
  /** Real screenshots for the case-study gallery. */
  gallery?: { src: string; caption: string }[];
  /** Real phone-width screenshot. */
  mobile?: string;
  /** Long-form overview paragraphs for the case study. */
  story?: string[];
  /** Brand colour of the product, used for cinematic lighting around its screenshots. */
  tint?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "mycloudpg",
    tint: "#1fa2ff",
    name: "MyCloudPG",
    kind: "Accommodation management",
    platform: "Web application",
    product: "Software for running paying-guest and student accommodation properties — managing rooms, residents and payments in one place.",
    problem: "Rooms, residents and payments tracked across notebooks and chat threads, leading to missed payments and booking confusion.",
    contribution: "Product design, full-stack development and deployment.",
    role: ["Product design", "Full-stack development", "Deployment"],
    variant: "dashboard",
    relatedServices: ["build"],
    url: "https://www.mycloudpg.com",
    image: "/work/mycloudpg/hero.webp",
    mobile: "/work/mycloudpg/mobile.webp",
    links: [{ label: "Try the live demo", href: "https://demo.mycloudpg.com" }],
    highlights: [
      "Room and bed inventory management with real-time occupancy tracking",
      "Resident onboarding and document collection",
      "Payment tracking and automated reminders",
      "Built to handle multiple properties from a single dashboard",
    ],
    gallery: [
      { src: "/work/mycloudpg/hero.webp", caption: "Owner dashboard — tenants, vacancies, rent collected and complaints at a glance" },
      { src: "/work/mycloudpg/demo.webp", caption: "Live demo — separate experiences for PG owners and tenants" },
      { src: "/work/mycloudpg/features.webp", caption: "PG-specific architecture: multi-property core, built for Indian operators" },
    ],
  },
  {
    id: "nirmanveda",
    tint: "#9b4dff",
    name: "Nirmanveda",
    kind: "Construction-materials marketplace",
    platform: "Android · iOS · Website",
    client: "RSD Bharti Ltd.",
    product: "A marketplace app for ordering cement, TMT steel, bricks, sand and aggregates from verified dealers — with live prices and delivery to the construction site.",
    problem: "Contractors and home-builders in Bihar sourced materials through phone calls and dealer visits: no price visibility, no tracking, and no single place to order everything a site needs.",
    contribution: "Designed and built the whole platform end to end — customer apps for Android and iOS, the materials catalogue, ordering and delivery flow, and the marketing website.",
    role: ["Product design", "Mobile app (Android & iOS)", "Website", "Catalogue & ordering", "App Store & Play Store launch"],
    variant: "catalogue",
    relatedServices: ["build"],
    url: "https://nirmanveda.com",
    image: "/work/nirmanveda/hero.webp",
    mobile: "/work/nirmanveda/mobile.webp",
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.RSDBharti.nirmaveda&hl=en_IN" },
      { label: "App Store", href: "https://apps.apple.com/in/app/nirmanveda/id6763253076" },
    ],
    stats: [
      { value: "2", label: "Native app stores — live on Google Play and the App Store" },
      { value: "5", label: "Material categories — cement, steel, bricks, sand, aggregates" },
      { value: "8", label: "Delivery hubs across Bihar, from Patna to Purnia" },
      { value: "Live", label: "Dealer prices, offers at checkout and order tracking" },
    ],
    story: [
      "Nirmanveda brings every construction material a site needs into one app. A contractor sets their site location, searches for a brand like UltraTech or Tata Tiscon, sees live dealer prices and orders — from a 50 kg cement bag to a truckload of aggregates.",
      "Behind the storefront is a structured catalogue: five categories broken down by brand and grade (OPC 53 cement, Fe550D TMT bars, A-grade bricks, washed river sand), each with clear pricing per bag, kilo or piece. Orders flow to verified dealers near the site and are tracked through to delivery.",
      "The marketing website mirrors the catalogue so materials are discoverable on Google, explains the statewide delivery network across Bihar, and funnels visitors to the Play Store and App Store.",
    ],
    highlights: [
      "Location-aware ordering — prices and dealers based on the delivery site",
      "Brand-and-grade catalogue: UltraTech, ACC, Dalmia, JSW, Tata Tiscon, Jindal and more",
      "Cart, checkout offers and live order tracking in the app",
      "Bilingual material names (e.g. Sand / रेत / बालू) for local buyers",
      "SEO-friendly materials pages on the website for every category and brand",
      "Published on both Google Play and the Apple App Store, with account-deletion and privacy flows that meet store policy",
    ],
    gallery: [
      { src: "/work/nirmanveda/hero.webp", caption: "Website hero — the whole catalogue, one app" },
      { src: "/work/nirmanveda/app.webp", caption: "The Nirmanveda app on iOS and Android" },
      { src: "/work/nirmanveda/categories.webp", caption: "Five material categories, each with its own catalogue" },
      { src: "/work/nirmanveda/cement.webp", caption: "Brand-level catalogue — choose a cement brand, then a grade" },
      { src: "/work/nirmanveda/network.webp", caption: "Statewide delivery network across Bihar" },
      { src: "/work/nirmanveda/about.webp", caption: "Company story and supply-chain credentials" },
    ],
  },
  {
    id: "leadora",
    tint: "#5b5bff",
    name: "Leadora",
    kind: "SaaS · Website growth toolkit",
    platform: "SaaS platform",
    ownedBy: {
      name: "Affobe Digitals",
      href: "https://affobe.com",
      note: "Leadora is a product of Affobe Digitals. It was designed and engineered by Shreyansh, founder of SHRY.",
    },
    contributionLabel: "Built by Shreyansh",
    product: "One script tag that adds a lead-capturing chatbot, pro forms, privacy-first analytics and uptime monitoring to any website.",
    problem: "Small businesses juggle four separate tools — a chatbot, a form builder, analytics and uptime monitoring — each with its own script, bill and dashboard, slowing their site down.",
    contribution: "Product engineering end to end for Affobe — the ~5 KB embeddable loader, the visual chatbot flow builder, forms, cookieless analytics, uptime monitoring, the leads inbox and the subscription dashboard.",
    role: ["Product engineering", "Embeddable SDK", "SaaS dashboard", "Analytics pipeline", "Billing & plans"],
    variant: "dashboard",
    relatedServices: ["build", "connect"],
    url: "https://leadora.in",
    image: "/work/leadora/hero.webp",
    mobile: "/work/leadora/mobile.webp",
    stats: [
      { value: "4", label: "Products in one script — chatbot, forms, analytics, monitoring" },
      { value: "~5 KB", label: "Async loader; modules you don’t enable are never downloaded" },
      { value: "₹0", label: "Per conversation — a flow-engine chatbot with no LLM bill" },
      { value: "12+", label: "Platforms supported — WordPress, Shopify, Webflow, Next.js…" },
    ],
    story: [
      "Leadora is a product of Affobe Digitals. Its promise is simple: paste one line into your site’s <head>, then switch on a chatbot, forms, analytics or uptime monitoring from the dashboard — no redeploys and no developer tickets.",
      "The chatbot runs on a visual flow engine with fuzzy matching over the site owner’s own Q&A, so it feels smart, never goes off-brand and costs nothing per message. Every chat and form submission lands in one leads inbox with source, UTM and page context, and can be pushed to a CRM by webhook.",
      "Under the hood, widgets render in Shadow DOM so they never clash with the host site’s CSS, analytics are cookieless with daily-rotating anonymous IDs, and uptime checks confirm each failure with a retry before alerting by email, Slack or Discord.",
    ],
    highlights: [
      "Visual drag-and-drop chatbot flow builder with branches and webhooks",
      "Multi-step forms with conditional logic, popups and built-in spam protection",
      "Cookieless, privacy-first analytics — real-time visitors, pages, referrers, campaigns",
      "Uptime, SSL and JavaScript-error monitoring with Slack, Discord and email alerts",
      "Unified leads inbox with tagging, statuses, CSV export and CRM webhooks",
      "Shadow-DOM widgets and a ~5 KB async loader that keep Core Web Vitals green",
      "Free, Pro and Business plans with monthly and yearly billing",
    ],
    gallery: [
      { src: "/work/leadora/hero.webp", caption: "One script. Every tool your website needs to grow." },
      { src: "/work/leadora/install.webp", caption: "Paste one line, then toggle modules from the dashboard" },
      { src: "/work/leadora/products.webp", caption: "Four products behind a single script tag" },
      { src: "/work/leadora/chatbot.webp", caption: "Conversational lead capture — a chatbot with no AI bill" },
      { src: "/work/leadora/inbox.webp", caption: "Unified leads inbox and engineering principles" },
      { src: "/work/leadora/pricing.webp", caption: "Starter, Pro and Business plans" },
    ],
  },
];

export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
];
