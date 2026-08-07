"use client";

import { useEffect, useId, useRef, useState } from "react";

/*
 * Réplique de VoteResultFillView : la nappe qui monte dans la carte une fois
 * le vote passé. La forme de la vague est calculée avec exactement les mêmes
 * sinusoïdes que WaveShape dans PollView.swift, pour que le mouvement soit le
 * même à l'œil.
 */

const MAX_WAVE = 5;

/** Le tracé de WaveShape, à l'identique. */
function wavePath(width: number, height: number, offset: number) {
  const points: string[] = [`M 0 ${MAX_WAVE}`];
  for (let x = 0; x <= width; x += 1) {
    const n = x / width;
    const y =
      Math.sin(n * Math.PI * 2 + offset) * 2.5 +
      Math.sin(n * Math.PI * 3.5 + offset * 1.4 + 1.2) * 1.5 +
      Math.sin(n * Math.PI * 5.8 + offset * 0.7 + 2.8) * 0.8;
    points.push(`L ${x} ${(y + MAX_WAVE).toFixed(2)}`);
  }
  points.push(`L ${width} ${height}`, `L 0 ${height}`, "Z");
  return points.join(" ");
}

export function WaveFill({
  percentage,
  width,
  height,
}: {
  /** Hauteur de remplissage, de 0 à 1. */
  percentage: number;
  width: number;
  height: number;
}) {
  const [offset, setOffset] = useState(0);
  const [filled, setFilled] = useState(false);
  const raf = useRef<number | undefined>(undefined);
  // useId donne un identifiant stable et unique, utilisable pendant le rendu.
  const g = useId().replace(/:/g, "");

  // La vague dérive en continu : 2π en 3 s, comme le repeatForever de l'app.
  useEffect(() => {
    const debut = performance.now();
    const boucle = (t: number) => {
      setOffset((((t - debut) / 3000) % 1) * Math.PI * 2);
      raf.current = requestAnimationFrame(boucle);
    };
    raf.current = requestAnimationFrame(boucle);
    return () => {
      if (raf.current !== undefined) cancelAnimationFrame(raf.current);
    };
  }, []);

  // La montée elle-même, sur 1 s en easeOut. Un cran après le montage pour que
  // la transition CSS ait un état de départ à animer.
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 30);
    return () => clearTimeout(t);
  }, []);

  const hauteur = filled ? Math.max(percentage * height, MAX_WAVE + 2) : 0;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden rounded-b-[16px]"
      style={{
        height: hauteur,
        transition: "height 1s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <svg
        width={width}
        height={Math.max(hauteur, 1)}
        viewBox={`0 0 ${width} ${Math.max(hauteur, 1)}`}
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <defs>
          {/* Les couleurs de VoteRank.gradientColors */}
          <linearGradient id={`${g}-f`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.52" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.36" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.42" />
          </linearGradient>
          <linearGradient id={`${g}-h`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.20" />
            <stop offset="55%" stopColor="#F472B6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${g}-s`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.82" />
            <stop offset="35%" stopColor="#818CF8" stopOpacity="0.70" />
            <stop offset="75%" stopColor="#F472B6" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        {/* La nappe */}
        <path d={wavePath(width, Math.max(hauteur, 1), offset)} fill={`url(#${g}-f)`} />

        {/* Le reflet, décalé de 0,72π et de 3 pt vers le bas */}
        <path
          d={wavePath(width, Math.max(hauteur, 1), offset + Math.PI * 0.72)}
          fill={`url(#${g}-h)`}
          transform="translate(0, 3)"
        />

        {/* Le liseré de crête, décalé de 0,35π */}
        <path
          d={wavePath(width, Math.max(hauteur, 1), offset + Math.PI * 0.35)}
          fill="none"
          stroke={`url(#${g}-s)`}
          strokeWidth="2"
        />
      </svg>

      {/* Le voile clair sur les 26 premiers points, en mode écran */}
      <span
        className="absolute inset-x-0 top-0"
        style={{
          height: Math.min(hauteur, 26),
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(167,139,250,0.08), transparent)",
          mixBlendMode: "screen",
        }}
      />
    </span>
  );
}
