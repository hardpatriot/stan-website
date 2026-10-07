/**
 * La nuit des écrans App Store : un fond indigo profond, éclairé de néons
 * rose à gauche et bleu à droite, qui se répètent tout au long de la page.
 *
 * UN SEUL élément, peint UNE fois. Pas de flou (`filter: blur`), pas de
 * mélange (`mix-blend-mode`), pas d'animation : sur iPhone, Safari recalcule
 * un flou animé à chaque image, et un grain mélangé sur toute la hauteur de
 * la page l'obligeait à recomposer tout ce qui bouge dessous, sphère comprise.
 * C'est ce qui faisait ramer la page. Les dégradés radiaux sont déjà doux par
 * nature : le flou n'apportait rien qu'on voie.
 *
 * Le fond défile avec la page (position absolue, pas fixe) : un élément fixe
 * collé en bas empêchait la page de passer sous la barre de Safari iOS 26.
 * Le motif est une tuile de 220 % de hauteur d'écran, répétée verticalement ;
 * le haut et le bas de la tuile ont la même teinte, la couture ne se voit pas.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        backgroundColor: "#120a3d",
        backgroundImage: [
          // Chaque lueur s'éteint AVANT le bord de la tuile (centre ± 75 % du
          // rayon reste dans 0-100 %) : sinon elle est coupée net à la couture
          // et une ligne horizontale apparaît.
          // Néon rose, bord gauche, haut de tuile
          "radial-gradient(ellipse 80% 26% at 0% 22%, rgba(255,40,200,0.44) 0%, rgba(217,28,189,0.17) 42%, transparent 75%)",
          // Néon bleu électrique, bord droit, milieu de tuile
          "radial-gradient(ellipse 78% 28% at 100% 56%, rgba(60,110,255,0.40) 0%, rgba(80,70,255,0.15) 42%, transparent 75%)",
          // Retour rose, bas de tuile, plus discret
          "radial-gradient(ellipse 70% 17% at 12% 86%, rgba(200,40,255,0.26) 0%, transparent 75%)",
          // La base : indigo, même teinte en haut et en bas de la tuile
          "linear-gradient(180deg, #120a3d 0%, #170c4a 35%, #140b44 65%, #120a3d 100%)",
        ].join(", "),
        backgroundSize: "100% 220svh",
        backgroundRepeat: "repeat-y",
      }}
    />
  );
}
