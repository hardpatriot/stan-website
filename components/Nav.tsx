import Image from "next/image";
import Link from "next/link";
import { BanniereAndroid } from "./BanniereAndroid";

/**
 * L'en-tête défile avec la page : il n'est JAMAIS fixé. Safari 26 sur iPhone
 * repère un en-tête fixé en haut de l'écran et peint sa couleur, en aplat
 * opaque, sous la barre d'état : une bande qui coupe la page (vérifié dans le
 * simulateur le 05/11/2026). Sans élément fixé, la page passe sous la barre.
 */
export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
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
