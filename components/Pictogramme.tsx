import { Emoji } from "./EmojiSprite";

/**
 * Un emoji du pack, ou une animation maison quand on en a une pour ce nom.
 *
 * Les animations sont des WebP animés sans métadonnées, rangés dans
 * `public/animes/`. Ce ne sont pas des photos de profil : elles gardent leur
 * cadre rectangulaire, coins juste adoucis. `carre` sert là où la place est
 * strictement carrée (la sphère).
 */
const ANIMES: Record<string, { rect: string; carre: string; ratio: number }> = {
  halloween: {
    rect: "/animes/halloween.webp",
    carre: "/animes/halloween-carre.webp",
    ratio: 245 / 140,
  },
};

export function Pictogramme({
  name,
  className = "",
  carre = false,
}: {
  name: string;
  className?: string;
  carre?: boolean;
}) {
  const anime = ANIMES[name];
  if (!anime) return <Emoji name={name} className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- site statique, image déjà à la bonne taille
    <img
      src={carre ? anime.carre : anime.rect}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className={`object-cover ${carre ? "rounded-[22%]" : "rounded-[11%_/_20%]"} ${className}`}
      // Hors de la sphère, la hauteur prévue pour l'emoji est gardée et la
      // largeur suit le format du film.
      style={carre ? undefined : { width: "auto", aspectRatio: String(anime.ratio) }}
    />
  );
}
