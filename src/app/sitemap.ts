import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { PROJECTS, SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Stable release date prevents false cache busting on every crawler visit
  const lastUpdated = new Date("2026-10-20");
  const routes = [
    "", "/services", "/ai-automation", "/work", "/process", "/about", "/contact", "/privacy", "/terms",
    ...SERVICES.map((s) => `/services/${s.slug}`),
    ...PROJECTS.map((p) => `/work/${p.id}`),
  ];
  return routes.map((r) => ({
    url: `${SITE.url}${r}`,
    lastModified: lastUpdated,
    changeFrequency: "monthly" as const,
    priority: r === "" ? 1 : r.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
