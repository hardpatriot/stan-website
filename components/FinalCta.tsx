import Image from "next/image";
import { AppStoreButton } from "./AppStoreButton";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          <div className="relative">
            <span
              aria-hidden
              className="animate-pulse-glow absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(230,0,110,0.5),transparent_68%)] blur-2xl"
            />
            <Image
              src="/cap-512.png"
              alt="L'icône de Stan : une casquette en néon rose"
              width={112}
              height={112}
              className="animate-float relative rounded-[28px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
            />
          </div>
        </Reveal>

        {/* La phrase de fin de la fiche App Store. */}
        <Reveal delay={90}>
          <h2 className="display mt-10 text-[clamp(2.4rem,7vw,4.4rem)] text-white text-balance">
            Stan tes potes.{" "}
            <span className="text-vote">
              Découvre ce qu&apos;ils pensent de toi.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={170}>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed font-medium text-white/55">
            Là, quelqu&apos;un pense du bien de toi. Il te l&apos;a juste jamais
            dit en face.
          </p>
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-10">
            <AppStoreButton label="Télécharger Stan" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
