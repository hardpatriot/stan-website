/**
 * La nuit de Stan : le gradient de BackgroundViewStyle.standard,
 * plus trois nappes de lumière qui dérivent lentement derrière le contenu.
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Le fond de l'app */}
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#0b0716_0%,#120d24_38%,#1f1445_78%,#0f0a20_100%)]" />

      {/* Nappe magenta, celle du vote */}
      <div className="animate-drift absolute -top-[18%] -left-[12%] h-[62vw] w-[62vw] rounded-full bg-[radial-gradient(circle,rgba(217,28,189,0.34)_0%,rgba(230,0,110,0.14)_42%,transparent_70%)] blur-3xl" />

      {/* Nappe violette, Aura */}
      <div
        className="animate-drift absolute top-[26%] -right-[16%] h-[58vw] w-[58vw] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.30)_0%,rgba(99,102,241,0.12)_45%,transparent_72%)] blur-3xl"
        style={{ animationDelay: "-7s" }}
      />

      {/* Nappe cyan, discrète, en bas */}
      <div
        className="animate-drift absolute bottom-[-14%] left-[24%] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgba(71,219,255,0.16)_0%,transparent_66%)] blur-3xl"
        style={{ animationDelay: "-14s" }}
      />

      {/* Vignettage : on rabat les bords vers le noir */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(8,5,15,0.72)_100%)]" />
    </div>
  );
}
