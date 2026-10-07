import Image from "next/image";
import { DownloadButton } from "./DownloadButton";
import { Reveal } from "./Reveal";

export function FinalCta() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          {/* L'icône posée sur la nuit : le fond sombre de l'icône se fondait
              dans la page. Un halo rose et bleu derrière, un liseré néon
              autour, comme les cartes, et le tout flotte doucement. */}
          <div className="animate-float relative">
            <span
              aria-hidden
              className="animate-pulse-glow absolute -inset-24 bg-[radial-gradient(closest-side_at_42%_46%,rgba(255,40,190,0.62),rgba(255,40,190,0.18)_50%,transparent),radial-gradient(closest-side_at_60%_58%,rgba(70,110,255,0.55),rgba(70,110,255,0.14)_50%,transparent)]"
            />
            <span
              className="relative block rounded-[32px] bg-[linear-gradient(135deg,#ff4fd8_0%,#b04dff_48%,#3f7bff_100%)] p-[2px] shadow-[0_0_28px_rgba(255,60,200,0.6),0_0_60px_-6px_rgba(80,110,255,0.6),0_30px_60px_-20px_rgba(0,0,0,0.85)]"
            >
              <Image
                src="/cap-512.png"
                alt="L'icône de Stan : une casquette en néon rose"
                width={120}
                height={120}
                className="block rounded-[30px]"
              />
            </span>
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
            Là, quelqu&apos;un pense à toi. Peut-être ton Crush.
          </p>
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-10">
            <DownloadButton label="Télécharge Stan" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
