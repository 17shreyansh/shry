export type QA = { q: string; a: string };

export const GENERAL_FAQ: QA[] = [
  { q: "What kinds of businesses do you work with?", a: "Growing businesses that rely on software but don't have an in-house technology team. Our work so far spans real estate, student accommodation, industrial B2B, diagnostics and hospitality." },
  { q: "How do we get started?", a: "Tell us what you need on the contact page. We'll reply to arrange a conversation, ask questions, and then propose an approach and scope in writing." },
  { q: "How is a project priced?", a: "It depends on the scope. After an initial conversation we put the scope and the cost in writing before any work starts." },
  { q: "Can you work with software we already use?", a: "Usually, yes. Connecting and improving existing tools is a core part of what we do." },
  { q: "Do you build custom web applications and mobile apps?", a: "Yes. We design and build responsive websites, custom web applications, customer portals, internal business platforms, and mobile apps tailored specifically to how your business operates." },
  { q: "Who owns the code and intellectual property after launch?", a: "You do. Once delivered, all custom source code, design assets, and credentials belong 100% to your business. We provide clean documentation and direct repository handoffs." },
  { q: "Do you offer support after launch?", a: "Yes. We provide continuous technical maintenance, hosting management, security updates, and performance monitoring under our Maintenance & Technical Support service." },
  { q: "Do you use AI?", a: "Where it genuinely helps, and with a person reviewing the output where it matters. If a simpler deterministic solution is better, we'll recommend that instead." },
];

export const AI_FAQ: QA[] = [
  { q: "Do you build chatbots?", a: "Only where a chatbot is the right answer. Most useful automation happens behind the scenes: sorting enquiries, preparing drafts and moving data between tools. We start from the workflow, not the technology." },
  { q: "Will AI replace my team?", a: "That isn't the aim. The goal is to remove repetitive work so people can spend their time on judgement and relationships. Where a decision matters, a person reviews it." },
  { q: "What happens to our data?", a: "Before building anything we agree which information a workflow may use, and choose tools that suit that. We'll explain the options in plain language." },
  { q: "How do we know a workflow is worth automating?", a: "We look at how often it happens, how consistent it is and what a mistake would cost. If it's rare and high-stakes, we'll usually suggest leaving it alone." },
];

export const PROCESS_FAQ: QA[] = [
  { q: "How long does a project take?", a: "It depends on the scope. We give you a realistic timeline with the written scope, once we understand what is involved." },
  { q: "Can the scope change along the way?", a: "Yes. Because you see working software in stages, priorities can change. We'll explain what any change means before we make it." },
  { q: "What do you need from us?", a: "Access to the people who use the system, examples of how work happens today, and timely decisions and feedback. We'll be specific about this at each stage." },
];
