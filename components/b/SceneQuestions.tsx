"use client";

import { useRef } from "react";
import { phase, useScene } from "./useScene";

/**
 * Scène 3 : les questions, une par une, en très grand. Chaque question arrive
 * de loin, se pose, puis s'efface en montant pendant que la suivante arrive.
 * Que des questions déjà validées dans l'app.
 */
const QUESTIONS = [
  { emoji: "/sphere/emoji/alarm_clock.webp", texte: "Qui se lève 12 min avant les cours et arrive nickel ?" },
  { emoji: "/sphere/emoji/popcorn.webp", texte: "Qui mérite une série Netflix inspirée de sa vie ?" },
  { emoji: "/sphere/emoji/desert_island.webp", texte: "Avec qui t'aimerais être perdu sur une île déserte ?" },
  { emoji: "/sphere/emoji/nerd_face.webp", texte: "Qui dort en cours mais a 18/20 easy ?" },
];

export function SceneQuestions() {
  const lignes = useRef<(HTMLDivElement | null)[]>([]);
  const compteur = useRef<HTMLSpanElement>(null);

  const ref = useScene<HTMLElement>((p) => {
    const n = QUESTIONS.length;
    lignes.current.forEach((l, i) => {
      if (!l) return;
      const a = i / n;
      const b = (i + 1) / n;
      const entree = i === 0 ? 1 : phase(p, a - 0.04, a + 0.08);
      const sortie = i === n - 1 ? 0 : phase(p, b - 0.08, b + 0.02);
      const s = 0.82 + 0.18 * entree;
      l.style.opacity = String(entree * (1 - sortie));
      l.style.transform = `translate3d(0, ${(1 - entree) * 9 - sortie * 9}vh, 0) scale(${s.toFixed(4)})`;
    });
    if (compteur.current) compteur.current.textContent = String(Math.min(n, 1 + Math.floor(p * n)));
  });

  return (
    <section ref={ref} className="relative h-[300svh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6">
        <p className="absolute top-[14svh] left-1/2 -translate-x-1/2 text-[13px] font-bold tracking-[0.2em] text-white/40 uppercase">
          Question <span ref={compteur}>1</span> sur {QUESTIONS.length}
        </p>
        {QUESTIONS.map((q, i) => (
          <div
            key={q.texte}
            ref={(el) => {
              lignes.current[i] = el;
            }}
            className="absolute inset-x-6 flex flex-col items-center text-center"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
            <img src={q.emoji} alt="" className="h-[clamp(64px,12vw,112px)] w-auto" />
            <p className="display mt-6 max-w-[16ch] text-[clamp(2.3rem,8.4vw,6.4rem)] text-white text-balance">
              {q.texte}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
