import { Hero } from "@/components/Hero";
import { Credibility } from "@/components/Credibility";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Automation } from "@/components/Automation";
import { About } from "@/components/About";
import { TeamSection } from "@/components/TeamSection";
import { Sectors } from "@/components/Sectors";
import { FinalCTA } from "@/components/FinalCTA";

export default function Page() {
  return (
    <>
      <Hero />
      <Credibility />
      <Work />
      <Services />
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
      <FinalCTA />
    </>
  );
}
