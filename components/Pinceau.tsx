/**
 * Le coup de pinceau rose des écrans App Store, sous un titre.
 *
 * Dimensionné en `em` : posé dans un titre, il suit sa taille de police sans
 * réglage. Purement décoratif, invisible pour les lecteurs d'écran.
 */
export function Pinceau({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 44"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-[0.38em] drop-shadow-[0_0_14px_rgba(255,40,170,0.75)] ${className}`}
    >
      <defs>
        <linearGradient id="pinceau-rose" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ff2aa8" />
          <stop offset="0.6" stopColor="#ff3cc8" />
          <stop offset="1" stopColor="#ff5ad8" />
        </linearGradient>
      </defs>
      {/* Le trait principal : fin à l'attaque, épais au milieu, effiloché au bout. */}
      <path
        fill="url(#pinceau-rose)"
        d="M6 33 C 90 24, 210 16, 350 11 C 440 8, 520 6, 597 3 L 590 9 L 598 12 L 586 15 C 520 18, 440 21, 360 25 C 250 30, 140 36, 22 41 L 12 39 Z"
      />
      {/* Les fibres sèches du pinceau. */}
      <path
        fill="none"
        stroke="#ff4fd0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
        d="M40 42 L 260 31 M 120 22 L 330 13 M 380 24 L 560 17 M 300 9 L 470 5"
      />
    </svg>
  );
}
