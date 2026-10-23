"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BanniereAndroid } from "./BanniereAndroid";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      {/* Le bord de défilement d'iOS 26 (scroll edge effect) : un voile de
          verre qui s'efface progressivement vers le bas, sans aucune ligne.
          On voit le contenu passer dessous, flouté puis net. Le flou est fixe,
          seule l'opacité du calque change au défilement. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 -bottom-7 transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(11,8,24,0.62) 0%, rgba(11,8,24,0.42) 55%, rgba(11,8,24,0) 100%)",
          backdropFilter: "blur(14px) saturate(1.4)",
          WebkitBackdropFilter: "blur(14px) saturate(1.4)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 52%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 52%, transparent 100%)",
        }}
      />
      <div className="relative">
        <BanniereAndroid />
      </div>
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center px-5 sm:h-18 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-xl bg-rose/45 blur-lg transition-opacity duration-500 group-hover:opacity-100 opacity-70" />
            <Image
              src="/cap-180.png"
              alt=""
              width={36}
              height={36}
              className="relative rounded-xl"
            />
          </span>
          <span className="display text-xl text-white">Stan</span>
        </Link>

      </nav>
    </header>
  );
}
