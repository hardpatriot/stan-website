/**
 * Les icônes des quatre étapes : des pictogrammes au trait plutôt que des
 * emojis, trop enfantins à cet endroit (Julien, 08/10). Tracés d'après la
 * famille Lucide (licence ISC), au trait arrondi, dans un dégradé néon de la
 * couleur de l'étape, posés sur une petite tuile de verre.
 */
const TRACES: Record<string, React.ReactNode> = {
  // Rejoindre son école : la toque
  ecole: (
    <>
      <path d="M21.4 10.9 12 15.5 2.6 10.9 12 6.3Z" />
      <path d="M6.2 12.7v4.1c0 1.4 2.6 2.9 5.8 2.9s5.8-1.5 5.8-2.9v-4.1" />
      <path d="M21.4 10.9v5.4" />
    </>
  ),
  // Ajouter ses amis : deux silhouettes et un plus
  amis: (
    <>
      <path d="M15.5 20.5v-1.6a4 4 0 0 0-4-4h-5a4 4 0 0 0-4 4v1.6" />
      <circle cx="9" cy="7.6" r="3.6" />
      <path d="M19 8.2v5.6M21.8 11h-5.6" />
    </>
  ),
  // Répondre aux questions : la bulle et le point d'interrogation
  questions: (
    <>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2.4 21.6Z" />
      <path d="M9.4 9.3a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.5-2.6 2.5" />
      <path d="M12 16.4h.01" />
    </>
  ),
  // Recevoir la notif : la cloche et son point
  notif: (
    <>
      <path d="M6 8.5a6 6 0 0 1 12 0c0 6.6 2.6 8.5 2.6 8.5H3.4S6 15.1 6 8.5" />
      <path d="M10.3 20.6a1.9 1.9 0 0 0 3.4 0" />
      <circle cx="18.6" cy="4.6" r="2.2" fill="currentColor" stroke="none" />
    </>
  ),
};

export function IconeEtape({ nom, teinte }: { nom: string; teinte: string }) {
  const id = `etape-${nom}`;
  return (
    <span
      className="relative flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-105"
      style={{
        background: `linear-gradient(145deg, color-mix(in srgb, ${teinte} 26%, transparent), rgba(255,255,255,0.04))`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px color-mix(in srgb, ${teinte} 45%, transparent), 0 0 22px -6px ${teinte}`,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-[26px] w-[26px]"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: teinte }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor={teinte} />
            <stop offset="1" stopColor={teinte} />
          </linearGradient>
        </defs>
        {TRACES[nom]}
      </svg>
    </span>
  );
}
