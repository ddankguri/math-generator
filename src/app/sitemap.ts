import type { MetadataRoute } from "next";
import { getLearningContentPath, problemTypeLearningContent } from "@/data/learningContent/problemTypeContent";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/privacy", "/terms", "/contact", "/learn", "/learn/elementary5/fraction", ...problemTypeLearningContent.map(getLearningContentPath)];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date("2026-07-15"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
