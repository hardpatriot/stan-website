"use client";

import { useRef } from "react";
import { phase, useScene } from "./useScene";

/**
 * Scène 2 : une question, en vrai. L'écran de vote de l'app (393 × 852,
 * dégradé violet de la série, quatre tuiles de verre blanc) monte, une tuile
 * est choisie, les résultats se remplissent. Les légendes racontent à côté.
 *
 * Tout est piloté par le défilement, uniquement en translations, échelles
 * inférieures à 1 et opacités : rien ne floute, rien ne se recalcule.
 */
const W = 393;
const H = 852;
const POTES = [
  { nom: ["Lana", "Chung"], photo: "/visages/001.webp", pct: 18 },
  { nom: ["Lucas", "Chevalier"], photo: "/visages/002.webp", pct: 47 },
  { nom: ["Léa", "Sacla"], photo: "/visages/005.webp", pct: 26 },
  { nom: ["Noha", "Kanté"], photo: "/visages/004.webp", pct: 9 },
];
const CHOISI = 1;

const LEGENDES = [
  { a: 0.0, b: 0.34, haut: "Chaque jour,", bas: "des questions sur tes potes." },
  { a: 0.34, b: 0.66, haut: "Tu choisis.", bas: "Ton nom reste masqué." },
  { a: 0.66, b: 1.01, haut: "Et pendant ce temps,", bas: "eux votent pour toi." },
];

export function SceneQuestion() {
  const carte = useRef<HTMLDivElement>(null);
  const tuiles = useRef<(HTMLDivElement | null)[]>([]);
  const barres = useRef<(HTMLDivElement | null)[]>([]);
  const pcts = useRef<(HTMLSpanElement | null)[]>([]);
  const anneau = useRef<HTMLDivElement>(null);
  const legendes = useRef<(HTMLDivElement | null)[]>([]);

  const ref = useScene<HTMLElement>((p) => {
    const c = carte.current;
    if (!c) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const large = vw >= 900;
    // L'échelle de base : la carte tient dans l'écran, jamais au-delà de 1.
    const k = Math.min(1, (vh * (large ? 0.76 : 0.66)) / H, (vw * (large ? 0.42 : 0.86)) / W);
    const entree = phase(p, 0, 0.16);
    const sortie = phase(p, 0.86, 1);
    const s = k * (0.86 + 0.14 * entree) * (1 - 0.06 * sortie);
    c.style.transform = `translate3d(-50%, ${(1 - entree) * 9 - sortie * 6}vh, 0) scale(${s.toFixed(4)})`;
    c.style.opacity = String((0.25 + 0.75 * entree) * (1 - 0.65 * sortie));

    // Le doigt appuie sur la tuile, puis elle est choisie.
    const appui = phase(p, 0.38, 0.43) - phase(p, 0.43, 0.48);
    const choisi = phase(p, 0.44, 0.5);
    tuiles.current.forEach((t, i) => {
      if (!t) return;
      const e = i === CHOISI ? 1 - 0.07 * appui + 0.02 * choisi : 1 - 0.03 * choisi;
      t.style.transform = `scale(${e.toFixed(4)})`;
      t.style.opacity = String(i === CHOISI ? 1 : 1 - 0.35 * choisi);
    });
    if (anneau.current) anneau.current.style.opacity = String(choisi);

    // Les résultats se remplissent, comme VoteResultFillView.
    const remplir = phase(p, 0.5, 0.68);
    barres.current.forEach((b, i) => {
      if (b) b.style.transform = `scaleY(${((POTES[i].pct / 100) * remplir).toFixed(4)})`;
    });
    pcts.current.forEach((n, i) => {
      if (n) {
        n.textContent = `${Math.round(POTES[i].pct * remplir)} %`;
        n.style.opacity = String(remplir);
      }
    });

    legendes.current.forEach((l, i) => {
      if (!l) return;
      const { a, b } = LEGENDES[i];
      const vis = phase(p, a, a + 0.06) * (1 - phase(p, b - 0.06, b));
      l.style.opacity = String(vis);
      l.style.transform = `translate3d(0, ${(1 - vis) * 18}px, 0)`;
    });
  });

  return (
    <section ref={ref} className="relative h-[340svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Légendes : en haut sur téléphone, à gauche au bureau */}
        <div className="absolute inset-x-0 top-[13svh] z-10 px-6 text-center lg:inset-x-auto lg:top-1/2 lg:left-[8vw] lg:h-[15rem] lg:w-[40vw] lg:-translate-y-1/2 lg:text-left">
          {LEGENDES.map((l, i) => (
            <div
              key={i}
              ref={(el) => {
                legendes.current[i] = el;
              }}
              className="absolute inset-x-0 top-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="display text-[clamp(2rem,7.5vw,4.4rem)] text-white">{l.haut}</p>
              <p className="display text-vote text-[clamp(2rem,7.5vw,4.4rem)]">{l.bas}</p>
            </div>
          ))}
        </div>

        {/* L'écran de vote de l'app */}
        <div
          ref={carte}
          className="absolute bottom-[3svh] left-1/2 origin-bottom lg:top-[54%] lg:bottom-auto lg:left-[68vw] lg:origin-center lg:!-translate-y-1/2"
          style={{ width: W, height: H, transform: "translate3d(-50%, 9vh, 0) scale(0.6)" }}
        >
          <div
            className="relative flex h-full w-full flex-col items-center overflow-hidden rounded-[56px] px-6 pt-[70px]"
            style={{
              background: "linear-gradient(180deg,#6001FF,#4B01FF 30%,#3501FF 60%,#1501FF)",
              boxShadow:
                "0 0 0 1.5px rgba(255,255,255,0.12), 0 60px 120px -40px rgba(0,0,0,0.95), 0 0 120px -30px rgba(96,1,255,0.6)",
            }}
          >
            <p className="text-[18px] font-semibold text-white">1 sur 3</p>
            <div className="mt-2 flex gap-1">
              <span className="h-[3px] w-6 rounded bg-[linear-gradient(90deg,#ff8ad8,#ffe68a,#8cffcf,#8ad8ff)]" />
              <span className="h-[3px] w-6 rounded bg-white/35" />
              <span className="h-[3px] w-6 rounded bg-white/35" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
            <img src="/animes/halloween.webp" alt="" className="mt-10 h-[150px] w-auto rounded-[20px] object-cover" />
            <p className="mt-6 px-4 text-center text-[23px] leading-snug font-semibold text-white">
              Qui survivrait dans un film d&apos;horreur&nbsp;?
            </p>

            <div className="mt-auto mb-[54px] grid grid-cols-2 gap-[10px]">
              {POTES.map((pote, i) => (
                <div
                  key={pote.photo}
                  ref={(el) => {
                    tuiles.current[i] = el;
                  }}
                  className="relative flex h-[147px] w-[147px] flex-col items-center justify-center overflow-hidden rounded-[16px]"
                  style={{
                    background:
                      "radial-gradient(circle at 42% 28%, rgba(255,255,255,0.98), rgba(255,255,255,0.34) 52%, rgba(255,255,255,0) 76%), linear-gradient(160deg,#fff,#fefcff 46%,#f9f2fd)",
                    boxShadow: "0 8px 11px rgba(91,33,182,0.42), 0 4px 5px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Le remplissage du résultat */}
                  <div
                    ref={(el) => {
                      barres.current[i] = el;
                    }}
                    className="absolute inset-0 origin-bottom bg-[linear-gradient(180deg,rgba(167,139,250,0.55),rgba(124,58,237,0.6))]"
                    style={{ transform: "scaleY(0)" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
                  <img src={pote.photo} alt="" className="relative h-[64px] w-[64px] rounded-full object-cover" />
                  <p className="relative mt-1.5 text-center text-[17px] leading-tight font-semibold text-black">
                    {pote.nom[0]}
                    <br />
                    {pote.nom[1]}
                  </p>
                  <span
                    ref={(el) => {
                      pcts.current[i] = el;
                    }}
                    className="absolute top-2 right-2.5 text-[13px] font-black text-[#3b0aa8]"
                    style={{ opacity: 0 }}
                  >
                    0 %
                  </span>
                  {i === CHOISI ? (
                    <div
                      ref={anneau}
                      className="pointer-events-none absolute inset-0 rounded-[16px] shadow-[inset_0_0_0_3px_#ff2d9a]"
                      style={{ opacity: 0 }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
