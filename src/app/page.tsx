import { Hero } from "@/components/Hero";
import { Credibility } from "@/components/Credibility";
import { Work } from "@/components/Work";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Automation } from "@/components/Automation";
import { About } from "@/components/About";
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
      <Sectors />
      <FinalCTA />
    </>
  );
}
