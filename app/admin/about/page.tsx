import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import AdminEditor, { type FieldType } from "@/components/admin/AdminEditor";
import type { About } from "@/lib/content-types";

export const dynamic = "force-dynamic";

const SCHEMA: Record<keyof About, FieldType> = {
  kicker: { kind: "text", label: "Petit texte au-dessus du titre" },
  titleBefore: { kind: "text", label: "Titre — début" },
  titleHighlight: { kind: "text", label: "Titre — partie mise en valeur" },
  p1: { kind: "textarea", label: "Premier paragraphe", rows: 4 },
  p2: { kind: "textarea", label: "Deuxième paragraphe", rows: 3 },
  image: { kind: "image", label: "Image" },
};

export default async function Page() {
  await requireAuth();
  const site = await readContent();
  return (
    <>
      <div className="admin-page-head">
        <h1>À propos — Impression &amp; Photo</h1>
        <span className="crumb">
          <Link href="/admin">Admin</Link> / À propos
        </span>
      </div>
      <div className="admin-card">
        <p>
          La section <em>À propos</em> apparaît sur les pages <Link href="/impression" target="_blank">Impression</Link> et <Link href="/photographie" target="_blank">Photographie</Link>.
          Chaque page a son propre contenu — modifiez-les séparément ci-dessous.
        </p>
      </div>

      <div className="admin-card">
        <h2>À propos · Impression</h2>
        <AdminEditor<About>
          section="about-print"
          initial={site.print.about}
          schema={SCHEMA}
        />
      </div>

      <div className="admin-card">
        <h2>À propos · Photographie</h2>
        <AdminEditor<About>
          section="about-photo"
          initial={site.photo.about}
          schema={SCHEMA}
        />
      </div>
    </>
  );
}
