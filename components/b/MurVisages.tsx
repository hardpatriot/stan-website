"use client";

import { useRef } from "react";
import { DownloadButton } from "../DownloadButton";
import { phase, useScene } from "./useScene";

/**
 * Scène 5 : le mur des visages. Des colonnes de portraits (ceux de la sphère,
 * avec leur anneau) qui glissent à des vitesses différentes pendant qu'on
 * défile, et la phrase de fin au milieu. Chaque colonne reste courte : une
 * texture raisonnable, nette sur les écrans 3x.
 */
const COLONNES = 7;
const PAR_COLONNE = 6;
const VITESSES = [-38, 26, -52, 0, -44, 30, -24];

function photo(c: number, r: number) {
  const n = ((c * PAR_COLONNE + r * 5) % 68) + 1;
  return `/sphere/visages/${String(n).padStart(3, "0")}.webp`;
}

export function MurVisages() {
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const texte = useRef<HTMLDivElement>(null);

  const ref = useScene<HTMLElement>((p) => {
    cols.current.forEach((c, i) => {
      if (c) c.style.transform = `translate3d(0, ${((p - 0.5) * VITESSES[i]).toFixed(2)}vh, 0)`;
    });
    if (texte.current) {
      const t = phase(p, 0.25, 0.45);
      texte.current.style.opacity = String(t);
      texte.current.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0)`;
    }
  }, 0.12);

  return (
    <section ref={ref} className="relative h-[190svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-[-10vh_-6vw] flex justify-center gap-3 sm:gap-5"
          style={{
            maskImage: "radial-gradient(ellipse 62% 56% at 50% 50%, transparent 30%, #000 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 62% 56% at 50% 50%, transparent 30%, #000 78%)",
            opacity: 0.85,
          }}
        >
          {Array.from({ length: COLONNES }, (_, c) => (
            <div
              key={c}
              ref={(el) => {
                cols.current[c] = el;
              }}
              className={`flex shrink-0 flex-col gap-3 sm:gap-5 ${c === 0 || c === COLONNES - 1 ? "hidden sm:flex" : ""}`}
              style={{ marginTop: `${(c % 2) * -9}vh` }}
            >
              {Array.from({ length: PAR_COLONNE }, (_, r) => (
                // eslint-disable-next-line @next/next/no-img-element -- site statique
                <img
                  key={r}
                  src={photo(c, r)}
                  alt=""
                  loading="lazy"
                  className="h-[clamp(84px,13vw,150px)] w-[clamp(84px,13vw,150px)]"
                />
              ))}
            </div>
          ))}
        </div>

        <div
          ref={texte}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: 0 }}
        >
          <p className="display max-w-[14ch] text-[clamp(2.4rem,8vw,5rem)] text-white text-balance">
            Stan tes potes.{" "}
            <span className="text-vote">Découvre ce qu&apos;ils pensent de toi.</span>
          </p>
          <p className="mt-5 text-[17px] font-medium text-white/60">
            Là, quelqu&apos;un pense à toi. Peut-être ton Crush.
          </p>
          <div className="mt-9">
            <DownloadButton label="Télécharge Stan" />
          </div>
        </div>
      </div>
    </section>
  );
}
