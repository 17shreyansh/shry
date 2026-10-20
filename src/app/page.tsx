import { Hero } from "@/components/Hero";
import { Credibility } from "@/components/Credibility";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Automation } from "@/components/Automation";
import { About } from "@/components/About";
import { TeamSection } from "@/components/TeamSection";
import { Sectors } from "@/components/Sectors";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { GENERAL_FAQ } from "@/content/faq";

export default function Page() {
  return (
    <>
      <Hero />
      <Credibility />
      <Services />
      <Work />
      <Process />
      <Automation />
      <About />
      <TeamSection
        variant="home"
        eyebrow="07 / THE TEAM"
        title="The core team behind SHRY."
        lead="Senior engineers and interface designers working as one multidisciplinary unit to build and maintain your systems."
      />
      <Sectors />
      <FAQ items={GENERAL_FAQ} title="Common questions about working with SHRY." />
      <FinalCTA />
    </>
  );
}
