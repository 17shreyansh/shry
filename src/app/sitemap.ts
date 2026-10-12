import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { PROJECTS, SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "", "/services", "/ai-automation", "/work", "/process", "/about", "/contact", "/privacy", "/terms",
    ...SERVICES.map((s) => `/services/${s.slug}`),
    ...PROJECTS.map((p) => `/work/${p.id}`),
  ];
  return routes.map((r) => ({
    url: `${SITE.url}${r}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r === "" ? 1 : r.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
