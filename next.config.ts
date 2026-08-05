import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le site est 100 % statique : aucune route serveur, aucune base de données.
  // L'export produit un dossier `out/` de fichiers plats, que Cloudflare Pages
  // sert directement. C'est aussi ce qui rend l'hébergement gratuit sans réserve.
  output: "export",

  // Sans serveur Next, il n'y a personne pour redimensionner les images à la
  // volée. Les nôtres sont déjà aux bonnes tailles (cap-180, cap-512).
  images: { unoptimized: true },
};

export default nextConfig;
