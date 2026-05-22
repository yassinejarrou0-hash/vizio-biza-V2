import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import ContactFormClient from "@/components/admin/ContactFormClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAuth();
  const site = await readContent();
  return (
    <>
      <div className="admin-page-head">
        <h1>Section Contactez-nous</h1>
        <span className="crumb"><Link href="/admin">Admin</Link> / Contact</span>
      </div>
      <div className="admin-card">
        <p>Modifiez les horaires affichés sur les pages Impression et Photographie ainsi que la liste des types de services proposés dans le formulaire.
          L&apos;email, l&apos;adresse et le numéro WhatsApp se modifient dans <Link href="/admin/settings">Paramètres</Link>.</p>
      </div>
      <ContactFormClient initial={site.contact} />
    </>
  );
}
