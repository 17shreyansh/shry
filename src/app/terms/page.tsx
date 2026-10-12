import type { Metadata } from "next";
import { Legal } from "@/components/Legal";

export const metadata: Metadata = { title: "Terms", description: "Terms of use for the SHRY website.", alternates: { canonical: "/terms" } };

export default function Page() {
  return (
    <Legal title="Terms" updated="October 2026">
      {/* TODO(owner): have counsel review before launch. */}
      <p>These terms cover your use of this website. Work we do for clients is governed by a separate written agreement.</p>
      <h2>Use of this site</h2>
      <p>The content here is provided for general information about SHRY&apos;s services. Please don&apos;t misuse the site, attempt to disrupt it or use it to send unsolicited material.</p>
      <h2>No guarantee</h2>
      <p>We work to keep the information accurate and current, but it is provided as is. Descriptions of projects and services are illustrative and don&apos;t form an offer.</p>
      <h2>Intellectual property</h2>
      <p>The site&apos;s design, text and code are owned by SHRY unless noted. Project names belong to their respective owners.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date above shows the latest version.</p>
    </Legal>
  );
}
