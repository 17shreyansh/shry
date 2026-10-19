/**
 * Single source of truth for business details and featured work.
 *
 * IMPORTANT: only put VERIFIED information here. Anything left empty is hidden
 * from the UI rather than faked:
 *  - email / phone / location / socials: shown in the footer and on /contact when set.
 *  - projects[].url / image: live link and real screenshot. Empty = no link, illustrative preview is used.
 *
 * The contact form posts to /api/contact. Set RESEND_API_KEY and CONTACT_TO (see .env.example) to receive enquiries.
 */
export const SITE = {
  name: "SHRY",
  url: "https://shry.in",
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
    product: "Software for running paying-guest and student accommodation properties.",
    problem: "Rooms, residents and payments tracked across notebooks and chat threads.",
    contribution: "Product design, full-stack development and deployment.",
    role: ["Product design", "Full-stack development", "Deployment"],
    variant: "dashboard",
  },
  {
    id: "nirmaveda",
    name: "Nirmaveda",
    kind: "Business website",
    platform: "Website",
    product: "A business website that presents the company, its offering and its work.",
    problem: "A company that needed a clear, credible online presence.",
    contribution: "Design, development and deployment.",
    role: ["Design", "Development", "Deployment"],
    variant: "catalogue",
  },
];

export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
];
