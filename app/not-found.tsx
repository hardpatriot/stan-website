import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main className="flex flex-1 items-center px-5 py-32 sm:px-8">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <span className="text-6xl">🧢</span>
          <h1 className="display mt-8 text-[clamp(2.4rem,8vw,4rem)] text-white text-balance">
            Cette page n&apos;existe <span className="text-vote">pas.</span>
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed font-medium text-white/55">
            Elle a peut-être changé d&apos;adresse, ou le lien s&apos;est perdu
            en route.
          </p>
          <Link
            href="/"
            className="group mt-9 inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(105deg,#d91cbd_0%,#e6006e_58%,#ff7a3d_120%)] px-7 py-3.5 text-base font-black tracking-tight text-white shadow-[0_18px_50px_-12px_rgba(230,0,110,0.7)] transition-transform duration-300 hover:scale-[1.03]"
          >
            Retour à l&apos;accueil
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
