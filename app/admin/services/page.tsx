import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { services } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAuth();
  return (
    <>
      <div className="admin-page-head">
        <h1>Pages services / blog</h1>
        <span className="crumb"><Link href="/admin">Admin</Link> / Services</span>
      </div>
      <div className="admin-card">
        <p>Liste des {services.length} pages de service / blog. Cliquez sur une page pour modifier son contenu (titre, hero, sections, article complet, FAQ, CTA).</p>
      </div>
      <div className="admin-grid">
        {services.map((s) => (
          <Link key={s.slug} href={`/admin/services/${s.slug}`} className="admin-tile">
            <i className={s.tagIcon} />
            <strong>{s.tag}</strong>
            <span>/{s.slug} · {s.variant === "dark" ? "Article" : "Light"} · {s.category}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
