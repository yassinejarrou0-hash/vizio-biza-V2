"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props<T> {
  section: string;
  initial: T;
  schema: FieldSchema<T>;
  isList?: boolean;
  /** Template for a new list item. Plain object — must be serializable (no functions). */
  newItem?: T extends Array<infer U> ? U : never;
  /** Label template with `{i}` and `{field}` placeholders, e.g. "Diapositive {i} — « {h1Highlight} »". */
  labelTemplate?: string;
}

function formatLabel(template: string, item: Record<string, unknown>, i: number): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (key === "i") return String(i + 1);
    const v = item[key];
    return v == null || v === "" ? "" : String(v);
  }).replace(/\s+—\s*«\s*»\s*$/, "").trim();
}

export type FieldType =
  | { kind: "text"; label: string; placeholder?: string }
  | { kind: "textarea"; label: string; rows?: number; placeholder?: string }
  | { kind: "image"; label: string; placeholder?: string }
  | { kind: "number"; label: string; min?: number; max?: number }
  | { kind: "select"; label: string; options: { value: string; label: string }[] }
  | { kind: "checkbox"; label: string };

export type FieldSchema<T> = T extends Array<infer U>
  ? Record<keyof U, FieldType>
  : Record<keyof T, FieldType>;

export default function AdminEditor<T extends object | unknown[]>({
  section,
  initial,
  schema,
  isList,
  newItem,
  labelTemplate,
}: Props<T>) {
  const router = useRouter();
  const [state, setState] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  async function onSave() {
    setSaving(true);
    setFlash(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: state }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setFlash({ kind: "ok", msg: "Modifications enregistrées." });
      router.refresh();
    } catch (e) {
      setFlash({ kind: "err", msg: `Échec : ${(e as Error).message}` });
    } finally {
      setSaving(false);
    }
  }

  if (isList) {
    const list = state as unknown as Record<string, unknown>[];
    const addItem = () => {
      if (!newItem) return;
      // Deep-clone the template so each new item is independent.
      const clone = JSON.parse(JSON.stringify(newItem as object));
      setState([...(list as unknown[]), clone] as unknown as T);
    };
    const removeItem = (i: number) => {
      setState(list.filter((_, idx) => idx !== i) as unknown as T);
    };
    const move = (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return;
      const copy = list.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      setState(copy as unknown as T);
    };
    const updateItem = (i: number, key: string, value: unknown) => {
      const copy = list.slice();
      copy[i] = { ...copy[i], [key]: value };
      setState(copy as unknown as T);
    };

    return (
      <>
        {flash && <div className={flash.kind === "ok" ? "admin-flash" : "admin-login-error"}>{flash.msg}</div>}
        {list.length === 0 && (
          <div className="admin-empty">Aucun élément. Ajoutez-en un ci-dessous.</div>
        )}
        {list.map((item, i) => (
          <div className="admin-item" key={i}>
            <div className="admin-item-head">
              <strong>
                {labelTemplate ? formatLabel(labelTemplate, item, i) : `Élément #${i + 1}`}
              </strong>
              <div className="admin-item-actions">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Monter">
                  <i className="fa-solid fa-arrow-up" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} title="Descendre">
                  <i className="fa-solid fa-arrow-down" />
                </button>
                <button type="button" className="ai-del" onClick={() => removeItem(i)} title="Supprimer">
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
            <FieldsRenderer
              value={item}
              schema={schema as unknown as Record<string, FieldType>}
              onChange={(k, v) => updateItem(i, k, v)}
            />
          </div>
        ))}
        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={addItem}>
            <i className="fa-solid fa-plus" /> Ajouter un élément
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={onSave} disabled={saving}>
            <i className={saving ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-floppy-disk"} />
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {flash && <div className={flash.kind === "ok" ? "admin-flash" : "admin-login-error"}>{flash.msg}</div>}
      <FieldsRenderer
        value={state as unknown as Record<string, unknown>}
        schema={schema as unknown as Record<string, FieldType>}
        onChange={(k, v) => setState({ ...(state as object), [k]: v } as T)}
      />
      <div className="admin-actions">
        <button type="button" className="admin-btn admin-btn-primary" onClick={onSave} disabled={saving}>
          <i className={saving ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-floppy-disk"} />
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </>
  );
}

function FieldsRenderer({
  value,
  schema,
  onChange,
}: {
  value: Record<string, unknown>;
  schema: Record<string, FieldType>;
  onChange: (key: string, value: unknown) => void;
}) {
  const entries = Object.entries(schema);
  return (
    <div className="admin-form">
      {entries.map(([key, field]) => (
        <Field key={key} k={key} field={field} value={value[key]} onChange={(v) => onChange(key, v)} />
      ))}
    </div>
  );
}

function Field({
  k,
  field,
  value,
  onChange,
}: {
  k: string;
  field: FieldType;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `f-${k}`;
  switch (field.kind) {
    case "text":
      return (
        <div className="admin-field">
          <label htmlFor={id}>{field.label}</label>
          <input
            id={id}
            type="text"
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case "textarea":
      return (
        <div className="admin-field">
          <label htmlFor={id}>{field.label}</label>
          <textarea
            id={id}
            rows={field.rows ?? 4}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case "image": {
      const url = String(value ?? "");
      return (
        <div className="admin-field">
          <label htmlFor={id}>{field.label}</label>
          <input
            id={id}
            type="text"
            value={url}
            placeholder={field.placeholder || "https://res.cloudinary.com/…"}
            onChange={(e) => onChange(e.target.value)}
          />
          {url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={url} alt="" className="admin-thumb" style={{ marginTop: 6 }} />
          )}
        </div>
      );
    }
    case "number":
      return (
        <div className="admin-field">
          <label htmlFor={id}>{field.label}</label>
          <input
            id={id}
            type="number"
            min={field.min}
            max={field.max}
            value={Number(value ?? 0)}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      );
    case "select":
      return (
        <div className="admin-field">
          <label htmlFor={id}>{field.label}</label>
          <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "checkbox":
      return (
        <div className="admin-field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          <label htmlFor={id} style={{ textTransform: "none", fontSize: 13 }}>{field.label}</label>
        </div>
      );
  }
}
