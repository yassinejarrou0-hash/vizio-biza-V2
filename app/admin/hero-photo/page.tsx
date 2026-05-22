import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import AdminEditor, { type FieldType } from "@/components/admin/AdminEditor";
import type { HeroSlide } from "@/lib/content-types";

export const dynamic = "force-dynamic";

const SCHEMA: Record<keyof HeroSlide, FieldType> = {
  tagIcon: { kind: "text", label: "Icône tag (classe Font Awesome)", placeholder: "fa-solid fa-camera" },
  tagLabel: { kind: "text", label: "Étiquette du tag" },
  h1Before: { kind: "text", label: "Titre — avant le mot mis en valeur" },
  h1Prefix: { kind: "text", label: "Préfixe" },
  h1Highlight: { kind: "text", label: "Mot mis en valeur (en doré)" },
  h1After: { kind: "text", label: "Titre — après le mot mis en valeur" },
  sub: { kind: "textarea", label: "Sous-titre", rows: 3 },
  mediaType: {
    kind: "select",
    label: "Type de média",
    options: [
      { value: "image", label: "Image" },
      { value: "video", label: "Vidéo" },
    ],
  },
  mediaSrc: { kind: "image", label: "URL du média" },
  mediaPoster: { kind: "image", label: "Image poster (pour les vidéos)" },
  mediaAlt: { kind: "text", label: "Texte alternatif" },
  contain: { kind: "checkbox", label: "Adapter (object-fit: contain)" },
};

const NEW_SLIDE: HeroSlide = {
  tagIcon: "fa-solid fa-camera",
  tagLabel: "Nouveau tag",
  h1Before: "",
  h1Prefix: "",
  h1Highlight: "titre",
  h1After: "",
  sub: "",
  mediaType: "image",
  mediaSrc: "",
  mediaPoster: "",
  mediaAlt: "",
  contain: false,
};

export default async function Page() {
  await requireAuth();
  const site = await readContent();
  return (
    <>
      <div className="admin-page-head">
        <h1>Hero · Photographie</h1>
        <span className="crumb">
          <Link href="/admin">Admin</Link> / Hero Photo
        </span>
      </div>
      <div className="admin-card">
        <p>
          Modifiez les diapositives du carrousel de la page <Link href="/photographie" target="_blank">Photographie</Link>.
        </p>
      </div>
      <AdminEditor<HeroSlide[]>
        section="hero-photo"
        initial={site.photo.heroSlides}
        schema={SCHEMA}
        isList
        newItem={NEW_SLIDE}
        labelTemplate="Diapositive {i} — « {h1Highlight} »"
      />
    </>
  );
}
