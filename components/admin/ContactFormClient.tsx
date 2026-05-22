"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactConfig } from "@/lib/content-types";

export default function ContactFormClient({ initial }: { initial: ContactConfig }) {
  const router = useRouter();
  const [state, setState] = useState<ContactConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  async function save() {
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "contact", data: state }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || `HTTP ${res.status}`);
      setFlash({ kind: "ok", msg: "Modifications enregistrées." });
      router.refresh();
    } catch (e) {
      setFlash({ kind: "err", msg: `Échec : ${(e as Error).message}` });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {flash && <div className={flash.kind === "ok" ? "admin-flash" : "admin-login-error"}>{flash.msg}</div>}

      <div className="admin-card">
        <h2>Horaires affichés</h2>
        <div className="admin-form">
          <div className="admin-field">
            <label>Horaires sur la page Impression</label>
            <input type="text" value={state.hoursPrint} onChange={(e) => setState({ ...state, hoursPrint: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Horaires sur la page Photographie</label>
            <input type="text" value={state.hoursPhoto} onChange={(e) => setState({ ...state, hoursPhoto: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Types de services dans le menu déroulant</h2>
        <p style={{ color: "#5a6580", fontSize: 13, margin: "0 0 14px" }}>
          Un service par ligne. Ces options apparaissent dans le champ « Type de service » du formulaire de contact.
        </p>
        <div className="admin-form">
          <div className="admin-field">
            <label>Services — Impression</label>
            <textarea
              rows={10}
              value={state.servicesPrint.join("\n")}
              onChange={(e) =>
                setState({ ...state, servicesPrint: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
          <div className="admin-field">
            <label>Services — Photographie</label>
            <textarea
              rows={10}
              value={state.servicesPhoto.join("\n")}
              onChange={(e) =>
                setState({ ...state, servicesPhoto: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button type="button" className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          <i className={saving ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-floppy-disk"} />
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </>
  );
}
