"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Inviter un pote par SMS ou iMessage depuis le champ « Prénom d'un pote ».
 *
 * Le site N'ENVOIE RIEN lui-même : il ouvre l'app Messages de la personne
 * avec le numéro et le texte déjà remplis, et c'est elle qui appuie sur
 * Envoyer. Le numéro ne quitte jamais le navigateur.
 *
 * - iPhone, iPad, Mac : Messages (iMessage, ou SMS via l'iPhone relié).
 * - Android : l'app SMS.
 * - PC : rien de fiable ne s'ouvre, on montre un QR code qui ouvre Messages
 *   sur le téléphone, message prêt.
 */
export const TEXTE_INVITATION =
  "Toi, vu par tes potes ou ton Crush ? https://invite.stan-friends.com/invite";

/** Un numéro de téléphone saisi, au format international, ou null. */
export function numeroSaisi(saisie: string): string | null {
  const brut = saisie.replace(/[\s.\-()]/g, "");
  if (!/^\+?\d{8,15}$/.test(brut)) return null;
  // Numéro français à 10 chiffres : 06 12 34 56 78 devient +33612345678.
  if (/^0\d{9}$/.test(brut)) return "+33" + brut.slice(1);
  if (brut.startsWith("00")) return "+" + brut.slice(2);
  return brut.startsWith("+") ? brut : null;
}

type Cible = "apple" | "android" | "pc";

function cible(): Cible {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod|macintosh/i.test(ua)) return "apple";
  return "pc";
}

/**
 * Ouvre Messages, ou renvoie false quand il faut passer par le QR code.
 * Apple lit le texte après « & », Android après « ? ».
 */
export function ouvrirMessages(numero: string): boolean {
  const c = cible();
  if (c === "pc") return false;
  const texte = encodeURIComponent(TEXTE_INVITATION);
  window.location.href =
    c === "apple" ? `sms:${numero}&body=${texte}` : `sms:${numero}?body=${texte}`;
  return true;
}

/** Sur PC : un QR code qui ouvre Messages sur le téléphone, message prêt. */
export function FenetreQrInvitation({
  numero,
  onClose,
}: {
  numero: string;
  onClose: () => void;
}) {
  const [image, setImage] = useState("");

  useEffect(() => {
    let vivant = true;
    // La bibliothèque n'est chargée que pour ce cas, rare.
    import("qrcode").then((QR) =>
      QR.toDataURL(`SMSTO:${numero}:${TEXTE_INVITATION}`, {
        errorCorrectionLevel: "M",
        margin: 0,
        width: 480,
        color: { dark: "#08050f", light: "#ffffff" },
      }).then((url) => vivant && setImage(url)),
    );
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", surTouche);
    return () => {
      vivant = false;
      window.removeEventListener("keydown", surTouche);
    };
  }, [numero, onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invitation-titre"
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
        <h2 id="invitation-titre" className="display text-2xl text-white">
          Envoie-la depuis ton tel.
        </h2>
        <p className="mt-2 text-[15px] font-medium text-white/60">
          Scanne avec l&apos;appareil photo : le message pour {numero} est
          déjà prêt, tu n&apos;as plus qu&apos;à l&apos;envoyer.
        </p>
        <div className="mx-auto mt-6 aspect-square w-48 rounded-2xl bg-white p-3.5">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- image produite sur place
            <img
              src={image}
              alt="QR code de l'invitation"
              className="block h-full w-full [image-rendering:pixelated]"
            />
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
