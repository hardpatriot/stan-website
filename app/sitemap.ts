import type { MetadataRoute } from "next";

const SITE = "https://www.stan-friends.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-04");

  return [
    { url: SITE, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE}/centre-de-securite`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE}/politique-de-confidentialite`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE}/conditions-dutilisation`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
