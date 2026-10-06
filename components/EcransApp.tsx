"use client";

import { useRef } from "react";
import { Pinceau } from "./Pinceau";
import { Reveal } from "./Reveal";

/**
 * Les écrans de la fiche App Store, en bande qu'on fait défiler.
 *
 * Images en 720 px de large : un écran mesure au plus 260 px à l'écran, soit
 * 520 à 780 pixels réels selon la densité. Chargées seulement à l'approche.
 */
const ECRANS = [
  "Crush. Flags. Secrets.",
  "Tes potes ont reçu quoi ?",
  "2 meufs ont voté pour toi…",
  "Reçois des notifs si t'es choisi·e.",
  "Tes potes. Leurs votes.",
  "Il t'a choisie. Mais qui ?",
  "2 votes. Mais de qui ?",
  "Qui regarde ton profil ?",
  "Qui est en tête ?",
  "La map des blocus.",
];

export function EcransApp() {
  const bande = useRef<HTMLDivElement>(null);

  // Au bureau, une souris ne fait pas défiler à l'horizontale : deux flèches
  // avancent d'une largeur d'écran à la fois.
  const glisser = (sens: 1 | -1) => {
    const el = bande.current;
    if (!el) return;
    el.scrollBy({ left: sens * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="relative py-14 sm:py-24">
      <Reveal className="px-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-6">
          <div>
            <p className="text-sm font-black tracking-[0.18em] text-lavender uppercase">
              Dans l&apos;app
            </p>
            <h2 className="punch mt-4 inline-block -rotate-2 text-[clamp(2.3rem,6.4vw,4.2rem)] text-white">
              Ce qui t&apos;attend.
              <Pinceau className="mt-[0.02em] w-full" />
            </h2>
          </div>
          <div className="hidden shrink-0 gap-2.5 sm:flex">
            {([-1, 1] as const).map((sens) => (
              <button
                key={sens}
                type="button"
                onClick={() => glisser(sens)}
                aria-label={sens < 0 ? "Écrans précédents" : "Écrans suivants"}
                className="neon flex h-12 w-12 items-center justify-center rounded-full text-xl font-black text-white transition hover:scale-105 active:scale-95"
              >
                {sens < 0 ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div
        ref={bande}
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pt-4 pb-10 [scrollbar-width:none] sm:mt-14 sm:gap-6 sm:px-[max(2rem,calc((100vw_-_72rem)/2))] sm:scroll-px-[max(2rem,calc((100vw_-_72rem)/2))] [&::-webkit-scrollbar]:hidden"
      >
        {ECRANS.map((titre, i) => (
          <figure
            key={titre}
            className="neon w-[62vw] max-w-[260px] shrink-0 snap-center overflow-hidden rounded-[28px] sm:w-[260px] sm:snap-start"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- site statique, images déjà à la bonne taille */}
            <img
              src={`/ecrans/${String(i + 1).padStart(2, "0")}.webp`}
              alt={`Écran de l'app Stan : ${titre}`}
              width={720}
              height={1558}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="block h-auto w-full"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
