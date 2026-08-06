import Image from "next/image";
import Link from "next/link";

const LEGAL = [
  { href: "/conditions-dutilisation", label: "Conditions d'utilisation" },
  { href: "/centre-de-securite", label: "Centre de sécurité" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:gap-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/cap-180.png"
                alt=""
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="display text-lg text-white">Stan</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/45">
              L&apos;app où tes potes disent du bien de toi. Sans que tu saches
              qui.
            </p>
          </div>

          <nav className="flex flex-col gap-3 sm:items-end">
            {LEGAL.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/55 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:admin@stan-friends.com"
              className="text-sm font-medium text-white/55 transition hover:text-white"
            >
              admin@stan-friends.com
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.07] pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stan SAS — Fait en France 🇫🇷</p>
          <p>Réservé aux 13 ans et plus.</p>
        </div>
      </div>
    </footer>
  );
}
