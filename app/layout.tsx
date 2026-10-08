import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { EchelleDefilement } from "@/components/EchelleDefilement";

// L'app utilise Roboto (.custom("Roboto")), on garde exactement la même.
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});


const SITE = "https://www.stan-friends.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Stan · Qui a voté pour toi ?",
    template: "%s · Stan",
  },
  description:
    "Si tes potes pouvaient dire ce qu'ils pensent de toi en anonyme, ils diraient quoi ? Rejoins ton école, ajoute tes amis, réponds aux questions. Gratuit sur iPhone et Android.",
  applicationName: "Stan",
  keywords: [
    "Stan",
    "application",
    "sondage entre amis",
    "compliments",
    "lycée",
    "collège",
    "anonyme",
    "positif",
  ],
  authors: [{ name: "Stan SAS" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE,
    siteName: "Stan",
    title: "Ils ont voté. Tu vas savoir.",
    description:
      "Si tes potes pouvaient dire ce qu'ils pensent de toi en anonyme, ils diraient quoi ?",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ils ont voté. Tu vas savoir.",
    description:
      "Si tes potes pouvaient dire ce qu'ils pensent de toi en anonyme, ils diraient quoi ?",
  },
  // La bannière native de Safari sur iPhone : elle apparaît en haut de la page
  // avec l'icône de Stan et un bouton. Si l'app est déjà installée, le bouton
  // l'ouvre directement au lieu de renvoyer vers l'App Store.
  itunes: { appId: "6740286416" },

  appleWebApp: {
    title: "Stan",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/app-icon.png",
    apple: "/app-icon.png",
  },
  robots: { index: true, follow: true },
};

// La page passe SOUS la barre d'état et la barre d'outils de Safari, comme les
// autres sites : sans `viewport-fit: cover`, Safari iOS posait deux bandes
// sombres en haut et en bas, et le fond violet s'arrêtait entre les deux.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0e0933",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${roboto.variable} h-full antialiased`}>
      <body className="relative min-h-full flex flex-col pt-[var(--banniere,0px)]">
        {children}
        <EchelleDefilement />
      </body>
    </html>
  );
}
