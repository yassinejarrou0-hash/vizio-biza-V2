import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import AdminEditor, { type FieldType } from "@/components/admin/AdminEditor";
import type {
  FeaturedCard,
  CategoryTile,
  PromoStripItem,
  ProcessStep,
  BestsellerSlide,
  PhotoProduct,
} from "@/lib/content-types";

export const dynamic = "force-dynamic";

const FEATURED_SCHEMA: Record<keyof FeaturedCard, FieldType> = {
  name: { kind: "text", label: "Titre" },
  cat: { kind: "text", label: "Catégorie" },
  href: { kind: "text", label: "Lien (URL)" },
  img: { kind: "image", label: "Image" },
  alt: { kind: "text", label: "Texte alternatif" },
};
const NEW_FEATURED: FeaturedCard = { href: "/", img: "", alt: "", cat: "", name: "Nouveau" };

const CATEGORY_SCHEMA: Record<keyof CategoryTile, FieldType> = {
  title: { kind: "text", label: "Titre" },
  sub: { kind: "text", label: "Sous-titre" },
  href: { kind: "text", label: "Lien (URL)" },
  img: { kind: "image", label: "Image" },
};
const NEW_CATEGORY: CategoryTile = { href: "/", img: "", title: "Nouvelle catégorie", sub: "" };

const PROMO_SCHEMA: Record<keyof PromoStripItem, FieldType> = {
  icon: { kind: "text", label: "Icône (classe Font Awesome)" },
  title: { kind: "text", label: "Titre" },
  sub: { kind: "text", label: "Sous-titre" },
};
const NEW_PROMO: PromoStripItem = { icon: "fa-solid fa-medal", title: "Nouveau", sub: "" };

const PROCESS_SCHEMA: Record<keyof ProcessStep, FieldType> = {
  icon: { kind: "text", label: "Icône" },
  title: { kind: "text", label: "Titre de l'étape" },
  desc: { kind: "textarea", label: "Description", rows: 3 },
};
const NEW_PROCESS: ProcessStep = { icon: "fa-solid fa-phone", title: "Nouvelle étape", desc: "" };

const BESTSELLER_SCHEMA: Record<keyof BestsellerSlide, FieldType> = {
  tagIcon: { kind: "text", label: "Icône du tag" },
  tagLabel: { kind: "text", label: "Étiquette du tag" },
  h1Before: { kind: "text", label: "Titre — début" },
  h1Prefix: { kind: "text", label: "Préfixe" },
  h1Highlight: { kind: "text", label: "Mot mis en valeur" },
  h1After: { kind: "text", label: "Titre — fin" },
  sub: { kind: "textarea", label: "Sous-titre", rows: 3 },
  image: { kind: "image", label: "Image de la diapositive" },
  ctaLabel: { kind: "text", label: "Texte du bouton CTA" },
  ctaHref: { kind: "text", label: "URL du bouton CTA" },
};
const NEW_BESTSELLER: BestsellerSlide = {
  tagIcon: "fa-solid fa-fire", tagLabel: "Tag", h1Before: "", h1Prefix: "",
  h1Highlight: "titre", h1After: "", sub: "", image: "", ctaLabel: "Découvrir", ctaHref: "#products",
};

const PRODUCT_SCHEMA: Record<keyof PhotoProduct, FieldType> = {
  name: { kind: "text", label: "Nom" },
  cat: { kind: "text", label: "Catégorie affichée" },
  tab: {
    kind: "select",
    label: "Onglet",
    options: [
      { value: "all", label: "Best-sellers" },
      { value: "events", label: "Mariage & Événements" },
      { value: "video", label: "Production Vidéo" },
      { value: "admin", label: "Administrative" },
    ],
  },
  alt: { kind: "text", label: "Texte alternatif" },
  front: { kind: "image", label: "Image principale" },
  back: { kind: "image", label: "Image au survol" },
  badgeKind: {
    kind: "select",
    label: "Type de badge",
    options: [
      { value: "", label: "Aucun" },
      { value: "hot", label: "Hot (rouge)" },
      { value: "gold", label: "Gold (doré)" },
      { value: "new", label: "Nouveau (vert)" },
      { value: "pro", label: "Pro (bleu)" },
    ],
  },
  badgeLabel: { kind: "text", label: "Texte du badge" },
};
const NEW_PRODUCT: PhotoProduct = {
  tab: "all", badgeKind: "", badgeLabel: "", front: "", back: "",
  cat: "Catégorie", name: "Nouveau", alt: "",
};

export default async function Page() {
  await requireAuth();
  const site = await readContent();
  const photo = site.photo;
  return (
    <>
      <div className="admin-page-head">
        <h1>Page Photographie — sections</h1>
        <span className="crumb"><Link href="/admin">Admin</Link> / Sections Photographie</span>
      </div>
      <div className="admin-card">
        <p>Modifiez les blocs de la page <Link href="/photographie" target="_blank">Photographie</Link>.</p>
      </div>

      <div className="admin-card"><h2>Cartes mises en avant (Featured 3)</h2>
        <AdminEditor<FeaturedCard[]> section="featured3-photo" initial={photo.featured3} schema={FEATURED_SCHEMA}
          isList newItem={NEW_FEATURED} labelTemplate="{i}. {name}" />
      </div>

      <div className="admin-card"><h2>Catégories en vedette</h2>
        <AdminEditor<CategoryTile[]> section="categories-photo" initial={photo.categories} schema={CATEGORY_SCHEMA}
          isList newItem={NEW_CATEGORY} labelTemplate="{i}. {title}" />
      </div>

      <div className="admin-card"><h2>Bandeau promo</h2>
        <AdminEditor<PromoStripItem[]> section="promostrip-photo" initial={photo.promoStrip} schema={PROMO_SCHEMA}
          isList newItem={NEW_PROMO} labelTemplate="{i}. {title}" />
      </div>

      <div className="admin-card"><h2>Produits (4 onglets : Best-sellers / Mariage / Vidéo / Administrative)</h2>
        <p style={{ color: "#5a6580", fontSize: 13, margin: "0 0 12px" }}>
          Choisissez l&apos;onglet pour chaque produit. Les produits sans onglet correspondant n&apos;apparaîtront pas.
        </p>
        <AdminEditor<PhotoProduct[]> section="products-photo" initial={photo.products} schema={PRODUCT_SCHEMA}
          isList newItem={NEW_PRODUCT} labelTemplate="{i}. [{tab}] {name}" />
      </div>

      <div className="admin-card"><h2>Carrousel Meilleures Ventes</h2>
        <AdminEditor<BestsellerSlide[]> section="bestsellers-photo" initial={photo.bestsellers} schema={BESTSELLER_SCHEMA}
          isList newItem={NEW_BESTSELLER} labelTemplate="Diapositive {i} — « {h1Highlight} »" />
      </div>

      <div className="admin-card"><h2>Processus de travail (étapes)</h2>
        <AdminEditor<ProcessStep[]> section="process-photo" initial={photo.process} schema={PROCESS_SCHEMA}
          isList newItem={NEW_PROCESS} labelTemplate="Étape {i} — {title}" />
      </div>
    </>
  );
}
