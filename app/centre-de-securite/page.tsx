import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Centre de sécurité",
  description:
    "Comment Stan protège vos données, garantit votre sécurité, et comment rester en sécurité sur l'application.",
  alternates: { canonical: "/centre-de-securite" },
};

export default function Page() {
  return (
    <LegalPage
      title={
        <>
          Centre de <span className="text-aura">sécurité</span>
        </>
      }
      updated="28 janvier 2026"
      intro={
        <>
          <p className="mb-3 text-lg font-black tracking-tight text-white">
            La sécurité de nos utilisateurs est notre priorité absolue.
          </p>
          <p>
            Stan est une application conçue pour faire des compliments à nos amis
            et renforcer l&apos;estime de soi. Voici les mesures que nous prenons
            pour rendre votre expérience sur l&apos;application sûre et privée.
          </p>
        </>
      }
    >
      <h2>Comment Stan protège vos données</h2>
      <ul>
        <li data-emoji>
          🧢 Nous ne partagerons ni ne vendrons jamais vos données à des
          annonceurs ou courtiers en données.
        </li>
        <li data-emoji>
          🧢 Nous ne vous suivrons jamais sur d&apos;autres services en ligne.
        </li>
        <li data-emoji>
          🧢 Nous demandons uniquement votre position approximative lors de
          l&apos;inscription afin de suggérer des écoles proches.
        </li>
        <li data-emoji>
          🧢 Nous ne stockons aucune donnée de localisation sur nos serveurs.
        </li>
        <li data-emoji>
          🧢 Nous ne relions jamais vos données de localisation à votre compte.
        </li>
        <li data-emoji>
          🧢 Les demandes de suppression de compte sont généralement traitées sous
          24 heures.
        </li>
      </ul>

      <h2>Comment Stan garantit votre sécurité</h2>
      <ul>
        <li data-emoji>
          🧢 Seuls vos amis, contacts et camarades de classe peuvent voter pour
          vous. Les étrangers ne peuvent pas interagir avec vous.
        </li>
        <li data-emoji>
          🧢 Nous n&apos;autorisons pas la messagerie directe entre utilisateurs,
          même entre amis.
        </li>
        <li data-emoji>
          🧢 Les adultes qui ne sont plus au lycée ne peuvent pas rejoindre une
          école.
        </li>
        <li data-emoji>
          🧢 Stan ne peut pas et n&apos;a jamais été utilisé à des fins de
          «&nbsp;traite humaine&nbsp;».
        </li>
        <li data-emoji>
          🧢 Tous les sondages sont conçus pour être positifs et encourageants
          afin d&apos;éviter toute forme d&apos;intimidation.
        </li>
        <li data-emoji>
          🧢 Nous examinons régulièrement les signalements et supprimons les
          utilisateurs qui enfreignent les règles.
        </li>
        <li data-emoji>
          🧢 Nous offrons un support via chat en direct et par e-mail pour tous
          les utilisateurs.
        </li>
      </ul>

      <h2>Comment rester en sécurité sur Stan</h2>

      <h3>Ne rejoignez que l&apos;école que vous fréquentez actuellement</h3>
      <p>
        Les écoles sont listées pour permettre aux amis de se retrouver. Si vous
        rejoignez une école qui n&apos;est pas la vôtre, des personnes qui ne
        vous connaissent pas pourront vous envoyer des demandes d&apos;amis. Ne
        rejoignez jamais une école où vous n&apos;êtes pas inscrit.
      </p>

      <h3>
        N&apos;acceptez que les demandes d&apos;amis de personnes que vous
        connaissez dans la vraie vie
      </h3>
      <p>
        Stan est une application conçue pour complimenter des amis. Ajouter des
        inconnus permettrait à des personnes qui ne vous connaissent pas de voter
        pour vous, ce qui va à l&apos;encontre de l&apos;esprit de
        l&apos;application.
      </p>

      <h3>
        Ne partagez pas votre numéro de téléphone, votre appareil ou vos codes
        avec d&apos;autres personnes
      </h3>
      <p>
        Partager votre téléphone ou votre numéro peut compromettre la sécurité de
        votre compte et entraîner une perte de vos données utilisateur.
      </p>

      <h3>Désactivez l&apos;accès à votre localisation après l&apos;inscription</h3>
      <p>
        Stan n&apos;a pas besoin de votre localisation après l&apos;inscription.
        Elle est uniquement utilisée pour suggérer des écoles à proximité. La
        désactiver n&apos;affectera pas votre expérience.
      </p>
      <p>
        Pour désactiver la localisation&nbsp;:
        <br />
        📱 Ouvrez les paramètres de votre téléphone › sélectionnez Stan ›
        définissez Localisation sur «&nbsp;Jamais&nbsp;».
      </p>

      <h3>Définissez vos préférences de confidentialité</h3>
      <p>
        Vos amis peuvent voir vos «&nbsp;No Caps&nbsp;» lorsqu&apos;ils visitent
        votre profil. Si cela ne vous convient pas, vous pouvez les cacher en
        allant dans&nbsp;:
        <br />
        ⚙️ Modifier le profil › Gérer mon compte › Masquer mes No Caps.
      </p>

      <h2>Comment protéger vos amis</h2>

      <h3>Signalez les utilisateurs qui enfreignent les règles</h3>
      <p>
        Si vous voyez un utilisateur violer les règles, ouvrez son profil ›
        appuyez sur le bouton en haut à gauche › sélectionnez «&nbsp;Signaler
        l&apos;utilisateur&nbsp;».
      </p>
      <p>
        Ajoutez autant d&apos;informations que possible dans la boîte de
        signalement pour que nous puissions intervenir rapidement.
      </p>

      <h3>Ne créez pas de compte sous un faux nom</h3>
      <p>
        Stan fonctionne mieux lorsque les noms que vous voyez dans les sondages
        correspondent réellement aux personnes concernées. Créer un compte sous
        un faux nom nuit à la communauté et peut entraîner la suspension de votre
        compte.
      </p>

      <h3>N&apos;utilisez pas de photos de profil inappropriées</h3>
      <p>
        Votre photo de profil doit vous représenter. Bien qu&apos;elle ne soit
        pas obligatoirement une photo de vous, elle ne doit jamais contenir
        d&apos;images offensantes, haineuses ou explicites.
      </p>

      <h2>Comment nous contacter</h2>
      <p>
        Nous travaillons en permanence pour améliorer Stan. Si vous avez des
        commentaires ou souhaitez signaler une expérience négative, contactez-nous
        à&nbsp;:
        <br />
        📩 <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a>
      </p>
    </LegalPage>
  );
}
