import { DownloadButton } from "./DownloadButton";
import { Reveal } from "./Reveal";

/**
 * La pile de notifications des écrans App Store, refaite en vrai avec les
 * éléments de l'app : les icônes icon_stan_boy et icon_stan_girl, et le verre
 * de VotesNotificationGlassCard (mêmes teintes, mêmes accents). Les cartes
 * rapetissent en s'éloignant.
 *
 * Seules des transformations 2D (translation, échelle inférieure à 1) : le
 * texte reste net, aucune couche n'est agrandie.
 */
const VOTES = [
  { qui: "Il", quand: "3m" },
  { qui: "Elle", quand: "1h" },
  { qui: "Elle", quand: "2h" },
  { qui: "Il", quand: "5h" },
  { qui: "Elle", quand: "1j" },
] as const;

const TEINTES = {
  Il: { icone: "/notif-boy.webp", halo: "rgba(255,36,128,0.5)" },
  Elle: { icone: "/notif-girl.webp", halo: "rgba(13,214,255,0.45)" },
} as const;

/** Le verre de VotesNotificationGlassCard : fond indigo, accents rose à cyan. */
const VERRE =
  "linear-gradient(90deg, rgba(255,36,128,0.13) 0%, rgba(145,64,255,0.07) 42%, rgba(61,110,255,0.07) 72%, rgba(13,214,255,0.12) 100%), linear-gradient(135deg, rgba(64,61,105,0.68) 0%, rgba(38,33,74,0.58) 48%, rgba(14,15,41,0.72) 100%)";

function CarteVote({
  qui,
  quand,
  rang,
}: {
  qui: "Il" | "Elle";
  quand: string;
  rang: number;
}) {
  const t = TEINTES[qui];
  const echelle = 1 - rang * 0.075;
  return (
    <div
      className="neon flex items-center gap-4 rounded-[20px] px-4 py-3.5"
      style={{
        background: VERRE,
        transform: `translateX(${rang * 14}px) scale(${echelle})`,
        transformOrigin: "left center",
        opacity: 1 - rang * 0.13,
        boxShadow: `0 0 30px -8px ${t.halo}, 0 24px 50px -24px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12)`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- site statique, image déjà à la bonne taille */}
      <img
        src={t.icone}
        alt=""
        draggable={false}
        className="h-14 w-14 shrink-0"
        style={{ filter: `drop-shadow(0 0 10px ${t.halo})` }}
      />
      <span className="flex-1 text-[17px] font-semibold text-white sm:text-lg">
        {qui} a voté pour toi
      </span>
      <span className="text-[15px] font-medium text-white/45">{quand}</span>
    </div>
  );
}

export function VotesNeon() {
  return (
    <section className="relative px-5 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal className="min-w-0">
          <h2 className="display text-[clamp(2.4rem,7vw,4.4rem)] text-white text-balance">
            Des votes. <span className="text-vote">Mais de qui&nbsp;?</span>
          </h2>
          <div className="mt-9 hidden lg:block">
            <DownloadButton look="verre" label="Découvre qui a voté pour toi" />
          </div>
        </Reveal>

        <div className="min-w-0">
          <div className="flex -rotate-2 flex-col gap-3">
            {VOTES.map((v, i) => (
              <Reveal key={i} delay={i * 110}>
                <CarteVote qui={v.qui} quand={v.quand} rang={i} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center lg:hidden">
            <DownloadButton look="verre" label="Découvre qui a voté pour toi" />
          </div>
        </div>
      </div>
    </section>
  );
}
