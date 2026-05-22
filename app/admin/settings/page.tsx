import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { readContent } from "@/lib/content";
import AdminEditor, { type FieldType } from "@/components/admin/AdminEditor";
import type { Settings } from "@/lib/content-types";

export const dynamic = "force-dynamic";

const SCHEMA: Record<keyof Settings, FieldType> = {
  name: { kind: "text", label: "Nom du studio" },
  location: { kind: "text", label: "Localisation (texte court)" },
  address: { kind: "text", label: "Adresse complète" },
  email: { kind: "text", label: "Email" },
  phone: { kind: "text", label: "Téléphone (affiché)", placeholder: "+212 6 17 10 98 52" },
  phoneRaw: { kind: "text", label: "Téléphone (lien tel:)", placeholder: "+212617109852" },
  whatsappPhone: { kind: "text", label: "Numéro WhatsApp (E.164 sans +)", placeholder: "212617109852" },
  whatsapp: { kind: "text", label: "Lien WhatsApp (api.whatsapp.com)", placeholder: "https://api.whatsapp.com/message/…" },
  hours: { kind: "text", label: "Horaires (texte court)" },
  facebook: { kind: "text", label: "URL Facebook" },
  instagram: { kind: "text", label: "URL Instagram" },
  tiktok: { kind: "text", label: "URL TikTok" },
  logo: { kind: "image", label: "URL du logo" },
  url: { kind: "text", label: "URL canonique du site" },
};

export default async function Page() {
  await requireAuth();
  const site = await readContent();
  return (
    <>
      <div className="admin-page-head">
        <h1>Paramètres du site</h1>
        <span className="crumb"><Link href="/admin">Admin</Link> / Paramètres</span>
      </div>
      <div className="admin-card">
        <p>Informations globales utilisées partout sur le site (topbar, header, footer, contact, WhatsApp flottant).</p>
      </div>
      <AdminEditor<Settings> section="settings" initial={site.settings} schema={SCHEMA} />
    </>
  );
}
