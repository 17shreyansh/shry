import type { VisualKind } from "@/components/Visuals";
import type { QA } from "@/content/faq";

export type Service = {
  slug: "build" | "connect" | "operate";
  name: string;
  no: string;
  tagline: string;
  headline: string[];
  intro: string;
  includes: { title: string; text: string }[];
  fit: string[];
  steps: { title: string; text: string }[];
  stack?: string[];
  faq: QA[];
  visual: VisualKind;
  tone: "dark" | "lime" | "bone";
};

export const SERVICES: Service[] = [
  {
    slug: "build",
    name: "Build",
    no: "01",
    tagline: "Turn ideas into useful software.",
    headline: ["Turn ideas into", "useful software."],
    intro: "Websites, web applications, mobile apps and custom software, designed around how your business actually works and built so they can be maintained and improved.",
    includes: [
      { title: "Business websites", text: "Fast, clear, search-friendly sites that explain what you do and make it easy to get in touch." },
      { title: "Web applications", text: "Portals, dashboards and internal tools that replace spreadsheets and scattered chat threads." },
      { title: "Mobile apps", text: "Apps for customers or staff, when a phone is the right place for the job." },
      { title: "SaaS products", text: "Multi-user products with accounts, roles and billing, structured to grow past the first version." },
      { title: "Custom business software", text: "Software shaped around a process that off-the-shelf tools handle badly." },
    ],
    fit: [
      "You're replacing spreadsheets, paper or chat threads with something proper.",
      "You have an idea and need help turning it into a scoped first version.",
      "Your current website or app is slow, dated or hard to change.",
    ],
    steps: [
      { title: "Scope the first version", text: "We agree what to build first, what to leave for later, and how we'll know it works." },
      { title: "Design and build in stages", text: "You see working software early and often, so direction can change before it gets expensive." },
      { title: "Launch and hand over", text: "We deploy it, document it and make sure your team knows how to use and change it." },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    faq: [
      { q: "Can you redesign an existing website?", a: "Yes. We can rebuild or improve what you have, keeping what works and fixing what doesn't." },
      { q: "Do I need to know exactly what I want?", a: "No. Many projects start with a rough idea. Part of our job is shaping it into something that can be built." },
      { q: "Who owns the finished software?", a: "This is agreed in writing before work starts, so there are no surprises at handover." },
    ],
    visual: "build",
    tone: "dark",
  },
  {
    slug: "connect",
    name: "Connect",
    no: "02",
    tagline: "Make your software work together.",
    headline: ["Make your software", "work together."],
    intro: "APIs, integrations and practical automation that connect the tools your business already uses, so information moves on its own instead of being retyped.",
    includes: [
      { title: "APIs & integrations", text: "Reliable connections between your systems and the services you rely on." },
      { title: "Connected business applications", text: "Your website, forms, CRM, accounting and messaging tools, sharing data instead of duplicating it." },
      { title: "Workflow automation", text: "Repetitive steps handled automatically, with a person involved wherever judgement is needed." },
      { title: "Practical AI integrations", text: "AI added to a workflow where it genuinely helps, such as sorting or drafting, with review built in." },
      { title: "Fragmented workflow clean-up", text: "Mapping how work really flows today and removing the manual hand-offs." },
    ],
    fit: [
      "Your team retypes the same information into several tools.",
      "Enquiries, orders or bookings arrive in one place and need to reach another.",
      "Reporting depends on someone copying numbers into a spreadsheet each week.",
    ],
    steps: [
      { title: "Map how work flows today", text: "We follow a piece of work from start to finish and note every hand-off." },
      { title: "Connect the systems", text: "We build the integrations and automations, starting with the highest-value flow." },
      { title: "Test with real cases", text: "We run it against real examples, add safeguards and watch it work before you rely on it." },
    ],
    faq: [
      { q: "Can you connect software we already pay for?", a: "Usually. Most business tools offer ways to connect. We'll check what yours support before recommending an approach." },
      { q: "What if one of the tools changes?", a: "Integrations need looking after. That's one reason we offer ongoing support under Operate." },
      { q: "Do you only build automations?", a: "No. If a workflow is better solved by a small custom tool or a change in process, we'll say so." },
    ],
    visual: "connect",
    tone: "lime",
  },
  {
    slug: "operate",
    name: "Operate",
    no: "03",
    tagline: "Keep your technology working.",
    headline: ["Keep your", "technology working."],
    intro: "Maintenance, deployment, hosting and troubleshooting for the websites and applications your business depends on, plus steady improvement over time.",
    includes: [
      { title: "Maintenance & updates", text: "Regular updates and fixes so your software stays current and in good shape." },
      { title: "Deployment & hosting", text: "Setting up and managing where your software runs, and how changes reach it." },
      { title: "Troubleshooting", text: "When something breaks, someone who knows the system looks into it." },
      { title: "Optimisation", text: "Speed, search visibility and usability improvements based on how your software is actually used." },
      { title: "Continuous improvement", text: "A steady list of small improvements instead of waiting for the next big project." },
    ],
    fit: [
      "Your website or app was built by someone who is no longer around.",
      "You want one accountable team for hosting, updates and fixes.",
      "You'd rather improve steadily than start over every few years.",
    ],
    steps: [
      { title: "Review what you have", text: "We look at how your software is built, hosted and maintained, and note the risks." },
      { title: "Agree a support arrangement", text: "We define what's covered, how to reach us and how issues are handled." },
      { title: "Maintain and improve", text: "We keep things running and propose improvements as we learn how you use it." },
    ],
    faq: [
      { q: "Can you support software you didn't build?", a: "Often, yes, after a review. We'll tell you plainly if something is too risky or costly to maintain." },
      { q: "Is support a fixed monthly arrangement?", a: "It's set up around your needs and agreed in writing, so it's clear what's covered." },
      { q: "What if something breaks urgently?", a: "We'll agree how urgent issues are raised and handled as part of the support arrangement." },
    ],
    visual: "operate",
    tone: "bone",
  },
];

export const AI_PAGE = {
  examples: [
    { title: "Handling incoming business inquiries", how: "New messages from your website, email or forms are sorted by topic and urgency and routed to the right person.", person: "Your team decides what to do. Nothing is sent on their behalf." },
    { title: "Preparing customer-response drafts", how: "A draft reply is prepared from your own service information and past answers.", person: "A person reads, edits and sends every reply that matters." },
    { title: "Connecting form submissions to business applications", how: "Details from a form land in the right system automatically, with no retyping.", person: "Exceptions are flagged for review instead of guessed at." },
    { title: "Automating repetitive reporting and administrative tasks", how: "Weekly numbers, reminders and routine paperwork are prepared automatically.", person: "You review the output and approve anything that goes outside the business." },
  ],
  steps: [
    { title: "Find the workflow", text: "We look for work that is frequent, consistent and tedious. Those are the good candidates." },
    { title: "Map the steps and the exceptions", text: "We write down what happens, what can go wrong and where a person must decide." },
    { title: "Connect AI and your software", text: "We build the workflow on top of the tools you already use, and add safeguards." },
    { title: "Review, then refine", text: "We run it with real cases and a person checking, then improve it from what we learn." },
  ],
  wont: [
    "We won't add AI where a simple rule works better.",
    "We won't promise outcomes before we've seen the workflow.",
    "We won't remove people from decisions that need judgement.",
  ],
};

export const PROCESS_PAGE = [
  {
    title: "Understand",
    lead: "We start with your business and the actual problem, not a feature list.",
    happens: "A conversation about how your business works, who uses the system and what is going wrong today. We ask a lot of questions.",
    get: "A written summary of the problem and the goals, in plain language, that you can check we got right.",
    need: "Time with the people who do the work, and examples such as current spreadsheets, forms or screenshots.",
  },
  {
    title: "Plan",
    lead: "We define an appropriate solution and a scope that fits it.",
    happens: "We choose an approach, decide what the first version includes and what waits, and agree priorities.",
    get: "A written scope: the approach, what is included, what is not, and how we'll know it works.",
    need: "Decisions on priorities, and sign-off on the scope before work starts.",
  },
  {
    title: "Build and connect",
    lead: "We implement the solution and integrate the systems it needs.",
    happens: "We build in stages, connect the tools involved and show progress along the way.",
    get: "Working software you can try at each stage, not a reveal at the end.",
    need: "Honest feedback on what you see, so we can steer early.",
  },
  {
    title: "Support and improve",
    lead: "Where ongoing support is agreed, we keep improving the technology.",
    happens: "We launch, hand over and, if you want it, stay on to maintain and improve the system.",
    get: "Handover notes, and a clear support arrangement if one is agreed.",
    need: "Tell us what you see in real use. That is where the best improvements come from.",
  },
];
