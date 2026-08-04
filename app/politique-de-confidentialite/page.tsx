import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Les données que Stan collecte, comment elles sont utilisées et partagées, et vos droits en matière de confidentialité.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function Page() {
  return (
    <LegalPage
      title={
        <>
          Politique de <span className="text-vote">confidentialité</span>
        </>
      }
      updated="28 janvier 2026"
      intro={
        <>
          <p className="mb-4">
            Stan est une application mobile permettant de faire des compliments
            à vos amis. Les utilisateurs répondent à des sondages sur leurs
            amis. Lorsqu&apos;un utilisateur vous sélectionne dans un sondage,
            vous recevez une notification indiquant qu&apos;un ami a voté pour
            vous.
          </p>
          <p className="mb-4">
            Stan étant conçu pour les adolescents, nous accordons une importance
            primordiale à la sécurité et la confidentialité des utilisateurs.
            Nous limitons la collecte de données au strict nécessaire pour
            utiliser l&apos;application et se connecter avec des amis.
          </p>
          <p className="mb-3">Cette politique détaille&nbsp;:</p>
          <ul className="flex flex-col gap-1.5 text-white/75">
            <li>› Les données que nous collectons</li>
            <li>› Comment nous les utilisons et partageons</li>
            <li>› Vos droits en matière de confidentialité</li>
          </ul>
        </>
      }
    >
      <h2>Collecte et utilisation des données</h2>

      <h3>Données de compte</h3>
      <p>
        Lors de votre inscription sur Stan, nous vous demandons de
        fournir&nbsp;:
      </p>
      <ul>
        <li data-emoji>📌 Numéro de téléphone</li>
        <li data-emoji>📌 Nom et prénom</li>
        <li data-emoji>📌 École et niveau scolaire</li>
        <li data-emoji>📌 Genre, âge, nom d&apos;utilisateur, photo de profil</li>
      </ul>
      <p>
        Ces informations permettent d&apos;identifier votre compte et
        d&apos;aider vos amis à vous retrouver sur l&apos;application. Si vous
        renseignez votre école, vous apparaîtrez dans la section «&nbsp;camarades
        de classe&nbsp;», et ces derniers pourront vous envoyer une demande
        d&apos;ami.
      </p>

      <h3>Données de contacts</h3>
      <p>
        Lors de l&apos;inscription, vous pouvez autoriser Stan à accéder à votre
        répertoire afin de retrouver vos amis déjà présents sur
        l&apos;application.
      </p>
      <p>Stan utilise ces contacts pour&nbsp;:</p>
      <ul>
        <li data-emoji>✅ Vous proposer des amis à ajouter</li>
        <li data-emoji>✅ Vous suggérer des amis d&apos;amis</li>
        <li data-emoji>
          ✅ Vous proposer des options dans les sondages si vous avez moins de 12
          amis sur l&apos;application
        </li>
      </ul>
      <ul>
        <li data-emoji>
          🔹 Stan ne contacte jamais vos amis par SMS sans votre permission
          explicite.
        </li>
        <li data-emoji>
          🔹 Si vous invitez un ami à rejoindre Stan, l&apos;invitation peut
          inclure votre école et les noms de vos amis déjà inscrits.
        </li>
        <li data-emoji>
          🔹 Vous contrôlez toujours l&apos;envoi des invitations, elles ne sont
          jamais envoyées automatiquement.
        </li>
      </ul>

      <h3>Données de localisation</h3>
      <p>
        Avant de créer un compte, vous pouvez autoriser Stan à accéder à votre
        localisation approximative.
      </p>
      <p>🚀 Pourquoi&nbsp;?</p>
      <ul>
        <li>Pour vous suggérer des écoles proches</li>
        <li>Pour déterminer si Stan est disponible dans votre région</li>
      </ul>
      <ul>
        <li data-emoji>
          ⚠️ Nous ne stockons <strong>PAS</strong> votre localisation sur nos
          serveurs.
        </li>
        <li data-emoji>
          ⚠️ Nous ne la relions <strong>PAS</strong> à votre compte et ne suivons{" "}
          <strong>PAS</strong> vos déplacements après votre inscription.
        </li>
      </ul>

      <h3>Données sur l&apos;appareil et l&apos;activité</h3>
      <p>
        Lorsque vous utilisez Stan, nous collectons certaines informations
        techniques sur votre appareil&nbsp;:
      </p>
      <ul>
        <li data-emoji>
          📲 Type d&apos;appareil, système d&apos;exploitation, adresse IP,
          identifiants uniques
        </li>
        <li data-emoji>
          📊 Interactions avec l&apos;application (ex.&nbsp;: temps
          d&apos;utilisation, actions effectuées)
        </li>
      </ul>
      <p>
        Ces données nous aident à améliorer l&apos;application, créer de
        nouvelles fonctionnalités et assurer la sécurité du système.
      </p>

      <h2>Partage des données</h2>
      <p>
        Stan ne vend, loue ni ne partage vos données avec des tiers à des fins
        publicitaires.
      </p>
      <p>Cependant, nous pouvons divulguer vos données aux tiers suivants&nbsp;:</p>
      <ul>
        <li data-emoji>
          📌 Fournisseurs de services (hébergement, assistance client, analyse
          des données)
        </li>
        <li data-emoji>📌 Conseillers professionnels (avocats, comptables)</li>
        <li data-emoji>
          📌 Partenaires en cas de transactions commerciales (fusion,
          acquisition, financement)
        </li>
        <li data-emoji>
          📌 Autorités légales si requis par la loi ou pour protéger Stan et ses
          utilisateurs
        </li>
      </ul>

      <h3>Comment vous partagez vos données</h3>
      <p>
        💬 Lorsque vous votez dans un sondage, votre réponse est envoyée à votre
        ami via l&apos;application. Cela inclut votre niveau scolaire, genre et
        les autres options de vote disponibles.
      </p>
      <p>
        🛑 Votre nom peut être révélé si votre ami souscrit à des fonctionnalités
        premium.
      </p>

      <h2>Conservation des données</h2>
      <p>
        Nous conservons vos données uniquement aussi longtemps que nécessaire
        pour fournir nos services, sauf obligation légale contraire.
      </p>

      <h2>Vos droits</h2>
      <p>Nous offrons aux utilisateurs les droits suivants&nbsp;:</p>
      <ul>
        <li data-emoji>
          ✅ <strong>Désactivation</strong>&nbsp;: vous pouvez désactiver votre
          compte pour ne plus envoyer ni recevoir de sondages.
        </li>
        <li data-emoji>
          ✅ <strong>Accès</strong>&nbsp;: vous pouvez demander un accès aux
          données que nous avons collectées sur vous.
        </li>
        <li data-emoji>
          ✅ <strong>Suppression</strong>&nbsp;: vous pouvez demander la
          suppression de vos données, sauf en cas d&apos;obligation légale.
        </li>
        <li data-emoji>
          ✅ <strong>Correction</strong>&nbsp;: vous pouvez nous demander de
          corriger toute erreur dans vos données.
        </li>
        <li data-emoji>
          ✅ <strong>Opposition</strong>&nbsp;: vous pouvez vous opposer à
          certains traitements de vos données.
        </li>
        <li data-emoji>
          ✅ <strong>Réclamation</strong>&nbsp;: vous pouvez déposer une plainte
          auprès de l&apos;autorité de protection des données de votre pays.
        </li>
      </ul>
      <p>
        Vous pouvez exercer ces droits en nous contactant à{" "}
        <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a>. Nous
        pourrions avoir besoin d&apos;informations supplémentaires pour vérifier
        votre identité avant de répondre à votre demande.
      </p>

      <h2>Cookies et signaux «&nbsp;Do Not Track&nbsp;»</h2>
      <p>
        Si votre navigateur envoie un signal «&nbsp;Do Not Track&nbsp;», notre
        site et notre application ne sont pas configurés pour y répondre, car
        nous ne suivons pas les utilisateurs en dehors de Stan.
      </p>

      <h2>Utilisateurs de moins de 13 ans</h2>
      <ul>
        <li data-emoji>🚫 Stan est interdit aux utilisateurs de moins de 13 ans.</li>
        <li data-emoji>
          🚫 Nous ne collectons pas intentionnellement de données sur les enfants
          de moins de 13 ans.
        </li>
      </ul>
      <p>
        Si nous découvrons qu&apos;un compte appartient à un enfant de moins de
        13 ans, nous supprimerons immédiatement ses données. Si vous êtes un
        parent ou tuteur et pensez que votre enfant a fourni des données,
        contactez-nous à{" "}
        <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a> pour
        demander la suppression du compte.
      </p>

      <h2>Modifications de cette politique</h2>
      <p>
        Stan SAS peut mettre à jour cette politique pour tenir compte des
        évolutions légales ou techniques. En cas de modifications majeures, vous
        serez informé via l&apos;application.
      </p>

      <h2>Contact</h2>
      <p>
        Si vous avez des questions sur cette politique, contactez-nous à{" "}
        <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a>.
      </p>
    </LegalPage>
  );
}
