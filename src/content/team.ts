export interface SocialLink {
  label: string;
  href: string;
  platform: "github" | "linkedin" | "x" | "mail";
}

export interface Founder {
  name: string;
  role: string;
  image: string;
  quote: string;
  tagline: string;
  focus: string[];
  socials: SocialLink[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  info: string;
  tags?: string[];
  socials?: SocialLink[];
}

export const FOUNDER: Founder = {
  name: "Shreyansh",
  role: "Founder & Lead Systems Architect",
  image: "/team/shreyansh.jpg",
  quote: "Software shouldn't be an ongoing operational tax. We build clean, resilient systems designed to survive the messy reality of everyday business.",
  tagline: "Directing technical strategy, cloud infrastructure, and AI engineering across every SHRY system.",
  focus: ["Systems Architecture", "High-Performance Web", "AI & Automation Pipelines"],
  socials: [
    { label: "GitHub", href: "https://github.com/17shreyansh", platform: "github" },
    { label: "LinkedIn", href: "https://linkedin.com", platform: "linkedin" },
    { label: "X / Twitter", href: "https://x.com", platform: "x" },
    { label: "Email", href: "mailto:hello@shry.in", platform: "mail" },
  ],
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "daksh",
    name: "Daksh",
    role: "AI & Automation Expert",
    image: "/team/daksh.jpeg",
    info: "Autonomous agentic pipelines, LLM workflow orchestration, and enterprise process automation.",
    tags: ["AI Pipelines", "Automation", "LLMs", "APIs"],
  },
  {
    id: "abhay-maurya",
    name: "Abhay Maurya",
    role: "ML Engineer",
    image: "/team/abhay-maurya.jpeg",
    info: "Machine learning model development, predictive systems, and high-performance data processing pipelines.",
    tags: ["Machine Learning", "Python", "PyTorch", "Data Models"],
  },
  {
    id: "mahi-shukla",
    name: "Mahi Shukla",
    role: "Marketing Head",
    image: "/team/mahi.jpeg",
    info: "Cross-channel growth strategy, corporate brand narrative, and client acquisition campaigns.",
    tags: ["Marketing", "Brand Strategy", "Growth", "Outreach"],
  },
  {
    id: "ayush-kumar",
    name: "Ayush Kumar",
    role: "Security & DevOps",
    image: "/team/ayush-kumar.jpeg",
    info: "Zero-trust cloud infrastructure, CI/CD pipeline automation, and container orchestration.",
    tags: ["DevOps", "Cloud Security", "CI/CD", "Docker"],
  },
  {
    id: "sameer-singh",
    name: "Sameer Singh",
    role: "UI/UX & Graphic Design",
    image: "/team/sameer-singh.jpeg",
    info: "Intuitive product interfaces, responsive design systems, and cohesive graphic brand assets.",
    tags: ["UI/UX", "Graphic Design", "Brand Identity", "Figma"],
  },
  {
    id: "arpit-mishra",
    name: "Arpit Mishra",
    role: "Developer",
    info: "Full-stack web applications, scalable database systems, and robust API architecture.",
    tags: ["Next.js", "React", "Node.js", "TypeScript"],
  },
];
