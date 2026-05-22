"use client";
import type { ContactConfig, Settings } from "@/lib/content-types";

interface Props {
  variant: "printing" | "photography";
  contact: ContactConfig;
  settings: Settings;
}

export default function ContactSection({ variant, contact, settings }: Props) {
  const services = variant === "printing" ? contact.servicesPrint : contact.servicesPhoto;
  const hours = variant === "printing" ? contact.hoursPrint : contact.hoursPhoto;
  const titlePrefix = variant === "printing" ? "Demande de devis — " : "Demande de réservation — ";
  const fallbackService = variant === "printing" ? "Impression" : "Photographie";

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const get = (n: string) => (f.elements.namedItem(n) as HTMLInputElement)?.value.trim() || "";
    const service = get("service") || fallbackService;
    const lines = [
      `*${titlePrefix}${service}*`,
      "",
      `👤 *Nom :* ${get("name")}`,
      `📧 *Email :* ${get("email") || "—"}`,
      `📱 *Téléphone :* ${get("phone") || "—"}`,
      `🛠️ *Service :* ${service}`,
      "",
      "📝 *Projet :*",
      get("message"),
      "",
      `— Envoyé depuis ${settings.url}`,
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${settings.whatsappPhone}?text=${text}`, "_blank", "noopener");
  };

  return (
    <section style={{ padding: "70px 0", background: "#fff", borderTop: "1px solid var(--rule)" }} id="contact">
      <div className="container">
        <div className="section-head center reveal">
          <small>{variant === "printing" ? "Devis personnalisé" : "Réservation de séance"}</small>
          <h2>Contactez<span>-nous</span></h2>
          <p>Une équipe d&apos;experts à votre écoute. {variant === "printing" ? "Devis sous 24h, sans engagement." : "Réponse sous quelques heures, sans engagement."}</p>
        </div>
        <div className="contact-row" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 40, maxWidth: 1080, margin: "0 auto" }}>
          <div>
            <ul style={{ listStyle: "none", display: "grid", gap: 14 }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: 18, background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--rule)" }}>
                <span style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--green)", color: "var(--gold)", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 14 }}><i className="fa-regular fa-envelope"></i></span>
                <div><strong style={{ display: "block", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 3 }}>Email</strong><a href={`mailto:${settings.email}`} style={{ color: "var(--ink)", fontSize: 13.5 }}>{settings.email}</a></div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: 18, background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--rule)" }}>
                <span style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--green)", color: "var(--gold)", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 14 }}><i className="fa-solid fa-location-dot"></i></span>
                <div><strong style={{ display: "block", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 3 }}>Adresse</strong><span style={{ color: "var(--ink)", fontSize: 13.5 }}>{settings.address}</span></div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: 18, background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--rule)" }}>
                <span style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--green)", color: "var(--gold)", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 14 }}><i className="fa-regular fa-clock"></i></span>
                <div><strong style={{ display: "block", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 3 }}>Horaires</strong><span style={{ color: "var(--ink)", fontSize: 13.5 }}>{hours}</span></div>
              </li>
            </ul>
          </div>
          <form onSubmit={submit} style={{ background: "var(--bg-soft)", padding: 30, borderRadius: "var(--radius-md)", border: "1px solid var(--rule)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <input type="text" name="name" placeholder="Votre nom *" required style={{ padding: "13px 16px", border: "1px solid var(--rule)", background: "#fff", font: "inherit", fontSize: 13.5, borderRadius: "var(--radius)" }} />
              <input type="email" name="email" placeholder="Votre email *" required style={{ padding: "13px 16px", border: "1px solid var(--rule)", background: "#fff", font: "inherit", fontSize: 13.5, borderRadius: "var(--radius)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <input type="tel" name="phone" placeholder="Téléphone" style={{ padding: "13px 16px", border: "1px solid var(--rule)", background: "#fff", font: "inherit", fontSize: 13.5, borderRadius: "var(--radius)" }} />
              <select name="service" required defaultValue="" style={{ padding: "13px 16px", border: "1px solid var(--rule)", background: "#fff", font: "inherit", fontSize: 13.5, borderRadius: "var(--radius)", color: "var(--ink-2)" }}>
                <option value="">Type de service *</option>
                {services.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <textarea name="message" placeholder={variant === "printing" ? "Décrivez votre projet, quantités, format, délais souhaités…" : "Décrivez votre besoin (mariage, événement, portrait, vidéo…), date approximative…"} required style={{ width: "100%", padding: "13px 16px", border: "1px solid var(--rule)", background: "#fff", font: "inherit", fontSize: 13.5, borderRadius: "var(--radius)", minHeight: 130, resize: "vertical", marginBottom: 14 }}></textarea>
            <button type="submit" className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: 16 }}>Envoyer la demande <i className="fa-solid fa-paper-plane btn-arrow"></i></button>
          </form>
        </div>
      </div>
      <style>{`@media(max-width:880px){.contact-row{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
