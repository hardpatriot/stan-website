import Link from "next/link";
import { Backdrop } from "./Backdrop";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: React.ReactNode;
  updated: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <Backdrop />
      <Nav />
      <main className="flex-1 px-5 pt-28 pb-20 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-bold text-white/45 transition hover:text-white"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Retour à l&apos;accueil
          </Link>

          <h1 className="display mt-8 text-[clamp(2.4rem,7vw,4rem)] text-white text-balance">
            {title}
          </h1>

          <p className="mt-5 text-sm font-bold tracking-wide text-rose">
            Dernière mise à jour&nbsp;: {updated}
          </p>

          {intro ? (
            <div className="glass mt-9 rounded-3xl px-6 py-6 text-[15px] leading-relaxed font-medium text-white/65 sm:px-8">
              {intro}
            </div>
          ) : null}

          <div className="legal mt-4">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
