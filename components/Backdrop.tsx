/**
 * La nuit des écrans App Store : un fond indigo profond, éclairé de néons
 * rose et bleu.
 *
 * Ce fond DÉFILE avec la page (position absolue), il n'est plus fixé à
 * l'écran. Safari iOS 26 traite un élément fixe qui touche le bas de l'écran
 * comme une barre collée en bas : il arrête alors la page au-dessus de sa
 * barre d'adresse et peint une bande pleine dessous. Sans élément fixe en bas,
 * la page passe sous la barre flottante, comme sur les autres sites.
 *
 * Les lueurs se répètent tout au long de la page, rose à gauche puis bleu à
 * droite, pour qu'on retrouve la même lumière à chaque écran.
 */
const ETAPES = Array.from({ length: 12 }, (_, i) => i);

export function Backdrop() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Le fond, indigo vers nuit, qui respire légèrement d'un écran à l'autre */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d0830_0%,#170c4a_8%,#120a3d_20%,#160b46_35%,#110a3a_50%,#170c4a_65%,#120a3d_80%,#0b0728_100%)]" />

      {ETAPES.map((i) => (
        <div key={i}>
          {/* Néon rose, bord gauche */}
          <div
            className="animate-drift absolute -left-[22%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(255,40,200,0.5)_0%,rgba(217,28,189,0.2)_40%,transparent_70%)] blur-3xl"
            style={{ top: `${i * 110 - 18}vh`, animationDelay: `${-i * 5}s` }}
          />
          {/* Néon bleu électrique, bord droit */}
          <div
            className="animate-drift absolute -right-[24%] h-[66vh] w-[58vw] rounded-full bg-[radial-gradient(circle,rgba(60,110,255,0.45)_0%,rgba(80,70,255,0.18)_42%,transparent_72%)] blur-3xl"
            style={{ top: `${i * 110 + 30}vh`, animationDelay: `${-i * 5 - 7}s` }}
          />
        </div>
      ))}
    </div>
  );
}
