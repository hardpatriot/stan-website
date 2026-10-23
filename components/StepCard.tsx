import { TRACES } from "./IconeEtape";

/**
 * Une carte d'étape, aux couleurs de l'app.
 *
 * Le fond est VotesNotificationGlassCard, la carte des votes : verre violet
 * sombre, voile coloré rose → violet → bleu → cyan, liseré néon du même
 * dégradé et filet blanc intérieur. L'icône est celle des statuts Secret
 * Crush (SentCrushPollStatusIcon) : un disque en dégradé, un puits sombre et
 * le pictogramme en blanc. Le numéro est une pastille de statut, comme
 * « Indice » ou « Reveal » dans l'onglet Votes.
 */
export function StepCard({
  icon,
  numero,
  titre,
  corps,
  couleurs,
}: {
  /** Nom du pictogramme (IconeEtape). */
  icon: string;
  numero: number;
  titre: string;
  corps: string;
  /** Les deux couleurs du disque, la première sert aussi à la pastille. */
  couleurs: [string, string];
}) {
  const [a, b] = couleurs;
  return (
    <article
      className="relative h-full rounded-[22px] p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(64,61,105,0.68), rgba(38,33,74,0.58) 48%, rgba(14,15,41,0.72)) padding-box, linear-gradient(90deg, rgba(255,36,128,0.13), rgba(145,64,255,0.07) 42%, rgba(61,110,255,0.07) 72%, rgba(13,214,255,0.12)) padding-box, linear-gradient(#181231, #181231) padding-box, linear-gradient(90deg, rgba(255,36,128,0.92), rgba(145,64,255,0.8) 38%, rgba(61,110,255,0.76) 72%, rgba(13,214,255,0.92)) border-box",
        border: "1.1px solid transparent",
        boxShadow: "-1px 2px 10px rgba(255,36,128,0.12), 2px 0 8px rgba(13,214,255,0.08), 0 6px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Le filet blanc intérieur, en retrait de 2,5 pt */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[2.5px] rounded-[19px]"
        style={{
          padding: 0.65,
          background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent 50%, rgba(255,36,128,0.1))",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="relative flex items-start justify-between">
        {/* SentCrushPollStatusIcon */}
        <span
          className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(135deg, ${a}, ${b})`,
            boxShadow: `0 5px 12px color-mix(in srgb, ${a} 42%, transparent)`,
          }}
        >
          <span className="absolute inset-[4.5px] rounded-full bg-[#100A24]/[0.88]" />
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="relative h-[21px] w-[21px] text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {TRACES[icon]}
          </svg>
        </span>
        <span
          className="rounded-full px-2 py-1 text-[11px] font-bold"
          style={{ color: a, background: `color-mix(in srgb, ${a} 15%, transparent)` }}
        >
          Étape {numero}
        </span>
      </div>

      <h3 className="relative mt-4 text-[17px] font-semibold text-white">{titre}</h3>
      <p className="relative mt-1.5 text-[15px] leading-snug font-medium text-white/60">{corps}</p>
    </article>
  );
}
