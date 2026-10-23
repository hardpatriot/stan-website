"use client";

import { useRef } from "react";
import { FoilQR } from "../FoilQR";
import { phase, useScene } from "./useScene";

/**
 * Scène 4 : le reveal. La carte de vote de l'app (verre sombre, icône du
 * garçon, question en rose) et le nom caché sous le foil holographique de la
 * carte QR. En défilant, le foil glisse et le nom apparaît.
 */
export function SceneReveal() {
  const carte = useRef<HTMLDivElement>(null);
  const foil = useRef<HTMLDivElement>(null);
  const nom = useRef<HTMLDivElement>(null);
  const titre = useRef<HTMLDivElement>(null);

  const ref = useScene<HTMLElement>((p) => {
    const entree = phase(p, 0, 0.22);
    const devoile = phase(p, 0.36, 0.72);
    if (carte.current) {
      carte.current.style.transform = `translate3d(0, ${(1 - entree) * 12}vh, 0) scale(${(0.9 + 0.1 * entree).toFixed(4)})`;
      carte.current.style.opacity = String(0.3 + 0.7 * entree);
    }
    if (foil.current) foil.current.style.transform = `translate3d(${(devoile * 104).toFixed(2)}%, 0, 0)`;
    if (nom.current) nom.current.style.transform = `scale(${(0.94 + 0.06 * devoile).toFixed(4)})`;
    if (titre.current) {
      const t = phase(p, 0.7, 0.86);
      titre.current.style.opacity = String(t);
      titre.current.style.transform = `translate3d(0, ${(1 - t) * 20}px, 0)`;
    }
  });

  return (
    <section ref={ref} className="relative h-[260svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
        <div
          ref={carte}
          className="relative w-full max-w-[400px] rounded-[30px] p-6 lg:max-w-[460px]"
          style={{
            opacity: 0.3,
            background: "linear-gradient(160deg, rgba(38,30,66,0.92), rgba(20,15,38,0.94))",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.1), 0 40px 90px -30px rgba(0,0,0,0.9), 0 0 80px -30px rgba(145,64,255,0.55)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
            <img src="/notif-boy.webp" alt="" className="h-12 w-12" />
            <div>
              <p className="text-[17px] font-bold text-white">Il a voté pour toi</p>
              <p className="text-[13px] text-white/45">il y a 2 min</p>
            </div>
          </div>
          <p className="mt-5 text-[22px] leading-snug font-black text-[#ff2480]">
            Qui survivrait dans un film d&apos;horreur&nbsp;?
          </p>

          {/* Le nom, et le foil par-dessus */}
          <div className="relative mt-6 overflow-hidden rounded-[18px]">
            <div ref={nom} className="flex items-center gap-3 bg-white/[0.06] px-4 py-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
              <img src="/visages/002.webp" alt="" className="h-12 w-12 rounded-full object-cover" />
              <p className="text-[19px] font-black text-white">Lucas Chevalier</p>
            </div>
            <div ref={foil} className="absolute inset-0 flex items-center justify-center gap-2.5">
              <FoilQR className="absolute inset-0 h-full w-full" />
              <span className="relative text-[15px] font-black tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                Glisse pour savoir
              </span>
            </div>
          </div>
        </div>

        <div ref={titre} className="mt-12 text-center" style={{ opacity: 0 }}>
          <p className="display text-[clamp(2.2rem,7.6vw,4.6rem)] text-white">Découvre</p>
          <p className="display text-vote text-[clamp(2.2rem,7.6vw,4.6rem)]">qui a voté pour toi.</p>
        </div>
      </div>
    </section>
  );
}
