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
    default: "Stan — Qui a voté pour toi ?",
    template: "%s · Stan",
  },
  description:
    "Si tes potes pouvaient dire ce qu'ils pensent de toi en anonyme, ils diraient quoi ? Rejoins ton école, ajoute tes amis, réponds aux questions. Gratuit sur iPhone.",
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
