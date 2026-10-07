"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { PLAY_STORE_URL } from "./DownloadButton";

/**
 * L'équivalent Android de la bannière de Safari sur iPhone.
 *
 * Sur iPhone, Safari affiche lui-même sa bannière grâce à la balise
 * `apple-itunes-app`. Android n'a rien de tel : Chrome ne propose une
 * installation que si le site dessine son propre bouton. Cette bannière le
 * fait, sur Android seulement, avec la même allure : l'icône, le nom, le store
 * et un bouton. Fermée une fois, elle ne revient plus sur ce téléphone.
 *
 * Elle réserve sa hauteur en haut de la page (variable --banniere), pour ne
 * jamais passer par-dessus le titre.
 */
const CLE = "stan-banniere-android-fermee";
const HAUTEUR = 64;

/** Android, et bannière jamais fermée sur ce téléphone. */
function aMontrer(): boolean {
  if (!/android/i.test(navigator.userAgent)) return false;
  try {
    return !localStorage.getItem(CLE);
  } catch {
    return true; // stockage indisponible : on montre la bannière, sans mémoire
  }
}
const sAbonner = () => () => {};

export function BanniereAndroid() {
  // Faux côté serveur : la page statique n'a pas de bannière, elle apparaît
  // une fois la page chargée sur un téléphone Android.
  const montrer = useSyncExternalStore(sAbonner, aMontrer, () => false);
  const [fermee, setFermee] = useState(false);
  const visible = montrer && !fermee;

  useEffect(() => {
    const racine = document.documentElement;
    racine.style.setProperty("--banniere", visible ? `${HAUTEUR}px` : "0px");
    return () => racine.style.setProperty("--banniere", "0px");
  }, [visible]);

  if (!visible) return null;

  const fermer = () => {
    setFermee(true);
    try {
      localStorage.setItem(CLE, "1");
    } catch {
      // rien à faire
    }
  };

  return (
    <div
      className="flex items-center gap-3 border-b border-white/[0.08] bg-[#0e0933] px-3"
      style={{ height: HAUTEUR }}
    >
      <button
        type="button"
        onClick={fermer}
        aria-label="Fermer la bannière"
        className="flex h-8 w-6 shrink-0 items-center justify-center text-lg text-white/45"
      >
        ×
      </button>
      <Image
        src="/cap-180.png"
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-[11px]"
      />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-[15px] font-bold text-white">Stan</p>
        <p className="truncate text-[12px] font-medium text-white/55">
          Gratuit sur Google Play
        </p>
      </div>
      <a
        href={PLAY_STORE_URL}
        className="shrink-0 rounded-full bg-[linear-gradient(105deg,#d91cbd,#e6006e)] px-4 py-2 text-[13px] font-black text-white"
      >
        Installer
      </a>
    </div>
  );
}
