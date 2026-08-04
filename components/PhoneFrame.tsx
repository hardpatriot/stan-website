/**
 * Châssis d'iPhone. Le contenu est posé dans un écran 19.5:9,
 * avec la Dynamic Island et une lueur rose derrière l'appareil.
 */
export function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* La lueur qui décolle le téléphone du fond */}
      <div
        aria-hidden
        className="animate-pulse-glow absolute -inset-10 -z-10 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(230,0,110,0.42)_0%,rgba(217,28,189,0.18)_38%,transparent_70%)] blur-2xl"
      />

      {/* Bords de l'appareil */}
      <div className="relative rounded-[3rem] bg-[linear-gradient(150deg,#3b3550_0%,#14101f_28%,#0a0813_60%,#2e2942_100%)] p-[3px] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="relative overflow-hidden rounded-[2.85rem] bg-night-950 p-[9px]">
          {/* Écran */}
          <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.35rem] bg-night-900">
            {children}

            {/* Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 z-30 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />

            {/* Barre d'accueil */}
            <div className="absolute bottom-2 left-1/2 z-30 h-1 w-28 -translate-x-1/2 rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
