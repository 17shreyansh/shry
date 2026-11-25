import { Hero } from "@/components/Hero";
import { Credibility } from "@/components/Credibility";
import { AIBlueprint } from "@/components/AIBlueprint";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Automation } from "@/components/Automation";
import { About } from "@/components/About";
import { TeamSection } from "@/components/TeamSection";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { GENERAL_FAQ } from "@/content/faq";
import Script from 'next/script';


export default function Page() {
  return (
    <>
      <Script src="https://cdn.leadora.in/l.js" data-site="ls_gyO7TLhGKhDHXE8B" strategy="afterInteractive" />
      <Hero />
      <AIBlueprint />
      <Credibility />
      <Work />
      <Services />
      <Process />
      <Automation />
      <About />
      <TeamSection
        variant="home"
        eyebrow="The team"
        title="The core team behind SHRY."
        lead="Senior engineers and interface designers working as one multidisciplinary unit to build and maintain your systems."
      />
      <FAQ items={GENERAL_FAQ} title="Common questions about working with SHRY." />
      <FinalCTA />
    </>
  );
}
