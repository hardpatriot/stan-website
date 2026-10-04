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
      updated="4 octobre 2026"
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

      <h3 id="donnees-de-localisation">Données de localisation</h3>
      <p>
        Avec votre accord, Stan utilise votre position précise, seulement quand
        l&apos;app est ouverte, jamais en arrière-plan. Elle sert à vous proposer
        des écoles proches et à vous situer sur la Map. Vous pouvez à tout moment
        choisir une position approximative ou couper la localisation dans les
        réglages du téléphone.
      </p>

      <h3 id="map">Map</h3>
      <p>
        L&apos;onglet Map affiche la carte des lycées de France, avec les blocus
        du jour et vos amis.
      </p>
      <ul>
        <li>
          <strong>Blocus</strong>&nbsp;: pour votre lycée, vous pouvez indiquer
          «&nbsp;Je vote blocus&nbsp;», «&nbsp;Je vote contre&nbsp;» ou
          «&nbsp;Il y a blocus&nbsp;». Vos votes sont anonymes, même pour vos
          amis&nbsp;: seuls des totaux par lycée sont affichés. Ces informations
          sont purement informatives, non vérifiées, et ne constituent pas une
          incitation au blocus.
        </li>
        <li>
          <strong>Amis</strong>&nbsp;: le mode fantôme est activé par défaut. Si
          vous le quittez, seuls vos amis acceptés voient où vous êtes. Seule votre
          dernière position est gardée&nbsp;: 6&nbsp;h au plus, et elle est
          effacée dès que vous repassez en mode fantôme.
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

      <h3 id="photos-et-souvenirs">Photos et souvenirs (Memories)</h3>
      <p>
        Lorsque vous enregistrez un souvenir, Stan reçoit la photo que vous avez
        choisie ou prise, sa légende éventuelle et le jour associé, et les relie
        à votre compte. Stan ne parcourt pas toute votre photothèque.
      </p>
      <ul>
        <li>
          <strong>Utilisation</strong>&nbsp;: ces données servent à fournir
          Memories, votre archive personnelle, le Wall et les exports que vous
          demandez, ainsi qu&apos;à modérer les contenus. Ce traitement est
          nécessaire à l&apos;exécution du service que vous choisissez
          d&apos;utiliser. Les photos sont stockées dans un espace privé chez
          Amazon Web Services, en région Paris (France), accessible aux
          prestataires techniques et aux personnes habilitées pour ces besoins.
        </li>
        <li>
          <strong>Visibilité</strong>&nbsp;: avant le reveal, les souvenirs ne
          sont pas visibles par vos amis. Lors du reveal, ils deviennent
          accessibles aux amis autorisés de votre école selon les règles du
          Wall. Certaines photos peuvent d&apos;abord apparaître floutées.
        </li>
        <li>
          <strong>Conservation et suppression</strong>&nbsp;: la fermeture du
          Wall met fin à l&apos;accès des amis, mais ne supprime pas votre
          archive personnelle. Les souvenirs y restent tant que vous les
          conservez dans votre compte. Vous pouvez les retirer avec les
          commandes disponibles dans l&apos;app ou demander leur suppression à{" "}
          <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a>,
          notamment après le verrouillage de l&apos;édition. La suppression du
          compte entraîne aussi celle des photos stockées par Stan.
        </li>
        <li>
          <strong>Vos choix</strong>&nbsp;: vous pouvez retirer les
          autorisations caméra et photos dans les réglages du téléphone&nbsp;;
          cela ne supprime pas les souvenirs déjà envoyés. Vous pouvez signaler
          un contenu ou bloquer son auteur dans l&apos;app. Les copies déjà
          exportées ou capturées par d&apos;autres personnes ne sont pas effacées
          par une suppression dans Stan.
        </li>
      </ul>

      <h3 id="donnees-du-visage">Données du visage (ARKit / TrueDepth)</h3>
      <ul>
        <li>
          <strong>Activation</strong>&nbsp;: suivi facultatif, activé par
          l&apos;utilisateur avec son autorisation d&apos;accès à la caméra.
        </li>
        <li>
          <strong>Données utilisées</strong>&nbsp;: images traitées localement
          par ARKit, état du suivi, position et orientation de la tête,
          informations de caméra et valeurs temporaires de curseur et de
          calibration.
        </li>
        <li>
          <strong>Finalité</strong>&nbsp;: contrôler uniquement l&apos;effet
          laser «&nbsp;Révèle-le du regard&nbsp;» pour découvrir une carte
          «&nbsp;Duo certifié&nbsp;». Aucune identification, analyse des
          émotions, publicité, création de profil ou utilisation pour entraîner
          une IA.
        </li>
        <li>
          <strong>Stockage et partage</strong>&nbsp;: traitement en mémoire
          temporaire sur l&apos;appareil uniquement. Aucun enregistrement dans
          des fichiers, bases de données ou sauvegardes&nbsp;; aucune
          association au compte ni transmission à un serveur ou tiers, y compris
          aux prestataires d&apos;analyse. Les dispositions générales de partage
          ne s&apos;appliquent pas à ces données.
        </li>
        <li>
          <strong>Conservation</strong>&nbsp;: le suivi s&apos;arrête à la
          désactivation de l&apos;effet ou à la fermeture de l&apos;écran.
          Certaines valeurs temporaires peuvent rester en mémoire jusqu&apos;à la
          libération des composants&nbsp;; aucun historique persistant n&apos;est
          conservé.
        </li>
        <li>
          <strong>Votre choix</strong>&nbsp;: l&apos;autorisation de caméra peut
          être retirée dans les réglages iOS. La révélation au doigt reste
          disponible sans suivi du visage.
        </li>
      </ul>

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
    </LegalPage>
  );
}
