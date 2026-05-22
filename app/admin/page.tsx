import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { services } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAuth();
  const site = await readContent();

  const tiles = [
    { href: "/admin/settings", icon: "fa-solid fa-sliders", title: "Paramètres du site", desc: "Logo, contact, réseaux sociaux, WhatsApp" },
    { href: "/admin/landing", icon: "fa-solid fa-house", title: "Page d'accueil", desc: "Panneaux Impression / Photographie, vidéos, textes" },
    { href: "/admin/hero-print", icon: "fa-solid fa-images", title: "Hero · Impression", desc: `${site.print.heroSlides.length} diapositive(s)` },
    { href: "/admin/hero-photo", icon: "fa-solid fa-camera", title: "Hero · Photo", desc: `${site.photo.heroSlides.length} diapositive(s)` },
    { href: "/admin/print-sections", icon: "fa-solid fa-print", title: "Page Impression — sections", desc: "Featured, catégories, processus, bestsellers" },
    { href: "/admin/photo-sections", icon: "fa-solid fa-camera-retro", title: "Page Photographie — sections", desc: "Featured, catégories, produits 4 onglets, processus" },
    { href: "/admin/products", icon: "fa-solid fa-box", title: "Produits — Meilleures Ventes (Impression)", desc: `${site.print.products.length} produit(s)` },
    { href: "/admin/reviews-print", icon: "fa-solid fa-star", title: "Avis · Impression", desc: `${site.print.reviews.length} avis` },
    { href: "/admin/reviews-photo", icon: "fa-solid fa-star", title: "Avis · Photo", desc: `${site.photo.reviews.length} avis` },
    { href: "/admin/about", icon: "fa-solid fa-circle-info", title: "À propos", desc: "Section À propos (les 2 pages)" },
    { href: "/admin/contact", icon: "fa-solid fa-envelope", title: "Section Contact", desc: "Horaires, liste des services du formulaire" },
    { href: "/admin/services", icon: "fa-solid fa-newspaper", title: "Pages services / blog", desc: `${services.length} pages éditables` },
  ];

  return (
    <>
      <div className="admin-page-head">
        <h1>Tableau de bord</h1>
        <span className="crumb"><Link href="/">Site</Link> / Admin</span>
      </div>
      <div className="admin-card">
        <p>
          Bienvenue dans le panneau d&apos;administration. Chaque tuile ouvre l&apos;éditeur d&apos;une section du site.
          Les modifications sont enregistrées dans <code>content/site.json</code> ou <code>content/services.json</code> et publiées immédiatement.
        </p>
      </div>
      <div className="admin-grid">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="admin-tile">
            <i className={t.icon} />
            <strong>{t.title}</strong>
            <span>{t.desc}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
