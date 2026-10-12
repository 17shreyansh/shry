import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://shry.in"),
  title: {
    default: "SHRY — Technology partner: websites, software, integrations & support",
    template: "%s — SHRY",
  },
  description:
    "SHRY builds, connects and manages the systems businesses depend on: websites and software, integrations and practical automation, and ongoing technical support.",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "SHRY",
    url: "https://shry.in/",
    title: "SHRY — We build the systems behind growing businesses",
    description: "A technology partner that builds, connects and manages the systems businesses depend on.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#08090B" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SHRY",
  url: "https://shry.in/",
  description: "A technology partner that builds, connects and manages the systems businesses depend on.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
