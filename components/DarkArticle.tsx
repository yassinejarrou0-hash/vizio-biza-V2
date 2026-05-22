"use client";
import { useState } from "react";
import Link from "next/link";
import Topbar from "./Topbar";
import Header from "./Header";
import CategoryNav from "./CategoryNav";
import MobileSearch from "./MobileSearch";
import Drawer from "./Drawer";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";
import Newsletter from "./Newsletter";
import ContactSection from "./ContactSection";
import RevealObserver from "./Reveal";
import type { ServiceData, ArticleBlock } from "@/lib/services";
import type { Settings, ContactConfig } from "@/lib/content-types";

export default function DarkArticle({ service, settings, contact }: { service: ServiceData; settings: Settings; contact: ContactConfig }) {
  const [drawer, setDrawer] = useState(false);
  if (!service.article) return null;
  const { article } = service;
  const isPrint = service.category === "impression";

  const navLinks = [
    { label: "Accueil", href: "/" },
    { label: "Impression", href: "/impression", active: isPrint },
    { label: "Photographie & Vidéo", href: "/photographie", active: !isPrint },
    { label: "Processus", href: "#processus" },
    { label: "Avis", href: "#avis" },
    { label: "Contact", href: "#contact" },
  ];

  const categories = isPrint ? [
    { label: "Impression Photo", href: "/services/impression-offset", icon: "fa-solid fa-image" },
    { label: "Sublimation & Personnalisation", href: "/services/sublimation", icon: "fa-solid fa-shirt" },
    { label: "Marketing & Publicitaire", href: "/services/impression-numerique", icon: "fa-solid fa-bullhorn" },
    { label: "Stickers & Vinyle", href: "/services/stickers-vinyle", icon: "fa-solid fa-pen-nib" },
    { label: "Grand Format", href: "/services/grand-format", icon: "fa-solid fa-square-poll-vertical" },
    { label: "Technique & Finition", href: "/services/finition-personnalisee", icon: "fa-solid fa-toolbox" },
    { label: "Design & Création", href: "/services/design-creation", icon: "fa-solid fa-palette" },
    { label: "Photographie & Vidéo", href: "/photographie", icon: "fa-solid fa-camera" },
  ] : [
    { label: "Photographie Professionnelle", href: "/services/photo-portrait", icon: "fa-solid fa-user" },
    { label: "Mariage & Événements", href: "/services/photo-evenements", icon: "fa-solid fa-ring" },
    { label: "Production Vidéo", href: "/services/production-video", icon: "fa-solid fa-video" },
    { label: "Photographie Produit", href: "/services/photo-produit", icon: "fa-solid fa-box" },
    { label: "Photographie Administrative", href: "/services/photo-administrative", icon: "fa-solid fa-id-card" },
    { label: "Retouche Photo", href: "/services/retouche-photo", icon: "fa-solid fa-wand-magic-sparkles" },
    { label: "Services Studio", href: "/services/services-studio", icon: "fa-solid fa-camera-retro" },
    { label: "Impression & Personnalisation", href: "/impression", icon: "fa-solid fa-print" },
  ];

  const drawerLinks = [
    { label: "Accueil", href: "/" },
    { label: service.parentLabel, href: service.parentPath },
    ...categories.filter(c => c.href !== service.parentPath).map(c => ({ label: "— " + c.label, href: c.href, indent: true })),
    { label: "Contact", href: "#contact" },
  ];



  const bullets = isPrint ? [
    { icon: "fa-solid fa-medal", label: "Qualité professionnelle" },
    { icon: "fa-solid fa-bolt", label: "Livraison rapide" },
    { icon: "fa-solid fa-wand-magic-sparkles", label: "Solutions sur mesure" },
  ] : [
    { icon: "fa-solid fa-medal", label: "Qualité professionnelle" },
    { icon: "fa-solid fa-palette", label: "Direction artistique" },
    { icon: "fa-solid fa-bolt", label: "Livraison rapide" },
  ];

  return (
    <>
      <RevealObserver />
      <Topbar hours={isPrint ? undefined : "Sur rendez-vous, 7j/7"} settings={settings} />
      <Header searchCategories={categories} onMenuToggle={() => setDrawer(true)} searchPlaceholder={isPrint ? "Rechercher un service…" : "Rechercher une séance…"} settings={settings} />
      <MobileSearch placeholder={isPrint ? "Rechercher un service…" : "Rechercher une séance…"} />
      <CategoryNav navLinks={navLinks} categories={categories} settings={settings} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} links={drawerLinks} ctaLabel={isPrint ? "Demander un devis" : "Réserver une séance"} settings={settings} />

      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Fil d'Ariane">
        <div className="container">
          <Link href="/">Accueil</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <Link href={service.parentPath}>{service.parentLabel}</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span className="current">{service.tag}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="phero">
        <div className="container">
          <div>
            <span className="phero-tag"><i className={service.tagIcon}></i> {service.tag}</span>
            <h1>
              {service.heroTitle}<br />
              {service.heroTitleItalic && <span>{service.heroTitleItalic}</span>}
            </h1>
            {service.heroSubtitle && service.heroSubtitle.length > 20 && (
              <p className="phero-sub">{service.heroSubtitle}</p>
            )}
            <div className="phero-cta">
              <a href="#contact" className="btn btn-accent">
                {isPrint ? "Demander un devis" : "Réserver une séance"} <i className="fa-solid fa-arrow-right btn-arrow"></i>
              </a>
              <Link href={service.parentPath} className="btn btn-outline">Tous les services</Link>
            </div>
            <div className="phero-bullets">
              {bullets.map(b => (
                <span key={b.label} className="phero-bullet"><i className={b.icon}></i> {b.label}</span>
              ))}
            </div>
          </div>
          <div className="phero-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={service.heroImage} alt={service.tag} loading="eager" />
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="art-body">
        <div className="art-wrap">
          {article.blocks.map((b, i) => <ArtBlock key={i} block={b} />)}

          {article.faqs.length > 0 && (
            <>
              <h2>Questions fréquentes</h2>
              <div className="art-faq">
                {article.faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Related */}
      <section className="related">
        <div className="container">
          <div className="shead reveal">
            <small>Découvrir</small>
            <h2>Services <span>associés</span></h2>
          </div>
          <div className="related-grid">
            {article.related.map(r => (
              <Link key={r.slug} href={`/services/${r.slug}`} className="rel-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt={r.title} loading="lazy" />
                <div className="rel-info">
                  <small>{isPrint ? "Impression" : "Photographie"}</small>
                  <h3>{r.title}</h3>
                  <span>Découvrir <i className="fa-solid fa-arrow-right"></i></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="ctab">
        <div className="container">
          <div>
            <small>Passez à l&apos;action</small>
            <h2>{article.ctaTitle}</h2>
            <p>{article.ctaSubtitle}</p>
          </div>
          <div className="ctab-actions">
            <a href="#contact" className="btn btn-gold">
              {isPrint ? "Demander un devis" : "Réserver une séance"} <i className="fa-solid fa-arrow-right btn-arrow"></i>
            </a>
            <Link href={service.parentPath} className="btn btn-glight">Tous les services</Link>
          </div>
        </div>
      </section>

      <ContactSection variant={isPrint ? "printing" : "photography"} contact={contact} settings={settings} />
      <Newsletter />
      <Footer settings={settings} />
      <WhatsAppFloat settings={settings} />
    </>
  );
}

function ArtBlock({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2": return <h2>{block.text}</h2>;
    case "h3": return <h3>{block.text}</h3>;
    case "p": return <p dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "ul": return <ul>{block.items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}</ul>;
    case "ol": return <ol>{block.items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}</ol>;
    case "highlight": return <div className="art-highlight"><p dangerouslySetInnerHTML={{ __html: block.html }} /></div>;
    case "image": return (
      <figure className="art-img-fig">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.src} alt={block.alt} loading="lazy" />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
    case "specs": return (
      <div className="art-specs">
        {block.items.map((s, i) => (
          <div key={i} className="art-spec">
            <i className={s.icon}></i>
            <h4>{s.title}</h4>
            <p>{s.value}</p>
          </div>
        ))}
      </div>
    );
  }
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`art-faq-item${open ? " open" : ""}`}>
      <div
        className="art-faq-q"
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(o => !o); } }}
      >
        {q} <i className="fa-solid fa-plus"></i>
      </div>
      <div className="art-faq-a" dangerouslySetInnerHTML={{ __html: a }} />
    </div>
  );
}
