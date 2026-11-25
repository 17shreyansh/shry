import * as z from "zod/v4";

/** The project blueprint shape shared by the API route, the AI model and the UI. */
export const BlueprintSchema = z.object({
  title: z.string().describe("Short working name for the project, 2-5 words"),
  summary: z.string().describe("One or two plain-English sentences describing what will be built and for whom"),
  kind: z.enum(["website", "web-app", "mobile-app", "saas", "automation", "integration"]),
  modules: z
    .array(z.object({ name: z.string(), description: z.string().describe("One sentence") }))
    .describe("4 to 6 core modules or features"),
  phases: z
    .array(z.object({ name: z.string(), weeks: z.number().int(), deliverable: z.string() }))
    .describe("3 or 4 delivery phases with realistic durations in weeks"),
  stack: z.array(z.string()).describe("4 to 7 suitable technologies"),
  ai: z.array(z.string()).describe("1 to 3 practical places AI or automation could help; empty if none make sense"),
  questions: z.array(z.string()).describe("2 or 3 questions SHRY would ask before giving a firm quote"),
});

export type Blueprint = z.infer<typeof BlueprintSchema>;

/**
 * Deterministic fallback planner, used when no AI key is configured or the AI call fails.
 * Keyword-driven, so it stays sensible for common requests.
 */
export function localBlueprint(idea: string): Blueprint {
  const t = idea.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  const kind: Blueprint["kind"] = has("app store", "android", "ios", "mobile app", "app for")
    ? "mobile-app"
    : has("saas", "subscription", "platform", "multi-tenant")
      ? "saas"
      : has("automate", "automation", "workflow", "whatsapp bot", "chatbot", "ai agent")
        ? "automation"
        : has("integrate", "integration", "api", "sync", "crm", "erp")
          ? "integration"
          : has("dashboard", "portal", "management", "booking", "inventory", "crm", "system")
            ? "web-app"
            : "website";

  const modules: Blueprint["modules"] = [];
  const add = (name: string, description: string) => modules.length < 6 && modules.push({ name, description });
  if (has("login", "account", "user", "customer", "member", "portal")) add("Accounts & roles", "Secure sign-in with the right access for owners, staff and customers.");
  if (has("book", "appointment", "schedule", "reservation")) add("Bookings", "Real-time availability, booking flow and automatic confirmations.");
  if (has("pay", "payment", "invoice", "subscription", "billing", "rent")) add("Payments & invoicing", "Online payments, invoices and automatic reminders.");
  if (has("shop", "store", "ecommerce", "e-commerce", "order", "product", "catalog")) add("Catalogue & orders", "Products, cart, checkout and order tracking.");
  if (has("inventory", "stock", "warehouse")) add("Inventory", "Live stock levels with low-stock alerts.");
  if (has("whatsapp", "sms", "email", "notify", "notification", "remind")) add("Notifications", "WhatsApp, SMS and email messages triggered by real events.");
  if (has("report", "analytics", "dashboard", "insight")) add("Dashboard & reports", "The numbers that matter, live, with exports.");
  if (has("chat", "ai", "assistant", "support")) add("AI assistant", "Answers common questions and hands off to a person when needed.");
  if (has("crm", "lead", "enquir", "sales")) add("Leads & CRM", "Every enquiry captured, tracked and followed up.");
  const defaults: [string, string][] = kind === "website"
    ? [["Pages & content", "Fast, search-friendly pages you can edit yourself."], ["Lead capture", "Enquiry forms and calls-to-action that reach you instantly."], ["SEO & analytics", "Technical SEO, structured data and privacy-friendly analytics."], ["Performance", "Optimised images and code so the site loads in about a second."]]
    : [["Admin panel", "One place to manage data, users and settings."], ["Core workflow", "The main process of your business, designed around how you work today."], ["Dashboard & reports", "The numbers that matter, live, with exports."], ["Notifications", "Messages triggered by real events, by email or WhatsApp."]];
  for (const [n, d] of defaults) if (modules.length < 4 && !modules.some((m) => m.name === n)) add(n, d);

  const big = kind === "saas" || kind === "mobile-app";
  const phases: Blueprint["phases"] = [
    { name: "Discover & design", weeks: big ? 2 : 1, deliverable: "Scope, flows and clickable designs" },
    { name: "Build", weeks: kind === "website" ? 2 : big ? 6 : 4, deliverable: "Working software, shown to you every week" },
    { name: "Connect & test", weeks: big ? 2 : 1, deliverable: "Integrations, data migration and testing" },
    { name: "Launch & support", weeks: 1, deliverable: "Go-live, training and ongoing support" },
  ];

  const stack = kind === "mobile-app"
    ? ["React Native", "TypeScript", "Node.js", "PostgreSQL", "Play Store & App Store"]
    : kind === "automation"
      ? ["Node.js", "TypeScript", "WhatsApp / email APIs", "PostgreSQL", "Claude AI"]
      : kind === "website"
        ? ["Next.js", "TypeScript", "Tailwind CSS", "Headless CMS", "Vercel or VPS hosting"]
        : ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Cloud hosting"];

  return {
    title: kind === "website" ? "Business website" : kind === "mobile-app" ? "Mobile app" : kind === "saas" ? "SaaS platform" : kind === "automation" ? "Workflow automation" : kind === "integration" ? "Systems integration" : "Web application",
    summary: `A ${kind.replace("-", " ")} built around your idea: ${idea.trim().slice(0, 140)}${idea.length > 140 ? "…" : ""}`,
    kind,
    modules,
    phases,
    stack,
    ai: has("ai", "chat", "support", "enquir", "lead", "report")
      ? ["Draft replies to enquiries for a person to approve", "Summarise activity into a weekly report"]
      : ["Automatic follow-ups on new enquiries"],
    questions: ["Who will use it day to day, and roughly how many people?", "Which tools or spreadsheets does this need to work with?", "Is there a date this needs to be live by?"],
  };
}
