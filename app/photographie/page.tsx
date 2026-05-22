import type { Metadata } from "next";
import PhotographyPage from "@/components/PhotographyPage";
import { readContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photographie & Production Vidéo — Studio Vizio Biza | Agadir",
  description: "Studio Vizio Biza — Photographie professionnelle, mariage, événements, production vidéo et photographie administrative à Agadir, Maroc.",
  keywords: ["photographie Agadir", "photographe Maroc", "mariage", "vidéo professionnelle", "photo CIN passeport", "portrait corporate", "photo produit", "Studio Vizio Biza", "Lqliaa"],
  openGraph: {
    title: "Photographie & Production Vidéo — Studio Vizio Biza",
    description: "Photographie professionnelle, mariage, vidéo et photo administrative à Agadir.",
    type: "website",
    locale: "fr_MA",
    images: ["https://res.cloudinary.com/dn51k6ysz/image/upload/v1775732907/0af33070949a2c81b328349c457cf0b3_ar3ed2.webp"],
  },
};

export default async function Page() {
  const site = await readContent();
  return <PhotographyPage content={site.photo} settings={site.settings} contact={site.contact} />;
}
