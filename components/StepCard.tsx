"use client";

import Image from "next/image";
import { useRef } from "react";

/**
 * Une carte d'étape.
 *
 * Au bureau, un halo de la couleur de l'étape suit le curseur à l'intérieur
 * de la carte. On écrit la position dans deux variables CSS et c'est le
 * navigateur qui dessine : aucun rendu React pendant le mouvement, donc
 * aucune saccade.
 *
 * Sur mobile il ne se passe rien : le halo est piloté par le survol, qui
 * n'existe pas au doigt. Un reflet fixe et discret prend le relais.
 */
export function StepCard({
  icon,
  numero,
  titre,
  corps,
  teinte,
}: {
  icon: string;
  numero: number;
  titre: string;
  corps: string;
  /** Couleur du halo, en hexadécimal. */
  teinte: string;
}) {
  const ref = useRef<HTMLElement>(null);

  function suivre(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <article
      ref={ref}
      onPointerMove={suivre}
      className="glass group relative h-full overflow-hidden rounded-3xl p-6 transition-colors duration-500 hover:border-white/20"
      style={
        {
          "--mx": "50%",
          "--my": "0%",
          "--teinte": teinte,
        } as React.CSSProperties
      }
    >
      {/* Le halo qui suit le curseur */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx) var(--my), color-mix(in srgb, var(--teinte) 26%, transparent), transparent 68%)",
        }}
      />

      {/* Le reflet fixe, seul visible au doigt */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-14 -right-14 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-0"
        style={{ background: teinte }}
      />

      <div className="relative flex items-start justify-between">
        <Image
          src={icon}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110"
        />
        <span className="text-xs font-black tracking-[0.2em] text-white/25">
          0{numero}
        </span>
      </div>

      <h3 className="relative mt-4 text-lg font-black tracking-tight text-white">
        {titre}
      </h3>
      <p className="relative mt-2 text-[14px] leading-relaxed font-medium text-white/55">
        {corps}
      </p>
    </article>
  );
}
