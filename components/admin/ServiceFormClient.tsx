"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceData, ArticleBlock, FAQ, Related, SubService, WhyItem, Spec } from "@/lib/content-types";

type Patch<T> = (p: Partial<T>) => void;

export default function ServiceFormClient({ initial }: { initial: ServiceData }) {
  const router = useRouter();
  const [s, setS] = useState<ServiceData>(initial);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const patch: Patch<ServiceData> = (p) => setS((v) => ({ ...v, ...p }));

  async function save() {
    setSaving(true); setFlash(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "service", slug: initial.slug, data: s }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || `HTTP ${res.status}`);
      setFlash({ kind: "ok", msg: "Service enregistré." });
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
        <h2>Méta-données &amp; SEO</h2>
        <div className="admin-form">
          <div className="admin-field">
            <label>Slug (URL) — non modifiable</label>
            <input type="text" value={s.slug} disabled />
          </div>
          <div className="admin-field">
            <label>Titre (balise &lt;title&gt;)</label>
            <input type="text" value={s.title} onChange={(e) => patch({ title: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Description méta (SEO)</label>
            <textarea rows={3} value={s.metaDescription} onChange={(e) => patch({ metaDescription: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Image OpenGraph (URL)</label>
            <input type="text" value={s.ogImage} onChange={(e) => patch({ ogImage: e.target.value })} />
            {s.ogImage && <img src={s.ogImage} alt="" className="admin-thumb" style={{ marginTop: 6 }} />}
          </div>
          <div className="admin-field-row">
            <div className="admin-field">
              <label>Catégorie</label>
              <select value={s.category} onChange={(e) => patch({ category: e.target.value as "impression" | "photographie" })}>
                <option value="impression">Impression</option>
                <option value="photographie">Photographie</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Mise en page (variant)</label>
              <select value={s.variant} onChange={(e) => patch({ variant: e.target.value as "dark" | "light" })}>
                <option value="light">Light (sections)</option>
                <option value="dark">Dark (article)</option>
              </select>
            </div>
          </div>
          <div className="admin-field-row">
            <div className="admin-field">
              <label>Page parente — URL</label>
              <input type="text" value={s.parentPath} onChange={(e) => patch({ parentPath: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Page parente — libellé</label>
              <input type="text" value={s.parentLabel} onChange={(e) => patch({ parentLabel: e.target.value })} />
            </div>
          </div>
          <div className="admin-field">
            <label>Temps de lecture (optionnel)</label>
            <input type="text" value={s.readTime || ""} onChange={(e) => patch({ readTime: e.target.value })} placeholder="ex. 7 min de lecture" />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Hero (en-tête de la page)</h2>
        <div className="admin-form">
          <div className="admin-field">
            <label>Image hero (URL)</label>
            <input type="text" value={s.heroImage} onChange={(e) => patch({ heroImage: e.target.value })} />
            {s.heroImage && <img src={s.heroImage} alt="" className="admin-thumb" style={{ marginTop: 6 }} />}
          </div>
          <div className="admin-field-row">
            <div className="admin-field">
              <label>Tag (texte au-dessus du titre)</label>
              <input type="text" value={s.tag} onChange={(e) => patch({ tag: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Icône tag (Font Awesome)</label>
              <input type="text" value={s.tagIcon} onChange={(e) => patch({ tagIcon: e.target.value })} />
            </div>
          </div>
          <div className="admin-field">
            <label>Titre principal</label>
            <input type="text" value={s.heroTitle} onChange={(e) => patch({ heroTitle: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Titre — partie en italique doré (optionnel)</label>
            <input type="text" value={s.heroTitleItalic || ""} onChange={(e) => patch({ heroTitleItalic: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Sous-titre</label>
            <textarea rows={3} value={s.heroSubtitle} onChange={(e) => patch({ heroSubtitle: e.target.value })} />
          </div>
        </div>
      </div>

      {s.light && (
        <LightSections light={s.light} onChange={(light) => patch({ light })} />
      )}

      {s.article && (
        <ArticleSections article={s.article} onChange={(article) => patch({ article })} />
      )}

      <div className="admin-actions">
        <button type="button" className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          <i className={saving ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-floppy-disk"} />
          {saving ? "Enregistrement…" : "Enregistrer le service"}
        </button>
      </div>
    </>
  );
}

/* ─── LIGHT VARIANT SECTIONS ─────────────────────────────────────────────── */

type Light = NonNullable<ServiceData["light"]>;

function LightSections({ light, onChange }: { light: Light; onChange: (next: Light) => void }) {
  const patch = (p: Partial<Light>) => onChange({ ...light, ...p });
  return (
    <>
      <div className="admin-card">
        <h2>Bandeau (stamp) &amp; bullets</h2>
        <div className="admin-form">
          <div className="admin-field-row">
            <div className="admin-field">
              <label>Stamp — valeur (optionnel)</label>
              <input type="text" value={light.stamp?.value || ""} onChange={(e) => patch({ stamp: { value: e.target.value, label: light.stamp?.label || "" } })} />
            </div>
            <div className="admin-field">
              <label>Stamp — étiquette</label>
              <input type="text" value={light.stamp?.label || ""} onChange={(e) => patch({ stamp: { value: light.stamp?.value || "", label: e.target.value } })} />
            </div>
          </div>
          <ListEditor<{ icon: string; label: string }>
            label="Bullets (à droite du hero)"
            items={light.bullets}
            onChange={(bullets) => patch({ bullets })}
            blank={{ icon: "fa-solid fa-medal", label: "Nouveau" }}
            row={(b, i, set) => (
              <>
                <div className="admin-field"><label>Icône #{i + 1}</label><input type="text" value={b.icon} onChange={(e) => set({ icon: e.target.value })} /></div>
                <div className="admin-field"><label>Texte #{i + 1}</label><input type="text" value={b.label} onChange={(e) => set({ label: e.target.value })} /></div>
              </>
            )}
          />
        </div>
      </div>

      <div className="admin-card">
        <h2>Sous-services</h2>
        <div className="admin-form">
          <div className="admin-field"><label>Titre de la section</label><input type="text" value={light.subsTitle} onChange={(e) => patch({ subsTitle: e.target.value })} /></div>
          <div className="admin-field"><label>Sous-titre (optionnel)</label><textarea rows={2} value={light.subsSubtitle || ""} onChange={(e) => patch({ subsSubtitle: e.target.value })} /></div>
          <ListEditor<SubService>
            label="Liste des sous-services"
            items={light.subs}
            onChange={(subs) => patch({ subs })}
            blank={{ icon: "fa-solid fa-star", title: "Nouveau", description: "" }}
            row={(it, i, set) => (
              <>
                <div className="admin-field"><label>Icône #{i + 1}</label><input type="text" value={it.icon} onChange={(e) => set({ icon: e.target.value })} /></div>
                <div className="admin-field"><label>Titre #{i + 1}</label><input type="text" value={it.title} onChange={(e) => set({ title: e.target.value })} /></div>
                <div className="admin-field" style={{ gridColumn: "1 / -1" }}><label>Description #{i + 1}</label><textarea rows={2} value={it.description} onChange={(e) => set({ description: e.target.value })} /></div>
              </>
            )}
          />
        </div>
      </div>

      <div className="admin-card">
        <h2>Pourquoi nous choisir</h2>
        <div className="admin-form">
          <div className="admin-field"><label>Titre de la section</label><input type="text" value={light.whyTitle} onChange={(e) => patch({ whyTitle: e.target.value })} /></div>
          <ListEditor<WhyItem>
            label="Raisons"
            items={light.whyItems}
            onChange={(whyItems) => patch({ whyItems })}
            blank={{ icon: "fa-solid fa-medal", title: "Nouvelle raison", description: "" }}
            row={(it, i, set) => (
              <>
                <div className="admin-field"><label>Icône #{i + 1}</label><input type="text" value={it.icon} onChange={(e) => set({ icon: e.target.value })} /></div>
                <div className="admin-field"><label>Titre #{i + 1}</label><input type="text" value={it.title} onChange={(e) => set({ title: e.target.value })} /></div>
                <div className="admin-field" style={{ gridColumn: "1 / -1" }}><label>Description #{i + 1}</label><textarea rows={2} value={it.description} onChange={(e) => set({ description: e.target.value })} /></div>
              </>
            )}
          />
        </div>
      </div>

      <div className="admin-card">
        <h2>Services associés</h2>
        <div className="admin-form">
          <div className="admin-field"><label>Titre de la section</label><input type="text" value={light.relatedTitle} onChange={(e) => patch({ relatedTitle: e.target.value })} /></div>
          <ListEditor<Related>
            label="Cartes liées (3 conseillées)"
            items={light.relatedItems}
            onChange={(relatedItems) => patch({ relatedItems })}
            blank={{ slug: "", title: "", description: "", image: "" }}
            row={(it, i, set) => (
              <>
                <div className="admin-field"><label>Slug #{i + 1}</label><input type="text" value={it.slug} onChange={(e) => set({ slug: e.target.value })} /></div>
                <div className="admin-field"><label>Titre #{i + 1}</label><input type="text" value={it.title} onChange={(e) => set({ title: e.target.value })} /></div>
                <div className="admin-field"><label>Description #{i + 1}</label><input type="text" value={it.description} onChange={(e) => set({ description: e.target.value })} /></div>
                <div className="admin-field"><label>Image #{i + 1}</label><input type="text" value={it.image} onChange={(e) => set({ image: e.target.value })} /></div>
              </>
            )}
          />
        </div>
      </div>

      <div className="admin-card">
        <h2>CTA final (bandeau d&apos;appel à l&apos;action)</h2>
        <div className="admin-form">
          <div className="admin-field-row">
            <div className="admin-field"><label>Titre — début</label><input type="text" value={light.ctaTitle} onChange={(e) => patch({ ctaTitle: e.target.value })} /></div>
            <div className="admin-field"><label>Titre — partie italique (optionnel)</label><input type="text" value={light.ctaTitleItalic || ""} onChange={(e) => patch({ ctaTitleItalic: e.target.value })} /></div>
          </div>
          <div className="admin-field"><label>Sous-titre</label><textarea rows={3} value={light.ctaSubtitle} onChange={(e) => patch({ ctaSubtitle: e.target.value })} /></div>
        </div>
      </div>
    </>
  );
}

/* ─── DARK ARTICLE SECTIONS ──────────────────────────────────────────────── */

type Article = NonNullable<ServiceData["article"]>;

function ArticleSections({ article, onChange }: { article: Article; onChange: (next: Article) => void }) {
  const patch = (p: Partial<Article>) => onChange({ ...article, ...p });
  return (
    <>
      <div className="admin-card">
        <h2>Article — corps de la page</h2>
        <ArticleBlocksEditor blocks={article.blocks} onChange={(blocks) => patch({ blocks })} />
      </div>

      <div className="admin-card">
        <h2>FAQ</h2>
        <ListEditor<FAQ>
          label="Questions fréquentes"
          items={article.faqs}
          onChange={(faqs) => patch({ faqs })}
          blank={{ q: "Nouvelle question ?", a: "" }}
          row={(f, i, set) => (
            <>
              <div className="admin-field" style={{ gridColumn: "1 / -1" }}><label>Question #{i + 1}</label><input type="text" value={f.q} onChange={(e) => set({ q: e.target.value })} /></div>
              <div className="admin-field" style={{ gridColumn: "1 / -1" }}><label>Réponse #{i + 1} (HTML autorisé)</label><textarea rows={4} value={f.a} onChange={(e) => set({ a: e.target.value })} /></div>
            </>
          )}
        />
      </div>

      <div className="admin-card">
        <h2>Articles liés (3 conseillés)</h2>
        <ListEditor<Related>
          label="Cartes liées"
          items={article.related}
          onChange={(related) => patch({ related })}
          blank={{ slug: "", title: "", description: "", image: "" }}
          row={(it, i, set) => (
            <>
              <div className="admin-field"><label>Slug #{i + 1}</label><input type="text" value={it.slug} onChange={(e) => set({ slug: e.target.value })} /></div>
              <div className="admin-field"><label>Titre #{i + 1}</label><input type="text" value={it.title} onChange={(e) => set({ title: e.target.value })} /></div>
              <div className="admin-field"><label>Description #{i + 1}</label><input type="text" value={it.description} onChange={(e) => set({ description: e.target.value })} /></div>
              <div className="admin-field"><label>Image #{i + 1}</label><input type="text" value={it.image} onChange={(e) => set({ image: e.target.value })} /></div>
            </>
          )}
        />
      </div>

      <div className="admin-card">
        <h2>CTA final</h2>
        <div className="admin-form">
          <div className="admin-field"><label>Titre</label><input type="text" value={article.ctaTitle} onChange={(e) => patch({ ctaTitle: e.target.value })} /></div>
          <div className="admin-field"><label>Sous-titre</label><textarea rows={3} value={article.ctaSubtitle} onChange={(e) => patch({ ctaSubtitle: e.target.value })} /></div>
        </div>
      </div>
    </>
  );
}

/* ─── ARTICLE BLOCKS EDITOR (per-block) ──────────────────────────────────── */

const BLOCK_LABELS: Record<ArticleBlock["type"], string> = {
  h2: "Titre H2", h3: "Sous-titre H3", p: "Paragraphe", ul: "Liste à puces",
  ol: "Liste numérotée", highlight: "Encadré mis en valeur", image: "Image", specs: "Spécifications (icônes)",
};

function blank(type: ArticleBlock["type"]): ArticleBlock {
  switch (type) {
    case "h2": return { type: "h2", text: "Nouveau titre" };
    case "h3": return { type: "h3", text: "Nouveau sous-titre" };
    case "p": return { type: "p", html: "" };
    case "ul": return { type: "ul", items: [""] };
    case "ol": return { type: "ol", items: [""] };
    case "highlight": return { type: "highlight", html: "" };
    case "image": return { type: "image", src: "", alt: "" };
    case "specs": return { type: "specs", items: [{ icon: "fa-solid fa-star", title: "", value: "" }] };
  }
}

function ArticleBlocksEditor({ blocks, onChange }: { blocks: ArticleBlock[]; onChange: (b: ArticleBlock[]) => void }) {
  const [pickerType, setPickerType] = useState<ArticleBlock["type"]>("p");

  const update = (i: number, next: ArticleBlock) => onChange(blocks.map((b, idx) => (idx === i ? next : b)));
  const remove = (i: number) => onChange(blocks.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const copy = blocks.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const add = () => onChange([...blocks, blank(pickerType)]);

  return (
    <>
      {blocks.length === 0 && <div className="admin-empty">Aucun bloc. Ajoutez-en un ci-dessous.</div>}
      {blocks.map((b, i) => (
        <div className="admin-item" key={i}>
          <div className="admin-item-head">
            <strong>Bloc #{i + 1} — {BLOCK_LABELS[b.type]}</strong>
            <div className="admin-item-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}><i className="fa-solid fa-arrow-up" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1}><i className="fa-solid fa-arrow-down" /></button>
              <button type="button" className="ai-del" onClick={() => remove(i)}><i className="fa-solid fa-trash" /></button>
            </div>
          </div>
          <BlockEditor block={b} onChange={(nb) => update(i, nb)} />
        </div>
      ))}
      <div className="admin-actions">
        <select value={pickerType} onChange={(e) => setPickerType(e.target.value as ArticleBlock["type"])}
          style={{ padding: "9px 12px", border: "1px solid #d8dce6", borderRadius: 7, background: "#fff", font: "inherit", fontSize: 13.5 }}>
          {(Object.keys(BLOCK_LABELS) as Array<ArticleBlock["type"]>).map((t) => <option key={t} value={t}>{BLOCK_LABELS[t]}</option>)}
        </select>
        <button type="button" className="admin-btn admin-btn-secondary" onClick={add}>
          <i className="fa-solid fa-plus" /> Ajouter ce bloc
        </button>
      </div>
    </>
  );
}

function BlockEditor({ block, onChange }: { block: ArticleBlock; onChange: (b: ArticleBlock) => void }) {
  switch (block.type) {
    case "h2":
    case "h3":
      return (
        <div className="admin-field">
          <label>Texte du titre</label>
          <input type="text" value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
        </div>
      );
    case "p":
      return (
        <div className="admin-field">
          <label>Contenu HTML (vous pouvez utiliser &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;…)</label>
          <textarea rows={4} value={block.html} onChange={(e) => onChange({ ...block, html: e.target.value })} />
        </div>
      );
    case "highlight":
      return (
        <div className="admin-field">
          <label>Contenu HTML de l&apos;encadré</label>
          <textarea rows={3} value={block.html} onChange={(e) => onChange({ ...block, html: e.target.value })} />
        </div>
      );
    case "ul":
    case "ol":
      return (
        <div className="admin-field">
          <label>Items (un par ligne, HTML autorisé)</label>
          <textarea rows={6} value={block.items.join("\n")} onChange={(e) => onChange({ ...block, items: e.target.value.split("\n") })} />
        </div>
      );
    case "image":
      return (
        <div className="admin-form">
          <div className="admin-field"><label>URL de l&apos;image</label><input type="text" value={block.src} onChange={(e) => onChange({ ...block, src: e.target.value })} />{block.src && <img src={block.src} alt="" className="admin-thumb" style={{ marginTop: 6 }} />}</div>
          <div className="admin-field-row">
            <div className="admin-field"><label>Texte alternatif</label><input type="text" value={block.alt} onChange={(e) => onChange({ ...block, alt: e.target.value })} /></div>
            <div className="admin-field"><label>Légende (optionnel)</label><input type="text" value={block.caption || ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} /></div>
          </div>
        </div>
      );
    case "specs": {
      const items = block.items;
      const upd = (i: number, p: Partial<Spec>) => onChange({ ...block, items: items.map((s, idx) => (idx === i ? { ...s, ...p } : s)) });
      const rm = (i: number) => onChange({ ...block, items: items.filter((_, idx) => idx !== i) });
      const add = () => onChange({ ...block, items: [...items, { icon: "fa-solid fa-star", title: "", value: "" }] });
      return (
        <div className="admin-form">
          {items.map((s, i) => (
            <div key={i} style={{ borderTop: i === 0 ? 0 : "1px dashed #e0e3ee", paddingTop: i === 0 ? 0 : 10 }}>
              <div className="admin-field-row">
                <div className="admin-field"><label>Icône #{i + 1}</label><input type="text" value={s.icon} onChange={(e) => upd(i, { icon: e.target.value })} /></div>
                <div className="admin-field"><label>Titre #{i + 1}</label><input type="text" value={s.title} onChange={(e) => upd(i, { title: e.target.value })} /></div>
              </div>
              <div className="admin-field"><label>Valeur #{i + 1}</label><input type="text" value={s.value} onChange={(e) => upd(i, { value: e.target.value })} /></div>
              <button type="button" className="admin-btn admin-btn-danger" style={{ marginTop: 4 }} onClick={() => rm(i)}>
                <i className="fa-solid fa-trash" /> Supprimer cette spec
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn-secondary" onClick={add}>
            <i className="fa-solid fa-plus" /> Ajouter une spec
          </button>
        </div>
      );
    }
  }
}

/* ─── GENERIC LIST EDITOR ─────────────────────────────────────────────────── */

function ListEditor<T>({
  label, items, onChange, blank, row,
}: {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  blank: T;
  row: (item: T, i: number, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const update = (i: number, patch: Partial<T>) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = items.slice();
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  const add = () => onChange([...items, JSON.parse(JSON.stringify(blank))]);

  return (
    <div className="admin-field" style={{ marginTop: 8 }}>
      <label>{label}</label>
      {items.length === 0 && <div className="admin-empty" style={{ marginTop: 6 }}>Aucun élément.</div>}
      {items.map((it, i) => (
        <div key={i} className="admin-item">
          <div className="admin-item-head">
            <strong>#{i + 1}</strong>
            <div className="admin-item-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}><i className="fa-solid fa-arrow-up" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}><i className="fa-solid fa-arrow-down" /></button>
              <button type="button" className="ai-del" onClick={() => remove(i)}><i className="fa-solid fa-trash" /></button>
            </div>
          </div>
          <div className="admin-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {row(it, i, (patch) => update(i, patch))}
          </div>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn-secondary" onClick={add} style={{ marginTop: 6 }}>
        <i className="fa-solid fa-plus" /> Ajouter
      </button>
    </div>
  );
}
