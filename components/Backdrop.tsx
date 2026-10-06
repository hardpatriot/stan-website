/**
 * La nuit des écrans App Store : un fond indigo profond, éclairé par un néon
 * rose à gauche et un néon bleu électrique à droite, qui dérivent lentement.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-x-0 -top-[env(safe-area-inset-top)] -bottom-40 -z-10 overflow-hidden"
    >
      {/* Le fond, indigo vers nuit */}
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#0d0830_0%,#1a0d52_42%,#120a3d_70%,#07051a_100%)]" />

      {/* Néon rose, bord gauche */}
      <div className="animate-drift absolute -top-[16%] -left-[22%] h-[70vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(255,40,200,0.55)_0%,rgba(217,28,189,0.22)_40%,transparent_70%)] blur-3xl" />

      {/* Néon bleu électrique, bord droit */}
      <div
        className="animate-drift absolute top-[22%] -right-[24%] h-[66vw] w-[58vw] rounded-full bg-[radial-gradient(circle,rgba(60,110,255,0.5)_0%,rgba(80,70,255,0.2)_42%,transparent_72%)] blur-3xl"
        style={{ animationDelay: "-7s" }}
      />

      {/* Retour rose, en bas */}
      <div
        className="animate-drift absolute bottom-[-20%] left-[10%] h-[52vw] w-[52vw] rounded-full bg-[radial-gradient(circle,rgba(200,40,255,0.32)_0%,transparent_66%)] blur-3xl"
        style={{ animationDelay: "-14s" }}
      />

      {/* Vignettage : les bords rabattus vers la nuit */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,5,26,0.7)_100%)]" />
    </div>
  );
}
