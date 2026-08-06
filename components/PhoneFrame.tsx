/**
 * Châssis d'iPhone 15 (393×852 pt).
 *
 * L'écran est dessiné à sa taille réelle en points, puis mis à l'échelle d'un
 * bloc. Ça permet de reprendre les valeurs de l'app telles quelles — 147 pt de
 * carte, 47 pt de rayon, 18 pt de texte — sans avoir à les reconvertir.
 */
export function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative [--ps:0.76] sm:[--ps:0.84] ${className}`}>
      {/* La lueur qui décolle le téléphone du fond */}
      <div
        aria-hidden
        className="animate-pulse-glow absolute -inset-10 -z-10 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(230,0,110,0.38)_0%,rgba(217,28,189,0.16)_38%,transparent_70%)] blur-2xl"
      />

      {/* Bords de l'appareil */}
      <div className="relative rounded-[calc(60px*var(--ps))] bg-[linear-gradient(150deg,#3b3550_0%,#14101f_28%,#0a0813_60%,#2e2942_100%)] p-[calc(4px*var(--ps))] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="relative rounded-[calc(56px*var(--ps))] bg-night-950 p-[calc(10px*var(--ps))]">
          {/* L'écran, à l'échelle */}
          <div
            className="relative overflow-hidden rounded-[calc(46px*var(--ps))] bg-[linear-gradient(140deg,#120d24_0%,#1f1445_100%)]"
            style={{
              width: "calc(393px * var(--ps))",
              height: "calc(852px * var(--ps))",
            }}
          >
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{
                width: 393,
                height: 852,
                transform: "scale(var(--ps))",
              }}
            >
              {children}
            </div>

            {/* Dynamic Island */}
            <div
              className="absolute left-1/2 z-30 -translate-x-1/2 rounded-full bg-black"
              style={{
                top: "calc(11px * var(--ps))",
                width: "calc(125px * var(--ps))",
                height: "calc(36px * var(--ps))",
              }}
            />

            {/* Barre d'accueil */}
            <div
              className="absolute left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/70"
              style={{
                bottom: "calc(9px * var(--ps))",
                width: "calc(140px * var(--ps))",
                height: "calc(5px * var(--ps))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
