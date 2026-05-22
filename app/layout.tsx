import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Vizio Biza Studio — Impression & Photographie Premium | Agadir, Maroc",
    template: "%s | Vizio Biza Studio",
  },
  description:
    "Studio premium d'impression et de photographie à Agadir, Maroc. Services professionnels haut de gamme pour vos projets créatifs.",
  keywords: [
    "studio impression photographie Agadir",
    "Vizio Biza",
    "imprimerie Maroc",
    "photographe Agadir",
    "Lqliaa",
  ],
  authors: [{ name: "Vizio Biza Studio" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "Vizio Biza Studio",
  },
  icons: {
    icon: "https://res.cloudinary.com/dn51k6ysz/image/upload/v1775683434/download_dvaaip.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
