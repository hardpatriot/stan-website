"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/**
 * Un seul lien pour les deux téléphones : le serveur d'invitation lit le
 * navigateur et renvoie vers l'App Store ou Google Play.
 *
 * Deux cas où ce lien ne mène à aucun store, parce que le serveur y voit un
 * ordinateur et renvoie vers ce site :
 * - un vrai ordinateur : on ouvre une fenêtre avec un QR code et les deux
 *   stores, sinon le bouton ne ferait que recharger la page ;
 * - un iPad : Safari s'y présente comme un Mac, on vise donc l'App Store
 *   directement.
 */
export const INVITE_URL = "https://invite.stan-friends.com/invite";
const APP_STORE_URL =
  "https://apps.apple.com/fr/app/stan-qui-a-vote-pour-toi/id6740286416";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.stan.android";

type Plateforme = "iphone" | "ipad" | "android" | "ordinateur";

function detecter(): Plateforme {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iphone";
  // iPadOS se présente comme un Mac : seul l'écran tactile le trahit.
  if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ipad";
  return "ordinateur";
}

// L'appareil ne change pas en cours de visite : rien à écouter.
const sAbonner = () => () => {};

function usePlateforme(): Plateforme | null {
  // null côté serveur et pendant l'hydratation : le HTML statique pointe vers
  // le lien d'invitation, qui marche même sans JavaScript sur téléphone.
  return useSyncExternalStore(sAbonner, detecter, () => null);
}

function AppleGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function DownloadGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
    </svg>
  );
}

/** Le QR code du lien d'invitation, tracé en vectoriel pour rester net. */
function QrInvitation({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 29 29" shapeRendering="crispEdges" aria-hidden className={className}>
      <path stroke="#08050f" d="M0 0.5h7m2 0h1m1 0h2m1 0h1m1 0h5m1 0h7M0 1.5h1m5 0h1m3 0h3m1 0h3m1 0h1m3 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m1 0h5m2 0h1m3 0h1m2 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h2m2 0h1m2 0h1m1 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h1m2 0h1m4 0h1m1 0h3m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m1 0h1m1 0h3m1 0h2m6 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h2m1 0h2m1 0h1m1 0h1m2 0h2M0 8.5h1m1 0h5m2 0h4m2 0h3m4 0h5M3 9.5h3m1 0h1m2 0h2m1 0h1m2 0h5m1 0h3m3 0h1M0 10.5h4m1 0h2m1 0h1m1 0h1m1 0h4m1 0h1m2 0h1m2 0h2M0 11.5h1m2 0h1m3 0h4m2 0h1m2 0h1m1 0h1m1 0h2m3 0h1m1 0h1M0 12.5h1m1 0h2m2 0h1m1 0h4m2 0h1m2 0h1m1 0h1m5 0h2M1 13.5h2m1 0h2m2 0h2m2 0h1m3 0h1m1 0h2m1 0h4m3 0h1M0 14.5h1m2 0h1m2 0h2m1 0h3m3 0h2m8 0h2M0 15.5h1m1 0h4m1 0h2m2 0h1m2 0h2m2 0h3m2 0h2m2 0h1M1 16.5h1m3 0h5m1 0h1m5 0h1m1 0h1m1 0h1m1 0h1m1 0h2M0 17.5h1m3 0h2m1 0h2m2 0h4m1 0h1m2 0h6m1 0h1m1 0h1M0 18.5h1m2 0h2m1 0h1m3 0h1m1 0h7m1 0h1m1 0h1m3 0h1M0 19.5h1m1 0h4m2 0h2m1 0h1m1 0h1m2 0h1m4 0h3m3 0h1M0 20.5h1m3 0h1m1 0h1m1 0h4m2 0h1m2 0h2m1 0h5m1 0h3M8 21.5h1m8 0h2m1 0h1m3 0h5M0 22.5h7m2 0h2m4 0h3m1 0h2m1 0h1m1 0h3M0 23.5h1m5 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h3m3 0h1m2 0h2M0 24.5h1m1 0h3m1 0h1m1 0h4m5 0h1m2 0h5m1 0h1M0 25.5h1m1 0h3m1 0h1m1 0h2m1 0h1m2 0h1m1 0h1m1 0h1m6 0h4M0 26.5h1m1 0h3m1 0h1m1 0h2m1 0h2m1 0h6m2 0h6M0 27.5h1m5 0h1m2 0h3m4 0h1m2 0h3m1 0h3m1 0h1M0 28.5h7m1 0h2m2 0h3m2 0h1m1 0h1m2 0h1m3 0h1" />
    </svg>
  );
}

function FenetreOrdinateur({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", surTouche);
    // La sphère réagit au défilement : on le bloque tant que la fenêtre est là.
    const racine = document.documentElement;
    const avant = racine.style.overflow;
    racine.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", surTouche);
      racine.style.overflow = avant;
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="telecharger-titre"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-night-950/70 p-5 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="glass relative w-full max-w-sm rounded-3xl px-7 pt-8 pb-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Fermer"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          ×
        </button>

        <h2 id="telecharger-titre" className="display text-2xl text-white">
          Stan, c&apos;est sur ton tel.
        </h2>
        <p className="mt-2 text-[15px] font-medium text-white/60">
          Scanne avec l&apos;appareil photo, tu tombes direct sur le bon store.
        </p>

        <div className="mx-auto mt-6 w-44 rounded-2xl bg-white p-3.5">
          <QrInvitation className="block h-full w-full" />
        </div>

        <div className="mt-6 flex justify-center gap-2.5">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            <AppleGlyph className="h-4 w-4" />
            App Store
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            <DownloadGlyph className="h-4 w-4" />
            Google Play
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type Props = {
  className?: string;
  label?: string;
};

export function DownloadButton({
  className = "",
  label = "Télécharger l'app",
}: Props) {
  const plateforme = usePlateforme();
  const [fenetre, setFenetre] = useState(false);

  const href = plateforme === "ipad" ? APP_STORE_URL : INVITE_URL;
  const iOS = plateforme === "iphone" || plateforme === "ipad";

  return (
    <>
      <a
        href={href}
        onClick={(e) => {
          if (plateforme !== "ordinateur") return;
          e.preventDefault();
          setFenetre(true);
        }}
        className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl px-8 py-4.5 text-base font-black tracking-tight text-white shadow-[0_18px_50px_-12px_rgba(230,0,110,0.75)] transition-transform duration-300 will-change-transform hover:scale-[1.03] active:scale-[0.98] sm:text-lg ${className}`}
      >
        {/* Le gradient du vote */}
        <span className="absolute inset-0 bg-[linear-gradient(105deg,#d91cbd_0%,#e6006e_58%,#ff7a3d_120%)]" />
        {/* Reflet qui balaie au survol */}
        <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent_25%,rgba(255,255,255,0.42)_50%,transparent_75%)] transition-transform duration-700 group-hover:translate-x-[120%]" />
        <span className="relative flex items-center gap-3">
          {iOS ? (
            <AppleGlyph className="h-5 w-5" />
          ) : (
            <DownloadGlyph className="h-5 w-5" />
          )}
          {label}
        </span>
      </a>
      {fenetre ? <FenetreOrdinateur onClose={() => setFenetre(false)} /> : null}
    </>
  );
}
