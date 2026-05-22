import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import LandingFormClient from "@/components/admin/LandingFormClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAuth();
  const site = await readContent();
  return (
    <>
      <div className="admin-page-head">
        <h1>Page d&apos;accueil (Landing)</h1>
        <span className="crumb"><Link href="/admin">Admin</Link> / Accueil</span>
      </div>
      <div className="admin-card">
        <p>Page d&apos;accueil avec deux panneaux (Impression / Photographie). Chaque panneau a son propre titre, vidéo, mots animés et bouton.</p>
      </div>
      <LandingFormClient initial={site.landing} />
    </>
  );
}
