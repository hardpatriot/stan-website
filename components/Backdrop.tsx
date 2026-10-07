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
          // Néon rose, bord gauche, haut de tuile
          "radial-gradient(ellipse 75% 30% at 0% 14%, rgba(255,40,200,0.42) 0%, rgba(217,28,189,0.16) 45%, transparent 75%)",
          // Néon bleu électrique, bord droit, milieu de tuile
          "radial-gradient(ellipse 72% 28% at 100% 52%, rgba(60,110,255,0.38) 0%, rgba(80,70,255,0.14) 45%, transparent 75%)",
          // Retour rose, bas de tuile, plus discret
          "radial-gradient(ellipse 65% 24% at 15% 88%, rgba(200,40,255,0.24) 0%, transparent 72%)",
          // La base : indigo, même teinte en haut et en bas de la tuile
          "linear-gradient(180deg, #120a3d 0%, #170c4a 35%, #140b44 65%, #120a3d 100%)",
        ].join(", "),
        backgroundSize: "100% 220svh",
        backgroundRepeat: "repeat-y",
      }}
    />
  );
}
