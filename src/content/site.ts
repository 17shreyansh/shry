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
  phone: "",
  location: "",
  reach: "Working with businesses across India.",
  socials: [] as { label: string; href: string }[],
};

/** Sectors of past client work. Edit to match what you are happy to publish. */
export const SECTORS = ["Real estate", "Student accommodation", "Industrial B2B", "Diagnostics", "Hospitality"];

export type Project = {
  id: string; // also the URL slug: /work/<id>
  name: string;
  kind: string;
  platform: string;
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
};

/**
 * TODO(owner): confirm each description below is accurate before launch,
 * then add `url`, a real screenshot (`image`) and optional `highlights`.
 */
export const PROJECTS: Project[] = [
  {
    id: "mycloudpg",
    name: "MyCloudPG",
    kind: "Accommodation management",
    platform: "Web application",
    product: "Software for running paying-guest and student accommodation properties — managing rooms, residents and payments in one place.",
    problem: "Rooms, residents and payments tracked across notebooks and chat threads, leading to missed payments and booking confusion.",
    contribution: "Product design, full-stack development and deployment.",
    role: ["Product design", "Full-stack development", "Deployment"],
    variant: "dashboard",
    relatedServices: ["build"],
    highlights: [
      "Room and bed inventory management with real-time occupancy tracking",
      "Resident onboarding and document collection",
      "Payment tracking and automated reminders",
      "Built to handle multiple properties from a single dashboard",
    ],
  },
  {
    id: "nirmaveda",
    name: "Nirmaveda",
    kind: "Business website",
    platform: "Website",
    product: "A professional business website that presents the company, its services and its work to potential clients.",
    problem: "A company that needed a clear, credible online presence to attract business enquiries.",
    contribution: "Design, development and deployment.",
    role: ["Design", "Development", "Deployment"],
    variant: "catalogue",
    relatedServices: ["build"],
    highlights: [
      "Responsive design optimised for mobile and desktop",
      "Clear service presentation with project portfolio",
      "Contact and enquiry flow designed for lead generation",
    ],
  },
];

export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
];
