import type { Metadata } from "next";
import PrintingPage from "@/components/PrintingPage";
import { readContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impression & Personnalisation Professionnelle — Studio Vizio Biza | Agadir",
  description: "Studio Vizio Biza — Impression photo, sublimation, marketing, stickers & vinyle, grand format et finition à Agadir, Maroc. Solutions complètes pour particuliers et entreprises.",
  keywords: ["impression Agadir", "sublimation", "t-shirt personnalisé", "mug", "cartes de visite", "flyers", "roll-up", "stickers", "bâche", "DTF", "grand format", "Studio Vizio Biza", "Lqliaa"],
  openGraph: {
    title: "Impression & Personnalisation — Studio Vizio Biza",
    description: "Solutions complètes d'impression et de personnalisation à Agadir.",
    type: "website",
    locale: "fr_MA",
    images: ["https://res.cloudinary.com/dn51k6ysz/image/upload/v1775683434/download_dvaaip.webp"],
  },
};

export default async function Page() {
  const site = await readContent();
  return <PrintingPage content={site.print} settings={site.settings} contact={site.contact} />;
}
