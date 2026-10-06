import Image from "next/image";
import { DownloadButton } from "./DownloadButton";
import { Pinceau } from "./Pinceau";
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
          <h2 className="mt-10 text-white">
            <span className="punch inline-block -rotate-3 text-[clamp(3rem,9vw,5.6rem)]">
              Stan tes potes.
              <Pinceau className="mt-[0.02em] w-full" />
            </span>
            <span className="display text-vote mt-5 block text-[clamp(1.6rem,4.4vw,2.7rem)] text-balance">
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
            <DownloadButton label="Télécharger Stan" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
