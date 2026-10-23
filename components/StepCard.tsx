import { TRACES } from "./IconeEtape";

/**
 * Une carte d'étape, dans le style des cartes de l'app.
 *
 * Version sobre de VotesNotificationGlassCard (son état « déjà vu ») : verre
 * violet sombre, liseré blanc très fin, sans néon. L'icône garde la forme des
 * statuts Secret Crush (disque, puits sombre, pictogramme blanc) mais en une
 * seule teinte discrète. Le numéro est une pastille de statut neutre.
 */
export function StepCard({
  icon,
  numero,
  titre,
  corps,
}: {
  /** Nom du pictogramme (IconeEtape). */
  icon: string;
  numero: number;
  titre: string;
  corps: string;
}) {
  return (
    <article
      className="relative h-full rounded-[22px] p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(64,61,105,0.55), rgba(38,33,74,0.5) 48%, rgba(14,15,41,0.65)) padding-box, linear-gradient(#15102b, #15102b) padding-box, linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.09)) border-box",
        border: "1px solid transparent",
        boxShadow: "0 10px 28px -14px rgba(0,0,0,0.7)",
      }}
    >
      {/* Le filet blanc intérieur, en retrait de 2,5 pt */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[2.5px] rounded-[19px]"
        style={{
          padding: 0.65,
          background: "linear-gradient(135deg, rgba(255,255,255,0.1), transparent 50%)",
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
            background: "linear-gradient(135deg, rgba(196,181,253,0.55), rgba(129,140,248,0.3))",
            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
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
          className="rounded-full bg-white/[0.08] px-2 py-1 text-[11px] font-bold text-white/55"
        >
          Étape {numero}
        </span>
      </div>

      <h3 className="relative mt-4 text-[17px] font-semibold text-white">{titre}</h3>
      <p className="relative mt-1.5 text-[15px] leading-snug font-medium text-white/60">{corps}</p>
    </article>
  );
}
