"use client";

import { useEffect, useRef, useState } from "react";
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
/** L'âge affiché selon la place dans la pile : la plus récente en haut. */
const AGES = ["1m", "3m", "1h", "2h", "5h", "1j"];
/** Qui vote, dans l'ordre d'arrivée : un motif irrégulier, pour faire vrai. */
const SUITE = ["Il", "Elle", "Elle", "Il", "Elle", "Il", "Il", "Elle"] as const;
const VISIBLES = 5;
/** Une nouvelle notification toutes les 3 s. */
const CADENCE = 3000;

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
  nouvelle,
}: {
  qui: "Il" | "Elle";
  quand: string;
  nouvelle: boolean;
}) {
  const t = TEINTES[qui];
  return (
    <div
      className={`carte-vote relative flex items-center gap-4 overflow-hidden rounded-[22px] px-4 py-3.5 ${nouvelle ? "vote-arrive" : ""}`}
      style={{
        background: VERRE,
        boxShadow: `0 0 34px -10px ${t.halo}, 0 26px 50px -26px rgba(0,0,0,0.9)`,
      }}
    >
      {/* Le reflet du verre, en haut de la carte */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.13),rgba(255,255,255,0.03)_60%,transparent)]"
      />
      {/* À l'arrivée, un trait de lumière traverse la carte une fois */}
      {nouvelle ? (
        <span
          aria-hidden
          className="vote-balayage pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.22),transparent)]"
        />
      ) : null}
      <span
        className="relative h-14 w-14 shrink-0 rounded-full"
        style={{ boxShadow: `0 0 18px -2px ${t.halo}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- site statique, image déjà à la bonne taille */}
        <img src={t.icone} alt="" draggable={false} className="h-full w-full" />
      </span>
      <span className="relative flex-1 text-[17px] font-semibold text-white sm:text-lg">
        {qui} a voté pour toi
      </span>
      <span className="relative self-start pt-0.5 text-[15px] font-medium text-white/50">
        {quand}
      </span>
    </div>
  );
}

/**
 * Le fil vivant : toutes les 2,6 s, un vote tombe en haut, pousse les autres
 * vers le bas et la plus ancienne s'efface. Les cartes glissent d'une place à
 * l'autre (translation et échelle inférieure à 1 seulement : rien ne floute).
 * Tout s'arrête hors de l'écran, et pour qui a demandé moins d'animations.
 */
function FilDeVotes() {
  const [fil, setFil] = useState(() =>
    Array.from({ length: VISIBLES }, (_, i) => ({ id: i, qui: SUITE[i % SUITE.length] })),
  );
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = zone.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let minuterie: ReturnType<typeof setInterval> | undefined;
    let suivant = VISIBLES;
    const tic = () =>
      setFil((f) => {
        const id = suivant++;
        // Une de plus que visible : la dernière reste le temps de s'effacer.
        return [{ id, qui: SUITE[id % SUITE.length] }, ...f].slice(0, VISIBLES + 1);
      });
    const observateur = new IntersectionObserver(([e]) => {
      clearInterval(minuterie);
      if (e.isIntersecting && !document.hidden) minuterie = setInterval(tic, CADENCE);
    });
    observateur.observe(el);
    return () => {
      clearInterval(minuterie);
      observateur.disconnect();
    };
  }, []);

  const plusRecent = fil[0]?.id;
  return (
    <div ref={zone} className="relative h-[470px] -rotate-2 sm:h-[500px]">
      {fil.map((v, rang) => {
        const sortie = rang >= VISIBLES;
        const echelle = 1 - Math.min(rang, VISIBLES) * 0.075;
        // Chaque place descend un peu moins que la précédente : la pile se tasse.
        const y = rang * 92 - rang * rang * 3;
        return (
          <div
            key={v.id}
            className="absolute inset-x-0 top-0 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{
              transform: `translate(${rang * 14}px, ${y}px) scale(${echelle})`,
              transformOrigin: "left top",
              opacity: sortie ? 0 : 1 - rang * 0.13,
              zIndex: 20 - rang,
            }}
          >
            <CarteVote
              qui={v.qui}
              quand={AGES[Math.min(rang, AGES.length - 1)]}
              nouvelle={v.id === plusRecent && v.id >= VISIBLES}
            />
          </div>
        );
      })}
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
          <FilDeVotes />
          <div className="mt-10 flex justify-center lg:hidden">
            <DownloadButton look="verre" label="Découvre qui a voté pour toi" />
          </div>
        </div>
      </div>
    </section>
  );
}
