/**
 * La nuit de l'app : BackgroundViewStyle.standard, #120D24 puis #1F1445,
 * assombri pour le site.
 *
 * Un seul élément, peint une fois, répété verticalement. Chaque tuile est
 * raccordable : le dégradé finit sur la couleur où il commence, et chaque
 * lueur est centrée assez loin des bords pour être éteinte avant la jointure.
 * Aucune lueur ne touche le haut ou le bas d'une tuile, donc aucune ligne
 * nette. Pas de grain : Julien le trouvait pixelisé.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundColor: "#0c0919",
        backgroundImage: [
          "radial-gradient(ellipse 70% 26% at 50% 34%, rgba(124,58,237,0.13) 0%, rgba(124,58,237,0.05) 45%, transparent 100%)",
          "radial-gradient(ellipse 46% 18% at 88% 72%, rgba(230,0,110,0.07) 0%, transparent 100%)",
          "radial-gradient(ellipse 40% 16% at 10% 76%, rgba(61,110,255,0.06) 0%, transparent 100%)",
          "linear-gradient(180deg, #0c0919 0%, #110c22 22%, #16102e 50%, #110c22 78%, #0c0919 100%)",
        ].join(", "),
        backgroundSize: "100% 220svh",
        backgroundRepeat: "repeat-y",
      }}
    />
  );
}
