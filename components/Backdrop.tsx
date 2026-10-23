/**
 * TEST A : la nuit de l'app, telle quelle.
 *
 * BackgroundViewStyle.standard dans l'app : #120D24 puis #1F1445. Le site
 * reprend ces deux teintes, beaucoup plus sombres que le fond précédent, et ne
 * garde qu'une lueur violette très discrète par écran, en haut, comme le halo
 * que l'app pose derrière sa barre d'onglets. Un seul élément, peint une fois.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundColor: "#0b0818",
        backgroundImage: [
          "radial-gradient(ellipse 90% 26% at 50% 0%, rgba(124,58,237,0.16) 0%, rgba(124,58,237,0.05) 45%, transparent 75%)",
          "radial-gradient(ellipse 60% 18% at 100% 58%, rgba(230,0,110,0.07) 0%, transparent 75%)",
          "linear-gradient(180deg, #0b0818 0%, #120d24 30%, #171030 62%, #0b0818 100%)",
        ].join(", "),
        backgroundSize: "100% 200svh",
        backgroundRepeat: "repeat-y",
      }}
    />
  );
}
