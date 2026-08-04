import Link from "next/link";

export const APP_STORE_URL =
  "https://apps.apple.com/fr/app/stan-qui-a-vote-pour-toi/id6740286416";

function AppleGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

type Props = {
  /** `hero` = le gros bouton rose. `ghost` = discret, pour la barre du haut. */
  variant?: "hero" | "ghost";
  className?: string;
  label?: string;
};

export function AppStoreButton({
  variant = "hero",
  className = "",
  label = "Télécharger sur iPhone",
}: Props) {
  if (variant === "ghost") {
    return (
      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener"
        className={`group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/10 ${className}`}
      >
        <AppleGlyph className="h-4 w-4" />
        Télécharger
      </Link>
    );
  }

  return (
    <Link
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener"
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl px-8 py-4.5 text-base font-black tracking-tight text-white shadow-[0_18px_50px_-12px_rgba(230,0,110,0.75)] transition-transform duration-300 will-change-transform hover:scale-[1.03] active:scale-[0.98] sm:text-lg ${className}`}
    >
      {/* Le gradient du vote */}
      <span className="absolute inset-0 bg-[linear-gradient(105deg,#d91cbd_0%,#e6006e_58%,#ff7a3d_120%)]" />
      {/* Reflet qui balaie au survol */}
      <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent_25%,rgba(255,255,255,0.42)_50%,transparent_75%)] transition-transform duration-700 group-hover:translate-x-[120%]" />
      <span className="relative flex items-center gap-3">
        <AppleGlyph className="h-5 w-5" />
        {label}
      </span>
    </Link>
  );
}
