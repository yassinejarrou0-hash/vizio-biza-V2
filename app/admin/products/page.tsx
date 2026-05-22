import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import AdminEditor, { type FieldType } from "@/components/admin/AdminEditor";
import type { Product } from "@/lib/content-types";

export const dynamic = "force-dynamic";

const SCHEMA: Record<keyof Product, FieldType> = {
  name: { kind: "text", label: "Nom du produit" },
  cat: { kind: "text", label: "Catégorie (texte affiché)" },
  alt: { kind: "text", label: "Texte alternatif (accessibilité)" },
  price: { kind: "text", label: "Prix — laisser vide pour ne pas afficher", placeholder: "ex. 200 dh" },
  front: { kind: "image", label: "Image principale" },
  back: { kind: "image", label: "Image au survol" },
  badgeKind: {
    kind: "select",
    label: "Type de badge (laisser « Aucun » pour ne pas afficher)",
    options: [
      { value: "", label: "Aucun" },
      { value: "hot", label: "Hot (rouge)" },
      { value: "gold", label: "Gold (doré)" },
      { value: "new", label: "Nouveau (vert)" },
      { value: "pro", label: "Pro (bleu)" },
    ],
  },
  badgeLabel: { kind: "text", label: "Texte du badge (ex. Best-seller, Nouveau, Pro…)" },
};

const NEW_PRODUCT: Product = {
  badgeKind: "",
  badgeLabel: "",
  front: "",
  back: "",
  cat: "Catégorie",
  name: "Nouveau produit",
  alt: "Nouveau produit",
  price: "",
};

export default async function Page() {
  await requireAuth();
  const site = await readContent();
  return (
    <>
      <div className="admin-page-head">
        <h1>Produits — Meilleures Ventes</h1>
        <span className="crumb">
          <Link href="/admin">Admin</Link> / Produits
        </span>
      </div>
      <div className="admin-card">
        <p>
          Modifiez les produits affichés dans la section <em>Nos Meilleures Ventes</em> de la page <Link href="/impression#products" target="_blank">Impression</Link>.
        </p>
      </div>
      <AdminEditor<Product[]>
        section="products"
        initial={site.print.products}
        schema={SCHEMA}
        isList
        newItem={NEW_PRODUCT}
        labelTemplate="{i}. {name} — {price}"
      />
    </>
  );
}
