import { Backdrop } from "@/components/Backdrop";
import { EmojiSprite } from "@/components/EmojiSprite";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { EcranVerrouille } from "@/components/b/EcranVerrouille";
import { MurVisages } from "@/components/b/MurVisages";
import { SceneQuestion } from "@/components/b/SceneQuestion";
import { SceneQuestions } from "@/components/b/SceneQuestions";
import { SceneReveal } from "@/components/b/SceneReveal";

// Balisage Schema.org : ce que Google affiche quand on cherche « Stan app ».
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Stan",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "iOS, Android",
  description:
    "Tes potes répondent à des questions positives sur toi, anonymement. Aucun vote négatif, aucun message privé.",
  inLanguage: "fr-FR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  publisher: { "@type": "Organization", name: "Stan SAS" },
  url: "https://www.stan-friends.com",
  downloadUrl: "https://invite.stan-friends.com/invite",
};

/*
 * TEST B : le site raconté comme une soirée sur Stan. Écran verrouillé et
 * notifications, la question, les questions, le reveal, puis tout le monde.
 */
export default function Home() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      <EmojiSprite />
      <Backdrop />
      <Nav />
      <main className="flex-1">
        <EcranVerrouille />
        <SceneQuestion />
        <SceneQuestions />
        <SceneReveal />
        <MurVisages />
      </main>
      <Footer />
    </>
  );
}
