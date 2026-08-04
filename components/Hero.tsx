import { AppStoreButton } from "./AppStoreButton";
import { VoteDemo } from "./VoteDemo";

/**
 * Le hero n'utilise pas <Reveal> : son contenu doit être là dès la première
 * image. L'entrée se fait en CSS pure (animate-rise), donc elle ne dépend
 * ni de JavaScript ni du scroll.
 */
export function Hero() {
  return (
    <section className="relative px-5 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_auto] lg:gap-16">
        {/* Colonne texte */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span
            className="glass animate-rise inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold text-white/80"
            style={{ animationDelay: "60ms" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose" />
            </span>
            100&nbsp;% positif — aucun vote négatif
          </span>

          <h1
            className="display animate-rise mt-6 text-[clamp(2.9rem,9vw,5.6rem)] text-white text-balance"
            style={{ animationDelay: "140ms" }}
          >
            Quelqu&apos;un a voté{" "}
            <span className="text-vote">pour&nbsp;toi.</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-lg text-[17px] leading-relaxed font-medium text-white/60 sm:text-lg"
            style={{ animationDelay: "230ms" }}
          >
            Tes potes répondent à des sondages sur toi. Anonymement, et toujours
            en bien. Toi, tu reçois juste la notif qui fait sourire toute la
            journée.
          </p>

          <div
            className="animate-rise mt-9 flex flex-col items-center gap-4 lg:items-start"
            style={{ animationDelay: "320ms" }}
          >
            <AppStoreButton />
            <p className="text-[13px] font-medium text-white/40">
              Gratuit · 13 ans et + · Entre potes uniquement
            </p>
          </div>
        </div>

        {/* Le téléphone jouable */}
        <div
          className="animate-rise flex justify-center"
          style={{ animationDelay: "180ms" }}
        >
          <VoteDemo />
        </div>
      </div>
    </section>
  );
}
