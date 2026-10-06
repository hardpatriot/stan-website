import { Emoji } from "./EmojiSprite";

/**
 * Un emoji du pack, ou une animation maison quand on en a une pour ce nom.
 *
 * Les animations sont des WebP animés détourés en rond, sans métadonnées,
 * rangés dans `public/animes/`.
 */
const ANIMES: Record<string, string> = {
  halloween: "/animes/halloween.webp",
};

export function Pictogramme({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const anime = ANIMES[name];
  if (!anime) return <Emoji name={name} className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- site statique, image déjà à la bonne taille
    <img
      src={anime}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className={`rounded-full object-cover ${className}`}
    />
  );
}
