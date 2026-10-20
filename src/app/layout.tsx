import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Website Development & Business Software | SHRY",
    template: "%s | SHRY",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "SHRY",
    url: SITE.url + "/",
    title: "SHRY — Websites, Software & AI Automation for Growing Businesses",
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#08090B" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SHRY",
  url: SITE.url + "/",
  description: SITE.description,
  email: SITE.email || undefined,
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  knowsAbout: [
    "Website Development",
    "Custom Software Development",
    "Web Application Development",
    "Mobile App Development",
    "SaaS Product Development",
    "AI Automation",
    "Business Process Automation",
    "Software Integration",
    "API Development",
    "Website Maintenance",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SHRY",
  url: SITE.url + "/",
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
