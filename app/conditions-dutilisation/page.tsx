import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description:
    "Les conditions générales qui régissent l'accès et l'utilisation de l'application Stan, de son site web et de ses services.",
  alternates: { canonical: "/conditions-dutilisation" },
};

export default function Page() {
  return (
    <LegalPage
      title={
        <>
          Conditions <span className="text-vote">d&apos;utilisation</span>
        </>
      }
      updated="28 janvier 2026"
      intro={
        <>
          <p className="mb-3 text-lg font-black tracking-tight text-white">
            Merci d&apos;utiliser Stan.
          </p>
          <p className="mb-4">
            Bienvenue sur Stan. Stan est une application permettant de faire des
            compliments à vos amis. Nous espérons que Stan vous montrera
            qu&apos;il y a des personnes qui vous aiment et vous admirent.
          </p>
          <p className="mb-4">
            Les présentes Conditions Générales d&apos;Utilisation
            («&nbsp;Conditions&nbsp;») régissent l&apos;accès et l&apos;utilisation
            de notre application, site web et autres outils (collectivement,
            «&nbsp;Stan&nbsp;» ou le «&nbsp;Service&nbsp;» ou les
            «&nbsp;Services&nbsp;»). Chaque fois que vous accédez ou utilisez
            Stan, vous acceptez d&apos;être lié par ces Conditions et par toutes
            les conditions supplémentaires qui peuvent s&apos;appliquer. Si vous
            n&apos;acceptez pas ces Conditions, veuillez cesser d&apos;utiliser
            Stan.
          </p>
          <p className="mb-4">
            Stan est détenu et développé par Stan SAS
            («&nbsp;l&apos;Entreprise&nbsp;», «&nbsp;nous&nbsp;» ou
            «&nbsp;notre&nbsp;»). Pour les besoins de ces Conditions,
            «&nbsp;vous&nbsp;» et «&nbsp;votre&nbsp;» font référence à vous en
            tant qu&apos;utilisateur des Services.
          </p>
          <p>
            Nous avons également une{" "}
            <a
              href="/politique-de-confidentialite"
              className="font-bold text-white underline decoration-rose underline-offset-4"
            >
              Politique de Confidentialité
            </a>{" "}
            qui décrit les informations que nous collectons et comment nous les
            utilisons. Vous devez la lire car elle régit l&apos;utilisation de vos
            informations personnelles par l&apos;entreprise.
          </p>
        </>
      }
    >
      <h2>Âge et capacité légale</h2>
      <p>
        Vous déclarez avoir au moins 13 ans et posséder la capacité légale pour
        accepter ces Conditions. Personne de moins de 13 ans ne peut utiliser ou
        accéder à Stan.
      </p>
      <p>
        Si vous résidez dans l&apos;Union Européenne, vous ne pouvez utiliser
        Stan que si vous avez l&apos;âge requis pour consentir au traitement des
        données dans votre pays ou si un consentement parental vérifiable nous a
        été fourni.
      </p>

      <h2>Comptes et mises à jour du logiciel</h2>
      <p>
        Lorsque vous créez un compte Stan, vous acceptez de fournir des
        informations exactes et complètes. Nous pouvons vous refuser l&apos;accès
        au Service si nous apprenons que les informations fournies sont
        inexactes.
      </p>
      <p>
        Vous pouvez arrêter d&apos;utiliser les Services à tout moment et pour
        toute raison. Vous pouvez supprimer votre compte Stan en accédant à votre
        profil et en suivant les instructions de suppression.
      </p>
      <p>
        L&apos;utilisation de Stan nécessite le téléchargement du logiciel sur
        votre appareil (ordinateur, téléphone, tablette, etc.). Vous acceptez que
        nous puissions automatiquement mettre à jour ce logiciel, et que ces
        Conditions s&apos;appliqueront à toutes les mises à jour.
      </p>

      <h2>Licence d&apos;utilisation de Stan</h2>
      <p>
        Les Services, y compris leur apparence (textes, graphismes, images,
        logos), leur contenu propriétaire et le logiciel utilisé pour les
        fournir, sont protégés par des lois sur la propriété intellectuelle.
      </p>
      <p>
        Vous acceptez que Stan SAS et/ou ses concédants de licence détiennent
        tous les droits relatifs aux Services et à leur contenu.
      </p>
      <p>
        Nous vous accordons une licence mondiale, non exclusive, personnelle, non
        cessible et révocable pour télécharger, installer et exécuter ce logiciel
        uniquement pour accéder à nos Services.
      </p>
      <p>
        Vous ne pouvez pas copier, modifier, créer des œuvres dérivées,
        distribuer, vendre ou rétroconcevoir notre logiciel sans notre
        consentement écrit.
      </p>
      <p>
        Le nom «&nbsp;Stan&nbsp;» ainsi que le logo et les icônes associés sont
        des marques déposées de Stan SAS. Toute utilisation non autorisée de ces
        marques est strictement interdite.
      </p>

      <h2>Vous possédez votre contenu</h2>
      <p>
        Le «&nbsp;Contenu Utilisateur&nbsp;» désigne toutes les photos,
        commentaires, liens et autres contenus que vous publiez sur Stan. Vous
        conservez tous les droits sur ce Contenu Utilisateur et en êtes seul
        responsable.
      </p>
      <p>
        Cependant, vous accordez à Stan et à ses utilisateurs une licence
        mondiale, gratuite, cessible et transférable pour utiliser, stocker,
        afficher, modifier, créer des œuvres dérivées et distribuer votre Contenu
        Utilisateur.
      </p>
      <p>
        Nous nous réservons le droit de supprimer ou modifier tout Contenu
        Utilisateur qui enfreindrait ces Conditions ou toute autre politique de
        Stan.
      </p>

      <h2>Sécurisation de votre compte</h2>
      <p>
        Nous mettons en place des mesures de sécurité pour protéger votre compte.
        Vous êtes responsable de la confidentialité de votre mot de passe et de
        vos informations d&apos;authentification.
      </p>
      <p>
        En cas d&apos;utilisation non autorisée de votre compte, veuillez nous en
        informer immédiatement à{" "}
        <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a>.
      </p>

      <h2>Conditions d&apos;accès et d&apos;utilisation</h2>

      <h3>Conduite de l&apos;utilisateur</h3>
      <p>
        Vous êtes seul responsable de tout code, vidéo, image, information,
        donnée, texte, logiciel, musique, son, photographie, graphique, message
        et autre contenu («&nbsp;Contenu&nbsp;») que vous mettez à disposition sur
        Stan, y compris en téléchargeant, publiant, partageant ou envoyant par
        e-mail à d&apos;autres utilisateurs.
      </p>
      <p>
        Stan SAS se réserve le droit d&apos;enquêter et de prendre les mesures
        appropriées contre toute personne qui, à sa seule discrétion,
        enfreindrait ces règles, y compris en supprimant le contenu concerné, en
        suspendant ou résiliant le compte de l&apos;utilisateur en faute, et en
        signalant l&apos;infraction aux autorités compétentes.
      </p>
      <p>Vous acceptez de ne pas utiliser le Service pour&nbsp;:</p>
      <p>Envoyer ou télécharger tout contenu qui&nbsp;:</p>
      <ul>
        <li>
          (i) enfreint les droits de propriété intellectuelle ou tout autre droit
          de tiers&nbsp;;
        </li>
        <li>
          (ii) vous est interdit par la loi ou par un contrat ou engagement
          fiduciaire&nbsp;;
        </li>
        <li>
          (iii) contient des virus ou tout autre code informatique conçu pour
          interférer, interrompre ou nuire aux systèmes informatiques&nbsp;;
        </li>
        <li>
          (iv) porte atteinte à la confidentialité ou la sécurité d&apos;une
          personne&nbsp;;
        </li>
        <li>
          (v) constitue du spam, de la publicité non autorisée, des chaînes de
          courriers ou des systèmes frauduleux (pyramides, loteries illégales,
          etc.)&nbsp;;
        </li>
        <li>
          (vi) est illégal, nuisible, menaçant, abusif, harcelant, diffamatoire,
          obscène, pornographique, haineux, discriminatoire ou autrement
          inacceptable&nbsp;;
        </li>
        <li>
          (vii) selon Stan SAS, est inapproprié ou nuit à l&apos;expérience des
          autres utilisateurs.
        </li>
      </ul>
      <ul>
        <li>
          Perturber le service, les serveurs ou les réseaux connectés à Stan en
          contournant ou enfreignant leurs règlements et restrictions.
        </li>
        <li>
          Violer toute loi applicable, qu&apos;elle soit locale, nationale ou
          internationale.
        </li>
        <li>
          Se faire passer pour une autre personne ou entité, ou falsifier une
          affiliation avec une autre entité.
        </li>
        <li>
          Collecter des informations personnelles d&apos;utilisateurs sans leur
          consentement.
        </li>
        <li>
          Publier des annonces commerciales non autorisées ou vendre des produits
          ou services sans accord préalable de Stan SAS.
        </li>
        <li>
          Promouvoir des activités criminelles ou fournir des instructions sur des
          activités illégales.
        </li>
        <li>
          Tenter d&apos;accéder à des données ou informations de manière non
          autorisée.
        </li>
        <li>Contourner ou modifier les protections de contenu du Service.</li>
        <li>
          Utiliser des méthodes automatisées (robots, scraping, data mining) pour
          extraire des données du Service.
        </li>
      </ul>
      <p>
        Stan SAS se réserve le droit de bloquer, suspendre ou résilier votre
        compte en cas de violation de ces règles.
      </p>

      <h3>Contenu du Service</h3>
      <p>
        Vous reconnaissez que Stan peut contenir du contenu protégé par le droit
        d&apos;auteur, des marques de commerce, des brevets ou d&apos;autres
        droits de propriété intellectuelle.
      </p>
      <p>
        Sauf autorisation expresse de Stan SAS, vous acceptez de ne pas modifier,
        copier, vendre, distribuer ou créer des œuvres dérivées à partir du
        contenu du Service, sauf en ce qui concerne votre propre Contenu
        Utilisateur.
      </p>
      <p>
        Toute utilisation non conforme est strictement interdite et pourra donner
        lieu à des sanctions légales.
      </p>

      <h3>Accès et utilisation par les concurrents</h3>
      <p>
        Aucune personne travaillant pour une entreprise concurrente de Stan SAS
        n&apos;est autorisée à accéder, analyser ou utiliser le Service sans
        autorisation écrite de Stan SAS.
      </p>
      <p>
        En utilisant Stan, vous déclarez ne pas être un concurrent ou agir au nom
        d&apos;un concurrent. Toute violation de cette règle pourra entraîner des
        poursuites judiciaires.
      </p>

      <h2>Frais et abonnements</h2>
      <p>
        Stan propose certains services payants sous forme d&apos;abonnement. En
        souscrivant à un abonnement, vous acceptez de payer les frais indiqués.
      </p>

      <h3>Renouvellement automatique et annulation</h3>
      <p>
        Votre abonnement sera renouvelé automatiquement, sauf si vous
        l&apos;annulez au moins 24 heures avant la fin de la période de
        facturation en cours.
      </p>
      <p>
        Vous pouvez gérer votre abonnement via votre compte utilisateur sur
        l&apos;App Store ou Google Play.
      </p>

      <h3>Paiement et responsabilité</h3>
      <p>
        Les paiements sont gérés par les plateformes d&apos;application (Apple,
        Google, etc.).
      </p>
      <p>
        Vous êtes responsable du maintien de vos informations de paiement à jour.
        En cas d&apos;échec de paiement, Stan SAS peut suspendre votre accès aux
        services concernés.
      </p>

      <h3>Remboursements</h3>
      <p>Aucun remboursement ne sera effectué pour des périodes déjà facturées.</p>
      <p>
        Pour toute demande de remboursement, veuillez contacter directement votre
        fournisseur d&apos;application mobile.
      </p>

      <h3>Modifications des abonnements</h3>
      <p>
        Stan SAS se réserve le droit de modifier, suspendre ou supprimer les
        abonnements et fonctionnalités à tout moment.
      </p>

      <h2>Accès aux services SMS</h2>
      <p>
        Stan pourra vous envoyer des SMS à des fins d&apos;authentification et de
        notifications.
      </p>
      <p>
        Des frais de messages et de données peuvent s&apos;appliquer selon votre
        opérateur téléphonique.
      </p>
      <p>
        Vous pouvez désactiver les SMS en écrivant à{" "}
        <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a>.
      </p>

      <h2>Droits d&apos;auteur et propriété intellectuelle</h2>
      <p>
        Le Service Stan est protégé par le droit d&apos;auteur, des marques
        déposées et d&apos;autres lois de propriété intellectuelle.
      </p>
      <p>
        Si vous estimez que du contenu sur Stan enfreint vos droits d&apos;auteur,
        veuillez nous envoyer une réclamation à{" "}
        <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a> en
        incluant&nbsp;:
      </p>
      <ul>
        <li>Une description de l&apos;œuvre protégée.</li>
        <li>L&apos;URL ou l&apos;emplacement exact du contenu en infraction.</li>
        <li>
          Une déclaration sous serment affirmant que vous êtes titulaire des
          droits concernés.
        </li>
      </ul>
      <p>Nous examinerons votre demande et prendrons les mesures appropriées.</p>

      <h2>Contact et support</h2>
      <p>
        Si vous avez des questions ou besoin d&apos;assistance, contactez-nous à{" "}
        <a href="mailto:admin@stan-friends.com">admin@stan-friends.com</a>.
      </p>

      <h2>Droit applicable et modifications</h2>
      <p>
        Ces Conditions Générales d&apos;Utilisation sont régies par les lois
        françaises.
      </p>
      <p>
        Stan SAS se réserve le droit de modifier ces Conditions à tout moment. En
        continuant à utiliser Stan, vous acceptez ces modifications.
      </p>
    </LegalPage>
  );
}
