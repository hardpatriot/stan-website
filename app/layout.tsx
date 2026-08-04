import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

// L'app utilise Roboto (.custom("Roboto")) — on garde exactement la même.
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
    default: "Stan — qui a voté pour toi ?",
    template: "%s · Stan",
  },
  description:
    "Tes potes répondent à des sondages sur toi. Anonymement, et toujours en bien. Aucun vote négatif, aucun message privé. Gratuit sur iPhone.",
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
    title: "Quelqu'un a voté pour toi.",
    description:
      "Tes potes disent anonymement ce qu'ils kiffent chez toi. Que du positif — c'est la règle.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quelqu'un a voté pour toi.",
    description:
      "Tes potes disent anonymement ce qu'ils kiffent chez toi. Que du positif — c'est la règle.",
  },
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

export const viewport: Viewport = {
  themeColor: "#08050f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
