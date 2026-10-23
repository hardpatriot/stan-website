/**
 * Le GIF d'une question en petit, pour les listes : même écrin que dans
 * l'app (QuestionIllustrationView), coins arrondis, liseré métal
 * holographique. Les fichiers sont réduits à 96 px de haut, soit au moins
 * deux pixels réels par point à la taille affichée.
 */
export function GifMini({
  id,
  largeur,
  hauteur = 34,
  carre = false,
}: {
  /** Identifiant de la question : le fichier est /gifs/m{id}.webp. */
  id: string;
  /** Largeur du fichier, à 96 px de haut. */
  largeur: number;
  /** Hauteur affichée, en points. */
  hauteur?: number;
  /** Vignette carrée, recadrée au centre : toutes les lignes d'une liste alignées. */
  carre?: boolean;
}) {
  const l = carre ? hauteur : Math.round(Math.min(hauteur * 1.6, Math.max(hauteur * 0.8, (largeur * hauteur) / 96)));
  return (
    <span
      className="relative block shrink-0 rounded-[8px] bg-black/[0.12] p-[1.5px] shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
      style={{ width: l + 3, height: hauteur + 3 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- site statique, GIF animé */}
      <img
        src={`/gifs/m${id}.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="block h-full w-full rounded-[6.5px] object-cover"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[8px] opacity-65"
        style={{
          padding: 1,
          background:
            "linear-gradient(135deg, #f4f4f8, #9a9aa6 22%, #ffd9f2 38%, #c9f1ff 52%, #8f8f9c 68%, #fff6d6 84%, #b8b8c4)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </span>
  );
}
