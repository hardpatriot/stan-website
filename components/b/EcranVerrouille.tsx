"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Scène 1 : l'écran verrouillé. La page s'ouvre sur ce que l'élève voit
 * vraiment : l'heure, puis les notifications de Stan qui tombent une à une,
 * avec le texte exact des pushs de vote du serveur.
 */
const NOTIFS = [
  { quand: "maintenant", corps: "Elle a pensé à toi… viens voir" },
  { quand: "il y a 2 min", corps: "Il a pensé à toi… viens voir" },
  { quand: "il y a 9 min", corps: "Elle a pensé à toi… viens voir" },
];

function heureLocale() {
  const d = new Date();
  return {
    heure: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    jour: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
  };
}

export function EcranVerrouille() {
  // Les notifications ne tombent qu'une fois l'écran sous les yeux.
  const scene = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("b-vu");
          obs.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // L'heure du visiteur, posée après le premier rendu (la page est statique).
  const [t, setT] = useState({ heure: "21:47", jour: "jeudi 23 octobre" });
  useEffect(() => {
    const maj = () => setT(heureLocale());
    const id = setTimeout(maj, 0);
    const iv = setInterval(maj, 20_000);
    return () => {
      clearTimeout(id);
      clearInterval(iv);
    };
  }, []);

  return (
    <section ref={scene} className="b-attente relative flex flex-col items-center overflow-hidden px-5 pt-10 pb-20 sm:pt-16">
      {/* L'heure, comme un écran verrouillé */}
      <p className="b-rise text-center text-[15px] font-semibold tracking-wide text-white/55 capitalize">
        {t.jour}
      </p>
      <p
        className="b-rise mt-1 text-center text-[clamp(5.2rem,22vw,9.5rem)] leading-none font-light tracking-[-0.04em] text-white/90 tabular-nums"
        style={{ animationDelay: "80ms" }}
      >
        {t.heure}
      </p>

      {/* Les notifications, empilées comme dans le centre de notifications */}
      <div className="relative mt-10 flex w-full max-w-[420px] flex-col gap-2.5">
        {NOTIFS.map((n, i) => (
          <div
            key={i}
            className="b-notif flex items-start gap-3 rounded-[22px] px-3.5 py-3"
            style={{ animationDelay: `${500 + i * 800}ms`, zIndex: 10 - i }}
          >
            <Image
              src="/cap-180.png"
              alt=""
              width={38}
              height={38}
              className="mt-0.5 h-[38px] w-[38px] shrink-0 rounded-[9px]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[12px] font-semibold tracking-wide text-white/45 uppercase">Stan</p>
                <span className="shrink-0 text-[12px] text-white/45">{n.quand}</span>
              </div>
              <p className="mt-0.5 text-[15px] leading-snug font-bold text-white">
                👀 Quelqu&apos;un vient de voter pour toi
              </p>
              <p className="mt-0.5 text-[15px] text-white/75">{n.corps}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
