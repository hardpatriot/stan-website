import type { MetadataRoute } from "next";

// Requis par `output: "export"` : le fichier est écrit une fois au build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.stan-friends.com/sitemap.xml",
  };
}
