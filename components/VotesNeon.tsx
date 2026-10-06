import { DownloadButton } from "./DownloadButton";
import { Reveal } from "./Reveal";

/**
 * La pile de notifications des écrans App Store, refaite en vrai : des cartes
 * de verre cerclées de néon, une casquette rose pour « il », bleue pour
 * « elle », qui rapetissent en s'éloignant.
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
  Il: {
    anneau: "linear-gradient(135deg,#ff4fd8,#ff7a3d)",
    halo: "rgba(255,60,190,0.55)",
    casquette: "none",
  },
  Elle: {
    anneau: "linear-gradient(135deg,#5ce1ff,#4f6bff)",
    halo: "rgba(70,140,255,0.55)",
    // La casquette rose, teintée en bleu d'un seul ton.
    casquette:
      "grayscale(1) brightness(1.2) sepia(1) hue-rotate(178deg) saturate(5)",
  },
} as const;

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
      className="neon flex items-center gap-4 rounded-[24px] px-4 py-3.5"
      style={{
        transform: `translateX(${rang * 14}px) scale(${echelle})`,
        transformOrigin: "left center",
        opacity: 1 - rang * 0.13,
        boxShadow: `0 0 30px -8px ${t.halo}, 0 24px 50px -24px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12)`,
      }}
    >
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full p-[2.5px]"
        style={{ background: t.anneau, boxShadow: `0 0 16px ${t.halo}` }}
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#07051a]">
          {/* eslint-disable-next-line @next/next/no-img-element -- site statique, image déjà à la bonne taille */}
          <img
            src="/casquette.webp"
            alt=""
            className="w-[72%]"
            style={{ filter: t.casquette }}
          />
        </span>
      </span>
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
            2 votes. <span className="text-vote">Mais de qui&nbsp;?</span>
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
