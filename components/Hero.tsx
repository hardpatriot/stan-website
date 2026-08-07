import { AppStoreButton } from "./AppStoreButton";
import { VoteDemo } from "./VoteDemo";

/**
 * Le hero n'utilise pas <Reveal> : son contenu doit être là dès la première
 * image. L'entrée se fait en CSS pure (animate-rise), donc elle ne dépend
 * ni de JavaScript ni du scroll.
 */
export function Hero() {
  return (
    <section className="relative px-5 pt-24 pb-10 sm:px-8 sm:pt-36 sm:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_auto] lg:gap-16">
        {/* Colonne texte */}
        <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          {/* Le titre du site est porté par la sphère, juste au-dessus.
              Ici on enchaîne sur la démo plutôt que de répéter la même
              phrase à un écran d'intervalle. */}
          <h2
            className="display animate-rise text-[clamp(2.6rem,8vw,4.8rem)] text-white text-balance"
            style={{ animationDelay: "140ms" }}
          >
            Essaie.{" "}
            <span className="text-vote">C&apos;est une vraie démo.</span>
          </h2>

          <p
            className="animate-rise mt-6 max-w-lg text-[17px] leading-relaxed font-medium text-white/60 sm:text-lg"
            style={{ animationDelay: "230ms" }}
          >
            Trois questions, quatre potes. Vote comme tu le ferais dans
            l&apos;app, et regarde ce que ton pote reçoit.
          </p>

          <div
            className="animate-rise mt-9"
            style={{ animationDelay: "320ms" }}
          >
            <AppStoreButton />
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
