import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Privacy", description: "How SHRY handles information you send us.", alternates: { canonical: "/privacy" } };

export default function Page() {
  return (
    <Legal title="Privacy" updated="October 2026">
      {/* TODO(owner): have counsel review before launch. */}
      <p>This page explains what information this website collects and how we use it.</p>
      <h2>What we collect</h2>
      <p>If you use the contact form, we receive the details you enter: your name, email address, optional company and phone number, the topic and your message. We don&apos;t ask for anything more than we need to reply.</p>
      <h2>How we use it</h2>
      <p>We use it only to respond to your enquiry and to discuss potential work. We don&apos;t sell your information.</p>
      <h2>Service providers</h2>
      <p>Form submissions are delivered by email through a third-party email service provider. This site does not use advertising trackers.</p>
      <h2>Retention</h2>
      <p>We keep enquiry details for as long as needed to respond and to keep a reasonable record of our conversations.</p>
      <h2>Your choices</h2>
      <p>You can ask us to access, correct or delete the information you sent us{SITE.email ? <> by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a></> : <> by contacting us through the <a href="/contact">contact page</a></>}.</p>
    </Legal>
  );
}
