/**
 * La nuit de l'app : BackgroundViewStyle.standard, #120D24 puis #1F1445,
 * assombri pour le site. La teinte, #120d26, est portée par `html`.
 *
 * Bandes en haut et en bas de l'écran sur iPhone (Safari 26). Safari repère
 * tout élément fixé ou collé (sticky), presque aussi large que l'écran, au ras
 * du haut ou du bas : il prend sa couleur (ou un échantillon, s'il n'a qu'un
 * dégradé) et la peint en aplat OPAQUE sous la barre d'état ou sous la barre
 * d'adresse, ce qui coupe la page. Il ignore seulement un élément invisible
 * qui laisse passer le toucher. D'où ce calque : un cadre fixé `invisible` et
 * `pointer-events-none`, dont seul l'enfant (les lueurs) est visible. Même
 * règle pour les scènes collées (EmojiSphere, SceneQuestion) ; l'en-tête
 * (Nav) n'est pas fixé ; l'échelle de défilement est réservée à la souris.
 * Vérifié dans Safari d'un simulateur iPhone 17 Pro (iOS 26) le 05/11/2026.
 *
 * Les lueurs restent au milieu de l'écran. Pas de grain : Julien le trouvait
 * pixelisé.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="invisible pointer-events-none fixed inset-0 -z-10">
      <div
        className="visible absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 70% 28% at 50% 38%, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0.05) 45%, transparent 100%)",
            "radial-gradient(ellipse 46% 17% at 88% 58%, rgba(230,0,110,0.07) 0%, transparent 100%)",
            "radial-gradient(ellipse 40% 16% at 10% 60%, rgba(61,110,255,0.06) 0%, transparent 100%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
