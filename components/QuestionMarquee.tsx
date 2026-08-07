"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";

/*
 * Le bandeau des questions.
 *
 * Il défile par SCROLL natif, pas par `transform`. Une bande translatée de
 * 3 000 px devient une seule texture GPU : sur un écran 3x il en faudrait
 * 9 000 px de large, au-delà de ce que le matériel accepte, donc le navigateur
 * réduit la résolution et tout le contenu ressort flou, emojis compris.
 * Avec un scroll, il redessine seulement ce qui est visible, à pleine
 * résolution. Bonus : on peut le faire défiler au doigt.
 */

const ROW_A = [
  { emoji: "man_zombie", text: "Qui survivrait dans un film d'horreur ?" },
  { emoji: "squid", text: "Qui survit à Squid Game ?" },
  { emoji: "desert_island", text: "Avec qui t'aimerais être perdu sur une île déserte ?" },
  { emoji: "popcorn", text: "Qui mérite une série Netflix inspirée de sa vie ?" },
  { emoji: "clown_face", text: "Qui fait toujours les meilleures pranks ?" },
  { emoji: "nerd_face", text: "Qui dort en cours mais a 18/20 easy ?" },
];

const ROW_B = [
  { emoji: "flashlight", text: "Qui aimerait être téléporté avec toi dans Stranger Things ?" },
  { emoji: "money_bag", text: "Qui survit une semaine avec 3 € et des pâtes ?" },
  { emoji: "folded_hands", text: "Qui dit « merci » à l'IA au cas où elle prendrait le pouvoir un jour ?" },
  { emoji: "robot", text: "Qui sort toujours « non mais c'est plus rapide par là » ?" },
  { emoji: "alarm_clock", text: "Qui se lève 12 min avant les cours et arrive nickel" },
  { emoji: "speaking_head", text: "Qui a toujours le meilleur comeback" },
];

type Item = { emoji: string; text: string };

function Row({ items, vitesse }: { items: Item[]; vitesse: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const doubled = [...items, ...items];

  // Défilement automatique, interrompu dès que l'utilisateur touche le bandeau.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let dernier = performance.now();
    let enPause = false;

    const pause = () => {
      enPause = true;
    };
    const reprise = () => {
      enPause = false;
      dernier = performance.now();
    };

    const avancer = (t: number) => {
      const dt = t - dernier;
      dernier = t;
      if (!enPause) {
        el.scrollLeft += (vitesse * dt) / 1000;
        // La liste est doublée : à mi-course, on revient au début sans that
        // ça se voie.
        const moitie = el.scrollWidth / 2;
        if (el.scrollLeft >= moitie) el.scrollLeft -= moitie;
      }
      raf = requestAnimationFrame(avancer);
    };
    raf = requestAnimationFrame(avancer);

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", reprise);
    el.addEventListener("pointercancel", reprise);
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", reprise);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", reprise);
      el.removeEventListener("pointercancel", reprise);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", reprise);
    };
  }, [vitesse]);

  return (
    <div
      ref={ref}
      className="flex gap-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ overscrollBehaviorX: "contain" }}
    >
      {doubled.map((item, i) => (
        <span
          key={`${item.text}-${i}`}
          className="pill flex shrink-0 items-center gap-2.5 rounded-full py-2.5 pr-5 pl-3 text-[15px] font-bold whitespace-nowrap text-white/75"
        >
          <Image
            src={`/emoji/${item.emoji}.svg`}
            alt=""
            width={26}
            height={26}
            className="h-[26px] w-[26px]"
          />
          {item.text}
        </span>
      ))}
    </div>
  );
}

export function QuestionMarquee() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      <Reveal className="px-5 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-black tracking-[0.18em] text-lavender uppercase">
            Les questions
          </p>
        </div>
      </Reveal>

      <div className="relative mt-7 flex flex-col gap-3.5">
        <Row items={ROW_A} vitesse={26} />
        <Row items={ROW_B} vitesse={19} />

        {/* Fondu sur les bords */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-night-950 to-transparent sm:w-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-night-950 to-transparent sm:w-40"
        />
      </div>
    </section>
  );
}
