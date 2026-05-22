import type { Metadata } from "next";
import Link from "next/link";
import { isAuthed } from "@/lib/auth";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Studio Vizio Biza",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthed();

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <Link href="/admin" className="admin-brand">
          <i className="fa-solid fa-sliders" /> Studio Vizio Biza · Admin
        </Link>
        {authed && (
          <nav className="admin-nav">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/settings">Paramètres</Link>
            <Link href="/admin/landing">Accueil</Link>
            <Link href="/admin/print-sections">Print · sections</Link>
            <Link href="/admin/photo-sections">Photo · sections</Link>
            <Link href="/admin/services">Services / Blog</Link>
            <Link href="/admin/contact">Contact</Link>
          </nav>
        )}
        <div className="admin-top-right">
          <Link href="/" target="_blank" className="admin-link">
            <i className="fa-solid fa-arrow-up-right-from-square" /> Voir le site
          </Link>
          {authed && (
            <form action="/api/admin/logout" method="POST" style={{ display: "inline" }}>
              <button type="submit" className="admin-btn admin-btn-ghost">
                <i className="fa-solid fa-right-from-bracket" /> Déconnexion
              </button>
            </form>
          )}
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
