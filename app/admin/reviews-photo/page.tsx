import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import AdminEditor, { type FieldType } from "@/components/admin/AdminEditor";
import type { Review } from "@/lib/content-types";

export const dynamic = "force-dynamic";

const SCHEMA: Record<keyof Review, FieldType> = {
  name: { kind: "text", label: "Nom du client" },
  detail: { kind: "text", label: "Poste / Contexte" },
  avatar: { kind: "text", label: "Initiales (2 caractères)" },
  rating: { kind: "number", label: "Note (1 à 5)", min: 1, max: 5 },
  quote: { kind: "textarea", label: "Avis", rows: 4 },
};

const NEW_REVIEW: Review = {
  name: "Nouveau client",
  detail: "",
  avatar: "NC",
  quote: "",
  rating: 5,
};

export default async function Page() {
  await requireAuth();
  const site = await readContent();
  return (
    <>
      <div className="admin-page-head">
        <h1>Avis · Photographie</h1>
        <span className="crumb">
          <Link href="/admin">Admin</Link> / Avis Photo
        </span>
      </div>
      <div className="admin-card">
        <p>
          Modifiez les avis clients affichés sur la page <Link href="/photographie#avis" target="_blank">Photographie</Link>.
        </p>
      </div>
      <AdminEditor<Review[]>
        section="reviews-photo"
        initial={site.photo.reviews}
        schema={SCHEMA}
        isList
        newItem={NEW_REVIEW}
        labelTemplate="{i}. {name}"
      />
    </>
  );
}
