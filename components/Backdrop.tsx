/**
 * La nuit de l'app : BackgroundViewStyle.standard, #120D24 puis #1F1445,
 * assombri pour le site.
 *
 * La teinte de fond, #120d26, est portée par `html` : c'est aussi celle que
 * Safari peint, opaque, sous la barre d'état et la barre d'outils. Pour ne
 * JAMAIS voir de bande en haut ou en bas de l'écran, le fond qui touche ces
 * barres doit toujours être exactement cette teinte. Les lueurs sont donc
 * sur un calque fixe et restent au milieu de l'écran : elles sont éteintes
 * bien avant les bords (au moins 10 % de la hauteur), quel que soit le
 * défilement. Pas de grain : Julien le trouvait pixelisé.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundImage: [
          "radial-gradient(ellipse 70% 28% at 50% 40%, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0.05) 45%, transparent 100%)",
          "radial-gradient(ellipse 46% 20% at 88% 64%, rgba(230,0,110,0.07) 0%, transparent 100%)",
          "radial-gradient(ellipse 40% 18% at 10% 66%, rgba(61,110,255,0.06) 0%, transparent 100%)",
        ].join(", "),
      }}
    />
  );
}
