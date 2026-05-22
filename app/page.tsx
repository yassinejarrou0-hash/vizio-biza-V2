import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { readContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vizio Biza Studio — Impression & Photographie Premium | Agadir, Maroc",
  description: "Studio premium d'impression et de photographie à Agadir, Maroc. Deux univers créatifs : impression professionnelle & photographie haut de gamme.",
};

export default async function HomePage() {
  const site = await readContent();
  return <Landing landing={site.landing} settings={site.settings} />;
}
