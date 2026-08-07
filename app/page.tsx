import { Backdrop } from "@/components/Backdrop";
import { CustomQuestions } from "@/components/CustomQuestions";
import { EmojiSprite } from "@/components/EmojiSprite";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Nav } from "@/components/Nav";
import { QuestionMarquee } from "@/components/QuestionMarquee";

// Balisage Schema.org : ce que Google affiche quand on cherche « Stan app ».
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Stan",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "iOS",
  description:
    "Tes potes répondent à des sondages positifs sur toi, anonymement. Aucun vote négatif, aucun message privé.",
  inLanguage: "fr-FR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  publisher: { "@type": "Organization", name: "Stan SAS" },
  url: "https://www.stan-friends.com",
  downloadUrl:
    "https://apps.apple.com/fr/app/stan-qui-a-vote-pour-toi/id6740286416",
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      <EmojiSprite />
      <Backdrop />
      <Nav />
      <main className="flex-1">
        <Hero />
        <QuestionMarquee />
        <HowItWorks />
        <CustomQuestions />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
