"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LandingConfig, LandingPanel } from "@/lib/content-types";

export default function LandingFormClient({ initial }: { initial: LandingConfig }) {
  const router = useRouter();
  const [state, setState] = useState<LandingConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const setPanel = (which: "print" | "photo", patch: Partial<LandingPanel>) =>
    setState((s) => ({ ...s, [which]: { ...s[which], ...patch } }));

  async function save() {
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "landing", data: state }),
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

      {(["print", "photo"] as const).map((which) => {
        const panel = state[which];
        return (
          <div key={which} className="admin-card">
            <h2>{which === "print" ? "Panneau Impression" : "Panneau Photographie"}</h2>
            <div className="admin-form">
              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Titre (ligne 1)</label>
                  <input type="text" value={panel.title} onChange={(e) => setPanel(which, { title: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label>Titre (ligne 2)</label>
                  <input type="text" value={panel.titleLine2} onChange={(e) => setPanel(which, { titleLine2: e.target.value })} />
                </div>
              </div>
              <div className="admin-field">
                <label>URL vidéo de fond (mp4)</label>
                <input type="text" value={panel.videoSrc} onChange={(e) => setPanel(which, { videoSrc: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Mots animés du typewriter (un par ligne)</label>
                <textarea
                  rows={6}
                  value={panel.typewriterWords.join("\n")}
                  onChange={(e) =>
                    setPanel(which, {
                      typewriterWords: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="admin-field-row">
                <div className="admin-field">
                  <label>Texte du bouton</label>
                  <input type="text" value={panel.btnLabel} onChange={(e) => setPanel(which, { btnLabel: e.target.value })} />
                </div>
                <div className="admin-field">
                  <label>URL de destination</label>
                  <input type="text" value={panel.href} onChange={(e) => setPanel(which, { href: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="admin-actions">
        <button type="button" className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          <i className={saving ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-floppy-disk"} />
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </>
  );
}
