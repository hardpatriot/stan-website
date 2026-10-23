"use client";

import { useRef } from "react";
import { GifQuestion } from "./GifQuestion";
import { phase, useScene } from "./useScene";

/**
 * Scène 3 : les questions, une par une, en très grand, chacune avec le GIF
 * que l'app lui affiche (choisi dans la feuille des questions, servi par
 * KLIPY). Que des questions activées en prod.
 */
const QUESTIONS = [
  { gif: "/gifs/q745.webp", ratio: 220 / 269, texte: "Qui dit « attends c'était noté ? » trente secondes avant chaque contrôle ?" },
  { gif: "/gifs/q557.webp", ratio: 1, texte: "Qui fait semblant de chercher dans son sac quand le prof cherche un volontaire ?" },
  { gif: "/gifs/q621.webp", ratio: 220 / 263, texte: "Qui refresh Pronote 15 fois par jour pour voir si un prof est absent ?" },
  { gif: "/gifs/q552.webp", ratio: 220 / 216, texte: "Qui est rentré à 5h du mat et doit assumer le petit dej en famille à 9h ?" },
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
      const s = 0.84 + 0.16 * entree;
      l.style.opacity = String(entree * (1 - sortie));
      l.style.transform = `translate3d(0, ${((1 - entree) * 9 - sortie * 9).toFixed(2)}vh, 0) scale(${s.toFixed(4)})`;
    });
    if (compteur.current) compteur.current.textContent = String(Math.min(n, 1 + Math.floor(p * n)));
  });

  return (
    <section ref={ref} className="relative h-[320svh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6">
        <p className="absolute top-[13svh] left-1/2 -translate-x-1/2 text-[13px] font-bold tracking-[0.2em] whitespace-nowrap text-white/40 uppercase">
          Question <span ref={compteur}>1</span> sur {QUESTIONS.length}
        </p>
        {QUESTIONS.map((q, i) => (
          <div
            key={q.texte}
            ref={(el) => {
              lignes.current[i] = el;
            }}
            className="absolute inset-x-5 flex flex-col items-center text-center"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="[zoom:1.7] sm:[zoom:2.1]">
              <GifQuestion src={q.gif} ratio={q.ratio} />
            </div>
            <p className="display mt-8 max-w-[18ch] text-[clamp(2rem,6.6vw,5rem)] text-white text-balance">
              {q.texte}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
