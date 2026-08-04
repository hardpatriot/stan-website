"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppStoreButton } from "./AppStoreButton";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.07] bg-night-950/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-18 sm:px-8">
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

        <AppStoreButton variant="ghost" />
      </nav>
    </header>
  );
}
